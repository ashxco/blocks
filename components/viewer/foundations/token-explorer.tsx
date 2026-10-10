"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSitePreset } from "@/components/viewer/site-theme"
import { isThemeId, themeScopeProps } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { ByTheme } from "./by-theme"
import { CopyButton } from "./copy-button"
import {
  breakpointValues,
  colorAlias,
  defaultThemeId,
  formatValue,
  isColor,
  perTheme,
  themeById,
  themes,
  tokens,
  valueIn,
  type DesignToken,
  type ThemeId,
} from "./data"
import { CodeList, ScopedChip } from "./layout"

/* ------------------------------------------------------------------------ */
/* Catalogue: how the explorer files tokens                                  */
/* ------------------------------------------------------------------------ */

/*
 * The explorer's tiers follow the build's, except that durations and easings
 * get their own Motion tier rather than sitting under Layout.
 */
type Tier = "primitive" | "semantic" | "typography" | "layout" | "motion" | "component"

/* Shown roles first: semantic and component tokens are what code uses; primitives only feed them. */
const tierOrder: Tier[] = ["semantic", "component", "typography", "layout", "motion", "primitive"]

const tierLabels: Record<Tier, string> = {
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
  if (t.tier === "component") componentGroupSize.set(t.group, (componentGroupSize.get(t.group) ?? 0) + 1)
}
const OTHER = "other"

function groupOf(t: DesignToken) {
  return t.tier === "component" && componentGroupSize.get(t.group) === 1 ? OTHER : t.group
}

/*
 * Sizes run small to large inside a group (xs, sm, md, lg …), whatever the
 * source order. Tokens sharing a stem stay together, in the order the stem
 * first appears; a stem without a size suffix counts as the default (md).
 */
const sizeRank: Record<string, number> = { xs: 0, sm: 1, base: 2, md: 2, lg: 3, xl: 4 }

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

