"use client"

import * as React from "react"
import { CheckIcon, ZapIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { personTone } from "@/components/blocks/members-list/people"

/* -------------------------------------------------------------------------- */
/* Status badge                                                               */
/* -------------------------------------------------------------------------- */

/** Project status. On track, at risk and off track carry the status colours; completed and paused stay neutral. */
export type MomentStatus = "on-track" | "at-risk" | "off-track" | "completed" | "paused"

const statusStyles: Record<
  MomentStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  "on-track": { label: "On track", variant: "success" },
  "at-risk": { label: "At risk", variant: "warning" },
  "off-track": { label: "Off track", variant: "destructive" },
  completed: { label: "Completed", variant: "secondary" },
  paused: { label: "Paused", variant: "secondary" },
}

/** Status badge for a project row. Colour comes from the status tokens. */
export function MomentStatusBadge({ status }: { status: MomentStatus }) {
  const s = statusStyles[status]
  return (
    <Badge variant={s.variant} data-status={status}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {s.label}
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* List card                                                                  */
/* -------------------------------------------------------------------------- */

export interface MomentListItem {
  /** Project name. */
  name: string
  /** Project owner, shown as initials. */
  owner: string
  /** Share of tasks done, from 0 to 100. */
  progress: number
  status: MomentStatus
}

const defaultItems: MomentListItem[] = [
  { name: "Website relaunch", owner: "Priya Raman", progress: 73, status: "on-track" },
  { name: "Mobile app 2.0", owner: "Jordan Lee", progress: 52, status: "at-risk" },
  { name: "Q4 planning", owner: "Lucas Moreau", progress: 70, status: "on-track" },
]

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

/** Projects with their owner, progress and status. Progress shows from 22rem. */
export function MomentListCard({
  title = "Projects",
  meta = "Acme Inc.",
  items = defaultItems,
  className,
}: {
  /** Card title. */
  title?: string
  /** Small text on the right of the title, such as the workspace. */
  meta?: string
  items?: MomentListItem[]
  className?: string
}) {
  return (
    <Card className={cn("@container/list gap-0 p-0", className)}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <p className="text-label font-bold text-foreground">{title}</p>
        <span className="truncate text-caption text-muted-foreground">{meta}</span>
      </div>
      <ul className="divide-y border-t">
        {items.map((item) => (
          <li
            key={item.name}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 @min-[22rem]/list:grid-cols-[minmax(0,1fr)_5.5rem_auto]"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback tone={personTone(item.owner)}>{initialsOf(item.owner)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-semibold text-foreground">{item.name}</span>
            </span>
            <span className="hidden items-center gap-2 @min-[22rem]/list:flex">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-foreground" style={{ width: `${item.progress}%` }} />
              </span>
              <span className="w-8 text-right text-caption text-muted-foreground tabular">{item.progress}%</span>
            </span>
            <MomentStatusBadge status={item.status} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Trend card                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Tasks completed each day for the last 30 days, Sep 10 to Oct 9, as [on
 * time, late]. The daily totals are the dashboard chart's (ChartCard): they
 * add up to 1,284, 92% of them on time. Weekends are quiet.
 */
const defaultBars: [number, number][] = [
  [39, 3], [46, 4], [27, 2], [27, 2], [44, 4], [45, 4], [47, 4], [40, 4], [43, 4], [26, 2],
  [28, 2], [47, 4], [42, 4], [45, 4], [42, 4], [45, 4], [25, 2], [27, 2], [41, 4], [45, 4],
  [40, 4], [49, 3], [47, 4], [29, 2], [25, 2], [40, 4], [47, 4], [44, 5], [45, 4], [44, 4],
]

/** A headline figure over daily bars, split into on time and late. */
export function MomentTrendCard({
  title = "Tasks completed",
  value = "1,284",
  unit = "this month",
  change = "+12%",
  bars = defaultBars,
  className,
}: {
  title?: string
  value?: string
  unit?: string
  change?: string
  /** One bar per day, oldest first: [finished on time, finished late]. Heights scale to the busiest day. */
  bars?: [number, number][]
  className?: string
}) {
  const busiest = Math.max(1, ...bars.map(([onTime, late]) => onTime + late))
  return (
    <Card className={cn("gap-0 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-label font-bold text-foreground">{title}</p>
        <span className="text-caption font-semibold text-success tabular">{change}</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-foreground tabular">{value}</span>
        <span className="text-caption text-muted-foreground">{unit}</span>
      </p>
      <div
        role="img"
        aria-label={`${title} each day for the last ${bars.length} days, quieter at weekends. Most finish on time.`}
        className="mt-4 flex h-20 items-end gap-px"
      >
        {bars.map(([onTime, late], i) => (
          <div
            key={i}
            className="flex flex-1 flex-col overflow-hidden rounded-t-xs"
            style={{ height: `${((onTime + late) / busiest) * 100}%` }}
          >
            <div className="bg-foreground/20" style={{ flexGrow: late }} />
            <div className="bg-foreground" style={{ flexGrow: onTime }} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-foreground" />
          On time
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-foreground/20" />
          Late
        </span>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Highlight card (dark)                                                      */
/* -------------------------------------------------------------------------- */

const defaultChecks = ["Notified Maya Patel", "Posted in #website-relaunch on Slack"]

/** A dark card for one moment of emphasis, such as an automation that just ran. */
export function MomentHighlightCard({
  title = "Automation ran",
  detail = "Sitemap moved to Done",
  time = "Just now",
  checks = defaultChecks,
  className,
}: {
  title?: string
  /** One line under the title, such as what set the rule off. */
  detail?: string
  /** When it happened. */
  time?: string
  checks?: string[]
  className?: string
}) {
  return (
    <Card className={cn("justify-between gap-5 border-panel-border bg-panel p-4 text-panel-foreground", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-7 place-items-center rounded-sm bg-panel-raised">
          <ZapIcon aria-hidden="true" className="size-4 text-panel-foreground" />
        </span>
        <span className="text-caption text-panel-muted">{time}</span>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <p className="text-title text-panel-foreground">{title}</p>
          <p className="text-caption text-panel-muted">{detail}</p>
        </div>
        <ul className="grid gap-1.5 border-t border-panel-border pt-3">
          {checks.map((c) => (
            <li key={c} className="flex items-start gap-2 text-caption text-panel-muted">
              <CheckIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-panel-success" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Composition                                                                */
/* -------------------------------------------------------------------------- */

export interface HeroProductMomentProps {
  /** Set to false to drop the tinted stage behind the cards. */
  stage?: boolean
  className?: string
}

/**
 * The product moment beside the hero copy: projects with their status,
 * tasks completed each week and a dark card for an automation that just ran,
 * flat and bordered on a tinted stage. It lays itself out from its own
 * width, so it works beside copy or full width.
 */
export function HeroProductMoment({ stage = true, className }: HeroProductMomentProps) {
  return (
    // The root is the container, so the stage padding can follow it too.
    <div data-slot="hero-product-moment" className={cn("@container/moment", className)}>
      <div className={cn(stage && "rounded-(--panel-radius) border bg-subtle p-3 @min-[30rem]/moment:p-4")}>
        {/* Two-up from 24rem, so the moment stays short beside the hero copy just past its 60rem split. */}
        <div className="grid gap-3 @min-[24rem]/moment:grid-cols-2 @narrow/moment:grid-cols-[1.45fr_1fr_1fr]">
          <MomentListCard className="@min-[24rem]/moment:col-span-2 @narrow/moment:col-span-1" />
          <MomentTrendCard />
          <MomentHighlightCard />
        </div>
      </div>
    </div>
  )
}
