import type { Metadata } from "next"

import { CtaBand } from "@/components/blocks/cta-band"
import { Hero } from "@/components/blocks/hero"

import { CapabilityGrid } from "./_components/capability-grid"
import { FeatureRows } from "./_components/feature-rows"
import { ProductStage } from "./_components/product-stage"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Projects in list, board, timeline and calendar views, tasks, docs, automations, reports and integrations, with SSO and an audit log on Business.",
}

/**
 * Acme features: a centred hero over the product on a dark panel, four
 * alternating feature rows, the full capability list and a closing call to
 * action.
 */
export default function FeaturesPage() {
  return (
    <>
      <div className="container-page pt-section-sm pb-14 md:pb-20">
        <Hero
          contained={false}
          variant="centered"
          title={
            <>
              Everything your team needs to <span className="text-brand">finish</span> the work.
            </>
          }
          description="Projects, tasks, docs, automations and reports in one workspace, with the admin controls your IT team asks for."
          primaryAction={{ label: "Start free trial", href: "/live/sign-up" }}
          secondaryAction={{ label: "See pricing", href: "/live/pricing" }}
          command={null}
          visual={null}
        />
      </div>
      <ProductStage />
      <FeatureRows />
      <CapabilityGrid />
      <CtaBand
        title="See it with your own projects."
        description="Import a spreadsheet or start from a template, and invite your team in a few minutes. Pro is free for 14 days."
        aside={null}
      />
    </>
  )
}
