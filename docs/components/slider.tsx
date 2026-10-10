"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const formatRuns = (runs: number) => `${runs.toLocaleString("en-US")} runs`

function SliderHeader({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Label id={id}>{label}</Label>
      <output
        aria-hidden="true"
        className="text-label text-foreground tabular group-data-[disabled=true]/field:opacity-50"
      >
        {value}
      </output>
    </div>
  )
}

/** The ends of the track, in muted caption type under it. */
function SliderScale({ min, max }: { min: string; max: string }) {
  return (
    <div aria-hidden="true" className="-mt-1.5 flex justify-between text-caption text-muted-foreground tabular">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  )
}

const tasks = (n: number) => `${n} ${n === 1 ? "task" : "tasks"}`

function WorkInProgressLimit() {
  const [value, setValue] = React.useState(4)
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SliderHeader id="sl-wip" label="In progress limit" value={tasks(value)} />
      <Slider
        aria-labelledby="sl-wip"
        min={1}
        max={10}
        value={value}
        onValueChange={(v) => setValue(v as number)}
        getAriaValueText={(_, v) => `${tasks(v)} in progress at once`}
      />
      <SliderScale min="1" max="10" />
    </div>
  )
}

const teams = [
  { id: "design", label: "Design", value: 80 },
  { id: "engineering", label: "Engineering", value: 70 },
  { id: "marketing", label: "Marketing", value: 90 },
]

