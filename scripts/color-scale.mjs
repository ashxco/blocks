/**
 * Prints an OKLCH colour scale in DTCG format, built the way the Blocks
 * primitives are: the same lightness ladder as the existing scales, chroma
 * that follows the violet curve (peaking at 600), capped to what sRGB can show
 * at each lightness so contrast numbers are exact on every screen.
 *
 *   node scripts/color-scale.mjs accent <hue> <peak-chroma>
 *   node scripts/color-scale.mjs neutral <hue> <chroma-factor>
 *
 * accent   11 steps (50 … 950) plus `dim`, the low-chroma dark fill used for
 *          quiet accent surfaces in dark mode (brand-subtle).
 * neutral  the 20 steps of the ink scale (0 … 1000). chroma-factor scales the
 *          ink scale's own tint: 0 gives pure greys, 1 the faint bias of ink,
 *          2 a clearly cool or warm neutral.
 *
 * Paste the output into design-system/tokens/primitives.tokens.json under
 * color.<name>, then point a theme's theme.accent or theme.neutral at it.
 */
import { oklchToLinearSrgb } from "./lib/oklch.mjs"

const ACCENT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const ACCENT_L = [
  0.97, 0.94, 0.885, 0.805, 0.71, 0.62, 0.54, 0.465, 0.39, 0.31, 0.235,
]
/** The violet scale's chroma, normalised to its 600 step. */
const ACCENT_SHAPE = [
  0.026, 0.052, 0.095, 0.146, 0.187, 0.209, 0.215, 0.204, 0.183, 0.15, 0.112,
].map((c) => c / 0.215)

const NEUTRAL_STEPS = [
  0, 25, 50, 100, 150, 200, 300, 400, 450, 500, 550, 600, 700, 750, 800, 850,
  900, 925, 950, 1000,
]
const NEUTRAL_L = [
  1, 0.985, 0.975, 0.955, 0.93, 0.9, 0.82, 0.68, 0.645, 0.56, 0.505, 0.45, 0.36,
  0.315, 0.27, 0.215, 0.175, 0.158, 0.135, 0.1,
]
/** The ink scale's chroma. */
const NEUTRAL_C = [
  0, 0.002, 0.003, 0.004, 0.005, 0.006, 0.008, 0.01, 0.011, 0.012, 0.012, 0.012,
  0.012, 0.012, 0.012, 0.012, 0.012, 0.01, 0.008, 0.006,
]

const inSrgb = (L, C, H) =>
  oklchToLinearSrgb({ L, C, H }).every((c) => c >= -1e-4 && c <= 1 + 1e-4)

/** The most chroma sRGB can show at this lightness and hue. */
function maxChroma(L, H) {
  let lo = 0
  let hi = 0.4
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb(L, mid, H)) lo = mid
    else hi = mid
  }
  return lo
}

const round = (n, d = 3) => Number(n.toFixed(d))
/** Formats a colour for the token source. */
const toOklch = (L, C, H) =>
  `oklch(${round(L)} ${C === 0 ? "0 0" : `${round(C)} ${round(H)}`})` // lint-ds-ignore: writes token sources
/** Rounds down, so a capped chroma never rounds back out of gamut. */
const floor3 = (n) => Math.floor(n * 1000) / 1000

const [kind, hueArg, amountArg] = process.argv.slice(2)
const hue = Number(hueArg)
const amount = Number(amountArg)
if (
  !["accent", "neutral"].includes(kind) ||
  !Number.isFinite(hue) ||
  !Number.isFinite(amount)
) {
  console.error(
    "Usage: node scripts/color-scale.mjs accent <hue> <peak-chroma> | neutral <hue> <chroma-factor>"
  )
  process.exit(1)
}

const scale = {}
if (kind === "accent") {
  ACCENT_STEPS.forEach((step, i) => {
    const L = ACCENT_L[i]
    const C = Math.min(amount * ACCENT_SHAPE[i], floor3(maxChroma(L, hue)))
    scale[step] = { $value: toOklch(L, C, hue) }
  })
  scale.dim = {
    $value: toOklch(
      0.25,
      Math.min(amount * 0.23, floor3(maxChroma(0.25, hue))),
      hue
    ),
  }
} else {
  NEUTRAL_STEPS.forEach((step, i) => {
    const L = NEUTRAL_L[i]
    const C =
      step === 0
        ? 0
        : Math.min(NEUTRAL_C[i] * amount, floor3(maxChroma(L, hue)))
    scale[step] = { $value: toOklch(L, C, hue) }
  })
}

console.log(JSON.stringify(scale, null, 2))
