"use client"

import * as React from "react"
import { CheckIcon, MessageSquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { formatDue, type ProjectRow, type ProjectStatus } from "@/components/blocks/data-table/data"
import { cn } from "@/lib/utils"

/** The latest update on each project that needs attention, from its lead. */
const updates: Record<string, { text: string; time: string }> = {
  "customer-portal": {
    text: "Portal sign-in needs a security review we can’t finish before Oct 23. Proposing Nov 6 for the beta.",
    time: "2 hr ago",
  },
  "mobile-app": {
    text: "Push notifications slip a week while we wait for the app store review. Everything else is on plan.",
    time: "34 min ago",
  },
  "billing-migration": {
    text: "Invoice export is behind, so 6 tasks moved to next week. Still aiming for Nov 13.",
    time: "Yesterday",
  },
}

const statusLabels: Record<ProjectStatus, { label: string; dot: string }> = {
  "on-track": { label: "On track", dot: "bg-panel-success" },
  "at-risk": { label: "At risk", dot: "bg-panel-warning" },
  "off-track": { label: "Off track", dot: "bg-panel-destructive" },
  completed: { label: "Completed", dot: "bg-panel-muted" },
  // Hollow, so Paused reads apart from Completed at a glance; the label carries the meaning.
  paused: { label: "Paused", dot: "border border-panel-muted" },
}

const counted: ProjectStatus[] = ["on-track", "at-risk", "off-track", "completed", "paused"]

const firstName = (name: string) => name.split(/\s+/)[0]

/**
 * Dark panel above the projects table: the projects that are off track or at
 * risk, each with its lead's latest update and a way to ask for a new one,
 * and how many projects are in each status. The counts are rows on a phone,
 * five tiles in a band once there is room, and a column of rows beside the
 * list on wide screens.
 *
 * Status colours use the panel-* tokens (panel-success, panel-warning,
 * panel-destructive), which read on bg-panel in both themes.
 */
export function ProjectHealth({ projects }: { projects: ProjectRow[] }) {
  const [requested, setRequested] = React.useState<Set<string>>(() => new Set())
  // Off track first, then at risk.
  const attention = projects
    .filter((project) => project.status === "off-track" || project.status === "at-risk")
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "off-track" ? -1 : 1))

  function requestUpdate(project: ProjectRow) {
    setRequested((current) => new Set(current).add(project.id))
    toast.add({
      title: `Asked ${project.lead} for an update`,
      description: `${firstName(project.lead)} gets a reminder to post a status update on ${project.name}.`,
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
            <h2 id="project-health-title" className="text-h3 text-panel-foreground">
              {attention.length} projects need attention
            </h2>
            <p className="max-w-prose text-body text-panel-muted">
              One is off track and {attention.length - 1} are at risk. Read what their leads said last, or ask for a
              fresh update before Monday’s planning.
            </p>
          </div>

          <ul className="grid divide-y divide-panel-border border-y border-panel-border">
            {attention.map((project) => {
              const isRequested = requested.has(project.id)
              const update = updates[project.id]
              const status = statusLabels[project.status]
              return (
                <li
                  key={project.id}
                  className="flex flex-col gap-4 py-4 @min-[36rem]/health:flex-row @min-[36rem]/health:items-center @min-[36rem]/health:justify-between @min-[36rem]/health:gap-8"
                >
                  <div className="flex min-w-0 gap-3">
                    <span aria-hidden="true" className={cn("mt-1.5 size-2 shrink-0 rounded-full", status.dot)} />
                    <div className="grid min-w-0 gap-1.5">
                      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-label text-panel-foreground">{project.name}</span>
                        <span className="text-caption text-panel-muted">
                          {status.label} · Due {formatDue(project.due)}
                        </span>
                      </p>
                      {update ? (
                        <p className="max-w-prose rounded-sm bg-panel-raised px-3 py-2 text-sm text-panel-foreground">
                          {update.text}
                        </p>
                      ) : null}
                      <p className="text-caption text-panel-muted">
                        {project.lead}
                        {update ? (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span className="sr-only">, </span>
                            {update.time}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="inverse"
                    disabled={isRequested}
                    onClick={() => requestUpdate(project)}
                    className="ml-5 self-start @min-[36rem]/health:ml-0 @min-[36rem]/health:self-center"
                  >
                    {isRequested ? <CheckIcon data-icon="inline-start" /> : <MessageSquareIcon data-icon="inline-start" />}
                    {isRequested ? "Update requested" : "Request update"}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <dl
          className={cn(
            "grid content-start divide-y divide-panel-border border-t border-panel-border",
            "@min-[44rem]/health:grid-cols-5 @min-[44rem]/health:divide-x @min-[44rem]/health:divide-y-0",
            "@min-[60rem]/health:grid-cols-1 @min-[60rem]/health:divide-x-0 @min-[60rem]/health:divide-y",
            "@min-[60rem]/health:border-t-0 @min-[60rem]/health:border-l @min-[60rem]/health:py-3"
          )}
        >
          {counted.map((status) => {
            const count = projects.filter((project) => project.status === status).length
            return (
              <div
                key={status}
                className={cn(
                  "flex items-center justify-between gap-4 px-(--panel-padding-sm) py-3",
                  "@min-[44rem]/health:flex-col @min-[44rem]/health:items-start @min-[44rem]/health:px-5 @min-[44rem]/health:py-6",
                  "@min-[60rem]/health:flex-row @min-[60rem]/health:items-center @min-[60rem]/health:px-(--panel-padding-sm) @min-[60rem]/health:py-4"
                )}
              >
                <dt className="flex items-center gap-2 text-caption whitespace-nowrap text-panel-muted">
                  <span aria-hidden="true" className={cn("size-2 rounded-full", statusLabels[status].dot)} />
                  {statusLabels[status].label}
                </dt>
                <dd
                  className={cn(
                    "text-h3 text-panel-foreground tabular",
                    "@min-[44rem]/health:text-h2 @min-[60rem]/health:text-h3"
                  )}
                >
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
