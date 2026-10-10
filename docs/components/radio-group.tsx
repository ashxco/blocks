"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const views = [
  { value: "list", title: "List", description: "Tasks in rows, grouped by section. Best for quick triage." },
  { value: "board", title: "Board", description: "A column for each status. Drag cards to move work along." },
  { value: "timeline", title: "Timeline", description: "Tasks as bars across the weeks, with their dependencies." },
]

const plans = [
  { value: "pro", title: "Pro", price: "$12", detail: "Per member a month, billed annually. Unlimited projects, 10,000 automation runs and 100 GB storage." },
  { value: "business", title: "Business", price: "$24", detail: "Per member a month, billed annually. SSO, audit log and a 99.9% uptime SLA." },
  { value: "enterprise", title: "Enterprise", price: "Custom", detail: "A dedicated success manager, custom contracts and data residency." },
]

function PlanPicker() {
  const [plan, setPlan] = React.useState("pro")
  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup value={plan} onValueChange={(v) => setPlan(v as string)} className="grid gap-3 @2xl:grid-cols-3">
        {plans.map((p) => (
          <FieldLabel key={p.value}>
            <Field orientation="horizontal">
              <FieldContent className="gap-3">
                <FieldTitle>{p.title}</FieldTitle>
                <p className="text-h3 text-foreground tabular">{p.price}</p>
                <FieldDescription>{p.detail}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={p.value} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <FieldDescription>
        {plan === "enterprise"
          ? "We will contact you within one business day to set up your contract."
          : "You can change plans at any time. Changes apply to the next invoice."}
      </FieldDescription>
    </FieldSet>
  )
}

export default function RadioGroupDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Pick exactly one option. The selected circle fills with ink and shows a canvas-coloured dot."
        code={`<FieldSet>
  <FieldLegend variant="label">Default view</FieldLegend>
  <RadioGroup defaultValue="list" name="view">
    <div className="flex items-center gap-3">
      <RadioGroupItem value="list" id="list" />
      <Label htmlFor="list" className="font-medium">List</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="board" id="board" />
      <Label htmlFor="board" className="font-medium">Board</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="timeline" id="timeline" />
      <Label htmlFor="timeline" className="font-medium">Timeline</Label>
    </div>
  </RadioGroup>
</FieldSet>`}
      >
        <FieldSet>
          <FieldLegend variant="label">Default view</FieldLegend>
          <RadioGroup defaultValue="list" name="view">
            {views.map((m) => (
              <div key={m.value} className="flex items-center gap-3">
                <RadioGroupItem value={m.value} id={`rg-${m.value}`} />
                <Label htmlFor={`rg-${m.value}`} className="font-medium">
                  {m.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FieldSet>
      </Example>

      <Example
        title="With descriptions"
        layout="stack"
        description="Use horizontal fields when each option needs a line of explanation. The circle aligns to the first line."
        code={`const views = [
  { value: "list", title: "List", description: "Tasks in rows, grouped by section. Best for quick triage." },
  { value: "board", title: "Board", description: "A column for each status. Drag cards to move work along." },
  { value: "timeline", title: "Timeline", description: "Tasks as bars across the weeks, with their dependencies." },
]

<FieldSet>
  <FieldLegend variant="label">Default view</FieldLegend>
  <RadioGroup defaultValue="board" name="view" className="gap-5">
    {views.map((v) => (
      <Field key={v.value} orientation="horizontal">
        <RadioGroupItem value={v.value} id={v.value} />
        <FieldContent>
          <FieldLabel htmlFor={v.value}>{v.title}</FieldLabel>
          <FieldDescription>{v.description}</FieldDescription>
        </FieldContent>
      </Field>
    ))}
  </RadioGroup>
</FieldSet>`}
      >
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Default view</FieldLegend>
          <RadioGroup defaultValue="board" name="view-described" className="gap-5">
            {views.map((m) => (
              <Field key={m.value} orientation="horizontal">
                <RadioGroupItem value={m.value} id={`rgd-${m.value}`} />
                <FieldContent>
                  <FieldLabel htmlFor={`rgd-${m.value}`}>{m.title}</FieldLabel>
                  <FieldDescription>{m.description}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      </Example>

      <Example
        title="Choice cards"
        layout="stack"
        description="Cards suit options people compare side by side, such as plans. The whole card is the label; the selected card takes an ink border."
        code={`const plans = [
  { value: "pro", title: "Pro", price: "$12", detail: "Per member a month, billed annually. Unlimited projects, 10,000 automation runs and 100 GB storage." },
  { value: "business", title: "Business", price: "$24", detail: "Per member a month, billed annually. SSO, audit log and a 99.9% uptime SLA." },
  { value: "enterprise", title: "Enterprise", price: "Custom", detail: "A dedicated success manager, custom contracts and data residency." },
]

<FieldSet>
  <FieldLegend variant="label">Plan</FieldLegend>
  <RadioGroup value={plan} onValueChange={(v) => setPlan(v as string)} className="grid gap-3 @2xl:grid-cols-3">
    {plans.map((p) => (
      <FieldLabel key={p.value}>
        <Field orientation="horizontal">
          <FieldContent className="gap-3">
            <FieldTitle>{p.title}</FieldTitle>
            <p className="text-h3 text-foreground tabular">{p.price}</p>
            <FieldDescription>{p.detail}</FieldDescription>
          </FieldContent>
          <RadioGroupItem value={p.value} />
        </Field>
      </FieldLabel>
    ))}
  </RadioGroup>
  <FieldDescription>You can change plans at any time. Changes apply to the next invoice.</FieldDescription>
</FieldSet>`}
      >
        <PlanPicker />
      </Example>

      <Example
        title="Inline"
        layout="stack"
        description="Lay short options in a row with className. Keep it to three or four."
        code={`<FieldSet>
  <FieldLegend variant="label">Remind assignees</FieldLegend>
  <RadioGroup defaultValue="1d" name="reminder" className="flex flex-wrap gap-x-6 gap-y-3">
    <div className="flex items-center gap-3">
      <RadioGroupItem value="0d" id="reminder-0d" />
      <Label htmlFor="reminder-0d" className="font-medium">On the day</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="1d" id="reminder-1d" />
      <Label htmlFor="reminder-1d" className="font-medium">1 day before</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="7d" id="reminder-7d" />
      <Label htmlFor="reminder-7d" className="font-medium">1 week before</Label>
    </div>
  </RadioGroup>
</FieldSet>`}
      >
        <FieldSet>
          <FieldLegend variant="label">Remind assignees</FieldLegend>
          <RadioGroup defaultValue="1d" name="reminder" className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { value: "0d", label: "On the day" },
              { value: "1d", label: "1 day before" },
              { value: "7d", label: "1 week before" },
            ].map((o) => (
              <div key={o.value} className="flex items-center gap-3">
                <RadioGroupItem value={o.value} id={`rgi-${o.value}`} />
                <Label htmlFor={`rgi-${o.value}`} className="font-medium">
                  {o.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FieldSet>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Disable single options with a reason nearby, or mark the group invalid when nothing is chosen."
        code={`<RadioGroup defaultValue="member" name="role">
  <Field orientation="horizontal">
    <RadioGroupItem value="member" id="member" />
    <FieldLabel htmlFor="member">Member</FieldLabel>
  </Field>
  <Field orientation="horizontal">
    <RadioGroupItem value="guest" id="guest" />
    <FieldLabel htmlFor="guest">Guest</FieldLabel>
  </Field>
  <Field orientation="horizontal" data-disabled>
    <RadioGroupItem value="admin" id="admin" disabled />
    <FieldContent>
      <FieldLabel htmlFor="admin">Admin</FieldLabel>
      <FieldDescription>Only the workspace owner can add admins.</FieldDescription>
    </FieldContent>
  </Field>
</RadioGroup>

<RadioGroup name="open-tasks" aria-invalid aria-describedby="open-tasks-error">
  <Field orientation="horizontal" data-invalid>
    <RadioGroupItem value="backlog" id="backlog" aria-invalid />
    <FieldLabel htmlFor="backlog">Move them to the backlog</FieldLabel>
  </Field>
  <Field orientation="horizontal" data-invalid>
    <RadioGroupItem value="done" id="done" aria-invalid />
    <FieldLabel htmlFor="done">Mark them as done</FieldLabel>
  </Field>
</RadioGroup>
<FieldError id="open-tasks-error">Choose what happens to the 14 open tasks.</FieldError>`}
      >
        <div className="grid w-full max-w-2xl gap-10 @xl:grid-cols-2">
          <FieldSet>
            <FieldLegend variant="label">Role for new members</FieldLegend>
            <RadioGroup defaultValue="member" name="role-states">
              <Field orientation="horizontal">
                <RadioGroupItem value="member" id="rgs-member" />
                <FieldLabel htmlFor="rgs-member">Member</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="guest" id="rgs-guest" />
                <FieldLabel htmlFor="rgs-guest">Guest</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled="true">
                <RadioGroupItem value="admin" id="rgs-admin" disabled />
                <FieldContent>
                  <FieldLabel htmlFor="rgs-admin">Admin</FieldLabel>
                  <FieldDescription>Only the workspace owner can add admins.</FieldDescription>
                </FieldContent>
              </Field>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend variant="label">Open tasks</FieldLegend>
            <RadioGroup name="open-tasks-states" aria-invalid aria-describedby="rgs-error">
              <Field orientation="horizontal" data-invalid>
                <RadioGroupItem value="backlog" id="rgs-backlog" aria-invalid />
                <FieldLabel htmlFor="rgs-backlog">Move them to the backlog</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-invalid>
                <RadioGroupItem value="done" id="rgs-done" aria-invalid />
                <FieldLabel htmlFor="rgs-done">Mark them as done</FieldLabel>
              </Field>
            </RadioGroup>
            <FieldError id="rgs-error">Choose what happens to the 14 open tasks.</FieldError>
          </FieldSet>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a radio group for two to six mutually exclusive options.",
          "Select a sensible default unless the choice needs a deliberate decision.",
          "Order options by frequency or by size, smallest first.",
        ]}
        dont={[
          "Don’t use radios for options that can be combined. Use checkboxes.",
          "Don’t use a radio group for long lists. Use a select.",
          "Don’t hide what an option costs or changes. Put it in the description.",
        ]}
      />

      <ApiTable
        title="RadioGroup"
        rows={[
          { prop: "value / defaultValue", type: "string", description: "The selected item’s value, controlled or initial." },
          { prop: "onValueChange", type: "(value: unknown) => void", description: "Called with the new value when the selection changes." },
          { prop: "name", type: "string", description: "Submitted with the form." },
          { prop: "disabled", type: "boolean", default: "false", description: "Disables every item." },
          { prop: "required", type: "boolean", default: "false", description: "A value must be chosen before the form submits." },
          { prop: "className", type: "string", default: '"grid gap-3"', description: "Layout of the items: a column, a row or a grid of cards." },
        ]}
      />

      <ApiTable
        title="RadioGroupItem"
        rows={[
          { prop: "value", type: "string", description: "The value this item selects." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the item and skips it with the arrow keys." },
          { prop: "aria-invalid", type: "boolean", description: "Destructive border while unselected." },
        ]}
      />
    </Examples>
  )
}
