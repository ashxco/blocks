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

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ranges = {
  "1h": { requests: "18.2K", change: "+4.1%", errors: "0.02%" },
  "24h": { requests: "412K", change: "+12.6%", errors: "0.04%" },
  "7d": { requests: "2.9M", change: "+8.3%", errors: "0.05%" },
  "30d": { requests: "11.4M", change: "+21.0%", errors: "0.07%" },
} as const

type Range = keyof typeof ranges

function RequestsCard() {
  const [range, setRange] = React.useState<Range>("24h")
  const data = ranges[range]

  return (
    <div className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-title text-foreground">Requests</h3>
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
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="grid gap-1">
          <p className="text-caption text-muted-foreground">Total requests</p>
          <p className="text-h3 text-foreground tabular-nums">{data.requests}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-caption text-muted-foreground">Change</p>
          <p className="text-h3 text-success tabular-nums">{data.change}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-caption text-muted-foreground">Error rate</p>
          <p className="text-h3 text-foreground tabular-nums">{data.errors}</p>
        </div>
      </div>
    </div>
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
        code={`<ToggleGroup variant="outline" multiple defaultValue={["production", "preview"]} aria-label="Environments">
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

      <Example title="Vertical and disabled" description="Stack the track for side panels. Disable the whole group or single items.">
        <ToggleGroup orientation="vertical" defaultValue={["iad1"]} aria-label="Region">
          <ToggleGroupItem value="iad1">Washington, iad1</ToggleGroupItem>
          <ToggleGroupItem value="fra1">Frankfurt, fra1</ToggleGroupItem>
          <ToggleGroupItem value="syd1" disabled>
            Sydney, syd1
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup disabled defaultValue={["preview"]} aria-label="Environment">
          <ToggleGroupItem value="production">Production</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Chart range"
        description="A segmented control switches what a card shows. Controlled with value and onValueChange."
        layout="stack"
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
