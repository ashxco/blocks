import Link from "next/link"

import { cn } from "@/lib/utils"

export interface WordmarkProps {
  /** Where the wordmark links to. Pass null to render it as plain text, for example inside a heading. */
  href?: string | null
  /** Product name next to the mark. */
  name?: string
  /** Use "panel" on dark panels. */
  tone?: "default" | "panel"
  className?: string
}

/**
 * The Acme mark: a rounded ink tile cut by a geometric peak, the letter A
 * reduced to two strokes, with a violet point where its crossbar would sit.
 * The tile is ink (panel-foreground on panels), the peak is cut out in the
 * canvas colour and the point is brand violet, so it reads on the canvas and
 * on dark panels in both themes. Use it alone where the name is already on screen, such as a
 * favicon-sized tile.
 */
export function BrandMark({
  tone = "default",
  className,
}: {
  /** Use "panel" on dark panels. */
  tone?: "default" | "panel"
  /** Size it with size-* (it is size-7 by default). */
  className?: string
}) {
  const panel = tone === "panel"
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 28 28"
      className={cn("size-7 shrink-0", panel ? "text-panel-foreground" : "text-foreground", className)}
    >
      <rect width="28" height="28" rx="8" className="fill-current" />
      <path
        d="M7.75 20.75 14 7.25l6.25 13.5"
        fill="none"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={panel ? "stroke-panel" : "stroke-background"}
      />
      <circle cx="14" cy="17.75" r="2.1" className={panel ? "fill-panel-brand" : "fill-brand"} />
    </svg>
  )
}

/**
 * The Acme wordmark: the mark, then the name in the heading face, extra-bold
 * with tight tracking. Shared by the site header and footer, the app sidebar,
 * the auth frame and the comparison card. The name stays the last child, so
 * a collapsed sidebar can hide it and keep the mark.
 */
export function Wordmark({ href = "/live", name = "Acme", tone = "default", className }: WordmarkProps) {
  const panel = tone === "panel"
  const content = (
    <>
      <BrandMark tone={tone} />
      <span className="font-heading text-xl font-extrabold tracking-tight">{name}</span>
    </>
  )
  const classes = cn(
    "inline-flex w-fit shrink-0 items-center gap-2.5",
    panel ? "text-panel-foreground" : "text-foreground",
    className
  )

  if (href === null) {
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
      className={cn("rounded-xs outline-none focus-visible:focus-ring", classes)}
    >
      {content}
    </Link>
  )
}
