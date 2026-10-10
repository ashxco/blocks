import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { InstallCommand } from "@/components/blocks/install-command"
import { HeroProductMoment } from "@/components/blocks/hero/product-moment"
import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

export {
  HeroProductMoment,
  MomentListCard,
  MomentTrendCard,
  MomentHighlightCard,
  MomentStatusBadge,
} from "@/components/blocks/hero/product-moment"
export type { MomentListItem, MomentStatus } from "@/components/blocks/hero/product-moment"

export interface HeroAction {
  label: string
  href: string
}

export interface HeroProps {
  /** "split": copy left, product visual right. "centered": copy centred above a full-width visual. */
  variant?: "split" | "centered"
  /** The headline. Wrap one word in <span className="text-brand"> to highlight it. */
  title?: React.ReactNode
  /** One or two sentences under the headline. */
  description?: React.ReactNode
  /** Main call to action. Pass null to hide it. */
  primaryAction?: HeroAction | null
  /** Secondary call to action. Pass null to hide it. */
  secondaryAction?: HeroAction | null
  /**
   * A one-line command with a copy button, such as an SDK install on a
   * developer page. Hidden by default.
   */
  command?: string | null
  /** Replaces the default product moment. Pass null for a copy-only hero. */
  visual?: React.ReactNode
  /** Heading level. The hero is usually the page's h1. */
  as?: "h1" | "h2"
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultTitle = (
  <>
    Plan it. Track it.
    <br />
    {/* A no-break space keeps "it" with the highlighted word on narrow columns. */}
    Ship it{"\u00a0"}
    <span className="text-brand">together</span>.
  </>
)

const defaultDescription =
  "Acme is one workspace for your team’s projects, tasks, docs and reports. Everyone sees what’s next, automations handle the handoffs, and nobody chases a status update."

/**
 * The opening section of a marketing page: a display headline with one word
 * in brand violet, a lead, two actions and a product moment built from real
 * components. An optional command line suits developer pages.
 */
export function Hero({
  variant = "split",
  title = defaultTitle,
  description = defaultDescription,
  primaryAction = { label: "Start free trial", href: "/live/sign-up" },
  secondaryAction = { label: "Book a demo", href: "/live/contact" },
  command = null,
  visual,
  as: Heading = "h1",
  contained = true,
  className,
}: HeroProps) {
  const centered = variant === "centered"
  const media = visual === undefined ? <HeroProductMoment /> : visual

  const copy = (
    <div
      className={
        centered
          ? "mx-auto flex w-full max-w-narrow flex-col items-center text-center"
          : "flex min-w-0 flex-col items-start"
      }
    >
      <Heading
        className={cn(
          "text-display text-foreground",
          // Beside the visual, the headline scales with the hero so a two-line
          // title keeps two lines in a narrower slot.
          !centered && media && "@min-[60rem]/hero:text-[length:min(var(--text-display),6.4cqi)]"
        )}
      >
        <Kern>{title}</Kern>
      </Heading>
      {description ? (
        <p className="mt-6 max-w-prose text-lead text-copy">{description}</p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className={centered ? "mt-9 flex flex-wrap justify-center gap-3" : "mt-9 flex flex-wrap gap-3"}>
          {primaryAction ? (
            <Button size="lg" nativeButton={false} render={<Link href={primaryAction.href} />}>
              {primaryAction.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href={secondaryAction.href} />}>
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
      {command ? <InstallCommand command={command} className="mt-8" /> : null}
    </div>
  )

  return (
    <section
      data-slot="hero"
      data-variant={variant}
      className={cn("@container/hero", contained && "container-page pt-section-sm pb-section", className)}
    >
      {centered ? (
        <div className="grid gap-14 @narrow/hero:gap-20">
          {copy}
          {media ? <div className="min-w-0">{media}</div> : null}
        </div>
      ) : (
        <div
          className={cn(
            "grid items-center gap-12",
            media && "@min-[60rem]/hero:grid-cols-[1.2fr_1fr] @min-[60rem]/hero:gap-16"
          )}
        >
          {copy}
          {media ? <div className="min-w-0">{media}</div> : null}
        </div>
      )}
    </section>
  )
}
