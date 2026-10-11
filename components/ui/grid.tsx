"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { grid } from "@/design-system/generated/tokens"
import { cn } from "@/lib/utils"

/**
 * Blocks grid. By default the system grid (grid-system in globals.css):
 * 4 columns on phones, 8 from md and 12 from lg, with the --grid-gutter
 * between columns and rows. `columns` gives a fixed count instead, for
 * even tiles such as a gallery of cards.
 *
 *   <Grid>
 *     <GridItem span={8}>Chart</GridItem>
 *     <GridItem span={4}>Activity</GridItem>
 *   </Grid>
 *
 * GridItem `span` and `start` take one value or one per breakpoint,
 * mobile first: { base: "full", md: 4, lg: 3 }. A breakpoint left out keeps
 * the value below it. A span never exceeds the columns the grid has at that
 * breakpoint, so span={8} fills a phone's 4 columns instead of adding more.
 *
 * Every class below is written out in full so Tailwind generates it.
 */

type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/** The breakpoints the grid changes at, mobile first. */
const tiers = ["base", "md", "lg"] as const
type Tier = (typeof tiers)[number]

type Responsive<T> = T | Partial<Record<Tier, T>>

type Span = Count | "full"

const gridColumns: Record<Tier, Record<Count, string>> = {
  base: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
    9: "md:grid-cols-9",
    10: "md:grid-cols-10",
    11: "md:grid-cols-11",
    12: "md:grid-cols-12",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
    9: "lg:grid-cols-9",
    10: "lg:grid-cols-10",
    11: "lg:grid-cols-11",
    12: "lg:grid-cols-12",
  },
}

const spanClasses: Record<Tier, Record<Span, string>> = {
  base: {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
    full: "col-span-full",
  },
  md: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
    full: "md:col-span-full",
  },
  lg: {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
    10: "lg:col-span-10",
    11: "lg:col-span-11",
    12: "lg:col-span-12",
    full: "lg:col-span-full",
  },
}

const startClasses: Record<Tier, Record<Count, string>> = {
  base: {
    1: "col-start-1",
    2: "col-start-2",
    3: "col-start-3",
    4: "col-start-4",
    5: "col-start-5",
    6: "col-start-6",
    7: "col-start-7",
    8: "col-start-8",
    9: "col-start-9",
    10: "col-start-10",
    11: "col-start-11",
    12: "col-start-12",
  },
  md: {
    1: "md:col-start-1",
    2: "md:col-start-2",
    3: "md:col-start-3",
    4: "md:col-start-4",
    5: "md:col-start-5",
    6: "md:col-start-6",
    7: "md:col-start-7",
    8: "md:col-start-8",
    9: "md:col-start-9",
    10: "md:col-start-10",
    11: "md:col-start-11",
    12: "md:col-start-12",
  },
  lg: {
    1: "lg:col-start-1",
    2: "lg:col-start-2",
    3: "lg:col-start-3",
    4: "lg:col-start-4",
    5: "lg:col-start-5",
    6: "lg:col-start-6",
    7: "lg:col-start-7",
    8: "lg:col-start-8",
    9: "lg:col-start-9",
    10: "lg:col-start-10",
    11: "lg:col-start-11",
    12: "lg:col-start-12",
  },
}

/** A value per tier, each tier keeping the one below it when it is left out. */
function perTier<T>(value: Responsive<T> | undefined, base: T): Record<Tier, T>
function perTier<T>(
  value: Responsive<T> | undefined
): Record<Tier, T | undefined>
function perTier<T>(value: Responsive<T> | undefined, base?: T) {
  const given: Partial<Record<Tier, T>> =
    value !== null && typeof value === "object"
      ? (value as Partial<Record<Tier, T>>)
      : { base: value as T | undefined }
  let current = given.base ?? base
  return Object.fromEntries(
    tiers.map((tier) => {
      current = given[tier] ?? current
      return [tier, current]
    })
  ) as Record<Tier, T | undefined>
}

/** The system grid's columns per tier, from the grid.columns token. */
const systemColumns = perTier(
  {
    base: grid.columns.base as Count,
    md: grid.columns.md as Count | undefined,
    lg: grid.columns.lg as Count | undefined,
  },
  grid.columns.base as Count
)

/** Columns of the nearest Grid at each tier, so items keep their spans inside it. */
const GridColumnsContext =
  React.createContext<Record<Tier, Count>>(systemColumns)

function Grid({
  className,
  columns = "system",
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  /** "system" for the 4, 8 and 12 column grid, or a fixed count, or one per breakpoint. */
  columns?: "system" | Responsive<Count>
}) {
  const system = columns === "system"
  const counts = system ? systemColumns : perTier<Count>(columns, 1)
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          system
            ? "grid-system"
            : [
                "grid gap-(--grid-gutter)",
                tiers.map((tier, i) =>
                  i === 0 || counts[tier] !== counts[tiers[i - 1]]
                    ? gridColumns[tier][counts[tier]]
                    : null
                ),
              ],
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "grid",
      columns: system
        ? "system"
        : typeof columns === "number"
          ? String(columns)
          : "responsive",
    },
  })
  return (
    <GridColumnsContext.Provider value={counts}>
      {element}
    </GridColumnsContext.Provider>
  )
}

function GridItem({
  className,
  span,
  start,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  /** Columns to cover, or "full" for the whole row. One value, or one per breakpoint. */
  span?: Responsive<Span>
  /** The column the item starts at. One value, or one per breakpoint. */
  start?: Responsive<Count>
}) {
  const columns = React.useContext(GridColumnsContext)
  const spans = perTier(span, span === undefined ? undefined : "full")
  const starts = perTier(start)

  const classes: string[] = []
  let previous = ""
  for (const tier of tiers) {
    const cols = columns[tier]
    const s = spans[tier]
    // A span wider than the grid at this tier fills it instead.
    const width =
      s === undefined ? 1 : s === "full" ? cols : (Math.min(s, cols) as Count)
    const full = s === "full" || width === cols
    // A start that would push the item past the last column moves back.
    const from =
      starts[tier] === undefined || full
        ? undefined
        : (Math.min(starts[tier]!, cols - width + 1) as Count)
    const signature = `${s === undefined ? "" : full ? "full" : width}:${from ?? ""}`
    // col-span-* sets the grid-column shorthand, which resets the start, so a
    // tier that changes either writes both again.
    if (signature !== previous) {
      if (s !== undefined)
        classes.push(spanClasses[tier][full ? "full" : width])
      if (from !== undefined) classes.push(startClasses[tier][from])
      previous = signature
    }
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("min-w-0", classes, className) },
      props
    ),
    render,
    state: { slot: "grid-item" },
  })
}

export { Grid, GridItem, type Span as GridSpan }
