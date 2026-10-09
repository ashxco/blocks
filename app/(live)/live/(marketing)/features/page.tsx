import type { Metadata } from "next"

import { CtaBand } from "@/components/blocks/cta-band"
import { Hero } from "@/components/blocks/hero"

import { CapabilityGrid } from "./_components/capability-grid"
import { FeatureRows } from "./_components/feature-rows"
import { ProductStage } from "./_components/product-stage"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Push-to-deploy builds, preview URLs, logs, metrics, secrets, domains and managed databases. Every Lumen plan includes every feature.",
}

/**
 * Lumen product tour: a centred hero over the dashboard on a dark panel,
 * four alternating feature rows, the full capability list and a closing call
 * to action.
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
              Everything you need to ship and <span className="text-brand">run</span> apps.
            </>
          }
          description="Builds, previews, logs, metrics, domains and databases in one platform. Run it on our cloud or on servers you own, with the same workflow."
          primaryAction={{ label: "Start for free", href: "/live/sign-up" }}
          secondaryAction={{ label: "See pricing", href: "/live/pricing" }}
          command={null}
          visual={null}
        />
      </div>
      <ProductStage />
      <FeatureRows />
      <CapabilityGrid />
      <CtaBand
        title="See it on your own code."
        description="Connect a repository and get a preview URL in about a minute. The free plan includes every feature on this page."
      />
    </>
  )
}
