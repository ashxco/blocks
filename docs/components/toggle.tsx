"use client"

import * as React from "react"
import {
  BellIcon,
  CalendarIcon,
  CircleCheckIcon,
  CircleIcon,
  ListChecksIcon,
  PinIcon,
  StarIcon,
  UserRoundIcon,
  UsersIcon,
  WrapTextIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"

const tasks = [
  {
    id: "hero-copy",
    title: "Review the homepage hero copy, check it against the brand refresh guide and send notes to Sofia before Thursday’s design review",
    assignee: "Maya Patel",
    due: "Oct 12",
    done: false,
  },
  { id: "launch-email", title: "Draft the launch email", assignee: "Priya Raman", due: "Oct 14", done: false },
  { id: "pricing-links", title: "Fix broken links on the pricing page", assignee: "Jordan Lee", due: "Oct 8", done: true },
  { id: "sitemap", title: "Approve the new sitemap", assignee: "Maya Patel", due: "Oct 6", done: true },
  {
    id: "usability",
    title: "Book usability sessions with five Northwind admins",
    assignee: "Sam Okafor",
    due: "Oct 16",
    done: false,
  },
]

function TaskListViewer() {
  const [mine, setMine] = React.useState(false)
  const [completed, setCompleted] = React.useState(true)
  const [dueDates, setDueDates] = React.useState(true)
  const [wrap, setWrap] = React.useState(true)

  const visible = tasks.filter(
    (task) => (!mine || task.assignee === "Maya Patel") && (completed || !task.done)
  )

  return (
    <Card className="@container/tasks w-full max-w-2xl gap-0 p-0">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Toggle size="sm" variant="outline" pressed={mine} onPressedChange={setMine}>
          {mine ? <UserRoundIcon data-icon="inline-start" /> : <UsersIcon data-icon="inline-start" />}
          {mine ? "My tasks" : "All tasks"}
        </Toggle>
        <Separator orientation="vertical" className="mx-1 my-1.5" />
        <Toggle size="sm" pressed={completed} onPressedChange={setCompleted} aria-label="Show completed tasks">
          <ListChecksIcon />
        </Toggle>
        <Toggle size="sm" pressed={dueDates} onPressedChange={setDueDates} aria-label="Show due dates">
          <CalendarIcon />
        </Toggle>
        <Toggle size="sm" pressed={wrap} onPressedChange={setWrap} aria-label="Wrap long titles">
          <WrapTextIcon />
        </Toggle>
        <p className="ml-auto hidden text-caption text-muted-foreground @md/tasks:block">
          Website relaunch · {visible.length} {visible.length === 1 ? "task" : "tasks"}
        </p>
      </div>
      <ul className="divide-y">
        {visible.map((task) => (
          <li key={task.id} className="flex items-start gap-3 px-4 py-3">
            {task.done ? (
              <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <CircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p
                className={cn(
                  "text-label",
                  wrap ? "break-words" : "truncate",
                  task.done ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {task.done ? <span className="sr-only">Completed: </span> : null}
                {task.title}
              </p>
              <p className="text-caption text-muted-foreground">
                {task.assignee}
                {dueDates ? ` · Due ${task.due}` : null}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function ToggleDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A quiet toggle, shaped like a button, that turns ink when it is on. Icon-only toggles are square and need an aria-label."
        code={`<Toggle aria-label="Wrap long titles">
  <WrapTextIcon />
</Toggle>
<Toggle defaultPressed aria-label="Pin to sidebar">
  <PinIcon />
</Toggle>
<Toggle defaultPressed>
  <CalendarIcon data-icon="inline-start" />
  Due dates
</Toggle>`}
      >
        <Toggle aria-label="Wrap long titles">
          <WrapTextIcon />
        </Toggle>
        <Toggle defaultPressed aria-label="Pin to sidebar">
          <PinIcon />
        </Toggle>
        <Toggle defaultPressed>
          <CalendarIcon data-icon="inline-start" />
          Due dates
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
        title="Task list"
        description="Toggles change how content is shown, right away. Hide completed tasks or due dates, or turn off wrapping so long titles fit on one line. Controlled with pressed and onPressedChange."
        surface="subtle"
        code={`const [mine, setMine] = React.useState(false)
const [completed, setCompleted] = React.useState(true)
const [dueDates, setDueDates] = React.useState(true)
const [wrap, setWrap] = React.useState(true)

<div className="flex items-center gap-2 border-b px-3 py-2">
  <Toggle size="sm" variant="outline" pressed={mine} onPressedChange={setMine}>
    {mine ? <UserRoundIcon data-icon="inline-start" /> : <UsersIcon data-icon="inline-start" />}
    {mine ? "My tasks" : "All tasks"}
  </Toggle>
  <Separator orientation="vertical" className="mx-1 my-1.5" />
  <Toggle size="sm" pressed={completed} onPressedChange={setCompleted} aria-label="Show completed tasks">
    <ListChecksIcon />
  </Toggle>
  <Toggle size="sm" pressed={dueDates} onPressedChange={setDueDates} aria-label="Show due dates">
    <CalendarIcon />
  </Toggle>
  <Toggle size="sm" pressed={wrap} onPressedChange={setWrap} aria-label="Wrap long titles">
    <WrapTextIcon />
  </Toggle>
</div>`}
      >
        <TaskListViewer />
      </Example>

      <Guidelines
        do={[
          "Use a toggle for a setting that takes effect at once, such as hiding completed tasks.",
          "Keep the label the same when pressed, or change it to describe the new state, as in My tasks and All tasks.",
          "Give icon-only toggles an aria-label that names the setting.",
        ]}
        dont={[
          "Don’t use a toggle to submit a form or run an action. Use a button.",
          "Don’t use a toggle for one choice out of several. Use a toggle group.",
          "Don’t colour a pressed toggle with brand. Pressed is always ink.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "outline"', default: '"default"', description: "Quiet, or with a hairline border." },
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
