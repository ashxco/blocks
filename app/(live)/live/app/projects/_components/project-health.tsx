"use client"

import * as React from "react"
import { CircleXIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import type {
  ProjectRow,
  ProjectStatus,
} from "@/components/blocks/data-table/data"

interface Failure {
  project: string
  branch: string
  sha: string
  error: string
  author: string
  time: string
}

const failures: Failure[] = [
  {
    project: "api",
    branch: "feat/rate-limits",
    sha: "e7b3a90",
    error: "npm run build exited with code 1: Cannot find module './limits'",
    author: "Leo Martins",
    time: "18 min ago",
  },
  {
    project: "mobile-api",
    branch: "fix/push-tokens",
    sha: "3c4d7e2",
    error: "Health check failed: GET /healthz returned 503 after 60s",
    author: "Daniel Okafor",
    time: "7 hr ago",
  },
]

const statusLabels: Record<ProjectStatus, { label: string; dot: string }> = {
  ready: { label: "Ready", dot: "bg-success" },
  building: { label: "Building", dot: "bg-warning" },
  failed: { label: "Failed", dot: "bg-destructive" },
  paused: { label: "Paused", dot: "bg-panel-muted" },
}

const order: ProjectStatus[] = ["ready", "building", "failed", "paused"]

/**
 * Dark panel above the projects table: the deployments that failed, with a
 * redeploy for each, and how many projects are in each status.
 *
 * Status colours sit in `dark` scopes, so they take the dark theme's lighter
 * values and read the same on the panel in both themes.
 */
export function ProjectHealth({ projects }: { projects: ProjectRow[] }) {
  const [queued, setQueued] = React.useState<Set<string>>(() => new Set())

  function redeploy(failure: Failure) {
    setQueued((current) => new Set(current).add(failure.project))
    toast.add({
      title: `Redeploying ${failure.project}`,
      description: `Lumen is building ${failure.sha} from ${failure.branch} again. You will get a notification when it finishes.`,
    })
  }

  return (
    <section
      aria-labelledby="project-health-title"
      className="@container/health overflow-hidden rounded-(--panel-radius) bg-panel text-panel-foreground"
    >
      {/* The grid sits inside the container, so the container query can lay it out. */}
      <div className="grid @min-[60rem]/health:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid content-start gap-6 p-(--panel-padding-sm)">
          <div className="grid gap-2">
            <h2
              id="project-health-title"
              className="text-h3 text-panel-foreground"
            >
              Two deployments failed
            </h2>
            <p className="max-w-prose text-body text-panel-muted">
              Both ran on preview branches, so production still serves the last
              good build. Fix the error and push again, or redeploy to retry
              with a clean cache.
            </p>
          </div>

          <ul className="grid divide-y divide-panel-border border-y border-panel-border">
            {failures.map((failure) => {
              const isQueued = queued.has(failure.project)
              return (
                <li
                  key={failure.project}
                  className="flex flex-col gap-4 py-4 @min-[36rem]/health:flex-row @min-[36rem]/health:items-center @min-[36rem]/health:justify-between @min-[36rem]/health:gap-8"
                >
                  <div className="flex min-w-0 gap-3">
                    <CircleXIcon
                      aria-hidden="true"
                      className="dark mt-0.5 size-4 shrink-0 text-destructive"
                    />
                    <div className="grid min-w-0 gap-1.5">
                      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-label text-panel-foreground">
                          {failure.project}
                        </span>
                        <span className="font-mono text-xs text-panel-muted">
                          {failure.branch}
                        </span>
                      </p>
                      {/* The error is the point of the row: it wraps in narrow panels and truncates only when there is room for most of it. */}
                      <p className="w-fit max-w-full rounded-xs bg-panel-raised px-2 py-0.5 font-mono text-code break-words whitespace-pre-wrap text-panel-foreground @min-[48rem]/health:truncate @min-[48rem]/health:whitespace-nowrap">
                        {failure.error}
                      </p>
                      <p className="text-caption text-panel-muted">
                        {failure.author} pushed{" "}
                        <span className="font-mono text-panel-foreground">
                          {failure.sha}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span className="sr-only">, </span>
                        {failure.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="inverse"
                    disabled={isQueued}
                    onClick={() => redeploy(failure)}
                    className="ml-7 self-start @min-[36rem]/health:ml-0 @min-[36rem]/health:self-center"
                  >
                    {isQueued ? (
                      <Spinner data-icon="inline-start" />
                    ) : (
                      <RotateCcwIcon data-icon="inline-start" />
                    )}
                    {isQueued ? "Build queued" : "Redeploy"}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-panel-border bg-panel-border @min-[36rem]/health:grid-cols-4 @min-[60rem]/health:grid-cols-2 @min-[60rem]/health:border-t-0 @min-[60rem]/health:border-l">
          {order.map((status) => {
            const count = projects.filter(
              (project) => project.status === status
            ).length
            return (
              <div
                key={status}
                className="grid content-between gap-4 bg-panel px-(--panel-padding-sm) py-6 @min-[60rem]/health:py-(--panel-padding-sm)"
              >
                <dt className="dark flex items-center gap-2 text-caption text-panel-muted">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${statusLabels[status].dot}`}
                  />
                  {statusLabels[status].label}
                </dt>
                <dd className="text-h2 text-panel-foreground tabular">
                  {count}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
