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

/*
 * The last 14 days of the dashboard's chart, to Oct 9: 596 tasks, 12% more
 * than the same days of the period before (531). The 30 days to Oct 9 add up
 * to 1,284, the dashboard's "Tasks completed". Weekends are quiet.
 */
const days = ["Sep 26", "Sep 27", "Sep 28", "Sep 29", "Sep 30", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9"]

const completed = [27, 29, 45, 49, 44, 52, 51, 31, 27, 44, 51, 49, 49, 48].map((value, i) => ({
  day: days[i],
  completed: value,
}))

const completedTotal = completed.reduce((sum, d) => sum + d.completed, 0)

/* Last week, Sep 28 to Oct 4: the same daily totals as above, 92% of them on time. */
const delivery = [
  { day: "Mon", onTime: 41, late: 4 },
  { day: "Tue", onTime: 45, late: 4 },
  { day: "Wed", onTime: 40, late: 4 },
  { day: "Thu", onTime: 49, late: 3 },
  { day: "Fri", onTime: 47, late: 4 },
  { day: "Sat", onTime: 29, late: 2 },
  { day: "Sun", onTime: 25, late: 2 },
]

const workload = [
  { week: "Aug 17", jordan: 14, sofia: 11, sam: 9 },
  { week: "Aug 24", jordan: 16, sofia: 12, sam: 8 },
  { week: "Aug 31", jordan: 19, sofia: 10, sam: 11 },
  { week: "Sep 7", jordan: 22, sofia: 13, sam: 10 },
  { week: "Sep 14", jordan: 24, sofia: 15, sam: 9 },
  { week: "Sep 21", jordan: 21, sofia: 17, sam: 12 },
  { week: "Sep 28", jordan: 18, sofia: 12, sam: 14 },
  { week: "Oct 5", jordan: 17, sofia: 9, sam: 13 },
]

const cycleTime = [4.6, 4.5, 4.7, 4.3, 4.2, 4, 4.1, 3.9, 3.8, 3.7, 3.5, 3.4].map((days, i) => ({ week: i, days }))

const completedConfig = {
  completed: { label: "Completed", color: "var(--chart-1)" },
} satisfies ChartConfig

const deliveryConfig = {
  onTime: { label: "On time", color: "var(--chart-1)" },
  late: { label: "Late", color: "var(--chart-5)" },
} satisfies ChartConfig

const workloadConfig = {
  jordan: { label: "Jordan Lee", color: "var(--chart-1)" },
  sofia: { label: "Sofia Alvarez", color: "var(--chart-2)" },
  sam: { label: "Sam Okafor", color: "var(--chart-3)" },
} satisfies ChartConfig

const cycleConfig = {
  days: { label: "Days", color: "var(--chart-1)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")

const frame = "w-full rounded-(--card-radius) border border-border bg-card p-(--card-padding)"

export default function ChartDocs() {
  return (
    <Examples>
      <Example
        title="Area"
        layout="stack"
        description="One series over time. A 2px line over a flat fill at 12% opacity, with horizontal grid lines only."
        code={`const config = {
  completed: { label: "Completed", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={config} className="aspect-auto h-64 w-full">
  <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} interval="equidistantPreserveStart" />
    <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
    <Area
      {...chartMotion}
      dataKey="completed"
      type="monotone"
      stroke="var(--color-completed)"
      strokeWidth={2}
      fill="var(--color-completed)"
      fillOpacity={0.12}
      activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
    />
  </AreaChart>
</ChartContainer>`}
      >
        <div className={frame}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <p className="text-label text-muted-foreground">Tasks completed, last 14 days</p>
              <p className="text-h3 text-foreground tabular-nums">{count.format(completedTotal)}</p>
            </div>
            <p className="inline-flex items-center gap-1 text-label text-success tabular-nums">
              <ArrowUpRightIcon aria-hidden="true" className="size-4" />
              12% on the previous 14 days
            </p>
          </div>
          <ChartContainer config={completedConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={completed} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} interval="equidistantPreserveStart" />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                {...chartMotion}
                dataKey="completed"
                type="monotone"
                stroke="var(--color-completed)"
                strokeWidth={2}
                fill="var(--color-completed)"
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
  onTime: { label: "On time", color: "var(--chart-1)" },
  late: { label: "Late", color: "var(--chart-5)" },
} satisfies ChartConfig

<ChartContainer config={config} className="aspect-auto h-64 w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend verticalAlign="top" itemSorter={null} content={<ChartLegendContent />} />
    <Bar dataKey="onTime" stackId="a" fill="var(--color-onTime)" stroke="var(--card)" strokeWidth={2} />
    <Bar dataKey="late" stackId="a" fill="var(--color-late)" stroke="var(--card)" strokeWidth={2} radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>`}
      >
        <div className={frame}>
          <div className="mb-2 grid gap-1">
            <p className="text-title text-foreground">On-time delivery</p>
            <p className="text-caption text-muted-foreground">Tasks completed last week, by due date</p>
          </div>
          <ChartContainer config={deliveryConfig} className="aspect-auto h-64 w-full">
            <BarChart data={delivery} margin={{ left: 0, right: 0, top: 0 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend verticalAlign="top" align="right" itemSorter={null} content={<ChartLegendContent className="justify-end" />} />
              <Bar
                {...chartMotion}
                dataKey="onTime"
                stackId="delivery"
                fill="var(--color-onTime)"
                stroke="var(--card)"
                strokeWidth={2}
                maxBarSize={40}
              />
              <Bar
                {...chartMotion}
                dataKey="late"
                stackId="delivery"
                fill="var(--color-late)"
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
  jordan: { label: "Jordan Lee", color: "var(--chart-1)" },
  sofia: { label: "Sofia Alvarez", color: "var(--chart-2)" },
  sam: { label: "Sam Okafor", color: "var(--chart-3)" },
} satisfies ChartConfig

<LineChart data={data}>
  <CartesianGrid vertical={false} />
  <XAxis dataKey="week" tickLine={false} axisLine={false} />
  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
  <ChartTooltip content={<ChartTooltipContent />} />
  <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
  <Line dataKey="jordan" stroke="var(--color-jordan)" strokeWidth={2} dot={false} />
  …
</LineChart>`}
      >
        <div className={frame}>
          <div className="mb-6 grid gap-1">
            <p className="text-title text-foreground">Workload by member</p>
            <p className="text-caption text-muted-foreground">Open tasks at the start of each week, across all projects</p>
          </div>
          <ChartContainer config={workloadConfig} className="aspect-auto h-64 w-full">
            <LineChart data={workload} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} minTickGap={16} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
              {(["jordan", "sofia", "sam"] as const).map((key) => (
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
              <ChartContainer config={deliveryConfig} className="aspect-auto h-60 w-full">
                <BarChart data={delivery} margin={{ left: 0, right: 0, top: 84 }}>
                  <XAxis dataKey="day" hide />
                  <ChartTooltip
                    defaultIndex={4}
                    position={{ y: 0 }}
                    cursor={false}
                    content={<ChartTooltipContent indicator={indicator} />}
                  />
                  <Bar {...chartMotion} dataKey="onTime" stackId="d" fill="var(--color-onTime)" stroke="var(--card)" strokeWidth={2} />
                  <Bar
                    {...chartMotion}
                    dataKey="late"
                    stackId="d"
                    fill="var(--color-late)"
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
              <p className="text-label text-muted-foreground">Average cycle time</p>
              <p className="text-h3 text-foreground tabular-nums">3.4 days</p>
            </div>
            <p className="text-caption font-semibold text-muted-foreground tabular-nums">12 weeks</p>
          </div>
          <ChartContainer config={cycleConfig} className="aspect-auto h-20 w-full">
            <AreaChart data={cycleTime} margin={{ left: 2, right: 2, top: 6, bottom: 2 }}>
              {/* A domain fitted to the values, so the drop from 4.6 to 3.4 days fills the height. */}
              <YAxis hide domain={["dataMin - 0.3", "dataMax + 0.1"]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
              <Area
                {...chartMotion}
                dataKey="days"
                type="monotone"
                baseValue="dataMin"
                stroke="var(--color-days)"
                strokeWidth={2}
                fill="var(--color-days)"
                fillOpacity={0.12}
                activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </AreaChart>
          </ChartContainer>
          <p className="text-caption text-copy">
            Down from 4.6 days in July, after teams started splitting large tasks into subtasks.
          </p>
        </div>
      </Example>

      <Guidelines
        do={[
          "Colour series from var(--chart-1) to var(--chart-5) in that order, through the config.",
          "Use flat area fills at 10 to 15% opacity and 2px lines.",
          "Keep grids horizontal and quiet; hide axis lines and tick marks.",
          "Add a legend whenever there are two or more series, and keep a table of the numbers nearby for exact reading.",
          "Pass itemSorter={null} to ChartLegend so the legend lists series in config order; Recharts sorts it alphabetically by default.",
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
