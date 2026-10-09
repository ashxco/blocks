import * as React from "react"

import { NewsletterForm } from "@/components/blocks/newsletter-form"

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
  description = "Product news, engineering deep dives and guides, about twice a month. No sales emails, and you can unsubscribe with one click.",
  className = "container-page pb-section",
}: NewsletterBandProps) {
  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className={`scroll-mt-(--header-height) ${className}`}>
      <div className="@container relative isolate overflow-hidden rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        {/* Hairline rings, the same quiet motif as the closing call to action. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 600 600"
          fill="none"
          className="pointer-events-none absolute -bottom-72 -left-64 -z-10 size-144 stroke-panel-border"
        >
          {[60, 120, 180, 240, 299].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <div className="grid gap-10 @narrow:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow:items-end @narrow:gap-16">
          <div className="grid gap-5">
            <h2 id="newsletter-heading" className="max-w-prose text-h2 text-panel-foreground">
              {title}
            </h2>
            {description != null ? (
              <p className="max-w-prose text-lead text-panel-muted">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 @narrow:pb-1.5">
            <NewsletterForm tone="panel" buttonLabel="Subscribe" />
            <p className="text-caption text-panel-muted">Read by 21,000 developers and platform teams.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
