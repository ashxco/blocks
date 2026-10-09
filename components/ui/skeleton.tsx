import { cn } from "@/lib/utils"

/**
 * Blocks skeleton. A flat ink-tinted shape (foreground at 10%, visible on the
 * canvas and on cards in both themes) that pulses gently while content loads. The pulse only runs when the user allows motion.
 * Match the shape of what is loading: `rounded-full` for avatars and text
 * lines, `rounded-(--card-radius)` for cards.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("rounded-sm bg-foreground/10 motion-safe:animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
