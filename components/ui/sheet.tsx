"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

import { Button } from "@/components/ui/button"
import { dialogStyles } from "@/components/ui/dialog"

/**
 * Blocks sheet. A dialog that slides in from an edge: bg-popover with a
 * hairline border on its inner edge, over the blurred overlay. Side sheets
 * are --sheet-width wide (less a margin on phones). Use variant="floating"
 * to inset it from the viewport with --dialog-radius corners. Header, body
 * and footer share --dialog-padding.
 */

type SheetSide = "top" | "right" | "bottom" | "left"

/** Where each side sits when flush against the viewport. */
const edgeSide: Record<SheetSide, string> = {
  right: "inset-y-0 right-0 border-l",
  left: "inset-y-0 left-0 border-r",
  top: "inset-x-0 top-0 border-b",
  bottom: "inset-x-0 bottom-0 border-t",
}

/** Where each side sits when floating, inset by 0.75rem. */
const floatingSide: Record<SheetSide, string> = {
  right: "inset-y-3 right-3",
  left: "inset-y-3 left-3",
  top: "inset-x-3 top-3",
  bottom: "inset-x-3 bottom-3",
}

/** Size and slide-in direction. Width is a plain class so callers can override it. */
const sideSize: Record<SheetSide, string> = {
  right:
    "w-[calc(100%-3rem)] max-w-(--sheet-width) data-starting-style:translate-x-[calc(100%+0.75rem)] data-ending-style:translate-x-[calc(100%+0.75rem)]",
  left: "w-[calc(100%-3rem)] max-w-(--sheet-width) data-starting-style:-translate-x-[calc(100%+0.75rem)] data-ending-style:-translate-x-[calc(100%+0.75rem)]",
  top: "max-h-[calc(100dvh-4rem)] data-starting-style:-translate-y-[calc(100%+0.75rem)] data-ending-style:-translate-y-[calc(100%+0.75rem)]",
  bottom:
    "max-h-[calc(100dvh-4rem)] data-starting-style:translate-y-[calc(100%+0.75rem)] data-ending-style:translate-y-[calc(100%+0.75rem)]",
}

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return (
    <ScopedPortal
      portal={SheetPrimitive.Portal}
      data-slot="sheet-portal"
      {...props}
    />
  )
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-(--z-overlay) bg-overlay backdrop-blur-glass",
        "transition-opacity duration-(--duration-slow) ease-out",
        "data-starting-style:opacity-0",
        "data-ending-style:opacity-0 data-ending-style:duration-(--duration-base) data-ending-style:ease-in",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  variant = "edge",
  showCloseButton = true,
  container,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide
  /** edge sits flush against the viewport; floating is inset with rounded corners. */
  variant?: "edge" | "floating"
  showCloseButton?: boolean
  /** Element to portal into instead of <body>, e.g. a preview stage. */
  container?: SheetPrimitive.Portal.Props["container"]
}) {
  return (
    <SheetPortal container={container}>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-variant={variant}
        data-closable={showCloseButton}
        className={cn(
          "group/sheet-content fixed z-(--z-overlay) flex flex-col bg-popover text-body text-popover-foreground outline-none",
          "transition-[translate] duration-(--duration-slow) ease-out",
          "data-ending-style:duration-(--duration-base) data-ending-style:ease-in",
          variant === "floating"
            ? cn("rounded-(--dialog-radius) border", floatingSide[side])
            : edgeSide[side],
          sideSize[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={dialogStyles.close}
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex shrink-0 flex-col gap-2 p-(--dialog-padding)",
        className
      )}
      {...props}
    />
  )
}

/** The scrolling middle of a sheet, between the header and the footer. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-(--dialog-padding) pb-(--dialog-padding)",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col-reverse gap-2 border-t px-(--dialog-padding) py-5 sm:flex-row sm:items-center sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        // Clear the close button on the title's line only, so the description
        // below runs the full width of the sheet.
        "text-h4 text-foreground group-data-[closable=true]/sheet-content:pr-10",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-body text-copy", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
