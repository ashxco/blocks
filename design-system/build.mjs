/**
 * Blocks design tokens build.
 *
 * Source of truth: design-system/tokens/*.tokens.json (W3C DTCG format).
 * Style Dictionary parses the files and resolves references; this script
 * writes two outputs:
 *
 *   app/styles/tokens.css            Tailwind v4 @theme + :root/.dark variables
 *   design-system/generated/tokens.ts Typed token list for the viewer
 *
 * Run with `npm run tokens`. Never edit the generated files by hand.
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
 * with the viewport. tokens.ts lists each token's value per breakpoint
 * (`breakpoints`) and the CSS variables involved (`responsiveVars`), so device
 * previews in the viewer can apply them for the previewed width.
 */
import StyleDictionary from "style-dictionary"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tokensDir = "design-system/tokens"
const files = {
  primitives: `${tokensDir}/primitives.tokens.json`,
  light: `${tokensDir}/semantic.light.tokens.json`,
  dark: `${tokensDir}/semantic.dark.tokens.json`,
  typography: `${tokensDir}/typography.tokens.json`,
  layout: `${tokensDir}/layout.tokens.json`,
  components: `${tokensDir}/components.tokens.json`,
}

async function load(sources) {
  const sd = new StyleDictionary({
    source: sources.map((f) => path.join(root, f)),
    usesDtcg: true,
    log: { verbosity: "silent", warnings: "disabled" },
    platforms: { blocks: { transforms: ["name/kebab"] } },
  })
  const { allTokens } = await sd.getPlatformTokens("blocks")
  return allTokens
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
      if (p[0] === "color") return { tier: "primitive", group: p[1], cssVar: `--bk-${join(p.slice(1))}`, scope: "root" }
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
      const hint = t.$extensions?.blocks?.utility ?? t.original?.$extensions?.blocks?.utility
      const prefix = hint ?? (/radius/.test(prop) ? "rounded" : /padding-x/.test(prop) ? "px" : /padding/.test(prop) ? "p" : /min-width/.test(prop) ? "min-w" : /max-width/.test(prop) ? "max-w" : /width/.test(prop) ? "w" : /size/.test(prop) ? "size" : "h")
      return { tier: "component", group: p[1], cssVar: `--${name}`, scope: "root", utility: `${prefix}-(--${name})` }
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

/** CSS value for a token: references stay as var() so modes cascade. */
function cssValue(t) {
  const original = t.original.$value
  if (typeof original === "string" && /^\{[^}]+\}$/.test(original)) {
    const target = byPath.get(original.slice(1, -1))
    if (!target) throw new Error(`Unresolved reference ${original} in ${t.path.join(".")}`)
    return `var(${target.meta.cssVar})`
  }
  return formatValue(t.$type, t.$value)
}

function formatValue(type, value) {
  if (type === "fontFamily") return (Array.isArray(value) ? value : [value]).join(", ")
  if (type === "cubicBezier") return `cubic-bezier(${value.join(", ")})`
  return String(value)
}

const darkByPath = new Map(darkTokens.map((t) => [t.path.join("."), t]))
const all = [...byPath.values()]
const themeLines = []
const rootLines = { primitive: [], semantic: [], layout: [], component: [] }
const darkLines = []

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

const isReference = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v)
function referenced(t, v) {
  const target = byPath.get(v.slice(1, -1))
  if (!target) throw new Error(`Unresolved reference ${v} in the breakpoint values of ${t.path.join(".")}`)
  return target
}

/**
 * A token's breakpoint values, validated: [{ name, min, css: [[var, value]], value }]
 * smallest first, where css holds the declarations that breakpoint overrides and
 * value is the token's full value from that breakpoint up.
 */
function breakpointValues(t) {
  const declared = t.original?.$extensions?.blocks?.breakpoints ?? t.$extensions?.blocks?.breakpoints
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

const mediaBlocks = responsiveVars.breakpoints.map(
  (b) => `@media (width >= ${b.min}) {
  :root {
${Object.entries(b.vars).map(([v, value]) => `    ${v}: ${value};`).join("\n")}
  }
}`
)

for (const t of all) {
  const { cssVar, scope, tier } = t.meta
  if (tier === "typography") {
    for (const [prop, v] of typeVars(t)) themeLines.push(`  ${v}: ${t.$value[prop]};`)
    continue
  }
  const line = `  ${cssVar}: ${cssValue(t)};`
  if (scope === "theme") themeLines.push(line)
  else if (scope === "mode") {
    rootLines.semantic.push(line)
    const d = darkByPath.get(t.path.join("."))
    const dv = typeof d.original.$value === "string" && /^\{/.test(d.original.$value)
      ? `var(${byPath.get(d.original.$value.slice(1, -1)).meta.cssVar})`
      : formatValue(d.$type, d.$value)
    darkLines.push(`  ${cssVar}: ${dv};`)
  } else rootLines[tier === "primitive" ? "primitive" : tier === "component" ? "component" : "layout"].push(line)
}

const semanticColors = all.filter((t) => t.meta.tier === "semantic").map((t) => t.meta.cssVar)

const css = `/*
 * GENERATED by design-system/build.mjs. Do not edit.
 * Change tokens in design-system/tokens/*.tokens.json, then run \`npm run tokens\`.
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
  --font-heading: var(--font-sans);
  --default-transition-duration: var(--duration-fast);
  --default-transition-timing-function: var(--ease-standard);
${themeLines.join("\n")}
}

/* Semantic colours become utilities (bg-brand, text-body, border-border…)
   that follow the active theme. */
@theme inline {
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-white: var(--bk-ink-0);
  --color-black: var(--bk-ink-1000);
${semanticColors.map((v) => `  --color-${v.slice(2)}: var(${v});`).join("\n")}
}

:root {
  /* Primitives */
${rootLines.primitive.join("\n")}

  /* Semantic colours (light) */
${rootLines.semantic.join("\n")}

  /* Layout and motion */
${rootLines.layout.join("\n")}

  /* Component tokens */
${rootLines.component.join("\n")}
}

.dark {
  color-scheme: dark;
  /* Semantic colours (dark) */
${darkLines.join("\n")}
}

/* Force the light theme on a subtree, even inside .dark. */
.light {
  color-scheme: light;
${rootLines.semantic.join("\n")}
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

const list = all.map((t) => {
  const d = darkByPath.get(t.path.join("."))
  const isRef = (o) => typeof o === "string" && /^\{[^}]+\}$/.test(o)
  return {
    name: t.path.join("."),
    cssVar: t.meta.cssVar,
    tier: t.meta.tier,
    group: t.meta.group,
    type: t.$type,
    value: t.$value,
    ref: isRef(t.original.$value) ? t.original.$value.slice(1, -1) : undefined,
    dark: t.meta.scope === "mode" ? { value: d.$value, ref: isRef(d.original.$value) ? d.original.$value.slice(1, -1) : undefined } : undefined,
    breakpoints: breakpointsByToken.has(t.path.join("."))
      ? Object.fromEntries(breakpointsByToken.get(t.path.join(".")).map((s) => [s.name, s.value]))
      : undefined,
    utility: t.meta.utility,
    description: t.$description,
  }
})

const ts = `// GENERATED by design-system/build.mjs. Do not edit.
// Change tokens in design-system/tokens/*.tokens.json, then run \`npm run tokens\`.

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
  /** Resolved value (light mode for semantic tokens). */
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
`

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
].some(Boolean)
console.log(`Blocks tokens: ${list.length} tokens → app/styles/tokens.css, design-system/generated/tokens.ts${changed ? "" : " (unchanged)"}`)