function WorkloadAlerts() {
  const [values, setValues] = React.useState<Record<string, number>>(
    Object.fromEntries(teams.map((t) => [t.id, t.value]))
  )
  return (
    <div role="group" aria-labelledby="sl-workload" className="grid justify-items-start gap-5">
      <Label id="sl-workload">Workload alerts</Label>
      <div className="flex gap-10">
        {teams.map((t) => (
          <div key={t.id} className="grid h-56 grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-3">
            <Slider
              orientation="vertical"
              aria-labelledby={`sl-${t.id}`}
              value={values[t.id]}
              onValueChange={(v) => setValues((current) => ({ ...current, [t.id]: v as number }))}
              getAriaValueText={(_, v) => `Alert above ${v}% booked`}
            />
            <div className="grid justify-items-center">
              <span id={`sl-${t.id}`} className="text-caption text-muted-foreground">
                {t.label}
              </span>
              <output aria-hidden="true" className="text-label text-foreground tabular">
                {values[t.id]}%
              </output>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const days = (n: number) => (n === 0 ? "today" : `${n} ${n === 1 ? "day" : "days"}`)

function DueWindow() {
  const [range, setRange] = React.useState<number[]>([2, 8])
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SliderHeader id="sl-due" label="Due within" value={range[0] === 0 ? `Today–${days(range[1])}` : `${range[0]}–${range[1]} days`} />
      <Slider
        aria-labelledby="sl-due"
        min={0}
        max={30}
        minStepsBetweenValues={1}
        value={range}
        onValueChange={(v) => setRange([...(v as readonly number[])])}
        getAriaLabel={(index) => (index === 0 ? "Earliest due date" : "Latest due date")}
        getAriaValueText={(_, v) => (v === 0 ? "Today" : `${days(v)} from today`)}
      />
      <SliderScale min="Today" max="30 days" />
      <p className="text-caption text-pretty text-muted-foreground">
        Shows tasks due {range[0] === 0 ? "from today" : `${days(range[0])} from now`} up to {days(range[1])} from now.
      </p>
    </div>
  )
}

function AutomationBudget() {
  const [runs, setRuns] = React.useState(2500)
  const [alertAt, setAlertAt] = React.useState(80)
  const [status, setStatus] = React.useState<"clean" | "dirty" | "saved">("clean")

  return (
    <Card className="@container/budget w-full max-w-md">
      <CardHeader>
        <CardTitle>Automation budget</CardTitle>
        <CardDescription className="text-pretty">
          Caps the runs that rules in <span className="whitespace-nowrap">Website relaunch</span> can use each month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Field>
          <SliderHeader id="sl-runs" label="Monthly runs" value={formatRuns(runs)} />
          <Slider
            aria-labelledby="sl-runs"
            min={250}
            max={10000}
            step={250}
            value={runs}
            onValueChange={(v) => {
              setRuns(v as number)
              setStatus("dirty")
            }}
            getAriaValueText={(_, v) => formatRuns(v)}
          />
          <FieldDescription>
            250 to 10,000 runs. Your Pro plan includes 10,000 a month across every project.
          </FieldDescription>
        </Field>
        <Field>
          <SliderHeader id="sl-alert" label="Email the owner at" value={`${alertAt}%`} />
          <Slider
            aria-labelledby="sl-alert"
            min={50}
            max={100}
            step={5}
            value={alertAt}
            onValueChange={(v) => {
              setAlertAt(v as number)
              setStatus("dirty")
            }}
            getAriaValueText={(_, v) => `${v}% of the budget`}
          />
          <FieldDescription>50 to 100% of the budget. Rules pause when the project runs out.</FieldDescription>
        </Field>
      </CardContent>
      <CardFooter className="flex-col-reverse items-stretch gap-3 @sm/budget:flex-row @sm/budget:items-center @sm/budget:justify-between">
        <p
          className="text-center text-caption text-muted-foreground @sm/budget:text-start"
          aria-live="polite"
        >
          {status === "saved" ? "Saved. Applies from today." : status === "dirty" ? "Unsaved changes" : "No unsaved changes"}
        </p>
        <Button disabled={status !== "dirty"} onClick={() => setStatus("saved")}>
          Save changes
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function SliderDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A grey track, an ink range and an ink thumb set in a canvas ring. Show the value next to the label."
        code={`const [value, setValue] = React.useState(4)

<div className="grid gap-3">
  <div className="flex items-baseline justify-between gap-4">
    <Label id="wip">In progress limit</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">{value} tasks</output>
  </div>
  <Slider
    aria-labelledby="wip"
    min={1}
    max={10}
    value={value}
    onValueChange={(v) => setValue(v as number)}
    getAriaValueText={(_, v) => \`\${v} tasks in progress at once\`}
  />
  <div aria-hidden="true" className="-mt-1.5 flex justify-between text-caption text-muted-foreground tabular">
    <span>1</span>
    <span>10</span>
  </div>
</div>`}
      >
        <WorkInProgressLimit />
      </Example>

      <Example
        title="Range"
        layout="stack"
        description="Pass an array for two thumbs. Name each thumb with getAriaLabel and keep a step between them."
        code={`const [range, setRange] = React.useState([2, 8])

<div className="grid gap-3">
  <div className="flex items-baseline justify-between gap-4">
    <Label id="due">Due within</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">
      {range[0] === 0 ? "Today" : range[0]}–{range[1]} days
    </output>
  </div>
  <Slider
    aria-labelledby="due"
    min={0}
    max={30}
    minStepsBetweenValues={1}
    value={range}
    onValueChange={(v) => setRange([...(v as readonly number[])])}
    getAriaLabel={(i) => (i === 0 ? "Earliest due date" : "Latest due date")}
  />
  <div aria-hidden="true" className="-mt-1.5 flex justify-between text-caption text-muted-foreground tabular">
    <span>Today</span>
    <span>30 days</span>
  </div>
  <p className="text-caption text-muted-foreground">
    Shows tasks due {range[0]} days from now up to {range[1]} days from now.
  </p>
</div>`}
      >
        <DueWindow />
      </Example>

      <Example
        title="Vertical and disabled"
        layout="stack"
        description="Vertical sliders fill the height of their container; put the label and value under each one. Disabled sliders dim and ignore input."
        code={`<div className="grid h-56 grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-3">
  <Slider orientation="vertical" aria-labelledby="design" value={design} onValueChange={setDesign} />
  <span id="design">Design</span>
  <output>{design}%</output>
</div>

<Field data-disabled>
  <div className="flex items-baseline justify-between gap-4">
    <Label id="attachments">Attachment size limit</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular group-data-[disabled=true]/field:opacity-50">
      25 MB
    </output>
  </div>
  <Slider aria-labelledby="attachments" disabled defaultValue={10} getAriaValueText={() => "25 MB"} />
  <FieldDescription>0 to 250 MB. Set by a workspace admin. Ask Hana Kim to change it.</FieldDescription>
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-10">
          <WorkloadAlerts />
          <Field data-disabled="true" className="border-t pt-8">
            <SliderHeader id="sl-disabled" label="Attachment size limit" value="25 MB" />
            <Slider aria-labelledby="sl-disabled" disabled defaultValue={10} getAriaValueText={() => "25 MB"} />
            <FieldDescription>0 to 250&nbsp;MB. Set by a workspace admin. Ask Hana Kim to change it.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Automation budget"
        description="Sliders with steps for values people tune by feel. The readout uses tabular figures so it does not jump as it changes."
        surface="subtle"
        code={`<Field>
  <div className="flex items-baseline justify-between gap-4">
    <Label id="runs">Monthly runs</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">{formatRuns(runs)}</output>
  </div>
  <Slider
    aria-labelledby="runs"
    min={250}
    max={10000}
    step={250}
    value={runs}
    onValueChange={(v) => setRuns(v as number)}
    getAriaValueText={(_, v) => formatRuns(v)}
  />
  <FieldDescription>250 to 10,000 runs. Your Pro plan includes 10,000 a month across every project.</FieldDescription>
</Field>`}
      >
        <AutomationBudget />
      </Example>

      <Guidelines
        do={[
          "Show the current value next to the label, with its unit.",
          "Use steps that match how the value is billed or measured.",
          "Give every thumb an accessible name and a readable value text.",
        ]}
        dont={[
          "Don’t use a slider when people need an exact number. Use an input.",
          "Don’t use a slider for more than about 100 steps without a matching input.",
          "Don’t hide the minimum and maximum when they matter. Show them under the track or in the description.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "value / defaultValue", type: "number | number[]", description: "One number for a single thumb, an array for a range." },
          { prop: "onValueChange", type: "(value: number | number[]) => void", description: "Called while the thumb moves." },
          { prop: "onValueCommitted", type: "(value: number | number[]) => void", description: "Called when the person releases the thumb." },
          { prop: "min / max", type: "number", default: "0 / 100", description: "The ends of the track." },
          { prop: "step", type: "number", default: "1", description: "The increment for dragging and arrow keys." },
          { prop: "minStepsBetweenValues", type: "number", default: "0", description: "Minimum gap between range thumbs, in steps." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical sliders fill their container’s height." },
          { prop: "getAriaLabel", type: "(index: number) => string", description: "Accessible name for each thumb. Or point aria-labelledby at a Label." },
          { prop: "getAriaValueText", type: "(formatted, value, index) => string", description: "Readable value for screen readers, such as “2,500 runs”." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the slider and blocks input." },
        ]}
      />
    </Examples>
  )
}
