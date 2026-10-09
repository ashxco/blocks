import { cn } from "@/lib/utils"

/**
 * Blocks skeleton. A flat ink tint (a foreground/3 base under a foreground/9
 * layer, about 12% in all) that reads on the canvas, on cards and on tinted
 * bands in both themes. While content loads the top layer pulses, so the
 * shape breathes between full strength and about 60% instead of fading out.
 * The pulse only runs when the user allows motion.
 *
 * Match the shape of what is loading: `rounded-full` for avatars and text
 * lines, `rounded-(--card-radius)` for cards.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative rounded-sm bg-foreground/3",
        "after:absolute after:inset-0 after:rounded-[inherit] after:bg-foreground/9 motion-safe:after:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
