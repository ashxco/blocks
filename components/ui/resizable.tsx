"use client"

import { cn } from "@/lib/utils"
import * as ResizablePrimitive from "react-resizable-panels"

/**
 * Blocks resizable panels, on react-resizable-panels. Panels are divided by a
 * 1px hairline with a wider invisible hit area. The line darkens on hover,
 * turns to the accent while dragging or focused, and withHandle adds a small
 * rounded grip in the middle. Drag, or focus the handle and use the arrow keys.
 */
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel(props: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative flex w-px shrink-0 items-center justify-center bg-border outline-none",
        "transition-colors duration-(--duration-fast) ease-standard",
        // Invisible 9px hit area centred on the line.
        "after:absolute after:inset-y-0 after:left-1/2 after:w-2.25 after:-translate-x-1/2",
        "focus-visible:bg-ring data-[separator=active]:bg-brand data-[separator=hover]:bg-border-strong",
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        // Rows: the separator lies flat.
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2.25 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        "[&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className={cn(
            "z-10 flex h-7 w-3.5 shrink-0 flex-col items-center justify-center gap-0.75 rounded-full border border-border-strong bg-background",
            "transition-colors duration-(--duration-fast) ease-standard",
            "group-data-[separator=hover]/handle:border-muted-foreground/60",
            "group-focus-visible/handle:border-ring group-data-[separator=active]/handle:border-brand"
          )}
        >
          <span className="size-0.75 rounded-full bg-muted-foreground" />
          <span className="size-0.75 rounded-full bg-muted-foreground" />
          <span className="size-0.75 rounded-full bg-muted-foreground" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
