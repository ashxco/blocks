"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

type Level = "all" | "info" | "warn" | "error"

const logLines: { time: string; level: Exclude<Level, "all">; source: string; message: string }[] = [
  { time: "14:02:11", level: "info", source: "build", message: "Installed 412 packages in 9.8s" },
  { time: "14:02:26", level: "info", source: "build", message: "Compiled 38 routes" },
  { time: "14:02:31", level: "warn", source: "build", message: "Image /hero.png is 2.4 MB. Compress it to speed up first load." },
  { time: "14:02:40", level: "info", source: "deploy", message: "Uploaded build to fra-1 and iad-1" },
  { time: "14:03:02", level: "error", source: "runtime", message: "GET /api/orders returned 500: DATABASE_URL is not set" },
  { time: "14:03:05", level: "info", source: "runtime", message: "GET / returned 200 in 84 ms" },
  { time: "14:03:17", level: "warn", source: "runtime", message: "Function /api/search took 9.1s. The limit is 10s." },
]

const levelTone: Record<Exclude<Level, "all">, string> = {
  info: "text-muted-foreground",
  warn: "text-warning",
  error: "text-destructive",
}

function LogFilter() {
  const [level, setLevel] = React.useState<Level>("all")
  const [source, setSource] = React.useState("all")

  const lines = logLines.filter(
    (line) =>
      (level === "all" || line.level === level) &&
      (source === "all" || line.source === source)
  )

  return (
    <div className="w-full max-w-prose overflow-hidden rounded-(--card-radius) border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <p className="me-auto text-title text-foreground">Logs</p>
        <NativeSelect
          size="sm"
          aria-label="Source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
        >
          <NativeSelectOption value="all">All sources</NativeSelectOption>
          <NativeSelectOption value="build">Build</NativeSelectOption>
          <NativeSelectOption value="deploy">Deploy</NativeSelectOption>
          <NativeSelectOption value="runtime">Runtime</NativeSelectOption>
        </NativeSelect>
        <NativeSelect
          size="sm"
          aria-label="Level"
          value={level}
          onChange={(event) => setLevel(event.target.value as Level)}
        >
          <NativeSelectOption value="all">All levels</NativeSelectOption>
          <NativeSelectOption value="info">Info</NativeSelectOption>
          <NativeSelectOption value="warn">Warnings</NativeSelectOption>
          <NativeSelectOption value="error">Errors</NativeSelectOption>
        </NativeSelect>
      </div>
      <ol className="divide-y font-mono text-code">
        {lines.length ? (
          lines.map((line) => (
            <li key={line.time} className="flex gap-4 px-4 py-2.5">
              <span className="shrink-0 text-muted-foreground tabular">{line.time}</span>
              <span className={`w-12 shrink-0 font-semibold ${levelTone[line.level]}`}>{line.level}</span>
              <span className="min-w-0 text-copy">{line.message}</span>
            </li>
          ))
        ) : (
          <li className="px-4 py-8 text-center font-sans text-sm text-muted-foreground">
            No log lines match these filters.
          </li>
        )}
      </ol>
    </div>
  )
}

