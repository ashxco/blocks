import * as React from "react"
import { GitBranchIcon, RocketIcon, SlidersHorizontalIcon, TrendingUpIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { cn } from "@/lib/utils"

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
 * How it works, as a row of four cards with icons. Cards are joined by a
 * hairline on wide layouts; there are no step numbers.
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
      <ol
        // One column per step on wide layouts, up to four.
        style={{ "--steps-columns": Math.min(Math.max(steps.length, 1), 4) } as React.CSSProperties}
        className="grid gap-4 @min-[34rem]/steps:grid-cols-2 @min-[60rem]/steps:grid-cols-[repeat(var(--steps-columns),minmax(0,1fr))]"
      >
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={
              panel
                ? "relative flex flex-col rounded-(--card-radius) border border-panel-border bg-panel-raised p-6 @min-[60rem]/steps:p-7"
                : "relative flex flex-col rounded-(--card-radius) border bg-card p-6 @min-[60rem]/steps:p-7"
            }
          >
            <span
              aria-hidden="true"
              className={
                panel
                  ? "mb-10 grid size-11 place-items-center rounded-md border border-panel-border text-panel-foreground [&_svg]:size-5"
                  : "mb-10 grid size-11 place-items-center rounded-md border bg-subtle text-foreground [&_svg]:size-5"
              }
            >
              {step.icon}
            </span>
            <h3 className={panel ? "text-h4 text-panel-foreground" : "text-h4 text-foreground"}>{step.title}</h3>
            <p className={panel ? "mt-2 text-body text-panel-muted" : "mt-2 text-body text-copy"}>
              {step.description}
            </p>
            {i < steps.length - 1 && (i + 1) % 4 !== 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  // Centred on the icon (padding + half the icon), bridging the 1rem gap and the next card's border.
                  "absolute top-12.5 left-full hidden h-px w-4.25 @min-[60rem]/steps:block",
                  panel ? "bg-panel-border" : "bg-border"
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )

  const heading = title ? (
    panel ? (
      <div className="mb-12 grid gap-6 @narrow/steps-panel:mb-16 @narrow/steps-panel:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow/steps-panel:items-end @narrow/steps-panel:gap-16">
        <h2 className="max-w-narrow text-h2 text-panel-foreground">{title}</h2>
        {description ? <p className="max-w-prose text-lead text-panel-muted">{description}</p> : null}
      </div>
    ) : (
      <SectionHeading title={title} description={description} className="mb-12 md:mb-16" />
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
    <section data-slot="steps" data-tone={tone} className={cn(contained && "container-page py-section", className)}>
      {heading}
      {grid}
    </section>
  )
}
