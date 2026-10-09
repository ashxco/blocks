"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"

export default function SectionHeadingDocs() {
  return (
    <Examples>
      <Example
        title="Split"
        layout="full"
        description="The default. Title on the left, the supporting sentence on the right, sitting on the title’s last line. Stacks in narrow slots."
        code={`<SectionHeading
  title="See every request, from edge to database."
  description="Logs, traces and metrics arrive in one view. No agent to install, and nothing sampled away."
/>`}
      >
        <div className="p-8 @2xl:p-12">
          <SectionHeading
            title="See every request, from edge to database."
            description="Logs, traces and metrics arrive in one view. No agent to install, and nothing sampled away."
          />
        </div>
      </Example>

      <Example
        title="Centred with actions"
        layout="full"
        surface="subtle"
        description="For sections that stand alone, such as pricing or a closing pitch. Actions go in children."
        code={`<SectionHeading
  align="center"
  title="Pay for traffic, not teammates."
  description="Every plan includes unlimited deploys, automatic HTTPS and a preview URL for every branch."
>
  <Button nativeButton={false} render={<Link href="/live/pricing" />}>
    See pricing <ArrowRightIcon data-icon="inline-end" />
  </Button>
  <Button variant="outline" nativeButton={false} render={<Link href="/live/contact" />}>
    Talk to sales
  </Button>
</SectionHeading>`}
      >
        <div className="p-8 @2xl:p-12">
          <SectionHeading
            align="center"
            title="Pay for traffic, not teammates."
            description="Every plan includes unlimited deploys, automatic HTTPS and a preview URL for every branch."
          >
            <Button nativeButton={false} render={<Link href="/live/pricing" />}>
              See pricing
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/live/contact" />}>
              Talk to sales
            </Button>
          </SectionHeading>
        </div>
      </Example>

      <Example
        title="Left"
        layout="full"
        description="One column for content-led pages, where the section reads like an article."
        code={`<SectionHeading align="left" title="Everything included." description="…" />`}
      >
        <div className="p-8 @2xl:p-12">
          <SectionHeading
            align="left"
            title="Everything included. Nothing bolted on."
            description="Logs, metrics, domains and databases ship with every plan. There is no add-on store to shop in."
          />
        </div>
      </Example>

      <Example
        title="Highlighted word"
        layout="full"
        description="Brand colour on one word draws the eye. Use it once per page at most."
        code={`<SectionHeading
  title={<>Ship anything. Own <span className="text-brand">everything</span>.</>}
/>`}
      >
        <div className="p-8 @2xl:p-12">
          <SectionHeading
            title={
              <>
                Ship anything. Own <span className="text-brand">everything</span>.
              </>
            }
            description="Run on our cloud today and move to your own servers tomorrow, with the same pipeline."
          />
        </div>
      </Example>

      <Example
        title="Page title"
        layout="full"
        surface="subtle"
        description="Set as to h1 for the title of an inner page, such as Pricing or About. Only one per page."
        code={`<SectionHeading as="h1" align="left" title="Changelog" description="…" />`}
      >
        <div className="p-8 @2xl:p-12">
          <SectionHeading
            as="h1"
            align="left"
            title="Changelog"
            description="New features, fixes and improvements to Lumen, every two weeks."
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Write the title as a claim or an outcome, in full ink.",
          "Keep the description to one or two plain sentences.",
          "Use split for most sections and center for standalone moments.",
        ]}
        dont={[
          "Don’t add an eyebrow label, badge or number above the title.",
          "Don’t set the title in grey or a light weight.",
          "Don’t highlight more than one word.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", description: "The heading. Required." },
          { prop: "description", type: "ReactNode", description: "Supporting text, set in the lead style." },
          { prop: "align", type: '"split" | "center" | "left"', default: '"split"', description: "Layout of title and description." },
          { prop: "as", type: '"h1" | "h2"', default: '"h2"', description: "Heading level. h1 uses the h1 type role." },
          { prop: "children", type: "ReactNode", description: "Actions shown under the description." },
          { prop: "className", type: "string", description: "Classes for the wrapper." },
        ]}
      />
    </Examples>
  )
}
