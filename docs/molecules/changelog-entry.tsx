"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ChangelogCode, ChangelogEntry, ChangelogTimeline } from "@/components/blocks/changelog-entry"
import { CodeWindow } from "@/components/blocks/code-window"
import { Button } from "@/components/ui/button"

export default function ChangelogEntryDocs() {
  return (
    <Examples>
      <Example
        title="Timeline"
        layout="full"
        description="Updates newest first on one rail. The latest gets a brand dot. When the slot is wide, the date moves to the left of the rail."
        code={`<ChangelogTimeline />`}
      >
        <ChangelogTimeline />
      </Example>

      <Example
        title="Single entry"
        layout="full"
        description="An entry on its own, with the built-in automation rule card in a tint. Pass media={true} for that card, or your own image or component."
        code={`<ChangelogEntry />`}
      >
        <div className="p-6 @2xl:p-10">
          <ChangelogEntry latest />
        </div>
      </Example>

      <Example
        title="Custom media, a version and a link"
        layout="full"
        surface="subtle"
        description="Any component can fill the media slot, such as a code sample for an SDK release. Set version for releases that have one; product updates leave it out. Children render under the list. Wrap API fields, events and package names in ChangelogCode."
        code={`<ChangelogEntry
  date="Sep 24, 2026"
  dateTime="2026-09-24"
  version="v3.2.0"
  title="Recurring tasks in the SDK"
  description="…"
  mediaTint="mint"
  media={<CodeWindow lines={[…]} />}
  items={[<>New <ChangelogCode>repeat</ChangelogCode> field on <ChangelogCode>tasks.create</ChangelogCode></>, …]}
>
  <Button variant="link" nativeButton={false} render={<Link href="/live/blog/post" />}>
    Read the release notes
  </Button>
</ChangelogEntry>`}
      >
        <div className="p-6 @2xl:p-10">
          <ChangelogEntry
            date="Sep 24, 2026"
            dateTime="2026-09-24"
            version="v3.2.0"
            title="Recurring tasks in the SDK"
            description="Version 3.2 of @acme/sdk can create recurring tasks and read their schedule, so tasks you create from your own tools repeat like the ones made in the app."
            mediaTint="mint"
            media={
              <div className="p-6 @2xl:p-10">
                <CodeWindow
                  title="weekly-report.ts"
                  lines={[
                    "// A report task every Friday, owned by Maya",
                    "await acme.tasks.create({",
                    '  title: "Send the weekly report",',
                    '  projectId: "q4-planning",',
                    '  assignee: "maya@acme.com",',
                    '  repeat: { every: "week", on: "friday" },',
                    "})",
                  ]}
                />
              </div>
            }
            items={[
              <>
                New <ChangelogCode>repeat</ChangelogCode> field on <ChangelogCode>tasks.create</ChangelogCode>
              </>,
              <>
                Webhooks now send <ChangelogCode>task.repeated</ChangelogCode> when the next task appears
              </>,
            ]}
          >
            <Button variant="link" nativeButton={false} render={<Link href="/live/blog/post" />}>
              Read the release notes
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </ChangelogEntry>
        </div>
      </Example>

      <Guidelines
        do={[
          "Lead with what people can now do, not what you built.",
          "Keep the title to one line and the summary to two sentences.",
          "Use the list for smaller improvements and fixes in the same release.",
        ]}
        dont={[
          "Don’t add a screenshot to every entry; save it for releases people will look for.",
          "Don’t mark more than one entry as latest.",
          "Don’t write version numbers in the title; set version and it sits by the date.",
        ]}
      />

      <ApiTable
        title="ChangelogEntry"
        rows={[
          { prop: "date", type: "string", default: '"Oct 1, 2026"', description: "Display date." },
          { prop: "dateTime", type: "string", description: "Machine-readable date for the time element." },
          { prop: "version", type: "string", description: "Release version, shown in mono, such as an SDK release. Leave it out for product updates." },
          { prop: "title", type: "ReactNode", description: "What shipped, in the text-h3 role." },
          { prop: "description", type: "ReactNode", description: "One or two sentences on why it matters." },
          { prop: "media", type: "ReactNode | true", description: "Screenshot slot in a tinted frame. true draws the built-in automation rule card (ReleaseShot)." },
          { prop: "mediaTint", type: '"violet" | "mint" | "sand" | "sky" | "rose"', default: '"violet"', description: "Fill behind the media." },
          { prop: "items", type: "ReactNode[]", description: "Smaller changes as a bullet list." },
          { prop: "latest", type: "boolean", default: "false", description: "Brand dot on the rail for the newest release." },
          { prop: "as", type: '"h2" | "h3"', default: '"h2"', description: "Heading level of the title." },
          { prop: "children", type: "ReactNode", description: "Extra content under the list, such as a link." },
        ]}
      />

      <ApiTable
        title="ChangelogCode"
        rows={[
          { prop: "children", type: "ReactNode", description: "An API field, webhook event, SDK method or package name inside release notes, set in mono on a muted chip." },
          { prop: "className", type: "string", description: "Classes for the code element." },
        ]}
      />

      <ApiTable
        title="ChangelogTimeline"
        rows={[
          { prop: "entries", type: "ChangelogEntryProps[]", default: "Five Acme updates", description: "Updates newest first. The first is marked latest." },
          { prop: "children", type: "ReactNode", description: "Your own ChangelogEntry elements, instead of entries." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
