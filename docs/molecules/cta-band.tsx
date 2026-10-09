"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { CtaBand } from "@/components/blocks/cta-band"

export default function CtaBandDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="The closing section of a marketing page. Pitch and actions on the left, the CLI install on the right for people who prefer a terminal."
        code={`<CtaBand />`}
      >
        <CtaBand />
      </Example>

      <Example
        title="Custom copy"
        layout="full"
        surface="subtle"
        description="Change the pitch, actions, command and reassurances to fit the page it closes."
        code={`<CtaBand
  title="Move your first app this afternoon."
  description="Import from Heroku, Render or Fly with one command. Your environment variables and domains come with you."
  primaryAction={{ label: "Start migrating", href: "/live/sign-up" }}
  secondaryAction={{ label: "Read the guide", href: "/live/blog/post" }}
  installLabel="Import an existing app"
  command="lumen import heroku my-app"
  points={["Keeps your environment variables", "Zero-downtime DNS switch"]}
/>`}
      >
        <CtaBand
          title="Move your first app this afternoon."
          description="Import from Heroku, Render or Fly with one command. Your environment variables and domains come with you."
          primaryAction={{ label: "Start migrating", href: "/live/sign-up" }}
          secondaryAction={{ label: "Read the guide", href: "/live/blog/post" }}
          installLabel="Import an existing app"
          command="lumen import heroku my-app"
          points={["Keeps your environment variables", "Zero-downtime DNS switch"]}
        />
      </Example>

      <Example
        title="In a narrow column"
        layout="full"
        description="With bare set, the panel drops its own container and padding and stacks when the slot is narrow, such as beside a blog post."
        code={`<CtaBand bare secondaryAction={null} title="Try Lumen on your next side project." />`}
      >
        <div className="max-w-prose p-6 sm:p-10">
          <CtaBand bare secondaryAction={null} title="Try Lumen on your next side project." description="Free for hobby projects, with preview URLs and logs included." />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use one call to action band per page, near the end.",
          "Keep the title to one line on desktop; say what people get.",
          "Use the inverse button for the main action on the panel.",
        ]}
        dont={[
          "Don’t stack two dark panels on top of each other.",
          "Don’t add a third button; move it to the page instead.",
          "Don’t add glows, gradients or images behind the panel.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Ship your next app on Lumen."', description: "The pitch." },
          { prop: "description", type: "ReactNode", description: "One or two sentences under the title." },
          { prop: "primaryAction", type: "{ label: string; href: string }", default: '"Start deploying" → /live/sign-up', description: "Inverse button." },
          { prop: "secondaryAction", type: "{ label: string; href: string } | null", default: '"Talk to sales" → /live/contact', description: "Outline button. Pass null to hide it." },
          { prop: "installLabel", type: "string", default: '"Or start from your terminal"', description: "Label above the command." },
          { prop: "command", type: "string", default: '"npm i -g lumen"', description: "Command in the install box." },
          { prop: "points", type: "string[]", default: "3 reassurances", description: "Short checks under the command. Pass [] to hide." },
          { prop: "bare", type: "boolean", default: "false", description: "Drop the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
