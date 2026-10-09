/**
 * Read-only helpers over the generated token list. Every Foundations page
 * gets its data from here, so the pages always match the token build.
 */
import { tokens, type DesignToken, type TokenTier } from "@/design-system/generated/tokens"

import { parseOklch, type Oklch } from "./color"

export type { DesignToken, TokenTier }
export { tokens }

export const tierOrder: TokenTier[] = ["primitive", "semantic", "typography", "layout", "component"]

export const tierLabels: Record<TokenTier, string> = {
  primitive: "Primitive",
  semantic: "Semantic",
  typography: "Typography",
  layout: "Layout",
  component: "Component",
}

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

/** CSS variable of the primitive a semantic token points at. */
export function refVar(ref?: string) {
  return ref ? tokenByName(ref)?.cssVar : undefined
}

/** The single most useful utility for a semantic colour. */
export function primaryColorUtility(t: DesignToken) {
  const role = roleName(t)
  if (role.startsWith("chart-")) return `fill-${role}`
  if (role === "ring" || role === "sidebar-ring") return `outline-${role}`
  if (role === "border" || role === "border-strong" || role === "input" || role.endsWith("-border"))
    return `border-${role}`
  if (role === "copy" || role.endsWith("foreground") || role === "panel-muted") return `text-${role}`
  if (role === "brand" || role === "destructive" || role === "success" || role === "warning" || role === "info")
    return `text-${role} · bg-${role}`
  return `bg-${role}`
}

/**
 * The light-theme colour of a semantic role as a CSS value, whatever theme
 * the page is in: a reference to its primitive, or the raw value for
 * translucent roles that have no primitive.
 */
export function lightColor(cssVar: string) {
  const t = tokens.find((x) => x.tier === "semantic" && x.cssVar === cssVar)
  if (!t) return `var(${cssVar})`
  const primitive = refVar(t.ref)
  return primitive ? `var(${primitive})` : String(t.value)
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

/** Human size: "16px", "44–80px fluid", or the raw value. */
export function describeSize(value: unknown): string {
  const v = String(value)
  const range = clampRange(v)
  if (range) return `${round(range.min)}–${round(range.max)}px fluid`
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
/* Values and utilities for the token table                                  */
/* ------------------------------------------------------------------------ */

export function formatValue(t: DesignToken, value: unknown): string {
  if (t.type === "typography") {
    const v = typeValue(t)
    if (!v) return JSON.stringify(value)
    return `${v.fontSize} / ${v.lineHeight} · ${v.letterSpacing} · ${v.fontWeight}`
  }
  if (t.type === "cubicBezier" && Array.isArray(value)) return `cubic-bezier(${value.join(", ")})`
  if (Array.isArray(value)) return value.join(", ")
  return String(value)
}

/**
 * Tailwind usage for a token. The generated list writes every component
 * token as h-(--…); radius, padding and width tokens get the utility that
 * actually applies them.
 */
export function utilityFor(t: DesignToken): string | undefined {
  const v = `(${t.cssVar})`
  if (t.tier === "component") {
    if (/radius/.test(t.name)) return `rounded-${v}`
    if (/padding-x/.test(t.name)) return `px-${v}`
    if (/padding/.test(t.name)) return `p-${v}`
    if (/width/.test(t.name)) return `w-${v}`
    if (/size/.test(t.name)) return `size-${v}`
    return t.utility ?? `h-${v}`
  }
  if (t.utility) return t.utility
  if (t.group === "z") return `z-${v}`
  if (t.group === "focus") return "focus-visible:focus-ring"
  if (t.name === "border.hairline") return "border"
  return undefined
}

export function isColor(t: DesignToken) {
  return t.type === "color"
}
