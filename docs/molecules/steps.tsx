"use client"

import { RocketIcon, ServerIcon, TerminalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Steps } from "@/components/blocks/steps"

export default function StepsDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Four steps on one strip, joined by hairlines. Four columns on wide layouts, two in narrow slots, one on phones."
        code={`<Steps />`}
      >
        <Steps />
      </Example>

      <Example
        title="On a tinted band"
        layout="full"
        surface="subtle"
        description="Steps stay on the card surface, so the band can sit between two white sections."
        code={`<section className="bg-subtle">
  <Steps />
</section>`}
      >
        <Steps />
      </Example>

      <Example
        title="Dark panel"
        layout="full"
        description="The whole section on a panel for emphasis. Use it once per page at most, and not next to another dark panel."
        code={`<Steps tone="panel" />`}
      >
        <Steps tone="panel" />
      </Example>

      <Example
        title="Three steps"
        layout="full"
        description="Columns follow the number of steps, up to four. Write titles as single verbs."
        code={`<Steps
  title="Bring your own servers."
  description="Lumen runs the same pipeline on hardware you already pay for."
  steps={[
    { title: "Install", description: "Run one command on any Linux server with SSH access.", icon: <TerminalIcon /> },
    { title: "Attach", description: "Add the server to a project. Lumen sets up Docker, TLS and logging.", icon: <ServerIcon /> },
    { title: "Deploy", description: "Push as usual. Builds run on your servers and Lumen routes traffic to them.", icon: <RocketIcon /> },
  ]}
/>`}
      >
        <Steps
          title="Bring your own servers."
          description="Lumen runs the same pipeline on hardware you already pay for."
          steps={[
            { title: "Install", description: "Run one command on any Linux server with SSH access.", icon: <TerminalIcon /> },
            { title: "Attach", description: "Add the server to a project. Lumen sets up Docker, TLS and logging.", icon: <ServerIcon /> },
            { title: "Deploy", description: "Push as usual. Builds run on your servers and Lumen routes traffic to them.", icon: <RocketIcon /> },
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Use three or four steps, each a single verb and one sentence.",
          "Pick icons that show the action, not the step’s position.",
          "Keep the order meaningful: the strip reads left to right as a sequence.",
        ]}
        dont={[
          "Don’t number the steps or add “Step 1 of 4” labels.",
          "Don’t use more than four steps; link to a guide instead.",
          "Don’t colour the icons in brand violet; the heading carries the emphasis.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode | null", default: '"From repo to production in four moves."', description: "Section heading. Pass null to render the steps alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "steps", type: "{ title: string; description: string; icon: ReactNode }[]", default: "Connect, Configure, Deploy, Grow", description: "The steps, in order. Up to four per row." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Render the section on a dark panel." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
