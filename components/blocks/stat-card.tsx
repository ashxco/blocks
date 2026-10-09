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
  /** The headline value, already formatted ("2.41M", "$1,284"). Pass units through `unit`. */
  value?: React.ReactNode
  /** Small unit after the value ("ms", "%", "/day"). */
  unit?: string
  /** Change against the previous period, in percent. Negative for a drop. */
  change?: number
  /** The period the change compares against. */
  changeLabel?: string
  /** Which direction is good news. Latency and error rates go down. */
  goodWhen?: "up" | "down"
  /** Recent values for the sparkline, oldest first. Pass [] to hide it. */
  trend?: number[]
  /** Optional icon beside the label. */
  icon?: LucideIcon
  /** "panel" renders a dark emphasis card. Use one per row at most. */
  tone?: "default" | "panel"
  className?: string
}

const defaultTrend = [42, 46, 44, 51, 49, 58, 55, 61, 64, 60, 71, 76]

function formatChange(change: number) {
  const abs = Math.abs(change)
  return `${abs.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
}

/**
 * A metric with its change against the previous period and a small trend.
 * Rendered with no props it shows Lumen edge requests for the last week.
 */
export function StatCard({
  label = "Edge requests",
  value = "2.41M",
  unit,
  change = 18.2,
  changeLabel = "vs previous 7 days",
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
      <div className="flex min-h-8 items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <Icon
              aria-hidden="true"
              className={cn("size-4 shrink-0", panel ? "text-panel-muted" : "text-muted-foreground")}
            />
          ) : null}
          <span className={cn("truncate text-label", panel ? "text-panel-muted" : "text-muted-foreground")}>
            {label}
          </span>
        </p>
        {trend.length > 1 ? (
          <Sparkline
            data={trend}
            // Ink, not brand: the trend's direction is told by the change below, in its own colour.
            className={cn(
              "hidden h-8 w-20 shrink-0 @min-[13rem]/stat:block",
              panel ? "text-panel-muted" : "text-muted-foreground"
            )}
          />
        ) : null}
      </div>

      <p className={cn("mt-4 text-h2 tabular", panel ? "text-panel-foreground" : "text-foreground")}>
        {value}
        {unit ? (
          <span className={cn("ml-1 align-baseline text-label", panel ? "text-panel-muted" : "text-muted-foreground")}>
            {unit}
          </span>
        ) : null}
      </p>
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
          {formatChange(change)}
        </span>
        <span className={panel ? "text-panel-muted" : "text-muted-foreground"}>
          {changeLabel}
        </span>
      </p>
    </Card>
  )
}
