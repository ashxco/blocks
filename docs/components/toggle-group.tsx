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
    completed: Math.round(
      base * (1 + (growth * i) / points + wave * Math.sin(i * 0.9) + wave * 0.6 * Math.cos(i * 2.3))
    ),
  }))
}

const ranges = {
  "7d": { label: "the last 7 days", completed: "312", change: "+6%", onTime: "94%", data: series(7, 42, 0.08, 0.12) },
  "30d": { label: "the last 30 days", completed: "1,284", change: "+12%", onTime: "92%", data: series(30, 38, 0.2, 0.14) },
  "90d": { label: "the last 90 days", completed: "3,702", change: "+18%", onTime: "90%", data: series(13, 260, 0.16, 0.1) },
  "1y": { label: "the last 12 months", completed: "13,960", change: "+34%", onTime: "89%", data: series(12, 980, 0.3, 0.08) },
} as const

type Range = keyof typeof ranges

const completedConfig = {
  completed: { label: "Tasks completed", color: "var(--chart-1)" },
} satisfies ChartConfig

function TasksCompletedCard() {
  const [range, setRange] = React.useState<Range>("30d")
  const data = ranges[range]

  return (
    <Card className="@container/completed w-full max-w-2xl">
      <CardHeader className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="grid gap-1.5">
          <CardTitle>Tasks completed</CardTitle>
          <CardDescription>All projects in Acme Inc.</CardDescription>
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
            <dt className="text-caption text-muted-foreground">Completed</dt>
            <dd className="text-title text-foreground tabular @md/completed:text-h3">{data.completed}</dd>
          </div>
          <div className="row-span-2 grid grid-rows-subgrid">
            <dt className="text-caption text-muted-foreground">Change</dt>
            <dd className="text-title text-success tabular @md/completed:text-h3">{data.change}</dd>
          </div>
          <div className="row-span-2 grid grid-rows-subgrid">
            <dt className="text-caption text-muted-foreground">On time</dt>
            <dd className="text-title text-foreground tabular @md/completed:text-h3">{data.onTime}</dd>
          </div>
        </dl>
        <ChartContainer
          config={completedConfig}
          role="img"
          aria-label={`Tasks completed over ${data.label}, trending up`}
          className="aspect-auto h-28 w-full"
          initialDimension={{ width: 560, height: 112 }}
        >
          <AreaChart data={[...data.data]} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <Area
              dataKey="completed"
              type="monotone"
              stroke="var(--color-completed)"
              strokeWidth={2}
              fill="var(--color-completed)"
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
        code={`<ToggleGroup defaultValue={["board"]} aria-label="Project view">
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="board">Board</ToggleGroupItem>
  <ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
  <ToggleGroupItem value="calendar">Calendar</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup defaultValue={["board"]} aria-label="Project view">
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
          <ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
          <ToggleGroupItem value="calendar">Calendar</ToggleGroupItem>
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
        code={`<ToggleGroup size="sm" defaultValue={["active"]} aria-label="Projects">
  <ToggleGroupItem value="active">Active</ToggleGroupItem>
  <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup defaultValue={["active"]} aria-label="Projects">
  <ToggleGroupItem value="active">Active</ToggleGroupItem>
  <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup size="lg" defaultValue={["active"]} aria-label="Projects">
  <ToggleGroupItem value="active">Active</ToggleGroupItem>
  <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup size="sm" defaultValue={["active"]} aria-label="Projects, small">
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue={["active"]} aria-label="Projects, medium">
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup size="lg" defaultValue={["active"]} aria-label="Projects, large">
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Multiple, as filters"
        description="Outline items with multiple turn on independently, like filter chips."
        code={`<ToggleGroup variant="outline" size="sm" multiple defaultValue={["urgent", "high"]} aria-label="Priority">
  <ToggleGroupItem value="urgent">Urgent</ToggleGroupItem>
  <ToggleGroupItem value="high">High</ToggleGroupItem>
  <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
  <ToggleGroupItem value="low">Low</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup
          variant="outline"
          size="sm"
          multiple
          defaultValue={["urgent", "high"]}
          aria-label="Priority"
        >
          <ToggleGroupItem value="urgent">Urgent</ToggleGroupItem>
          <ToggleGroupItem value="high">High</ToggleGroupItem>
          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem value="low">Low</ToggleGroupItem>
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

<ToggleGroup variant="outline" spacing={0} multiple defaultValue={["todo", "in-progress"]} aria-label="Task status">
  <ToggleGroupItem value="todo">To do</ToggleGroupItem>
  <ToggleGroupItem value="in-progress">In progress</ToggleGroupItem>
  <ToggleGroupItem value="done">Done</ToggleGroupItem>
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
          defaultValue={["todo", "in-progress"]}
          aria-label="Task status"
        >
          <ToggleGroupItem value="todo">To do</ToggleGroupItem>
          <ToggleGroupItem value="in-progress">In progress</ToggleGroupItem>
          <ToggleGroupItem value="done">Done</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Vertical and disabled"
        description="Stack the track for side panels; vertical items become rounded rectangles that nest in the track. Disable single items, or the whole group, which fades as one so the choice stays readable."
        code={`<ToggleGroup orientation="vertical" defaultValue={["member"]} aria-label="Role">
  <ToggleGroupItem value="guest">Guest</ToggleGroupItem>
  <ToggleGroupItem value="member">Member</ToggleGroupItem>
  <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
  <ToggleGroupItem value="owner" disabled>Owner</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup disabled defaultValue={["annual"]} aria-label="Billing period">
  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
  <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
</ToggleGroup>`}
      >
        <ToggleGroup orientation="vertical" defaultValue={["member"]} aria-label="Role">
          <ToggleGroupItem value="guest">Guest</ToggleGroupItem>
          <ToggleGroupItem value="member">Member</ToggleGroupItem>
          <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
          <ToggleGroupItem value="owner" disabled>
            Owner
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup disabled defaultValue={["annual"]} aria-label="Billing period">
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
        </ToggleGroup>
      </Example>

      <Example
        title="Chart range"
        description="A segmented control switches the range a chart card shows: the totals and the line update together. Controlled with value and onValueChange."
        surface="subtle"
        code={`const [range, setRange] = React.useState("30d")

<ToggleGroup
  size="sm"
  aria-label="Time range"
  value={[range]}
  onValueChange={(value) => value[0] && setRange(value[0])}
>
  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
  <ToggleGroupItem value="90d">90d</ToggleGroupItem>
  <ToggleGroupItem value="1y">1y</ToggleGroupItem>
</ToggleGroup>`}
      >
        <TasksCompletedCard />
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
