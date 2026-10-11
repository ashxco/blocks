"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

import { Button } from "@/components/ui/button"
import { dialogStyles } from "@/components/ui/dialog"

/**
 * Blocks alert dialog. Same surface as Dialog (bg-popover, hairline border,
 * --dialog-* tokens, blurred overlay) but with no close button: people answer
 * it with Cancel or the action. Use size="sm" for a short, centred question.
 */

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return (
    <ScopedPortal
      portal={AlertDialogPrimitive.Portal}
      data-slot="alert-dialog-portal"
      {...props}
    />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(dialogStyles.overlay, className)}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  container,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
  /** Element to portal into instead of <body>, e.g. a preview stage. */
  container?: AlertDialogPrimitive.Portal.Props["container"]
}) {
  return (
    <AlertDialogPortal container={container}>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content",
          dialogStyles.popup,
          "data-[size=sm]:max-w-(--dialog-width-sm)",
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

const alertDialogMediaVariants = {
  // A hairline edge, like EmptyMedia's icon tile: bg-muted alone barely shows on bg-popover.
  default: "border-border bg-muted text-foreground",
  // The tint is the edge, so the border steps back.
  destructive: "border-transparent bg-destructive-subtle text-destructive",
} as const

/**
 * An icon tile above the title. variant="destructive" tints it for an action
 * that cannot be undone.
 */
function AlertDialogMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: keyof typeof alertDialogMediaVariants
}) {
  return (
    <div
      data-slot="alert-dialog-media"
      data-variant={variant}
      className={cn(
        "mb-2 inline-flex size-12 shrink-0 items-center justify-center rounded-(--control-radius) border",
        alertDialogMediaVariants[variant],
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
        "*:[a]:font-semibold *:[a]:text-brand *:[a]:link-underline",
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
    <Button data-slot="alert-dialog-action" className={className} {...props} />
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
      className={className}
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
