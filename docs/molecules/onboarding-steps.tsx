"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { OnboardingSteps } from "@/components/blocks/onboarding-steps"

export default function OnboardingStepsDocs() {
  return (
    <Examples>
      <Example
        title="Setup flow"
        description="Name the workspace, invite the team, connect a repository. The URL fills in from the name, and the bar fills as steps are done. Finishing shows the first deployment building (see Finished below)."
        layout="full"
        minHeight="min-h-200"
        code={`<OnboardingSteps dashboardHref="/live/app" />`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <OnboardingSteps />
        </div>
      </Example>

      <Example
        title="Starting on a later step"
        description="Prefill answers you already have, for example from an invite link, and open on the step that still needs input. Earlier steps stay reachable from the panel."
        layout="full"
        surface="subtle"
        minHeight="min-h-200"
        code={`<OnboardingSteps
  defaultStep={2}
  defaultValues={{ workspaceName: "Acme Inc.", repositoryId: "acme/web" }}
/>`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <OnboardingSteps
            defaultStep={2}
            defaultValues={{ workspaceName: "Acme Inc.", repositoryId: "acme/web" }}
          />
        </div>
      </Example>

      <Example
        title="Finished"
        description="The end of the flow: the workspace summary on a dark panel and the first deployment streaming in beside it. Open on it with defaultDone, for example when someone comes back after setting up."
        layout="full"
        code={`<OnboardingSteps
  defaultDone
  defaultValues={{
    workspaceName: "Acme Inc.",
    invites: [{ id: "sam", email: "sam@acme.dev", role: "developer" }],
    repositoryId: "acme/web",
  }}
/>`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <OnboardingSteps
            defaultDone
            defaultValues={{
              workspaceName: "Acme Inc.",
              invites: [
                { id: "sam", email: "sam@acme.dev", role: "developer" },
                { id: "ana", email: "ana@acme.dev", role: "viewer" },
              ],
              repositoryId: "acme/web",
            }}
          />
        </div>
      </Example>

      <Example
        title="In a narrow slot"
        description="Below 52rem of container width the panel folds away. The progress bar and short step names keep people oriented."
        layout="full"
        code={`<div className="max-w-104">
  <OnboardingSteps />
</div>`}
      >
        <div className="px-(--card-padding) py-10">
          <div className="mx-auto max-w-104">
            <OnboardingSteps />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep it to three steps that unlock the product: a place, people and code.",
          "Make inviting optional with “Skip for now”. People often set up alone first.",
          "Validate on Continue and move focus to the first field that needs attention.",
          "End on something real, like the first deployment, not a generic success message.",
        ]}
        dont={[
          "Don’t show “Step 1 of 3” counters or numbered badges. The bar and the step titles are enough.",
          "Don’t ask for billing details during onboarding.",
          "Don’t block Back. Answers stay put when people move between steps.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "defaultStep", type: "0 | 1 | 2", default: "0", description: "Step to open on: workspace, team or repository." },
          { prop: "defaultDone", type: "boolean", default: "false", description: "Open on the finished state with defaultValues as the answers. Focus stays where it is." },
          { prop: "defaultValues", type: "Partial<OnboardingValues>", description: "Prefilled answers: workspaceName, workspaceSlug, invites, provider, repositoryId." },
          { prop: "domain", type: "string", default: '"lumen.app"', description: "Host shown before the workspace URL." },
          { prop: "repositories", type: "OnboardingRepository[]", default: "Five Acme repos", description: "Repositories offered in the last step: id, name, framework, updated, private." },
          { prop: "account", type: "string", default: '"maya-chen"', description: "Git account shown as connected." },
          { prop: "dashboardHref", type: "string", default: '"/live/app"', description: "Where “Open dashboard” leads after finishing." },
          { prop: "onComplete", type: "(values) => void | Promise<void>", description: "Called with the answers on Finish. Without it, the flow simulates a request." },
          { prop: "className", type: "string", description: "Classes for the root container." },
        ]}
      />
    </Examples>
  )
}
