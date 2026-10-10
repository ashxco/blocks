/**
 * Read-only helpers over the generated token list. Every Foundations page
 * gets its data from here, so the pages always match the token build.
 */
import { breakpoints, tokens, type DesignToken, type TokenTier } from "@/design-system/generated/tokens"

import { parseOklch, type Oklch } from "./color"

export type { DesignToken, TokenTier }
export { tokens }

const byName = new Map(tokens.map((t) => [t.name, t]))
const byVar = new Map(tokens.map((t) => [t.cssVar, t]))

export function tokenByName(name: string) {
  return byName.get(name)
}

export function tokenByVar(cssVar: string) {
  return byVar.get(cssVar)
}

/** Tokens of one tier and group, in source order. */
export function tokensIn(tier: TokenTier, group: string) {
  return tokens.filter((t) => t.tier === tier && t.group === group)
}

/** Distinct groups of a tier, in source order. */
export function groupsOf(tier: TokenTier) {
  return [...new Set(tokens.filter((t) => t.tier === tier).map((t) => t.group))]
}

/** Short name without the tier prefix: "color.ink.950" -> "ink.950". */
export function shortName(name: string) {
  return name.replace(/^(color|font|type|motion|component)\./, "").replace(/\.DEFAULT$/, "")
}

/** Last dot segment: "motion.duration.fast" -> "fast". */
export function leafName(name: string) {
  const parts = name.replace(/\.DEFAULT$/, "").split(".")
  return parts[parts.length - 1]
}

/**
 * Drops a trailing "Use px-gutter." sentence from a token description, for
 * places that already show the utility next to it. A note after the utility
 * stays: "Use max-w-(--container-prose); max-w-prose is 65ch." keeps
 * "max-w-prose is 65ch."
 */
export function withoutUsage(description?: string) {
  if (!description) return undefined
  const m = /^(.*?)\s*Use [^.;]+(?:;\s*(.+?))?\.$/.exec(description)
  if (!m) return description
  return [m[1], m[2] ? `${m[2]}.` : ""].filter(Boolean).join(" ") || undefined
}

export function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/* ------------------------------------------------------------------------ */
/* Colour                                                                    */
/* ------------------------------------------------------------------------ */

export interface ScaleStep {
  step: string
  token: DesignToken
  value: string
  oklch: Oklch | null
}

export interface ColorScale {
  name: string
  steps: ScaleStep[]
}

export function primitiveScales(): ColorScale[] {
  const colorTokens = tokens.filter((t) => t.tier === "primitive" && t.type === "color")
  return [...new Set(colorTokens.map((t) => t.group))].map((group) => ({
    name: group,
    steps: colorTokens
      .filter((t) => t.group === group)
      .map((t) => ({
        step: leafName(t.name),
        token: t,
        value: String(t.value),
        oklch: parseOklch(t.value),
      })),
  }))
}

export interface SemanticGroup {
  name: string
  tokens: DesignToken[]
}

export function semanticGroups(): SemanticGroup[] {
  return groupsOf("semantic").map((name) => ({ name, tokens: tokensIn("semantic", name) }))
}

/** Role name as used in utilities: "--muted-foreground" -> "muted-foreground". */
export function roleName(t: DesignToken) {
  return t.cssVar.replace(/^--/, "")
}

/** "color.violet.600" -> "violet.600" */
export function refLabel(ref?: string) {
  return ref ? shortName(ref) : undefined
}

const primitiveColors = tokens.filter((t) => t.tier === "primitive" && t.type === "color")

/**
 * Names the primitive behind a colour value: the token reference when there
 * is one, otherwise the primitive with the same OKLCH channels plus opacity
 * ("ink.0 at 9%"). Undefined for a tuned one-off that matches no primitive.
 */
export function colorAlias(value: string, ref?: string): string | undefined {
  if (ref) return refLabel(ref)
  const parsed = parseOklch(value)
  if (!parsed) return undefined
  const match = primitiveColors.find((p) => {
    const q = parseOklch(p.value)
    return q && q.l === parsed.l && q.c === parsed.c && (q.c === 0 || q.h === parsed.h)
  })
  const base = match ? refLabel(match.name) : parsed.l === 0 && parsed.c === 0 ? "black" : undefined
  if (!base) return undefined
  return parsed.alpha < 1 ? `${base} at ${Math.round(parsed.alpha * 100)}%` : base
}

