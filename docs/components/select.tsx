"use client"

import * as React from "react"
import { CpuIcon, GaugeIcon, RocketIcon } from "lucide-react"

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const regions = [
  { label: "Frankfurt, fra-1", value: "fra-1" },
  { label: "Washington, D.C., iad-1", value: "iad-1" },
  { label: "San Francisco, sfo-1", value: "sfo-1" },
  { label: "São Paulo, gru-1", value: "gru-1" },
  { label: "Singapore, sin-1", value: "sin-1" },
  { label: "Sydney, syd-1", value: "syd-1" },
]

const environments = [
  { label: "Production", value: "production" },
  { label: "Preview", value: "preview" },
  { label: "Development", value: "development" },
]

const runtimes = [
  {
    label: "Node.js",
    items: [
      { label: "Node.js 22 LTS", value: "node-22" },
      { label: "Node.js 20", value: "node-20" },
    ],
  },
  {
    label: "Other runtimes",
    items: [
      { label: "Bun 1.2", value: "bun-1.2" },
      { label: "Deno 2", value: "deno-2" },
      { label: "Python 3.13", value: "python-3.13" },
      { label: "Go 1.24", value: "go-1.24" },
    ],
  },
]

const machines = [
  { label: "Standard", value: "standard", spec: "2 vCPU · 4 GB", icon: CpuIcon },
  { label: "Performance", value: "performance", spec: "8 vCPU · 16 GB", icon: GaugeIcon },
  { label: "Turbo", value: "turbo", spec: "30 vCPU · 60 GB", icon: RocketIcon },
]

