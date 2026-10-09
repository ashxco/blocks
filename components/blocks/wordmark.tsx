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
 * The Lumen wordmark: a small ink tile with a violet point of light, then the
 * name in extra-bold. Shared by the site header and footer, the auth frame
 * and the comparison card.
 */
export function Wordmark({ href = "/live", name = "Lumen", tone = "default", className }: WordmarkProps) {
  const panel = tone === "panel"
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn("grid size-7 shrink-0 place-items-center rounded-sm", panel ? "bg-panel-foreground" : "bg-foreground")}
      >
        <span className="size-2.5 rounded-full bg-brand" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">{name}</span>
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
