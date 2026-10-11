/**
 * How the token explorer files and resolves tokens: its tiers and groups, the
 * display order, and every row as each theme resolves it. Computed once, at
 * module load, from the generated token list.
 */
import {
  breakpointValues,
  colorAlias,
  formatValue,
  isColor,
  perTheme,
  themeById,
  tokens,
  valueIn,
  type DesignToken,
  type Mode,
  type ThemeId,
} from "./data"

/*
 * The explorer's tiers follow the build's, except that durations and easings
 * get their own Motion tier rather than sitting under Layout.
 */
export type Tier =
  "primitive" | "semantic" | "typography" | "layout" | "motion" | "component"

/* Shown roles first: semantic and component tokens are what code uses; primitives only feed them. */
export const tierOrder: Tier[] = [
  "semantic",
  "component",
  "typography",
  "layout",
  "motion",
  "primitive",
]

export const tierLabels: Record<Tier, string> = {
  primitive: "Primitive",
  semantic: "Semantic",
  typography: "Typography",
  layout: "Layout",
  motion: "Motion",
  component: "Component",
}

const motionGroups = new Set(["duration", "easing"])

function tierOf(t: DesignToken): Tier {
  return t.tier === "layout" && motionGroups.has(t.group) ? "motion" : t.tier
}

/* Component groups with a single token share one "other" block instead of a header each. */
const componentGroupSize = new Map<string, number>()
for (const t of tokens) {
  if (t.tier === "component")
    componentGroupSize.set(t.group, (componentGroupSize.get(t.group) ?? 0) + 1)
}
const OTHER = "other"

function groupOf(t: DesignToken) {
  return t.tier === "component" && componentGroupSize.get(t.group) === 1
    ? OTHER
    : t.group
}

/*
 * Sizes run small to large inside a group (xs, sm, md, lg …), whatever the
 * source order. Tokens sharing a stem stay together, in the order the stem
 * first appears; a stem without a size suffix counts as the default (md).
 */
const sizeRank: Record<string, number> = {
  xs: 0,
  sm: 1,
  base: 2,
  md: 2,
  lg: 3,
  xl: 4,
}

function sizeOf(cssVar: string): { stem: string; rank: number } {
  const m = /^(.*)-(xs|sm|base|md|lg|xl|(\d)xl)$/.exec(cssVar)
  if (!m) return { stem: cssVar, rank: 2 }
  const rank = m[3] ? 3 + Number(m[3]) : sizeRank[m[2]]
  return { stem: m[1], rank }
}

function bySize(list: DesignToken[]) {
  if (list.some(isColor)) return list
  const stems: string[] = []
  for (const t of list) {
    const { stem } = sizeOf(t.cssVar)
    if (!stems.includes(stem)) stems.push(stem)
  }
  return [...list].sort((a, b) => {
    const x = sizeOf(a.cssVar)
    const y = sizeOf(b.cssVar)
    return stems.indexOf(x.stem) - stems.indexOf(y.stem) || x.rank - y.rank
  })
}

export interface Row {
  token: DesignToken
  tier: Tier
  group: string
  /** The utility hint from the token build. Primitive colours have none: they are CSS variables only. */
  utility?: string
  light: string
  dark?: string
  /** The primitive behind a colour role in each theme, as the Colour page names it. */
  lightAlias?: string
  darkAlias?: string
  /** Values from a breakpoint up, for tokens that change with the viewport; light is the base. */
  breakpoints: { name: string; min: string; value: string }[]
  /** True when this theme's file sets the token itself (not only through a token it follows). */
  setByTheme: boolean
  /** Position in display order: the same token in every theme's rows. */
  index: number
  haystack: string
}

/** Groups of a tier, in source order, with "other" last. */
export function groupsIn(tier: Tier) {
  const groups = [
    ...new Set(tokens.filter((t) => tierOf(t) === tier).map(groupOf)),
  ]
  return groups.includes(OTHER)
    ? [...groups.filter((g) => g !== OTHER), OTHER]
    : groups
}

export const blocks = tierOrder.flatMap((tier) =>
  groupsIn(tier).map((group) => ({ key: `${tier}:${group}`, tier, group }))
)

/** Tokens in display order, the same in every theme. */
const ordered = blocks.flatMap(({ tier, group }) =>
  bySize(tokens.filter((t) => tierOf(t) === tier && groupOf(t) === group)).map(
    (t) => ({ t, tier, group })
  )
)

/** Every row as one theme resolves it. Row i is the same token in every theme. */
function rowsIn(theme: ThemeId): Row[] {
  return ordered.map(({ t, tier, group }, index) => {
    const v = valueIn(theme, t)
    const light = formatValue(t, v.value)
    const dark = v.dark ? formatValue(t, v.dark.value) : undefined
    const utility = t.utility
    const semantic = t.tier === "semantic" && isColor(t)
    const lightAlias = semantic
      ? colorAlias(String(v.value), v.ref, theme)
      : undefined
    const darkAlias =
      semantic && v.dark
        ? colorAlias(String(v.dark.value), v.dark.ref, theme)
        : undefined
    // A themed token cannot have breakpoint values, so these are the same in every theme.
    const breakpoints = breakpointValues(t).map((b) => ({
      name: b.name,
      min: b.min,
      value: formatValue(t, b.value),
    }))
    return {
      token: t,
      tier,
      group,
      utility,
      light,
      dark,
      lightAlias,
      darkAlias,
      breakpoints,
      setByTheme: themeById(theme).overrides.includes(t.name),
      index,
      haystack: [
        t.name,
        t.cssVar,
        utility,
        light,
        dark,
        lightAlias,
        darkAlias,
        ...breakpoints.flatMap((b) => [b.name, b.value]),
        t.description,
        t.group,
        tier,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    }
  })
}

export const rowsByTheme = perTheme(rowsIn)
export const themedCount = tokens.filter((t) => t.themed).length

/** What a value cell shows, so themes that agree share one copy. */
export function valueKey(row: Row, mode?: Mode) {
  const value = mode === "dark" ? row.dark : row.light
  const alias = mode === "dark" ? row.darkAlias : row.lightAlias
  return [value, alias].join("|")
}

/** Tokens per tier, for the tier filter. */
export const tierCounts = Object.fromEntries(
  tierOrder.map((tier) => [tier, ordered.filter((r) => r.tier === tier).length])
) as Record<Tier, number>

export type TierFilter = Tier | "all"

/** Values for the theme the page is on ("current"), or for one theme. */
export type ThemeView = ThemeId | "current"

/** Rows of one tier and group, under a subheader. */
export interface Block {
  key: string
  tier: Tier
  group: string
  rows: Row[]
}
