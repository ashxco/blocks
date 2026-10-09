"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { PipelineShowcase } from "@/components/blocks/pipeline-showcase"

export default function PipelineShowcaseDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Five steps beside a terminal. It advances every 4.5 seconds while on screen, pauses on hover and stops once someone picks a step or presses pause. With reduced motion it never advances on its own."
        code={`<PipelineShowcase />`}
      >
        <PipelineShowcase />
      </Example>

      <Example
        title="Without auto-play"
        layout="full"
        description="Start on a chosen step and let people explore. Use this when the section sits next to other moving content."
        code={`<PipelineShowcase autoPlay={false} defaultStep={1} />`}
      >
        <PipelineShowcase autoPlay={false} defaultStep={1} />
      </Example>

      <Example
        title="Custom steps"
        layout="full"
        description="Any short sequence with terminal output works: a rollback, a migration, a database branch."
        code={`<PipelineShowcase
  title="Roll back in one command."
  description="Every deploy is kept, so going back is a traffic switch, not a rebuild."
  windowTitle="lumen — rollback"
  steps={[
    { title: "Spot it", description: "An alert fires when the error rate passes your threshold.", meta: "0s", lines: [...] },
    { title: "Roll back", description: "Point traffic at the previous deploy. Nothing rebuilds.", meta: "2.3s", lines: [...] },
    { title: "Confirm", description: "Errors drop back and the bad deploy stays for debugging.", meta: "live", lines: [...] },
  ]}
/>`}
      >
        <PipelineShowcase
          title="Roll back in one command."
          description="Every deploy is kept, so going back is a traffic switch, not a rebuild."
          windowTitle="lumen — rollback"
          autoPlay={false}
          steps={[
            {
              title: "Spot it",
              description: "An alert fires when the error rate passes your threshold.",
              meta: "0s",
              lines: [
                "→ Alert: error rate 4.2% on web (threshold 1%)",
                "→ Started 3 minutes after deploy c3e88a0",
                "$ lumen deploys --limit 2",
                "→ c3e88a0  main  live    3m ago",
                "→ a41c9e2  main  ready  2h ago",
              ],
            },
            {
              title: "Roll back",
              description: "Point traffic at the previous deploy. Nothing rebuilds.",
              meta: "2.3s",
              lines: [
                "$ lumen rollback a41c9e2",
                "→ a41c9e2 is still warm on fra-1 and iad-1",
                "→ Shifting traffic 0% → 100%",
                "✓ Rolled back in 2.3s",
              ],
            },
            {
              title: "Confirm",
              description: "Errors drop back and the bad deploy stays for debugging.",
              meta: "live",
              lines: [
                "$ lumen metrics --since 5m",
                "→ error rate 0.1%, p95 108ms",
                "→ c3e88a0 kept for 7 days for debugging",
                "✓ All checks passing",
              ],
            },
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Keep each step’s output to four to six lines so the terminal doesn’t jump in height.",
          "Use “$” for commands, “→” for progress and “✓” for results.",
          "Write the step titles as single verbs.",
        ]}
        dont={[
          "Don’t number the steps; the vertical rail already shows the order.",
          "Don’t place two auto-playing sections on the same screen.",
          "Don’t put the showcase on a dark page band; it brings its own panel.",
        ]}
      />

      <ApiTable
        title="PipelineShowcase"
        rows={[
          { prop: "title", type: "ReactNode", default: '"One push. Five steps. Zero config."', description: "Heading on the panel." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "steps", type: "PipelineStep[]", default: "Push, Build, Ship, Route, Watch", description: "The selectable steps and their terminal output." },
          { prop: "windowTitle", type: "string", default: '"lumen — acme/web"', description: "Label in the terminal title bar." },
          { prop: "autoPlay", type: "boolean", default: "true", description: "Advance on a timer until someone interacts. Off when reduced motion is on." },
          { prop: "interval", type: "number", default: "4500", description: "Milliseconds per step while playing." },
          { prop: "defaultStep", type: "number", default: "0", description: "Index of the step selected first." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the wide container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="PipelineStep"
        rows={[
          { prop: "title", type: "string", description: "Step name, a single verb." },
          { prop: "description", type: "string", description: "Shown under the title when the step is selected." },
          { prop: "meta", type: "string", description: "Short readout on the right, such as a duration." },
          { prop: "lines", type: "string[]", description: "Terminal output. “$” prompts, “✓” successes, “→” notes." },
        ]}
      />
    </Examples>
  )
}
