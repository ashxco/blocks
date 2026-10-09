import type { Metadata } from "next"

import { OnboardingSteps } from "@/components/blocks/onboarding-steps"

export const metadata: Metadata = {
  title: "Set up your workspace",
  description: "Name your Lumen workspace, invite your team and connect the repository you want to deploy.",
}

export default function OnboardingPage() {
  return (
    <section aria-labelledby="onboarding-title" className="container-page pt-4 pb-section-sm sm:pt-8">
      <h1 id="onboarding-title" className="sr-only">
        Set up your Lumen workspace
      </h1>
      <OnboardingSteps dashboardHref="/live/app" />
    </section>
  )
}
