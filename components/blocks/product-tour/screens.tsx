import * as React from "react"
import { CalendarIcon, MessageSquareIcon } from "lucide-react"

import { personTone } from "@/components/blocks/members-list/people"
import { BrandMark } from "@/components/blocks/wordmark"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/* Acme product screens built from components and tokens: a timeline, a task
   and a board from the Website relaunch project, and a report across the
   Acme Inc. workspace. The product tour shows one per step, and the features
   page reuses them. Each screen lays itself out from the width of the
   ScreenFrame around it. They are illustrations, so whatever holds them
   names them for assistive technology and keeps them out of the tab order. */

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

export type TaskPriority = "urgent" | "high" | "medium" | "low"

const priorityStyles: Record<TaskPriority, { label: string; variant: "destructive" | "warning" | "secondary" | "outline" }> = {
  urgent: { label: "Urgent", variant: "destructive" },
  high: { label: "High", variant: "warning" },
  medium: { label: "Medium", variant: "secondary" },
  low: { label: "Low", variant: "outline" },
}

/** A task priority as a small badge: Urgent, High, Medium or Low. */
export function PriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  const p = priorityStyles[priority]
  return (
    <Badge variant={p.variant} data-priority={priority} className={className}>
      {p.label}
    </Badge>
  )
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

/** A small avatar with initials, for an assignee. */
export function PersonAvatar({ name, size = "sm", className }: { name: string; size?: "sm" | "default"; className?: string }) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback tone={personTone(name)}>{initialsOf(name)}</AvatarFallback>
    </Avatar>
  )
}

export interface ScreenFrameProps {
  /** Project or page name in the title bar. */
  title?: string
  /** The view on screen, such as "Timeline", shown on the right of the bar. */
  view?: string
  children?: React.ReactNode
  className?: string
}

/**
 * A light app window for product screens: the Acme mark, the page name and
 * the current view in a bar, then the screen. It is the container the
 * screens read their layout from.
 */
