import type { Metadata } from "next"

import { OnboardingSteps } from "@/components/blocks/onboarding-steps"

export const metadata: Metadata = {
  title: "Set up your workspace",
  description: "Name your Acme workspace, invite your team and start your first project from a template.",
}

/**
 * New sign-ups start at the workspace step. ?step=template is where the app's
 * New project, Browse templates and Create project actions lead: Maya already
 * has the Acme Inc. workspace, so it opens on the template step with the
 * workspace filled in.
 */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { step } = await searchParams
  const fromApp = step === "template"
  return (
    <section aria-labelledby="onboarding-title" className="container-page pt-4 pb-section-sm sm:pt-8">
      <h1 id="onboarding-title" className="sr-only">
        {fromApp ? "Start a project from a template" : "Set up your Acme workspace"}
      </h1>
      <OnboardingSteps
        key={fromApp ? "template" : "workspace"}
        dashboardHref="/live/app"
        defaultStep={fromApp ? 2 : 0}
        defaultValues={fromApp ? { workspaceName: "Acme Inc.", workspaceSlug: "acme" } : undefined}
      />
    </section>
  )
}
