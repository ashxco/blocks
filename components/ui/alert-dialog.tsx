"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "@/components/viewer/cn"

import { Button } from "@/components/ui/button"

/**
 * Blocks alert dialog. Same surface as Dialog (bg-popover, hairline border,
 * --dialog-* tokens, blurred overlay) but with no close button: people answer
 * it with Cancel or the action. Use size="sm" for a short, centred question.
 */

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
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

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-(--z-overlay) grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6",
          "max-h-[calc(100dvh-2rem)] max-w-(--dialog-width) overflow-y-auto overscroll-contain",
          "data-[size=sm]:max-w-[calc(var(--dialog-width)*0.75)]",
          "rounded-(--dialog-radius) border bg-popover p-(--dialog-padding) text-body text-popover-foreground outline-none",
          "transition-[opacity,scale] duration-(--duration-base) ease-out",
          "data-starting-style:scale-98 data-starting-style:opacity-0",
          "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col items-start gap-2 text-left",
        "group-data-[size=sm]/alert-dialog-content:items-center group-data-[size=sm]/alert-dialog-content:text-center",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
        "group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
        className
      )}
      {...props}
    />
  )
}

/** An icon tile above the title. Tint it for the situation, e.g. bg-destructive-subtle text-destructive. */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-h4 text-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-body text-copy",
        "*:[a]:font-semibold *:[a]:text-brand *:[a]:underline-offset-4 *:[a]:hover:underline",
        "*:[strong]:font-semibold *:[strong]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
