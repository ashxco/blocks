"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Comparison } from "@/components/blocks/comparison"
import { Wordmark } from "@/components/blocks/wordmark"

export default function ComparisonDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Your product on a dark emphasis panel with green checks, beside the alternative on the canvas with muted crosses. Stacks in narrow slots."
        code={`<Comparison />`}
      >
        <Comparison />
      </Example>

      <Example
        title="Against a spreadsheet"
        layout="full"
        description="Compare with the alternative people actually consider. Keep the same number of rows on both sides so they line up."
        code={`<Comparison
  title="Outgrown the spreadsheet?"
  description="Everything a shared spreadsheet gives your team, without the version history archaeology."
  them={{
    name: "A shared spreadsheet",
    items: ["One tab per project, copied by hand", "Status updated when someone remembers", "Reminders sent in chat", "No idea who changed what"],
  }}
  us={{
    name: <Wordmark href={null} tone="panel" />,
    items: ["Every project in one workspace", "Status comes from the work itself", "Automations send the reminders", "An audit log of every change"],
  }}
/>`}
      >
        <Comparison
          title="Outgrown the spreadsheet?"
          description="Everything a shared spreadsheet gives your team, without the version history archaeology."
          them={{
            name: "A shared spreadsheet",
            items: [
              "One tab per project, copied by hand",
              "Status updated when someone remembers",
              "Reminders sent in chat",
              "No idea who changed what",
            ],
          }}
          us={{
            name: <Wordmark href={null} tone="panel" />,
            items: [
              "Every project in one workspace",
              "Status comes from the work itself",
              "Automations send the reminders",
              "An audit log of every change",
            ],
          }}
        />
      </Example>

      <Guidelines
        do={[
          "Write both columns as plain facts a customer can verify.",
          "Match rows one to one, in the same order.",
          "Name the alternative generically (“Spreadsheets, chat and email”), not a competitor.",
        ]}
        dont={[
          "Don’t mix checks and crosses on the same side.",
          "Don’t add more than six rows; link to a full comparison instead.",
          "Don’t colour the alternative red; muted is enough.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode | null", default: '"Why teams switch to Acme."', description: "Centred section heading. Pass null to render the cards alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text under the heading." },
          { prop: "us", type: "{ name: ReactNode; items: string[] }", default: "The Acme wordmark, five rows", description: "Your side: a dark emphasis panel with green checks. For a wordmark name, use its panel tone." },
          { prop: "them", type: "{ name: ReactNode; items: string[] }", default: '"Spreadsheets, chat and email", five rows', description: "The alternative: canvas-coloured card and muted crosses." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
