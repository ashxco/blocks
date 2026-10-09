"use client"

import { ArrowUpRightIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  chartMotion,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/* Deterministic sample data, so server and client render the same numbers. */

const days = ["Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29", "Sep 30", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8"]

const requests = [182, 196, 171, 148, 204, 219, 226, 241, 233, 198, 176, 248, 262, 271].map((value, i) => ({
  day: days[i],
  requests: value * 1000,
}))

const deploys = [
  { day: "Mon", production: 14, preview: 38 },
  { day: "Tue", production: 18, preview: 44 },
  { day: "Wed", production: 11, preview: 51 },
  { day: "Thu", production: 22, preview: 47 },
  { day: "Fri", production: 9, preview: 29 },
  { day: "Sat", production: 3, preview: 8 },
  { day: "Sun", production: 2, preview: 6 },
]

const latency = [
  { time: "00:00", iad: 112, fra: 128, sin: 164 },
  { time: "03:00", iad: 104, fra: 121, sin: 171 },
  { time: "06:00", iad: 118, fra: 139, sin: 158 },
  { time: "09:00", iad: 142, fra: 152, sin: 149 },
  { time: "12:00", iad: 156, fra: 147, sin: 143 },
  { time: "15:00", iad: 149, fra: 133, sin: 152 },
  { time: "18:00", iad: 138, fra: 126, sin: 167 },
  { time: "21:00", iad: 121, fra: 119, sin: 174 },
]

const buildMinutes = [42, 38, 51, 47, 55, 49, 61, 58, 64, 60, 71, 68].map((minutes, i) => ({ week: i, minutes }))

const requestsConfig = {
  requests: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig

const deploysConfig = {
  production: { label: "Production", color: "var(--chart-1)" },
  preview: { label: "Preview", color: "var(--chart-5)" },
} satisfies ChartConfig

const latencyConfig = {
  iad: { label: "Washington, D.C.", color: "var(--chart-1)" },
  fra: { label: "Frankfurt", color: "var(--chart-2)" },
  sin: { label: "Singapore", color: "var(--chart-3)" },
} satisfies ChartConfig

const minutesConfig = {
  minutes: { label: "Build minutes", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })

const frame = "w-full rounded-(--card-radius) border border-border bg-card p-(--card-padding)"

export default function ChartDocs() {
  return (
    <Examples>
      <Example
        title="Area"
        layout="stack"
        description="One series over time. A 2px line over a flat fill at 12% opacity, with horizontal grid lines only."
        code={`const config = {
  requests: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={config} className="aspect-auto h-64 w-full">
  <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} />
    <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={compact.format} />
    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
    <Area
      {...chartMotion}
      dataKey="requests"
      type="monotone"
      stroke="var(--color-requests)"
      strokeWidth={2}
      fill="var(--color-requests)"
      fillOpacity={0.12}
      activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
    />
  </AreaChart>
</ChartContainer>`}
      >
        <div className={frame}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <p className="text-label text-muted-foreground">Edge requests, last 14 days</p>
              <p className="text-h3 text-foreground tabular-nums">2.98M</p>
            </div>
            <p className="inline-flex items-center gap-1 text-label text-success tabular-nums">
              <ArrowUpRightIcon aria-hidden="true" className="size-4" />
              12.4% on the previous 14 days
            </p>
          </div>
          <ChartContainer config={requestsConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={requests} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(value: number) => compact.format(value)}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                {...chartMotion}
                dataKey="requests"
                type="monotone"
                stroke="var(--color-requests)"
                strokeWidth={2}
                fill="var(--color-requests)"
                fillOpacity={0.12}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Example>

      <Example
        title="Stacked bars"
        layout="stack"
        description="Counts per day. Parts of a whole stack with a 2px gap in the card colour; only the top segment gets rounded ends. Two or more series always get a legend."
        code={`const config = {
  production: { label: "Production", color: "var(--chart-1)" },
  preview: { label: "Preview", color: "var(--chart-5)" },
} satisfies ChartConfig

<ChartContainer config={config} className="aspect-auto h-64 w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
    <Bar dataKey="production" stackId="a" fill="var(--color-production)" stroke="var(--card)" strokeWidth={2} />
    <Bar dataKey="preview" stackId="a" fill="var(--color-preview)" stroke="var(--card)" strokeWidth={2} radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>`}
      >
        <div className={frame}>
          <ChartContainer config={deploysConfig} className="aspect-auto h-64 w-full">
            <BarChart data={deploys} margin={{ left: 0, right: 0, top: 0 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend verticalAlign="top" align="right" content={<ChartLegendContent className="justify-end" />} />
              <Bar
                {...chartMotion}
                dataKey="production"
                stackId="deploys"
                fill="var(--color-production)"
                stroke="var(--card)"
                strokeWidth={2}
                maxBarSize={40}
              />
              <Bar
                {...chartMotion}
                dataKey="preview"
                stackId="deploys"
                fill="var(--color-preview)"
                stroke="var(--card)"
                strokeWidth={2}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </Example>

      <Example
        title="Lines"
        layout="stack"
        description="Compare a few series on one scale. Series take chart colours in order, 1 to 5, and keep them when filters change."
        code={`const config = {
  iad: { label: "Washington, D.C.", color: "var(--chart-1)" },
  fra: { label: "Frankfurt", color: "var(--chart-2)" },
  sin: { label: "Singapore", color: "var(--chart-3)" },
} satisfies ChartConfig

<LineChart data={data}>
  <CartesianGrid vertical={false} />
  <XAxis dataKey="time" tickLine={false} axisLine={false} />
  <YAxis tickLine={false} axisLine={false} unit=" ms" />
  <ChartTooltip content={<ChartTooltipContent />} />
  <ChartLegend content={<ChartLegendContent />} />
  <Line dataKey="iad" stroke="var(--color-iad)" strokeWidth={2} dot={false} />
  …
</LineChart>`}
      >
        <div className={frame}>
          <div className="mb-6 grid gap-1">
            <p className="text-title text-foreground">p95 response time by region</p>
            <p className="text-caption text-muted-foreground">Today, in milliseconds, for lumen-api</p>
          </div>
          <ChartContainer config={latencyConfig} className="aspect-auto h-64 w-full">
            <LineChart data={latency} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} width={44} domain={[80, 200]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {(["iad", "fra", "sin"] as const).map((key) => (
                <Line
                  {...chartMotion}
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </Example>

      <Example
        title="Tooltip indicators"
        description="The tooltip is a small overlay: popover surface, hairline border, overlay radius. Pick a dot, line or dashed indicator to echo the mark."
        code={`<ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
<ChartTooltip content={<ChartTooltipContent indicator="line" />} />
<ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          {(["dot", "line", "dashed"] as const).map((indicator) => (
            <div key={indicator} className="grid gap-3 rounded-(--card-radius) border border-border bg-card p-4">
              <p className="font-mono text-xs text-muted-foreground">indicator=&quot;{indicator}&quot;</p>
              {/* The tooltip is pinned in a band above the bars, so it never covers them. */}
              <ChartContainer config={deploysConfig} className="aspect-auto h-60 w-full">
                <BarChart data={deploys} margin={{ left: 0, right: 0, top: 84 }}>
                  <XAxis dataKey="day" hide />
                  <ChartTooltip
                    defaultIndex={4}
                    position={{ y: 0 }}
                    cursor={false}
                    content={<ChartTooltipContent indicator={indicator} />}
                  />
                  <Bar {...chartMotion} dataKey="production" stackId="d" fill="var(--color-production)" stroke="var(--card)" strokeWidth={2} />
                  <Bar
                    {...chartMotion}
                    dataKey="preview"
                    stackId="d"
                    fill="var(--color-preview)"
                    stroke="var(--card)"
                    strokeWidth={2}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Sparkline in a stat"
        description="Without axes or grid, a chart becomes a trend line under a headline number. Keep the tooltip so the exact values are still one hover away."
      >
        <div className="grid w-full max-w-sm gap-5 rounded-(--card-radius) border border-border bg-card p-(--card-padding)">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-1">
              <p className="text-label text-muted-foreground">Build minutes per week</p>
              <p className="text-h3 text-foreground tabular-nums">68 min</p>
            </div>
            <p className="text-caption font-semibold text-muted-foreground tabular-nums">12 weeks</p>
          </div>
          <ChartContainer config={minutesConfig} className="aspect-auto h-20 w-full">
            <AreaChart data={buildMinutes} margin={{ left: 2, right: 2, top: 6, bottom: 2 }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
              <Area
                {...chartMotion}
                dataKey="minutes"
                type="monotone"
                stroke="var(--color-minutes)"
                strokeWidth={2}
                fill="var(--color-minutes)"
                fillOpacity={0.12}
                activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </AreaChart>
          </ChartContainer>
          <p className="text-caption text-copy">
            Up from 42 minutes in July. Caching build output saved about 9 minutes a week.
          </p>
        </div>
      </Example>

      <Guidelines
        do={[
          "Colour series from var(--chart-1) to var(--chart-5) in that order, through the config.",
          "Use flat area fills at 10 to 15% opacity and 2px lines.",
          "Keep grids horizontal and quiet; hide axis lines and tick marks.",
          "Add a legend whenever there are two or more series, and keep a table of the numbers nearby for exact reading.",
        ]}
        dont={[
          "Don’t use gradient defs, glows or drop shadows on marks.",
          "Don’t put two different scales on one chart; split it into two charts.",
          "Don’t use status colours (success, warning, destructive) as series colours.",
          "Don’t print a value on every point; let the tooltip carry them.",
        ]}
      />

      <ApiTable
        title="ChartContainer"
        rows={[
          { prop: "config", type: "ChartConfig", description: "Label, icon and colour per series key. Each colour becomes var(--color-<key>) inside the chart." },
          { prop: "className", type: "string", default: '"aspect-video"', description: "Size the chart. Use aspect-auto with a fixed height, such as h-64, in cards." },
          { prop: "initialDimension", type: "{ width: number; height: number }", default: "{ width: 320, height: 200 }", description: "Size used before the container is measured." },
        ]}
      />

      <ApiTable
        title="Series motion"
        rows={[
          { prop: "{...chartMotion}", type: "{ animationDuration: number; animationEasing: string }", default: "560, \"ease-out\"", description: "Spread on every Area, Bar and Line so series draw in --duration-slower instead of Recharts’ 1.5s. Recharts skips it when people ask for reduced motion." },
        ]}
      />

      <ApiTable
        title="ChartTooltipContent"
        rows={[
          { prop: "indicator", type: '"dot" | "line" | "dashed"', default: '"dot"', description: "Mark next to each value." },
          { prop: "hideLabel", type: "boolean", default: "false", description: "Hide the heading, for sparklines and single values." },
          { prop: "hideIndicator", type: "boolean", default: "false", description: "Hide the colour mark." },
          { prop: "labelFormatter", type: "(label, payload) => ReactNode", description: "Format the heading, for example a full date." },
          { prop: "formatter", type: "(value, name, item, index, payload) => ReactNode", description: "Render each row yourself." },
          { prop: "nameKey / labelKey", type: "string", description: "Read series names or the heading from another key in the data." },
        ]}
      />
    </Examples>
  )
}
