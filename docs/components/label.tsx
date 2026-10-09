"use client"

import { KeyRoundIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function LabelDocs() {
  return (
    <Examples>
      <Example
        title="With an input"
        layout="stack"
        description="Label-role type: 14px, semibold, full ink. Point htmlFor at the control's id so clicking the label focuses it."
        code={`<Label htmlFor="team">Team name</Label>
<Input id="team" placeholder="Halcyon Labs" />`}
      >
        <div className="grid w-full max-w-96 gap-2">
          <Label htmlFor="label-team">Team name</Label>
          <Input id="label-team" placeholder="Halcyon Labs" />
        </div>
      </Example>

      <Example
        title="With selection controls"
        layout="stack"
        description="Put the label after a checkbox and before a switch. Use htmlFor, or wrap the control so the whole row is clickable."
        code={`<Label>
  <Checkbox defaultChecked />
  Email me when a production build fails
</Label>

<div className="flex items-center justify-between gap-4">
  <Label htmlFor="auto-deploy">Deploy on push</Label>
  <Switch id="auto-deploy" defaultChecked />
</div>`}
      >
        <div className="grid w-full max-w-96 gap-5">
          <Label className="font-medium">
            <Checkbox defaultChecked />
            Email me when a production build fails
          </Label>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="label-auto-deploy" className="font-medium">
              Deploy on push
            </Label>
            <Switch id="label-auto-deploy" defaultChecked />
          </div>
        </div>
      </Example>

      <Example
        title="Optional and icons"
        layout="stack"
        description="Mark the minority. When most fields are required, add “Optional” to the rest in muted text. A leading icon takes the muted colour."
        code={`<Label htmlFor="company">
  Company <span className="font-normal text-muted-foreground">Optional</span>
</Label>

<Label htmlFor="token">
  <KeyRoundIcon />
  Access token
</Label>`}
      >
        <div className="grid w-full max-w-96 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="label-company">
              Company <span className="font-normal text-muted-foreground">Optional</span>
            </Label>
            <Input id="label-company" autoComplete="organization" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label-token">
              <KeyRoundIcon />
              Access token
            </Label>
            <Input id="label-token" type="password" defaultValue="lmn_8Kx2f9QpT4" className="font-mono" />
          </div>
        </div>
      </Example>

      <Example
        title="Disabled"
        layout="stack"
        description="A label dims with its control when the control comes first and carries the peer class, as checkboxes and switches do, or inside a Field with data-disabled."
      >
        <div className="grid w-full max-w-96 gap-5">
          <div className="flex items-center gap-2">
            <Checkbox id="label-disabled-check" disabled />
            <Label htmlFor="label-disabled-check" className="font-medium">
              Use the legacy build image
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="label-disabled-switch" disabled defaultChecked />
            <Label htmlFor="label-disabled-switch" className="font-medium">
              Protect preview deployments
            </Label>
          </div>
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
