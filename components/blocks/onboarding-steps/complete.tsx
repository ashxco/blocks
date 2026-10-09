"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CodeWindow } from "@/components/blocks/code-window"

import { PROVIDERS, type OnboardingRepository, type OnboardingValues } from "./types"

export function OnboardingComplete({
  values,
  invitesSent,
  repository,
  domain,
  dashboardHref,
  onEdit,
}: {
  values: OnboardingValues
  invitesSent: number
  repository?: OnboardingRepository
  domain: string
  dashboardHref: string
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

  React.useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.length)
      return
    }
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= lines.length) {
          clearInterval(timer)
          return n
        }
        return n + 1
      })
    }, 650)
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
      <div className="grid gap-10 p-8 @narrow/complete:grid-cols-2 @narrow/complete:items-center @narrow/complete:gap-12 @narrow/complete:p-12 @page/complete:p-16">
        <div className="min-w-0">
          <span className="grid size-12 place-items-center rounded-full bg-panel-raised text-success">
            <CheckIcon className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="mt-8 text-h2 text-panel-foreground outline-none"
          >
            {values.workspaceName.trim() || "Your workspace"} is ready.
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
        <CodeWindow title={`${repoName} · main`} lines={lines.slice(0, shown)} className="min-h-72" />
      </div>
    </section>
  )
}
