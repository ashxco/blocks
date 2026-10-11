/**
 * Contrast gate: checks every theme in light and dark mode against WCAG AA.
 *
 *   node scripts/check-contrast.mjs [--all]
 *
 * Reads design-system/generated/themes.json (every semantic colour resolved
 * per theme and mode, written by `npm run tokens`), so run the token build
 * first; `npm run check` does both. Pure Node: OKLCH is converted to sRGB
 * (out-of-gamut channels clipped, as an sRGB screen shows them), colours with
 * alpha are composited over their surface, then WCAG 2 relative luminance
 * gives the ratio.
 *
 * Text pairs need 4.5:1; focus rings need 3:1 against the canvas and the
 * dark panels, and chart series 3:1 against the canvas and cards. Code blocks
 * colour their syntax with dark-mode roles on the terminal surface in both
 * modes, so those roles need 4.5:1 on the dark terminal. Prints a table per
 * theme (failures only, plus a summary, unless --all) and exits with 1 when
 * any pair fails.
 *
 * Borders are not gated. Blocks separates with hairlines on purpose: border,
 * border-strong and input are decoration around components that their label,
 * fill or text already identifies, which WCAG 1.4.11 does not require to
 * reach 3:1. Gating border-strong would darken every outline button and
 * dashed empty state in the default theme.
 */
import { oklchToLinearSrgb, parseOklch } from "./lib/oklch.mjs"
import { pad, readThemesData } from "./lib/themes-data.mjs"

const showAll = process.argv.includes("--all")

/* ------------------------------------------------------------------ Pairs */

const TEXT = 4.5
const UI = 3

/** [foreground, background, minimum ratio, what it is, only in this mode] */
const pairs = []
for (const fg of ["foreground", "copy", "muted-foreground"]) {
  for (const bg of ["background", "card", "subtle", "muted", "popover"])
    pairs.push([fg, bg, TEXT, "text"])
}
pairs.push(
  ["primary-foreground", "primary", TEXT, "text"],
  ["secondary-foreground", "secondary", TEXT, "text"],
  ["brand", "background", TEXT, "link"],
  ["brand", "card", TEXT, "link"],
  ["brand-foreground", "brand", TEXT, "text"]
)
for (const fg of ["panel-foreground", "panel-muted", "panel-brand"]) {
  for (const bg of ["panel", "panel-raised"]) pairs.push([fg, bg, TEXT, "text"])
}
for (const status of ["destructive", "success", "warning", "info"]) {
  pairs.push(
    [status, "background", TEXT, "status"],
    [status, `${status}-subtle`, TEXT, "status"]
  )
}
// Focus rings show on the canvas and around controls on dark panels.
for (const bg of ["background", "panel", "panel-raised"])
  pairs.push(["ring", bg, UI, "focus"])
// Chart series are graphical objects (WCAG 1.4.11): every bar, line and dot
// must stand out from the card it is drawn on and from the canvas.
for (let i = 1; i <= 5; i++) {
  for (const bg of ["card", "background"])
    pairs.push([`chart-${i}`, bg, UI, "chart"])
}
// Code blocks (components/viewer/code-block.tsx) sit in a .dark scope on the
// terminal surface: plain text, keywords (brand), tags (chart-2), strings
// (chart-3), attributes and numbers (chart-4), comments (muted-foreground).
for (const fg of [
  "terminal-foreground",
  "brand",
  "chart-2",
  "chart-3",
  "chart-4",
  "muted-foreground",
]) {
  pairs.push([fg, "terminal", TEXT, "code", "dark"])
}

/* ----------------------------------------------------------------- Colour */

function parse(value) {
  const color = parseOklch(value)
  if (!color)
    throw new Error(
      `Cannot read colour ${value}: write semantic colours in OKLCH`
    )
  return color
}

/** OKLCH to gamma-encoded sRGB, each channel clipped to 0–1 (as an sRGB screen shows it). */
const toSrgb = (color) =>
  oklchToLinearSrgb(color).map((c) => {
    const x = Math.min(1, Math.max(0, c))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  })

/** A colour over an opaque backdrop, composited in sRGB like the browser does. */
const over = (fg, backdrop) =>
  toSrgb(fg).map((c, i) => fg.alpha * c + (1 - fg.alpha) * backdrop[i])

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(colors, fgName, bgName) {
  const canvas = toSrgb(parse(colors.background))
  const bg = over(parse(colors[bgName]), canvas)
  const fg = over(parse(colors[fgName]), bg)
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/* -------------------------------------------------------------------- Run */

const data = await readThemesData("check-contrast")

const fmt = (r) => `${r.toFixed(2)}:1`
let failures = 0
let checked = 0
const lines = []

for (const theme of data.themes) {
  const modes = Object.keys(theme.modes)
  const rows = pairs.map(([fg, bg, min, kind, only]) => {
    const results = modes
      .filter((mode) => !only || mode === only)
      .map((mode) => {
        const colors = theme.modes[mode]
        for (const n of [fg, bg])
          if (!(n in colors))
            throw new Error(`${theme.id} ${mode}: no semantic colour "${n}"`)
        const r = ratio(colors, fg, bg)
        checked++
        if (r < min) failures++
        return { mode, r, ok: r >= min }
      })
    return { fg, bg, min, kind, results }
  })
  const shown = showAll
    ? rows
    : rows.filter((row) => row.results.some((r) => !r.ok))
  const worst = Math.min(
    ...rows.map((row) => Math.min(...row.results.map((r) => r.r / row.min)))
  )
  const failed = rows.reduce(
    (n, row) => n + row.results.filter((r) => !r.ok).length,
    0
  )
  lines.push(
    `\n${theme.name} (${theme.id})  ${failed ? `${failed} failing` : "passes"}, tightest pair at ${worst.toFixed(2)}× its minimum`
  )
  if (shown.length) {
    lines.push(
      `  ${pad("pair", 44)}${pad("min", 8)}${modes.map((m) => pad(m, 16)).join("")}`
    )
    for (const row of shown) {
      lines.push(
        `  ${pad(`${row.fg} on ${row.bg}`, 44)}${pad(fmt(row.min), 8)}${modes
          .map((m) => row.results.find((r) => r.mode === m))
          .map((r) => pad(r ? `${fmt(r.r)} ${r.ok ? "ok" : "FAIL"}` : "·", 16))
          .join("")}`
      )
    }
  }
}

console.log(
  `Contrast (WCAG AA): ${pairs.length} pairs × ${data.themes.length} themes, in light and dark${lines.join("\n")}`
)
if (failures) {
  console.log(
    `\n${failures} of ${checked} checks fail. Fix the theme's tokens (design-system/themes/<id>.tokens.json) and run npm run tokens.`
  )
  process.exit(1)
}
console.log(`\nAll ${checked} contrast checks pass.`)
