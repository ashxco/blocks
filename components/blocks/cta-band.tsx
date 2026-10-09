import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { InstallCommand } from "@/components/blocks/install-command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CtaBandAction {
  label: string
  href: string
}

export interface CtaBandProps {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Main action, shown as the inverse button. */
  primaryAction?: CtaBandAction
  /** Second action, shown as the outline button. Pass null to hide it. */
  secondaryAction?: CtaBandAction | null
  /** Label above the install command. */
  installLabel?: string
  /** Command in the install box. */
  command?: string
  /** Short reassurances under the command. */
  points?: string[]
  /** Render only the panel, without the page container and section padding. */
  bare?: boolean
  className?: string
}

/**
 * The closing call to action: a dark panel with the pitch and actions on the
 * left and an install box on the right.
 */
export function CtaBand({
  title = "Ship your next app on Lumen.",
  description = "Start free in under a minute. Connect a repository, push, and get a live URL. Bring your own servers whenever you like.",
  primaryAction = { label: "Start deploying", href: "/live/sign-up" },
  secondaryAction = { label: "Talk to sales", href: "/live/contact" },
  installLabel = "Or start from your terminal",
  command = "npm i -g lumen",
  points = ["Free plan, no card required", "Our cloud or your own servers", "Preview URL for every branch"],
  bare = false,
  className,
}: CtaBandProps) {
  return (
    <section data-slot="cta-band" className={cn(!bare && "container-page py-section", className)}>
      <div className="@container relative isolate overflow-hidden rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 600"
          fill="none"
          className="pointer-events-none absolute -top-56 -right-56 -z-10 size-144 stroke-panel-border"
        >
          {[60, 120, 180, 240, 299].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <div className="grid items-center gap-10 @narrow:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] @narrow:gap-14">
          <div className="grid gap-6">
            <h2 className="max-w-prose text-h2 text-panel-foreground">{title}</h2>
            {description != null ? <p className="max-w-prose text-lead text-panel-muted">{description}</p> : null}
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="inverse" size="lg" nativeButton={false} render={<Link href={primaryAction.href} />}>
                {primaryAction.label}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              {secondaryAction ? (
                <Button variant="outline-inverse" size="lg" nativeButton={false} render={<Link href={secondaryAction.href} />}>
                  {secondaryAction.label}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 rounded-(--card-radius) border border-panel-border bg-panel-raised p-(--card-padding)">
            <p className="text-label text-panel-foreground">{installLabel}</p>
            <InstallCommand tone="panel" command={command} className="w-full" />
            {points.length > 0 ? (
              <ul className="grid gap-2.5 pt-1">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-panel-muted">
                    <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
