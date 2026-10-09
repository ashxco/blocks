"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CodeWindow } from "@/components/blocks/code-window"

import { PROVIDERS, type OnboardingRepository, type OnboardingValues } from "./types"
import { Kern } from "@/components/ui/kern"

export function OnboardingComplete({
  values,
  invitesSent,
  repository,
  domain,
  dashboardHref,
  autoFocus = true,
  onEdit,
}: {
  values: OnboardingValues
  invitesSent: number
  repository?: OnboardingRepository
  domain: string
  dashboardHref: string
  /** Move focus to the heading on mount, after people finish. Off when a page opens on this state. */
  autoFocus?: boolean
  onEdit: () => void
}) {
  const titleId = React.useId()
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const repoName = repository?.name ?? "your repository"
  const provider = PROVIDERS.find((p) => p.value === values.provider)?.label ?? "GitHub"
  const host = `${(repository?.name.split("/").pop() ?? "app").toLowerCase()}-${values.workspaceSlug}.${domain}`

  const lines = React.useMemo(
    () => [
      `→ Importing ${repoName} from ${provider}`,
      "→ Cloning main (3f9c2e1)",
      `✓ Detected ${repository?.framework ?? "your framework"}`,
      "✓ Installed dependencies in 8.4s",
      "✓ Built production bundle in 41s",
      `✓ Live at https://${host}`,
    ],
    [repoName, provider, repository?.framework, host]
  )
  const [shown, setShown] = React.useState(1)

  // Stream the log in one line at a time. Under reduced motion the first tick
  // shows every line at once. State only changes inside the timer callback.
  // Read once: the heading takes focus when the state appears, never again.
  const focusOnMount = React.useRef(autoFocus)
  React.useEffect(() => {
    if (focusOnMount.current) headingRef.current?.focus({ preventScroll: true })
  }, [])

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = setInterval(
      () => {
        setShown((n) => {
          const next = reduce ? lines.length : Math.min(n + 1, lines.length)
          if (next >= lines.length) clearInterval(timer)
          return next
        })
      },
      reduce ? 0 : 650
    )
    return () => clearInterval(timer)
  }, [lines])

  const summary = [
    { term: "Workspace", detail: `${domain}/${values.workspaceSlug}`, mono: true },
    {
      term: "Team",
      detail: invitesSent ? `${invitesSent} ${invitesSent === 1 ? "invite" : "invites"} sent` : "Just you for now",
    },
    { term: "Repository", detail: repoName, mono: true },
  ]

  return (
    <section
      className="@container/complete animate-in overflow-hidden rounded-(--panel-radius) bg-panel text-panel-muted duration-(--duration-slow) ease-out fade-in-0 slide-in-from-bottom-2"
      aria-labelledby={titleId}
    >
      <div className="grid gap-10 p-(--panel-padding-sm) @narrow/complete:grid-cols-2 @narrow/complete:items-center @narrow/complete:gap-12">
        <div className="min-w-0">
          <span className="grid size-12 place-items-center rounded-full bg-panel-raised">
            {/* dark: the check takes the dark theme's green, which reads on the panel in both themes. */}
            <CheckIcon className="dark size-5 text-success" strokeWidth={2.5} aria-hidden="true" />
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
            Lumen is deploying {repoName} from main. Your first production URL will be live in about a minute.
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
        <CodeWindow title={`${repoName} · main`} lines={lines.slice(0, shown)} className="dark min-h-72" />
      </div>
    </section>
  )
}
