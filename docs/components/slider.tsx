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

const formatMb = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toLocaleString("en-US", { maximumFractionDigits: 2 })} GB` : `${mb} MB`)

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

const builds = (n: number) => `${n} ${n === 1 ? "build" : "builds"}`

function Concurrency() {
  const [value, setValue] = React.useState(4)
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SliderHeader id="sl-concurrency" label="Concurrent builds" value={builds(value)} />
      <Slider
        aria-labelledby="sl-concurrency"
        min={1}
        max={10}
        value={value}
        onValueChange={(v) => setValue(v as number)}
        getAriaValueText={(_, v) => `${builds(v)} at once`}
      />
      <SliderScale min="1" max="10" />
    </div>
  )
}

const thresholds = [
  { id: "cpu", label: "CPU", value: 80 },
  { id: "memory", label: "Memory", value: 70 },
  { id: "disk", label: "Disk", value: 90 },
]

function AlertThresholds() {
  const [values, setValues] = React.useState<Record<string, number>>(
    Object.fromEntries(thresholds.map((t) => [t.id, t.value]))
  )
  return (
    <div role="group" aria-labelledby="sl-thresholds" className="grid justify-items-center gap-5">
      <Label id="sl-thresholds">Alert thresholds</Label>
      <div className="flex gap-10">
        {thresholds.map((t) => (
          <div key={t.id} className="grid h-56 grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-3">
            <Slider
              orientation="vertical"
              aria-labelledby={`sl-${t.id}`}
              value={values[t.id]}
              onValueChange={(v) => setValues((current) => ({ ...current, [t.id]: v as number }))}
              getAriaValueText={(_, v) => `Alert above ${v}%`}
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

function Autoscaling() {
  const [range, setRange] = React.useState<number[]>([2, 8])
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SliderHeader id="sl-instances" label="Instances" value={`${range[0]}–${range[1]}`} />
      <Slider
        aria-labelledby="sl-instances"
        min={1}
        max={20}
        minStepsBetweenValues={1}
        value={range}
        onValueChange={(v) => setRange([...(v as readonly number[])])}
        getAriaLabel={(index) => (index === 0 ? "Minimum instances" : "Maximum instances")}
      />
      <SliderScale min="1" max="20" />
      <p className="text-caption text-pretty text-muted-foreground">
        Lumen keeps at least {range[0]} warm and adds up to {range[1] - range[0]} more under load.
      </p>
    </div>
  )
}

function FunctionResources() {
  const [memory, setMemory] = React.useState(1024)
  const [duration, setDuration] = React.useState(60)
  const [status, setStatus] = React.useState<"clean" | "dirty" | "saved">("clean")

  return (
    <Card className="@container/resources w-full max-w-md">
      <CardHeader>
        <CardTitle>Function resources</CardTitle>
        <CardDescription className="text-pretty">
          Applies to every serverless function in <span className="whitespace-nowrap">acme-web</span> from the next
          deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Field>
          <SliderHeader id="sl-memory" label="Memory" value={formatMb(memory)} />
          <Slider
            aria-labelledby="sl-memory"
            min={128}
            max={3008}
            step={64}
            value={memory}
            onValueChange={(v) => {
              setMemory(v as number)
              setStatus("dirty")
            }}
            getAriaValueText={(_, v) => formatMb(v)}
          />
          <FieldDescription>
            128&nbsp;MB to 2.9&nbsp;GB. More memory also adds CPU; most API routes need 1&nbsp;GB or less.
          </FieldDescription>
        </Field>
        <Field>
          <SliderHeader id="sl-duration" label="Maximum duration" value={`${duration} s`} />
          <Slider
            aria-labelledby="sl-duration"
            min={10}
            max={300}
            step={10}
            value={duration}
            onValueChange={(v) => {
              setDuration(v as number)
              setStatus("dirty")
            }}
            getAriaValueText={(_, v) => `${v} seconds`}
          />
          <FieldDescription>10 to 300&nbsp;seconds. Requests that run longer stop with a 504&nbsp;error.</FieldDescription>
        </Field>
      </CardContent>
      <CardFooter className="flex-col-reverse items-stretch gap-3 @sm/resources:flex-row @sm/resources:items-center @sm/resources:justify-between">
        <p
          className="text-center text-caption text-muted-foreground @sm/resources:text-start"
          aria-live="polite"
        >
          {status === "saved" ? "Saved. Redeploy to apply." : status === "dirty" ? "Unsaved changes" : "No unsaved changes"}
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
    <Label id="concurrency">Concurrent builds</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">{value} builds</output>
  </div>
  <Slider
    aria-labelledby="concurrency"
    min={1}
    max={10}
    value={value}
    onValueChange={(v) => setValue(v as number)}
    getAriaValueText={(_, v) => \`\${v} builds at once\`}
  />
  <div aria-hidden="true" className="-mt-1.5 flex justify-between text-caption text-muted-foreground tabular">
    <span>1</span>
    <span>10</span>
  </div>
</div>`}
      >
        <Concurrency />
      </Example>

      <Example
        title="Range"
        layout="stack"
        description="Pass an array for two thumbs. Name each thumb with getAriaLabel and keep a step between them."
        code={`const [range, setRange] = React.useState([2, 8])

<div className="grid gap-3">
  <div className="flex items-baseline justify-between gap-4">
    <Label id="instances">Instances</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">{range[0]}–{range[1]}</output>
  </div>
  <Slider
    aria-labelledby="instances"
    min={1}
    max={20}
    minStepsBetweenValues={1}
    value={range}
    onValueChange={(v) => setRange([...(v as readonly number[])])}
    getAriaLabel={(i) => (i === 0 ? "Minimum instances" : "Maximum instances")}
  />
  <div aria-hidden="true" className="-mt-1.5 flex justify-between text-caption text-muted-foreground tabular">
    <span>1</span>
    <span>20</span>
  </div>
  <p className="text-caption text-muted-foreground">
    Lumen keeps at least {range[0]} warm and adds up to {range[1] - range[0]} more under load.
  </p>
</div>`}
      >
        <Autoscaling />
      </Example>

      <Example
        title="Vertical and disabled"
        description="Vertical sliders fill the height of their container; put the label and value under each one. Disabled sliders dim and ignore input."
        code={`<div className="grid h-56 grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-3">
  <Slider orientation="vertical" aria-labelledby="cpu" value={cpu} onValueChange={setCpu} />
  <span id="cpu">CPU</span>
  <output>{cpu}%</output>
</div>

<Field data-disabled>
  <div className="flex items-baseline justify-between gap-4">
    <Label id="cache">Build cache size</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular group-data-[disabled=true]/field:opacity-50">
      3 GB
    </output>
  </div>
  <Slider aria-labelledby="cache" disabled defaultValue={30} getAriaValueText={() => "3 GB"} />
  <FieldDescription>0 to 10 GB. Your plan sets it to 3 GB; upgrade to Pro to change it.</FieldDescription>
</Field>`}
      >
        <div className="grid w-full justify-items-center gap-12">
          <AlertThresholds />
          <Field data-disabled="true" className="w-full max-w-sm border-t pt-8">
            <SliderHeader id="sl-disabled" label="Build cache size" value="3 GB" />
            <Slider aria-labelledby="sl-disabled" disabled defaultValue={30} getAriaValueText={() => "3 GB"} />
            <FieldDescription>0 to 10&nbsp;GB. Your plan sets it to 3&nbsp;GB; upgrade to Pro to change it.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Function resources"
        description="Sliders with steps for values people tune by feel. The readout uses tabular figures so it does not jump as it changes."
        surface="subtle"
        code={`<Field>
  <div className="flex items-baseline justify-between gap-4">
    <Label id="memory">Memory</Label>
    <output aria-hidden="true" className="text-label text-foreground tabular">{formatMb(memory)}</output>
  </div>
  <Slider
    aria-labelledby="memory"
    min={128}
    max={3008}
    step={64}
    value={memory}
    onValueChange={(v) => setMemory(v as number)}
    getAriaValueText={(_, v) => formatMb(v)}
  />
  <FieldDescription>128 MB to 2.9 GB. More memory also adds CPU; most API routes need 1 GB or less.</FieldDescription>
</Field>`}
      >
        <FunctionResources />
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
          { prop: "getAriaValueText", type: "(formatted, value, index) => string", description: "Readable value for screen readers, such as “1 GB”." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the slider and blocks input." },
        ]}
      />
    </Examples>
  )
}