export function ScreenFrame({ title = "Website relaunch", view, children, className }: ScreenFrameProps) {
  return (
    <div
      data-slot="screen-frame"
      className={cn(
        "@container/screen flex min-w-0 flex-col overflow-hidden rounded-(--card-radius) border bg-card text-left text-card-foreground",
        className
      )}
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b px-4">
        <BrandMark className="size-5" />
        <p className="min-w-0 flex-1 truncate text-label text-foreground">{title}</p>
        {view ? <span className="shrink-0 text-caption text-muted-foreground">{view}</span> : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

export interface TimelineItem {
  title: string
  /** Start and end, in weeks from the first column. */
  start: number
  end: number
  state: "done" | "active" | "planned"
  /** Draw a diamond at start instead of a bar. */
  milestone?: boolean
}

/** Seven weeks from Sep 28, so the Nov 14 launch sits inside the last column. */
const defaultWeeks = ["Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2", "Nov 9"]

/* Positions are weeks from Sep 28: 1.57 is Oct 9, today in the sample data,
   and 6.71 is the Nov 14 launch. Done dates match the app mockup. */
const defaultTimeline: TimelineItem[] = [
  { title: "Customer interviews", start: 0, end: 1.3, state: "done" },
  { title: "Sitemap", start: 0.6, end: 1.55, state: "done" },
  { title: "Visual design", start: 1.2, end: 3.55, state: "active" },
  { title: "Homepage copy", start: 1.4, end: 3.85, state: "active" },
  { title: "Build pages", start: 3.4, end: 5.15, state: "planned" },
  { title: "Review and QA", start: 5.15, end: 6.55, state: "planned" },
  { title: "Launch", start: 6.71, end: 6.71, state: "planned", milestone: true },
]

const barFill: Record<TimelineItem["state"], string> = {
  done: "bg-foreground/20",
  active: "bg-foreground",
  planned: "border border-foreground/25 bg-background",
}

/**
 * Plan: the project's tasks as bars across the weeks, with an accent line for
 * today. Week labels thin out in a narrow frame so they never collide, and
 * the rows share out any spare height so the chart fills a tall window.
 */
export function TimelineScreen({
  weeks = defaultWeeks,
  items = defaultTimeline,
  today = 1.57,
  className,
}: {
  weeks?: string[]
  items?: TimelineItem[]
  /** Position of today, in weeks from the first column. */
  today?: number
  className?: string
}) {
  const span = Math.max(weeks.length, 1)
  const pct = (weeks: number) => `${(weeks / span) * 100}%`
  const row = "grid grid-cols-[7rem_minmax(0,1fr)] gap-3 @min-[28rem]/screen:grid-cols-[9rem_minmax(0,1fr)]"
  // In a narrow frame only some labels show; the columns stay put. Up to five
  // weeks keep every other label, more keep every third until the frame is wide.
  const hidden = (i: number) =>
    span > 5
      ? i % 3 !== 0 && "invisible @min-[36rem]/screen:visible"
      : i % 2 === 1 && "invisible @min-[30rem]/screen:visible"

  return (
    <div className={cn("flex flex-1 flex-col p-4 @min-[30rem]/screen:p-5", className)}>
      <div className={cn(row, "border-b pb-2.5")}>
        <span className="text-caption font-semibold text-muted-foreground">Task</span>
        <div className="grid text-caption text-muted-foreground tabular" style={{ gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))` }}>
          {weeks.map((week, i) => (
            <span key={week} className={cn("whitespace-nowrap", hidden(i))}>
              {week}
            </span>
          ))}
        </div>
      </div>
      <ul className="grid flex-1 auto-rows-[minmax(2.75rem,1fr)]">
        {items.map((item) => (
          <li key={item.title} className={cn(row, "items-center")}>
            <span
              className={cn(
                "truncate text-caption @min-[28rem]/screen:text-sm",
                item.state === "done" ? "text-muted-foreground" : "font-medium text-foreground"
              )}
            >
              {item.title}
            </span>
            <span className="relative block h-full">
              {weeks.slice(1).map((week, i) => (
                <span key={week} className="absolute inset-y-0 w-px bg-border" style={{ left: pct(i + 1) }} />
              ))}
              <span className="absolute inset-y-0 z-1 w-0.5 -translate-x-1/2 bg-brand" style={{ left: pct(today) }} />
              {item.milestone ? (
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground"
                  style={{ left: pct(item.start) }}
                />
              ) : (
                <span
                  className={cn("absolute top-1/2 h-4 -translate-y-1/2 rounded-full", barFill[item.state])}
                  style={{ left: pct(item.start), width: pct(item.end - item.start) }}
                />
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-foreground" />
          In progress
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-foreground/20" />
          Done
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-0.5 bg-brand" />
          Today
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Task                                                                       */
/* -------------------------------------------------------------------------- */

const defaultSubtasks = [
  { title: "Draft the hero and feature sections", done: true },
  { title: "Review tone with Sofia", done: true },
  { title: "Final edit and sign-off", done: false },
]

/**
 * Assign: one task with its owner, due date, priority, subtasks and the
 * latest comment.
 */
export function TaskScreen({ className }: { className?: string }) {
  const done = defaultSubtasks.filter((s) => s.done).length
  return (
    <div className={cn("flex flex-1 flex-col gap-5 p-4 @min-[30rem]/screen:p-5", className)}>
      <div className="grid gap-1">
        <p className="text-caption text-muted-foreground">Website relaunch · Content</p>
        <p className="text-h4 text-foreground">Write homepage copy</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 @min-[34rem]/screen:grid-cols-4">
        <div className="grid min-w-0 gap-1.5">
          <dt className="text-caption text-muted-foreground">Assignee</dt>
          <dd className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            <PersonAvatar name="Priya Raman" />
            <span className="truncate">Priya Raman</span>
          </dd>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <dt className="text-caption text-muted-foreground">Due date</dt>
          <dd className="flex h-(--avatar-size-sm) items-center gap-2 text-sm font-medium text-foreground tabular">
            <CalendarIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            Oct 24
          </dd>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <dt className="text-caption text-muted-foreground">Priority</dt>
          <dd className="flex h-(--avatar-size-sm) items-center">
            <PriorityBadge priority="high" />
          </dd>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <dt className="text-caption text-muted-foreground">Status</dt>
          <dd className="flex h-(--avatar-size-sm) items-center gap-2 text-sm font-medium text-foreground">
            <span className="size-2 rounded-full bg-foreground" />
            In progress
          </dd>
        </div>
      </dl>

      <div className="grid gap-3 border-t pt-4">
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-label text-foreground">Subtasks</span>
          <span className="text-caption text-muted-foreground tabular">
            {done} of {defaultSubtasks.length}
          </span>
        </p>
        <ul className="grid gap-2.5">
          {defaultSubtasks.map((subtask) => (
            <li key={subtask.title} className="flex items-center gap-3 text-sm">
              <Checkbox defaultChecked={subtask.done} tabIndex={-1} />
              <span className={subtask.done ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground"}>
                {subtask.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex items-start gap-3 border-t pt-4">
        <PersonAvatar name="Jordan Lee" />
        <p className="min-w-0 text-sm text-copy">
          <span className="font-semibold text-foreground">Jordan Lee</span> The page templates are ready for copy on
          Thursday.
        </p>
        <MessageSquareIcon aria-hidden="true" className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Board                                                                      */
/* -------------------------------------------------------------------------- */

export interface BoardCard {
  title: string
  assignee: string
  priority: TaskPriority
  due?: string
}

export interface BoardColumn {
  title: string
  /** Total in the column, which can be more than the cards shown. */
  count: number
  cards: BoardCard[]
}

const defaultColumns: BoardColumn[] = [
  {
    title: "To do",
    count: 10,
    cards: [
      { title: "Pricing page copy", assignee: "Priya Raman", priority: "medium", due: "Oct 28" },
      { title: "Redirect old blog links", assignee: "Jordan Lee", priority: "low", due: "Oct 30" },
    ],
  },
  {
    title: "In progress",
    count: 4,
    cards: [
      { title: "Write homepage copy", assignee: "Priya Raman", priority: "high", due: "Oct 24" },
      { title: "Visual design", assignee: "Sofia Alvarez", priority: "urgent", due: "Oct 22" },
    ],
  },
  {
    title: "Done",
    count: 38,
    cards: [
      { title: "Sitemap", assignee: "Maya Patel", priority: "high" },
      { title: "Customer interviews", assignee: "Sam Okafor", priority: "low" },
    ],
  },
]

/**
 * Track: the project as a board. Three columns with room; in a narrow frame
 * the first column steps aside so the cards keep a readable width.
 */
export function BoardScreen({ columns = defaultColumns, className }: { columns?: BoardColumn[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid flex-1 grid-cols-2 gap-3 bg-subtle p-3 @min-[34rem]/screen:grid-cols-3 @min-[34rem]/screen:p-4",
        className
      )}
    >
      {columns.map((column, i) => (
        <div key={column.title} className={cn("flex min-w-0 flex-col gap-2.5", i === 0 && columns.length > 2 && "hidden @min-[34rem]/screen:flex")}>
          <p className="flex items-center justify-between gap-2 px-1 pt-1">
            <span className="truncate text-label text-foreground">{column.title}</span>
            <span className="text-caption text-muted-foreground tabular">{column.count}</span>
          </p>
          {column.cards.map((card) => (
            <div key={card.title} className="grid gap-3 rounded-md border bg-card p-3">
              <p className="text-sm font-semibold text-foreground">{card.title}</p>
              <div className="flex items-center justify-between gap-2">
                <PriorityBadge priority={card.priority} />
                <span className="flex min-w-0 items-center gap-2">
                  {card.due ? (
                    <span className="hidden truncate text-caption text-muted-foreground tabular @min-[40rem]/screen:inline">
                      {card.due}
                    </span>
                  ) : null}
                  <PersonAvatar name={card.assignee} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Report                                                                     */
/* -------------------------------------------------------------------------- */

export interface ReportFigure {
  label: string
  value: string
  change: string
  /** Colours the change: good news in success, bad in destructive. */
  trend?: "good" | "bad"
}

const defaultFigures: ReportFigure[] = [
  { label: "Tasks completed", value: "1,284", change: "+12%", trend: "good" },
  { label: "On-time delivery", value: "92%", change: "+4 pts", trend: "good" },
  { label: "Cycle time", value: "3.4 days", change: "−0.6", trend: "good" },
]

/**
 * Tasks completed per day in Acme Inc., Sep 10 to Oct 9, as [this period,
 * previous period], the same days as the dashboard chart (ChartCard). They
 * add up to 1,284 and 1,146, 12% apart. Weekends are quiet.
 */
const defaultDaily: [number, number][] = [
  [42, 46], [50, 42], [29, 24], [29, 28], [48, 41], [49, 46], [51, 44], [44, 43], [47, 42], [28, 23],
  [30, 27], [51, 39], [46, 44], [49, 41], [46, 44], [49, 41], [27, 25], [29, 23], [45, 47], [49, 40],
  [44, 39], [52, 46], [51, 46], [31, 25], [27, 24], [44, 44], [51, 42], [49, 42], [49, 40], [48, 48],
]

export interface ReportScreenProps {
  /** What the report covers, such as "All projects" or a sprint. */
  scope?: string
  /** The period of the figures and what their changes compare against. */
  period?: string
  figures?: ReportFigure[]
  /** Title over the chart. */
  chart?: string
  /** One pair per bar, oldest first: [this period, previous period]. Heights scale to the largest value. */
  bars?: [number, number][]
  /** Legend for the bars (this period) and the dashed line (previous period). */
  legend?: [string, string]
  /** Labels under the first and the last bar. */
  range?: [string, string]
  className?: string
}

/**
 * Report: three headline figures for the period, then tasks completed per
 * day as bars, with the previous period as a dashed line over them.
 */
export function ReportScreen({
  scope = "All projects",
  period = "Last 30 days vs the 30 before",
  figures = defaultFigures,
  chart = "Tasks completed per day",
  bars = defaultDaily,
  legend = ["This period", "Previous period"],
  range = ["Sep 10", "Oct 9"],
  className,
}: ReportScreenProps) {
  const max = Math.max(1, ...bars.flat())
  const height = (value: number) => (value / max) * 100
  const previous = bars
    .map(([, value], i) => `${((i + 0.5) / bars.length) * 100},${100 - height(value)}`)
    .join(" ")

  return (
    <div className={cn("flex flex-1 flex-col gap-5 p-4 @min-[30rem]/screen:p-5", className)}>
      <div className="grid gap-2.5">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-label text-foreground">{scope}</span>
          <span className="text-caption text-muted-foreground">{period}</span>
        </p>
        <dl className="grid grid-cols-3 divide-x rounded-md border">
          {figures.map((figure) => (
            <div key={figure.label} className="grid min-w-0 content-start gap-1 p-3 @min-[30rem]/screen:p-4">
              <dt className="text-caption text-muted-foreground">{figure.label}</dt>
              <dd className="text-lg font-extrabold tracking-tight text-foreground tabular @min-[34rem]/screen:text-2xl">
                {figure.value}
              </dd>
              <dd
                className={cn(
                  "text-caption font-semibold tabular",
                  figure.trend === "bad" ? "text-destructive" : "text-success"
                )}
              >
                {figure.change}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid flex-1 content-end gap-3">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-label text-foreground">{chart}</span>
          <span className="flex gap-3 text-caption text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-foreground" />
              {legend[0]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 border-t-(length:--border-width-strong) border-dashed border-muted-foreground" />
              {legend[1]}
            </span>
          </span>
        </p>
        <div className="relative h-36 border-b">
          <div className="absolute inset-0 flex items-end gap-0.5 @min-[34rem]/screen:gap-1">
            {bars.map(([current], i) => (
              <span key={i} className="flex-1 rounded-t-xs bg-foreground" style={{ height: `${height(current)}%` }} />
            ))}
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible fill-none stroke-muted-foreground"
          >
            {/* A card-coloured halo keeps the dashed line readable where it crosses the bars. */}
            <polyline
              points={previous}
              className="stroke-card"
              strokeWidth={4}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={previous}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <p className="flex justify-between text-caption text-muted-foreground tabular">
          <span>{range[0]}</span>
          <span>{range[1]}</span>
        </p>
      </div>
    </div>
  )
}
