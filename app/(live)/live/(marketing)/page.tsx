import type { Metadata } from "next"

import { Comparison } from "@/components/blocks/comparison"
import { CtaBand } from "@/components/blocks/cta-band"
import { FeatureBento } from "@/components/blocks/feature-bento"
import { Hero } from "@/components/blocks/hero"
import { LogoCloud } from "@/components/blocks/logo-cloud"
import { PipelineShowcase } from "@/components/blocks/pipeline-showcase"
import { Testimonial } from "@/components/blocks/testimonial"

import { OpenSourceBand } from "./_components/open-source-band"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Push your code and Lumen builds, ships and runs it on our cloud or on servers you own. Every branch gets a preview URL and every deploy can roll back.",
}

/**
 * Lumen home page: the pitch and a live product moment, the stacks it runs,
 * the deploy pipeline on a dark panel, everything included, why teams
 * switch, a customer, the open-source core and the closing call to action.
 * Sections keep their own spacing; where two sections meet on the same
 * surface, the second drops its top padding so the rhythm stays one section
 * tall.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <PipelineShowcase />
      <div className="border-y bg-subtle">
        <FeatureBento />
      </div>
      <Comparison />
      <Testimonial className="pt-0" />
      <OpenSourceBand />
      <CtaBand className="pt-0" />
    </>
  )
}
