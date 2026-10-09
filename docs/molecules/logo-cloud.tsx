"use client"

import { BoxesIcon, CloudIcon, CpuIcon, ServerIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { LogoCloud } from "@/components/blocks/logo-cloud"

export default function LogoCloudDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="A full-bleed band between hairlines. The label sits beside the row on wide screens and above it on narrow ones. Six or more marks spread edge to edge; a shorter list, such as four investors, stays grouped beside the label."
        code={`<LogoCloud />`}
      >
        <LogoCloud />
      </Example>

      <Example
        title="Centred"
        layout="full"
        surface="subtle"
        description="Stack the label above a centred row, for a quieter break under a centred hero."
        code={`<LogoCloud layout="center" title="Detects your framework and runtime on the first push" />`}
      >
        <LogoCloud layout="center" title="Detects your framework and runtime on the first push" />
      </Example>

      <Example
        title="On a panel"
        layout="full"
        surface="panel"
        description="Inside dark panels, use the panel tone so the marks stay legible but quiet."
        code={`<LogoCloud tone="panel" contained={false} items={[…]} />`}
      >
        <div className="p-8 @2xl:p-12">
          <LogoCloud
            tone="panel"
            contained={false}
            title="Runs anywhere you have a server"
            items={[
              { name: "Your servers", icon: ServerIcon },
              { name: "Lumen Cloud", icon: CloudIcon },
              { name: "Kubernetes", icon: BoxesIcon },
              { name: "Bare metal", icon: CpuIcon },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep every mark the same colour and size so none shouts.",
          "Show six to eight items; more turns into noise. Fewer is fine for investors or partners.",
          "Use real names people recognise.",
        ]}
        dont={[
          "Don’t use brand colours for the logos.",
          "Don’t link each logo; the row is a signal, not navigation.",
          "Don’t put a heading above it; the short label is enough.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Deploys the stack you already use"', description: "Short label for the row." },
          { prop: "items", type: "{ name: string; icon?: LucideIcon }[]", default: "8 runtimes and services", description: "Names with optional monochrome marks." },
          { prop: "layout", type: '"split" | "center"', default: '"split"', description: "Label beside the row, or centred above it." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Use panel on dark panels." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container, hairlines and padding. Set to false inside your own layout." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
