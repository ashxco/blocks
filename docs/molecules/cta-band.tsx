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
  title="Bring your app over."
  description="Import from Heroku, Render or Fly with one command. Your environment variables and domains come with you."
  primaryAction={{ label: "Start migrating", href: "/live/sign-up" }}
  secondaryAction={{ label: "Read the guide", href: "/live/blog/post" }}
  installLabel="Import an existing app"
  command="lumen import"
  points={["Keeps your environment variables", "Zero-downtime DNS switch"]}
/>`}
      >
        <CtaBand
          title="Bring your app over."
          description="Import from Heroku, Render or Fly with one command. Your environment variables and domains come with you."
          primaryAction={{ label: "Start migrating", href: "/live/sign-up" }}
          secondaryAction={{ label: "Read the guide", href: "/live/blog/post" }}
          installLabel="Import an existing app"
          command="lumen import"
          points={["Keeps your environment variables", "Zero-downtime DNS switch"]}
        />
      </Example>

      <Example
        title="Your own box"
        layout="full"
        description="Pass aside to replace the install box with content that fits the page, such as open roles on a careers band. Set command to null instead to keep the box with only its title and checks."
        code={`<CtaBand
  title="We’re hiring."
  primaryAction={{ label: "See all six roles", href: "/careers" }}
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
          description="Six open roles in engineering, design and support, anywhere between UTC−7 and UTC+9."
          primaryAction={{ label: "See all six roles", href: "/live/about#careers" }}
          secondaryAction={{ label: "Ask us a question", href: "/live/contact" }}
          aside={
            <>
              <p className="text-label text-panel-foreground">Open now</p>
              <ul className="-my-1 grid divide-y divide-panel-border">
                {[
                  { title: "Senior platform engineer", detail: "Engineering · UTC−5 to UTC+3" },
                  { title: "Product designer", detail: "Design · UTC−3 to UTC+3" },
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
        description="Pass aside={null} to drop the box. The pitch spans the panel and the actions move to its right edge. Use it where the page above already showed the product, so closing bands differ from page to page."
        code={`<CtaBand aside={null} title="See it on your own code." />`}
      >
        <CtaBand
          aside={null}
          title="See it on your own code."
          description="Connect a repository and get a preview URL in about a minute. Pro is free for 14 days."
        />
      </Example>

      <Example
        title="In a narrow column"
        layout="full"
        description="With contained set to false, the panel drops its own container and padding and stacks when the slot is narrow, such as beside a blog post."
        code={`<CtaBand
  contained={false}
  secondaryAction={null}
  title="Try Lumen on your next side project."
  description="Hobby starts at $5 a month, with preview URLs and logs included."
  primaryAction={{ label: "Choose Hobby", href: "/live/pricing" }}
  installLabel="What Hobby includes"
  command={null}
  points={["3 projects", "Preview URL for every push", "100 GB bandwidth"]}
/>`}
      >
        <div className="max-w-prose p-6 @2xl:p-10">
          <CtaBand
            contained={false}
            secondaryAction={null}
            title="Try Lumen on your next side project."
            description="Hobby starts at $5 a month, with preview URLs and logs included."
            primaryAction={{ label: "Choose Hobby", href: "/live/pricing" }}
            installLabel="What Hobby includes"
            command={null}
            points={["3 projects", "Preview URL for every push", "100 GB bandwidth"]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use one call to action band per page, near the end.",
          "Keep the title to one line on desktop; say what people get.",
          "Use the inverse button for the main action on the panel.",
          "Vary the box from page to page: the install command, your own content, or none.",
        ]}
        dont={[
          "Don’t stack two dark panels on top of each other.",
          "Don’t add a third button; move it to the page instead.",
          "Don’t add glows, gradients, rings or images behind the panel.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Ship on Lumen today."', description: "The pitch. Keep it to one line on desktop." },
          { prop: "description", type: "ReactNode", description: "One or two sentences under the title." },
          { prop: "primaryAction", type: "{ label: string; href: string }", default: '"Start free trial" → /live/sign-up', description: "Inverse button. Use the same label as the header and hero for the same destination." },
          { prop: "secondaryAction", type: "{ label: string; href: string } | null", default: '"Talk to sales" → /live/contact', description: "Outline button. Pass null to hide it." },
          { prop: "installLabel", type: "string", default: '"Or start from your terminal"', description: "Title of the box, above the command." },
          { prop: "command", type: "string | null", default: '"npm i -g lumen"', description: "Command in the box. Pass null for a box with the title and checks only." },
          { prop: "points", type: "string[]", default: "3 reassurances", description: "Short checks in the box. Pass [] to hide." },
          { prop: "aside", type: "ReactNode | null", description: "Your own content for the box. null drops the box for a compact band with the actions on the right." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding. Set to false inside your own layout." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
