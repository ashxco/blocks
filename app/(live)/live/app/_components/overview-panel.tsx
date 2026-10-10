import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { defaultProjects, formatDue, type ProjectStatus } from "@/components/blocks/data-table/data"

interface Fact {
  label: string
  value: string
  detail: string
}

const facts: Fact[] = [
  { label: "Due this week", value: "46 tasks", detail: "12 of them high priority" },
  { label: "Overdue", value: "7 tasks", detail: "Across 3 projects" },
  { label: "Completed today", value: "48 tasks", detail: "Most in Website relaunch" },
  { label: "Automation runs", value: "7,240", detail: "Of 10,000 this cycle" },
]

/**
 * The timeline: nine weeks around today, October 9, 2026. Each lane runs from
 * the project's start to its due date, filled as far as its tasks are done.
 */
const WINDOW_START = Date.UTC(2026, 8, 21)
const WINDOW_DAYS = 63
const TODAY = "2026-10-09"
const MONTHS = [
  { label: "Oct", date: "2026-10-01" },
  { label: "Nov", date: "2026-11-01" },
]

const lanes: { id: string; start: string }[] = [
  { id: "q4-planning", start: "2026-09-28" },
  { id: "customer-portal", start: "2026-08-25" },
  { id: "billing-migration", start: "2026-09-28" },
  { id: "website-relaunch", start: "2026-09-14" },
  { id: "mobile-app", start: "2026-09-01" },
]

/** Quiet lanes are plain ink, so only the projects that need attention carry colour. */
const statusStyle: Partial<Record<ProjectStatus, { label: string; dot: string; fill: string }>> = {
  "on-track": { label: "On track", dot: "bg-panel-foreground/40", fill: "bg-panel-foreground/70" },
  "at-risk": { label: "At risk", dot: "bg-panel-warning", fill: "bg-panel-warning" },
  "off-track": { label: "Off track", dot: "bg-panel-destructive", fill: "bg-panel-destructive" },
}

/** Position of a date across the window, from 0 to 100, clamped to its edges. */
function position(iso: string) {
  const days = (Date.parse(`${iso}T00:00:00Z`) - WINDOW_START) / 86_400_000
  return Math.min(100, Math.max(0, (days / WINDOW_DAYS) * 100))
}

const timeline = lanes.flatMap((lane) => {
  const project = defaultProjects.find((p) => p.id === lane.id)
  const style = project ? statusStyle[project.status] : undefined
  if (!project || !style) return []
  const left = position(lane.start)
  // The due date is the last day of work, so the lane ends at the end of that day.
  const right = Math.min(100, position(project.due) + 100 / WINDOW_DAYS)
  return [{ ...project, style, left, width: right - left, progress: Math.round((project.done / project.total) * 100) }]
})

const needsAttention = timeline.filter((lane) => lane.status !== "on-track").length

/** The start of each month in hairlines and today in violet, positioned across the window. */
function GuideLines() {
  return (
    <>
      {MONTHS.map((month) => (
        <span
          key={month.label}
          className="absolute inset-y-0 w-px bg-panel-border"
          style={{ left: `${position(month.date)}%` }}
        />
      ))}
      <span className="absolute inset-y-0 w-px bg-panel-brand" style={{ left: `${position(TODAY)}%` }} />
    </>
  )
}

/**
 * The dark emphasis panel at the top of the dashboard: which projects need
 * attention, four facts about this week, and a timeline of the projects due
 * around now, with today marked in violet.
 *
 * Status colours use the panel tokens (bg-panel-warning,
 * bg-panel-destructive), which read on the dark panel in both themes.
 */
export function OverviewPanel() {
  return (
    <section
      aria-labelledby="overview-title"
      className="@container/overview grid gap-8 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground"
    >
      <div className="flex flex-col gap-6 @min-[48rem]/overview:flex-row @min-[48rem]/overview:items-end @min-[48rem]/overview:justify-between @min-[48rem]/overview:gap-10">
        <div className="grid min-w-0 gap-3">
          <h2 id="overview-title" className="flex items-center gap-3 text-h3 text-panel-foreground">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-panel-warning" />
            {needsAttention} projects need attention
          </h2>
          <p className="max-w-prose text-body text-panel-muted">
            <span className="font-semibold text-panel-foreground">Customer portal</span> is off track for its Oct 23
            beta, and Mobile app 2.0 and Billing migration are at risk. The other 21 active projects are on track.
          </p>
        </div>
        {/* One action: the timeline is already below, and the projects page has the rest. */}
        <Button
          variant="inverse"
          nativeButton={false}
          render={<Link href="/live/app/projects" />}
          className="shrink-0 self-start @min-[48rem]/overview:self-auto"
        >
          Review projects
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-panel-border bg-panel-border @min-[56rem]/overview:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="grid content-start gap-2 bg-panel p-4 @min-[40rem]/overview:p-5">
            <dt className="text-caption text-panel-muted">{fact.label}</dt>
            <dd className="grid gap-1">
              <span className="text-h4 text-panel-foreground tabular">{fact.value}</span>
              <span className="text-caption text-panel-muted">{fact.detail}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-label text-panel-foreground">Due around now</h3>
          <ul aria-hidden="true" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-panel-muted">
            <li className="flex items-center gap-2">
              <span className="h-1 w-4 rounded-full bg-panel-foreground/70" />
              Done so far
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-px bg-panel-brand" />
              Today
            </li>
          </ul>
        </div>

        <div className="relative">
          {/* Month lines and today, across every lane, once names sit beside the lanes. Narrower, names sit
              above their lane, so each lane draws its own lines and none cross a name. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-[calc(10rem+--spacing(4))] hidden @min-[40rem]/overview:block"
          >
            <GuideLines />
          </div>

          <ul className="relative grid gap-4 @min-[40rem]/overview:gap-3">
            {timeline.map((lane) => (
              <li
                key={lane.id}
                className="grid gap-1.5 @min-[40rem]/overview:grid-cols-[10rem_minmax(0,1fr)] @min-[40rem]/overview:items-center @min-[40rem]/overview:gap-4"
              >
                <p className="flex min-w-0 items-center gap-2 text-caption">
                  <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", lane.style.dot)} />
                  <span className="truncate font-semibold text-panel-foreground">{lane.name}</span>
                  <span className="sr-only">
                    , {lane.style.label}, {lane.progress}% done, due {formatDue(lane.due)}
                  </span>
                </p>
                <div aria-hidden="true" className="relative h-6">
                  <div className="absolute inset-0 @min-[40rem]/overview:hidden">
                    <GuideLines />
                  </div>
                  <div
                    className="absolute inset-y-1.5 overflow-hidden rounded-full bg-panel-foreground/12"
                    style={{ left: `${lane.left}%`, width: `${lane.width}%` }}
                  >
                    <div className={cn("h-full rounded-full", lane.style.fill)} style={{ width: `${lane.progress}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden="true" className="relative h-4 text-caption text-panel-muted @min-[40rem]/overview:ml-[calc(10rem+--spacing(4))]">
          {MONTHS.map((month) => (
            <span key={month.label} className="absolute top-0 pl-1.5" style={{ left: `${position(month.date)}%` }}>
              {month.label}
            </span>
          ))}
          <span className="absolute top-0 pl-1.5 text-panel-brand" style={{ left: `${position(TODAY)}%` }}>
            Today
          </span>
        </div>
      </div>
    </section>
  )
}
