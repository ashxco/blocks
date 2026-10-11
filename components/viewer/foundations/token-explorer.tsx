"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSitePreset } from "@/components/viewer/site-theme"
import { isThemeId } from "@/lib/themes"

import { defaultThemeId, themes, tokens, type ThemeId } from "./data"
import {
  blocks,
  groupsIn,
  rowsByTheme,
  themedCount,
  tierCounts,
  tierLabels,
  tierOrder,
  type Block,
  type ThemeView,
  type TierFilter,
} from "./token-rows"
import { TokenTable } from "./token-table"

/**
 * The All tokens page: search and filters over every token, then the table.
 * Values follow the theme the page is on, or a theme chosen here.
 */
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
  const searchTheme: ThemeId =
    view === "current" ? (sitePreset ?? defaultThemeId) : view

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
        .map((b) => ({
          ...b,
          rows: filtered.filter(
            (r) => r.tier === b.tier && r.group === b.group
          ),
        }))
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

  const tierItems: { value: TierFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: tokens.length },
    ...tierOrder.map((t) => ({
      value: t,
      label: tierLabels[t],
      count: tierCounts[t],
    })),
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
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className="gap-2"
              >
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
                {groupsIn(t).map((g) => (
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
            onChange={(e) =>
              setView(isThemeId(e.target.value) ? e.target.value : "current")
            }
            aria-label="Show values for a theme"
          >
            <NativeSelectOption value="current">
              Current theme
            </NativeSelectOption>
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
          <p
            aria-live="polite"
            className="text-caption text-muted-foreground tabular"
          >
            Showing {filtered.length} of {tokens.length} tokens
          </p>
          <label
            htmlFor={themedId}
            className="flex items-center gap-2.5 text-label text-foreground"
          >
            <Switch
              id={themedId}
              size="sm"
              checked={themedOnly}
              onCheckedChange={setThemedOnly}
            />
            Only tokens a theme changes
            <span className="font-mono text-xs text-muted-foreground tabular">
              {themedCount}
            </span>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="grid justify-items-start gap-4 rounded-(--card-radius) border bg-subtle p-(--card-padding)">
            <div className="grid gap-1">
              <p className="text-title text-foreground">No tokens match</p>
              <p className="text-caption text-copy">
                Try a CSS variable such as --brand, a utility such as
                rounded-lg, or a value such as 220ms.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearAll}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <TokenTable blocks={visibleBlocks} view={view} />
        )}
      </div>
    </div>
  )
}
