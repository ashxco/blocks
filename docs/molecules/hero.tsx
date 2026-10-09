"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Hero, HeroProductMoment } from "@/components/blocks/hero"

export default function HeroDocs() {
  return (
    <Examples>
      <Example
        title="Split"
        layout="full"
        description="The default. Copy on the left with one word in brand violet, a product moment on the right. Stacks when the section is narrow."
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
        description="Change the headline, actions and command for a product or campaign page. Highlight one word, never more."
        code={`<Hero
  title={<>Preview every branch. Merge with <span className="text-brand">confidence</span>.</>}
  description="Every pull request gets its own URL with production-like data, so reviewers see the change before it ships."
  primaryAction={{ label: "Start free trial", href: "/live/sign-up" }}
  secondaryAction={{ label: "See all features", href: "/live/features" }}
  command="lumen preview --branch feat/billing"
/>`}
      >
        <Hero
          title={
            <>
              Preview every branch. Merge with <span className="text-brand">confidence</span>.
            </>
          }
          description="Every pull request gets its own URL with production-like data, so reviewers see the change before it ships."
          primaryAction={{ label: "Start free trial", href: "/live/sign-up" }}
          secondaryAction={{ label: "See all features", href: "/live/features" }}
          command="lumen preview --branch feat/billing"
        />
      </Example>

      <Example
        title="Copy only"
        layout="full"
        surface="subtle"
        description="Without a visual or command, for inner marketing pages such as About or Pricing."
        code={`<Hero
  variant="centered"
  visual={null}
  command={null}
  title={<>Pricing that grows with <span className="text-brand">you</span>.</>}
  description="Plans from $5 a month, with a 14-day Pro trial. Pay for traffic, never per seat."
  secondaryAction={null}
/>`}
      >
        <Hero
          variant="centered"
          visual={null}
          command={null}
          title={
            <>
              Pricing that grows with <span className="text-brand">you</span>.
            </>
          }
          description="Plans from $5 a month, with a 14-day Pro trial. Pay for traffic, never per seat."
          secondaryAction={null}
        />
      </Example>

      <Example
        title="Product moment"
        layout="stack"
        description="The visual on its own: deployments, requests and a dark deploy confirmation. It lays itself out from its own width, from one column to three."
        code={`<HeroProductMoment />
<HeroProductMoment stage={false} />`}
      >
        <HeroProductMoment />
        <div className="max-w-prose">
          <HeroProductMoment stage={false} />
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
          "Don’t highlight more than one word, or a whole line, in violet.",
          "Don’t add glows, gradients or shadows behind the product moment.",
          "Don’t use the hero below the top of the page; use a section heading instead.",
        ]}
      />

      <ApiTable
        title="Hero"
        rows={[
          { prop: "variant", type: '"split" | "centered"', default: '"split"', description: "Copy beside the visual, or centred above it." },
          { prop: "title", type: "ReactNode", default: '"Ship anything. Own everything."', description: "Display headline. Wrap one word in <span className=\"text-brand\">." },
          { prop: "description", type: "ReactNode", description: "Lead paragraph under the headline." },
          { prop: "primaryAction", type: "{ label: string; href: string } | null", default: '"Start free trial" → /live/sign-up', description: "Ink button with an arrow. Pass null to hide it." },
          { prop: "secondaryAction", type: "{ label: string; href: string } | null", default: '"Book a demo" → /live/contact', description: "Outline button. Pass null to hide it." },
          { prop: "command", type: "string | null", default: '"npm i -g lumen"', description: "Install command with a copy button. Pass null to hide it." },
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
          { prop: "className", type: "string", description: "Classes for the stage." },
        ]}
      />
    </Examples>
  )
}
