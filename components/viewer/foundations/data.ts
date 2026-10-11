/**
 * Read-only helpers over the generated token list. Every Foundations page
 * gets its data from here, so the pages always match the token build.
 */
import {
  breakpoints,
  defaultThemeId,
  themeIds,
  themes,
  tokens,
  tokenValueIn,
  type DesignToken,
  type Theme,
  type ThemeId,
  type ThemeTokenValue,
  type TokenTier,
} from "@/design-system/generated/tokens"

import type { ThemeMode } from "@/lib/themes"

import { parseOklch, type Oklch } from "./color"

export type { DesignToken, Theme, ThemeId, ThemeTokenValue, TokenTier }
export type { ThemeMode as Mode }
export { defaultThemeId, themeIds, themes, tokens }

/** Light, then dark: the order every page lists the two modes in. */
export const modes: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

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
function groupsOf(tier: TokenTier) {
  return [...new Set(tokens.filter((t) => t.tier === tier).map((t) => t.group))]
}

/** Short name without the tier prefix: "color.ink.950" -> "ink.950", "theme.neutral.950" -> "neutral.950". */
function shortName(name: string) {
  return name
    .replace(/^(color|font|type|motion|component|theme)\./, "")
    .replace(/\.DEFAULT$/, "")
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
/* Themes                                                                    */
/* ------------------------------------------------------------------------ */

/** One value per theme, for ThemeText and ByTheme. */
export function perTheme<T>(fn: (theme: ThemeId) => T): Record<ThemeId, T> {
  return Object.fromEntries(themeIds.map((id) => [id, fn(id)])) as Record<
    ThemeId,
    T
  >
}

export function themeById(id: ThemeId): Theme {
  return themes.find((t) => t.id === id) ?? themes[0]
}

/** A token as a theme resolves it: value and ref, plus the dark-mode value for semantic colours. */
export function valueIn(theme: ThemeId, t: DesignToken): ThemeTokenValue {
  return tokenValueIn(theme, t)
}

export type ScaleRole = "accent" | "neutral"

/**
 * The fixed scale a theme points its alias scale at: "violet" for the
 * default accent, "grey" for Mono's. Read from the alias's reference at one
 * step (or a fixed step with the same value). Undefined when the theme
 * writes its own OKLCH values for the scale.
 */
function aliasScaleIn(
  theme: ThemeId,
  role: ScaleRole,
  step = role === "accent" ? "600" : "500"
): string | undefined {
  const alias = byName.get(`theme.${role}.${step}`)
  if (!alias) return undefined
  const v = valueIn(theme, alias)
  if (v.ref?.startsWith("color."))
    return v.ref.replace(/^color\./, "").split(".")[0]
  const same = tokens.find(
    (t) =>
      t.tier === "primitive" &&
      !isAliasScale(t) &&
      leafName(t.name) === step &&
      String(t.value) === String(v.value)
  )
  return same?.group
}

/**
 * The hue of a theme's alias scale, read at its middle step (accent 600,
 * neutral 500) so a scale prints one hue on every page. Null for pure greys.
 */
export function aliasHue(theme: ThemeId, role: ScaleRole): number | null {
  const alias = byName.get(`theme.${role}.${role === "accent" ? "600" : "500"}`)
  const lch = alias ? parseOklch(valueIn(theme, alias).value) : null
  return lch && lch.c > 0 ? Math.round(lch.h) : null
}

/** "violet" (the fixed scale it points at), or "own OKLCH values". */
export function aliasScaleLabel(theme: ThemeId, role: ScaleRole) {
  return aliasScaleIn(theme, role) ?? "own OKLCH values"
}

/** "violet · hue 283", "grey · no hue". */
export function aliasSummary(theme: ThemeId, role: ScaleRole) {
  const hue = aliasHue(theme, role)
  return `${aliasScaleLabel(theme, role)} · ${hue === null ? "no hue" : `hue ${hue}`}`
}

/** "Blocks points it at violet", or "… sets its own OKLCH values". */
export function aliasSource(
  theme: ThemeId,
  themeName: string,
  role: ScaleRole
) {
  const fixed = aliasScaleIn(theme, role)
  return fixed
    ? `${themeName} points it at ${fixed}`
    : `${themeName} sets its own OKLCH values`
}

/* ------------------------------------------------------------------------ */
/* Colour                                                                    */
/* ------------------------------------------------------------------------ */

interface ScaleStep {
  step: string
  token: DesignToken
  value: string
  oklch: Oklch | null
}

export interface ColorScale {
  name: string
  steps: ScaleStep[]
}

function scalesOf(colorTokens: DesignToken[]): ColorScale[] {
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

/** True for the alias scales a theme re-points (--bk-accent-*, --bk-neutral-*). */
function isAliasScale(t: DesignToken) {
  return t.name.startsWith("theme.")
}

/** The fixed OKLCH scales (violet, ink, green …), the same in every theme. */
export function fixedScales(): ColorScale[] {
  return scalesOf(
    tokens.filter(
      (t) => t.tier === "primitive" && t.type === "color" && !isAliasScale(t)
    )
  )
}

/** The theme scales: accent and neutral, aliases that each theme points at a fixed scale. */
export function themeScales(): ColorScale[] {
  return scalesOf(
    tokens.filter(
      (t) => t.tier === "primitive" && t.type === "color" && isAliasScale(t)
    )
  )
}

export type ScaleKind = "accent" | "neutral" | "status"

/**
 * What a fixed scale is for: neutrals run 0 to 1000, status scales are the
 * ones the status roles read, and the rest are accents a theme can choose.
 */
export function scaleKind(scale: ColorScale): ScaleKind {
  if (scale.steps.some((s) => s.step === "1000")) return "neutral"
  const statusRefs = tokensIn("semantic", "status").flatMap((t) => [
    t.ref,
    t.dark?.ref,
  ])
  if (statusRefs.some((ref) => ref?.startsWith(`color.${scale.name}.`)))
    return "status"
  return "accent"
}

/** Steps every scale has (50 … 950), so ramps drawn on them line up step for step. */
export function sharedSteps(scales: ColorScale[]) {
  const [first, ...rest] = scales
  if (!first) return []
  return first.steps
    .map((s) => s.step)
    .filter((step) =>
      rest.every((scale) => scale.steps.some((s) => s.step === step))
    )
}

/** Themes whose accent or neutral scale points at a fixed scale. */
export function themesUsing(
  scale: string
): { theme: Theme; role: ScaleRole }[] {
  return themes.flatMap((theme) =>
    (["accent", "neutral"] as const)
      .filter((role) => aliasScaleIn(theme.id, role) === scale)
      .map((role) => ({ theme, role }))
  )
}

export function semanticGroups(): { name: string; tokens: DesignToken[] }[] {
  return groupsOf("semantic").map((name) => ({
    name,
    tokens: tokensIn("semantic", name),
  }))
}

/** Role name as used in utilities: "--muted-foreground" -> "muted-foreground". */
export function roleName(t: DesignToken) {
  return t.cssVar.replace(/^--/, "")
}

/** "color.violet.600" -> "violet.600" */
export function refLabel(ref?: string) {
  return ref ? shortName(ref) : undefined
}

const primitiveColors = tokens.filter(
  (t) => t.tier === "primitive" && t.type === "color"
)
/* The theme scales first, so a match names the alias semantic colours read ("neutral.0 at 9%"). */
const aliasColors = primitiveColors.filter(isAliasScale)
const fixedColors = primitiveColors.filter((t) => !isAliasScale(t))

/**
 * Names the primitive behind a colour value: the token reference when there
 * is one, otherwise the step with the same OKLCH channels plus opacity
 * ("neutral.0 at 9%"), looked up in the theme's own scales first. Undefined
 * for a tuned one-off that matches no primitive.
 */
export function colorAlias(
  value: string,
  ref?: string,
  theme: ThemeId = defaultThemeId
): string | undefined {
  if (ref) return refLabel(ref)
  const parsed = parseOklch(value)
  if (!parsed) return undefined
  const same = (v: unknown) => {
    const q = parseOklch(v)
    return (
      q &&
      q.l === parsed.l &&
      q.c === parsed.c &&
      (q.c === 0 || q.h === parsed.h)
    )
  }
  const match =
    aliasColors.find((p) => same(valueIn(theme, p).value)) ??
    fixedColors.find((p) => same(p.value))
  const base = match
    ? refLabel(match.name)
    : parsed.l === 0 && parsed.c === 0
      ? "black"
      : undefined
  if (!base) return undefined
  return parsed.alpha < 1
    ? `${base} at ${Math.round(parsed.alpha * 100)}%`
    : base
}

/** Light and dark values for a semantic token in a theme (dark falls back to light). */
export function themeValues(t: DesignToken, theme: ThemeId = defaultThemeId) {
  const v = valueIn(theme, t)
  return {
    light: String(v.value),
    dark: String(v.dark?.value ?? v.value),
  }
}

/**
 * The primitive behind a colour role in one mode of a theme ("neutral.950",
 * "accent.600", "neutral.0 at 9%"), or the raw value for a tuned one-off.
 */
export function refIn(t: DesignToken, mode: ThemeMode, theme: ThemeId) {
  const v = valueIn(theme, t)
  const resolved = mode === "dark" && v.dark ? v.dark : v
  return (
    colorAlias(String(resolved.value), resolved.ref, theme) ??
    String(resolved.value)
  )
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

/** Rounds to two decimals, for printed sizes. */
export const round = (n: number) => Math.round(n * 100) / 100

/** Parses clamp(min, preferred, max) into px bounds. */
function clampRange(value: string): { min: number; max: number } | null {
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

/** A radius: "12px", or "Pill" where it is fully round. */
export function describeRadius(value: unknown): string {
  const size = describeSize(value)
  return size === "Fully round" ? "Pill" : size
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
  if (t.type === "cubicBezier" && Array.isArray(value))
    return `cubic-bezier(${value.join(", ")})`
  if (Array.isArray(value)) return value.join(", ")
  return String(value)
}

export function isColor(t: DesignToken) {
  return t.type === "color"
}

/* ------------------------------------------------------------------------ */
/* Breakpoint values                                                         */
/* ------------------------------------------------------------------------ */

interface BreakpointValue {
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
  return breakpoints.flatMap((b) =>
    b.name in values
      ? [{ name: b.name, min: b.min, value: values[b.name] }]
      : []
  )
}
