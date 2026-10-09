"use client"

import * as React from "react"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  LayoutGridIcon,
  ListIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import { Area, AreaChart } from "recharts"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * Deterministic sample series, so the server and the browser draw the same
 * line. Each range has its own number of points and its own shape.
 */
function series(points: number, base: number, growth: number, wave: number) {
  return Array.from({ length: points }, (_, i) => ({
    i,
    requests: Math.round(
      base * (1 + (growth * i) / points + wave * Math.sin(i * 0.9) + wave * 0.6 * Math.cos(i * 2.3))
    ),
  }))
}

const ranges = {
  "1h": { label: "the last hour", requests: "18.2K", change: "+4.1%", errors: "0.02%", data: series(12, 1500, 0.05, 0.08) },
  "24h": { label: "the last 24 hours", requests: "412K", change: "+12.6%", errors: "0.04%", data: series(24, 16000, 0.15, 0.18) },
  "7d": { label: "the last 7 days", requests: "2.9M", change: "+8.3%", errors: "0.05%", data: series(7, 400000, 0.1, 0.12) },
  "30d": { label: "the last 30 days", requests: "11.4M", change: "+21.0%", errors: "0.07%", data: series(30, 360000, 0.24, 0.1) },
} as const

type Range = keyof typeof ranges

const requestsConfig = {
  requests: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig

function RequestsCard() {
  const [range, setRange] = React.useState<Range>("24h")
  const data = ranges[range]

  return (
    <Card className="@container/requests w-full max-w-2xl">
      <CardHeader className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="grid gap-1.5">
          <CardTitle>Requests</CardTitle>
          <CardDescription>acme-web, production</CardDescription>
        </div>
        <ToggleGroup
          size="sm"
          aria-label="Time range"
          value={[range]}
          onValueChange={(value) => {
            if (value[0]) setRange(value[0] as Range)
          }}
        >
          {(Object.keys(ranges) as Range[]).map((key) => (
            <ToggleGroupItem key={key} value={key}>
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Each stat spans two rows of a shared subgrid, so the values line up even if a label wraps. */}
        <dl className="grid grid-cols-3 gap-x-4 gap-y-1">
          <div className="row-span-2 grid grid-rows-subgrid">
            <dt className="text-caption text-muted-foreground">Total</dt>
            <dd className="text-title text-foreground tabular-nums @md/requests:text-h3">{data.requests}</dd>
          </div>
          <div className="row-span-2 grid grid-rows-subgrid">
            <dt className="text-caption text-muted-foreground">Change</dt>
            <dd className="text-title text-success tabular-nums @md/requests:text-h3">{data.change}</dd>
          </div>
          <div className="row-span-2 grid grid-rows-subgrid">
            <dt className="text-caption text-muted-foreground">Error rate</dt>
            <dd className="text-title text-foreground tabular-nums @md/requests:text-h3">{data.errors}</dd>
          </div>
        </dl>
        <ChartContainer
          config={requestsConfig}
          role="img"
          aria-label={`Requests over ${data.label}, trending up`}
          className="aspect-auto h-28 w-full"
          initialDimension={{ width: 560, height: 112 }}
        >
          <AreaChart data={[...data.data]} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <Area
              dataKey="requests"
              type="monotone"
              stroke="var(--color-requests)"
              strokeWidth={2}
              fill="var(--color-requests)"
              fillOpacity={0.12}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function ToggleGroupDocs() {
  return (
    <Examples>
      <Example
        title="Segmented"
        description="The default look: pill items in a muted track, with the selected item in ink. One item is on at a time."
        code={`<ToggleGroup defaultValue={["24h"]} aria-label="Time range">
  <ToggleGroupItem value="1h">1h</ToggleGroupItem>
  <ToggleGroupItem value="24h">24h</ToggleGroupItem>
  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup defaultValue={["24h"]} aria-label="Time range">
          <ToggleGroupItem value="1h">1h</ToggleGroupItem>
          <ToggleGroupItem value="24h">24h</ToggleGroupItem>
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Icons"
        description="Icon-only items become circles. Label each one."
        code={`<ToggleGroup defaultValue={["list"]} aria-label="Layout">
  <ToggleGroupItem value="list" aria-label="List view"><ListIcon /></ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGridIcon /></ToggleGroupItem>
</ToggleGroup>

<ToggleGroup defaultValue={["system"]} aria-label="Theme">
  <ToggleGroupItem value="light">
    <SunIcon data-icon="inline-start" />
    Light
  </ToggleGroupItem>
  <ToggleGroupItem value="dark">
    <MoonIcon data-icon="inline-start" />
    Dark
  </ToggleGroupItem>
  <ToggleGroupItem value="system">
    <MonitorIcon data-icon="inline-start" />
    System
  </ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup defaultValue={["list"]} aria-label="Layout">
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGridIcon />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue={["system"]} aria-label="Theme">
          <ToggleGroupItem value="light">
            <SunIcon data-icon="inline-start" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark">
            <MoonIcon data-icon="inline-start" />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem value="system">
            <MonitorIcon data-icon="inline-start" />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Sizes"
        description="The track is exactly as tall as a button of the same size."
        code={`<ToggleGroup size="sm" defaultValue={["preview"]} aria-label="Environment">
  <ToggleGroupItem value="production">Production</ToggleGroupItem>
  <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup defaultValue={["preview"]} aria-label="Environment">
  <ToggleGroupItem value="production">Production</ToggleGroupItem>
  <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup size="lg" defaultValue={["preview"]} aria-label="Environment">
  <ToggleGroupItem value="production">Production</ToggleGroupItem>
  <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup size="sm" defaultValue={["preview"]} aria-label="Environment, small">
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue={["preview"]} aria-label="Environment, medium">
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup size="lg" defaultValue={["preview"]} aria-label="Environment, large">
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Multiple, as filters"
        description="Outline items with multiple turn on independently, like filter chips."
        code={`<ToggleGroup variant="outline" size="sm" multiple defaultValue={["production", "preview"]} aria-label="Environments">
  <ToggleGroupItem value="production">Production</ToggleGroupItem>
  <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
  <ToggleGroupItem value="development">Development</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup
          variant="outline"
          size="sm"
          multiple
          defaultValue={["production", "preview"]}
          aria-label="Environments"
        >
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
          <ToggleGroupItem value="development">Development</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Joined"
        description="Set spacing to 0 on an outline group to join the items into one pill with shared hairlines."
        code={`<ToggleGroup variant="outline" spacing={0} defaultValue={["left"]} aria-label="Text alignment">
  <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
</ToggleGroup>

<ToggleGroup variant="outline" spacing={0} multiple defaultValue={["error", "warn"]} aria-label="Log levels">
  <ToggleGroupItem value="info">Info</ToggleGroupItem>
  <ToggleGroupItem value="warn">Warn</ToggleGroupItem>
  <ToggleGroupItem value="error">Error</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup variant="outline" spacing={0} defaultValue={["left"]} aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          variant="outline"
          spacing={0}
          multiple
          defaultValue={["error", "warn"]}
          aria-label="Log levels"
        >
          <ToggleGroupItem value="info">Info</ToggleGroupItem>
          <ToggleGroupItem value="warn">Warn</ToggleGroupItem>
          <ToggleGroupItem value="error">Error</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Vertical and disabled"
        description="Stack the track for side panels; vertical items become rounded rectangles that nest in the track. Disable single items, or the whole group, which fades as one so the choice stays readable."
        code={`<ToggleGroup orientation="vertical" defaultValue={["iad1"]} aria-label="Region">
  <ToggleGroupItem value="iad1">Washington, D.C. (iad1)</ToggleGroupItem>
  <ToggleGroupItem value="fra1">Frankfurt (fra1)</ToggleGroupItem>
  <ToggleGroupItem value="syd1" disabled>Sydney (syd1)</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup disabled defaultValue={["preview"]} aria-label="Environment">
  <ToggleGroupItem value="production">Production</ToggleGroupItem>
  <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup orientation="vertical" defaultValue={["iad1"]} aria-label="Region">
          <ToggleGroupItem value="iad1">Washington, D.C. (iad1)</ToggleGroupItem>
          <ToggleGroupItem value="fra1">Frankfurt (fra1)</ToggleGroupItem>
          <ToggleGroupItem value="syd1" disabled>
            Sydney (syd1)
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup disabled defaultValue={["preview"]} aria-label="Environment">
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Chart range"
        description="A segmented control switches the range a chart card shows: the totals and the line update together. Controlled with value and onValueChange."
        surface="subtle"
        code={`const [range, setRange] = React.useState("24h")

<ToggleGroup
  size="sm"
  aria-label="Time range"
  value={[range]}
  onValueChange={(value) => value[0] && setRange(value[0])}
>
  <ToggleGroupItem value="1h">1h</ToggleGroupItem>
  <ToggleGroupItem value="24h">24h</ToggleGroupItem>
  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
</ToggleGroup>`}
      >
        <RequestsCard />
      </Example>

      <Guidelines
        do={[
          "Use the segmented track for two to five short, mutually exclusive options.",
          "Keep one item selected in a single-choice group. Ignore empty values in onValueChange.",
          "Use outline with multiple for filters that combine.",
          "Give the group an aria-label that names the choice.",
        ]}
        dont={[
          "Don’t use a toggle group to navigate between pages. Use tabs or links.",
          "Don’t put long labels in a track. If they wrap, use a select.",
          "Don’t mix icon-only and labelled items in one group.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "outline"', default: '"default"', description: "Segmented track, or separate outline pills." },
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Applies to every item. The track matches --button-height-*." },
          { prop: "spacing", type: "number", default: "1 (track), 2 (outline)", description: "Gap between items in spacing units. 0 joins outline items." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout and arrow-key direction." },
          { prop: "multiple", type: "boolean", default: "false", description: "Allow more than one item to be on." },
          { prop: "value", type: "string[]", description: "Controlled pressed items." },
          { prop: "defaultValue", type: "string[]", description: "Initial pressed items when uncontrolled." },
          { prop: "onValueChange", type: "(value: string[]) => void", description: "Called when the pressed items change." },
          { prop: "disabled", type: "boolean", default: "false", description: "Disables every item." },
        ]}
      />
    </Examples>
  )
}
