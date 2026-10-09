/**
 * Colour maths for the Foundations pages: OKLCH (as written in the token
 * files) to sRGB, alpha compositing and WCAG 2 contrast ratios.
 *
 * OKLCH -> OKLab -> linear sRGB uses Björn Ottosson's published matrices.
 * Colours outside the sRGB gamut are clipped per channel, which is what
 * browsers do for display on sRGB screens.
 */

export interface Oklch {
  l: number
  c: number
  h: number
  alpha: number
}

/** Gamma-encoded sRGB channels in 0..1, plus alpha. */
export interface Rgb {
  r: number
  g: number
  b: number
  alpha: number
}

const FUNCTION_RE = /^\s*([a-z]+)\s*\(([^)]*)\)\s*$/i

function parseNumber(part: string): number {
  const raw = part.trim()
  if (raw.endsWith("%")) return Number.parseFloat(raw) / 100
  return Number.parseFloat(raw)
}

/** Parses an OKLCH colour function with L C H channels and an optional "/ alpha". Returns null for anything else. */
export function parseOklch(value: unknown): Oklch | null {
  if (typeof value !== "string") return null
  const match = FUNCTION_RE.exec(value)
  if (!match || match[1].toLowerCase() !== "oklch") return null
  const [channels, alphaPart] = match[2].split("/")
  const [l, c, h] = channels.trim().split(/\s+/).map(parseNumber)
  if ([l, c, h].some((n) => Number.isNaN(n))) return null
  const alpha = alphaPart === undefined ? 1 : parseNumber(alphaPart)
  return { l, c, h, alpha: Number.isNaN(alpha) ? 1 : alpha }
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function encodeChannel(linear: number) {
  const x = clamp01(linear)
  return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
}

function decodeChannel(encoded: number) {
  return encoded <= 0.04045 ? encoded / 12.92 : Math.pow((encoded + 0.055) / 1.055, 2.4)
}

export function oklchToRgb({ l, c, h, alpha }: Oklch): Rgb {
  const hue = (h * Math.PI) / 180
  const a = c * Math.cos(hue)
  const b = c * Math.sin(hue)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3

  return {
    r: encodeChannel(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    g: encodeChannel(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    b: encodeChannel(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
    alpha,
  }
}

/** Source-over compositing in gamma-encoded sRGB, as browsers paint. */
export function composite(top: Rgb, bottom: Rgb): Rgb {
  const a = top.alpha
  const mix = (t: number, u: number) => t * a + u * (1 - a)
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), alpha: 1 }
}

/** WCAG 2 relative luminance of an opaque colour. */
export function luminance({ r, g, b }: Rgb) {
  return 0.2126 * decodeChannel(r) + 0.7152 * decodeChannel(g) + 0.0722 * decodeChannel(b)
}

export function contrastRatio(a: Rgb, b: Rgb) {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail"

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

/**
 * Contrast of text over a surface. Translucent surfaces are first composited
 * over `canvas`, translucent text over the resulting surface.
 */
export function textContrast(text: string, surface: string, canvas: string) {
  const t = parseOklch(text)
  const s = parseOklch(surface)
  const c = parseOklch(canvas)
  if (!t || !s || !c) return null
  const base = oklchToRgb({ ...c, alpha: 1 })
  const bg = composite(oklchToRgb(s), base)
  const fg = composite(oklchToRgb(t), bg)
  return contrastRatio(fg, bg)
}

export function formatRatio(ratio: number) {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`
}
