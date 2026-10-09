"use client"

import * as React from "react"
import { RocketIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

const steps = [
  { label: "Cloning repository", until: 12 },
  { label: "Installing dependencies", until: 48 },
  { label: "Building", until: 86 },
  { label: "Uploading to the edge", until: 100 },
]

function DeployProgress() {
  // Rests on the last finished deploy, so the preview shows a full, labelled bar.
  const [value, setValue] = React.useState<number | null>(100)
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  function start() {
    if (timer.current) clearInterval(timer.current)
    setValue(0)
    timer.current = setInterval(() => {
      setValue((v) => {
        const next = Math.min(100, (v ?? 0) + Math.ceil(Math.random() * 7))
        if (next >= 100 && timer.current) clearInterval(timer.current)
        return next
      })
    }, 180)
  }

  const step = value === null ? null : steps.find((s) => value < s.until) ?? steps[steps.length - 1]
  const done = value === 100

  return (
    <div className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <h3 className="text-title text-foreground">lumen-web</h3>
          <p className="text-sm text-muted-foreground">
            {value === null
              ? "Ready to deploy commit 8f3c2a1 from main"
              : done
                ? "Deployed to production in 3 regions"
                : step?.label}
          </p>
        </div>
        <Button size="sm" onClick={start} disabled={value !== null && !done}>
          <RocketIcon data-icon="inline-start" />
          {done ? "Deploy again" : "Deploy"}
        </Button>
      </div>
      <Progress value={value ?? 0} aria-label="Deployment progress">
        <ProgressLabel>{value === null ? "Not started" : done ? "Done" : "Deploying"}</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

const usage = [
  { label: "Build minutes", used: 3420, limit: 6000, unit: "min" },
  { label: "Bandwidth", used: 912, limit: 1000, unit: "GB" },
  { label: "Database storage", used: 12.4, limit: 50, unit: "GB" },
]

export default function ProgressDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A 4px ink bar on a bg-secondary track."
        layout="stack"
        code={`<Progress value={64} aria-label="Upload progress" />`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-6">
          <Progress value={18} aria-label="Example at 18%" />
          <Progress value={64} aria-label="Example at 64%" />
          <Progress value={100} aria-label="Example complete" />
        </div>
      </Example>

      <Example
        title="With label and value"
        description="Put a ProgressLabel and a ProgressValue inside. They sit above the bar, and the value is formatted for the locale."
        layout="stack"
        code={`<Progress value={72}>
  <ProgressLabel>Uploading build output</ProgressLabel>
  <ProgressValue />
</Progress>`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-8">
          <Progress value={72}>
            <ProgressLabel>Uploading build output</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={3} max={5}>
            <ProgressLabel>Onboarding</ProgressLabel>
            <ProgressValue>{(_, value) => `${value} of 5 steps`}</ProgressValue>
          </Progress>
        </div>
      </Example>

      <Example
        title="Indeterminate"
        description="Pass null when you can’t tell how long the work will take. The bar sweeps, and rests at low contrast when motion is reduced."
        layout="stack"
        code={`<Progress value={null}>
  <ProgressLabel>Provisioning database</ProgressLabel>
</Progress>`}
      >
        <div className="mx-auto grid w-full max-w-96">
          <Progress value={null}>
            <ProgressLabel>Provisioning database</ProgressLabel>
          </Progress>
        </div>
      </Example>

      <Example
        title="Deploy"
        description="The width animates between values, so frequent updates look smooth. Choose Deploy again to watch it run, with the current step next to the bar."
        layout="stack"
        code={`const [value, setValue] = React.useState(0)

<Progress value={value}>
  <ProgressLabel>Deploying</ProgressLabel>
  <ProgressValue />
</Progress>`}
      >
        <DeployProgress />
      </Example>

      <Example
        title="Usage meters"
        description="A static bar shows how much of a limit is used. Format the value yourself when it is not a percentage."
        layout="stack"
      >
        <div className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4 text-foreground">Usage this month</h3>
            <p className="text-sm text-muted-foreground">Pro plan · resets on 1 November</p>
          </div>
          <div className="grid gap-6">
            {usage.map((u) => (
              <Progress key={u.label} value={u.used} max={u.limit}>
                <ProgressLabel>{u.label}</ProgressLabel>
                <ProgressValue>
                  {() => `${u.used.toLocaleString("en-US")} of ${u.limit.toLocaleString("en-US")} ${u.unit}`}
                </ProgressValue>
              </Progress>
            ))}
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use progress when you know how far a task has got. Use a spinner when you don’t.",
          "Label the bar, with ProgressLabel or aria-label.",
          "Say what is happening next to the bar: Installing dependencies, Uploading.",
        ]}
        dont={[
          "Don’t colour the bar by status. If a limit is close, add an alert that says so.",
          "Don’t make the bar thicker for emphasis. Put the number in large type instead.",
          "Don’t move the bar backwards.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "value", type: "number | null", description: "Current value. null shows the indeterminate sweep." },
          { prop: "min", type: "number", default: "0", description: "Lowest value." },
          { prop: "max", type: "number", default: "100", description: "Highest value." },
          { prop: "format", type: "Intl.NumberFormatOptions", description: "How ProgressValue formats the value." },
          { prop: "getAriaValueText", type: "(formatted, value) => string", description: "Text read by screen readers." },
          { prop: "ProgressValue children", type: "(formatted, value) => ReactNode", description: "Render the value yourself, for units such as GB." },
        ]}
      />
    </Examples>
  )
}