/** Light and dark values for a semantic token (dark falls back to light). */
export function themeValues(t: DesignToken) {
  return {
    light: String(t.value),
    dark: String(t.dark?.value ?? t.value),
  }
}

/* ------------------------------------------------------------------------ */
/* Sizes                                                                     */
/* ------------------------------------------------------------------------ */

const ROOT_PX = 16

/** "1.25rem" -> 20, "16px" -> 16, otherwise null. */
export function toPx(value: string): number | null {
  const v = value.trim()
  if (v.endsWith("rem")) return Number.parseFloat(v) * ROOT_PX
  if (v.endsWith("px")) return Number.parseFloat(v)
  return null
}

export function toRem(value: string): number | null {
  const px = toPx(value)
  return px === null ? null : px / ROOT_PX
}

const round = (n: number) => Math.round(n * 100) / 100

/** Parses clamp(min, preferred, max) into px bounds. */
export function clampRange(value: string): { min: number; max: number } | null {
  const m = /^clamp\(\s*([^,]+),[^,]+,\s*([^)]+)\)$/.exec(value.trim())
  if (!m) return null
  const min = toPx(m[1])
  const max = toPx(m[2])
  return min === null || max === null ? null : { min, max }
}

/** Human size: "16px", "44–80px fluid" (fluid bounds in whole pixels), or the raw value. */
export function describeSize(value: unknown): string {
  const v = String(value)
  const range = clampRange(v)
  if (range) return `${Math.round(range.min)}–${Math.round(range.max)}px fluid`
  const px = toPx(v)
  if (px === null) return v
  if (px >= 9999) return "Fully round"
  return `${round(px)}px`
}

/* ------------------------------------------------------------------------ */
/* Typography                                                                */
/* ------------------------------------------------------------------------ */

export interface TypeValue {
  fontFamily: string[]
  fontSize: string
  fontWeight: number
  letterSpacing: string
  lineHeight: string
}

export function typeValue(t: DesignToken): TypeValue | null {
  const v = t.value as Partial<TypeValue> | null
  if (!v || typeof v !== "object" || !v.fontSize) return null
  return {
    fontFamily: v.fontFamily ?? [],
    fontSize: v.fontSize,
    fontWeight: Number(v.fontWeight ?? 400),
    letterSpacing: v.letterSpacing ?? "0em",
    lineHeight: String(v.lineHeight ?? "normal"),
  }
}

/** Font family stack as written in CSS. */
export function familyStack(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : String(value)
}

/* ------------------------------------------------------------------------ */
/* Values for the token table                                                */
/* ------------------------------------------------------------------------ */

export function formatValue(t: DesignToken, value: unknown): string {
  if (t.type === "typography") {
    const v = typeValue({ ...t, value })
    if (!v) return JSON.stringify(value)
    return `${v.fontSize} / ${v.lineHeight} · ${v.letterSpacing} · ${v.fontWeight}`
  }
  if (t.type === "cubicBezier" && Array.isArray(value)) return `cubic-bezier(${value.join(", ")})`
  if (Array.isArray(value)) return value.join(", ")
  return String(value)
}

export function isColor(t: DesignToken) {
  return t.type === "color"
}

/* ------------------------------------------------------------------------ */
/* Breakpoint values                                                         */
/* ------------------------------------------------------------------------ */

export interface BreakpointValue {
  /** Breakpoint name, e.g. "md". */
  name: string
  /** Viewport width it starts at, e.g. "48rem". */
  min: string
  /** The token's full value from that width up. */
  value: unknown
}

/**
 * A token's values from each breakpoint up, smallest first. Empty for tokens
 * that are the same at every width; token.value is the base (phones).
 */
export function breakpointValues(t: DesignToken): BreakpointValue[] {
  const values = t.breakpoints
  if (!values) return []
  return breakpoints.flatMap((b) => (b.name in values ? [{ name: b.name, min: b.min, value: values[b.name] }] : []))
}
