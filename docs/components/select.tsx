"use client"

import * as React from "react"
import { CheckIcon, CpuIcon, GaugeIcon, RocketIcon } from "lucide-react"

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
  selectStyles,
} from "@/components/ui/select"
import { tokens } from "@/design-system/generated/tokens"
import { cn } from "@/lib/utils"

/** A dimension token in px, read from the generated tokens so the copy follows the system. */
function tokenPx(cssVar: string) {
  const value = tokens.find((token) => token.cssVar === cssVar)?.value
  return typeof value === "string" && value.endsWith("rem") ? `${parseFloat(value) * 16}px` : String(value ?? "")
}

const regions = [
  { label: "Frankfurt (fra1)", value: "fra1" },
  { label: "Washington, D.C. (iad1)", value: "iad1" },
  { label: "San Francisco (sfo1)", value: "sfo1" },
  { label: "São Paulo (gru1)", value: "gru1" },
  { label: "Singapore (sin1)", value: "sin1" },
  { label: "Sydney (syd1)", value: "syd1" },
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
  { label: "Standard", value: "standard", spec: "4 vCPU · 8 GB", icon: CpuIcon },
  { label: "Enhanced", value: "enhanced", spec: "8 vCPU · 16 GB", icon: GaugeIcon },
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

/* -------------------------------------------------------------------------- */
/* The open list, shown under the trigger                                     */
/* -------------------------------------------------------------------------- */

/**
 * A picture of the open list under its trigger, drawn with the select's own
 * recipes so readers see groups, icons and details without opening it. It is
 * hidden from assistive technology and steps aside while the real list, which
 * opens in the same place, is showing.
 */
function OpenList({ hidden, children }: { hidden: boolean; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" inert className={cn(selectStyles.list, "w-full", hidden && "invisible")}>
      {children}
    </div>
  )
}

function OpenListItem({ selected, children }: { selected?: boolean; children: React.ReactNode }) {
  return (
    <div className={selectStyles.item} data-selected={selected ? "" : undefined}>
      <span className={selectStyles.itemText}>{children}</span>
      {selected ? (
        <span className={selectStyles.itemIndicator}>
          <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
        </span>
      ) : null}
    </div>
  )
}

function RuntimeSelect() {
  const [value, setValue] = React.useState<string | null>("node-22")
  const [open, setOpen] = React.useState(false)
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="select-runtime">Runtime</FieldLabel>
        <Select
          items={runtimes.flatMap((group) => group.items)}
          value={value}
          onValueChange={(next) => setValue(next as string | null)}
          onOpenChange={setOpen}
        >
          <SelectTrigger id="select-runtime" className="w-full">
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
      </Field>
      <OpenList hidden={open}>
        {runtimes.map((group, index) => (
          <React.Fragment key={group.label}>
            {index > 0 ? <div className={selectStyles.separator} /> : null}
            <div className={selectStyles.label}>{group.label}</div>
            {group.items.map((item) => (
              <OpenListItem key={item.value} selected={item.value === value}>
                {item.label}
              </OpenListItem>
            ))}
          </React.Fragment>
        ))}
      </OpenList>
    </div>
  )
}

function MachineSelect() {
  const [value, setValue] = React.useState<string | null>("enhanced")
  const [open, setOpen] = React.useState(false)
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="select-machine">Build machine</FieldLabel>
        <Select
          items={machines}
          value={value}
          onValueChange={(next) => setValue(next as string | null)}
          onOpenChange={setOpen}
        >
          <SelectTrigger id="select-machine" className="w-full">
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
      </Field>
      <OpenList hidden={open}>
        {machines.map((machine) => (
          <OpenListItem key={machine.value} selected={machine.value === value}>
            <machine.icon />
            {machine.label}
            <span className="ms-auto ps-6 font-normal text-muted-foreground">{machine.spec}</span>
          </OpenListItem>
        ))}
      </OpenList>
    </div>
  )
}

const sizes = [
  { size: "sm", label: "Small", height: tokenPx("--control-height-sm") },
  { size: "default", label: "Medium", height: tokenPx("--control-height-md") },
  { size: "lg", label: "Large", height: tokenPx("--control-height-lg") },
] as const

