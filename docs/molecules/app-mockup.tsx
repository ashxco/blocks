"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AppMockup } from "@/components/blocks/app-mockup"

export default function AppMockupDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="A browser frame with a project sidebar and the deploy settings form, on a brand-subtle stage. The screen is inert and announced as one image."
        code={`<AppMockup />`}
      >
        <AppMockup />
      </Example>

      <Example
        title="Interactive"
        layout="full"
        description="Let people type in the fields, open the region menu and flip the switch. Use it on feature pages where trying the UI helps."
        code={`<AppMockup interactive />`}
      >
        <AppMockup interactive />
      </Example>

      <Example
        title="Without the stage"
        layout="full"
        surface="subtle"
        description="Drop the stage when the mockup already sits on a tinted band or inside a card."
        code={`<AppMockup stage={false} url="app.lumen.dev/acme/api/settings" />`}
      >
        <AppMockup stage={false} url="app.lumen.dev/acme/api/settings" />
      </Example>

      <Example
        title="In a narrow slot"
        layout="full"
        description="The frame lays out from its own width: the sidebar hides and the form stacks to one column."
        code={`<AppMockup contained={false} />`}
      >
        <div className="max-w-prose p-6 sm:p-10">
          <AppMockup contained={false} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Build the screen from real components so it changes when the system does.",
          "Show one task per mockup, with realistic values.",
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
          { prop: "url", type: "string", default: '"app.lumen.dev/acme/web/settings"', description: "Address in the browser bar." },
          { prop: "interactive", type: "boolean", default: "false", description: "Let people use the controls. When false the frame is inert and exposed as one image." },
          { prop: "label", type: "string", default: "Describes the deploy settings screen", description: "Accessible name of the image when not interactive." },
          { prop: "stage", type: "boolean", default: "true", description: "Brand-subtle stage around the frame." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
