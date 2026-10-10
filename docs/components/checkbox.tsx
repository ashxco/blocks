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
  { id: "assigned", label: "Tasks assigned to me" },
  { id: "mentions", label: "Comments and mentions" },
  { id: "due", label: "Tasks due tomorrow" },
  { id: "status", label: "Project status changes" },
] as const

type EventId = (typeof events)[number]["id"]

function NotificationGroup() {
  const [selected, setSelected] = React.useState<EventId[]>(["assigned", "mentions"])
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

const copyOptions = [
  { value: "tasks", title: "Tasks and subtasks", description: "Keeps assignees and priorities. Due dates are cleared.", count: "42 tasks" },
  { value: "docs", title: "Docs", description: "Specs and meeting notes, with their comments.", count: "6 docs" },
  { value: "automations", title: "Automations", description: "Rules start paused until you turn them on.", count: "3 rules" },
]

export default function CheckboxDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A hairline square that fills with ink when checked. The accent appears only as the focus outline."
        code={`<div className="flex items-center gap-3">
  <Checkbox id="overdue" defaultChecked />
  <Label htmlFor="overdue" className="font-medium">
    Email me when a task is overdue
  </Label>
</div>`}
      >
        <div className="flex items-center gap-3">
          <Checkbox id="cb-default" defaultChecked />
          <Label htmlFor="cb-default" className="font-medium">
            Email me when a task is overdue
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
    <Checkbox id="approval" defaultChecked />
    <FieldContent>
      <FieldLabel htmlFor="approval">Require approval</FieldLabel>
      <FieldDescription>Tasks move to Done only after the project owner approves them.</FieldDescription>
    </FieldContent>
  </Field>
  <Field orientation="horizontal">
    <Checkbox id="subtasks" />
    <FieldContent>
      <FieldLabel htmlFor="subtasks">Close subtasks with their parent</FieldLabel>
      <FieldDescription>When a task is marked done, its open subtasks are completed too.</FieldDescription>
    </FieldContent>
  </Field>
</FieldGroup>`}
      >
        <FieldGroup className="max-w-md">
          <Field orientation="horizontal">
            <Checkbox id="cb-approval" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="cb-approval">Require approval</FieldLabel>
              <FieldDescription>Tasks move to Done only after the project owner approves them.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cb-subtasks" />
            <FieldContent>
              <FieldLabel htmlFor="cb-subtasks">Close subtasks with their parent</FieldLabel>
              <FieldDescription>When a task is marked done, its open subtasks are completed too.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Select all"
        layout="stack"
        description="A parent checkbox is indeterminate while only some children are on, and toggles all of them. The children sit indented under it."
        code={`const [selected, setSelected] = React.useState(["assigned", "mentions"])
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
        description="For options that need more than a line, wrap a horizontal field in FieldLabel. As on every choice card, the text leads and the box sits at the top right; checked cards take an ink border."
        code={`<FieldSet>
  <FieldLegend variant="label">Copy into the new project</FieldLegend>
  <div className="grid gap-3">
    {copyOptions.map((option, index) => (
      <FieldLabel key={option.value}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{option.title}</FieldTitle>
            <FieldDescription>{option.description}</FieldDescription>
            <p className="mt-1 text-label text-foreground tabular">{option.count}</p>
          </FieldContent>
          <Checkbox name="copy" value={option.value} defaultChecked={index === 0} />
        </Field>
      </FieldLabel>
    ))}
  </div>
</FieldSet>`}
      >
        <FieldSet className="w-full max-w-md">
          <FieldLegend variant="label">Copy into the new project</FieldLegend>
          <div className="grid gap-3">
            {copyOptions.map((option, index) => (
              <FieldLabel key={option.value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{option.title}</FieldTitle>
                    <FieldDescription>{option.description}</FieldDescription>
                    <p className="mt-1 text-label text-foreground tabular">{option.count}</p>
                  </FieldContent>
                  <Checkbox name="copy" value={option.value} defaultChecked={index === 0} />
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
    <FieldLabel htmlFor="terms">I understand this deletes every task in Onboarding redesign</FieldLabel>
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
                  I understand this deletes every task in <span className="whitespace-nowrap">Onboarding redesign</span>
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
          "Write labels as positive statements: “Email me about overdue tasks”.",
          "Use indeterminate only for a parent whose children are partly selected.",
          "Put the box before a one-line label and let the label toggle it too. In choice cards it moves to the top right.",
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
