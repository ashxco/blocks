import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * The mark of Acme Inc., the sample company in the docs examples: a rounded
 * ink tile cut by a geometric peak, the letter A reduced to two strokes, with
 * an accent point where its crossbar would sit. The peak is cut out in the
 * canvas colour and the point is the theme's accent. Where the accent is ink
 * like the tile (Mono), the theme sets --brand-mark-ring and the point gets a
 * cut-out ring in the canvas colour, so it still shows. Use it alone where
 * the name is already on screen, such as the top of an app sidebar.
 */
export function AcmeMark({
  className,
}: {
  /** Size it with size-* (it is size-7 by default). */
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 28 28"
      className={cn("size-7 shrink-0 text-foreground", className)}
    >
      <rect width="28" height="28" rx="8" className="fill-current" />
      <path
        d="M7.75 20.75 14 7.25l6.25 13.5"
        fill="none"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-background"
      />
      <circle
        cx="14"
        cy="17.75"
        r="2.1"
        paintOrder="stroke"
        className="fill-brand stroke-background stroke-(length:--brand-mark-ring)"
      />
    </svg>
  )
}

/**
 * The Acme wordmark for docs examples such as a site's navigation bar: the
 * mark, then the name in the heading face, extra-bold with tight tracking.
 * With an href it is a link; without one it is plain text.
 */
export function AcmeWordmark({
  href,
  className,
}: {
  href?: string
  className?: string
}) {
  const content = (
    <>
      <AcmeMark />
      <span className="font-heading text-xl font-extrabold tracking-tight">
        Acme
      </span>
    </>
  )
  const classes = cn(
    "inline-flex w-fit shrink-0 items-center gap-2.5 text-foreground",
    className
  )

  if (!href) {
    return (
      <span data-slot="wordmark" className={classes}>
        {content}
      </span>
    )
  }

  return (
    <Link
      href={href}
      data-slot="wordmark"
      className={cn(
        "rounded-xs outline-none focus-visible:focus-ring",
        classes
      )}
    >
      {content}
    </Link>
  )
}
