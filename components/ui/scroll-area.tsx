"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@/lib/utils"

/**
 * Blocks scroll area. Native scrolling with a thin, quiet scrollbar
 * (--scrollbar-size) that fades in while you hover or scroll and darkens
 * under the pointer.
 * Keyboard users can focus the viewport and scroll with the arrow keys.
 *
 * The wheel carries on to the page once the area reaches its end, as native
 * scrolling does. Inside an overlay, where the page behind should stay put,
 * add [&>[data-slot=scroll-area-viewport]]:overscroll-contain to the root.
 */
function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:focus-ring"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none p-0.5 select-none",
        "opacity-0 transition-opacity duration-(--duration-base) ease-standard",
        "data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-(--duration-instant)",
        "data-vertical:h-full data-vertical:w-(--scrollbar-size)",
        "data-horizontal:h-(--scrollbar-size) data-horizontal:flex-col",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border-strong transition-colors duration-(--duration-fast) ease-standard group-hover/scrollbar:bg-muted-foreground/60 active:bg-muted-foreground"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
