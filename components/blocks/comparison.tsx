import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
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
  /** Your product: ink border and success checks. */
  us?: ComparisonSide
  /** The alternative: tinted surface and muted crosses. */
  them?: ComparisonSide
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

/** The Lumen wordmark used in the "us" card. */
function LumenMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden="true" className="grid size-7 place-items-center rounded-sm bg-foreground">
        <span className="size-2.5 rounded-full bg-brand" />
      </span>
      Lumen
    </span>
  )
}

const defaultUs: ComparisonSide = {
  name: <LumenMark />,
  items: [
    "Run on your servers or on our cloud",
    "Flat price per server, no seats",
    "Preview URL for every branch",
    "Logs and metrics included",
    "Leave any time, your apps keep running",
  ],
}

const defaultThem: ComparisonSide = {
  name: "Typical hosted platform",
  items: [
    "Their cloud only",
    "Per-seat pricing plus overages",
    "Previews on paid plans only",
    "Separate bills for logs and APM",
    "Rebuild everything to move",
  ],
}

function ComparisonCard({ side, variant }: { side: ComparisonSide; variant: "us" | "them" }) {
  const us = variant === "us"
  return (
    <div
      data-side={variant}
      className={cn(
        "rounded-(--card-radius) px-6 pt-6 pb-3 @min-[40rem]/compare:px-8 @min-[40rem]/compare:pt-8",
        us ? "border-2 border-foreground bg-card" : "border bg-subtle"
      )}
    >
      <h3 className="flex min-h-8 items-center text-h4 text-foreground">{side.name}</h3>
      <ul className="mt-6 divide-y border-t">
        {side.items.map((item) => (
          <li
            key={item}
            className={
              us
                ? "flex items-start gap-3 py-4 text-body font-medium text-foreground"
                : "flex items-start gap-3 py-4 text-body text-copy"
            }
          >
            <span
              aria-hidden="true"
              className={
                us
                  ? "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success text-success-foreground"
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
 * Two cards side by side: your product with an ink border and success
 * checks, the alternative on a tinted surface with muted crosses. Rows line
 * up when both sides have the same number of items.
 */
export function Comparison({
  title = "Why teams switch to Lumen.",
  description = "The same push-to-deploy workflow, without the lock-in or the per-seat bill.",
  us = defaultUs,
  them = defaultThem,
  contained = true,
  className,
}: ComparisonProps) {
  return (
    <section data-slot="comparison" className={cn(contained && "container-page py-section", className)}>
      {title ? (
        <SectionHeading align="center" title={title} description={description} className="mb-12 md:mb-16" />
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
