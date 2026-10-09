import * as React from "react"
import { GitBranchIcon, RocketIcon, SlidersHorizontalIcon, TrendingUpIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export interface Step {
  title: string
  description: string
  /** A lucide icon element, e.g. <RocketIcon />. */
  icon: React.ReactNode
}

export interface StepsProps {
  /** Section title. Pass null to render the cards without a heading. */
  title?: React.ReactNode
  description?: React.ReactNode
  steps?: Step[]
  /** "panel" renders the whole section as a dark emphasis panel. */
  tone?: "default" | "panel"
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultSteps: Step[] = [
  {
    title: "Connect",
    description: "Link a GitHub or GitLab repository, or point the CLI at any folder on your machine.",
    icon: <GitBranchIcon />,
  },
  {
    title: "Configure",
    description: "Lumen detects your framework, build command and port. Override anything in lumen.toml.",
    icon: <SlidersHorizontalIcon />,
  },
  {
    title: "Deploy",
    description: "Every push builds in isolation, starts beside the running version and takes traffic when healthy.",
    icon: <RocketIcon />,
  },
  {
    title: "Grow",
    description: "Add domains, Postgres databases and teammates as you need them, without changing hosts.",
    icon: <TrendingUpIcon />,
  },
]

/**
 * How it works, as one strip of up to four steps with icons, joined by
 * hairlines. Order carries the sequence; there are no step numbers.
 */
export function Steps({
  title = (
    <>
      From repo to production
      <br />
      in four moves.
    </>
  ),
  description = "No agent on your servers and no black box. Every step is visible in the dashboard and in the CLI.",
  steps = defaultSteps,
  tone = "default",
  contained = true,
  className,
}: StepsProps) {
  const panel = tone === "panel"

  const grid = (
    <div className="@container/steps">
      {/* The 1px gap shows the frame colour through, joining the steps with hairlines. */}
      <ol
        // One column per step on wide layouts, up to four.
        style={{ "--steps-columns": Math.min(Math.max(steps.length, 1), 4) } as React.CSSProperties}
        className={cn(
          "grid gap-px overflow-hidden rounded-(--card-radius) border",
          "@min-[34rem]/steps:grid-cols-2 @min-[60rem]/steps:grid-cols-[repeat(var(--steps-columns),minmax(0,1fr))]",
          panel ? "border-panel-border bg-panel-border" : "bg-border"
        )}
      >
        {steps.map((step) => (
          <li
            key={step.title}
            className={cn(
              // In the two-column range a lone last step spans the row, so no empty cell shows the frame.
              // Limited to that range: one column per step takes over from 60rem.
              "flex flex-col p-6 @min-[34rem]/steps:@max-[60rem]/steps:last:odd:col-span-2 @min-[60rem]/steps:p-8",
              panel ? "bg-panel-raised" : "bg-card"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mb-8 grid size-10 place-items-center rounded-md border [&_svg]:size-5 @min-[60rem]/steps:mb-12",
                panel ? "border-panel-border bg-panel text-panel-foreground" : "bg-background text-foreground"
              )}
            >
              {step.icon}
            </span>
            <h3 className={cn("text-h4", panel ? "text-panel-foreground" : "text-foreground")}>{step.title}</h3>
            <p className={cn("mt-2 text-body", panel ? "text-panel-muted" : "text-copy")}>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )

  const heading = title ? (
    panel ? (
      <div className="mb-12 grid gap-6 @narrow/steps-panel:mb-16 @narrow/steps-panel:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow/steps-panel:items-end @narrow/steps-panel:gap-16">
        <h2 className="max-w-narrow text-h2 text-panel-foreground">
          <Kern>{title}</Kern>
        </h2>
        {description ? <p className="max-w-prose text-lead text-panel-muted">{description}</p> : null}
      </div>
    ) : (
      <SectionHeading title={title} description={description} className="mb-12 @3xl/steps-section:mb-16" />
    )
  ) : null

  if (panel) {
    return (
      <section data-slot="steps" data-tone={tone} className={cn(contained && "container-wide py-section", className)}>
        <div className="@container/steps-panel rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
          <div className="mx-auto max-w-page">
            {heading}
            {grid}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      data-slot="steps"
      data-tone={tone}
      className={cn("@container/steps-section", contained && "container-page py-section", className)}
    >
      {heading}
      {grid}
    </section>
  )
}
