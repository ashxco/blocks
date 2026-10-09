import { cn } from "@/lib/utils"

/**
 * Blocks keyboard key. Mono glyphs on a muted keycap with a hairline border.
 * Inside tooltips and buttons it inherits the surrounding colour so it reads
 * on ink and on panels.
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-6 w-fit min-w-6 items-center justify-center gap-0.5 rounded-xs border border-border bg-muted px-1.5",
        "font-mono text-xs font-medium text-muted-foreground tabular-nums select-none",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
        "in-data-[slot=tooltip-content]:border-current/20 in-data-[slot=tooltip-content]:bg-transparent in-data-[slot=tooltip-content]:text-current",
        "in-data-[slot=button]:h-5 in-data-[slot=button]:min-w-5 in-data-[slot=button]:border-current/15 in-data-[slot=button]:bg-transparent in-data-[slot=button]:px-1 in-data-[slot=button]:text-current/70",
        className
      )}
      {...props}
    />
  )
}

/** Keys pressed together or in sequence. Put "then" or "+" between them as plain text. */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn(
        "inline-flex items-center gap-1 font-sans text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
