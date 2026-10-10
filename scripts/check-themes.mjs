/**
 * Theme uniqueness gate: every theme must be an identity of its own,
 * recognisable from a single screenshot of any component page, not a recolour
 * of another. Every pair of themes has to differ on at least four of six
 * traits:
 *
 *   accent    hue family of the accent people see (brand, light mode): hues at
 *             least 25° apart, or exactly one of the two has no hue
 *   neutral   tint of the neutral scale (step 500): one chroma at least 1.5
 *             times the other, or exactly one is a pure grey, or, when both
 *             carry a visible tint (chroma 0.015 or more), hues at least 25°
 *             apart. A faint tint's hue barely shows, so it does not count.
 *   buttons   button shape: pill, 12px or more, 6 to 11px, or square (under 6px)
 *   cards     card radius at least 6px apart
 *   heading   genre of the heading face (display and heading roles)
 *   body      genre of the body face (font.family.sans)
 *
 * Fonts compare by genre ($extensions.blocks.genre on font.family.*:
 * geometric, neo-grotesque, grotesque, humanist, serif or mono), not by name:
 * two geometric sans read alike in a screenshot even when they are different
 * families.
 *
 *   node scripts/check-themes.mjs
 *
 * Reads the identity of each theme from design-system/generated/themes.json
 * (written by `npm run tokens`), so run the token build first; `npm run check`
 * does both. Prints each theme's traits and the pairwise matrix, and exits with
 * 1 when a pair shares too much.
 */
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.join(root, "design-system/generated/themes.json")

/** How many of the six traits every pair must differ on. */
const MIN_DIFFERENT = 4
/** Hues closer than this read as one family. */
const HUE_FAMILY = 25
/** Below this chroma an accent has no hue (Mono's ink accent). */
const ACCENT_NO_HUE = 0.03
/** Below this chroma a neutral is a pure grey. */
const NEUTRAL_NO_TINT = 0.004
/** A neutral at least this many times as chromatic as another reads as a different tint. */
const NEUTRAL_CHROMA_RATIO = 1.5
/** Below this chroma a neutral's hue barely shows, so only its chroma counts. */
const NEUTRAL_VISIBLE_TINT = 0.015
/** Card radii closer than this read as the same shape. */
const CARD_RADIUS_STEP = 6

/* ----------------------------------------------------------------- Values */

function oklch(value) {
  const m = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)/.exec(String(value).trim())
  if (!m) throw new Error(`Cannot read colour ${value}: write theme colours in OKLCH`)
  return { L: Number(m[1]) / (m[2] ? 100 : 1), C: Number(m[3]), H: m[4] === "none" ? 0 : Number(m[4]) }
}

const ROOT_PX = 16
function px(value) {
  const v = String(value).trim()
  if (v.endsWith("rem")) return Number.parseFloat(v) * ROOT_PX
  if (v.endsWith("px")) return Number.parseFloat(v)
  if (Number.parseFloat(v) === 0) return 0
  throw new Error(`Cannot read radius ${value}: use rem or px`)
}

const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360
  return Math.min(d, 360 - d)
}

function buttonShape(radius) {
  const r = px(radius)
  if (r >= 999) return "pill"
  if (r >= 12) return "12px+"
  if (r >= 6) return "6–11px"
  return "square"
}

const fmtPx = (v) => (px(v) >= 999 ? "pill" : `${Number(px(v).toFixed(2))}px`)
const fmtHue = (c, noHue) => (c.C < noHue ? "none" : `${Math.round(c.H)}° C${c.C.toFixed(3)}`)

/* ----------------------------------------------------------------- Traits */

/** Each trait: how to show a theme's value, and whether two themes differ on it (with why). */
const traits = [
  {
    id: "accent",
    show: (t) => fmtHue(t.accent, ACCENT_NO_HUE),
    compare(a, b) {
      const [x, y] = [a.accent, b.accent]
      const hueless = [x, y].filter((c) => c.C < ACCENT_NO_HUE).length
      if (hueless === 2) return { differs: false, why: "neither has a hue" }
      if (hueless === 1) return { differs: true, why: "one has no hue" }
      const gap = hueGap(x.H, y.H)
      return { differs: gap >= HUE_FAMILY, why: `hues ${Math.round(gap)}° apart` }
    },
  },
  {
    id: "neutral",
    show: (t) => fmtHue(t.neutral, NEUTRAL_NO_TINT),
    compare(a, b) {
      const [x, y] = [a.neutral, b.neutral]
      const grey = [x, y].filter((c) => c.C < NEUTRAL_NO_TINT).length
      if (grey === 2) return { differs: false, why: "both pure grey" }
      if (grey === 1) return { differs: true, why: "one is pure grey" }
      const gap = hueGap(x.H, y.H)
      const ratio = Math.max(x.C, y.C) / Math.min(x.C, y.C)
      const hueShows = Math.min(x.C, y.C) >= NEUTRAL_VISIBLE_TINT
      return {
        differs: ratio >= NEUTRAL_CHROMA_RATIO || (hueShows && gap >= HUE_FAMILY),
        why: `${hueShows ? `tints ${Math.round(gap)}° apart` : "a faint tint"}, chroma ×${ratio.toFixed(2)}`,
      }
    },
  },
  {
    id: "buttons",
    show: (t) => (buttonShape(t.radius.button) === "pill" ? "pill" : `${buttonShape(t.radius.button)} (${fmtPx(t.radius.button)})`),
    compare(a, b) {
      const [x, y] = [buttonShape(a.radius.button), buttonShape(b.radius.button)]
      return { differs: x !== y, why: x === y ? `both ${x}` : `${x} vs ${y}` }
    },
  },
  {
    id: "cards",
    show: (t) => fmtPx(t.radius.card),
    compare(a, b) {
      const gap = Math.abs(px(a.radius.card) - px(b.radius.card))
      return { differs: gap >= CARD_RADIUS_STEP, why: `${Number(gap.toFixed(2))}px apart` }
    },
  },
  fontTrait("heading", "heading"),
  fontTrait("body", "sans"),
]

