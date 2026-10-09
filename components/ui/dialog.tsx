"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

import { Button } from "@/components/ui/button"

/**
 * Blocks dialog. A flat bg-popover card with a hairline border on a blurred
 * overlay. Radius, padding and width come from --dialog-* tokens; the title
 * uses the text-h4 role. It enters with a fade and a 98% scale on ease-out and
 * leaves faster on ease-in.
 *
 *   <Dialog>
 *     <DialogTrigger render={<Button variant="outline" />}>Rename</DialogTrigger>
 *     <DialogContent>…</DialogContent>
 *   </Dialog>
 */

type DialogSize = "sm" | "default" | "lg"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <ScopedPortal portal={DialogPrimitive.Portal} data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-(--z-overlay) bg-overlay backdrop-blur-glass",
        "transition-opacity duration-(--duration-base) ease-out",
        "data-starting-style:opacity-0",
        "data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  container,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  /** Maximum width: --dialog-width, or --dialog-width-sm / --dialog-width-lg. */
  size?: DialogSize
  /** Element to portal into instead of <body>, e.g. a preview stage. */
  container?: DialogPrimitive.Portal.Props["container"]
}) {
  return (
    <DialogPortal container={container}>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        data-closable={showCloseButton}
        className={cn(
          "group/dialog-content fixed top-1/2 left-1/2 z-(--z-overlay) grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6",
          "max-h-[calc(100dvh-2rem)] max-w-(--dialog-width) overflow-y-auto overscroll-contain",
          "data-[size=sm]:max-w-(--dialog-width-sm) data-[size=lg]:max-w-(--dialog-width-lg)",
          "rounded-(--dialog-radius) border bg-popover p-(--dialog-padding) text-body text-popover-foreground outline-none",
          "transition-[opacity,scale] duration-(--duration-base) ease-out",
          "data-starting-style:scale-98 data-starting-style:opacity-0",
          "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
          className
        )}
        {...props}
      >
        {children}
        {/* Centred on the first line of the text-h4 title. */}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-[calc(var(--dialog-padding)+var(--text-h4)*var(--text-h4--line-height)/2-var(--button-height-sm)/2)] right-[calc(var(--dialog-padding)+var(--text-h4)*var(--text-h4--line-height)/2-var(--button-height-sm)/2)] text-muted-foreground hover:text-foreground"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        // Clear the close button on the title's line only, so the description
        // below runs the full width of the dialog.
        "text-h4 text-foreground group-data-[closable=true]/dialog-content:pr-10",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-body text-copy",
        "*:[a]:font-semibold *:[a]:text-brand *:[a]:underline-offset-4 *:[a]:hover:underline",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
