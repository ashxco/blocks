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
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"

const logLines = [
  { time: "14:02:11", level: "info", text: "Build started for commit 8f3c2a1 on main" },
  { time: "14:02:19", level: "info", text: "Installed 412 packages in 6.8s" },
  { time: "14:02:31", level: "warn", text: "Image hero.png is 2.4 MB. Compress it to speed up first load." },
  { time: "14:03:02", level: "info", text: "Deployment ready at acme-web-8f3c2a1.lumen.app" },
]

function LogViewer() {
  const [live, setLive] = React.useState(true)
  const [wrap, setWrap] = React.useState(true)
  const [timestamps, setTimestamps] = React.useState(true)

  return (
    <Card className="@container/logs w-full max-w-2xl gap-0 p-0">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Toggle size="sm" variant="outline" pressed={live} onPressedChange={setLive}>
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
        <p className="ml-auto hidden text-caption text-muted-foreground @md/logs:block">
          {live ? "Streaming from iad1" : "Stream paused"}
        </p>
      </div>
      <div
        className={
          wrap
            ? "grid gap-1.5 bg-terminal p-4 font-mono text-code text-terminal-foreground"
            : "grid gap-1.5 overflow-x-auto bg-terminal p-4 font-mono text-code text-terminal-foreground [scrollbar-width:thin]"
        }
      >
        {logLines.map((line) => (
          <p key={line.time} className={wrap ? "break-words whitespace-pre-wrap" : "whitespace-pre"}>
            {timestamps ? <span className="mr-3 opacity-50">{line.time}</span> : null}
            <span className={line.level === "warn" ? "text-panel-warning" : "opacity-50"}>
              {line.level.toUpperCase()}
            </span>{" "}
            {line.text}
          </p>
        ))}
      </div>
    </Card>
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
<Toggle defaultPressed aria-label="Pin to sidebar">
  <PinIcon />
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
</Toggle>
<Toggle variant="outline" defaultPressed>
  <BellIcon data-icon="inline-start" />
  Watching
</Toggle>
<Toggle variant="outline" aria-label="Pin to sidebar">
  <PinIcon />
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
        description="Heights match buttons of the same size, so toggles and buttons line up in one row. All six are shown unpressed; a pressed toggle turns ink."
        code={`<Toggle size="sm" variant="outline">
  <BellIcon data-icon="inline-start" />
  Watch
</Toggle>
<Toggle variant="outline">
  <BellIcon data-icon="inline-start" />
  Watch
</Toggle>
<Toggle size="lg" variant="outline">
  <BellIcon data-icon="inline-start" />
  Watch
</Toggle>

<Toggle size="sm" variant="outline" aria-label="Star project"><StarIcon /></Toggle>
<Toggle variant="outline" aria-label="Star project"><StarIcon /></Toggle>
<Toggle size="lg" variant="outline" aria-label="Star project"><StarIcon /></Toggle>`}
      >
        <div className="grid justify-items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Toggle size="sm" variant="outline">
              <BellIcon data-icon="inline-start" />
              Watch
            </Toggle>
            <Toggle variant="outline">
              <BellIcon data-icon="inline-start" />
              Watch
            </Toggle>
            <Toggle size="lg" variant="outline">
              <BellIcon data-icon="inline-start" />
              Watch
            </Toggle>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Toggle size="sm" variant="outline" aria-label="Star project, small">
              <StarIcon />
            </Toggle>
            <Toggle variant="outline" aria-label="Star project, medium">
              <StarIcon />
            </Toggle>
            <Toggle size="lg" variant="outline" aria-label="Star project, large">
              <StarIcon />
            </Toggle>
          </div>
        </div>
      </Example>

      <Example
        title="States"
        description="Off, on, and disabled in both positions."
        code={`<Toggle variant="outline">Off</Toggle>
<Toggle variant="outline" defaultPressed>On</Toggle>
<Toggle variant="outline" disabled>Disabled</Toggle>
<Toggle variant="outline" defaultPressed disabled>Disabled on</Toggle>`}
      >
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
        description="Toggles change how content is shown, right away. Turn off wrapping and long lines scroll sideways instead. Controlled with pressed and onPressedChange."
        surface="subtle"
        code={`const [live, setLive] = React.useState(true)
const [timestamps, setTimestamps] = React.useState(true)
const [wrap, setWrap] = React.useState(true)

<div className="flex items-center gap-2 border-b px-3 py-2">
  <Toggle size="sm" variant="outline" pressed={live} onPressedChange={setLive}>
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
</div>`}
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