export default function SelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Pass the options as items so the trigger shows the label of the chosen value, not the raw value."
        code={`const regions = [
  { label: "Frankfurt (fra1)", value: "fra1" },
  { label: "Washington, D.C. (iad1)", value: "iad1" },
]

<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <Select items={regions} defaultValue="fra1">
    <SelectTrigger id="region" className="w-full">
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
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="select-region">Region</FieldLabel>
          <Select items={regions} defaultValue="fra1">
            <SelectTrigger id="select-region" className="w-full">
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
      </Example>

      <Example
        title="Placeholder"
        layout="stack"
        description="Leave the value empty and say what to choose. The placeholder is muted until a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="environment">Environment</FieldLabel>
  <Select items={environments}>
    <SelectTrigger id="environment" className="w-full">
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
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="select-environment">Environment</FieldLabel>
          <Select items={environments}>
            <SelectTrigger id="select-environment" className="w-full">
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
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="Heights come from the control tokens, so a select lines up with inputs and buttons of the same size. Medium is the default; keep one size per form."
        code={`{(["sm", "default", "lg"] as const).map((size) => (
  <Select key={size} items={environments} defaultValue="production">
    <SelectTrigger size={size} className="w-full" aria-label="Environment">
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
))}`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {sizes.map(({ size, label, height }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`select-size-${size}`}>
                {label} <span className="font-normal text-muted-foreground">{height}</span>
              </FieldLabel>
              <Select items={environments} defaultValue="production">
                <SelectTrigger id={`select-size-${size}`} size={size} className="w-full">
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
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="Groups"
        layout="stack"
        description="Group long lists under short labels and split the groups with a separator. The list is drawn open under the trigger."
        code={`<Select items={runtimes.flatMap((group) => group.items)} defaultValue="node-22">
  <SelectTrigger id="runtime" className="w-full">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Node.js</SelectLabel>
      <SelectItem value="node-22">Node.js 22 LTS</SelectItem>
      <SelectItem value="node-20">Node.js 20</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Other runtimes</SelectLabel>
      <SelectItem value="bun-1.2">Bun 1.2</SelectItem>
      <SelectItem value="deno-2">Deno 2</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}
      >
        <RuntimeSelect />
      </Example>

      <Example
        title="Icons and details"
        layout="stack"
        description="Items can carry an icon and a muted detail. The trigger still shows only the label from items."
        code={`<SelectItem value="enhanced">
  <GaugeIcon />
  Enhanced
  <span className="ms-auto ps-6 font-normal text-muted-foreground">8 vCPU · 16 GB</span>
</SelectItem>`}
      >
        <MachineSelect />
      </Example>

      <Example
        title="States"
        description="Disabled selects fade and stop responding. Invalid selects turn the border red; say what to fix under them."
        layout="stack"
        code={`<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <Select items={regions} defaultValue="fra1" disabled>
    <SelectTrigger id="region" className="w-full"><SelectValue /></SelectTrigger>
    <SelectContent>
      {regions.map((region) => (
        <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldDescription>Set when the project was created.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="environment">Environment</FieldLabel>
  <Select items={environments}>
    <SelectTrigger id="environment" className="w-full" aria-invalid>
      <SelectValue placeholder="Choose an environment" />
    </SelectTrigger>
    <SelectContent>
      {environments.map((env) => (
        <SelectItem key={env.value} value={env.value}>{env.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldError>Choose where this variable is available.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="select-disabled">Region</FieldLabel>
            <Select items={regions} defaultValue="fra1" disabled>
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
        surface="subtle"
        code={`<Card className="@container/card">
  <CardHeader>
    <CardTitle>Import a repository</CardTitle>
    <CardDescription>
      Lumen builds every push to the production branch and gives each pull request a preview URL.
    </CardDescription>
  </CardHeader>
  <CardContent className="grid gap-5">
    <Field>
      <FieldLabel htmlFor="name">Project name</FieldLabel>
      <Input id="name" defaultValue="acme-web" />
    </Field>
    <div className="grid gap-5 @sm/card:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="framework">Framework preset</FieldLabel>
        <Select items={frameworks} defaultValue="nextjs">
          <SelectTrigger id="framework" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {frameworks.map((framework) => (
              <SelectItem key={framework.value} value={framework.value}>{framework.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <Select items={regions} defaultValue="fra1">
          <SelectTrigger id="region" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
    <Field>
      <FieldLabel htmlFor="machine">Build machine</FieldLabel>
      <Select items={machines} defaultValue="standard">
        <SelectTrigger id="machine" className="w-full"><SelectValue /></SelectTrigger>
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
</Card>`}
      >
        <Card className="@container/card w-full max-w-md">
          <CardHeader>
            <CardTitle>Import a repository</CardTitle>
            <CardDescription className="text-pretty">
              Lumen builds every push to the production branch and gives each pull request a preview URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="form-name">Project name</FieldLabel>
              <Input id="form-name" defaultValue="acme-web" />
            </Field>
            <div className="grid gap-5 @sm/card:grid-cols-2">
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
                <Select items={regions} defaultValue="fra1">
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
          "Give every select a visible label. Use an aria-label only in toolbars where the context is obvious.",
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
