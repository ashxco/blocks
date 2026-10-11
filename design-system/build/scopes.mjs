/**
 * Variables, scopes and the reference graph.
 *
 * How scopes nest. Custom properties inherit computed values, so a scope has
 * to re-declare every variable that depends on what it changes:
 *
 * - Mode. Semantic colours are written once, for both modes, with two switch
 *   variables: var(--bk-on-light, <light>) var(--bk-on-dark, <dark>). In a
 *   light scope --bk-on-light is unset (its fallback, the light value, wins)
 *   and --bk-on-dark is empty (its fallback is dropped); .dark flips them.
 *   .dark and .light set the switches and re-evaluate everything that reads
 *   them, so the mode always comes from the nearest .dark or .light.
 * - Theme. [data-theme] resets every theme input (anything a theme overrides)
 *   to the default theme, [data-theme="<id>"] applies the theme's own values,
 *   and every variable that depends on an input is re-evaluated in the scope.
 *   A semantic colour a theme overrides reads per-mode sources
 *   (--brand--light, --brand--dark) that the theme scope sets, so a .dark or
 *   .light scope inside it still gets that theme's values.
 *
 * Both sets of re-declarations come from the reference graph, so any theme
 * inside any mode inside any theme resolves like the nearest of each.
 */
import { MODES, isReference, refName } from "./load.mjs"
import { responsiveVars, typeVars } from "./breakpoints.mjs"
import { all, byPath, cssExpr, cssValue, darkByPath } from "./tokens.mjs"
import { resolved, themes } from "./themes.mjs"

export const ON_LIGHT = "--bk-on-light"
export const ON_DARK = "--bk-on-dark"
const sourceVar = (cssVar, mode) => `${cssVar}--${mode}`

/** Semantic colours some theme sets directly: they read per-mode sources. */
const semanticOverridden = new Set(
  themes.flatMap((t) => [...t.overrides.light, ...t.overrides.dark])
)

function semanticDecls(t) {
  const v = t.meta.cssVar
  const name = t.path.join(".")
  const light = cssExpr(t, `light ${name}`)
  const dark = cssExpr(darkByPath.get(name), `dark ${name}`)
  if (semanticOverridden.has(name)) {
    return {
      sources: [
        [sourceVar(v, "light"), light],
        [sourceVar(v, "dark"), dark],
      ],
      value: [
        v,
        `var(${ON_LIGHT}, var(${sourceVar(v, "light")})) var(${ON_DARK}, var(${sourceVar(v, "dark")}))`,
      ],
    }
  }
  return {
    sources: [],
    value: [
      v,
      light === dark
        ? light
        : `var(${ON_LIGHT}, ${light}) var(${ON_DARK}, ${dark})`,
    ],
  }
}

// Declarations in the order they are written, by where they live.
export const themeLines = [] // @theme static
export const rootDecls = {
  primitive: [],
  semantic: [],
  sources: [],
  layout: [],
  component: [],
}

/** Variables Tailwind or Blocks define in terms of tokens: part of the graph so themes re-evaluate them. */
export const systemAliases = [
  ["--default-font-family", "var(--font-sans)"],
  ["--default-mono-font-family", "var(--font-mono)"],
]

for (const t of all) {
  const { cssVar, scope, tier } = t.meta
  if (tier === "typography") {
    for (const [prop, v] of typeVars(t))
      themeLines.push([v, String(t.$value[prop])])
  } else if (scope === "theme") themeLines.push([cssVar, cssValue(t)])
  else if (scope === "mode") {
    const { sources, value } = semanticDecls(t)
    rootDecls.sources.push(...sources)
    rootDecls.semantic.push(value)
  } else
    rootDecls[
      tier === "primitive" || tier === "component" ? tier : "layout"
    ].push([cssVar, cssValue(t)])
}

/** Every declaration at the root, by variable: the graph's nodes. */
export const rootExpr = new Map([
  ...themeLines,
  ...systemAliases,
  ...rootDecls.primitive,
  ...rootDecls.sources,
  ...rootDecls.semantic,
  ...rootDecls.layout,
  ...rootDecls.component,
])

const dependents = new Map()
for (const [v, expr] of rootExpr) {
  for (const [, ref] of String(expr).matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (!dependents.has(ref)) dependents.set(ref, new Set())
    dependents.get(ref).add(v)
  }
}

/** Every variable that reads one of `vars`, directly or through others, minus `vars` themselves. */
function closure(vars) {
  const seen = new Set()
  const queue = [...vars]
  while (queue.length) {
    for (const d of dependents.get(queue.pop()) ?? []) {
      if (!seen.has(d)) {
        seen.add(d)
        queue.push(d)
      }
    }
  }
  for (const v of vars) seen.delete(v)
  return seen
}

/** In source order, so the generated CSS reads like the root block. */
export const ordered = (vars) => {
  const set = new Set(vars)
  return [...rootExpr.keys()].filter((v) => set.has(v))
}

/** What a theme writes into its scope, by variable. */
function themeDecls(theme) {
  const decls = new Map()
  const light = resolved[theme.id].light
  for (const name of theme.overrides.shared) {
    const base = byPath.get(name)
    const t = light.get(name)
    if (base.meta.tier === "typography") {
      const letterSpacing = t.original.$value.letterSpacing
      decls.set(
        `${base.meta.cssVar}--letter-spacing`,
        String(
          isReference(letterSpacing)
            ? byPath.get(refName(letterSpacing)).$value
            : t.$value.letterSpacing
        )
      )
    } else {
      decls.set(base.meta.cssVar, cssExpr(t, `${theme.id}: ${name}`))
    }
  }
  for (const mode of MODES) {
    for (const name of theme.overrides[mode]) {
      decls.set(
        sourceVar(byPath.get(name).meta.cssVar, mode),
        cssExpr(
          resolved[theme.id][mode].get(name),
          `${theme.id}: ${mode}.${name}`
        )
      )
    }
  }
  return decls
}

export const themeDeclsById = new Map(themes.map((t) => [t.id, themeDecls(t)]))

/** Theme inputs: every variable some theme sets. A theme scope resets them all to the default first. */
export const themeInputs = new Set(
  themes.flatMap((t) => [...themeDeclsById.get(t.id).keys()])
)
for (const v of themeInputs)
  if (!rootExpr.has(v)) throw new Error(`Theme input ${v} has no default`)
export const themeDependents = closure(themeInputs)
export const modeDependents = closure([ON_LIGHT, ON_DARK])

// A variable with breakpoint values is set by @media on :root only. If a
// scope re-declared it, the scope would lose the breakpoint value.
for (const v of Object.keys(responsiveVars.base)) {
  if (themeInputs.has(v) || themeDependents.has(v) || modeDependents.has(v)) {
    throw new Error(
      `${v} has breakpoint values and depends on the theme or mode; scopes would lose its breakpoint values`
    )
  }
}
