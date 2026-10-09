"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "@/lib/utils"

/**
 * Blocks hover card. A preview that opens on hover or keyboard focus, after a
 * short delay. Same surface as Popover: bg-popover, a crisp 1px border,
 * --overlay-radius and no shadow. Never put the only path to an action in it:
 * touch screens can't hover.
 */

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  collisionAvoidance,
  collisionBoundary,
  container,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "collisionAvoidance" | "collisionBoundary"
  > & {
    /** Element to portal into instead of <body>, e.g. a preview stage. */
    container?: PreviewCardPrimitive.Portal.Props["container"]
  }) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal" container={container}>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        className="isolate z-(--z-overlay) outline-none"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "flex w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-3",
            "rounded-(--overlay-radius) border border-input bg-popover p-(--card-padding-sm) text-sm text-popover-foreground outline-none",
            "transition-[opacity,scale] duration-(--duration-base) ease-out",
            "data-starting-style:scale-98 data-starting-style:opacity-0",
            "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
            "data-instant:transition-none",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
