"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AppMockup } from "@/components/blocks/app-mockup"

export default function AppMockupDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="A browser frame with the workspace sidebar and a project’s task list, grouped by status, on a brand-subtle stage. The screen is inert and announced as one image."
        code={`<AppMockup />`}
      >
        <AppMockup />
      </Example>

      <Example
        title="Interactive"
        layout="full"
        description="Let people search the tasks, regroup them by priority or assignee, and tick tasks off. Use it on feature pages where trying the UI helps."
        code={`<AppMockup interactive />`}
      >
        <AppMockup interactive />
      </Example>

      <Example
        title="Without the stage"
        layout="full"
        surface="subtle"
        description="Drop the stage when the mockup already sits on a tinted band or inside a card."
        code={`<AppMockup stage={false} url="app.acme.com/acme/projects/website-relaunch/list" />`}
      >
        <AppMockup stage={false} url="app.acme.com/acme/projects/website-relaunch/list" />
      </Example>

      <Example
        title="In a narrow slot"
        layout="full"
        description="The frame lays out from its own width, not the viewport. Below 46rem the sidebar hides; below 34rem the rows drop their priority and due date and the group menu steps aside, as they do here."
        code={`<AppMockup contained={false} />`}
      >
        <div className="max-w-md p-6 @2xl:p-10">
          <AppMockup contained={false} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Build the screen from real components so it changes when the system does.",
          "Show one screen per mockup, with realistic data from one project.",
          "Write a label that describes what the screen shows for people who can’t see it.",
        ]}
        dont={[
          "Don’t use a static screenshot that will drift from the product.",
          "Don’t add drop shadows or tilt the frame for depth.",
          "Don’t make it interactive when the controls do nothing useful.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "url", type: "string", default: '"app.acme.com/acme/projects/website-relaunch"', description: "Address in the browser bar." },
          { prop: "interactive", type: "boolean", default: "false", description: "Let people use the controls. When false the frame is inert and exposed as one image." },
          { prop: "label", type: "string", default: "Describes the project task list", description: "Accessible name of the image when not interactive." },
          { prop: "stage", type: "boolean", default: "true", description: "Brand-subtle stage around the frame." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
