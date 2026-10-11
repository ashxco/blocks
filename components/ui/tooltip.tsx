"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

/**
 * Blocks tooltip. A compact ink label (bg-primary, text-caption, rounded-xs)
 * that names an icon or control. No arrow and no shadow; it fades in with a
 * small scale from the trigger. A <Kbd> inside picks up the tooltip colours.
 */

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  collisionAvoidance,
  collisionBoundary,
  container,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionAvoidance"
    | "collisionBoundary"
  > & {
    /** Element to portal into instead of <body>, e.g. a preview stage. */
    container?: TooltipPrimitive.Portal.Props["container"]
  }) {
  return (
    <ScopedPortal portal={TooltipPrimitive.Portal} container={container}>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        className="isolate z-(--z-overlay)"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "inline-flex w-fit max-w-(--tooltip-max-width) origin-(--transform-origin) items-center gap-2 rounded-xs bg-primary px-2 py-1",
            "text-caption font-medium text-pretty text-primary-foreground",
            "has-data-[slot=kbd]:py-0.5 has-data-[slot=kbd]:pr-0.5",
            "transition-[opacity,scale] duration-(--duration-base) ease-out",
            "data-starting-style:scale-98 data-starting-style:opacity-0",
            "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
            "data-instant:transition-none",
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </ScopedPortal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
