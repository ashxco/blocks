import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * The Blocks mark: four blocks, one of them in the theme's accent. Where the
 * accent is ink like the others (Mono), --brand-mark-ring insets that block
 * with a canvas-coloured edge, so it still stands apart.
 */
export function BlocksMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={cn("size-5 shrink-0", className)}>
      <rect x="0" y="0" width="9" height="9" rx="2" className="fill-current" />
      <rect x="11" y="0" width="9" height="9" rx="2" className="fill-current" />
      <rect x="0" y="11" width="9" height="9" rx="2" className="fill-current" />
      <rect
        x="11"
        y="11"
        width="9"
        height="9"
        rx="2"
        className="fill-brand stroke-background [stroke-width:calc(var(--brand-mark-ring)*2)]"
      />
    </svg>
  )
}

export function Wordmark({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Blocks overview"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xs text-foreground outline-none focus-visible:focus-ring",
        className
      )}
    >
      <BlocksMark />
      <span className="text-h4 font-extrabold">Blocks</span>
    </Link>
  )
}
