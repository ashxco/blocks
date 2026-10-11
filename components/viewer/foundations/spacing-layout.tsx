import {
  breakpoints as systemBreakpoints,
  grid,
} from "@/design-system/generated/tokens"
import { cn } from "@/lib/utils"

import {
  leafName,
  round,
  tokens,
  tokensIn,
  toRem,
  withoutUsage,
  type DesignToken,
} from "./data"
import { Code, CodeList, Meta } from "./layout"

/* The Spacing page's layout: containers, the system grid, breakpoints and overlay widths. */

function scaleMax() {
  const widths = [
    ...tokensIn("layout", "breakpoint"),
    ...tokensIn("layout", "container"),
  ].map((t) => toRem(String(t.value)) ?? 0)
  return Math.max(...widths, 1)
}

function BreakpointRuler({ max }: { max: number }) {
  const breakpoints = tokensIn("layout", "breakpoint")
  return (
    <div aria-hidden className="relative h-10 border-b">
      {breakpoints.map((b, i) => {
        const pct = ((toRem(String(b.value)) ?? 0) / max) * 100
        const last = i === breakpoints.length - 1
        return (
          <span
            key={b.name}
            className="absolute bottom-0"
            style={{ left: `${pct}%` }}
          >
            <span
              className={cn(
                "absolute bottom-4 font-mono text-xs font-semibold whitespace-nowrap text-foreground",
                last ? "right-0" : "-translate-x-1/2"
              )}
            >
              {leafName(b.name)}
            </span>
            <span
              className={cn(
                "absolute bottom-0 block h-3 w-px bg-muted-foreground",
                last && "-translate-x-full"
              )}
            />
          </span>
        )
      })}
    </div>
  )
}

