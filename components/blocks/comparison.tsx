import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { Wordmark } from "@/components/blocks/wordmark"
import { cn } from "@/lib/utils"

export interface ComparisonSide {
  /** Name shown at the top of the card. */
  name: React.ReactNode
  items: string[]
}

export interface ComparisonProps {
  /** Section title. Pass null to render the cards without a heading. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Your product: a dark emphasis panel with green checks. */
  us?: ComparisonSide
  /** The alternative: the canvas colour and muted crosses. */
  them?: ComparisonSide
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultUs: ComparisonSide = {
  name: <Wordmark href={null} tone="panel" />,
  items: [
    "Projects, tasks and docs in one place",
    "Status comes from the work itself",
    "Automations handle the handoffs",
    "Reports update as tasks move",
    "Clients join as guests, on your terms",
  ],
}

const defaultThem: ComparisonSide = {
  name: "Spreadsheets, chat and email",
  items: [
    "Work split across three tools",
    "Status written up by hand each week",
    "Reminders sent one message at a time",
    "Reports rebuilt in a spreadsheet",
    "Clients copied on long email threads",
  ],
}

function ComparisonCard({ side, variant }: { side: ComparisonSide; variant: "us" | "them" }) {
  const us = variant === "us"
  return (
    <div
      data-side={variant}
      className={cn(
        "rounded-(--card-radius) border px-6 pt-6 pb-3 @min-[40rem]/compare:px-8 @min-[40rem]/compare:pt-8",
        // The other side stays on the canvas colour, so the panel steps clearly forward in both themes.
        us ? "border-panel bg-panel text-panel-foreground" : "bg-background"
      )}
    >
      <h3 className={cn("flex min-h-8 items-center text-h4", us ? "text-panel-foreground" : "text-foreground")}>
        {side.name}
      </h3>
      <ul className={cn("mt-6 divide-y border-t", us && "divide-panel-border border-panel-border")}>
        {side.items.map((item) => (
          <li
            key={item}
            className={
              us
                ? "flex items-start gap-3 py-4 text-body font-medium text-panel-foreground"
                : "flex items-start gap-3 py-4 text-body text-copy"
            }
          >
            <span
              aria-hidden="true"
              className={
                us
                  ? "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-panel-success text-panel"
                  : "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground"
              }
            >
              {us ? <CheckIcon className="size-3" strokeWidth={3} /> : <XIcon className="size-3" strokeWidth={3} />}
            </span>
            <span>
              <span className="sr-only">{us ? "Included: " : "Not included: "}</span>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Two cards side by side: your product on a dark emphasis panel with green
 * checks, the alternative on the canvas with muted crosses. Rows line
 * up when both sides have the same number of items.
 */
export function Comparison({
  title = "Why teams switch to Acme.",
  description = "One workspace for the plan and the work, instead of a spreadsheet, a chat thread and a weekly meeting to tie them together.",
  us = defaultUs,
  them = defaultThem,
  contained = true,
  className,
}: ComparisonProps) {
  return (
    <section
      data-slot="comparison"
      className={cn("@container/comparison-section", contained && "container-page py-section", className)}
    >
      {title ? (
        <SectionHeading
          align="center"
          title={title}
          description={description}
          className="mb-12 @3xl/comparison-section:mb-16"
        />
      ) : null}
      <div className="@container/compare mx-auto max-w-narrow">
        <div className="grid gap-4 @min-[40rem]/compare:grid-cols-2">
          <ComparisonCard side={us} variant="us" />
          <ComparisonCard side={them} variant="them" />
        </div>
      </div>
    </section>
  )
}
