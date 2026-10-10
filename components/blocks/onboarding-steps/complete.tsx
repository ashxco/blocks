"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

import { DEFAULT_TEMPLATES, type OnboardingTemplate, type OnboardingValues } from "./types"

export function OnboardingComplete({
  values,
  invitesSent,
  template = DEFAULT_TEMPLATES[0],
  domain,
  dashboardHref,
  autoFocus = true,
  onEdit,
}: {
  values: OnboardingValues
  invitesSent: number
  /** The template the first project was made from. */
  template?: OnboardingTemplate
  domain: string
  dashboardHref: string
  /** Move focus to the heading on mount, after people finish. Off when a page opens on this state. */
  autoFocus?: boolean
  onEdit: () => void
}) {
  const titleId = React.useId()
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // The starter tasks, column by column, in the order they appear.
  const cards = React.useMemo(
    () => template.sections.flatMap((section, column) => section.tasks.map((task) => ({ column, task }))),
    [template]
  )
  const [shown, setShown] = React.useState(0)

  // Read once: the heading takes focus when the state appears, never again.
  const focusOnMount = React.useRef(autoFocus)
  React.useEffect(() => {
    if (focusOnMount.current) headingRef.current?.focus({ preventScroll: true })
  }, [])

  // Fill the board one card at a time. Under reduced motion the first tick
  // shows every card at once. State only changes inside the timer callback.
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = setInterval(
      () => {
        setShown((n) => {
          const next = reduce ? cards.length : Math.min(n + 1, cards.length)
          if (next >= cards.length) clearInterval(timer)
          return next
        })
      },
      reduce ? 0 : 450
    )
    return () => clearInterval(timer)
  }, [cards])

  const summary = [
    { term: "Workspace", detail: `${domain}/${values.workspaceSlug}`, mono: true },
    {
      term: "Team",
      detail: invitesSent ? `${invitesSent} ${invitesSent === 1 ? "invite" : "invites"} sent` : "Just you for now",
    },
    { term: "First project", detail: template.name },
  ]

  return (
    <section
      className="@container/complete animate-in overflow-hidden rounded-(--panel-radius) bg-panel text-panel-muted duration-(--duration-slow) ease-out fade-in-0 slide-in-from-bottom-2"
      aria-labelledby={titleId}
    >
      <div className="grid gap-10 p-(--panel-padding-sm) @narrow/complete:grid-cols-2 @narrow/complete:items-center @narrow/complete:gap-12">
        <div className="min-w-0">
          <span className="grid size-12 place-items-center rounded-full bg-panel-raised">
            <CheckIcon className="size-5 text-panel-success" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="mt-8 text-h2 text-panel-foreground outline-none"
          >
            <Kern>{`${values.workspaceName.trim() || "Your workspace"} is ready.`}</Kern>
          </h2>
          <p className="mt-4 max-w-prose text-lead">
            Acme set up {template.name} with {template.tasks} starter tasks.{" "}
            {invitesSent
              ? "Your team gets an email to join, and anything here can change later."
              : "Invite your team from the Team page whenever you’re ready."}
          </p>
          <dl className="mt-8 grid gap-3 border-t border-panel-border pt-6">
            {summary.map((row) => (
              <div key={row.term} className="flex items-baseline justify-between gap-6">
                <dt className="text-sm">{row.term}</dt>
                <dd className={row.mono ? "min-w-0 truncate font-mono text-sm text-panel-foreground" : "text-sm font-semibold text-panel-foreground"}>
                  {row.detail}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="inverse" size="lg" nativeButton={false} render={<Link href={dashboardHref} />}>
              Open dashboard
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline-inverse" size="lg" onClick={onEdit}>
              Edit setup
            </Button>
          </div>
        </div>

        {/* The new project, its starter tasks landing in their sections. Every card is laid out from the
            start, so the board never changes height while it fills. */}
        <div className="min-w-0 overflow-hidden rounded-(--card-radius) border border-panel-border bg-panel-raised">
          <div className="flex items-center justify-between gap-4 border-b border-panel-border px-5 py-4">
            <p className="min-w-0 truncate text-label text-panel-foreground">{template.name}</p>
            <p className="shrink-0 text-caption text-panel-muted tabular">{template.tasks} starter tasks</p>
          </div>
          <div className="@container/board p-3">
            <ol className="grid grid-cols-1 gap-3 @min-[22rem]/board:grid-cols-3">
              {template.sections.map((section, column) => {
                const more = section.count - section.tasks.length
                // The section's sample cards have all landed once its last one is shown.
                const filled = cards.findIndex((card) => card.column === column) + section.tasks.length <= shown
                return (
                  <li key={section.name} className="grid content-start gap-2 rounded-(--control-radius) bg-panel p-2.5">
                    <p className="flex items-center justify-between gap-2 px-1 text-caption">
                      <span className="truncate font-semibold text-panel-foreground">{section.name}</span>
                      <span className="tabular">{section.count}</span>
                    </p>
                    <ul className="grid gap-2">
                      {section.tasks.map((task) => {
                        const index = cards.findIndex((card) => card.column === column && card.task === task)
                        const visible = index < shown
                        return (
                          <li
                            key={task}
                            aria-hidden={visible ? undefined : true}
                            className={cn(
                              "rounded-xs border border-panel-border bg-panel-raised px-3 py-2.5 text-sm text-panel-foreground transition-[opacity,translate] duration-(--duration-base) ease-out",
                              visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                            )}
                          >
                            {task}
                          </li>
                        )
                      })}
                    </ul>
                    {more > 0 ? (
                      <p
                        aria-hidden={filled ? undefined : true}
                        className={cn(
                          "px-1 text-caption tabular transition-opacity duration-(--duration-base) ease-out",
                          filled ? "opacity-100" : "opacity-0"
                        )}
                      >
                        +{more} more
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
