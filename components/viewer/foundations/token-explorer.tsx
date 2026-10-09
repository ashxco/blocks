"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"

import { CopyButton } from "./copy-button"
import {
  formatValue,
  groupsOf,
  isColor,
  lightColor,
  tierLabels,
  tierOrder,
  tokens,
  utilityFor,
  type DesignToken,
  type TokenTier,
} from "./data"
import { cx, DarkScope } from "./layout"

const tierBlurb: Record<TokenTier, string> = {
  primitive: "OKLCH scales, font families and weights.",
  semantic: "Colour roles with light and dark values.",
  typography: "Type roles and the size scale.",
  layout: "Space, radius, widths and motion.",
  component: "Sizes and shapes of specific components.",
}

interface Row {
  token: DesignToken
  utility?: string
  light: string
  dark?: string
  haystack: string
}

const rows: Row[] = tokens.map((t) => {
  const light = formatValue(t, t.value)
  const dark = t.dark ? formatValue(t, t.dark.value) : undefined
  const utility = utilityFor(t)
  return {
    token: t,
    utility,
    light,
    dark,
    haystack: [t.name, t.cssVar, utility, light, dark, t.description, t.group, t.tier, t.ref, t.dark?.ref]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }
})

const tierCounts = Object.fromEntries(
  tierOrder.map((tier) => [tier, tokens.filter((t) => t.tier === tier).length])
) as Record<TokenTier, number>

type TierFilter = TokenTier | "all"

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

function TierCard({
  label,
  count,
  blurb,
  active,
  onSelect,
}: {
  label: string
  count: number
  blurb: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cx(
        "grid content-start gap-3 rounded-(--card-radius) border p-5 text-left transition-colors duration-(--duration-fast) ease-standard",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-foreground hover:border-foreground"
      )}
    >
      <span className={cx("text-h3 tabular", active ? "text-primary-foreground" : "text-foreground")}>{count}</span>
      <span className="grid gap-0.5">
        <span className={cx("text-title", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        <span className={cx("text-caption", active ? "text-primary-foreground/70" : "text-muted-foreground")}>{blurb}</span>
      </span>
    </button>
  )
}

function ColorChip({ cssVar, theme }: { cssVar: string; theme?: "light" | "dark" }) {
  const chip = "block size-5 shrink-0 rounded-xs border"
  if (theme === "light") return <span className={chip} style={{ backgroundColor: lightColor(cssVar) }} />
  const swatch = <span className={chip} style={{ backgroundColor: `var(${cssVar})` }} />
  return theme === "dark" ? <DarkScope className="shrink-0">{swatch}</DarkScope> : swatch
}

function ValueCell({ row, theme }: { row: Row; theme: "light" | "dark" }) {
  const t = row.token
  const value = theme === "light" ? row.light : row.dark
  if (value === undefined) {
    return <span className="text-caption text-muted-foreground">Same in both themes</span>
  }
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {isColor(t) ? <ColorChip cssVar={t.cssVar} theme={t.tier === "semantic" ? theme : undefined} /> : null}
      <span className="min-w-0 font-mono text-xs text-foreground [overflow-wrap:anywhere]">{value}</span>
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
    return rows.filter(({ token, haystack }) => {
      if (tier !== "all" && token.tier !== tier) return false
      if (group !== "all" && `${token.tier}:${token.group}` !== group) return false
      return !q || haystack.includes(q)
    })
  }, [deferredQuery, tier, group])

  function selectTier(next: TierFilter) {
    setTier(next)
    if (next !== "all" && !group.startsWith(`${next}:`)) setGroup("all")
  }

  function clearAll() {
    setQuery("")
    setTier("all")
    setGroup("all")
  }

  const th = "h-11 px-5 text-left align-middle text-caption font-semibold text-muted-foreground"
  const td = "align-top @narrow:px-5 @narrow:py-4"

  return (
    <div className="grid gap-10">
      <div role="group" aria-label="Filter by tier" className="grid grid-cols-2 gap-3 @prose:grid-cols-3">
        <TierCard
          label="All tokens"
          count={tokens.length}
          blurb="Every tier, in source order."
          active={tier === "all"}
          onSelect={() => selectTier("all")}
        />
        {tierOrder.map((t) => (
          <TierCard
            key={t}
            label={tierLabels[t]}
            count={tierCounts[t]}
            blurb={tierBlurb[t]}
            active={tier === t}
            onSelect={() => selectTier(t)}
          />
        ))}
      </div>

      <div className="grid gap-4 @narrow:grid-cols-[minmax(0,1fr)_auto] @narrow:items-center">
        <div className="relative">
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
            placeholder="Search names, variables, utilities and values"
            className="h-(--control-height-md) pl-10"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <NativeSelect value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Filter by group">
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
                  <th scope="col" className={cx(th, "w-[38%]")}>Token</th>
                  <th scope="col" className={th}>Utility</th>
                  <th scope="col" className={th}>Light</th>
                  <th scope="col" className={th}>Dark</th>
                </tr>
              </thead>
              <tbody className="block @narrow:table-row-group">
                {filtered.map((row) => {
                  const t = row.token
                  return (
                    <tr
                      key={`${t.tier}:${t.name}`}
                      className="grid grid-cols-2 gap-x-4 gap-y-3 border-t p-5 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
                    >
                      <td className={cx(td, "col-span-2")}>
                        <div className="grid gap-1">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <code className="min-w-0 truncate font-mono text-label text-foreground">{t.cssVar}</code>
                            <CopyButton value={t.cssVar} />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">{t.name}</span>
                          {t.description ? <p className="text-caption text-copy">{t.description}</p> : null}
                        </div>
                      </td>
                      <td className={cx(td, "col-span-2")}>
                        <span className="text-caption text-muted-foreground @narrow:hidden">Utility </span>
                        {row.utility ? (
                          <code className="font-mono text-xs text-foreground [overflow-wrap:anywhere]">{row.utility}</code>
                        ) : (
                          <span className="text-caption text-muted-foreground">CSS variable only</span>
                        )}
                      </td>
                      <td className={td}>
                        <span className="mb-1 block text-caption text-muted-foreground @narrow:hidden">Light</span>
                        <ValueCell row={row} theme="light" />
                      </td>
                      <td className={td}>
                        <span className="mb-1 block text-caption text-muted-foreground @narrow:hidden">Dark</span>
                        <ValueCell row={row} theme="dark" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
