"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Stats } from "@/components/blocks/stats"

export default function StatsDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Four big tabular numbers between hairlines. Two columns on phones and in narrow slots, with the figures a size smaller."
        code={`<Stats />`}
      >
        <Stats />
      </Example>

      <Example
        title="With a heading, on a tinted band"
        layout="full"
        description="Add a heading when the numbers need context, such as an open-source or company section."
        code={`<Stats
  tone="subtle"
  title="Open source, in the open."
  description="Lumen is Apache 2.0. Run it yourself, read every line, send a pull request."
  stats={[
    { value: "12.4k", label: "GitHub stars" },
    { value: "186", label: "Contributors" },
    { value: "94", label: "Releases", detail: "One every two weeks" },
    { value: "2.1k", label: "Self-hosted installs", detail: "Reported by opt-in telemetry" },
  ]}
/>`}
      >
        <Stats
          tone="subtle"
          title="Open source, in the open."
          description="Lumen is Apache 2.0. Run it yourself, read every line, send a pull request."
          stats={[
            { value: "12.4k", label: "GitHub stars" },
            { value: "186", label: "Contributors" },
            { value: "94", label: "Releases", detail: "One every two weeks" },
            { value: "2.1k", label: "Self-hosted installs", detail: "Reported by opt-in telemetry" },
          ]}
        />
      </Example>

      <Example
        title="Dark panel"
        layout="full"
        description="For a single moment of emphasis, such as the results section of a customer story."
        code={`<Stats tone="panel" />`}
      >
        <Stats tone="panel" />
      </Example>

      <Example
        title="In a narrow slot"
        layout="full"
        description="The band lays out from its own width. Beside an article it drops to two columns."
        code={`<Stats contained={false} stats={[...two stats]} />`}
      >
        <div className="max-w-prose p-6 @2xl:p-10">
          <Stats
            contained={false}
            stats={[
              { value: "4×", label: "Faster releases", detail: "Four minutes from merge to live" },
              { value: "−38%", label: "Hosting bill", detail: "After moving twelve services" },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use real, current numbers and say where they come from in the detail line.",
          "Keep values short: “4.2M”, not “4,213,551”.",
          "Use two or four stats so the grid stays even.",
        ]}
        dont={[
          "Don’t colour the numbers; ink and size carry them.",
          "Don’t animate numbers counting up.",
          "Don’t add icons or badges above the values.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "stats", type: "{ value: string; label: string; detail?: string }[]", default: "Four Lumen numbers", description: "The numbers, already formatted." },
          { prop: "title", type: "ReactNode", description: "Optional heading above the band." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "tone", type: '"default" | "subtle" | "panel"', default: '"default"', description: "Between hairlines, on a tinted band or on a dark panel." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
