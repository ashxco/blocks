"use client"

import * as React from "react"
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type ChartPeriod = "7d" | "30d" | "90d"

export interface ChartPoint {
  /** Day in ISO format, e.g. "2026-10-06". */
  date: string
  /** Value for the day. */
  value: number
  /** Value for the same day in the previous period, for the comparison line. */
  previous?: number
}

export interface ChartCardProps {
  title?: string
  description?: string
  /** Area for continuous measures, bar for counts per day. */
  type?: "area" | "bar"
  /** One point per day, oldest first. Provide at least as many days as the longest period. */
  data?: ChartPoint[]
  /** Period selected on first render. */
  defaultPeriod?: ChartPeriod
  /** Periods offered in the switch. Pass one to hide the switch. */
  periods?: ChartPeriod[]
  /** Name of the series in the tooltip. */
  seriesLabel?: string
  /** Draw the previous period as a dashed line (area charts only). */
  showComparison?: boolean
  /** How values are formatted in the summary, axis and tooltip. */
  valueFormat?: "compact" | "number" | "ms" | "percent"
  /** Which chart token colours the series. */
  color?: 1 | 2 | 3 | 4
  /** Which direction is good news for the summary change. */
  goodWhen?: "up" | "down"
  className?: string
}

const swatch = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
} as const

const periodDays: Record<ChartPeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}
const periodNames: Record<ChartPeriod, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
}

/** Deterministic pseudo-random numbers, so server and client render the same data. */
function seeded(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function buildDefaultData(): ChartPoint[] {
  const random = seeded(20261006)
  const end = Date.UTC(2026, 9, 6)
  const day = 24 * 60 * 60 * 1000
  return Array.from({ length: 90 }, (_, index) => {
    const time = end - (89 - index) * day
    const weekday = new Date(time).getUTCDay()
    const weekend = weekday === 0 || weekday === 6 ? 0.72 : 1
    const growth = 1 + index * 0.0045
    const value = Math.round(268000 * growth * weekend * (0.9 + random() * 0.2))
    const previous = Math.round(
      242000 * (1 + index * 0.002) * weekend * (0.9 + random() * 0.2)
    )
    return { date: new Date(time).toISOString().slice(0, 10), value, previous }
  })
}

const defaultData = buildDefaultData()

const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
})
const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

function formatValue(
  value: number,
  format: NonNullable<ChartCardProps["valueFormat"]>
) {
  switch (format) {
    case "number":
      return numberFormat.format(value)
    case "ms":
      return `${numberFormat.format(value)} ms`
    case "percent":
      return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`
    default:
      return compactFormat.format(value)
  }
}

function formatDay(date: string, long = false) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: long ? "numeric" : undefined,
    timeZone: "UTC",
  })
}

/**
 * A titled chart with a 7, 30 and 90 day switch, a summary figure and the
 * change against the previous period. Fills are flat; colours come from the
 * chart tokens. Rendered with no props it shows Lumen edge requests.
 */
export function ChartCard({
  title = "Edge requests",
  description = "Requests served across every project and region.",
  type = "area",
  data = defaultData,
  defaultPeriod = "30d",
  periods = ["7d", "30d", "90d"],
  seriesLabel = "Requests",
  showComparison = true,
  valueFormat = "compact",
  color = 1,
  goodWhen = "up",
  className,
}: ChartCardProps) {
  const [period, setPeriod] = React.useState<ChartPeriod>(defaultPeriod)
  const titleId = React.useId()

  const visible = React.useMemo(
    () => data.slice(-periodDays[period]),
    [data, period]
  )

  const averaged = valueFormat === "ms" || valueFormat === "percent"
  const reduce = (key: "value" | "previous") => {
    const values = visible.map((point) => point[key] ?? 0)
    const sum = values.reduce((total, value) => total + value, 0)
    return averaged ? sum / Math.max(values.length, 1) : sum
  }
  const current = reduce("value")
  const previous = reduce("previous")
  const hasPrevious = visible.some((point) => point.previous !== undefined)
  const change =
    hasPrevious && previous > 0 ? ((current - previous) / previous) * 100 : null
  const rising = (change ?? 0) >= 0
  const good = goodWhen === "up" ? rising : !rising
  const ChangeIcon = rising ? ArrowUpRightIcon : ArrowDownRightIcon
  const comparison = type === "area" && showComparison && hasPrevious

  const config = {
    value: { label: seriesLabel, color: `var(--chart-${color})` },
    previous: { label: "Previous period", color: "var(--chart-5)" },
  } satisfies ChartConfig

  return (
    <Card
      data-slot="chart-card"
      aria-labelledby={titleId}
      className={cn("@container/chart gap-0 p-0", className)}
    >
      <div className="grid gap-6 p-(--card-padding) pb-2">
        <div className="flex flex-col gap-4 @min-[30rem]/chart:flex-row @min-[30rem]/chart:items-start @min-[30rem]/chart:justify-between">
          <div className="grid min-w-0 gap-1">
            <h3 id={titleId} className="text-title text-foreground">
              {title}
            </h3>
            {description ? (
              <p className="text-caption text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {periods.length > 1 ? (
            <ToggleGroup
              aria-label="Period"
              size="sm"
              value={[period]}
              onValueChange={(value) => {
                const next = value[0] as ChartPeriod | undefined
                if (next) setPeriod(next)
              }}
              className="shrink-0"
            >
              {periods.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={`Show ${periodNames[option]}`}
                  className="tabular"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : null}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="grid gap-1">
            <p className="text-h3 text-foreground tabular">
              {formatValue(current, valueFormat)}
            </p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
              {change !== null ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-semibold tabular",
                    good ? "text-success" : "text-destructive"
                  )}
                >
                  <ChangeIcon aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">{rising ? "Up" : "Down"}</span>
                  {Math.abs(change).toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}
                  %
                </span>
              ) : null}
              <span className="text-muted-foreground">
                {averaged ? "Average, " : "Total, "}
                {periodNames[period]}
              </span>
            </p>
          </div>
          {comparison ? (
            <ul
              aria-label="Legend"
              className="flex items-center gap-4 text-caption text-muted-foreground"
            >
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn("h-0.5 w-4 rounded-full", swatch[color])}
                />
                {seriesLabel}
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-4 border-t-2 border-dashed border-chart-5"
                />
                Previous period
              </li>
            </ul>
          ) : null}
        </div>
      </div>

      <ChartContainer
        config={config}
        className="aspect-auto h-64 w-full px-2 pb-4 @min-[40rem]/chart:h-72"
      >
        {type === "bar" ? (
          <BarChart
            data={visible}
            margin={{ top: 12, right: 16, bottom: 0, left: 4 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
              tickFormatter={(value: string) => formatDay(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) =>
                formatValue(
                  value,
                  valueFormat === "number" ? "compact" : valueFormat
                )
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDay(String(value), true)}
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={visible}
            margin={{ top: 12, right: 16, bottom: 0, left: 4 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
              tickFormatter={(value: string) => formatDay(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) =>
                formatValue(
                  value,
                  valueFormat === "number" ? "compact" : valueFormat
                )
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => formatDay(String(value), true)}
                />
              }
            />
            {comparison ? (
              <Area
                dataKey="previous"
                type="monotone"
                stroke="var(--color-previous)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                isAnimationActive={false}
              />
            ) : null}
            <Area
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              fill="var(--color-value)"
              fillOpacity={0.1}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        )}
      </ChartContainer>
    </Card>
  )
}
