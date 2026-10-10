"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "@/lib/utils"
import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Blocks toast. Flat bordered cards that stack in the bottom-right corner and
 * fan out on hover. No shadow: the card is defined by its hairline border.
 *
 * The Toaster is mounted once in app/layout.tsx. Trigger toasts anywhere
 * through the shared manager:
 *
 *   toast.add({ title: "Invite sent", description: "Jordan Lee will get an email from Acme.", type: "success" })
 *   toast.add({ title: "Project archived", actionProps: { children: "Undo", onClick: restore } })
 *   toast.promise(exportReport(), { loading: "Exporting report…", success: "Report exported", error: "Export failed" })
 *
 * Types: "success", "info", "warning", "error", "loading".
 */
const toast = ToastPrimitive.createToastManager()

/** Shared by the live toast and ToastCard, so both look the same. */
const toastStyles = {
  surface:
    "rounded-(--card-radius) border border-popover-border bg-popover text-popover-foreground",
  content: "flex items-start gap-3 py-3.5 pr-3 pl-4",
  text: "flex min-w-0 flex-1 flex-col gap-0.5 py-px",
  title: "font-heading text-sm leading-snug font-bold tracking-(--text-title--letter-spacing) text-pretty text-foreground",
  description: "text-sm text-pretty text-muted-foreground",
  action: "shrink-0 self-center",
  close:
    "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
} as const

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-(--z-toast) mx-auto w-auto outline-none sm:right-6 sm:bottom-6 sm:left-auto sm:mx-0 sm:w-(--toast-width)",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        toastStyles.surface,
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom will-change-transform outline-none select-none focus-visible:focus-ring",
        "[--gap:0.625rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.625rem] [--scale:calc(max(0,1-(var(--toast-index)*0.05)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "[transition:transform_var(--duration-slower)_var(--ease-out),opacity_var(--duration-slow)_var(--ease-out),height_var(--duration-fast)_var(--ease-standard)]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-ending-style:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        toastStyles.content,
        "h-full overflow-hidden transition-opacity duration-(--duration-base) ease-out data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(toastStyles.title, className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(toastStyles.description, className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="xs" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn(toastStyles.action, className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-xs" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Dismiss notification"
      render={render}
      className={cn(toastStyles.close, className)}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" className="size-3.5" />}
    </ToastPrimitive.Close>
  )
}

const toastIcons: Record<string, { icon: React.ReactNode; className: string }> = {
  success: { icon: <CircleCheckIcon aria-hidden="true" />, className: "text-success" },
  info: { icon: <InfoIcon aria-hidden="true" />, className: "text-info" },
  warning: { icon: <TriangleAlertIcon aria-hidden="true" />, className: "text-warning" },
  error: { icon: <OctagonXIcon aria-hidden="true" />, className: "text-destructive" },
  loading: { icon: <Spinner aria-hidden="true" role="presentation" />, className: "text-muted-foreground" },
}

function ToastIcon({ type }: { type: string | undefined }) {
  const entry = type ? toastIcons[type] : undefined
  if (!entry) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      data-type={type}
      className={cn(
        "mt-px flex size-5 shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        entry.className
      )}
    >
      {entry.icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className={toastStyles.text}>
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

type ToastType = "success" | "info" | "warning" | "error" | "loading"

/**
 * A toast drawn in place, outside the toast manager: the same card, icon and
 * type as a live toast. Use it to show toasts in docs, design reviews and
 * empty states. It is static, so it has no live region; add role="status"
 * if you show one as feedback. Pass onClose to show the dismiss button.
 *
 *   <ToastCard type="success" title="Invite sent" description="Jordan Lee will get an email from Acme." />
 */
function ToastCard({
  type,
  title,
  description,
  action,
  onClose,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  /** A short action, such as an outline xs Button labelled Undo. */
  action?: React.ReactNode
  /** Shows the dismiss button and is called when it is pressed. */
  onClose?: () => void
}) {
  return (
    <div
      data-slot="toast-card"
      data-type={type}
      className={cn(toastStyles.surface, "w-full", className)}
      {...props}
    >
      <div className={toastStyles.content}>
        <ToastIcon type={type} />
        <div className={toastStyles.text}>
          <p className={toastStyles.title}>{title}</p>
          {description ? (
            <p className={toastStyles.description}>{description}</p>
          ) : null}
        </div>
        {action ? <div className={toastStyles.action}>{action}</div> : null}
        {onClose ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Dismiss notification"
            onClick={onClose}
            className={toastStyles.close}
          >
            <XIcon aria-hidden="true" className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastCard,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}
