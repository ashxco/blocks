"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const formatMb = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toLocaleString("en-US", { maximumFractionDigits: 2 })} GB` : `${mb} MB`)

function SliderHeader({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Label id={id}>{label}</Label>
      <output aria-hidden="true" className="text-label text-foreground tabular">
        {value}
      </output>
    </div>
  )
}

function Concurrency() {
  const [value, setValue] = React.useState(40)
  return (
    <div className="grid w-full max-w-96 gap-3">
      <SliderHeader id="sl-concurrency" label="Concurrent builds" value={`${value}%`} />
      <Slider
        aria-labelledby="sl-concurrency"
        value={value}
        onValueChange={(v) => setValue(v as number)}
        getAriaValueText={(formatted) => `${formatted} percent of team capacity`}
      />
    </div>
  )
}

function Autoscaling() {
  const [range, setRange] = React.useState<number[]>([2, 8])
  return (
    <div className="grid w-full max-w-96 gap-3">
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
      <p className="text-caption text-muted-foreground">
        Lumen keeps at least {range[0]} warm and adds up to {range[1] - range[0]} more under load.
      </p>
    </div>
  )
}

function FunctionResources() {
  const [memory, setMemory] = React.useState(1024)
  const [duration, setDuration] = React.useState(60)
  const [saved, setSaved] = React.useState(true)

  return (
    <div className="grid w-full max-w-128 gap-8 rounded-(--card-radius) border bg-card p-(--card-padding)">
      <div className="grid gap-1">
        <h3 className="text-h4">Function resources</h3>
        <p className="text-body text-copy">Applies to every serverless function in acme-web from the next deployment.</p>
      </div>
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
            setSaved(false)
          }}
          getAriaValueText={(_, v) => formatMb(v)}
        />
        <FieldDescription>More memory also adds CPU. Most API routes need 1 GB or less.</FieldDescription>
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
            setSaved(false)
          }}
          getAriaValueText={(_, v) => `${v} seconds`}
        />
        <FieldDescription>Requests that run longer stop with a 504 error.</FieldDescription>
      </Field>
      <div className="flex flex-col-reverse items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {saved ? "Saved. Redeploy to apply." : "Unsaved changes"}
        </p>
        <Button disabled={saved} onClick={() => setSaved(true)}>
          Save changes
        </Button>
      </div>
    </div>
  )
}

export default function SliderDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A grey track, an ink range and a canvas-coloured thumb ringed in ink. Show the value next to the label."
        code={`<Label id="concurrency">Concurrent builds</Label>
<Slider aria-labelledby="concurrency" defaultValue={40} />`}
      >
        <Concurrency />
      </Example>

      <Example
        title="Range"
        layout="stack"
        description="Pass an array for two thumbs. Name each thumb with getAriaLabel and keep a step between them."
        code={`<Slider
  min={1}
  max={20}
  defaultValue={[2, 8]}
  minStepsBetweenValues={1}
  getAriaLabel={(i) => (i === 0 ? "Minimum instances" : "Maximum instances")}
/>`}
      >
        <Autoscaling />
      </Example>

      <Example
        title="Vertical and disabled"
        description="Vertical sliders fill the height of their container. Disabled sliders dim and ignore input."
        code={`<Slider orientation="vertical" defaultValue={60} className="h-40" />
<Slider disabled defaultValue={30} />`}
      >
        <div className="flex h-44 items-stretch gap-10">
          <Slider orientation="vertical" defaultValue={60} getAriaLabel={() => "Production traffic"} />
          <Slider orientation="vertical" defaultValue={25} getAriaLabel={() => "Canary traffic"} />
        </div>
        <Field data-disabled="true" className="w-full max-w-80">
          <Label id="sl-disabled">Build cache size</Label>
          <Slider aria-labelledby="sl-disabled" disabled defaultValue={30} />
          <FieldDescription>Set by your plan.</FieldDescription>
        </Field>
      </Example>

      <Example
        title="Function resources"
        description="Sliders with steps for values people tune by feel. The readout uses tabular figures so it does not jump as it changes."
        code={`<Slider min={128} max={3008} step={64} value={memory} onValueChange={setMemory} />`}
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
          "Don’t hide the minimum and maximum when they matter. Say them in the description.",
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
