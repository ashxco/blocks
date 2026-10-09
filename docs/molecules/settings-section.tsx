"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { SettingsSection } from "@/components/blocks/settings-section"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SettingsSectionDocs() {
  return (
    <Examples>
      <Example
        title="Workspace settings"
        description="Title and description on the left say what the controls change. The card holds the controls and one save action."
        layout="full"
        code={`<SettingsSection />`}
      >
        <div className="px-(--card-padding) @prose:px-10">
          <SettingsSection />
        </div>
      </Example>

      <Example
        title="A settings page"
        description="Stack sections with hairlines between them. Sections that save on change, like notifications, drop the footer."
        layout="full"
        code={`<div className="divide-y">
  <SettingsSection
    title="Build and deploy"
    description="…"
    saveLabel="Save build settings"
    successTitle="Build settings saved"
    successDescription="They apply from the next push to main."
  >
    <FieldGroup>…</FieldGroup>
  </SettingsSection>
  <SettingsSection title="Notifications" description="…" hideFooter>
    <FieldGroup>…</FieldGroup>
  </SettingsSection>
</div>`}
      >
        <div className="divide-y px-(--card-padding) @prose:px-10">
          <SettingsSection
            title="Build and deploy"
            description="How Lumen builds web. Changes apply from the next push."
            saveLabel="Save build settings"
            successTitle="Build settings saved"
            successDescription="They apply from the next push to main."
            footerNote="Redeploy to apply these to the current production build."
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="docs-branch">Production branch</FieldLabel>
                <Input id="docs-branch" defaultValue="main" className="font-mono" spellCheck={false} />
                <FieldDescription>Pushes to this branch deploy to production. Other branches get previews.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="docs-build">Build command</FieldLabel>
                <Input id="docs-build" defaultValue="npm run build" className="font-mono" spellCheck={false} />
              </Field>
              <Field>
                <FieldLabel htmlFor="docs-output">Output directory</FieldLabel>
                <Input id="docs-output" defaultValue=".next" className="font-mono" spellCheck={false} />
              </Field>
            </FieldGroup>
          </SettingsSection>

          <SettingsSection
            title="Notifications"
            description="Emails go to maya@acme.dev. Each switch saves as soon as you flip it."
            hideFooter
          >
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="docs-failed">Failed deployments</FieldLabel>
                  <FieldDescription>Email me when a production build fails.</FieldDescription>
                </FieldContent>
                <Switch id="docs-failed" defaultChecked />
              </Field>
              <Field orientation="horizontal" className="border-t pt-5">
                <FieldContent>
                  <FieldLabel htmlFor="docs-comments">Preview comments</FieldLabel>
                  <FieldDescription>Email me when someone comments on a preview I deployed.</FieldDescription>
                </FieldContent>
                <Switch id="docs-comments" defaultChecked />
              </Field>
              <Field orientation="horizontal" className="border-t pt-5">
                <FieldContent>
                  <FieldLabel htmlFor="docs-usage">Weekly usage report</FieldLabel>
                  <FieldDescription>Build minutes, bandwidth and invocations, every Monday.</FieldDescription>
                </FieldContent>
                <Switch id="docs-usage" />
              </Field>
            </FieldGroup>
          </SettingsSection>
        </div>
      </Example>

      <Guidelines
        do={[
          "Say what the settings change and who they affect in the description.",
          "Group five or fewer related controls per section.",
          "Write the save label as the outcome: “Save build settings”, and the success toast as what changed: “Build settings saved”.",
          "Use hideFooter for switches that apply immediately, and confirm with a toast.",
        ]}
        dont={[
          "Don’t put destructive actions in a settings section. Use the danger zone.",
          "Don’t mix save-on-change controls with controls that need a save button in one card.",
          "Don’t grey out or shrink the section title. Titles stay in full ink.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"General"', description: "Section title in the left column." },
          { prop: "description", type: "ReactNode", description: "What the controls change. Shown under the title." },
          { prop: "children", type: "ReactNode", default: "Workspace settings", description: "Controls inside the card, usually a FieldGroup." },
          { prop: "footerNote", type: "ReactNode", description: "Short note on the left of the footer." },
          { prop: "saveLabel", type: "string", default: '"Save changes"', description: "Label of the submit button." },
          { prop: "hideFooter", type: "boolean", default: "false", description: "Remove the footer for controls that save on change." },
          { prop: "onSave", type: "() => void | Promise<void>", description: "Called on submit. Throw to show an error toast. Without it, the section simulates a request." },
          { prop: "successTitle", type: "string", default: '"Changes saved"', description: "Toast title after a save. Say what changed: “Profile saved”." },
          { prop: "successDescription", type: "string", description: "Optional toast line after a save: what happens next." },
          { prop: "as", type: '"h2" | "h3"', default: '"h2"', description: "Heading level of the title." },
          { prop: "className", type: "string", description: "Classes for the section. It has py-10 by default." },
        ]}
      />
    </Examples>
  )
}
