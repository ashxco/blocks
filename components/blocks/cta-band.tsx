import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { InstallCommand } from "@/components/blocks/install-command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

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
  /** Title of the box on the right. */
  installLabel?: string
  /** Command in the box. Pass null for a box with the title and points only. */
  command?: string | null
  /** Short reassurances in the box, with checks. */
  points?: string[]
  /**
   * Replaces the whole box with your own content, such as a list of open
   * roles. Pass null to drop the box: the pitch spans the panel and the
   * actions move to its right edge.
   */
  aside?: React.ReactNode
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

/**
 * The closing call to action: a dark panel with the pitch and actions on the
 * left and an install box on the right. Swap the box for your own content,
 * or drop it for a compact band, so closing bands vary from page to page.
 */
export function CtaBand({
  title = "Ship on Lumen today.",
  description = "Connect a repository, push, and get a live URL in under a minute. Try every Pro feature free for 14 days, on our cloud or your own servers.",
  primaryAction = { label: "Start free trial", href: "/live/sign-up" },
  secondaryAction = { label: "Talk to sales", href: "/live/contact" },
  installLabel = "Or start from your terminal",
  command = "npm i -g lumen",
  points = ["14-day Pro trial, no card required", "Our cloud or your own servers", "Preview URL for every branch"],
  aside,
  contained = true,
  className,
}: CtaBandProps) {
  const compact = aside === null

  const actions = (
    <div className={cn("flex flex-wrap gap-3", !compact && "mt-3")}>
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
  )

  const pitch = (
    <div className="grid gap-6">
      <h2 className="text-h2 text-balance text-panel-foreground">
        <Kern>{title}</Kern>
      </h2>
      {description != null ? <p className="max-w-prose text-lead text-panel-muted">{description}</p> : null}
      {compact ? null : actions}
    </div>
  )

  return (
    <section data-slot="cta-band" data-variant={compact ? "compact" : "box"} className={cn(contained && "container-page py-section", className)}>
      <div className="@container rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        {compact ? (
          <div className="grid gap-9 @narrow:grid-cols-[minmax(0,1fr)_auto] @narrow:items-end @narrow:gap-14">
            {pitch}
            <div className="@narrow:pb-1.5">{actions}</div>
          </div>
        ) : (
          <div className="grid items-center gap-10 @narrow:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] @narrow:gap-14">
            {pitch}
            <div className="grid gap-5 rounded-(--card-radius) border border-panel-border bg-panel-raised p-(--card-padding)">
              {aside !== undefined ? (
                aside
              ) : (
                <>
                  <p className="text-label text-panel-foreground">{installLabel}</p>
                  {command ? <InstallCommand tone="panel" command={command} className="w-full" /> : null}
                  {points.length > 0 ? (
                    <ul className={cn("grid gap-2.5", command && "pt-1")}>
                      {points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-sm text-panel-muted">
                          <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-panel-success" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
