import Link from "next/link"

import { cn } from "@/lib/utils"

export interface WordmarkProps {
  /** Where the wordmark links to. */
  href?: string
  /** Product name next to the mark. */
  name?: string
  /** Use "panel" on dark panels. */
  tone?: "default" | "panel"
  className?: string
}

/**
 * The Lumen wordmark: a small ink square with a violet dot, then the name in
 * extra-bold. Shared by the site header and footer.
 */
export function Wordmark({ href = "/live", name = "Lumen", tone = "default", className }: WordmarkProps) {
  const panel = tone === "panel"
  return (
    <Link
      href={href}
      data-slot="wordmark"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-2.5 rounded-xs outline-none focus-visible:focus-ring",
        panel ? "text-panel-foreground" : "text-foreground",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={
          panel
            ? "grid size-7 place-items-center rounded-sm bg-panel-foreground"
            : "grid size-7 place-items-center rounded-sm bg-foreground"
        }
      >
        <span className="size-2.5 rounded-full bg-brand" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">{name}</span>
    </Link>
  )
}
