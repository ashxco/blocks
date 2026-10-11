/**
 * The default token set (design-system/tokens), resolved in both modes and
 * named, and how a token's value is written in CSS.
 *
 * Alpha. A colour can be another colour at reduced opacity:
 * "$value": "{theme.neutral.950}", "$extensions": { "blocks": { "alpha": 0.2 } }
 * compiles to color-mix(in oklab, var(--bk-neutral-950) 20%, transparent), so
 * it follows the theme's scale.
 */
import { blocksExt, files, isReference, load, refName } from "./load.mjs"
import { describe } from "./naming.mjs"

const shared = [
  files.primitives,
  files.typography,
  files.layout,
  files.components,
]
export const lightTokens = await load([...shared, files.light])
export const darkTokens = await load([...shared, files.dark])

/** Every token by path, with its naming (meta); semantic tokens carry their light values. */
export const byPath = new Map(
  lightTokens.map((t) => [t.path.join("."), { ...t, meta: describe(t) }])
)
export const darkByPath = new Map(darkTokens.map((t) => [t.path.join("."), t]))
export const all = [...byPath.values()]

export const alphaOf = (t) => blocksExt(t)?.alpha
export const round = (n) => Number(n.toFixed(4))

for (const t of [...lightTokens, ...darkTokens]) {
  const a = alphaOf(t)
  if (a !== undefined && (typeof a !== "number" || a < 0 || a > 1))
    throw new Error(
      `${t.path.join(".")}: $extensions.blocks.alpha must be a number from 0 to 1`
    )
}

export function formatValue(type, value) {
  if (type === "fontFamily")
    return (Array.isArray(value) ? value : [value]).join(", ")
  if (type === "cubicBezier") return `cubic-bezier(${value.join(", ")})`
  return String(value)
}

/** The token a reference names, or an error naming where the reference is. */
export function referenced(ref, where) {
  const target = byPath.get(refName(ref))
  if (!target) throw new Error(`Unresolved reference ${ref} in ${where}`)
  return target
}

function cssVarOf(ref, where) {
  const target = referenced(ref, where)
  if (alphaOf(target) !== undefined)
    throw new Error(
      `${where} references ${ref}, which sets an alpha. Reference the colour it is made from instead.`
    )
  return target.meta.cssVar
}

/**
 * CSS expression for a token value: references stay as var() so modes and
 * themes cascade; an alpha wraps the colour in color-mix().
 */
export function cssExpr(t, where) {
  const base = isReference(t.original.$value)
    ? `var(${cssVarOf(t.original.$value, where)})`
    : formatValue(t.$type, t.$value)
  const alpha = alphaOf(t)
  return alpha === undefined
    ? base
    : `color-mix(in oklab, ${base} ${round(alpha * 100)}%, transparent)`
}

export const cssValue = (t) => cssExpr(t, t.path.join("."))

/** A resolved colour with an alpha applied: oklch(L C H / a). */
function withAlpha(value, alpha) {
  if (alpha === undefined) return value
  const m = /^oklch\(([^/)]+?)(?:\s*\/\s*([\d.]+))?\)$/.exec(
    String(value).trim()
  )
  if (!m)
    throw new Error(
      `Cannot apply alpha to ${value}: write the colour as oklch()`
    )
  return `oklch(${m[1].trim()} / ${round(alpha * (m[2] === undefined ? 1 : Number(m[2])))})`
}

/** The value a token resolves to, with its alpha applied. */
export const resolvedValue = (t) =>
  t.$type === "color" ? withAlpha(t.$value, alphaOf(t)) : t.$value

/** The token a token references, if any: "radius.lg". */
export const refOf = (t) =>
  isReference(t.original.$value) ? refName(t.original.$value) : undefined

const ROOT_PX = 16
/** px for a rem or px length, NaN for anything else. */
export function px(value) {
  const v = String(value).trim()
  if (v.endsWith("rem")) return Number.parseFloat(v) * ROOT_PX
  if (v.endsWith("px")) return Number.parseFloat(v)
  return Number.NaN
}