export default function NativeSelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="The platform select with Blocks control styling. The option list is drawn by the operating system."
        code={`<NativeSelect defaultValue="iad-1" aria-label="Region">
  <NativeSelectOption value="fra-1">Frankfurt, fra-1</NativeSelectOption>
  <NativeSelectOption value="iad-1">Washington, D.C., iad-1</NativeSelectOption>
  <NativeSelectOption value="sfo-1">San Francisco, sfo-1</NativeSelectOption>
</NativeSelect>`}
      >
        <NativeSelect defaultValue="iad-1" aria-label="Region" className="w-64">
          <NativeSelectOption value="fra-1">Frankfurt, fra-1</NativeSelectOption>
          <NativeSelectOption value="iad-1">Washington, D.C., iad-1</NativeSelectOption>
          <NativeSelectOption value="sfo-1">San Francisco, sfo-1</NativeSelectOption>
          <NativeSelectOption value="sin-1">Singapore, sin-1</NativeSelectOption>
          <NativeSelectOption value="syd-1">Sydney, syd-1</NativeSelectOption>
        </NativeSelect>
      </Example>

      <Example
        title="Sizes"
        description="The same control heights as Select and Input. className goes on the wrapper, so set the width there."
        code={`<NativeSelect size="sm">…</NativeSelect>
<NativeSelect>…</NativeSelect>
<NativeSelect size="lg">…</NativeSelect>`}
      >
        {(["sm", "default", "lg"] as const).map((size) => (
          <NativeSelect key={size} size={size} defaultValue="production" aria-label={`Environment, ${size} size`} className="w-44">
            <NativeSelectOption value="production">Production</NativeSelectOption>
            <NativeSelectOption value="preview">Preview</NativeSelectOption>
            <NativeSelectOption value="development">Development</NativeSelectOption>
          </NativeSelect>
        ))}
      </Example>

      <Example
        title="Option groups"
        description="Use optgroup to group options. A disabled first option works as a placeholder."
        code={`<NativeSelect defaultValue="">
  <NativeSelectOption value="" disabled>Choose a runtime</NativeSelectOption>
  <NativeSelectOptGroup label="Node.js">
    <NativeSelectOption value="node-22">Node.js 22 LTS</NativeSelectOption>
    <NativeSelectOption value="node-20">Node.js 20</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="Other runtimes">
    <NativeSelectOption value="bun-1.2">Bun 1.2</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>`}
      >
        <NativeSelect defaultValue="" aria-label="Runtime" className="w-56">
          <NativeSelectOption value="" disabled>
            Choose a runtime
          </NativeSelectOption>
          <NativeSelectOptGroup label="Node.js">
            <NativeSelectOption value="node-22">Node.js 22 LTS</NativeSelectOption>
            <NativeSelectOption value="node-20">Node.js 20</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Other runtimes">
            <NativeSelectOption value="bun-1.2">Bun 1.2</NativeSelectOption>
            <NativeSelectOption value="deno-2">Deno 2</NativeSelectOption>
            <NativeSelectOption value="python-3.13">Python 3.13</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Example>

      <Example
        title="States"
        description="Disabled selects fade. Invalid selects take aria-invalid, turn the border red and explain the fix below."
        layout="stack"
      >
        <div className="grid w-full max-w-144 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="native-disabled">Build machine</FieldLabel>
            <NativeSelect id="native-disabled" defaultValue="standard" disabled className="w-full">
              <NativeSelectOption value="standard">Standard</NativeSelectOption>
              <NativeSelectOption value="performance">Performance</NativeSelectOption>
            </NativeSelect>
            <FieldDescription>Upgrade to the Pro plan to change it.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="native-invalid">Production branch</FieldLabel>
            <NativeSelect id="native-invalid" defaultValue="" aria-invalid="true" className="w-full">
              <NativeSelectOption value="" disabled>
                Choose a branch
              </NativeSelectOption>
              <NativeSelectOption value="main">main</NativeSelectOption>
              <NativeSelectOption value="release">release</NativeSelectOption>
            </NativeSelect>
            <FieldError>Choose the branch Lumen deploys to production.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Filter bar"
        description="Small native selects filter a log stream. They are quick to scan, need no popup and work well on phones."
        layout="stack"
        surface="subtle"
        code={`<NativeSelect size="sm" aria-label="Level" value={level} onChange={(e) => setLevel(e.target.value)}>
  <NativeSelectOption value="all">All levels</NativeSelectOption>
  <NativeSelectOption value="warn">Warnings</NativeSelectOption>
  <NativeSelectOption value="error">Errors</NativeSelectOption>
</NativeSelect>`}
      >
        <LogFilter />
      </Example>

      <Guidelines
        do={[
          "Use a native select on forms that must work on phones and without JavaScript.",
          "Use it for long, plain lists where the system picker is faster, such as time zones.",
          "Give it a label, or an aria-label in a toolbar.",
        ]}
        dont={[
          "Don’t put icons, descriptions or rich content in options. Use Select.",
          "Don’t mix native and custom selects in the same form.",
          "Don’t use a disabled option as the only hint. Add a label too.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height from --control-height-*." },
          { prop: "className", type: "string", description: "Applied to the wrapper. Set the width here." },
          { prop: "value / defaultValue", type: "string", description: "Controlled or initial value, as on any <select>." },
          { prop: "onChange", type: "(event) => void", description: "Called when the person picks an option." },
          { prop: "aria-invalid", type: "boolean", description: "Marks the select as invalid: red border and focus outline." },
          { prop: "NativeSelectOption", type: "component", description: "An <option>. Takes value, disabled and children." },
          { prop: "NativeSelectOptGroup", type: "component", description: "An <optgroup>. Takes a label." },
        ]}
      />
    </Examples>
  )
}
