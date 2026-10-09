"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"

const events = [
  { id: "deploys", label: "Production deployments" },
  { id: "failures", label: "Failed builds" },
  { id: "comments", label: "Comments on previews" },
  { id: "domains", label: "Domain and certificate renewals" },
] as const

type EventId = (typeof events)[number]["id"]

function NotificationGroup() {
  const [selected, setSelected] = React.useState<EventId[]>(["deploys", "failures"])
  const all = selected.length === events.length
  const some = selected.length > 0 && !all

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label">Email me about</FieldLegend>
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal">
          <Checkbox
            id="cb-all"
            checked={all}
            indeterminate={some}
            onCheckedChange={(checked) => setSelected(checked ? events.map((e) => e.id) : [])}
            aria-controls={events.map((e) => `cb-${e.id}`).join(" ")}
          />
          <FieldLabel htmlFor="cb-all">All activity</FieldLabel>
        </Field>
        {events.map((event) => (
          // Children sit one box and one gap in, under the parent's label.
          <Field key={event.id} orientation="horizontal" className="ps-[calc(var(--selection-size)+--spacing(3))]">
            <Checkbox
              id={`cb-${event.id}`}
              checked={selected.includes(event.id)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, event.id] : current.filter((id) => id !== event.id)
                )
              }
            />
            <FieldLabel htmlFor={`cb-${event.id}`}>{event.label}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}

const addons = [
  { value: "analytics", title: "Web analytics", description: "Page views and top referrers, without cookies.", price: "Included" },
  { value: "speed", title: "Speed insights", description: "Core Web Vitals from real visits, by route.", price: "$10 / month" },
  { value: "drains", title: "Log drains", description: "Stream build and runtime logs to your own store.", price: "$20 / month" },
]

export default function CheckboxDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A hairline square that fills with ink when checked. Violet appears only as the focus outline."
        code={`<div className="flex items-center gap-2">
  <Checkbox id="failures" defaultChecked />
  <Label htmlFor="failures" className="font-medium">
    Email me when a build fails
  </Label>
</div>`}
      >
        <div className="flex items-center gap-2">
          <Checkbox id="cb-default" defaultChecked />
          <Label htmlFor="cb-default" className="font-medium">
            Email me when a build fails
          </Label>
        </div>
      </Example>

      <Example
        title="States"
        description="Unchecked, checked and indeterminate, each with its disabled and invalid forms. Indeterminate shows a dash for a partly selected group."
        code={`<Checkbox aria-label="Off" />
<Checkbox aria-label="On" defaultChecked />
<Checkbox aria-label="Mixed" indeterminate />
<Checkbox aria-label="Disabled" disabled />
<Checkbox aria-label="Disabled on" disabled defaultChecked />
<Checkbox aria-label="Invalid" aria-invalid />`}
      >
        <div className="grid grid-cols-3 gap-x-10 gap-y-6 @xl:grid-cols-6">
          {[
            { label: "Off", props: {} },
            { label: "On", props: { defaultChecked: true } },
            { label: "Mixed", props: { indeterminate: true } },
            { label: "Disabled", props: { disabled: true } },
            { label: "Disabled on", props: { disabled: true, defaultChecked: true } },
            { label: "Invalid", props: { "aria-invalid": true } },
          ].map(({ label, props }) => (
            <div key={label} className="grid justify-items-center gap-2.5">
              <Checkbox aria-label={label} {...props} />
              <span className="text-center text-caption text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="With a description"
        layout="stack"
        description="Wrap the label and description in FieldContent. The box aligns to the first line of the label."
        code={`<FieldGroup>
  <Field orientation="horizontal">
    <Checkbox id="protect" defaultChecked />
    <FieldContent>
      <FieldLabel htmlFor="protect">Protect preview deployments</FieldLabel>
      <FieldDescription>Visitors sign in with Lumen before they see a preview.</FieldDescription>
    </FieldContent>
  </Field>
  <Field orientation="horizontal">
    <Checkbox id="skew" />
    <FieldContent>
      <FieldLabel htmlFor="skew">Skew protection</FieldLabel>
      <FieldDescription>Keep each visitor on the build they loaded until they refresh.</FieldDescription>
    </FieldContent>
  </Field>
</FieldGroup>`}
      >
        <FieldGroup className="max-w-md">
          <Field orientation="horizontal">
            <Checkbox id="cb-protect" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="cb-protect">Protect preview deployments</FieldLabel>
              <FieldDescription>Visitors sign in with Lumen before they see a preview.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cb-skew" />
            <FieldContent>
              <FieldLabel htmlFor="cb-skew">Skew protection</FieldLabel>
              <FieldDescription>Keep each visitor on the build they loaded until they refresh.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Select all"
        layout="stack"
        description="A parent checkbox is indeterminate while only some children are on, and toggles all of them. The children sit indented under it."
        code={`const [selected, setSelected] = React.useState(["deploys", "failures"])
const all = selected.length === events.length
const some = selected.length > 0 && !all

<FieldSet>
  <FieldLegend variant="label">Email me about</FieldLegend>
  <FieldGroup data-slot="checkbox-group">
    <Field orientation="horizontal">
      <Checkbox
        id="all"
        checked={all}
        indeterminate={some}
        onCheckedChange={(checked) => setSelected(checked ? events.map((e) => e.id) : [])}
      />
      <FieldLabel htmlFor="all">All activity</FieldLabel>
    </Field>
    {events.map((event) => (
      <Field key={event.id} orientation="horizontal" className="ps-[calc(var(--selection-size)+--spacing(3))]">
        <Checkbox
          id={event.id}
          checked={selected.includes(event.id)}
          onCheckedChange={(checked) =>
            setSelected((current) => (checked ? [...current, event.id] : current.filter((id) => id !== event.id)))
          }
        />
        <FieldLabel htmlFor={event.id}>{event.label}</FieldLabel>
      </Field>
    ))}
  </FieldGroup>
</FieldSet>`}
      >
        <NotificationGroup />
      </Example>

      <Example
        title="Choice cards"
        layout="stack"
        description="For options that need more than a line, wrap a horizontal field in FieldLabel. Checked cards take an ink border."
        code={`<FieldSet>
  <FieldLegend variant="label">Add-ons</FieldLegend>
  <div className="grid gap-3">
    {addons.map((addon, index) => (
      <FieldLabel key={addon.value}>
        <Field orientation="horizontal">
          <Checkbox name="addons" value={addon.value} defaultChecked={index === 0} />
          <FieldContent>
            <FieldTitle>{addon.title}</FieldTitle>
            <FieldDescription>{addon.description}</FieldDescription>
          </FieldContent>
          <span className="shrink-0 text-caption font-semibold text-foreground tabular">{addon.price}</span>
        </Field>
      </FieldLabel>
    ))}
  </div>
</FieldSet>`}
      >
        <FieldSet className="w-full max-w-md">
          <FieldLegend variant="label">Add-ons</FieldLegend>
          <div className="grid gap-3">
            {addons.map((addon, index) => (
              <FieldLabel key={addon.value}>
                <Field orientation="horizontal">
                  <Checkbox name="addons" value={addon.value} defaultChecked={index === 0} />
                  <FieldContent>
                    <FieldTitle>{addon.title}</FieldTitle>
                    <FieldDescription>{addon.description}</FieldDescription>
                  </FieldContent>
                  <span className="shrink-0 text-caption font-semibold text-foreground tabular">{addon.price}</span>
                </Field>
              </FieldLabel>
            ))}
          </div>
        </FieldSet>
      </Example>

      <Example
        title="Required"
        layout="stack"
        description="When a box must be ticked, say why in the error and keep the label specific."
        code={`<Field orientation="horizontal" data-invalid>
  <Checkbox id="terms" aria-invalid aria-describedby="terms-error" />
  <FieldContent>
    <FieldLabel htmlFor="terms">I understand this deletes every deployment of acme-web</FieldLabel>
    <FieldError id="terms-error">Tick the box to confirm, then delete the project.</FieldError>
  </FieldContent>
</Field>`}
      >
        <div className="w-full max-w-md">
          <Field orientation="horizontal" data-invalid>
            <Checkbox id="cb-terms" aria-invalid aria-describedby="cb-terms-error" />
            <FieldContent>
              <FieldLabel htmlFor="cb-terms">
                <span>
                  I understand this deletes every deployment of <span className="whitespace-nowrap">acme-web</span>
                </span>
              </FieldLabel>
              <FieldError id="cb-terms-error">Tick the box to confirm, then delete the project.</FieldError>
            </FieldContent>
          </Field>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use checkboxes for independent options and for settings saved with a button.",
          "Write labels as positive statements: “Email me about failed builds”.",
          "Use indeterminate only for a parent whose children are partly selected.",
          "Put the box before the label, and let the label toggle it too.",
        ]}
        dont={[
          "Don’t use a checkbox for a setting that applies immediately. Use a switch.",
          "Don’t use a checkbox to pick one option from a set. Use a radio group.",
          "Don’t write negative labels like “Don’t send emails”.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state." },
          { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Called when the box is ticked or unticked." },
          { prop: "indeterminate", type: "boolean", default: "false", description: "Shows a dash for a partly selected group." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the box and blocks interaction." },
          { prop: "aria-invalid", type: "boolean", description: "Destructive border while unchecked." },
          { prop: "name / value", type: "string", description: "Submitted with the form when checked." },
          { prop: "required", type: "boolean", default: "false", description: "Must be checked before the form submits." },
        ]}
      />
    </Examples>
  )
}
