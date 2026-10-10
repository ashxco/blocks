import { BellIcon, CheckIcon, MinusIcon, ZapIcon } from "lucide-react"

import { MomentStatusBadge } from "@/components/blocks/hero"
import { PersonAvatar, PriorityBadge } from "@/components/blocks/product-tour/screens"
import { cn } from "@/lib/utils"

/* Small product cards laid over the product screen in each feature row.
   They are illustrations: the row's heading and copy carry the meaning, so
   each card is hidden from assistive technology by the row. */

const card = "@container/card w-full max-w-96 overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground"
const cardHeader = "flex items-center justify-between gap-3 border-b px-4 py-3"

/* -------------------------------------------------------------------------- */
/* Status card                                                                */
/* -------------------------------------------------------------------------- */

const owners = ["Maya Patel", "Priya Raman", "Sofia Alvarez", "Jordan Lee"]

/** A project's status: progress, launch date and the people on it. */
export function StatusCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="truncate text-label text-foreground">Website relaunch</p>
        <MomentStatusBadge status="on-track" />
      </div>
      <div className="grid grid-cols-1 gap-3 p-4">
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-3xl font-extrabold text-foreground tabular">73%</span>
          <span className="text-caption text-muted-foreground tabular">38 of 52 tasks done</span>
        </p>
        <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <span className="block h-full w-[73%] rounded-full bg-foreground" />
        </span>
        <p className="flex items-center justify-between gap-3 text-caption text-muted-foreground">
          <span className="truncate">Launches Nov 14</span>
          <span className="flex shrink-0 gap-1">
            {owners.map((name) => (
              <PersonAvatar key={name} name={name} />
            ))}
          </span>
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Trend card                                                                 */
/* -------------------------------------------------------------------------- */

/** Average cycle time per week over the last 20 weeks, as a share of the chart height. */
const cycleTime = [82, 78, 85, 80, 76, 88, 74, 72, 70, 73, 68, 66, 69, 64, 62, 65, 60, 58, 61, 56]

/** Cycle time week by week, with this week in ink, and a weekly summary. */
export function TrendCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="text-label text-foreground">Cycle time</p>
        <span className="text-caption text-muted-foreground">Last 20 weeks</span>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4">
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-3xl font-extrabold text-foreground tabular">3.4 days</span>
          <span className="text-caption font-semibold text-success tabular">−0.6 this month</span>
        </p>
        <div className="flex h-16 items-end gap-1">
          {cycleTime.map((value, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-t-xs",
                i === cycleTime.length - 1 ? "bg-foreground" : "bg-foreground/15"
              )}
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <p className="flex items-start gap-2 border-t pt-3 text-caption text-muted-foreground">
          <BellIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-foreground" />
          <span className="min-w-0">Summary to #leadership on Slack every Monday</span>
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Run history                                                                */
/* -------------------------------------------------------------------------- */

/* The latest runs of "Tell owners when work is done", the Website relaunch
   rule on the screen above. It notifies only when a task is High or Urgent.
   Sitemap and Customer interviews are the two tasks finished most recently,
   as in the app mockup. */
const runs = [
  { task: "Sitemap", result: "Notified Maya Patel", when: "2m" },
  { task: "Customer interviews", result: "Skipped: priority is Low", when: "2d", skipped: true },
  { task: "Competitor review", result: "Notified Priya Raman", when: "5d" },
]

/** The rule's latest runs: the task that set it off, what it did and when. */
export function RunHistoryCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="inline-flex items-center gap-2 text-label text-foreground">
          <span className="grid size-(--avatar-size-sm) shrink-0 place-items-center rounded-full bg-muted text-foreground">
            <ZapIcon aria-hidden="true" className="size-3.5" />
          </span>
          Run history
        </p>
        <span className="text-caption text-muted-foreground tabular">12 runs</span>
      </div>
      <ul className="divide-y">
        {runs.map((run) => (
          <li key={run.task} className="flex items-center gap-3 px-4 py-3">
            {run.skipped ? (
              <MinusIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" />
            )}
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="truncate text-sm font-semibold text-foreground">{run.task}</span>
              <span className="truncate text-caption text-muted-foreground">{run.result}</span>
            </span>
            <span className="shrink-0 self-start text-caption text-muted-foreground tabular">{run.when}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Details card                                                               */
/* -------------------------------------------------------------------------- */

const taskDetails = [
  { label: "Assignee", value: "Priya Raman" },
  { label: "Due date", value: "Oct 24" },
  { label: "Project", value: "Website relaunch" },
]

/** One task's details: owner, due date, project and subtask progress. */
export function DetailsCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="min-w-0 truncate text-label text-foreground">Write homepage copy</p>
        <PriorityBadge priority="high" />
      </div>
      <dl className="grid grid-cols-1 gap-3 p-4">
        {taskDetails.map((detail) => (
          <div key={detail.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-caption text-muted-foreground">{detail.label}</dt>
            <dd className="truncate text-right text-sm font-medium text-foreground">{detail.value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-t pt-3">
          <dt className="text-caption text-muted-foreground">Subtasks</dt>
          <dd className="text-right text-sm font-medium text-foreground tabular">2 of 3 done</dd>
          <dd className="col-span-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <span className={cn("block h-full w-2/3 rounded-full bg-foreground")} />
          </dd>
        </div>
      </dl>
    </div>
  )
}
