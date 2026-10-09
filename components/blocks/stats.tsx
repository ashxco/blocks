import * as React from "react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { cn } from "@/lib/utils"

export interface Stat {
  /** The number, already formatted: "4.2M", "31s", "99.99%". */
  value: string
  /** What it counts, in a few words. */
  label: string
  /** Optional source or period, shown small. */
  detail?: string
}

export interface StatsProps {
  stats?: Stat[]
  /** Optional heading above the band. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** "default" sits between hairlines, "subtle" on a tinted band, "panel" on a dark panel. */
  tone?: "default" | "subtle" | "panel"
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultStats: Stat[] = [
  { value: "4.2M", label: "Deploys a month", detail: "Across 38,000 teams" },
  { value: "31s", label: "Median push to live", detail: "Next.js app with a warm cache" },
  { value: "99.99%", label: "API uptime", detail: "Rolling 12 months" },
  { value: "38", label: "Edge regions", detail: "On six continents" },
]

const tones = {
  default: {
    band: "border-y",
    grid: "bg-border",
    cell: "bg-background",
    value: "text-h1 text-foreground tabular",
    label: "text-label text-foreground",
    detail: "text-caption text-muted-foreground",
  },
  subtle: {
    band: "rounded-(--panel-radius) bg-subtle px-(--card-padding) @min-[30rem]/stats:px-10",
    grid: "bg-border",
    cell: "bg-subtle",
    value: "text-h1 text-foreground tabular",
    label: "text-label text-foreground",
    detail: "text-caption text-muted-foreground",
  },
  panel: {
    band: "rounded-(--panel-radius) bg-panel px-(--card-padding) text-panel-foreground @min-[30rem]/stats:px-10",
    grid: "bg-panel-border",
    cell: "bg-panel",
    value: "text-h1 text-panel-foreground tabular",
    label: "text-label text-panel-foreground",
    detail: "text-caption text-panel-muted",
  },
} as const

/**
 * A band of headline numbers in big tabular figures, split by hairlines.
 * One column on phones, two in narrow slots, four when there is room.
 */
export function Stats({
  stats = defaultStats,
  title,
  description,
  tone = "default",
  contained = true,
  className,
}: StatsProps) {
  const t = tones[tone]
  return (
    <section data-slot="stats" data-tone={tone} className={cn(contained && "container-page py-section-sm", className)}>
      {title ? <SectionHeading title={title} description={description} className="mb-10 md:mb-14" /> : null}
      <div className={cn("@container/stats", t.band)}>
        {/* The 1px gap shows the grid colour through, drawing hairlines between cells. */}
        <dl
          className={cn(
            "grid gap-px @min-[30rem]/stats:grid-cols-2 @min-[56rem]/stats:grid-cols-4",
            t.grid
          )}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col gap-4 py-8 @min-[30rem]/stats:py-10",
                "@min-[30rem]/stats:odd:pr-8 @min-[30rem]/stats:even:pl-8",
                "@min-[56rem]/stats:px-8 @min-[56rem]/stats:first:pl-0 @min-[56rem]/stats:last:pr-0",
                t.cell
              )}
            >
              {/* Label first in the DOM so it reads "label: value"; shown under the number. */}
              <dt className={`order-2 ${t.label}`}>{s.label}</dt>
              <dd className={`order-1 ${t.value}`}>{s.value}</dd>
              {s.detail ? <dd className={`order-3 -mt-2 ${t.detail}`}>{s.detail}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
