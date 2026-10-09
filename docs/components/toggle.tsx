"use client"

import * as React from "react"
import {
  BellIcon,
  ClockIcon,
  PauseIcon,
  PinIcon,
  RadioIcon,
  StarIcon,
  WrapTextIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"

const logLines = [
  { time: "14:02:11", level: "info", text: "Build started for commit 8f3c2a1 on main" },
  { time: "14:02:19", level: "info", text: "Installed 412 packages in 6.8s" },
  { time: "14:02:48", level: "warn", text: "Image hero.png is 2.4 MB. Consider compressing it before the next deploy." },
  { time: "14:03:02", level: "info", text: "Deployment ready at lumen-web-8f3c2a1.lumen.app" },
]

function LogViewer() {
  const [live, setLive] = React.useState(true)
  const [wrap, setWrap] = React.useState(false)
  const [timestamps, setTimestamps] = React.useState(true)

  return (
    <div className="overflow-hidden rounded-(--card-radius) border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <Toggle
          size="sm"
          variant="outline"
          pressed={live}
          onPressedChange={setLive}
        >
          {live ? <RadioIcon data-icon="inline-start" /> : <PauseIcon data-icon="inline-start" />}
          {live ? "Live" : "Paused"}
        </Toggle>
        <Separator orientation="vertical" className="mx-1 my-1.5" />
        <Toggle size="sm" pressed={timestamps} onPressedChange={setTimestamps} aria-label="Show timestamps">
          <ClockIcon />
        </Toggle>
        <Toggle size="sm" pressed={wrap} onPressedChange={setWrap} aria-label="Wrap long lines">
          <WrapTextIcon />
        </Toggle>
        <p className="ml-auto text-sm text-muted-foreground">
          {live ? "Streaming from iad1" : "Stream paused"}
        </p>
      </div>
      <div className="grid gap-1.5 bg-terminal p-4 font-mono text-code text-terminal-foreground">
        {logLines.map((line) => (
          <p
            key={line.time}
            className={wrap ? "break-words whitespace-normal" : "truncate whitespace-nowrap"}
          >
            {timestamps ? <span className="mr-3 opacity-50">{line.time}</span> : null}
            <span className={line.level === "warn" ? "text-warning" : "opacity-50"}>
              {line.level.toUpperCase()}
            </span>{" "}
            {line.text}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function ToggleDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A quiet pill that turns ink when it is on. Icon-only toggles become circles and need an aria-label."
        code={`<Toggle aria-label="Wrap long lines">
  <WrapTextIcon />
</Toggle>
<Toggle defaultPressed>
  <ClockIcon data-icon="inline-start" />
  Timestamps
</Toggle>`}
      >
        <Toggle aria-label="Wrap long lines">
          <WrapTextIcon />
        </Toggle>
        <Toggle defaultPressed aria-label="Pin to sidebar">
          <PinIcon />
        </Toggle>
        <Toggle defaultPressed>
          <ClockIcon data-icon="inline-start" />
          Timestamps
        </Toggle>
      </Example>

      <Example
        title="Outline"
        description="Use outline when the toggle stands on its own, away from a toolbar."
        code={`<Toggle variant="outline">
  <StarIcon data-icon="inline-start" />
  Star project
</Toggle>`}
      >
        <Toggle variant="outline">
          <StarIcon data-icon="inline-start" />
          Star project
        </Toggle>
        <Toggle variant="outline" defaultPressed>
          <BellIcon data-icon="inline-start" />
          Watching
        </Toggle>
        <Toggle variant="outline" aria-label="Pin to sidebar">
          <PinIcon />
        </Toggle>
      </Example>

      <Example
        title="Sizes"
        description="Heights match buttons of the same size, so toggles and buttons line up in one row."
      >
        <Toggle size="sm" variant="outline" defaultPressed>
          Small
        </Toggle>
        <Toggle variant="outline" defaultPressed>
          Medium
        </Toggle>
        <Toggle size="lg" variant="outline" defaultPressed>
          Large
        </Toggle>
        <Toggle size="sm" variant="outline" aria-label="Small icon toggle">
          <StarIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="Medium icon toggle">
          <StarIcon />
        </Toggle>
        <Toggle size="lg" variant="outline" aria-label="Large icon toggle">
          <StarIcon />
        </Toggle>
      </Example>

      <Example title="States" description="Off, on, and disabled in both positions.">
        <Toggle variant="outline">Off</Toggle>
        <Toggle variant="outline" defaultPressed>
          On
        </Toggle>
        <Toggle variant="outline" disabled>
          Disabled
        </Toggle>
        <Toggle variant="outline" defaultPressed disabled>
          Disabled on
        </Toggle>
      </Example>

      <Example
        title="Log viewer"
        description="Toggles change how content is shown, right away. Controlled with pressed and onPressedChange."
        layout="stack"
        code={`const [live, setLive] = React.useState(true)

<Toggle size="sm" variant="outline" pressed={live} onPressedChange={setLive}>
  {live ? <RadioIcon data-icon="inline-start" /> : <PauseIcon data-icon="inline-start" />}
  {live ? "Live" : "Paused"}
</Toggle>`}
      >
        <LogViewer />
      </Example>

      <Guidelines
        do={[
          "Use a toggle for a setting that takes effect at once, such as wrapping log lines.",
          "Keep the label the same when pressed, or change it to describe the new state, as in Live and Paused.",
          "Give icon-only toggles an aria-label that names the setting.",
        ]}
        dont={[
          "Don’t use a toggle to submit a form or start a task. Use a button.",
          "Don’t use a toggle for one choice out of several. Use a toggle group.",
          "Don’t colour a pressed toggle with brand. Pressed is always ink.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "outline"', default: '"default"', description: "Quiet pill, or a pill with a hairline border." },
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height from --button-height-* tokens." },
          { prop: "pressed", type: "boolean", description: "Controlled pressed state." },
          { prop: "defaultPressed", type: "boolean", default: "false", description: "Initial pressed state when uncontrolled." },
          { prop: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when the user toggles it." },
          { prop: "disabled", type: "boolean", default: "false", description: "Prevents interaction and dims the toggle." },
        ]}
      />
    </Examples>
  )
}
