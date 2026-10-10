"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

const switchSizes = {
  sm: `${tokenPx("--switch-width-sm")} × ${tokenPx("--switch-height-sm")}px`,
  default: `${tokenPx("--switch-width")} × ${tokenPx("--switch-height")}px`,
}

const automationRules = [
  {
    id: "notify-owner",
    label: "Notify the owner when a task is done",
    description: "When a task moves to Done, the project owner gets a message.",
    on: true,
  },
  {
    id: "assign-bugs",
    label: "Assign new bugs to Jordan",
    description: "When a task is tagged Bug, assign it to Jordan Lee with High priority.",
    on: true,
  },
  {
    id: "overdue",
    label: "Flag overdue tasks",
    description: "When a due date passes, raise the priority to Urgent and comment on the task.",
    on: false,
  },
  {
    id: "slack",
    label: "Post finished tasks to Slack",
    description: "Share each completed task in #website-relaunch.",
    on: true,
  },
]

function AutomationSettings() {
  const [state, setState] = React.useState<Record<string, boolean>>(
    Object.fromEntries(automationRules.map((s) => [s.id, s.on]))
  )
  const [lastChange, setLastChange] = React.useState<string | null>(null)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Automations</CardTitle>
        <CardDescription className="text-pretty">
          Rules run as soon as they are on, for every task in{" "}
          <span className="whitespace-nowrap">Website relaunch</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="-my-5 divide-y">
        {automationRules.map((s) => (
          <Field key={s.id} orientation="horizontal" className="py-5">
            <FieldContent>
              <FieldLabel htmlFor={`sw-${s.id}`}>{s.label}</FieldLabel>
              <FieldDescription id={`sw-${s.id}-desc`}>{s.description}</FieldDescription>
            </FieldContent>
            <Switch
              id={`sw-${s.id}`}
              aria-describedby={`sw-${s.id}-desc`}
              checked={state[s.id]}
              onCheckedChange={(checked) => {
                setState((current) => ({ ...current, [s.id]: checked }))
                setLastChange(`${s.label}: ${checked ? "on" : "off"}.`)
              }}
            />
          </Field>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {lastChange ? `Saved. ${lastChange}` : "All changes save automatically. Your workspace has used 7,240 of 10,000 runs this month."}
        </p>
      </CardFooter>
    </Card>
  )
}

const panelSettings = [
  { id: "sw-panel-public", label: "Public link", description: "Anyone with the link can view this dashboard.", on: true },
  { id: "sw-panel-names", label: "Show member names", description: "Viewers see who owns each task.", on: false },
]

export default function SwitchDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Sized by --switch-width and --switch-height. The label comes first and the switch trails it; the track is ink when on and the thumb slides and stretches while pressed."
        code={`<Field orientation="horizontal" className="justify-between">
  <FieldLabel htmlFor="daily-summary">Daily summary</FieldLabel>
  <Switch id="daily-summary" defaultChecked />
</Field>`}
      >
        <Field orientation="horizontal" className="max-w-sm justify-between">
          <FieldLabel htmlFor="sw-default">Daily summary</FieldLabel>
          <Switch id="sw-default" defaultChecked />
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="Small fits dense rows, such as table cells and toolbars. Default suits settings lists and forms."
        code={`<Field orientation="horizontal" className="justify-between">
  <FieldLabel htmlFor="small">Small</FieldLabel>
  <Switch id="small" size="sm" defaultChecked />
</Field>
<Field orientation="horizontal" className="justify-between">
  <FieldLabel htmlFor="default">Default</FieldLabel>
  <Switch id="default" defaultChecked />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-5">
          <Field orientation="horizontal" className="justify-between">
            <FieldLabel htmlFor="sw-small">
              Small <span className="font-normal text-muted-foreground">{switchSizes.sm}</span>
            </FieldLabel>
            <Switch id="sw-small" size="sm" defaultChecked />
          </Field>
          <Field orientation="horizontal" className="justify-between">
            <FieldLabel htmlFor="sw-medium">
              Default <span className="font-normal text-muted-foreground">{switchSizes.default}</span>
            </FieldLabel>
            <Switch id="sw-medium" defaultChecked />
          </Field>
        </div>
      </Example>

      <Example
        title="States"
        description="Off, on and both disabled. Disabled switches keep their position so people can still read the setting."
        code={`<Switch aria-label="Off" />
<Switch aria-label="On" defaultChecked />
<Switch aria-label="Disabled" disabled />
<Switch aria-label="Disabled on" disabled defaultChecked />`}
      >
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 @lg:grid-cols-4">
          {[
            { label: "Off", props: {} },
            { label: "On", props: { defaultChecked: true } },
            { label: "Disabled", props: { disabled: true } },
            { label: "Disabled on", props: { disabled: true, defaultChecked: true } },
          ].map(({ label, props }) => (
            <div key={label} className="grid justify-items-center gap-2.5">
              <Switch aria-label={label} {...props} />
              <span className="text-center text-caption text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="With a description"
        layout="stack"
        description="Put the switch after the text, aligned to the label’s first line, so the setting reads before the control."
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="guest-access">Guest access</FieldLabel>
    <FieldDescription>Invite people outside Acme Inc. to comment on the tasks you share.</FieldDescription>
  </FieldContent>
  <Switch id="guest-access" defaultChecked />
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="sw-desc">Guest access</FieldLabel>
              <FieldDescription>Invite people outside Acme Inc. to comment on the tasks you share.</FieldDescription>
            </FieldContent>
            <Switch id="sw-desc" defaultChecked />
          </Field>
        </div>
      </Example>

      <Example
        title="Settings list"
        description="Switches save as they change, so the list needs no save button. Confirm the change in a live region."
        surface="subtle"
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="notify-owner">Notify the owner when a task is done</FieldLabel>
    <FieldDescription id="notify-owner-desc">When a task moves to Done, the project owner gets a message.</FieldDescription>
  </FieldContent>
  <Switch id="notify-owner" aria-describedby="notify-owner-desc" checked={on} onCheckedChange={save} />
</Field>`}
      >
        <AutomationSettings />
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        layout="stack"
        description="On dark panels, use the inverse variant: the track turns light when on and the thumb takes the panel colour, in both themes."
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="public-link" className="text-panel-foreground">Public link</FieldLabel>
    <FieldDescription className="text-panel-muted">Anyone with the link can view this dashboard.</FieldDescription>
  </FieldContent>
  <Switch id="public-link" variant="inverse" defaultChecked />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {panelSettings.map((setting) => (
            <Field key={setting.id} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={setting.id} className="text-panel-foreground">
                  {setting.label}
                </FieldLabel>
                <FieldDescription className="text-panel-muted">{setting.description}</FieldDescription>
              </FieldContent>
              <Switch id={setting.id} variant="inverse" defaultChecked={setting.on} />
            </Field>
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a switch for a setting that takes effect immediately.",
          "Label the setting, not the state: “Guest access”, not “Enable guest access”.",
          "Confirm saved changes nearby, in a live region.",
        ]}
        dont={[
          "Don’t use a switch inside a form that is saved with a button. Use a checkbox.",
          "Don’t add On and Off text next to the track.",
          "Don’t use the default variant on a dark panel. Use inverse so the track keeps its contrast.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state." },
          { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Called when the switch is turned on or off." },
          { prop: "size", type: '"sm" | "default"', default: '"default"', description: "Default uses --switch-width and --switch-height; small uses --switch-width-sm and --switch-height-sm." },
          { prop: "variant", type: '"default" | "inverse"', default: '"default"', description: "Inverse keeps contrast on dark panels: a light track when on and a panel-coloured thumb." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the switch and blocks interaction." },
          { prop: "name / value", type: "string", description: "Submitted with the form when on." },
          { prop: "aria-invalid", type: "boolean", description: "Destructive border around the track." },
        ]}
      />
    </Examples>
  )
}
