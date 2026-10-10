/**
 * Blocks design tokens build.
 *
 * Source of truth: design-system/tokens/*.tokens.json (W3C DTCG format) for
 * the default theme, and design-system/themes/<id>.tokens.json for the theme
 * presets. Style Dictionary parses the files and resolves references; this
 * script writes three outputs:
 *
 *   app/styles/tokens.css             Tailwind v4 @theme, :root, mode and theme scopes
 *   design-system/generated/tokens.ts Typed token and theme list for the viewer
 *   design-system/generated/themes.json Every semantic colour resolved per theme
 *                                       and mode, for scripts/check-contrast.mjs
 *
 * Run with `npm run tokens`. Never edit the generated files by hand.
 *
 * Themes. A theme file holds only what it changes from the default theme:
 *
 *   theme.accent.* / theme.neutral.*   the alias scales semantic colours read
 *   radius.*                           the radius scale
 *   component.*                        component tokens, e.g. component.button.radius
 *   font.family.*                      font stacks (with $extensions.blocks.name)
 *   type.<role>                        letterSpacing only: { "$value": { "letterSpacing": "-0.03em" } }
 *   light.color.* / dark.color.*       individual semantic colours in one mode
 *
 * plus its name, order and modes in $extensions.blocks.theme. The blocks theme
 * file holds only that metadata.
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
 *
 * Breakpoint values. A token can change from a system breakpoint up (sm, md,
 * lg, xl, 2xl: the layout tokens' breakpoint group). Its $value is the base
 * (phones), and $extensions.blocks.breakpoints lists the overrides, mobile
 * first:
 *
 *   "control": {
 *     "$value": { "fontSize": "1rem", "lineHeight": "1.6", … },
 *     "$extensions": { "blocks": { "breakpoints": {
 *       "md": { "fontSize": "0.875rem", "lineHeight": "1.45" }
 *     } } }
 *   }
 *
 * A plain token takes a plain value per breakpoint ("md": "3.5rem", or a
 * reference such as "md": "{radius.lg}"). A typography token takes the
 * properties that change (fontSize, lineHeight, letterSpacing, and fontWeight
 * for roles that set a weight); the rest carry over from the base and any
 * smaller breakpoint. The base is written where the token always lives, and
 * the overrides inside `@media (width >= <breakpoint>)` blocks after it.
 * Semantic colours cannot have breakpoint values: a colour role never changes
 * with the viewport, and a theme cannot change a value that has breakpoint
 * values. tokens.ts lists each token's value per breakpoint (`breakpoints`)
 * and the CSS variables involved (`responsiveVars`), so device previews in
 * the viewer can apply them for the previewed width.
 *
 * Alpha. A colour can be another colour at reduced opacity:
 * "$value": "{theme.neutral.950}", "$extensions": { "blocks": { "alpha": 0.2 } }
 * compiles to color-mix(in oklab, var(--bk-neutral-950) 20%, transparent), so
 * it follows the theme's scale.
 */
import StyleDictionary from "style-dictionary"
import { createHash } from "node:crypto"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tokensDir = "design-system/tokens"
const themesDir = "design-system/themes"
const files = {
  primitives: `${tokensDir}/primitives.tokens.json`,
  light: `${tokensDir}/semantic.light.tokens.json`,
  dark: `${tokensDir}/semantic.dark.tokens.json`,
  typography: `${tokensDir}/typography.tokens.json`,
  layout: `${tokensDir}/layout.tokens.json`,
  components: `${tokensDir}/components.tokens.json`,
}
const DEFAULT_THEME = "blocks"
const MODES = ["light", "dark"]

const sdOptions = {
  usesDtcg: true,
  log: { verbosity: "silent", warnings: "disabled" },
  platforms: { blocks: { transforms: ["name/kebab"] } },
}

async function load(sources) {
  const sd = new StyleDictionary({ ...sdOptions, source: sources.map((f) => path.join(root, f)) })
  const { allTokens } = await sd.getPlatformTokens("blocks")
  return allTokens
}

/** Resolves an in-memory token tree (the default sources merged with a theme). */
async function loadTree(tokens) {
  const sd = new StyleDictionary({ ...sdOptions, tokens })
  const { allTokens } = await sd.getPlatformTokens("blocks")
  return new Map(allTokens.map((t) => [t.path.join("."), t]))
}

const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"))
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v)
const isReference = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v)

/** Deep merge for token trees: objects merge (including typography $values), everything else is replaced. */
function merge(target, ...sources) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      target[key] = isObject(value) && isObject(target[key]) ? merge({ ...target[key] }, value) : structuredClone(value)
    }
  }
  return target
}

/** Every token in a DTCG tree: [path, token]. */
function* tokenEntries(tree, prefix = []) {
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith("$") || !isObject(value)) continue
    if ("$value" in value) yield [[...prefix, key], value]
    else yield* tokenEntries(value, [...prefix, key])
  }
}

const fileKey = (t) =>
  Object.entries(files).find(([, f]) => t.filePath.endsWith(f.split("/").pop()))?.[0]

