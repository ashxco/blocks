import Link from "next/link"
import { ArrowUpRightIcon, ScrollTextIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Fact {
  label: string
  value: string
  detail: string
  mono?: boolean
}

const facts: Fact[] = [
  { label: "Live deployment", value: "a41c9e2", detail: "Fix redirect loop on checkout, from main", mono: true },
  { label: "Build time", value: "28s", detail: "92% of the build cache reused" },
  { label: "Healthy regions", value: "3 of 3", detail: "Frankfurt, Virginia, Singapore" },
  { label: "Response time", value: "112 ms", detail: "p95 over the last hour" },
]

/** Days in the uptime strip, oldest first. Two days had a short slowdown. */
const UPTIME_DAYS = 90
const degradedDays = new Set([34, 72])

/**
 * The dark emphasis panel at the top of the dashboard: the state of
 * production, the deployment that is serving traffic, four facts about it and
 * a 90 day uptime strip.
 *
 * Status colours use the panel tokens (bg-panel-success, bg-panel-warning),
 * which read on the dark panel in both themes.
 */
export function ProductionPanel() {
  return (
    <section
      aria-labelledby="production-title"
      className="@container/production grid gap-8 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground"
    >
      <div className="flex flex-col gap-6 @min-[48rem]/production:flex-row @min-[48rem]/production:items-end @min-[48rem]/production:justify-between @min-[48rem]/production:gap-10">
        <div className="grid min-w-0 gap-3">
          <h2 id="production-title" className="flex items-center gap-3 text-h3 text-panel-foreground">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-panel-success" />
            Production is healthy
          </h2>
          <p className="max-w-prose text-body text-panel-muted">
            Maya Chen deployed <span className="font-semibold text-panel-foreground">web</span> to acme.dev two minutes
            ago. Every region passes its health checks and errors are inside your alert limits.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="inverse" nativeButton={false} render={<Link href="/live/app/projects" />}>
            Open deployment
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline-inverse" nativeButton={false} render={<Link href="/live/app/projects" />}>
            <ScrollTextIcon data-icon="inline-start" />
            View logs
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-panel-border bg-panel-border @min-[56rem]/production:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="grid content-start gap-2 bg-panel p-4 @min-[40rem]/production:p-5">
            <dt className="text-caption text-panel-muted">{fact.label}</dt>
            <dd className="grid gap-1">
              <span
                className={
                  fact.mono
                    ? "font-mono text-xl font-semibold text-panel-foreground"
                    : "text-h4 text-panel-foreground tabular"
                }
              >
                {fact.value}
              </span>
              <span className="text-caption text-panel-muted">{fact.detail}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Quiet days are plain ink, so only the incidents carry colour. */}
      <div className="grid gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-label text-panel-foreground">
            <span className="tabular">99.98%</span> uptime
            <span className="font-normal text-panel-muted"> over the last 90 days</span>
          </p>
          <ul aria-hidden="true" className="flex items-center gap-4 text-caption text-panel-muted">
            <li className="flex items-center gap-2">
              <span className="h-3 w-1 rounded-full bg-panel-foreground/15" />
              Operational
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-1 rounded-full bg-panel-warning" />
              Degraded
            </li>
          </ul>
        </div>
        <p className="sr-only">
          Production was operational on 88 of the last 90 days. It was degraded for 6 minutes on August 14 and for 14
          minutes on September 21.
        </p>
        <div aria-hidden="true" className="flex h-6 items-stretch gap-px @min-[40rem]/production:gap-0.5">
          {Array.from({ length: UPTIME_DAYS }, (_, day) => (
            <span
              key={day}
              className={
                degradedDays.has(day)
                  ? "min-w-0 flex-1 rounded-full bg-panel-warning"
                  : "min-w-0 flex-1 rounded-full bg-panel-foreground/15"
              }
            />
          ))}
        </div>
        <div aria-hidden="true" className="flex justify-between text-caption text-panel-muted">
          <span>Jul 11</span>
          <span>Today</span>
        </div>
      </div>
    </section>
  )
}
