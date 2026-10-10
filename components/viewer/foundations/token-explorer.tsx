"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"
import { breakpointValues, colorAlias, formatValue, isColor, tokens, type DesignToken } from "./data"
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
  haystack: string
}

/** Groups of a tier, in source order, with "other" last. */
function groupsOf(tier: Tier) {
  const groups = [...new Set(tokens.filter((t) => tierOf(t) === tier).map(groupOf))]
  return groups.includes(OTHER) ? [...groups.filter((g) => g !== OTHER), OTHER] : groups
}

const blocks = tierOrder.flatMap((tier) => groupsOf(tier).map((group) => ({ key: `${tier}:${group}`, tier, group })))

const rows: Row[] = blocks.flatMap(({ tier, group }) =>
  bySize(tokens.filter((t) => tierOf(t) === tier && groupOf(t) === group)).map((t) => {
    const light = formatValue(t, t.value)
    const dark = t.dark ? formatValue(t, t.dark.value) : undefined
    const utility = t.utility
    const semantic = t.tier === "semantic" && isColor(t)
    const lightAlias = semantic ? colorAlias(String(t.value), t.ref) : undefined
    const darkAlias = semantic && t.dark ? colorAlias(String(t.dark.value), t.dark.ref) : undefined
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
)

const tierCounts = Object.fromEntries(
  tierOrder.map((tier) => [tier, rows.filter((r) => r.tier === tier).length])
) as Record<Tier, number>

type TierFilter = Tier | "all"

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

/** Primitives paint the raw colour; semantic chips resolve the value inside their theme. */
function ColorChip({ token, theme }: { token: DesignToken; theme?: "light" | "dark" }) {
  if (token.tier === "semantic" && theme) {
    return <ScopedChip cssVar={token.cssVar} theme={theme} base={token.group === "panel" ? "panel" : "background"} />
  }
  return (
    <span
      aria-hidden
      className="block size-5 shrink-0 rounded-xs border border-border-strong"
      style={{ backgroundColor: `var(${token.cssVar})` }}
    />
  )
}

/**
 * The value, with the primitive behind it on top for semantic colours. A token
 * that changes with the viewport lists its base value (phones) and the value
 * from each breakpoint up.
 */
function Value({ row, theme }: { row: Row; theme?: "light" | "dark" }) {
  const t = row.token
  const value = theme === "dark" ? row.dark : row.light
  const alias = theme === "dark" ? row.darkAlias : row.lightAlias
  if (row.breakpoints.length > 0 && !theme) {
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
      {isColor(t) ? <ColorChip token={t} theme={theme} /> : null}
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

/* ------------------------------------------------------------------------ */
/* Explorer                                                                  */
/* ------------------------------------------------------------------------ */

export function TokenExplorer() {
  const [query, setQuery] = React.useState("")
  const [tier, setTier] = React.useState<TierFilter>("all")
  const [group, setGroup] = React.useState("all")
  const deferredQuery = React.useDeferredValue(query)
  const searchId = React.useId()

  const tiersForGroups = tier === "all" ? tierOrder : [tier]

  const filtered = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return rows.filter((row) => {
      if (tier !== "all" && row.tier !== tier) return false
      if (group !== "all" && `${row.tier}:${row.group}` !== group) return false
      return !q || row.haystack.includes(q)
    })
  }, [deferredQuery, tier, group])

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

        <div className="grid grid-cols-2 gap-3 @narrow:grid-cols-[minmax(0,1fr)_14rem]">
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
        </div>
      </div>

      <div className="grid gap-4">
        <p aria-live="polite" className="text-caption text-muted-foreground tabular">
          Showing {filtered.length} of {tokens.length} tokens
        </p>

        {filtered.length === 0 ? (
          <div className="grid justify-items-start gap-4 rounded-(--card-radius) border bg-subtle p-(--card-padding)">
            <div className="grid gap-1">
              <p className="text-title text-foreground">No tokens match</p>
              <p className="text-caption text-copy">
                Try a CSS variable such as --brand, a utility such as rounded-lg, or a value such as 220ms.
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={clearAll}>
              Clear filters
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
                  <th scope="col" className={th}>Light</th>
                  <th scope="col" className={th}>Dark</th>
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
                              themed ? null : "same in both themes",
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>
                      </th>
                    </tr>
                    {block.rows.map((row) => {
                      const t = row.token
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
                            </div>
                          </td>
                          <td className={cn(td, "min-w-0", !row.utility && "hidden @narrow:table-cell")}>
                            {row.utility ? <CodeList value={row.utility} className="text-xs text-muted-foreground" /> : null}
                          </td>
                          {hasDark ? (
                            <>
                              <td className={cn(td, "flex min-w-0 items-center @narrow:table-cell")}>
                                <span className={label}>Light</span>
                                <Value row={row} theme="light" />
                              </td>
                              <td className={cn(td, "flex min-w-0 items-center @narrow:table-cell")}>
                                <span className={label}>Dark</span>
                                <Value row={row} theme="dark" />
                              </td>
                            </>
                          ) : (
                            <td colSpan={2} className={cn(td, "min-w-0")}>
                              <span className="flex min-w-0 items-center gap-3">
                                {/* Wide rows drop it: the block header already says "same in both themes". */}
                                <span className="shrink-0 text-caption text-muted-foreground @narrow:hidden">Both themes</span>
                                <Value row={row} />
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