/** A font trait: the face's name and genre, compared by genre. */
function fontTrait(id, kind) {
  return {
    id,
    show: (t) => `${t.fonts[kind]} (${t.genres[kind]})`,
    compare(a, b) {
      const [x, y] = [a.genres[kind], b.genres[kind]]
      if (x !== y) return { differs: true, why: `${x} vs ${y}` }
      return { differs: false, why: a.fonts[kind] === b.fonts[kind] ? `both ${a.fonts[kind]}` : `both ${x}: ${a.fonts[kind]}, ${b.fonts[kind]}` }
    },
  }
}

/* -------------------------------------------------------------------- Run */

const data = JSON.parse(
  await readFile(source, "utf8").catch(() => {
    console.error(`check-themes: ${path.relative(root, source)} is missing. Run npm run tokens first.`)
    process.exit(2)
  })
)

// The same fingerprint of the token sources as design-system/build.mjs, so a
// stale themes.json never passes for the current tokens.
const hash = createHash("sha256")
for (const dir of ["design-system/tokens", "design-system/themes"]) {
  for (const file of (await readdir(path.join(root, dir))).filter((f) => f.endsWith(".json")).sort()) {
    hash.update(`${dir}/${file}\n`).update(await readFile(path.join(root, dir, file)))
  }
}
if (data.sources !== hash.digest("hex")) {
  console.error("check-themes: the token sources changed after the last token build. Run npm run tokens first.")
  process.exit(2)
}
if (data.themes.some((t) => !t.identity?.genres)) {
  console.error("check-themes: themes.json has no theme identity. Run npm run tokens first.")
  process.exit(2)
}

const themes = data.themes.map((t) => ({
  id: t.id,
  name: t.name,
  accent: oklch(t.identity.accent.brand.light ?? Object.values(t.identity.accent.brand)[0]),
  neutral: oklch(t.identity.neutral[500]),
  radius: t.identity.radius,
  fonts: t.identity.fonts,
  genres: t.identity.genres,
}))

const pad = (s, n) => String(s).padEnd(n)
const lines = []

// Each theme's traits.
const widths = traits.map((trait) => Math.max(trait.id.length, ...themes.map((t) => trait.show(t).length)) + 2)
const idWidth = Math.max(...themes.map((t) => t.id.length)) + 2
lines.push("Theme traits", `  ${pad("", idWidth)}${traits.map((trait, i) => pad(trait.id, widths[i])).join("")}`)
for (const t of themes) lines.push(`  ${pad(t.id, idWidth)}${traits.map((trait, i) => pad(trait.show(t), widths[i])).join("")}`)

// Every pair.
const pairs = []
for (let i = 0; i < themes.length; i++) {
  for (let j = i + 1; j < themes.length; j++) {
    const [a, b] = [themes[i], themes[j]]
    const results = traits.map((trait) => ({ id: trait.id, ...trait.compare(a, b) }))
    pairs.push({ a, b, results, count: results.filter((r) => r.differs).length })
  }
}
const countOf = (a, b) => pairs.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a))?.count

const cell = Math.max(...themes.map((t) => t.id.length)) + 2
lines.push(
  "",
  `Traits each pair differs on (of ${traits.length}; at least ${MIN_DIFFERENT} required)`,
  `  ${pad("", idWidth)}${themes.map((t) => pad(t.id, cell)).join("")}`
)
for (const a of themes) {
  lines.push(`  ${pad(a.id, idWidth)}${themes.map((b) => pad(a === b ? "·" : `${countOf(a, b)}${countOf(a, b) < MIN_DIFFERENT ? "!" : ""}`, cell)).join("")}`)
}

lines.push("", "Pairs")
const pairWidth = Math.max(...pairs.map((p) => `${p.a.id} / ${p.b.id}`.length)) + 2
for (const p of pairs) {
  const shared = p.results.filter((r) => !r.differs)
  const verdict = p.count >= MIN_DIFFERENT ? "ok  " : "FAIL"
  lines.push(
    `  ${pad(`${p.a.id} / ${p.b.id}`, pairWidth)}${verdict} ${p.count} of ${traits.length}${shared.length ? `  shared: ${shared.map((r) => `${r.id} (${r.why})`).join(", ")}` : ""}`
  )
}

console.log(lines.join("\n"))
const failing = pairs.filter((p) => p.count < MIN_DIFFERENT)
if (failing.length) {
  console.log(
    `\n${failing.length} of ${pairs.length} theme pairs are too alike. Give each theme its own accent hue, neutral tint, button shape, card radius or kind of font (design-system/themes/<id>.tokens.json) and run npm run tokens.`
  )
  process.exit(1)
}
console.log(`\nAll ${pairs.length} theme pairs differ on at least ${MIN_DIFFERENT} of ${traits.length} traits.`)
