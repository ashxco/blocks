"use client"

import { KeyRoundIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, typeRole } from "@/docs/kit"
import { Checkbox } from "@/components/ui/checkbox"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

/** The label type role, read from the tokens so the copy follows the system. */
const label = typeRole("--text-label")
const labelRole = `${label.px}px, ${label.weight}`

export default function LabelDocs() {
  return (
    <Examples>
      <Example
        title="With an input"
        layout="stack"
        description={`The label type role (${labelRole}) in full ink. Point htmlFor at the control’s id so clicking the label focuses it.`}
        code={`<div className="grid gap-2">
  <Label htmlFor="team">Team name</Label>
  <Input id="team" placeholder="Product design" />
</div>`}
      >
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="label-team">Team name</Label>
          <Input id="label-team" placeholder="Product design" />
        </div>
      </Example>

      <Example
        title="With selection controls"
        layout="stack"
        description="Put the label after a checkbox and before a switch. Use htmlFor, or wrap the control so the whole row is clickable."
        code={`<Label className="font-medium">
  <Checkbox defaultChecked />
  Email me when a task is assigned to me
</Label>

<div className="flex items-center justify-between gap-4">
  <Label htmlFor="weekly-summary" className="font-medium">
    Send me a weekly summary
  </Label>
  <Switch id="weekly-summary" defaultChecked />
</div>`}
      >
        <div className="grid w-full max-w-sm gap-5">
          <Label className="font-medium">
            <Checkbox defaultChecked />
            Email me when a task is assigned to me
          </Label>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="label-weekly-summary" className="font-medium">
              Send me a weekly summary
            </Label>
            <Switch id="label-weekly-summary" defaultChecked />
          </div>
        </div>
      </Example>

      <Example
        title="Optional and icons"
        layout="stack"
        description="Mark the minority. When most fields are required, add “Optional” to the rest in muted text. A leading icon takes the muted colour."
        code={`<div className="grid gap-2">
  <Label htmlFor="company">
    Company <span className="font-normal text-muted-foreground">Optional</span>
  </Label>
  <Input id="company" autoComplete="organization" placeholder="Acme Inc." />
</div>

<div className="grid gap-2">
  <Label htmlFor="api-key">
    <KeyRoundIcon />
    API key
  </Label>
  <Input id="api-key" type="password" className="font-mono" />
</div>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <div className="grid gap-2">
            <Label htmlFor="label-company">
              Company <span className="font-normal text-muted-foreground">Optional</span>
            </Label>
            <Input id="label-company" autoComplete="organization" placeholder="Acme Inc." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label-api-key">
              <KeyRoundIcon />
              API key
            </Label>
            <Input id="label-api-key" type="password" defaultValue="acme_8Kx2f9QpT4" className="font-mono" />
          </div>
        </div>
      </Example>

      <Example
        title="Disabled"
        layout="stack"
        description="A label dims with its control. When the control comes first and carries the peer class, as a checkbox does, that happens on its own. When the label comes first, as before a switch, set data-disabled on the surrounding Field."
        code={`<div className="flex items-center gap-3">
  <Checkbox id="guest-invites" disabled />
  <Label htmlFor="guest-invites" className="font-medium">
    Let guests invite other guests
  </Label>
</div>

<Field orientation="horizontal" data-disabled className="justify-between gap-4">
  <Label htmlFor="require-2fa" className="font-medium">
    Require two-factor authentication
  </Label>
  <Switch id="require-2fa" disabled defaultChecked />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-5">
          <div className="flex items-center gap-3">
            <Checkbox id="label-disabled-check" disabled />
            <Label htmlFor="label-disabled-check" className="font-medium">
              Let guests invite other guests
            </Label>
          </div>
          <Field orientation="horizontal" data-disabled="true" className="justify-between gap-4">
            <Label htmlFor="label-disabled-switch" className="font-medium">
              Require two-factor authentication
            </Label>
            <Switch id="label-disabled-switch" disabled defaultChecked />
          </Field>
        </div>
      </Example>

      <Guidelines
        do={[
          "Write labels as short nouns: “Team name”, not “Enter your team name”.",
          "Use sentence case and no colon at the end.",
          "Keep the label visible above or beside its control at all times.",
        ]}
        dont={[
          "Don’t grey out labels to make a form look lighter. Labels are ink.",
          "Don’t put help text inside the label. Use FieldDescription.",
          "Don’t mark every field with an asterisk when most are required.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "htmlFor", type: "string", description: "The id of the control it names. Leave it out when the label wraps the control." },
          { prop: "children", type: "ReactNode", description: "The text, with an optional leading icon that turns muted." },
          { prop: "className", type: "string", description: "Use font-medium for option labels beside checkboxes and radios." },
        ]}
      />
    </Examples>
  )
}