const frameworks = [
  { label: "Next.js", value: "nextjs" },
  { label: "Astro", value: "astro" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Other", value: "other" },
]

export default function SelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Pass the options as items so the trigger shows the label of the chosen value, not the raw value."
        code={`const regions = [
  { label: "Frankfurt, fra-1", value: "fra-1" },
  { label: "Washington, D.C., iad-1", value: "iad-1" },
]

<Select items={regions} defaultValue="fra-1">
  <SelectTrigger className="w-64">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {regions.map((region) => (
      <SelectItem key={region.value} value={region.value}>
        {region.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`}
      >
        <Select items={regions} defaultValue="fra-1">
          <SelectTrigger className="w-64" aria-label="Region">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Example>

      <Example
        title="Placeholder"
        description="Leave the value empty and say what to choose. The placeholder is muted until a value is picked."
        code={`<Select items={environments}>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Choose an environment" />
  </SelectTrigger>
  <SelectContent>…</SelectContent>
</Select>`}
      >
        <Select items={environments}>
          <SelectTrigger className="w-56" aria-label="Environment">
            <SelectValue placeholder="Choose an environment" />
          </SelectTrigger>
          <SelectContent>
            {environments.map((env) => (
              <SelectItem key={env.value} value={env.value}>
                {env.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Example>

      <Example
        title="Sizes"
        description="Heights come from the control tokens, so a select lines up with inputs and buttons of the same size."
        code={`<SelectTrigger size="sm">…</SelectTrigger>
<SelectTrigger>…</SelectTrigger>
<SelectTrigger size="lg">…</SelectTrigger>`}
      >
        {(["sm", "default", "lg"] as const).map((size) => (
          <Select key={size} items={environments} defaultValue="production">
            <SelectTrigger size={size} className="w-44" aria-label={`Environment, ${size} size`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {environments.map((env) => (
                <SelectItem key={env.value} value={env.value}>
                  {env.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </Example>

      <Example
        title="Groups"
        description="Group long lists under short labels and split the groups with a separator."
        code={`<SelectContent>
  <SelectGroup>
    <SelectLabel>Node.js</SelectLabel>
    <SelectItem value="node-22">Node.js 22 LTS</SelectItem>
    <SelectItem value="node-20">Node.js 20</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Other runtimes</SelectLabel>
    <SelectItem value="bun-1.2">Bun 1.2</SelectItem>
  </SelectGroup>
</SelectContent>`}
      >
        <Select items={runtimes.flatMap((group) => group.items)} defaultValue="node-22">
          <SelectTrigger className="w-56" aria-label="Runtime">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {runtimes.map((group, index) => (
              <React.Fragment key={group.label}>
                {index > 0 ? <SelectSeparator /> : null}
                <SelectGroup>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </Example>

      <Example
        title="Icons and details"
        description="Items can carry an icon and a muted detail. The trigger still shows only the label from items."
        code={`<SelectItem value="performance">
  <GaugeIcon />
  Performance
  <span className="ms-auto text-muted-foreground">8 vCPU · 16 GB</span>
</SelectItem>`}
      >
        <Select items={machines} defaultValue="performance">
          <SelectTrigger className="w-64" aria-label="Build machine">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {machines.map((machine) => (
              <SelectItem key={machine.value} value={machine.value}>
                <machine.icon />
                {machine.label}
                <span className="ms-auto ps-6 font-normal text-muted-foreground">{machine.spec}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Example>

      <Example
        title="States"
        description="Disabled selects fade and stop responding. Invalid selects turn the border red; say what to fix under them."
        layout="stack"
      >
        <div className="grid w-full max-w-144 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="select-disabled">Region</FieldLabel>
            <Select items={regions} defaultValue="fra-1" disabled>
              <SelectTrigger id="select-disabled" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Set when the project was created.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="select-invalid">Environment</FieldLabel>
            <Select items={environments}>
              <SelectTrigger id="select-invalid" className="w-full" aria-invalid="true">
                <SelectValue placeholder="Choose an environment" />
              </SelectTrigger>
              <SelectContent>
                {environments.map((env) => (
                  <SelectItem key={env.value} value={env.value}>
                    {env.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>Choose where this variable is available.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="In a form"
        description="Selects next to inputs in a new-project form. Every control shares the same height, fill and radius."
        layout="stack"
        surface="subtle"
      >
        <Card className="w-full max-w-128">
          <CardHeader>
            <CardTitle>Import a repository</CardTitle>
            <CardDescription>
              Lumen builds every push to the production branch and gives each pull request a preview URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="form-name">Project name</FieldLabel>
              <Input id="form-name" defaultValue="acme-storefront" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="form-framework">Framework preset</FieldLabel>
                <Select items={frameworks} defaultValue="nextjs">
                  <SelectTrigger id="form-framework" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((framework) => (
                      <SelectItem key={framework.value} value={framework.value}>
                        {framework.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="form-region">Region</FieldLabel>
                <Select items={regions} defaultValue="iad-1">
                  <SelectTrigger id="form-region" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="form-machine">Build machine</FieldLabel>
              <Select items={machines} defaultValue="standard">
                <SelectTrigger id="form-machine" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine.value} value={machine.value}>
                      <machine.icon />
                      {machine.label}
                      <span className="ms-auto ps-6 font-normal text-muted-foreground">{machine.spec}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Bigger machines finish builds faster and bill per build minute.</FieldDescription>
            </Field>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="ghost">Cancel</Button>
            <Button>Deploy project</Button>
          </CardFooter>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Use a select when people pick one option from a short, known list.",
          "Pass items to Select so the trigger shows a readable label.",
          "Give every select a visible label, or an aria-label when the context is obvious.",
          "Order options by how often they are picked, or alphabetically for long lists.",
        ]}
        dont={[
          "Don’t use a select for two options. Use a switch or a radio group.",
          "Don’t use it for long lists people search, such as countries. Use a combobox.",
          "Don’t put actions in a select. Use a dropdown menu.",
          "Don’t add shadows or a coloured fill to the list.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "items", type: "Record<string, ReactNode> | { label, value }[]", description: "Options on Select. Lets SelectValue render the label of the chosen value." },
          { prop: "value / defaultValue", type: "Value | null", description: "Controlled or initial value on Select." },
          { prop: "onValueChange", type: "(value, details) => void", description: "Called on Select when a new option is picked." },
          { prop: "multiple", type: "boolean", default: "false", description: "Allow more than one value. The value becomes an array." },
          { prop: "disabled", type: "boolean", default: "false", description: "On Select or a single SelectItem." },
          { prop: "SelectTrigger size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height from --control-height-*." },
          { prop: "SelectValue placeholder", type: "ReactNode", description: "Shown, muted, while nothing is selected." },
          { prop: "SelectContent side / align", type: '"top" | "bottom" | … / "start" | "center" | "end"', default: '"bottom" / "start"', description: "Where the list opens relative to the trigger." },
          { prop: "SelectContent alignItemWithTrigger", type: "boolean", default: "false", description: "Overlap the trigger so the chosen item sits on top of it, macOS style." },
          { prop: "SelectItem value", type: "Value", description: "The value this option selects." },
        ]}
      />
    </Examples>
  )
}
