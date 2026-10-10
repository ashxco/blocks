"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { DangerZone } from "@/components/blocks/danger-zone"

export default function DangerZoneDocs() {
  return (
    <Examples>
      <Example
        title="Project danger zone"
        description="Every action asks for confirmation. Deleting the project unlocks only after its name is typed exactly."
        layout="full"
        code={`<DangerZone projectName="Website relaunch" />`}
      >
        <div className="p-(--card-padding) @prose:p-10">
          <DangerZone />
        </div>
      </Example>

      <Example
        title="Custom actions"
        description="Pass your own actions, most disruptive last. Reversible actions use the default tone, which renders a neutral button."
        layout="full"
        surface="subtle"
        code={`<DangerZone
  projectName="acme"
  description="Deleting the workspace removes every project in it."
  actions={[
    {
      id: "downgrade",
      title: "Downgrade to Free",
      description: "Move Acme Inc. to Free, $0, at the end of the billing period.",
      actionLabel: "Downgrade",
      confirmTitle: "Downgrade Acme Inc. to Free?",
      confirmDescription: "Pro stays active until November 1, 2026. …",
      tone: "default",
    },
    {
      id: "delete-workspace",
      title: "Delete workspace",
      description: "Delete Acme Inc. with its 26 projects, docs and billing history.",
      actionLabel: "Delete workspace",
      confirmTitle: "Delete Acme Inc.?",
      confirmDescription: "Every project, task and doc in this workspace goes with it. You can’t undo this.",
      requireTyping: true,
      successMessage: "Acme Inc. was deleted.",
    },
  ]}
/>`}
      >
        <div className="p-(--card-padding) @prose:p-10">
          <DangerZone
            projectName="acme"
            description="Deleting the workspace removes every project in it."
            actions={[
              {
                id: "downgrade",
                title: "Downgrade to Free",
                description: "Move Acme Inc. to Free, $0, at the end of the billing period.",
                actionLabel: "Downgrade",
                confirmTitle: "Downgrade Acme Inc. to Free?",
                confirmDescription:
                  "Pro stays active until November 1, 2026. After that, Free allows 3 members and 5 projects, so everyone else loses access and the other projects become read-only.",
                confirmLabel: "Downgrade to Free",
                tone: "default",
                successMessage: "Free starts on November 1. Pro stays active until then.",
              },
              {
                id: "delete-workspace",
                title: "Delete workspace",
                description: "Delete Acme Inc. with its 26 projects, docs and billing history.",
                actionLabel: "Delete workspace",
                confirmTitle: "Delete Acme Inc.?",
                confirmDescription:
                  "Every project, task and doc in this workspace goes with it. You can’t undo this.",
                requireTyping: true,
                successMessage: "Acme Inc. was deleted.",
              },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Place the danger zone last on the settings page, after everything people change often.",
          "Say exactly what goes away, and whether it can be undone.",
          "Require typing the name for anything that deletes data.",
          "Keep the heading in full ink. Red marks the edge, the icon and the actions that delete something; reversible actions stay neutral.",
        ]}
        dont={[
          "Don’t fill every button red. Reversible actions use the outline style.",
          "Don’t disable the confirm button without saying what unlocks it.",
          "Don’t hide the danger zone behind a menu. People need to find it when they mean to.",
        ]}
      />

      <ApiTable
        title="DangerZone"
        rows={[
          { prop: "projectName", type: "string", default: '"Website relaunch"', description: "Name people type to confirm. Also used in the default copy." },
          { prop: "title", type: "ReactNode | null", default: '"Danger zone"', description: "Heading inside the card. null leaves the header out, for layouts that title the zone themselves." },
          { prop: "description", type: "ReactNode", description: "Line under the heading." },
          { prop: "actions", type: "DangerAction[]", default: "Archive, remove guests, delete project", description: "Rows, most disruptive last." },
          { prop: "onConfirm", type: "(actionId) => void | Promise<void>", description: "Called after confirmation. Throw to keep the dialog open with an error toast." },
          { prop: "as", type: '"h2" | "h3"', default: '"h2"', description: "Heading level." },
          { prop: "className", type: "string", description: "Classes for the card." },
        ]}
      />

      <ApiTable
        title="DangerAction"
        rows={[
          { prop: "id", type: "string", description: "Stable key, passed to onConfirm." },
          { prop: "title", type: "string", description: "Row title." },
          { prop: "description", type: "string", description: "What happens, in one or two sentences." },
          { prop: "actionLabel", type: "string", description: "Button that opens the confirmation." },
          { prop: "confirmTitle", type: "string", description: "Confirmation dialog title, as a question." },
          { prop: "confirmDescription", type: "string", description: "The consequences, plainly." },
          { prop: "confirmLabel", type: "string", default: "actionLabel", description: "Label of the confirming button." },
          { prop: "requireTyping", type: "boolean", default: "false", description: "Unlock only after the project name is typed." },
          { prop: "tone", type: '"destructive" | "default"', default: '"destructive"', description: "Default renders a neutral outline button and confirm." },
          { prop: "successMessage", type: "string", description: "Toast shown when the action completes." },
        ]}
      />
    </Examples>
  )
}
