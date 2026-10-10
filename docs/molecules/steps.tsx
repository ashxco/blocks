"use client"

import { ClipboardCheckIcon, SendIcon, UserPlusIcon } from "lucide-react"

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
  title="Bring your clients in."
  description="Share the work with people outside your team, without giving them the whole workspace."
  steps={[
    { title: "Invite", description: "Add a client as a guest from any project they work on.", icon: <UserPlusIcon /> },
    { title: "Share", description: "Guests see only the projects you share, and comment where the work happens.", icon: <SendIcon /> },
    { title: "Approve", description: "Clients sign off on tasks themselves, so nobody chases approvals by email.", icon: <ClipboardCheckIcon /> },
  ]}
/>`}
      >
        <Steps
          title="Bring your clients in."
          description="Share the work with people outside your team, without giving them the whole workspace."
          steps={[
            { title: "Invite", description: "Add a client as a guest from any project they work on.", icon: <UserPlusIcon /> },
            { title: "Share", description: "Guests see only the projects you share, and comment where the work happens.", icon: <SendIcon /> },
            { title: "Approve", description: "Clients sign off on tasks themselves, so nobody chases approvals by email.", icon: <ClipboardCheckIcon /> },
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
          "Don’t colour the icons in the accent; the heading carries the emphasis.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode | null", default: '"Up and running in an afternoon."', description: "Section heading. Pass null to render the steps alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "steps", type: "{ title: string; description: string; icon: ReactNode }[]", default: "Start, Invite, Connect, Automate", description: "The steps, in order. Up to four per row." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Render the section on a dark panel." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
