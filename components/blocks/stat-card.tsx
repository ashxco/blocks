import * as React from "react"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  type LucideIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkline } from "@/components/blocks/stat-card/sparkline"

export { Sparkline } from "@/components/blocks/stat-card/sparkline"

export interface StatCardProps {
  /** What is measured, in sentence case. */
  label?: string
  /** The headline value, already formatted ("1,284", "$216"). Pass units through `unit`. */
  value?: React.ReactNode
  /** Small unit after the value ("%", "days", "/day"). */
  unit?: string
  /** Change against the previous period. Negative for a drop. */
  change?: number
  /**
   * Unit of the change: "%" for a relative change (the default), or a
   * word such as "pts" or "days" for an absolute one. Pass "" for a count.
   */
  changeUnit?: string
  /** The period the change compares against. */
  changeLabel?: string
  /** Which direction is good news. Cycle time and overdue tasks go down. */
  goodWhen?: "up" | "down"
  /** Recent values for the sparkline, oldest first. Pass [] to hide it. */
  trend?: number[]
  /** Optional icon beside the label. */
  icon?: LucideIcon
  /** "panel" renders a dark emphasis card. Use one per row at most. */
  tone?: "default" | "panel"
  className?: string
}

/** Tasks completed per week across the workspace, the last twelve weeks. */
const defaultTrend = [236, 251, 244, 262, 258, 271, 266, 280, 277, 291, 286, 302]

function formatChange(change: number, unit: string) {
  const abs = Math.abs(change).toLocaleString("en-US", { maximumFractionDigits: 1 })
  if (unit === "%") return `${abs}%`
  return unit ? `${abs} ${unit}` : abs
}

/**
 * A metric with its change against the previous period and a small trend.
 * Rendered with no props it shows the tasks Acme Inc. completed this month.
 */
export function StatCard({
  label = "Tasks completed",
  value = "1,284",
  unit,
  change = 12,
  changeUnit = "%",
  changeLabel = "vs last month",
  goodWhen = "up",
  trend = defaultTrend,
  icon: Icon,
  tone = "default",
  className,
}: StatCardProps) {
  const panel = tone === "panel"
  const rising = change >= 0
  const good = goodWhen === "up" ? rising : !rising
  const ChangeIcon = rising ? ArrowUpRightIcon : ArrowDownRightIcon

  return (
    <Card
      data-slot="stat-card"
      data-tone={tone}
      className={cn(
        "@container/stat relative gap-0 p-(--card-padding)",
        panel && "border-panel-border bg-panel text-panel-foreground",
        className
      )}
    >
      {/* Narrow cards hold two lines for the label, so the figures in a row stay level. */}
      <p className="flex min-w-0 items-start gap-2 text-label @max-[11rem]/stat:min-h-[2lh]">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className={cn("mt-0.5 size-4 shrink-0", panel ? "text-panel-muted" : "text-muted-foreground")}
          />
        ) : null}
        {/* Wraps to a second line in narrow cards instead of cutting the label short. */}
        <span className={cn("line-clamp-2 text-label", panel ? "text-panel-muted" : "text-muted-foreground")}>
          {label}
        </span>
      </p>

      {/* The trend sits beside the figure, so the label keeps the full width. */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className={cn("min-w-0 text-h2 tabular", panel ? "text-panel-foreground" : "text-foreground")}>
          {value}
          {unit ? (
            <span className={cn("ml-1 align-baseline text-label", panel ? "text-panel-muted" : "text-muted-foreground")}>
              {unit}
            </span>
          ) : null}
        </p>
        {trend.length > 1 ? (
          <Sparkline
            data={trend}
            // Ink, not brand: the trend's direction is told by the change below, in its own colour.
            className={cn(
              "mb-1.5 hidden h-8 w-20 shrink-0 @min-[13rem]/stat:block",
              panel ? "text-panel-muted" : "text-muted-foreground"
            )}
          />
        ) : null}
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-semibold tabular",
            panel
              ? good ? "text-panel-success" : "text-panel-destructive"
              : good ? "text-success" : "text-destructive"
          )}
        >
          <ChangeIcon aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{rising ? "Up" : "Down"}</span>
          {formatChange(change, changeUnit)}
        </span>
        {/* Narrow cards always put the period on its own line, so every card in a row ends level. */}
        <span className={cn("@max-[11rem]/stat:basis-full", panel ? "text-panel-muted" : "text-muted-foreground")}>
          {changeLabel}
        </span>
      </p>
    </Card>
  )
}
