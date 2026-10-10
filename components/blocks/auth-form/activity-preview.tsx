"use client"

import * as React from "react"
import { CheckIcon, ZapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface PreviewTask {
  title: string
  /** Initials of the assignee. */
  assignee: string
  due: string
  priority?: "High" | "Urgent"
  /** Done before the preview starts. */
  done?: boolean
  /** Ticks off during the preview, after this many milliseconds. */
  doneAt?: number
}

/** Five tasks from Website relaunch, the project the dashboard opens on. */
const TASKS: PreviewTask[] = [
  { title: "Customer interviews", assignee: "SO", due: "Oct 7", done: true },
  { title: "Homepage hero copy", assignee: "SA", due: "Oct 10", doneAt: 1300 },
  { title: "Customer stories page", assignee: "PR", due: "Oct 15", doneAt: 2900 },
  { title: "Build page templates", assignee: "JL", due: "Nov 4", priority: "High" },
  { title: "Launch-day checklist", assignee: "MP", due: "Nov 13" },
]

const TOTAL = 52
/** Done before the two tasks above tick off: 38 of 52 afterwards, as on the projects page. */
const DONE_BEFORE = 36
/** When the automation reports, just after the first task is done. */
const AUTOMATION_AT = 1900
const AUTOMATION_NOTE = "Automation notified Priya: hero copy is done"

/**
 * A project in Acme on the dark panel: Website relaunch, with two tasks
 * ticking off one after the other, the progress bar filling and an
 * automation notifying the owner. Every row is laid out from the start, so
 * the card never changes height. Under reduced motion the finished state
 * shows straight away. Panel tokens only, so it reads the same in both
 * themes.
 */
export function ActivityPreview({ className }: { className?: string }) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const marks = [...TASKS.flatMap((task) => (task.doneAt ? [task.doneAt] : [])), AUTOMATION_AT]
    const finish = Math.max(...marks)
    if (reduce) {
      const timer = setTimeout(() => setElapsed(finish), 0)
      return () => clearTimeout(timer)
    }
    const timers = marks.map((at) => setTimeout(() => setElapsed((now) => Math.max(now, at)), at))
    return () => timers.forEach(clearTimeout)
  }, [])

  const isDone = (task: PreviewTask) => task.done || (task.doneAt !== undefined && elapsed >= task.doneAt)
  const done = DONE_BEFORE + TASKS.filter((task) => task.doneAt !== undefined && isDone(task)).length
  const notified = elapsed >= AUTOMATION_AT

  return (
    <div
      data-slot="activity-preview"
      className={cn(
        "@container/preview overflow-hidden rounded-(--card-radius) border border-panel-border bg-panel-raised text-panel-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-panel-border px-5 py-4">
        <div className="grid min-w-0 gap-0.5">
          <p className="truncate text-label text-panel-foreground">Website relaunch</p>
          <p className="truncate text-caption text-panel-muted">Marketing · Due Nov 14</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-panel-border px-2.5 py-1 text-caption font-semibold text-panel-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-panel-success" />
          On track
        </span>
      </div>

      <ul aria-label="Tasks this week" className="divide-y divide-panel-border">
        {TASKS.map((task) => {
          const complete = isDone(task)
          return (
            <li key={task.title} className="flex items-center gap-3 px-5 py-3">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors duration-(--duration-base) ease-out",
                  complete ? "border-transparent bg-panel-success text-panel" : "border-panel-muted/60"
                )}
              >
                <CheckIcon
                  strokeWidth={3}
                  className={cn(
                    "size-3 transition-opacity duration-(--duration-base) ease-out",
                    complete ? "opacity-100" : "opacity-0"
                  )}
                />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm transition-colors duration-(--duration-base) ease-out",
                  complete ? "text-panel-muted" : "text-panel-foreground"
                )}
              >
                {task.title}
                <span className="sr-only">{complete ? ", done" : ", open"}</span>
              </span>
              {task.priority && !complete ? (
                <span className="hidden shrink-0 text-caption font-semibold text-panel-warning @min-[22rem]/preview:inline">
                  {task.priority}
                </span>
              ) : null}
              <span className="hidden w-12 shrink-0 text-right text-caption text-panel-muted tabular @min-[20rem]/preview:inline">
                {task.due}
              </span>
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full border border-panel-border bg-panel text-xs font-bold text-panel-foreground"
              >
                {task.assignee}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="grid gap-3 border-t border-panel-border px-5 py-4">
        <div className="flex items-baseline justify-between gap-4 text-caption">
          <span className="font-semibold text-panel-foreground">Progress</span>
          <span className="text-panel-muted tabular">
            {done} of {TOTAL} tasks
          </span>
        </div>
        <div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-panel-foreground/10">
          <div
            className="h-full rounded-full bg-panel-foreground transition-[width] duration-(--duration-slow) ease-out"
            style={{ width: `${(done / TOTAL) * 100}%` }}
          />
        </div>
        {/* The line is always rendered, so its height is reserved before it fades in; the live region
            announces it once. Up to two lines, so a half-width panel never cuts it off. */}
        <p
          aria-hidden="true"
          className={cn(
            "flex min-w-0 items-start gap-2 text-caption text-panel-muted transition-opacity duration-(--duration-base) ease-out",
            notified ? "opacity-100" : "opacity-0"
          )}
        >
          <ZapIcon className="mt-0.5 size-3.5 shrink-0 text-panel-brand" />
          <span className="line-clamp-2 min-w-0">{AUTOMATION_NOTE}</span>
        </p>
        <p aria-live="polite" className="sr-only">
          {notified ? AUTOMATION_NOTE : null}
        </p>
      </div>
    </div>
  )
}
