import * as React from "react"

import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export interface SectionHeadingProps {
  /** The heading. Wrap one word in <span className="text-brand"> to highlight it. */
  title: React.ReactNode
  /** Supporting sentence or two. */
  description?: React.ReactNode
  /**
   * - split: title left, description right, aligned to the baseline (default)
   * - center: centred column
   * - left: one left-aligned column
   */
  align?: "split" | "center" | "left"
  /** Heading level. Use h1 only once per page, for an inner page title. */
  as?: "h1" | "h2"
  className?: string
  /** Actions, such as buttons, shown under the description. */
  children?: React.ReactNode
}

const layouts = {
  split:
    "grid gap-5 @narrow:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow:items-end @narrow:gap-16",
  center: "mx-auto grid max-w-narrow justify-items-center gap-5 text-center",
  left: "grid max-w-narrow gap-5",
} as const

/**
 * The heading at the top of a section. Bold title, optional supporting text
 * and actions. Never add an eyebrow label above it.
 */
export function SectionHeading({
  title,
  description,
  align = "split",
  as = "h2",
  className,
  children,
}: SectionHeadingProps) {
  const Heading = as
  const hasAside = description != null || children != null

  return (
    <div data-slot="section-heading" data-align={align} className={cn("@container", className)}>
      <div className={layouts[align]}>
        <Heading className={as === "h1" ? "max-w-narrow text-h1" : "max-w-narrow text-h2"}>
          <Kern>{title}</Kern>
        </Heading>
        {hasAside ? (
          <div
            className={
              align === "center"
                ? "grid justify-items-center gap-7"
                : align === "split"
                  ? "grid gap-7 @narrow:pb-1.5"
                  : "grid gap-7"
            }
          >
            {description != null ? (
              <p className={align === "center" ? "max-w-prose text-lead text-balance text-copy" : "max-w-prose text-lead text-copy"}>
                {description}
              </p>
            ) : null}
            {children != null ? (
              <div
                className={
                  align === "center"
                    ? "flex flex-wrap items-center justify-center gap-3"
                    : "flex flex-wrap items-center gap-3"
                }
              >
                {children}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
