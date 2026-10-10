"use client"

import { CodeIcon, HardDriveIcon, MessageSquareIcon, PenToolIcon, UsersRoundIcon, VideoIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { LogoCloud } from "@/components/blocks/logo-cloud"

export default function LogoCloudDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="A full-bleed band between hairlines. The label sits beside the row on wide screens and above it on narrow ones. Six or more short names spread across the row; long names or a shorter list stay in a grid beside the label."
        code={`<LogoCloud />`}
      >
        <LogoCloud />
      </Example>

      <Example
        title="Centred"
        layout="full"
        surface="subtle"
        description="Stack the label above a centred row, for a quieter break under a centred hero."
        code={`<LogoCloud layout="center" title="Used by 12,000+ teams, including" />`}
      >
        <LogoCloud layout="center" title="Used by 12,000+ teams, including" />
      </Example>

      <Example
        title="On a panel"
        layout="full"
        surface="panel"
        description="Inside dark panels, use the panel tone so the marks stay legible but quiet. Here the row lists the tools Acme connects to, by name only."
        code={`<LogoCloud tone="panel" contained={false} items={[…]} />`}
      >
        <div className="p-8 @2xl:p-12">
          <LogoCloud
            tone="panel"
            contained={false}
            title="Connects to the tools you already use"
            items={[
              { name: "Slack", icon: MessageSquareIcon },
              { name: "Google Drive", icon: HardDriveIcon },
              { name: "GitHub", icon: CodeIcon },
              { name: "Figma", icon: PenToolIcon },
              { name: "Zoom", icon: VideoIcon },
              { name: "HubSpot", icon: UsersRoundIcon },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep every mark the same colour and size so none shouts.",
          "Show six to eight items; more turns into noise. Fewer is fine for partners.",
          "Use names people recognise, with a generic mark rather than their real logo.",
        ]}
        dont={[
          "Don’t use brand colours for the logos.",
          "Don’t link each logo; the row is a signal, not navigation.",
          "Don’t put a heading above it; the short label is enough.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Trusted by 12,000+ teams, including"', description: "Short label for the row." },
          { prop: "items", type: "{ name: string; icon?: LucideIcon }[]", default: "8 Acme customers", description: "Names with optional monochrome marks." },
          { prop: "layout", type: '"split" | "center"', default: '"split"', description: "Label beside the row, or centred above it." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Use panel on dark panels." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container, hairlines and padding. Set to false inside your own layout." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
