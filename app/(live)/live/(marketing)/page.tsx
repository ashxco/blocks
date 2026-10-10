import type { Metadata } from "next"

import { Comparison } from "@/components/blocks/comparison"
import { CtaBand } from "@/components/blocks/cta-band"
import { FeatureBento } from "@/components/blocks/feature-bento"
import { Hero } from "@/components/blocks/hero"
import { LogoCloud } from "@/components/blocks/logo-cloud"
import { ProductTour } from "@/components/blocks/product-tour"
import { Testimonial } from "@/components/blocks/testimonial"

import { DeveloperBand } from "./_components/developer-band"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Acme is one workspace for your team’s projects, tasks, docs and reports. Plan, track and ship your team’s work in one place.",
}

/**
 * Acme home page: the pitch and a live product moment, the customer logos,
 * the product tour on a dark panel, everything in one place, why teams
 * switch, a customer, the API band and the closing call to action.
 * Sections keep their own spacing; where two sections meet on the same
 * surface, the second drops its top padding so the rhythm stays one section
 * tall.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <ProductTour />
      <div className="border-y bg-subtle">
        <FeatureBento />
      </div>
      <Comparison />
      <Testimonial className="pt-0" />
      <DeveloperBand />
      <CtaBand className="pt-0" />
    </>
  )
}
