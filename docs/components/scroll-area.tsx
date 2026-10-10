"use client"

import {
  CalendarClockIcon,
  CircleCheckIcon,
  ListPlusIcon,
  MessageSquareIcon,
  PaperclipIcon,
  UserPlusIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const activityIcon = {
  done: CircleCheckIcon,
  comment: MessageSquareIcon,
  assign: UserPlusIcon,
  due: CalendarClockIcon,
  attach: PaperclipIcon,
  subtask: ListPlusIcon,
}

const activity: { id: number; kind: keyof typeof activityIcon; who: string; what: string; date: string }[] = [
  { id: 1, kind: "done", who: "Sofia Alvarez", what: "completed “Choose the hero image”", date: "Oct 8" },
  { id: 2, kind: "comment", who: "Priya Raman", what: "commented on “Write the homepage hero copy”", date: "Oct 8" },
  { id: 3, kind: "assign", who: "Jordan Lee", what: "took “Fix the pricing table on mobile”", date: "Oct 7" },
  { id: 4, kind: "due", who: "Maya Patel", what: "moved “Set up the pricing page” to Oct 20", date: "Oct 7" },
  { id: 5, kind: "comment", who: "Hana Kim", what: "commented on the homepage copy", date: "Oct 6" },
  { id: 6, kind: "attach", who: "Sofia Alvarez", what: "attached homepage-wireframes.fig", date: "Oct 6" },
  { id: 7, kind: "assign", who: "Lucas Moreau", what: "assigned “Book the launch review” to Maya Patel", date: "Oct 5" },
  { id: 8, kind: "done", who: "Priya Raman", what: "completed “Collect customer quotes”", date: "Oct 3" },
  { id: 9, kind: "assign", who: "Maya Patel", what: "invited Sam Okafor to the project", date: "Oct 2" },
  { id: 10, kind: "subtask", who: "Jordan Lee", what: "added 6 subtasks to “Set up the pricing page”", date: "Oct 1" },
  { id: 11, kind: "done", who: "Maya Patel", what: "created Website relaunch from the Product roadmap template", date: "Sep 29" },
]

const projects = [
  { name: "Website relaunch", detail: "Due Nov 14 · 38 of 52 tasks", status: "On track" },
  { name: "Mobile app 2.0", detail: "Due Nov 20 · 61 of 118 tasks", status: "At risk" },
  { name: "Q4 planning", detail: "Due Oct 16 · 14 of 20 tasks", status: "On track" },
  { name: "Customer portal", detail: "Due Oct 23 · 22 of 64 tasks", status: "Off track" },
  { name: "Brand refresh", detail: "Due Nov 6 · 27 of 40 tasks", status: "On track" },
  { name: "Billing migration", detail: "Due Nov 13 · 18 of 45 tasks", status: "At risk" },
  { name: "Onboarding redesign", detail: "Done Sep 30 · 46 of 46 tasks", status: "Completed" },
  { name: "Help center", detail: "Paused Sep 30 · 9 of 30 tasks", status: "Paused" },
]

const statusDot: Record<string, string> = {
  "On track": "bg-success",
  "At risk": "bg-warning",
  "Off track": "bg-destructive",
  Completed: "bg-muted-foreground",
  Paused: "bg-muted-foreground",
}

/* Website relaunch in October: each bar runs from its first to its last day. */
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const today = 9
const timeline = [
  { task: "Write the homepage hero copy", start: 1, end: 6, done: true },
  { task: "Choose the hero image", start: 3, end: 8, done: true },
  { task: "Write the launch announcement", start: 5, end: 14, done: false },
  { task: "Get Hana’s sign-off on the copy", start: 8, end: 12, done: false },
  { task: "Set up the pricing page", start: 9, end: 20, done: false },
  { task: "Fix the pricing table on mobile", start: 13, end: 15, done: false },
  { task: "Write the help articles", start: 15, end: 24, done: false },
  { task: "Book the launch review", start: 20, end: 21, done: false },
  { task: "Check every page on phones and tablets", start: 21, end: 27, done: false },
  { task: "Plan the launch email", start: 27, end: 31, done: false },
]

export default function ScrollAreaDocs() {
  return (
    <Examples>
      <Example
        title="Vertical"
        description="Give the area a height and let the content scroll. The scrollbar stays out of the way until you hover or scroll."
        code={`<ScrollArea className="h-80 w-full max-w-sm rounded-(--card-radius) border">
  <ul className="divide-y px-5">
    {activity.map((item) => (
      <li key={item.id} className="py-3">…</li>
    ))}
  </ul>
</ScrollArea>`}
      >
        <ScrollArea className="h-80 w-full max-w-sm rounded-(--card-radius) border border-border bg-card">
          <div className="sticky top-0 z-10 border-b border-border bg-card px-5 py-3.5">
            <p className="text-title text-foreground">Activity</p>
          </div>
          <ul className="divide-y divide-border px-5">
            {activity.map((item) => {
              const Icon = activityIcon[item.kind]
              return (
                <li key={item.id} className="flex items-start gap-3 py-3">
                  <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="min-w-0 flex-1 text-sm text-copy">
                    <span className="font-semibold text-foreground">{item.who}</span> {item.what}
                  </p>
                  <span className="shrink-0 text-caption text-muted-foreground tabular-nums">{item.date}</span>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </Example>

      <Example
        title="Horizontal"
        layout="stack"
        description="Add a horizontal ScrollBar for content that runs sideways, such as a row of cards."
        code={`<ScrollArea className="w-full whitespace-nowrap">
  <div className="flex w-max gap-3 pb-4">…</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>`}
      >
        <ScrollArea className="w-full min-w-0">
          <div className="flex w-max gap-3 pb-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="grid w-64 grid-cols-1 gap-3 rounded-(--card-radius) border border-border bg-card p-4"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-semibold text-foreground">{project.name}</p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-caption text-copy">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${statusDot[project.status]}`} />
                    {project.status}
                  </span>
                </div>
                <p className="truncate text-caption text-muted-foreground">{project.detail}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Example>

      <Example
        title="Timeline"
        layout="stack"
        description="Wide views such as a timeline scroll both ways inside the same quiet scrollbars, with a second ScrollBar for the sideways axis. Keep the day header and task names sticky so people keep their place. The viewport takes keyboard focus, so arrow keys scroll it."
        code={`<ScrollArea className="h-72" aria-label="Website relaunch timeline">
  <div className="grid min-w-max grid-cols-[14rem_repeat(31,2.25rem)]">
    <div className="sticky top-0 left-0 z-20 bg-card">Task</div>
    {days.map((day) => <div key={day} className="sticky top-0 z-10 bg-card">{day}</div>)}
    …
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>`}
      >
        <div className="@container overflow-hidden rounded-(--card-radius) border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
            <p className="text-title text-foreground">Website relaunch</p>
            <p className="text-caption text-muted-foreground">October 2026</p>
          </div>
          <ScrollArea className="h-72" aria-label="Website relaunch timeline, October 2026">
            {/* In a narrow card the task column shrinks, so a few days stay in view beside it. */}
            <div className="grid min-w-max grid-cols-[9.5rem_repeat(31,2.25rem)] text-sm @xl:grid-cols-[14rem_repeat(31,2.25rem)]">
              <div className="sticky top-0 left-0 z-20 flex h-9 items-center border-r border-b border-border bg-card px-4 text-caption font-semibold text-muted-foreground @xl:px-5">
                Task
              </div>
              {days.map((day) => (
                <div
                  key={day}
                  className={cn(
                    "sticky top-0 z-10 grid h-9 place-items-center border-b border-border bg-card text-caption tabular-nums",
                    day === today ? "font-semibold text-brand" : "text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
              {timeline.map((row) => (
                <div key={row.task} className="contents">
                  <div className="sticky left-0 z-5 flex h-10 items-center border-r border-b border-border bg-card px-4 @xl:px-5">
                    <span className={cn("truncate", row.done ? "text-muted-foreground" : "text-foreground")}>{row.task}</span>
                  </div>
                  <div className="relative col-span-31 h-10 border-b border-border">
                    {/* Today, in the accent: its one use on the timeline. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-brand"
                      style={{ left: `${((today - 0.5) / days.length) * 100}%` }}
                    />
                    <span
                      className={cn(
                        "absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full",
                        row.done ? "bg-foreground/25" : "bg-foreground"
                      )}
                      style={{
                        left: `calc(${((row.start - 1) / days.length) * 100}% + 4px)`,
                        width: `calc(${((row.end - row.start + 1) / days.length) * 100}% - 8px)`,
                      }}
                    >
                      <span className="sr-only">
                        Oct {row.start} to Oct {row.end}
                        {row.done ? ", done" : ""}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Example>

      <Guidelines
        do={[
          "Give the scroll area a fixed height or max height; it does not size itself.",
          "Keep headers outside the scroll area, or make them sticky inside it.",
          "Label scrolling areas that hold meaningful content with aria-label.",
        ]}
        dont={[
          "Don’t nest scroll areas that scroll in the same direction.",
          "Don’t fade the edges of a scroll area with gradients; use a hairline header or footer instead.",
          "Don’t put a whole page in a scroll area; let the page scroll.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "className", type: "string", description: "ScrollArea: size, radius and border. Set a height such as h-80." },
          { prop: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "ScrollBar: add a horizontal one for sideways content. A vertical bar is included." },
          { prop: "children", type: "ReactNode", description: "Content to scroll. It renders inside the viewport." },
        ]}
      />
    </Examples>
  )
}
