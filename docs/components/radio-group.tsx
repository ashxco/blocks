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

const machines = [
  { value: "standard", title: "Standard", description: "4 vCPU, 8 GB memory. Fine for most sites." },
  { value: "enhanced", title: "Enhanced", description: "8 vCPU, 16 GB memory. Halves build time for large apps." },
  { value: "turbo", title: "Turbo", description: "30 vCPU, 60 GB memory. For monorepos with many packages." },
]

const plans = [
  { value: "hobby", title: "Hobby", price: "$0", detail: "Personal projects and experiments." },
  { value: "pro", title: "Pro", price: "$20", detail: "Per member, per month. For teams in production." },
  { value: "enterprise", title: "Enterprise", price: "Custom", detail: "SSO, audit logs and a 99.99% SLA." },
]

function PlanPicker() {
  const [plan, setPlan] = React.useState("pro")
  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup value={plan} onValueChange={(v) => setPlan(v as string)} className="grid gap-3 md:grid-cols-3">
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
        code={`<RadioGroup defaultValue="standard">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="standard" id="standard" />
    <Label htmlFor="standard">Standard</Label>
  </div>
  …
</RadioGroup>`}
      >
        <FieldSet>
          <FieldLegend variant="label">Build machine</FieldLegend>
          <RadioGroup defaultValue="standard" name="machine">
            {machines.map((m) => (
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
        code={`<RadioGroup defaultValue="enhanced">
  <Field orientation="horizontal">
    <RadioGroupItem value="enhanced" id="enhanced" />
    <FieldContent>
      <FieldLabel htmlFor="enhanced">Enhanced</FieldLabel>
      <FieldDescription>8 vCPU, 16 GB memory.</FieldDescription>
    </FieldContent>
  </Field>
</RadioGroup>`}
      >
        <FieldSet className="max-w-112">
          <FieldLegend variant="label">Build machine</FieldLegend>
          <RadioGroup defaultValue="enhanced" name="machine-described" className="gap-5">
            {machines.map((m) => (
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
        code={`<RadioGroup defaultValue="pro" className="md:grid-cols-3">
  <FieldLabel>
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Pro</FieldTitle>
        <FieldDescription>For teams in production.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="pro" />
    </Field>
  </FieldLabel>
  …
</RadioGroup>`}
      >
        <PlanPicker />
      </Example>

      <Example
        title="Inline"
        layout="stack"
        description="Lay short options in a row with className. Keep it to three or four."
        code={`<RadioGroup defaultValue="7d" className="flex flex-wrap gap-x-6 gap-y-3">…</RadioGroup>`}
      >
        <FieldSet>
          <FieldLegend variant="label">Log retention</FieldLegend>
          <RadioGroup defaultValue="7d" name="retention" className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { value: "1d", label: "1 day" },
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days" },
            ].map((o) => (
              <div key={o.value} className="flex items-center gap-2.5">
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
      >
        <div className="grid w-full max-w-168 gap-10 md:grid-cols-2">
          <FieldSet>
            <FieldLegend variant="label">Region</FieldLegend>
            <RadioGroup defaultValue="fra1" name="region-states">
              <Field orientation="horizontal">
                <RadioGroupItem value="fra1" id="rgs-fra1" />
                <FieldLabel htmlFor="rgs-fra1">Frankfurt (fra1)</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="lhr1" id="rgs-lhr1" />
                <FieldLabel htmlFor="rgs-lhr1">London (lhr1)</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled="true">
                <RadioGroupItem value="gru1" id="rgs-gru1" disabled />
                <FieldContent>
                  <FieldLabel htmlFor="rgs-gru1">São Paulo (gru1)</FieldLabel>
                  <FieldDescription>Available on Pro and above.</FieldDescription>
                </FieldContent>
              </Field>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend variant="label">Rollback target</FieldLegend>
            <RadioGroup name="rollback-states" aria-invalid aria-describedby="rgs-error">
              <Field orientation="horizontal" data-invalid>
                <RadioGroupItem value="previous" id="rgs-previous" aria-invalid />
                <FieldLabel htmlFor="rgs-previous">Previous production build</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-invalid>
                <RadioGroupItem value="tagged" id="rgs-tagged" aria-invalid />
                <FieldLabel htmlFor="rgs-tagged">Last tagged release</FieldLabel>
              </Field>
            </RadioGroup>
            <FieldError id="rgs-error">Choose which build to roll back to.</FieldError>
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