/** Where a token lives and what it is called in CSS. */
function describe(t) {
  const p = t.path
  const key = fileKey(t)
  const join = (parts) => parts.filter((x) => x !== "DEFAULT").join("-")
  switch (key) {
    case "primitives":
      // color.* are the fixed scales; theme.accent and theme.neutral the alias scales themes re-point.
      if (p[0] === "color" || p[0] === "theme") return { tier: "primitive", group: p[1], cssVar: `--bk-${join(p.slice(1))}`, scope: "root" }
      if (p[1] === "family") return { tier: "primitive", group: "font-family", cssVar: `--font-${p[2]}`, scope: "theme", utility: `font-${p[2]}` }
      if (p[1] === "weight") {
        const name = p[2] === "regular" ? "normal" : p[2]
        return { tier: "primitive", group: "font-weight", cssVar: `--font-weight-${name}`, scope: "theme", utility: `font-${name}` }
      }
      break
    case "light":
    case "dark": {
      const name = join(p.slice(1))
      return { tier: "semantic", group: semanticGroup(p[1]), cssVar: `--${name}`, scope: "mode", utility: semanticUtility(name) }
    }
    case "typography":
      return { tier: "typography", group: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"].includes(p[1]) ? "scale" : "roles", cssVar: `--text-${p[1]}`, scope: "theme", utility: `text-${p[1]}` }
    case "layout": {
      const [head, ...rest] = p
      if (head === "spacing") return { tier: "layout", group: "spacing", cssVar: "--spacing", scope: "theme", utility: "p-4 = 4 × spacing" }
      if (head === "space") {
        // Each named space has one intended axis.
        const axis = { gutter: "px", section: "py", "section-sm": "py", stack: "gap" }[join(rest)] ?? "p"
        return { tier: "layout", group: "spacing", cssVar: `--spacing-${join(rest)}`, scope: "theme", utility: `${axis}-${join(rest)}` }
      }
      if (head === "radius") return { tier: "layout", group: "radius", cssVar: `--radius-${join(rest)}`, scope: "theme", utility: `rounded-${join(rest)}` }
      if (head === "container") {
        // max-w-prose is Tailwind's fixed 65ch, so the prose width is read through its variable.
        const utility = join(rest) === "prose" ? "max-w-(--container-prose) · @prose:" : `max-w-${join(rest)} · @${join(rest)}:`
        return { tier: "layout", group: "container", cssVar: `--container-${join(rest)}`, scope: "theme", utility }
      }
      if (head === "breakpoint") return { tier: "layout", group: "breakpoint", cssVar: `--breakpoint-${join(rest)}`, scope: "theme", utility: `${join(rest)}:` }
      if (head === "motion" && rest[0] === "ease") return { tier: "layout", group: "easing", cssVar: `--ease-${join(rest.slice(1))}`, scope: "theme", utility: `ease-${join(rest.slice(1))}` }
      if (head === "motion") return { tier: "layout", group: "duration", cssVar: `--duration-${join(rest.slice(1))}`, scope: "root", utility: `duration-(--duration-${join(rest.slice(1))})` }
      if (head === "blur") return { tier: "layout", group: "blur", cssVar: `--blur-${join(rest)}`, scope: "theme", utility: `backdrop-blur-${join(rest)}` }
      if (head === "border") return { tier: "layout", group: "border-width", cssVar: `--border-width-${join(rest)}`, scope: "root", utility: join(rest) === "hairline" ? "border" : `border-(length:--border-width-${join(rest)})` }
      if (head === "focus") return { tier: "layout", group: "focus", cssVar: `--focus-${join(rest)}`, scope: "root", utility: "focus-visible:focus-ring" }
      if (head === "z") return { tier: "layout", group: "z-index", cssVar: `--z-${join(rest)}`, scope: "root", utility: `z-(--z-${join(rest)})` }
      return { tier: "layout", group: head, cssVar: `--${join(p)}`, scope: "root" }
    }
    case "components": {
      const name = join(p.slice(1))
      const prop = p.slice(2).join("-")
      // A token can name the utility its components write, e.g. "max-w" for
      // dialog and sheet widths, which are caps so they shrink on phones.
      // utilityClass names the whole utility instead, for tokens a custom
      // utility or an arbitrary property reads (link-underline).
      const hint = t.$extensions?.blocks?.utility ?? t.original?.$extensions?.blocks?.utility
      const utilityClass = t.$extensions?.blocks?.utilityClass ?? t.original?.$extensions?.blocks?.utilityClass
      const prefix = hint ?? (/radius/.test(prop) ? "rounded" : /padding-x/.test(prop) ? "px" : /padding/.test(prop) ? "p" : /min-width/.test(prop) ? "min-w" : /max-width/.test(prop) ? "max-w" : /width/.test(prop) ? "w" : /size/.test(prop) ? "size" : "h")
      return { tier: "component", group: p[1], cssVar: `--${name}`, scope: "root", utility: utilityClass ?? `${prefix}-(--${name})` }
    }
  }
  throw new Error(`No naming rule for token ${p.join(".")} in ${t.filePath}`)
}

/** The utilities a semantic colour is meant for, e.g. text-copy or border-input. */
function semanticUtility(name) {
  if (name === "copy" || name.endsWith("foreground") || name === "panel-muted") return `text-${name}`
  if (["border", "border-strong", "input", "popover-border", "panel-border", "sidebar-border"].includes(name)) return `border-${name}`
  if (name === "ring" || name === "sidebar-ring") return `outline-${name} · focus-visible:focus-ring`
  if (name.startsWith("chart-")) return `fill-${name} · stroke-${name} · var(--${name})`
  if (/^(panel-)?(brand|destructive|success|warning|info)$/.test(name)) return `text-${name} · bg-${name}`
  return `bg-${name}`
}

function semanticGroup(head) {
  if (["background", "foreground", "copy", "muted-foreground", "subtle", "card", "card-foreground", "popover", "popover-foreground"].includes(head)) return "surface & text"
  if (["primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "accent", "accent-foreground"].includes(head)) return "interactive"
  if (head.startsWith("brand")) return "brand"
  if (/^(destructive|success|warning|info)/.test(head)) return "status"
  if (["border", "border-strong", "input", "popover-border", "ring", "overlay"].includes(head)) return "lines & focus"
  if (head.startsWith("panel") || head.startsWith("terminal")) return "panel"
  return head
}

const primitivesAndShared = [files.primitives, files.typography, files.layout, files.components]
const lightTokens = await load([...primitivesAndShared, files.light])
const darkTokens = await load([...primitivesAndShared, files.dark])

const byPath = new Map()
for (const t of lightTokens) byPath.set(t.path.join("."), { ...t, meta: describe(t) })
const darkByPath = new Map(darkTokens.map((t) => [t.path.join("."), t]))
const all = [...byPath.values()]

/* -------------------------------------------------------------------------- */
/* Values                                                                      */
/* -------------------------------------------------------------------------- */

const alphaOf = (t) => t.original?.$extensions?.blocks?.alpha ?? t.$extensions?.blocks?.alpha
const round = (n) => Number(n.toFixed(4))

for (const t of [...lightTokens, ...darkTokens]) {
  const a = alphaOf(t)
  if (a !== undefined && (typeof a !== "number" || a < 0 || a > 1)) throw new Error(`${t.path.join(".")}: $extensions.blocks.alpha must be a number from 0 to 1`)
}

function formatValue(type, value) {
  if (type === "fontFamily") return (Array.isArray(value) ? value : [value]).join(", ")
  if (type === "cubicBezier") return `cubic-bezier(${value.join(", ")})`
  return String(value)
}

function cssVarOf(ref, where) {
  const target = byPath.get(ref)
  if (!target) throw new Error(`Unresolved reference {${ref}} in ${where}`)
  if (alphaOf(target) !== undefined) throw new Error(`${where} references {${ref}}, which sets an alpha. Reference the colour it is made from instead.`)
  return target.meta.cssVar
}

/**
 * CSS expression for a token value: references stay as var() so modes and
 * themes cascade; an alpha wraps the colour in color-mix().
 */
function cssExpr(type, original, resolved, alpha, where) {
  const base = isReference(original) ? `var(${cssVarOf(original.slice(1, -1), where)})` : formatValue(type, resolved)
  return alpha === undefined ? base : `color-mix(in oklab, ${base} ${round(alpha * 100)}%, transparent)`
}

const cssValue = (t) => cssExpr(t.$type, t.original.$value, t.$value, alphaOf(t), t.path.join("."))

/** A resolved colour with an alpha applied: oklch(L C H / a). */
function withAlpha(value, alpha) {
  if (alpha === undefined) return value
  const m = /^oklch\(([^/)]+?)(?:\s*\/\s*([\d.]+))?\)$/.exec(String(value).trim())
  if (!m) throw new Error(`Cannot apply alpha to ${value}: write the colour as oklch()`)
  return `oklch(${m[1].trim()} / ${round(alpha * (m[2] === undefined ? 1 : Number(m[2])))})`
}

/** The value a token resolves to, with its alpha applied. */
const resolvedValue = (t) => (t.$type === "color" ? withAlpha(t.$value, alphaOf(t)) : t.$value)

/* -------------------------------------------------------------------------- */
/* Breakpoint values                                                           */
/* -------------------------------------------------------------------------- */

const ROOT_PX = 16
function toPx(value) {
  const v = String(value).trim()
  if (v.endsWith("rem")) return Number.parseFloat(v) * ROOT_PX
  if (v.endsWith("px")) return Number.parseFloat(v)
  throw new Error(`Breakpoint ${v} must be in rem or px`)
}

/** System breakpoints, smallest first: { name: "md", min: "48rem" }. */
const breakpoints = all
  .filter((t) => t.meta.group === "breakpoint")
  .map((t) => ({ name: t.path.slice(1).join("-"), min: String(t.$value) }))
  .sort((a, b) => toPx(a.min) - toPx(b.min))
const breakpointNames = breakpoints.map((b) => b.name)

/** The CSS variables a typography token writes, with the property each one carries. */
function typeVars(t) {
  const { cssVar } = t.meta
  const vars = [
    ["fontSize", cssVar],
    ["lineHeight", `${cssVar}--line-height`],
    ["letterSpacing", `${cssVar}--letter-spacing`],
  ]
  if (t.meta.group === "roles" && Number(t.$value.fontWeight) >= 600) vars.push(["fontWeight", `${cssVar}--font-weight`])
  return vars
}

function referenced(t, v) {
  const target = byPath.get(v.slice(1, -1))
  if (!target) throw new Error(`Unresolved reference ${v} in the breakpoint values of ${t.path.join(".")}`)
  return target
}

const declaredBreakpoints = (t) => t.original?.$extensions?.blocks?.breakpoints ?? t.$extensions?.blocks?.breakpoints

/**
 * A token's breakpoint values, validated: [{ name, min, css: [[var, value]], value }]
 * smallest first, where css holds the declarations that breakpoint overrides and
 * value is the token's full value from that breakpoint up.
 */
function breakpointValues(t) {
  const declared = declaredBreakpoints(t)
  if (!declared) return []
  const name = t.path.join(".")
  if (t.meta.scope === "mode") throw new Error(`${name}: semantic colours cannot have breakpoint values`)
  for (const key of Object.keys(declared)) {
    if (!breakpointNames.includes(key)) throw new Error(`${name}: unknown breakpoint "${key}". Use ${breakpointNames.join(", ")}.`)
  }
  let current = t.$value
  return breakpoints
    .filter((b) => declared[b.name] !== undefined)
    .map((b) => {
      const override = declared[b.name]
      if (t.meta.tier === "typography") {
        if (!override || typeof override !== "object") throw new Error(`${name}.${b.name}: give the typography properties that change`)
        const vars = new Map(typeVars(t))
        const css = []
        const next = { ...current }
        for (const [prop, raw] of Object.entries(override)) {
          if (!vars.has(prop)) throw new Error(`${name}.${b.name}: ${prop} cannot change at a breakpoint. Use ${[...vars.keys()].join(", ")}.`)
          const value = isReference(raw) ? referenced(t, raw).$value : raw
          next[prop] = value
          css.push([vars.get(prop), String(value)])
        }
        current = next
        return { ...b, css, value: current }
      }
      if (override === null || typeof override === "object") throw new Error(`${name}.${b.name}: give a single value`)
      const target = isReference(override) ? referenced(t, override) : null
      current = target ? target.$value : override
      return { ...b, css: [[t.meta.cssVar, target ? `var(${target.meta.cssVar})` : formatValue(t.$type, override)]], value: current }
    })
}

for (const t of darkTokens) {
  if (t.original?.$extensions?.blocks?.breakpoints && fileKey(t) === "dark") {
    throw new Error(`${t.path.join(".")}: semantic colours cannot have breakpoint values`)
  }
}

const responsive = all.map((t) => ({ t, steps: breakpointValues(t) })).filter((r) => r.steps.length > 0)
const breakpointsByToken = new Map(responsive.map(({ t, steps }) => [t.path.join("."), steps]))

/** Every variable a breakpoint overrides, at its base value, and the overrides per breakpoint. */
const responsiveVars = {
  base: Object.fromEntries(
    responsive.flatMap(({ t, steps }) => {
      const touched = new Set(steps.flatMap((s) => s.css.map(([v]) => v)))
      if (t.meta.tier === "typography") return typeVars(t).filter(([, v]) => touched.has(v)).map(([prop, v]) => [v, String(t.$value[prop])])
      return [[t.meta.cssVar, cssValue(t)]]
    })
  ),
  breakpoints: breakpoints
    .map((b) => ({
      ...b,
      vars: Object.fromEntries(responsive.flatMap(({ steps }) => steps.find((s) => s.name === b.name)?.css ?? [])),
    }))
    .filter((b) => Object.keys(b.vars).length > 0),
}

/* -------------------------------------------------------------------------- */
/* Themes                                                                      */
/* -------------------------------------------------------------------------- */

const semanticJson = { light: await readJson(files.light), dark: await readJson(files.dark) }
const sharedJson = merge(
  {},
  await readJson(files.primitives),
  await readJson(files.typography),
  await readJson(files.layout),
  await readJson(files.components)
)

const THEME_KEYS = new Set(["theme", "radius", "component", "font", "type", "light", "dark"])

/** Reads and validates a theme file: its metadata, shared overrides and per-mode semantic overrides. */
function parseTheme(id, json) {
  const where = `${themesDir}/${id}.tokens.json`
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`${where}: theme ids are lowercase letters, digits and dashes`)
  const info = json.$extensions?.blocks?.theme
  if (!info?.name) throw new Error(`${where}: give the theme a name in $extensions.blocks.theme.name`)
  const modes = info.modes ?? MODES
  if (!Array.isArray(modes) || modes.length === 0 || modes.some((m) => !MODES.includes(m))) throw new Error(`${where}: modes must list "light" and/or "dark"`)
  for (const key of Object.keys(json)) {
    if (!key.startsWith("$") && !THEME_KEYS.has(key)) throw new Error(`${where}: "${key}" cannot be themed. A theme can set ${[...THEME_KEYS].join(", ")}.`)
  }

  const shared = Object.fromEntries(Object.entries(json).filter(([k]) => ["theme", "radius", "component", "font", "type"].includes(k)))
  for (const [p, token] of tokenEntries(shared)) {
    const name = p.join(".")
    const base = byPath.get(name)
    const allowed =
      (p[0] === "theme" && ["accent", "neutral"].includes(p[1])) ||
      p[0] === "radius" ||
      p[0] === "component" ||
      (p[0] === "font" && p[1] === "family") ||
      p[0] === "type"
    if (!allowed) throw new Error(`${where}: ${name} cannot be themed. Themes change the accent and neutral scales, radii, component tokens, font families, type tracking and semantic colours.`)
    if (!base) throw new Error(`${where}: ${name} is not a token. Themes only change existing tokens.`)
    if (p[0] === "font" && !token.$extensions?.blocks?.name) throw new Error(`${where}: ${name} needs the font's name in $extensions.blocks.name`)
    if (p[0] === "type") {
      if (!isObject(token.$value) || Object.keys(token.$value).some((k) => k !== "letterSpacing")) throw new Error(`${where}: ${name} can only change letterSpacing`)
      if (Object.values(declaredBreakpoints(base) ?? {}).some((o) => o && "letterSpacing" in o)) throw new Error(`${where}: ${name}'s letterSpacing has breakpoint values, so a theme cannot change it`)
    } else if (declaredBreakpoints(base)) {
      throw new Error(`${where}: ${name} has breakpoint values, so a theme cannot change it`)
    }
  }

  const perMode = {}
  for (const mode of MODES) {
    perMode[mode] = json[mode] ?? {}
    for (const key of Object.keys(perMode[mode])) {
      if (key !== "color") throw new Error(`${where}: ${mode}.${key}: a theme's ${mode} values are semantic colours, under ${mode}.color`)
    }
    for (const [p] of tokenEntries(perMode[mode])) {
      const target = byPath.get(p.join("."))
      if (target?.meta.tier !== "semantic") throw new Error(`${where}: ${mode}.${p.join(".")} is not a semantic colour`)
    }
  }

  return {
    id,
    name: info.name,
    order: info.order ?? 99,
    description: json.$description ?? "",
    modes,
    shared,
    perMode,
    overrides: {
      shared: [...tokenEntries(shared)].map(([p]) => p.join(".")),
      light: [...tokenEntries(perMode.light)].map(([p]) => p.join(".")),
      dark: [...tokenEntries(perMode.dark)].map(([p]) => p.join(".")),
    },
  }
}

const themeFiles = (await readdir(path.join(root, themesDir))).filter((f) => f.endsWith(".tokens.json")).sort()
const themes = []
for (const file of themeFiles) themes.push(parseTheme(file.replace(/\.tokens\.json$/, ""), await readJson(`${themesDir}/${file}`)))
themes.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
const defaultTheme = themes.find((t) => t.id === DEFAULT_THEME)
if (!defaultTheme) throw new Error(`${themesDir}/${DEFAULT_THEME}.tokens.json is missing: it names the default theme`)
if (defaultTheme.overrides.shared.length + defaultTheme.overrides.light.length + defaultTheme.overrides.dark.length > 0) {
  throw new Error(`${themesDir}/${DEFAULT_THEME}.tokens.json overrides tokens. The default theme is design-system/tokens; its theme file only holds metadata.`)
}

/** Every token resolved per theme and mode: resolved[id][mode] = Map(path → token). */
const resolved = {}
for (const theme of themes) {
  resolved[theme.id] = {}
  for (const mode of MODES) {
    resolved[theme.id][mode] = await loadTree(merge({}, sharedJson, semanticJson[mode], theme.shared, theme.perMode[mode]))
  }
}

/* -------------------------------------------------------------------------- */
/* Variables, scopes and the reference graph                                   */
/* -------------------------------------------------------------------------- */

const ON_LIGHT = "--bk-on-light"
const ON_DARK = "--bk-on-dark"
const sourceVar = (cssVar, mode) => `${cssVar}--${mode}`

/** Semantic colours some theme sets directly: they read per-mode sources. */
const semanticOverridden = new Set(themes.flatMap((t) => [...t.overrides.light, ...t.overrides.dark]))

const semanticExpr = (t, mode) => {
  const source = mode === "light" ? t : darkByPath.get(t.path.join("."))
  return cssExpr(source.$type, source.original.$value, source.$value, alphaOf(source), `${mode} ${t.path.join(".")}`)
}

function semanticDecls(t) {
  const v = t.meta.cssVar
  if (semanticOverridden.has(t.path.join("."))) {
    return {
      sources: [
        [sourceVar(v, "light"), semanticExpr(t, "light")],
        [sourceVar(v, "dark"), semanticExpr(t, "dark")],
      ],
      value: [v, `var(${ON_LIGHT}, var(${sourceVar(v, "light")})) var(${ON_DARK}, var(${sourceVar(v, "dark")}))`],
    }
  }
  const light = semanticExpr(t, "light")
  const dark = semanticExpr(t, "dark")
  return { sources: [], value: [v, light === dark ? light : `var(${ON_LIGHT}, ${light}) var(${ON_DARK}, ${dark})`] }
}

// Declarations in the order they are written, by where they live.
const themeLines = [] // @theme static
const rootDecls = { primitive: [], semantic: [], sources: [], layout: [], component: [] }

/** Variables Tailwind or Blocks define in terms of tokens: part of the graph so themes re-evaluate them. */
const systemAliases = [
  ["--font-heading", "var(--font-sans)"],
  ["--default-font-family", "var(--font-sans)"],
  ["--default-mono-font-family", "var(--font-mono)"],
]

for (const t of all) {
  const { cssVar, scope, tier } = t.meta
  if (tier === "typography") {
    for (const [prop, v] of typeVars(t)) themeLines.push([v, String(t.$value[prop])])
    continue
  }
  if (scope === "theme") themeLines.push([cssVar, cssValue(t)])
  else if (scope === "mode") {
    const { sources, value } = semanticDecls(t)
    rootDecls.sources.push(...sources)
    rootDecls.semantic.push(value)
  } else rootDecls[tier === "primitive" ? "primitive" : tier === "component" ? "component" : "layout"].push([cssVar, cssValue(t)])
}

/** Every declaration at the root, by variable: the graph's nodes. */
const rootExpr = new Map([
  ...themeLines,
  ...systemAliases,
  ...rootDecls.primitive,
  ...rootDecls.sources,
  ...rootDecls.semantic,
  ...rootDecls.layout,
  ...rootDecls.component,
])

const refsOf = (expr) => [...String(expr).matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1])
const dependents = new Map()
for (const [v, expr] of rootExpr) {
  for (const ref of refsOf(expr)) {
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
const ordered = (set) => [...rootExpr.keys()].filter((v) => set.has(v))

/** What a theme writes into its scope, by variable. */
function themeDecls(theme) {
  const decls = new Map()
  for (const mode of MODES) {
    const tree = resolved[theme.id][mode]
    const names = mode === "light" ? theme.overrides.shared : []
    for (const name of names) {
      const base = byPath.get(name)
      const t = tree.get(name)
      if (base.meta.tier === "typography") {
        const letterSpacing = t.original.$value.letterSpacing
        decls.set(`${base.meta.cssVar}--letter-spacing`, String(isReference(letterSpacing) ? byPath.get(letterSpacing.slice(1, -1)).$value : t.$value.letterSpacing))
      } else {
        decls.set(base.meta.cssVar, cssExpr(base.$type, t.original.$value, t.$value, alphaOf(t), `${theme.id}: ${name}`))
      }
    }
    for (const name of theme.overrides[mode]) {
      const t = tree.get(name)
      decls.set(sourceVar(byPath.get(name).meta.cssVar, mode), cssExpr(t.$type, t.original.$value, t.$value, alphaOf(t), `${theme.id}: ${mode}.${name}`))
    }
  }
  return decls
}

const themeDeclsById = new Map(themes.map((t) => [t.id, themeDecls(t)]))

/** Theme inputs: every variable some theme sets. A theme scope resets them all to the default first. */
const themeInputs = new Set(themes.flatMap((t) => [...themeDeclsById.get(t.id).keys()]))
for (const v of themeInputs) if (!rootExpr.has(v)) throw new Error(`Theme input ${v} has no default`)
const themeDependents = closure(themeInputs)
const modeDependents = closure([ON_LIGHT, ON_DARK])

// A variable with breakpoint values is set by @media on :root only. If a
// scope re-declared it, the scope would lose the breakpoint value.
for (const v of Object.keys(responsiveVars.base)) {
  if (themeInputs.has(v) || themeDependents.has(v) || modeDependents.has(v)) {
    throw new Error(`${v} has breakpoint values and depends on the theme or mode; scopes would lose its breakpoint values`)
  }
}

/* -------------------------------------------------------------------------- */
/* CSS                                                                         */
/* -------------------------------------------------------------------------- */

const decl = ([v, value], indent = "  ") => `${indent}${v}: ${value};`
const declsOf = (vars, indent) => ordered(new Set(vars)).map((v) => decl([v, rootExpr.get(v)], indent)).join("\n")

const semanticColors = all.filter((t) => t.meta.tier === "semantic").map((t) => t.meta.cssVar)

const mediaBlocks = responsiveVars.breakpoints.map(
  (b) => `@media (width >= ${b.min}) {
  :root {
${Object.entries(b.vars).map(([v, value]) => `    ${v}: ${value};`).join("\n")}
  }
}`
)

const themeBlocks = themes
  .filter((t) => themeDeclsById.get(t.id).size > 0)
  .map((t) => {
    const decls = themeDeclsById.get(t.id)
    return `/* ${t.name}. ${t.description} */
[data-theme="${t.id}"] {
${ordered(new Set(decls.keys())).map((v) => decl([v, decls.get(v)])).join("\n")}
}`
  })

const css = `/*
 * GENERATED by design-system/build.mjs. Do not edit.
 * Change tokens in design-system/tokens/*.tokens.json or design-system/themes/*.tokens.json,
 * then run \`npm run tokens\`.
 */

/* Tailwind's default palette, shadows, fonts and scales are removed:
   only Blocks tokens produce utilities. */
@theme static {
  --color-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
  --text-shadow-*: initial;
  --font-*: initial;
  --text-*: initial;
  --radius-*: initial;
  --ease-*: initial;
  --blur-*: initial;
  --breakpoint-*: initial;
${systemAliases.map((d) => decl(d)).join("\n")}
  --default-transition-duration: var(--duration-fast);
  --default-transition-timing-function: var(--ease-standard);
${themeLines.map((d) => decl(d)).join("\n")}
}

/* Semantic colours become utilities (bg-brand, text-body, border-border…)
   that follow the active mode and theme. */
@theme inline {
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-white: var(--bk-neutral-0);
  --color-black: var(--bk-neutral-1000);
${semanticColors.map((v) => `  --color-${v.slice(2)}: var(${v});`).join("\n")}
}

:root {
  /* Primitives. --bk-accent-* and --bk-neutral-* are the theme's scales. */
${rootDecls.primitive.map((d) => decl(d)).join("\n")}

  /* Mode switches: var(${ON_LIGHT}, x) is x in light mode and nothing in
     dark mode; var(${ON_DARK}, x) the other way round. */
  ${ON_LIGHT}: initial;
  ${ON_DARK}: ;
${
  rootDecls.sources.length
    ? `
  /* Light and dark sources of the semantic colours a theme sets directly */
${rootDecls.sources.map((d) => decl(d)).join("\n")}
`
    : ""
}
  /* Semantic colours, light and dark */
${rootDecls.semantic.map((d) => decl(d)).join("\n")}

  /* Layout and motion */
${rootDecls.layout.map((d) => decl(d)).join("\n")}

  /* Component tokens */
${rootDecls.component.map((d) => decl(d)).join("\n")}
}

/* Modes. .dark and .light switch the mode of their subtree (.light wins
   inside .dark and the other way round); everything that reads the switches
   is evaluated again in the scope. */
.dark {
  color-scheme: dark;
  ${ON_LIGHT}: ;
  ${ON_DARK}: initial;
}

.light {
  color-scheme: light;
  ${ON_LIGHT}: initial;
  ${ON_DARK}: ;
}

.dark,
.light {
${declsOf(modeDependents)}
}

/* Themes. data-theme="<id>" scopes a theme to its subtree; no attribute means
   ${DEFAULT_THEME}. Every theme scope starts from the default theme… */
[data-theme] {
${declsOf(themeInputs)}
}

/* …takes its theme's values… */
${themeBlocks.join("\n\n")}

/* …and evaluates everything that depends on them again, in the subtree's mode. */
[data-theme] {
${declsOf(themeDependents)}
}
${
  mediaBlocks.length
    ? `
/* Breakpoint values ($extensions.blocks.breakpoints in the token sources):
   the base values above apply on phones, these from each breakpoint up. */
${mediaBlocks.join("\n\n")}
`
    : ""
}`

/* -------------------------------------------------------------------------- */
/* tokens.ts                                                                   */
/* -------------------------------------------------------------------------- */

const refOf = (t) => (isReference(t.original.$value) ? t.original.$value.slice(1, -1) : undefined)

/** The value of a token under a theme, shaped like DesignToken's value/ref/dark. */
function tokenValue(themeId, name) {
  const light = resolved[themeId].light.get(name)
  const dark = resolved[themeId].dark.get(name)
  const isMode = byPath.get(name).meta.scope === "mode"
  return {
    value: resolvedValue(light),
    ref: refOf(light),
    dark: isMode ? { value: resolvedValue(dark), ref: refOf(dark) } : undefined,
  }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const themedNames = new Set()
const themeValues = new Map()
for (const theme of themes) {
  const values = {}
  for (const name of byPath.keys()) {
    const v = tokenValue(theme.id, name)
    if (!same(v, tokenValue(DEFAULT_THEME, name))) {
      values[name] = JSON.parse(JSON.stringify(v))
      themedNames.add(name)
    }
  }
  themeValues.set(theme.id, values)
}

const list = all.map((t) => {
  const d = darkByPath.get(t.path.join("."))
  return {
    name: t.path.join("."),
    cssVar: t.meta.cssVar,
    tier: t.meta.tier,
    group: t.meta.group,
    type: t.$type,
    value: resolvedValue(t),
    ref: refOf(t),
    dark: t.meta.scope === "mode" ? { value: resolvedValue(d), ref: refOf(d) } : undefined,
    breakpoints: breakpointsByToken.has(t.path.join("."))
      ? Object.fromEntries(breakpointsByToken.get(t.path.join(".")).map((s) => [s.name, s.value]))
      : undefined,
    themed: themedNames.has(t.path.join(".")) || undefined,
    utility: t.meta.utility,
    description: t.$description,
  }
})

/** px for a rem or px length, for summaries. */
const px = (v) => {
  const s = String(v)
  if (s.endsWith("rem")) return Number.parseFloat(s) * ROOT_PX
  if (s.endsWith("px")) return Number.parseFloat(s)
  return Number.NaN
}
const radiusLabel = (v) => (px(v) >= 999 ? "pill" : `${round(px(v))}px`)

const themeList = themes.map((theme) => {
  const get = (name, mode = "light") => resolvedValue(resolved[theme.id][mode].get(name))
  const swatches = Object.fromEntries(
    MODES.map((mode) => [
      mode,
      {
        accent: get("color.brand", mode),
        neutral: get("color.muted-foreground", mode),
        background: get("color.background", mode),
        foreground: get("color.foreground", mode),
        panel: get("color.panel", mode),
      },
    ])
  )
  const radius = {
    button: get("component.button.radius"),
    control: get("component.control.radius"),
    card: get("component.card.radius"),
    panel: get("component.panel.radius"),
  }
  const buttons = px(radius.button) >= 999 ? "Pill buttons" : `${radiusLabel(radius.button)} buttons`
  const fontName = (name) => {
    const t = resolved[theme.id].light.get(name)
    return t.$extensions?.blocks?.name ?? t.original?.$extensions?.blocks?.name ?? String(t.$value[0])
  }
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    default: theme.id === DEFAULT_THEME,
    modes: theme.modes,
    swatches,
    radius: { ...radius, summary: `${buttons}, ${radiusLabel(radius.control)} controls, ${radiusLabel(radius.card)} cards` },
    fonts: { sans: fontName("font.family.sans"), mono: fontName("font.family.mono") },
    overrides: [...new Set([...theme.overrides.shared, ...theme.overrides.light, ...theme.overrides.dark])],
    values: themeValues.get(theme.id),
  }
})

const ts = `// GENERATED by design-system/build.mjs. Do not edit.
// Change tokens in design-system/tokens/*.tokens.json or design-system/themes/*.tokens.json,
// then run \`npm run tokens\`.

export type TokenTier = "primitive" | "semantic" | "typography" | "layout" | "component"

export type Breakpoint = ${breakpointNames.map((n) => JSON.stringify(n)).join(" | ")}

/** System breakpoints, smallest first, with the viewport width each starts at. */
export const breakpoints: readonly { name: Breakpoint; min: string }[] = ${JSON.stringify(breakpoints)}

export interface DesignToken {
  /** Dot path in the token source, e.g. "color.brand". */
  name: string
  /** CSS custom property, e.g. "--brand". */
  cssVar: string
  tier: TokenTier
  group: string
  /** DTCG $type. */
  type: string
  /** Resolved value in the default theme (light mode for semantic tokens). */
  value: unknown
  /** Token this one references, if any. */
  ref?: string
  /** Dark-mode value for semantic tokens. */
  dark?: { value: unknown; ref?: string }
  /**
   * Values from a breakpoint up, for tokens that change with the viewport.
   * \`value\` is the base (phones); each entry is the full value from that
   * breakpoint's min width until the next one listed.
   */
  breakpoints?: Partial<Record<Breakpoint, unknown>>
  /** True when some theme gives this token another value (see themes[].values). */
  themed?: boolean
  /** How to use it in Tailwind. */
  utility?: string
  description?: string
}

export const tokens: DesignToken[] = ${JSON.stringify(list.map((t) => JSON.parse(JSON.stringify(t))), null, 2)}

export const tokensByTier = (tier: TokenTier) => tokens.filter((t) => t.tier === tier)

/**
 * The CSS variables that change with the viewport: every one at its base
 * value, and the ones each breakpoint overrides from its min width up.
 * tokens.css applies them with @media; device previews in the viewer apply
 * them for the previewed width, which media queries cannot see.
 */
export const responsiveVars: {
  base: Record<string, string>
  breakpoints: readonly { name: Breakpoint; min: string; vars: Record<string, string> }[]
} = ${JSON.stringify(responsiveVars, null, 2)}

/** Type role names (text-<role> utilities). Used by cn() so roles merge as font sizes. */
export const typeRoles = ${JSON.stringify(all.filter((t) => t.meta.tier === "typography" && t.meta.group === "roles").map((t) => t.path[1]))} as const

/* -------------------------------------------------------------------------- */
/* Themes                                                                      */
/* -------------------------------------------------------------------------- */

/** Theme preset ids, in picker order. data-theme="<id>" applies one. */
export const themeIds = ${JSON.stringify(themes.map((t) => t.id))} as const

export type ThemeId = (typeof themeIds)[number]

/** Light or dark. Independent of the theme: every theme supports both. */
export type ThemeMode = "light" | "dark"

/** The theme used when no data-theme is set. */
export const defaultThemeId: ThemeId = ${JSON.stringify(DEFAULT_THEME)}

/** A token's value under one theme, shaped like DesignToken's value, ref and dark. */
export interface ThemeTokenValue {
  value: unknown
  ref?: string
  dark?: { value: unknown; ref?: string }
}

export interface ThemeSwatches {
  /** The brand colour (links, focus, highlights). */
  accent: string
  /** A mid neutral (muted-foreground), showing the neutral's tint. */
  neutral: string
  background: string
  foreground: string
  panel: string
}

export interface Theme {
  id: ThemeId
  name: string
  /** One line on what the theme looks like. */
  description: string
  /** True for the default theme. */
  default: boolean
  /** The modes the theme supports. */
  modes: readonly ThemeMode[]
  /** Resolved OKLCH colours per mode, for pickers and previews. */
  swatches: Record<ThemeMode, ThemeSwatches>
  /** Resolved component radii, plus a one-line summary such as "Pill buttons, 12px controls, 18px cards". */
  radius: { button: string; control: string; card: string; panel: string; summary: string }
  /** Font family names. */
  fonts: { sans: string; mono: string }
  /** Token names the theme file sets. */
  overrides: readonly string[]
  /**
   * Every token whose value under this theme differs from the default theme
   * (what the theme sets and everything that follows from it), by token name.
   * Tokens not listed have their default value (tokens[].value / .dark).
   */
  values: Readonly<Record<string, ThemeTokenValue>>
}

export const themes: readonly Theme[] = ${JSON.stringify(themeList, null, 2)}

/** A token's value under a theme: its theme value when it has one, else the default. */
export function tokenValueIn(theme: ThemeId, token: DesignToken): ThemeTokenValue {
  return themes.find((t) => t.id === theme)?.values[token.name] ?? { value: token.value, ref: token.ref, dark: token.dark }
}
`

/* -------------------------------------------------------------------------- */
/* themes.json: semantic colours per theme and mode, for the contrast check     */
/* -------------------------------------------------------------------------- */

/**
 * A fingerprint of every token source, so the contrast check can tell when
 * themes.json is older than the sources (see scripts/check-contrast.mjs).
 */
async function sourcesHash() {
  const hash = createHash("sha256")
  for (const dir of [tokensDir, themesDir]) {
    for (const file of (await readdir(path.join(root, dir))).filter((f) => f.endsWith(".json")).sort()) {
      hash.update(`${dir}/${file}\n`).update(await readFile(path.join(root, dir, file)))
    }
  }
  return hash.digest("hex")
}

const semanticTokens = all.filter((t) => t.meta.tier === "semantic")
const themesJson = `${JSON.stringify(
  {
    $comment: "GENERATED by design-system/build.mjs. Do not edit. Every semantic colour, resolved per theme and mode.",
    sources: await sourcesHash(),
    themes: themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      modes: Object.fromEntries(
        theme.modes.map((mode) => [
          mode,
          Object.fromEntries(semanticTokens.map((t) => [t.meta.cssVar.slice(2), resolvedValue(resolved[theme.id][mode].get(t.path.join(".")))])),
        ])
      ),
    })),
  },
  null,
  2
)}\n`

await mkdir(path.join(root, "app/styles"), { recursive: true })
await mkdir(path.join(root, "design-system/generated"), { recursive: true })
/**
 * Writes only when the content changed. Every write makes the dev server
 * rebuild and fully reload each open tab (tokens.ts is imported outside React),
 * so `npm run check` with unchanged tokens must leave the files alone.
 */
async function writeIfChanged(file, content) {
  const target = path.join(root, file)
  const current = await readFile(target, "utf8").catch(() => null)
  if (current === content) return false
  await writeFile(target, content)
  return true
}

const changed = [
  await writeIfChanged("app/styles/tokens.css", css),
  await writeIfChanged("design-system/generated/tokens.ts", ts),
  await writeIfChanged("design-system/generated/themes.json", themesJson),
].some(Boolean)
console.log(
  `Blocks tokens: ${list.length} tokens, ${themes.length} themes (${themes.map((t) => t.id).join(", ")}) → app/styles/tokens.css, design-system/generated/tokens.ts, design-system/generated/themes.json${changed ? "" : " (unchanged)"}`
)
