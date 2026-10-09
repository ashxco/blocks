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

const gitSettings = [
  {
    id: "push",
    label: "Deploy on push",
    description: "Every push to main builds and promotes to production.",
    on: true,
  },
  {
    id: "previews",
    label: "Preview deployments",
    description: "Pull requests get their own URL, updated on every commit.",
    on: true,
  },
  {
    id: "comments",
    label: "Comment on pull requests",
    description: "Post the preview link and build status as a comment.",
    on: false,
  },
  {
    id: "cancel",
    label: "Cancel superseded builds",
    description: "Stop a queued build when a newer commit lands on the same branch.",
    on: true,
  },
]

function GitSettings() {
  const [state, setState] = React.useState<Record<string, boolean>>(
    Object.fromEntries(gitSettings.map((s) => [s.id, s.on]))
  )
  const [lastChange, setLastChange] = React.useState<string | null>(null)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Git</CardTitle>
        <CardDescription className="text-pretty">
          Changes apply immediately to <span className="whitespace-nowrap">acme-web</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="-my-5 divide-y">
        {gitSettings.map((s) => (
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
                setLastChange(`${s.label} ${checked ? "on" : "off"}.`)
              }}
            />
          </Field>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {lastChange ? `Saved. ${lastChange}` : "All changes save automatically."}
        </p>
      </CardFooter>
    </Card>
  )
}

const panelSettings = [
  { id: "sw-panel-protect", label: "Password protection", description: "Visitors enter a shared password first.", on: true },
  { id: "sw-panel-index", label: "Search indexing", description: "Let search engines list this preview.", on: false },
]

export default function SwitchDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Sized by --switch-width and --switch-height. The label comes first and the switch trails it; the track is ink when on and the thumb slides and stretches while pressed."
        code={`<Field orientation="horizontal" className="justify-between">
  <FieldLabel htmlFor="deploy-on-push">Deploy on push</FieldLabel>
  <Switch id="deploy-on-push" defaultChecked />
</Field>`}
      >
        <Field orientation="horizontal" className="max-w-sm justify-between">
          <FieldLabel htmlFor="sw-default">Deploy on push</FieldLabel>
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
    <FieldLabel htmlFor="previews">Preview deployments</FieldLabel>
    <FieldDescription>Pull requests get their own URL, updated on every commit.</FieldDescription>
  </FieldContent>
  <Switch id="previews" defaultChecked />
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="sw-desc">Preview deployments</FieldLabel>
              <FieldDescription>Pull requests get their own URL, updated on every commit.</FieldDescription>
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
    <FieldLabel htmlFor="push">Deploy on push</FieldLabel>
    <FieldDescription id="push-desc">Every push to main builds and promotes to production.</FieldDescription>
  </FieldContent>
  <Switch id="push" aria-describedby="push-desc" checked={on} onCheckedChange={save} />
</Field>`}
      >
        <GitSettings />
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        layout="stack"
        description="On dark panels, use the inverse variant: the track turns light when on and the thumb takes the panel colour, in both themes."
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="protect" className="text-panel-foreground">Password protection</FieldLabel>
    <FieldDescription className="text-panel-muted">Visitors enter a shared password first.</FieldDescription>
  </FieldContent>
  <Switch id="protect" variant="inverse" defaultChecked />
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
          "Label the setting, not the state: “Preview deployments”, not “Enable preview deployments”.",
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
