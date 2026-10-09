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
 */
import StyleDictionary from "style-dictionary"
import { mkdir, writeFile } from "node:fs/promises"
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
      return { tier: "semantic", group: semanticGroup(p[1]), cssVar: `--${name}`, scope: "mode", utility: `bg-${name} · text-${name} · border-${name}` }
    }
    case "typography":
      return { tier: "typography", group: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"].includes(p[1]) ? "scale" : "roles", cssVar: `--text-${p[1]}`, scope: "theme", utility: `text-${p[1]}` }
    case "layout": {
      const [head, ...rest] = p
      if (head === "spacing") return { tier: "layout", group: "spacing", cssVar: "--spacing", scope: "theme", utility: "p-4 = 4 × spacing" }
      if (head === "space") return { tier: "layout", group: "spacing", cssVar: `--spacing-${join(rest)}`, scope: "theme", utility: `p-${join(rest)} · gap-${join(rest)}` }
      if (head === "radius") return { tier: "layout", group: "radius", cssVar: `--radius-${join(rest)}`, scope: "theme", utility: `rounded-${join(rest)}` }
      if (head === "container") return { tier: "layout", group: "container", cssVar: `--container-${join(rest)}`, scope: "theme", utility: `max-w-${join(rest)}` }
      if (head === "breakpoint") return { tier: "layout", group: "breakpoint", cssVar: `--breakpoint-${join(rest)}`, scope: "theme", utility: `${join(rest)}:` }
      if (head === "motion" && rest[0] === "ease") return { tier: "layout", group: "easing", cssVar: `--ease-${join(rest.slice(1))}`, scope: "theme", utility: `ease-${join(rest.slice(1))}` }
      if (head === "motion") return { tier: "layout", group: "duration", cssVar: `--duration-${join(rest.slice(1))}`, scope: "root", utility: `duration-(--duration-${join(rest.slice(1))})` }
      if (head === "blur") return { tier: "layout", group: "blur", cssVar: `--blur-${join(rest)}`, scope: "theme", utility: `backdrop-blur-${join(rest)}` }
      return { tier: "layout", group: head, cssVar: `--${join(p)}`, scope: "root" }
    }
    case "components":
      return { tier: "component", group: p[1], cssVar: `--${join(p.slice(1))}`, scope: "root", utility: `h-(--${join(p.slice(1))})` }
  }
  throw new Error(`No naming rule for token ${p.join(".")} in ${t.filePath}`)
}

function semanticGroup(head) {
  if (["background", "foreground", "copy", "muted-foreground", "subtle", "card", "card-foreground", "popover", "popover-foreground"].includes(head)) return "surface & text"
  if (["primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "accent", "accent-foreground"].includes(head)) return "interactive"
  if (head.startsWith("brand")) return "brand"
  if (/^(destructive|success|warning|info)/.test(head)) return "status"
  if (["border", "border-strong", "input", "ring", "overlay"].includes(head)) return "lines & focus"
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

for (const t of all) {
  const { cssVar, scope, tier } = t.meta
  if (tier === "typography") {
    const v = t.$value
    themeLines.push(`  ${cssVar}: ${v.fontSize};`)
    themeLines.push(`  ${cssVar}--line-height: ${v.lineHeight};`)
    themeLines.push(`  ${cssVar}--letter-spacing: ${v.letterSpacing};`)
    if (t.meta.group === "roles" && Number(v.fontWeight) >= 600) themeLines.push(`  ${cssVar}--font-weight: ${v.fontWeight};`)
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
  --container-*: initial;
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
  /* Semantic colours (dark) */
${darkLines.join("\n")}
}
`

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
    utility: t.meta.utility,
    description: t.$description,
  }
})

const ts = `// GENERATED by design-system/build.mjs. Do not edit.
// Change tokens in design-system/tokens/*.tokens.json, then run \`npm run tokens\`.

export type TokenTier = "primitive" | "semantic" | "typography" | "layout" | "component"

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
  /** How to use it in Tailwind. */
  utility?: string
  description?: string
}

export const tokens: DesignToken[] = ${JSON.stringify(list.map((t) => JSON.parse(JSON.stringify(t))), null, 2)}

export const tokensByTier = (tier: TokenTier) => tokens.filter((t) => t.tier === tier)
`

await mkdir(path.join(root, "app/styles"), { recursive: true })
await mkdir(path.join(root, "design-system/generated"), { recursive: true })
await writeFile(path.join(root, "app/styles/tokens.css"), css)
await writeFile(path.join(root, "design-system/generated/tokens.ts"), ts)
console.log(`Blocks tokens: ${list.length} tokens → app/styles/tokens.css, design-system/generated/tokens.ts`)
