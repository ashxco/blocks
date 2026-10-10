"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Hero, HeroProductMoment } from "@/components/blocks/hero"
import { CodeWindow } from "@/components/blocks/code-window"

export default function HeroDocs() {
  return (
    <Examples>
      <Example
        title="Split"
        layout="full"
        description="The default. Copy on the left with one word in the accent, a product moment on the right. Stacks when the section is narrow."
        code={`<Hero />`}
      >
        <Hero />
      </Example>

      <Example
        title="Centered"
        layout="full"
        description="Copy centred above a full-width product moment. Use it when the visual needs the whole width."
        code={`<Hero variant="centered" />`}
      >
        <Hero variant="centered" />
      </Example>

      <Example
        title="Custom copy"
        layout="full"
        description="Change the headline, actions, command and visual for a product or campaign page. Highlight one word, never more. The command line suits developer pages, such as the API."
        code={`<Hero
  title={<>Build on the Acme <span className="text-brand">API</span>.</>}
  description="Create tasks from your own tools, keep projects in sync and react to changes with webhooks."
  primaryAction={{ label: "Read the API reference", href: "#" }}
  secondaryAction={{ label: "See integrations", href: "/live/features" }}
  command="npm install @acme/sdk"
  visual={<CodeWindow />}
/>`}
      >
        <Hero
          title={
            <>
              Build on the Acme <span className="text-brand">API</span>.
            </>
          }
          description="Create tasks from your own tools, keep projects in sync and react to changes with webhooks."
          primaryAction={{ label: "Read the API reference", href: "#" }}
          secondaryAction={{ label: "See integrations", href: "/live/features" }}
          command="npm install @acme/sdk"
          visual={<CodeWindow />}
        />
      </Example>

      <Example
        title="Copy only"
        layout="full"
        surface="subtle"
        description="Without a visual, for inner marketing pages such as About or Pricing."
        code={`<Hero
  variant="centered"
  visual={null}
  title={<>Pricing that grows with your <span className="text-brand">team</span>.</>}
  description="Free for up to 3 members. Pro is $12 per member a month, billed annually, with a 14-day trial."
  secondaryAction={null}
/>`}
      >
        <Hero
          variant="centered"
          visual={null}
          title={
            <>
              Pricing that grows with your <span className="text-brand">team</span>.
            </>
          }
          description="Free for up to 3 members. Pro is $12 per member a month, billed annually, with a 14-day trial."
          secondaryAction={null}
        />
      </Example>

      <Example
        title="Product moment"
        layout="stack"
        description="The visual on its own: projects with their status, tasks completed each week and a dark card for an automation that just ran. It lays itself out from its own width, from three columns down to one. Pass stage={false} to drop the tinted stage."
        code={`<HeroProductMoment />
<HeroProductMoment stage={false} />`}
      >
        <div className="@container">
          <div className="grid items-start gap-8 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <figure className="m-0 grid gap-3">
              <HeroProductMoment />
              <figcaption className="text-caption text-muted-foreground">With the stage, full width</figcaption>
            </figure>
            <figure className="m-0 grid gap-3">
              <HeroProductMoment stage={false} />
              <figcaption className="text-caption text-muted-foreground">stage={"{false}"}, in a narrow column</figcaption>
            </figure>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use one hero per page, as the page’s h1.",
          "Keep the headline to two short lines and highlight one word with text-brand.",
          "End statements with a period, outside the highlighted word.",
          "Pair one primary action with one outline action.",
          "Show the product with real components, not a screenshot of a mockup.",
        ]}
        dont={[
          "Don’t put a badge, label or announcement pill above the headline.",
          "Don’t highlight more than one word, or a whole line, in the accent.",
          "Don’t add glows, gradients or shadows behind the product moment.",
          "Don’t use the hero below the top of the page; use a section heading instead.",
        ]}
      />

      <ApiTable
        title="Hero"
        rows={[
          { prop: "variant", type: '"split" | "centered"', default: '"split"', description: "Copy beside the visual, or centred above it." },
          { prop: "title", type: "ReactNode", default: '"Plan it. Track it. Ship it together."', description: "Display headline. Wrap one word in <span className=\"text-brand\">." },
          { prop: "description", type: "ReactNode", description: "Lead paragraph under the headline." },
          { prop: "primaryAction", type: "{ label: string; href: string } | null", default: '"Start free trial" → /live/sign-up', description: "Ink button with an arrow. Pass null to hide it." },
          { prop: "secondaryAction", type: "{ label: string; href: string } | null", default: '"Book a demo" → /live/contact', description: "Outline button. Pass null to hide it." },
          { prop: "command", type: "string | null", default: "null", description: "A one-line command with a copy button, such as an SDK install on a developer page." },
          { prop: "visual", type: "ReactNode | null", default: "<HeroProductMoment />", description: "Replaces the product moment. Pass null for a copy-only hero." },
          { prop: "as", type: '"h1" | "h2"', default: '"h1"', description: "Heading level of the headline." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing. Set to false inside your own layout." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="HeroProductMoment"
        rows={[
          { prop: "stage", type: "boolean", default: "true", description: "Tinted, bordered stage behind the cards." },
          { prop: "className", type: "string", description: "Classes for the root, which is also the container its layout reads." },
        ]}
      />
    </Examples>
  )
}
