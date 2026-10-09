import { cn } from "@/lib/utils"

/**
 * Blocks skeleton. A flat muted shape that pulses gently while content
 * loads. The pulse only runs when the user allows motion.
 * Match the shape of what is loading: `rounded-full` for avatars and text
 * lines, `rounded-(--card-radius)` for cards.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("rounded-sm bg-muted motion-safe:animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
