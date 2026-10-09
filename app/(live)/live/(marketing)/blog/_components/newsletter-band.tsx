import * as React from "react"

import { NewsletterForm } from "@/components/blocks/newsletter-form"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export interface NewsletterBandProps {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Spacing and container classes for the outer section. */
  className?: string
}

/**
 * Email sign-up on a dark panel: the pitch on the left, the form and a
 * reassurance line on the right. Stacks on phones.
 */
export function NewsletterBand({
  title = "Get the next post in your inbox.",
  description = "Every new post, about twice a month. No sales emails, and you can unsubscribe with one click.",
  className = "container-page pb-section",
}: NewsletterBandProps) {
  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className={cn("scroll-mt-(--header-height)", className)}>
      <div className="@container rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <div className="grid gap-10 @narrow:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow:items-end @narrow:gap-16">
          <div className="grid gap-5">
            <h2 id="newsletter-heading" className="max-w-prose text-h2 text-panel-foreground">
              <Kern>{title}</Kern>
            </h2>
            {description != null ? (
              <p className="max-w-prose text-lead text-panel-muted">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 @narrow:pb-1.5">
            <NewsletterForm tone="panel" label="Email address for new posts" buttonLabel="Subscribe" />
            <p className="text-caption text-panel-muted">Read by 21,000 developers and platform teams.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
