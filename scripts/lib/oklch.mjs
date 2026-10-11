/** OKLCH colour maths shared by the contrast check, the theme check and the scale generator. */

/**
 * Reads an oklch() colour, L as a number or a percentage, with an optional
 * alpha: { L, C, H, alpha }. A hue of `none` reads as 0.
 */
export function parseOklch(value) {
  const m =
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/.exec(
      String(value).trim()
    )
  if (!m) return null
  return {
    L: Number(m[1]) / (m[2] ? 100 : 1),
    C: Number(m[3]),
    H: m[4] === "none" ? 0 : Number(m[4]),
    alpha: m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1),
  }
}

/** OKLCH to linear sRGB, unclipped: a channel outside 0–1 is out of gamut. */
export function oklchToLinearSrgb({ L, C, H }) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}
