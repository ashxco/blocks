"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { CtaBand } from "@/components/blocks/cta-band"

export default function CtaBandDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="The closing section of a marketing page. Pitch and actions on the left, a box of reassurances on the right."
        code={`<CtaBand />`}
      >
        <CtaBand />
      </Example>

      <Example
        title="Custom copy"
        layout="full"
        surface="subtle"
        description="Change the pitch, actions and reassurances to fit the page it closes. On a developer page, add a command to the box."
        code={`<CtaBand
  title="Connect Acme to your own tools."
  description="Create tasks from any system you run and react to changes with webhooks."
  primaryAction={{ label: "Read the API reference", href: "#" }}
  secondaryAction={{ label: "See integrations", href: "/live/features" }}
  boxTitle="Install the SDK"
  command="npm install @acme/sdk"
  points={["Typed for TypeScript", "Webhooks for every task change"]}
/>`}
      >
        <CtaBand
          title="Connect Acme to your own tools."
          description="Create tasks from any system you run and react to changes with webhooks."
          primaryAction={{ label: "Read the API reference", href: "#" }}
          secondaryAction={{ label: "See integrations", href: "/live/features" }}
          boxTitle="Install the SDK"
          command="npm install @acme/sdk"
          points={["Typed for TypeScript", "Webhooks for every task change"]}
        />
      </Example>

      <Example
        title="Your own box"
        layout="full"
        description="Pass aside to replace the box with content that fits the page, such as open roles on a careers band."
        code={`<CtaBand
  title="We’re hiring."
  primaryAction={{ label: "See all three roles", href: "/careers" }}
  secondaryAction={{ label: "Ask us a question", href: "/contact" }}
  aside={
    <>
      <p className="text-label text-panel-foreground">Open now</p>
      <ul className="grid divide-y divide-panel-border">…</ul>
    </>
  }
/>`}
      >
        <CtaBand
          title="We’re hiring."
          description="Three open roles in engineering, design and customer success, remote or in San Francisco and London."
          primaryAction={{ label: "See all three roles", href: "/live/about#careers" }}
          secondaryAction={{ label: "Ask us a question", href: "/live/contact" }}
          aside={
            <>
              <p className="text-label text-panel-foreground">Open now</p>
              <ul className="-my-1 grid divide-y divide-panel-border">
                {[
                  { title: "Senior product engineer", detail: "Engineering · UTC−8 to UTC+1" },
                  { title: "Product designer", detail: "Design · UTC−5 to UTC+2" },
                ].map((role) => (
                  <li key={role.title} className="grid gap-0.5 py-3.5">
                    <span className="text-title text-panel-foreground">{role.title}</span>
                    <span className="text-caption text-panel-muted">{role.detail}</span>
                  </li>
                ))}
              </ul>
            </>
          }
        />
      </Example>

      <Example
        title="Compact"
        layout="full"
        surface="subtle"
        description="Pass aside={null} to drop the box. The pitch spans the panel and the actions move to its right side. Use it where the page above already showed the product, so closing bands differ from page to page."
        code={`<CtaBand aside={null} title="See it with your own projects." />`}
      >
        <CtaBand
          aside={null}
          title="See it with your own projects."
          description="Import a spreadsheet or start from a template, and invite your team in a few minutes. Pro is free for 14 days."
        />
      </Example>

      <Example
        title="In a narrow column"
        layout="full"
        description="With contained set to false, the panel drops its own container and padding and stacks when the slot is narrow, such as beside a blog post."
        code={`<CtaBand
  contained={false}
  secondaryAction={null}
  title="Plan your next project in Acme."
  description="Free for up to 3 members, with every view, docs and reports."
  primaryAction={{ label: "Start for free", href: "/live/sign-up" }}
  boxTitle="What Free includes"
  points={["5 projects", "1,000 automation runs a month", "2 GB storage"]}
/>`}
      >
        <div className="max-w-prose p-6 @2xl:p-10">
          <CtaBand
            contained={false}
            secondaryAction={null}
            title="Plan your next project in Acme."
            description="Free for up to 3 members, with every view, docs and reports."
            primaryAction={{ label: "Start for free", href: "/live/sign-up" }}
            boxTitle="What Free includes"
            points={["5 projects", "1,000 automation runs a month", "2 GB storage"]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use one call to action band per page, near the end.",
          "Keep the title to one line on desktop; say what people get.",
          "Use the inverse button for the main action on the panel.",
          "Vary the box from page to page: reassurances, your own content, or none.",
        ]}
        dont={[
          "Don’t stack two dark panels on top of each other.",
          "Don’t add a third button; move it to the page instead.",
          "Don’t add glows, gradients, rings or images behind the panel.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Plan your next project in Acme."', description: "The pitch. Keep it to one line on desktop." },
          { prop: "description", type: "ReactNode", description: "One or two sentences under the title." },
          { prop: "primaryAction", type: "{ label: string; href: string }", default: '"Start free trial" → /live/sign-up', description: "Inverse button. Use the same label as the header and hero for the same destination." },
          { prop: "secondaryAction", type: "{ label: string; href: string } | null", default: '"Talk to sales" → /live/contact', description: "Outline button. Pass null to hide it." },
          { prop: "boxTitle", type: "string", default: '"Every trial includes"', description: "Title of the box, above the checks." },
          { prop: "command", type: "string | null", default: "null", description: "A one-line command in the box, such as an SDK install on a developer page." },
          { prop: "points", type: "string[]", default: "3 reassurances", description: "Short checks in the box. Pass [] to hide." },
          { prop: "aside", type: "ReactNode | null", description: "Your own content for the box. null drops the box for a compact band with the actions on the right." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding. Set to false inside your own layout." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