interface Row {
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
function groupsOf(tier: Tier) {
  const groups = [...new Set(tokens.filter((t) => tierOf(t) === tier).map(groupOf))]
  return groups.includes(OTHER) ? [...groups.filter((g) => g !== OTHER), OTHER] : groups
}

const blocks = tierOrder.flatMap((tier) => groupsOf(tier).map((group) => ({ key: `${tier}:${group}`, tier, group })))

/** Tokens in display order, the same in every theme. */
const ordered = blocks.flatMap(({ tier, group }) =>
  bySize(tokens.filter((t) => tierOf(t) === tier && groupOf(t) === group)).map((t) => ({ t, tier, group }))
)

/** Every row as one theme resolves it. Row i is the same token in every theme. */
function rowsIn(theme: ThemeId): Row[] {
  return ordered.map(({ t, tier, group }, index) => {
    const v = valueIn(theme, t)
    const light = formatValue(t, v.value)
    const dark = v.dark ? formatValue(t, v.dark.value) : undefined
    const utility = t.utility
    const semantic = t.tier === "semantic" && isColor(t)
    const lightAlias = semantic ? colorAlias(String(v.value), v.ref, theme) : undefined
    const darkAlias = semantic && v.dark ? colorAlias(String(v.dark.value), v.dark.ref, theme) : undefined
    // A themed token cannot have breakpoint values, so these are the same in every theme.
    const breakpoints = breakpointValues(t).map((b) => ({ name: b.name, min: b.min, value: formatValue(t, b.value) }))
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

const rowsByTheme = perTheme(rowsIn)
const rows = rowsByTheme[defaultThemeId]
const themedCount = tokens.filter((t) => t.themed).length

/** What a value cell shows, so themes that agree share one copy. */
function valueKey(row: Row, mode?: Mode) {
  const value = mode === "dark" ? row.dark : row.light
  const alias = mode === "dark" ? row.darkAlias : row.lightAlias
  return [value, alias].join("|")
}

const tierCounts = Object.fromEntries(
  tierOrder.map((tier) => [tier, rows.filter((r) => r.tier === tier).length])
) as Record<Tier, number>

type TierFilter = Tier | "all"
type Mode = "light" | "dark"

/** Values for the theme the page is on ("current"), or for one theme. */
type ThemeView = ThemeId | "current"

/** Rows of one tier and group, under a subheader. */
interface Block {
  key: string
  tier: Tier
  group: string
  rows: Row[]
}

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Primitives paint the raw colour; semantic chips resolve the value inside
 * their mode. Both resolve in `theme` when one is chosen, else the page's.
 */
function ColorChip({ token, mode, theme }: { token: DesignToken; mode?: Mode; theme?: ThemeId }) {
  if (token.tier === "semantic" && mode) {
    return (
      <ScopedChip
        cssVar={token.cssVar}
        mode={mode}
        theme={theme}
        base={token.group === "panel" ? "panel" : "background"}
      />
    )
  }
  return (
    <span aria-hidden {...themeScopeProps(theme, undefined, "block size-5 shrink-0 overflow-hidden rounded-xs border border-border-strong")}>
      <span className="block size-full" style={{ backgroundColor: `var(${token.cssVar})` }} />
    </span>
  )
}

/**
 * The value, with the primitive behind it on top for semantic colours. A token
 * that changes with the viewport lists its base value (phones) and the value
 * from each breakpoint up.
 */
function Value({ row, mode, theme }: { row: Row; mode?: Mode; theme?: ThemeId }) {
  const t = row.token
  const value = mode === "dark" ? row.dark : row.light
  const alias = mode === "dark" ? row.darkAlias : row.lightAlias
  if (row.breakpoints.length > 0 && !mode) {
    return (
      <dl className="grid min-w-0 gap-y-0.5 font-mono text-xs @narrow:grid-cols-[auto_minmax(0,1fr)] @narrow:items-baseline @narrow:gap-x-3 @narrow:gap-y-1">
        <dt className="text-muted-foreground">Base</dt>
        <dd className="min-w-0 text-foreground">{value}</dd>
        {row.breakpoints.map((b) => (
          <React.Fragment key={b.name}>
            <dt className="text-muted-foreground">
              From {b.name} · {b.min}
            </dt>
            <dd className="min-w-0 text-foreground">{b.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    )
  }
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {isColor(t) ? <ColorChip token={t} mode={mode} theme={theme} /> : null}
      <span className="grid min-w-0">
        {alias ? <span className="font-mono text-xs text-foreground">{alias}</span> : null}
        <span
          className={cn(
            "min-w-0 font-mono text-xs",
            alias ? "text-muted-foreground" : "text-foreground",
            isColor(t) && "whitespace-nowrap"
          )}
        >
          {value}
        </span>
      </span>
    </span>
  )
}

/**
 * A row's value in one mode. For the current theme every theme's version is
 * printed and CSS shows the page's (by-theme.tsx), so the table is right on
 * the first frame; a chosen theme prints only its own.
 */
function ValueCell({ index, mode, view }: { index: number; mode?: Mode; view: ThemeView }) {
  if (view !== "current") return <Value row={rowsByTheme[view][index]} mode={mode} theme={view} />
  return (
    <ByTheme as="div" by={(theme) => valueKey(rowsByTheme[theme][index], mode)}>
      {(theme) => <Value row={rowsByTheme[theme][index]} mode={mode} />}
    </ByTheme>
  )
}

/**
 * "Set by Ocean" under a token the shown theme's file sets itself. Tokens
 * that only follow from one (a role on the theme's neutral scale) get no note.
 */
function SetByNote({ index, view }: { index: number; view: ThemeView }) {
  const note = (theme: ThemeId) => (rowsByTheme[theme][index].setByTheme ? `Set by ${themeById(theme).name}` : "")
  const text = (theme: ThemeId) =>
    note(theme) ? <span className="text-caption text-muted-foreground">{note(theme)}</span> : null
  if (view !== "current") return text(view)
  return <ByTheme by={note}>{text}</ByTheme>
}

/* ------------------------------------------------------------------------ */
/* Explorer                                                                  */
/* ------------------------------------------------------------------------ */

export function TokenExplorer() {
  const [query, setQuery] = React.useState("")
  const [tier, setTier] = React.useState<TierFilter>("all")
  const [group, setGroup] = React.useState("all")
  const [view, setView] = React.useState<ThemeView>("current")
  const [themedOnly, setThemedOnly] = React.useState(false)
  const deferredQuery = React.useDeferredValue(query)
  const searchId = React.useId()
  const themedId = React.useId()
  const sitePreset = useSitePreset()

  const tiersForGroups = tier === "all" ? tierOrder : [tier]
  /* Search the values people see: the chosen theme's, or the page's. */
  const searchTheme: ThemeId = view === "current" ? (sitePreset ?? defaultThemeId) : view

  const filtered = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return rowsByTheme[searchTheme].filter((row) => {
      if (tier !== "all" && row.tier !== tier) return false
      if (group !== "all" && `${row.tier}:${row.group}` !== group) return false
      if (themedOnly && !row.token.themed) return false
      return !q || row.haystack.includes(q)
    })
  }, [deferredQuery, tier, group, themedOnly, searchTheme])

  const visibleBlocks = React.useMemo<Block[]>(
    () =>
      blocks
        .map((b) => ({ ...b, rows: filtered.filter((r) => r.tier === b.tier && r.group === b.group) }))
        .filter((b) => b.rows.length > 0),
    [filtered]
  )

  function selectTier(next: TierFilter) {
    setTier(next)
    if (next !== "all" && !group.startsWith(`${next}:`)) setGroup("all")
  }

  function clearAll() {
    setQuery("")
    setTier("all")
    setGroup("all")
    setThemedOnly(false)
  }

  const th = "h-(--table-row-height-sm) px-5 text-left align-middle text-caption font-semibold text-muted-foreground"
  const td = "@narrow:h-(--table-row-height-sm) @narrow:px-5 @narrow:py-2.5 @narrow:align-middle"
  const label = "w-10 shrink-0 text-caption text-muted-foreground @narrow:hidden"

  const tierItems: { value: TierFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: tokens.length },
    ...tierOrder.map((t) => ({ value: t, label: tierLabels[t], count: tierCounts[t] })),
  ]

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        {/* The segmented track needs the width of all six tiers; smaller screens get a select instead. */}
        <div className="hidden @narrow:block">
          <ToggleGroup
            aria-label="Filter by tier"
            value={[tier]}
            onValueChange={(value) => {
              const next = value[0] as TierFilter | undefined
              if (next) selectTier(next)
            }}
          >
            {tierItems.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} className="gap-2">
                {item.label}
                <span className="font-mono text-xs text-muted-foreground tabular group-data-pressed/toggle:text-primary-foreground/60">
                  {item.count}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-2 gap-3 @narrow:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <div className="relative col-span-2 @narrow:col-span-1">
            <label htmlFor={searchId} className="sr-only">
              Search tokens
            </label>
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tokens, utilities or values"
              className="h-(--control-height-md) pl-10"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <NativeSelect
            className="w-full @narrow:hidden"
            value={tier}
            onChange={(e) => selectTier(e.target.value as TierFilter)}
            aria-label="Filter by tier"
          >
            {tierItems.map((item) => (
              <NativeSelectOption key={item.value} value={item.value}>
                {item.value === "all" ? "All tiers" : item.label} · {item.count}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            className="w-full"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            aria-label="Filter by group"
          >
            <NativeSelectOption value="all">All groups</NativeSelectOption>
            {tiersForGroups.map((t) => (
              <NativeSelectOptGroup key={t} label={tierLabels[t]}>
                {groupsOf(t).map((g) => (
                  <NativeSelectOption key={`${t}:${g}`} value={`${t}:${g}`}>
                    {g}
                  </NativeSelectOption>
                ))}
              </NativeSelectOptGroup>
            ))}
          </NativeSelect>
          <NativeSelect
            className="col-span-2 w-full @narrow:col-span-1"
            value={view}
            onChange={(e) => setView(isThemeId(e.target.value) ? e.target.value : "current")}
            aria-label="Show values for a theme"
          >
            <NativeSelectOption value="current">Current theme</NativeSelectOption>
            {themes.map((t) => (
              <NativeSelectOption key={t.id} value={t.id}>
                {t.name} theme
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p aria-live="polite" className="text-caption text-muted-foreground tabular">
            Showing {filtered.length} of {tokens.length} tokens
          </p>
          <label htmlFor={themedId} className="flex items-center gap-2.5 text-label text-foreground">
            <Switch id={themedId} size="sm" checked={themedOnly} onCheckedChange={setThemedOnly} />
            Only tokens a theme changes
            <span className="font-mono text-xs text-muted-foreground tabular">{themedCount}</span>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="grid justify-items-start gap-4 rounded-(--card-radius) border bg-subtle p-(--card-padding)">
            <div className="grid gap-1">
              <p className="text-title text-foreground">No tokens match</p>
              <p className="text-caption text-copy">
                Try a CSS variable such as --brand, a utility such as rounded-lg, or a value such as 220ms.
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={clearAll}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-(--card-radius) border">
            <table className="block w-full border-collapse @narrow:table @narrow:table-fixed">
              <caption className="sr-only">Design tokens</caption>
              <thead className="hidden bg-subtle @narrow:table-header-group">
                <tr>
                  <th scope="col" className={cn(th, "w-[32%]")}>Token</th>
                  <th scope="col" className={cn(th, "w-[24%]")}>Utility</th>
                  <th scope="col" className={th}>
                    Light
                  </th>
                  <th scope="col" className={th}>
                    Dark
                  </th>
                </tr>
              </thead>
              {visibleBlocks.map((block) => {
                const variablesOnly = block.rows.every((r) => !r.utility)
                const themed = block.rows.some((r) => r.dark !== undefined)
                return (
                  <tbody key={block.key} className="block @narrow:table-row-group">
                    <tr className="block border-t bg-subtle @narrow:table-row">
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className="block px-4 text-left font-normal @narrow:table-cell @narrow:px-5 @narrow:align-middle"
                      >
                        <span className="flex min-h-(--table-row-height-sm) flex-wrap items-center gap-x-2 py-2">
                          <span className="text-label text-foreground">{tierLabels[block.tier]}</span>
                          <span className="text-label font-normal text-muted-foreground">/ {block.group}</span>
                          <span className="basis-full text-caption text-muted-foreground tabular @narrow:ml-auto @narrow:basis-auto">
                            {[
                              `${block.rows.length} ${block.rows.length === 1 ? "token" : "tokens"}`,
                              variablesOnly ? "CSS variables only" : null,
                              themed ? null : "same in light and dark",
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>
                      </th>
                    </tr>
                    {block.rows.map((row) => {
                      const t = row.token
                      const index = row.index
                      const hasDark = row.dark !== undefined
                      return (
                        <tr
                          key={`${t.tier}:${t.name}`}
                          className="grid gap-1 border-t px-4 py-2.5 @narrow:table-row @narrow:p-0"
                        >
                          <td className={td}>
                            <div className="grid gap-0.5">
                              <div className="flex min-w-0 items-center gap-1">
                                <code className="min-w-0 truncate font-mono text-label text-foreground" title={t.name}>
                                  {t.cssVar}
                                </code>
                                {/* Negative margin keeps the 28px button from making the line taller. */}
                                <span className="-my-1 shrink-0">
                                  <CopyButton value={t.cssVar} />
                                </span>
                              </div>
                              {t.tier === "semantic" && t.description ? (
                                <p className="text-caption text-copy">{t.description}</p>
                              ) : null}
                              {t.themed ? <SetByNote index={index} view={view} /> : null}
                            </div>
                          </td>
                          <td className={cn(td, "min-w-0", !row.utility && "hidden @narrow:table-cell")}>
                            {row.utility ? <CodeList value={row.utility} className="text-xs text-muted-foreground" /> : null}
                          </td>
                          {hasDark ? (
                            <>
                              <td className={cn(td, "flex min-w-0 items-center @narrow:table-cell")}>
                                <span className={label}>Light</span>
                                <ValueCell index={index} mode="light" view={view} />
                              </td>
                              <td className={cn(td, "flex min-w-0 items-center @narrow:table-cell")}>
                                <span className={label}>Dark</span>
                                <ValueCell index={index} mode="dark" view={view} />
                              </td>
                            </>
                          ) : (
                            <td colSpan={2} className={cn(td, "min-w-0")}>
                              <span className="flex min-w-0 items-center gap-3">
                                {/* Wide rows drop it: the block header already says "same in light and dark". */}
                                <span className="shrink-0 text-caption text-muted-foreground @narrow:hidden">Light and dark</span>
                                <ValueCell index={index} view={view} />
                              </span>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                )
              })}
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
