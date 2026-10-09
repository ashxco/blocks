import { BellIcon, DatabaseIcon, GitBranchIcon, GlobeIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* Small product cards that sit over the terminal in each feature row. They
   are illustrations: the row's heading and copy carry the meaning, so each
   card is hidden from assistive technology by the row. */

const card = "w-full max-w-96 overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground"
const cardHeader = "flex items-center justify-between gap-3 border-b px-4 py-3"

/* -------------------------------------------------------------------------- */
/* Preview deploy                                                             */
/* -------------------------------------------------------------------------- */

export function PreviewCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="text-label text-foreground">Pull request #482</p>
        <Badge variant="success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          Ready
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-3 p-4">
        <p className="text-title text-foreground">Add annual billing</p>
        <p className="flex min-w-0 items-center gap-2 rounded-(--control-radius) border bg-subtle px-3 py-2 font-mono text-caption text-foreground">
          <GlobeIcon aria-hidden="true" className="size-3.5 shrink-0 text-success" />
          <span className="truncate">feat-billing.acme.dev</span>
        </p>
        <p className="flex items-center justify-between gap-3 text-caption text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <GitBranchIcon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate font-mono">feat/billing · 7f02b1d</span>
          </span>
          <span className="shrink-0 tabular">Built in 12.8s</span>
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Latency chart                                                              */
/* -------------------------------------------------------------------------- */

/** p95 latency per hour over the last day, as a share of the chart height. */
const latency = [62, 58, 64, 60, 71, 88, 66, 57, 54, 52, 49, 51, 47, 45, 48, 44, 42, 46, 41, 40]
const peak = latency.indexOf(Math.max(...latency))

export function LatencyCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="text-label text-foreground">p95 latency</p>
        <span className="font-mono text-caption text-muted-foreground">acme/api</span>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4">
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-3xl font-extrabold text-foreground tabular">112 ms</span>
          <span className="text-caption font-semibold text-success tabular">−18% this week</span>
        </p>
        <div className="flex h-16 items-end gap-1">
          {latency.map((value, i) => (
            <span
              key={i}
              className={
                i === peak
                  ? "flex-1 rounded-t-xs bg-warning"
                  : i === latency.length - 1
                    ? "flex-1 rounded-t-xs bg-chart-1"
                    : "flex-1 rounded-t-xs bg-chart-1/30"
              }
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <p className="flex items-center gap-2 border-t pt-3 text-caption text-muted-foreground">
          <BellIcon aria-hidden="true" className="size-3.5 shrink-0 text-foreground" />
          <span className="truncate">Alert when p95 is over 300 ms for 5 minutes</span>
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Audit log                                                                  */
/* -------------------------------------------------------------------------- */

const auditEvents = [
  { initials: "SK", tint: "bg-tint-mint", who: "Sam Kim", what: "rotated STRIPE_SECRET_KEY", when: "2m" },
  { initials: "AR", tint: "bg-tint-violet", who: "Ana Ruiz", what: "made Jo Okafor a developer", when: "1h" },
  { initials: "JO", tint: "bg-tint-sand", who: "Jo Okafor", what: "turned on SSO for Acme", when: "1d" },
]

export function AuditCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="inline-flex items-center gap-2 text-label text-foreground">
          <ShieldCheckIcon aria-hidden="true" className="size-4 text-success" />
          Audit log
        </p>
        <span className="font-mono text-caption text-muted-foreground">production</span>
      </div>
      <ul className="divide-y">
        {auditEvents.map((event) => (
          <li key={event.what} className="flex items-center gap-3 px-4 py-3">
            <span
              className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold text-foreground", event.tint)}
            >
              {event.initials}
            </span>
            <span className="min-w-0 flex-1 text-sm text-copy sm:truncate">
              <span className="font-semibold text-foreground">{event.who}</span> {event.what}
            </span>
            <span className="shrink-0 text-caption text-muted-foreground tabular">{event.when}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Database                                                                   */
/* -------------------------------------------------------------------------- */

const databaseDetails = [
  { label: "Engine", value: "Postgres 17" },
  { label: "Region", value: "fra-1, replica in iad-1" },
  { label: "Backups", value: "Nightly, kept 14 days" },
]

export function DatabaseCard() {
  return (
    <div className={card}>
      <div className={cardHeader}>
        <p className="inline-flex min-w-0 items-center gap-2 text-label text-foreground">
          <DatabaseIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate font-mono">orders</span>
        </p>
        <Badge variant="success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          Healthy
        </Badge>
      </div>
      <dl className="grid grid-cols-1 gap-3 p-4">
        {databaseDetails.map((detail) => (
          <div key={detail.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-caption text-muted-foreground">{detail.label}</dt>
            <dd className="truncate text-right text-sm font-medium text-foreground">{detail.value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-t pt-3">
          <dt className="text-caption text-muted-foreground">Storage</dt>
          <dd className="text-right text-sm font-medium text-foreground tabular">21 of 50 GB</dd>
          <dd className="col-span-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full w-2/5 rounded-full bg-foreground" />
          </dd>
        </div>
      </dl>
    </div>
  )
}
