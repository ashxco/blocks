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
        description="Releases newest first on one rail. The latest release gets a brand dot. When the slot is wide, date and version move to the left of the rail."
        code={`<ChangelogTimeline />`}
      >
        <ChangelogTimeline />
      </Example>

      <Example
        title="Single entry"
        layout="full"
        description="An entry on its own, with the built-in preview environment card in a tint. Pass media={true} for that card, or your own image or component."
        code={`<ChangelogEntry />`}
      >
        <div className="p-6 @2xl:p-10">
          <ChangelogEntry latest />
        </div>
      </Example>

      <Example
        title="Custom media and a link"
        layout="full"
        surface="subtle"
        description="Any component can fill the media slot, such as a terminal for a CLI release. Children render under the list. Wrap commands, flags and file names in ChangelogCode."
        code={`<ChangelogEntry
  date="Mar 4, 2026"
  dateTime="2026-03-04"
  version="v2.0.0"
  title="A CLI that starts in 50 ms"
  description="…"
  mediaTint="mint"
  media={<CodeWindow lines={[…]} />}
  items={[<><ChangelogCode>lumen open</ChangelogCode> jumps to the project dashboard</>, …]}
>
  <Button variant="link" nativeButton={false} render={<Link href="/live/blog/post" />}>
    Read the release notes
  </Button>
</ChangelogEntry>`}
      >
        <div className="p-6 @2xl:p-10">
          <ChangelogEntry
            date="Mar 4, 2026"
            dateTime="2026-03-04"
            version="v2.0.0"
            title="A CLI that starts in 50 ms"
            description="A rewrite of the CLI in Go. It starts in under 50 ms, streams build logs as they happen and works offline for everything that doesn’t need the API."
            mediaTint="mint"
            media={
              <div className="p-6 @2xl:p-10">
                <CodeWindow
                  wrap
                  title="~/acme"
                  lines={[
                    "$ lumen deploy --prod",
                    "→ Uploading 214 files (1.8 MB)",
                    "→ Building with 3 cached layers",
                    "✓ Live at acme.lumen.app in 19s",
                  ]}
                />
              </div>
            }
            items={[
              <>
                <ChangelogCode>lumen open</ChangelogCode> jumps to the project dashboard
              </>,
              "Shell completions for zsh, bash and fish",
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
          "Don’t write version numbers in the title; they already sit by the date.",
        ]}
      />

      <ApiTable
        title="ChangelogEntry"
        rows={[
          { prop: "date", type: "string", default: '"Oct 6, 2026"', description: "Display date." },
          { prop: "dateTime", type: "string", description: "Machine-readable date for the time element." },
          { prop: "version", type: "string", default: '"v2.12.0"', description: "Release version, shown in mono." },
          { prop: "title", type: "ReactNode", description: "What shipped, in the text-h3 role." },
          { prop: "description", type: "ReactNode", description: "One or two sentences on why it matters." },
          { prop: "media", type: "ReactNode | true", description: "Screenshot slot in a tinted frame. true draws the built-in preview environment card (ReleaseShot)." },
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
          { prop: "children", type: "ReactNode", description: "A command, flag, config key or file name inside release notes, set in mono on a muted chip." },
          { prop: "className", type: "string", description: "Classes for the code element." },
        ]}
      />

      <ApiTable
        title="ChangelogTimeline"
        rows={[
          { prop: "entries", type: "ChangelogEntryProps[]", default: "Four Lumen releases", description: "Releases newest first. The first is marked latest." },
          { prop: "children", type: "ReactNode", description: "Your own ChangelogEntry elements, instead of entries." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