export function Containers() {
  const max = scaleMax()
  const containers = tokensIn("layout", "container")
  /* The page-level containers also have a centring utility with gutters. */
  const centred: Record<string, string> = {
    narrow: "container-narrow",
    page: "container-page",
    wide: "container-wide",
  }
  return (
    <div className="grid gap-8">
      <BreakpointRuler max={max} />
      <ul className="grid gap-8">
        {containers.map((c) => {
          const rem = toRem(String(c.value)) ?? 0
          const name = leafName(c.name)
          return (
            <li key={c.name} className="grid gap-3">
              <span
                aria-hidden
                className={cn(
                  "block h-10 rounded-sm border",
                  name === "page"
                    ? "border-foreground bg-foreground"
                    : "border-border-strong bg-muted"
                )}
                style={{ width: `${(rem / max) * 100}%` }}
              />
              <div className="grid gap-1 @prose:grid-cols-[8rem_minmax(0,1fr)] @prose:gap-6">
                <div className="flex items-baseline gap-3 @prose:grid @prose:gap-0.5">
                  <h3 className="text-title text-foreground">{name}</h3>
                  <Meta>
                    {round(rem)}rem · {round(rem * 16)}px
                  </Meta>
                </div>
                <div className="grid gap-1">
                  <CodeList
                    value={[centred[name], c.utility ?? `max-w-(${c.cssVar})`]
                      .filter(Boolean)
                      .join(" · ")}
                    className="text-muted-foreground"
                  />
                  {withoutUsage(c.description) ? (
                    <p className="text-caption text-copy">
                      {withoutUsage(c.description)}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* System grid                                                               */
/* ------------------------------------------------------------------------ */

/**
 * The system grid at the window's width: twelve cells on grid-system, with
 * rows past the first clipped, so exactly the current columns show. The
 * label prints --grid-columns through a CSS counter, so it is right on
 * first paint at any width.
 */
export function LiveGrid() {
  return (
    <div className="grid gap-3">
      <div
        aria-hidden
        className="grid-system h-32 auto-rows-[100%] overflow-hidden"
      >
        {Array.from({ length: 12 }, (_, column) => (
          <span key={column} className="rounded-xs bg-brand-subtle" />
        ))}
      </div>
      <p className="text-caption text-muted-foreground">
        <span className="font-semibold text-foreground [counter-reset:grid-columns_var(--grid-columns)] before:content-[counter(grid-columns)]" />{" "}
        columns in this window
      </p>
    </div>
  )
}

export function GridTable() {
  const tiers = [
    "base",
    ...systemBreakpoints
      .map((b) => b.name)
      .filter((name) => name in grid.columns || name in grid.gutter),
  ] as const
  const minOf = (tier: string) =>
    systemBreakpoints.find((b) => b.name === tier)?.min
  const valueAt = <T,>(
    values: { base: T } & Partial<Record<string, T>>,
    tier: string
  ) => values[tier] ?? values.base
  const th =
    "h-(--table-row-height-sm) px-4 text-left text-caption font-semibold text-muted-foreground @prose:px-5"
  const td = "h-(--table-row-height) px-4 py-3 align-baseline @prose:px-5"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="w-full border-collapse">
        <caption className="sr-only">System grid per breakpoint</caption>
        <thead className="bg-subtle">
          <tr>
            <th scope="col" className={th}>
              From
            </th>
            <th scope="col" className={th}>
              Columns
            </th>
            <th scope="col" className={th}>
              Gutter
            </th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => {
            const min = minOf(tier)
            const gutter = String(valueAt(grid.gutter, tier))
            return (
              <tr key={tier} className="border-t">
                <td className={td}>
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <Code>{tier === "base" ? "base" : `${tier}:`}</Code>
                    <Meta>
                      {min ? `${round((toRem(min) ?? 0) * 16)}px` : "0px"}
                    </Meta>
                  </span>
                </td>
                <td
                  className={cn(
                    td,
                    "font-mono text-label text-foreground tabular"
                  )}
                >
                  {valueAt(grid.columns, tier)}
                </td>
                <td className={td}>
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <Meta className="text-foreground">
                      {round((toRem(gutter) ?? 0) * 16)}px
                    </Meta>
                    <Meta>{gutter}</Meta>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const deviceHint: Record<string, string> = {
  sm: "Large phones in landscape",
  md: "Tablets in portrait",
  lg: "Tablets in landscape, small laptops",
  xl: "Laptops and desktops",
  "2xl": "Large displays",
}

/** Pure CSS: exactly one label is visible, matching the current viewport. */
function CurrentBreakpoint() {
  const pill = "items-center gap-2 font-mono text-label text-foreground"
  return (
    <p className="flex flex-wrap items-center gap-3 rounded-(--card-radius) border bg-subtle px-5 py-4">
      <span className="text-label text-copy">This window is at</span>
      <span className={cn(pill, "flex sm:hidden")}>base</span>
      <span className={cn(pill, "hidden sm:flex md:hidden")}>sm:</span>
      <span className={cn(pill, "hidden md:flex lg:hidden")}>md:</span>
      <span className={cn(pill, "hidden lg:flex xl:hidden")}>lg:</span>
      <span className={cn(pill, "hidden xl:flex 2xl:hidden")}>xl:</span>
      <span className={cn(pill, "hidden 2xl:flex")}>2xl:</span>
    </p>
  )
}

export function Breakpoints() {
  const breakpoints = tokensIn("layout", "breakpoint")
  const th =
    "h-(--table-row-height-sm) px-4 text-left text-caption font-semibold text-muted-foreground @prose:px-5"
  // Baseline, not middle: the mono prefix and the values sit on one line.
  const td = "h-(--table-row-height) px-4 py-3 align-baseline @prose:px-5"
  return (
    <div className="grid gap-6">
      <CurrentBreakpoint />
      <div className="overflow-hidden rounded-(--card-radius) border">
        <table className="w-full border-collapse">
          <caption className="sr-only">Breakpoints</caption>
          <thead className="bg-subtle">
            <tr>
              <th scope="col" className={th}>
                Prefix
              </th>
              <th scope="col" className={th}>
                Min width
              </th>
              <th scope="col" className={th}>
                Typical screen
              </th>
            </tr>
          </thead>
          <tbody>
            {breakpoints.map((b) => {
              const name = leafName(b.name)
              const rem = toRem(String(b.value)) ?? 0
              return (
                <tr key={b.name} className="border-t">
                  <td className={td}>
                    <Code>{name}:</Code>
                  </td>
                  <td className={td}>
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <Meta className="text-foreground">
                        {round(rem * 16)}px
                      </Meta>
                      <Meta>{round(rem)}rem</Meta>
                    </span>
                  </td>
                  <td className={cn(td, "text-caption text-copy")}>
                    {deviceHint[name]}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Overlay widths, drawn to scale against the widest                         */
/* ------------------------------------------------------------------------ */

/* Component groups that size a floating surface, in the order people meet them. */
const overlayGroups = [
  "menu",
  "tooltip",
  "popover",
  "hover-card",
  "toast",
  "dialog",
  "sheet",
]

/* Width tokens only (not the radius or padding in the same groups), smallest first within each component. */
function overlayWidths() {
  const rem = (t: DesignToken) => toRem(String(t.value)) ?? 0
  return overlayGroups.flatMap((group) =>
    tokens
      .filter(
        (t) =>
          t.tier === "component" &&
          t.group === group &&
          /^(min-|max-)?w-/.test(t.utility ?? "")
      )
      .sort((a, b) => rem(a) - rem(b))
  )
}

/* What the bar's end means: menus start at their width and grow, tooltips and dialogs stop at theirs. */
function bound(utility?: string) {
  if (utility?.startsWith("min-w-")) return "min"
  if (utility?.startsWith("max-w-")) return "max"
  return null
}

export function OverlayWidths() {
  const items = overlayWidths()
  const max = Math.max(...items.map((t) => toRem(String(t.value)) ?? 0), 1)
  return (
    <ul className="grid">
      {items.map((t, i) => {
        const rem = toRem(String(t.value)) ?? 0
        const utility = t.utility
        const kind = bound(utility)
        const caption = t.description
        return (
          <li
            key={t.name}
            className={cn(
              "grid gap-3 py-4 @narrow:grid-cols-[17rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-8",
              i > 0 && "border-t"
            )}
          >
            <div className="grid gap-0.5">
              <Code>{utility ?? t.cssVar}</Code>
              <Meta>
                {[kind, `${round(rem)}rem`, `${round(rem * 16)}px`]
                  .filter(Boolean)
                  .join(" · ")}
              </Meta>
            </div>
            <div className="grid gap-2">
              <span
                aria-hidden
                className={cn(
                  "block h-6 rounded-sm border bg-muted",
                  kind
                    ? "border-dashed border-muted-foreground"
                    : "border-border-strong"
                )}
                style={{ width: `${(rem / max) * 100}%` }}
              />
              {caption ? (
                <p className="text-caption text-copy">{caption}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
