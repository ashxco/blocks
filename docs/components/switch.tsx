"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

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
    <section aria-labelledby="sw-git-title" className="w-full max-w-144 rounded-(--card-radius) border bg-card">
      <div className="grid gap-1 p-(--card-padding) pb-2">
        <h3 id="sw-git-title" className="text-h4">
          Git
        </h3>
        <p className="text-body text-copy">Changes apply immediately to acme-web.</p>
      </div>
      <div className="divide-y px-(--card-padding)">
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
      </div>
      <p className="border-t px-(--card-padding) py-3.5 text-caption text-muted-foreground" aria-live="polite">
        {lastChange ? `Saved. ${lastChange}` : "All changes save automatically."}
      </p>
    </section>
  )
}

export default function SwitchDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Sized by --switch-width and --switch-height. The track is ink when on; the thumb slides and stretches while pressed."
        code={`<div className="flex items-center gap-3">
  <Switch id="deploy-on-push" defaultChecked />
  <Label htmlFor="deploy-on-push">Deploy on push</Label>
</div>`}
      >
        <div className="flex items-center gap-3">
          <Switch id="sw-default" defaultChecked />
          <Label htmlFor="sw-default" className="font-medium">
            Deploy on push
          </Label>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Small fits dense rows, such as table cells and toolbars."
        code={`<Switch size="sm" />
<Switch />`}
      >
        <div className="flex items-center gap-3">
          <Switch id="sw-small" size="sm" defaultChecked />
          <Label htmlFor="sw-small" className="font-medium">
            Small
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="sw-medium" defaultChecked />
          <Label htmlFor="sw-medium" className="font-medium">
            Default
          </Label>
        </div>
      </Example>

      <Example
        title="States"
        description="Off, on and both disabled. Disabled switches keep their position so people can still read the setting."
        code={`<Switch />
<Switch defaultChecked />
<Switch disabled />
<Switch disabled defaultChecked />`}
      >
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-4">
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
    <FieldDescription>Pull requests get their own URL.</FieldDescription>
  </FieldContent>
  <Switch id="previews" defaultChecked />
</Field>`}
      >
        <div className="w-full max-w-112">
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

      <Guidelines
        do={[
          "Use a switch for a setting that takes effect immediately.",
          "Label the setting, not the state: “Preview deployments”, not “Enable preview deployments”.",
          "Confirm saved changes nearby, in a live region.",
        ]}
        dont={[
          "Don’t use a switch inside a form that is saved with a button. Use a checkbox.",
          "Don’t add On and Off text next to the track.",
          "Don’t put a switch on a dark panel; the ink track disappears there.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state." },
          { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Called when the switch is turned on or off." },
          { prop: "size", type: '"sm" | "default"', default: '"default"', description: "Default uses --switch-width and --switch-height; small is 32 × 20px." },
          { prop: "disabled", type: "boolean", default: "false", description: "Dims the switch and blocks interaction." },
          { prop: "name / value", type: "string", description: "Submitted with the form when on." },
          { prop: "aria-invalid", type: "boolean", description: "Destructive border around the track." },
        ]}
      />
    </Examples>
  )
}
