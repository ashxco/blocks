"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

/**
 * Blocks popover. Rich content anchored to a trigger: bg-popover, a crisp
 * 1px border, --overlay-radius and no shadow. It grows from the trigger with
 * a fade and a 98% scale.
 *
 *   <Popover>
 *     <PopoverTrigger render={<Button variant="outline" />}>Share</PopoverTrigger>
 *     <PopoverContent>…</PopoverContent>
 *   </Popover>
 */

function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  collisionAvoidance,
  collisionBoundary,
  container,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionAvoidance"
    | "collisionBoundary"
  > & {
    /** Element to portal into instead of <body>, e.g. a preview stage. */
    container?: PopoverPrimitive.Portal.Props["container"]
  }) {
  return (
    <ScopedPortal portal={PopoverPrimitive.Portal} container={container}>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        className="isolate z-(--z-overlay) outline-none"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "flex w-(--popover-width) max-w-(--available-width) origin-(--transform-origin) flex-col gap-4",
            "rounded-(--overlay-radius) border border-popover-border bg-popover p-(--card-padding-sm) text-sm text-popover-foreground outline-none",
            "transition-[opacity,scale] duration-(--duration-base) ease-out",
            "data-starting-style:scale-98 data-starting-style:opacity-0",
            "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
            "data-instant:transition-none",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </ScopedPortal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-title text-foreground", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-sm text-copy", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
