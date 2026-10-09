import * as React from "react"

export interface PullQuoteProps {
  /** The quote, without quotation marks. */
  children: React.ReactNode
  /** Who said it. */
  cite?: React.ReactNode
}

/**
 * A line lifted from the article, set large and bold in full ink between
 * hairlines, in the upright heading face.
 */
export function PullQuote({ children, cite }: PullQuoteProps) {
  return (
    <figure data-slot="pull-quote" className="border-y py-10 md:py-12">
      <blockquote>
        <p className="text-h3 text-balance text-foreground">
          <span aria-hidden="true">“</span>
          {children}
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>
      {cite != null ? (
        <figcaption className="mt-6 flex items-center gap-3 text-label text-muted-foreground">
          <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-foreground" />
          {cite}
        </figcaption>
      ) : null}
    </figure>
  )
}
