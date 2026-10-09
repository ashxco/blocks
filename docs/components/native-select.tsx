"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import { Card } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

type Level = "all" | "info" | "warn" | "error"

const logLines: { time: string; level: Exclude<Level, "all">; source: string; message: string }[] = [
  { time: "14:02:11", level: "info", source: "build", message: "Installed 412 packages in 6.8s" },
  { time: "14:02:26", level: "info", source: "build", message: "Compiled 38 routes" },
  { time: "14:02:31", level: "warn", source: "build", message: "Image hero.png is 2.4 MB. Compress it to speed up first load." },
  { time: "14:02:40", level: "info", source: "deploy", message: "Uploaded build to fra1 and iad1" },
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
    <Card className="@container/logs w-full max-w-2xl gap-0 p-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <p className="basis-full text-title text-foreground @md/logs:me-auto @md/logs:basis-auto">Logs</p>
        <NativeSelect
          size="sm"
          aria-label="Source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="flex-1 @md/logs:flex-none"
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
          className="flex-1 @md/logs:flex-none"
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
            <li key={line.time} className="flex flex-wrap gap-x-4 gap-y-0.5 px-4 py-2.5 @md/logs:flex-nowrap">
              <span className="shrink-0 text-muted-foreground tabular">{line.time}</span>
              <span className={`w-12 shrink-0 font-semibold ${levelTone[line.level]}`}>{line.level}</span>
              <span className="min-w-0 basis-full text-copy @md/logs:basis-auto">{line.message}</span>
            </li>
          ))
        ) : (
          <li className="px-4 py-8 text-center font-sans text-caption text-muted-foreground">
            No log lines match these filters.
          </li>
        )}
      </ol>
    </Card>
  )
}

const sizes = [
  { size: "sm", label: "Small", height: `${tokenPx("--control-height-sm")}px` },
  { size: "default", label: "Medium", height: `${tokenPx("--control-height-md")}px` },
  { size: "lg", label: "Large", height: `${tokenPx("--control-height-lg")}px` },
] as const

export default function NativeSelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="The platform select with Blocks control styling. The option list is drawn by the operating system."
        code={`<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <NativeSelect id="region" defaultValue="iad1">
    <NativeSelectOption value="fra1">Frankfurt (fra1)</NativeSelectOption>
    <NativeSelectOption value="iad1">Virginia (iad1)</NativeSelectOption>
    <NativeSelectOption value="sfo1">San Francisco (sfo1)</NativeSelectOption>
    <NativeSelectOption value="sin1">Singapore (sin1)</NativeSelectOption>
    <NativeSelectOption value="syd1">Sydney (syd1)</NativeSelectOption>
  </NativeSelect>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="native-region">Region</FieldLabel>
          <NativeSelect id="native-region" defaultValue="iad1">
            <NativeSelectOption value="fra1">Frankfurt (fra1)</NativeSelectOption>
            <NativeSelectOption value="iad1">Virginia (iad1)</NativeSelectOption>
            <NativeSelectOption value="sfo1">San Francisco (sfo1)</NativeSelectOption>
            <NativeSelectOption value="sin1">Singapore (sin1)</NativeSelectOption>
            <NativeSelectOption value="syd1">Sydney (syd1)</NativeSelectOption>
          </NativeSelect>
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="The same control heights as Select and Input. className goes on the wrapper, so set the width there."
        code={`{(["sm", "default", "lg"] as const).map((size) => (
  <NativeSelect key={size} size={size} defaultValue="production" aria-label="Environment" className="w-full">
    <NativeSelectOption value="production">Production</NativeSelectOption>
    <NativeSelectOption value="preview">Preview</NativeSelectOption>
    <NativeSelectOption value="development">Development</NativeSelectOption>
  </NativeSelect>
))}`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {sizes.map(({ size, label, height }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`native-size-${size}`}>
                {label} <span className="font-normal text-muted-foreground">{height}</span>
              </FieldLabel>
              <NativeSelect id={`native-size-${size}`} size={size} defaultValue="production">
                <NativeSelectOption value="production">Production</NativeSelectOption>
                <NativeSelectOption value="preview">Preview</NativeSelectOption>
                <NativeSelectOption value="development">Development</NativeSelectOption>
              </NativeSelect>
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="Option groups"
        layout="stack"
        description="Use optgroup to group options. A disabled first option works as a placeholder until a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="runtime">Runtime</FieldLabel>
  <NativeSelect id="runtime" defaultValue="">
    <NativeSelectOption value="" disabled>Choose a runtime</NativeSelectOption>
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
  <FieldDescription>Lumen installs it on every build machine.</FieldDescription>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="native-runtime">Runtime</FieldLabel>
          <NativeSelect id="native-runtime" defaultValue="">
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
          <FieldDescription>Lumen installs it on every build machine.</FieldDescription>
        </Field>
      </Example>

      <Example
        title="States"
        description="Disabled selects fade. Invalid selects take aria-invalid, turn the border red and explain the fix below."
        layout="stack"
        code={`<Field>
  <FieldLabel htmlFor="machine">Build machine</FieldLabel>
  <NativeSelect id="machine" defaultValue="standard" disabled>
    <NativeSelectOption value="standard">Standard</NativeSelectOption>
    <NativeSelectOption value="enhanced">Enhanced</NativeSelectOption>
    <NativeSelectOption value="turbo">Turbo</NativeSelectOption>
  </NativeSelect>
  <FieldDescription>Upgrade to the Pro plan to change it.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="branch">Production branch</FieldLabel>
  <NativeSelect id="branch" defaultValue="" aria-invalid>
    <NativeSelectOption value="" disabled>Choose a branch</NativeSelectOption>
    <NativeSelectOption value="main">main</NativeSelectOption>
    <NativeSelectOption value="release">release</NativeSelectOption>
  </NativeSelect>
  <FieldError>Choose the branch Lumen deploys to production.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="native-disabled">Build machine</FieldLabel>
            <NativeSelect id="native-disabled" defaultValue="standard" disabled>
              <NativeSelectOption value="standard">Standard</NativeSelectOption>
              <NativeSelectOption value="enhanced">Enhanced</NativeSelectOption>
              <NativeSelectOption value="turbo">Turbo</NativeSelectOption>
            </NativeSelect>
            <FieldDescription>Upgrade to the Pro plan to change it.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="native-invalid">Production branch</FieldLabel>
            <NativeSelect id="native-invalid" defaultValue="" aria-invalid="true">
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
        surface="subtle"
        code={`<div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
  <p className="basis-full text-title text-foreground @md/logs:me-auto @md/logs:basis-auto">Logs</p>
  <NativeSelect
    size="sm"
    aria-label="Source"
    value={source}
    onChange={(e) => setSource(e.target.value)}
    className="flex-1 @md/logs:flex-none"
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
    onChange={(e) => setLevel(e.target.value)}
    className="flex-1 @md/logs:flex-none"
  >
    <NativeSelectOption value="all">All levels</NativeSelectOption>
    <NativeSelectOption value="info">Info</NativeSelectOption>
    <NativeSelectOption value="warn">Warnings</NativeSelectOption>
    <NativeSelectOption value="error">Errors</NativeSelectOption>
  </NativeSelect>
</div>`}
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
