"use client"

import * as React from "react"
import { CheckIcon, CircleCheckIcon, GitBranchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Deployment status                                                          */
/* -------------------------------------------------------------------------- */

export type DeploymentStatus = "ready" | "preview" | "building" | "failed"

const statusStyles: Record<DeploymentStatus, { label: string; className: string; pulse?: boolean }> = {
  ready: { label: "Ready", className: "bg-success-subtle text-success" },
  preview: { label: "Preview", className: "bg-brand-subtle text-brand-subtle-foreground" },
  building: { label: "Building", className: "bg-warning-subtle text-warning", pulse: true },
  failed: { label: "Failed", className: "bg-destructive-subtle text-destructive" },
}

/** Status badge for a deployment row. Colour comes from the status tokens. */
export function DeploymentStatusBadge({ status }: { status: DeploymentStatus }) {
  const s = statusStyles[status]
  return (
    <Badge variant="secondary" data-status={status} className={cn("gap-1.5", s.className)}>
      <span aria-hidden="true" className={s.pulse ? "size-1.5 animate-pulse rounded-full bg-current" : "size-1.5 rounded-full bg-current"} />
      {s.label}
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* Deployments card                                                           */
/* -------------------------------------------------------------------------- */

export interface Deployment {
  sha: string
  branch: string
  status: DeploymentStatus
  /** Build time or an ellipsis while building. */
  time: string
}

const defaultDeployments: Deployment[] = [
  { sha: "a41c9e2", branch: "main", status: "ready", time: "12s" },
  { sha: "7f02b1d", branch: "feat/billing", status: "preview", time: "18s" },
  { sha: "c3e88a0", branch: "fix/auth-redirect", status: "building", time: "…" },
]

export function DeploymentsCard({
  project = "acme/web",
  deployments = defaultDeployments,
  className,
}: {
  project?: string
  deployments?: Deployment[]
  className?: string
}) {
  return (
    <Card className={cn("@container/deploys gap-0 p-0", className)}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <p className="text-label font-bold text-foreground">Deployments</p>
        <span className="truncate font-mono text-caption text-muted-foreground">{project}</span>
      </div>
      <ul className="divide-y border-t">
        {deployments.map((d) => (
          <li
            key={d.sha}
            className="grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 @min-[22rem]/deploys:grid-cols-[4.25rem_minmax(0,1fr)_auto_2rem]"
          >
            <span className="font-mono text-caption text-foreground">{d.sha}</span>
            <span className="flex min-w-0 items-center gap-1.5 text-caption text-muted-foreground">
              <GitBranchIcon aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{d.branch}</span>
            </span>
            <DeploymentStatusBadge status={d.status} />
            <span className="hidden text-right text-caption text-muted-foreground tabular @min-[22rem]/deploys:block">
              {d.time}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Requests card                                                              */
/* -------------------------------------------------------------------------- */

/** Hourly requests, [served from the edge, served by origin], as a share of the busiest hour. */
const defaultBars: [number, number][] = [
  [26, 10], [32, 12], [29, 11], [41, 14], [38, 12], [49, 15],
  [44, 13], [56, 16], [52, 14], [63, 17], [60, 15], [72, 19],
]

export function RequestsCard({
  value = "2.4M",
  unit = "/ day",
  change = "+18%",
  bars = defaultBars,
  className,
}: {
  value?: string
  unit?: string
  change?: string
  bars?: [number, number][]
  className?: string
}) {
  return (
    <Card className={cn("gap-0 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-label font-bold text-foreground">Requests</p>
        <span className="text-caption font-semibold text-success tabular">{change}</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-foreground tabular">{value}</span>
        <span className="text-caption text-muted-foreground">{unit}</span>
      </p>
      <div
        role="img"
        aria-label={`Requests over the last ${bars.length} hours, rising steadily. Most are served from the edge.`}
        className="mt-4 flex h-20 items-end gap-1"
      >
        {bars.map(([edge, origin], i) => (
          <div
            key={i}
            className="flex flex-1 flex-col gap-px overflow-hidden rounded-t-xs"
            style={{ height: `${Math.min(100, edge + origin)}%` }}
          >
            <div className="bg-foreground/20" style={{ flexGrow: origin }} />
            <div className="bg-foreground" style={{ flexGrow: edge }} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-foreground" />
          Edge cache
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-foreground/20" />
          Origin
        </span>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Deployed card (dark)                                                       */
/* -------------------------------------------------------------------------- */

const defaultChecks = ["Built in 14.2s", "2 replicas healthy", "Traffic shifted to 100%"]

export function DeployedCard({
  title = "Deployed to production",
  url = "web.acme.dev",
  time = "31s",
  checks = defaultChecks,
  className,
}: {
  title?: string
  url?: string
  time?: string
  checks?: string[]
  className?: string
}) {
  return (
    <Card className={cn("justify-between gap-5 border-panel-border bg-panel p-4 text-panel-foreground", className)}>
      <div className="flex items-center justify-between gap-3">
        <CircleCheckIcon aria-hidden="true" className="size-5 text-panel-success" />
        <span className="font-mono text-caption text-panel-muted tabular">{time}</span>
      </div>
      <div className="grid gap-3">
        <div>
          <p className="text-title text-panel-foreground">{title}</p>
          <p className="truncate font-mono text-caption text-panel-muted">{url}</p>
        </div>
        <ul className="grid gap-1.5 border-t border-panel-border pt-3">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2 text-caption text-panel-muted">
              <CheckIcon aria-hidden="true" className="size-3.5 shrink-0 text-panel-success" />
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
 * The product moment beside the hero copy: deployments, requests and a dark
 * "Deployed to production" card, flat and bordered on a tinted stage.
 * It lays itself out from its own width, so it works beside copy or full width.
 */
export function HeroProductMoment({ stage = true, className }: HeroProductMomentProps) {
  return (
    // The root is the container, so the stage padding can follow it too.
    <div data-slot="hero-product-moment" className={cn("@container/moment", className)}>
      <div className={cn(stage && "rounded-(--panel-radius) border bg-subtle p-3 @min-[30rem]/moment:p-4")}>
        {/* Two-up from 24rem, so the moment stays short beside the hero copy just past its 60rem split. */}
        <div className="grid gap-3 @min-[24rem]/moment:grid-cols-2 @narrow/moment:grid-cols-[1.45fr_1fr_1fr]">
          <DeploymentsCard className="@min-[24rem]/moment:col-span-2 @narrow/moment:col-span-1" />
          <RequestsCard />
          <DeployedCard />
        </div>
      </div>
    </div>
  )
}
