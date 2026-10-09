"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

/**
 * Blocks attachment. A file shown as a small bordered card: media (icon or
 * thumbnail), a title and a description, with optional actions.
 *
 * state drives the look: idle is a dashed drop target, uploading and
 * processing pulse the title and dim thumbnails, error turns the card
 * destructive, done is the resting card. Add AttachmentTrigger to make the
 * whole card open the file.
 */
const attachmentVariants = cva(
  [
    "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-md border border-border bg-card text-card-foreground",
    "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
    "has-data-[slot=attachment-trigger]:hover:border-border-strong has-data-[slot=attachment-trigger]:hover:bg-subtle",
    "has-[[data-slot=attachment-trigger]:focus-visible]:focus-ring",
    "data-[state=idle]:border-dashed data-[state=idle]:border-border-strong data-[state=idle]:bg-transparent",
    "data-[state=error]:border-destructive/40 data-[state=error]:bg-destructive-subtle",
  ],
  {
    variants: {
      size: {
        default:
          "gap-3 p-2 text-sm has-data-[slot=attachment-content]:pr-3 not-has-[[data-slot=attachment-media]]:pl-3",
        sm: "gap-2.5 p-1.5 text-xs has-data-[slot=attachment-content]:pr-2.5 not-has-[[data-slot=attachment-media]]:pl-2.5",
        xs: "gap-2 rounded-sm p-1 text-xs has-data-[slot=attachment-content]:pr-2 not-has-[[data-slot=attachment-media]]:pl-2",
      },
      orientation: {
        horizontal: "min-w-48 items-center",
        vertical:
          "w-28 flex-col has-data-[slot=attachment-content]:w-36 has-data-[slot=attachment-content]:pr-2",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      aria-busy={state === "uploading" || state === "processing" || undefined}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  [
    "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-secondary text-foreground",
    "group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-xs",
    "group-data-[state=idle]/attachment:bg-muted group-data-[state=idle]/attachment:text-muted-foreground",
    "group-data-[state=error]/attachment:bg-background group-data-[state=error]/attachment:text-destructive",
    "group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6!",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=sm]/attachment:[&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  ],
  {
    variants: {
      variant: {
        icon: "",
        image: [
          "transition-opacity duration-(--duration-base) ease-standard",
          "opacity-50 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100",
          "*:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
        ],
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "grid max-w-full min-w-0 flex-1 gap-0.5 group-data-[orientation=vertical]/attachment:px-1 group-data-[orientation=vertical]/attachment:pb-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate leading-tight font-semibold text-foreground",
        "group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        "group-data-[state=idle]/attachment:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "block max-w-full min-w-0 truncate text-xs text-muted-foreground tabular-nums",
        // An error says what went wrong and how to fix it, so it wraps instead of truncating.
        "group-data-[state=error]/attachment:text-destructive group-data-[state=error]/attachment:whitespace-normal",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center gap-0.5",
        "group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(
        "text-muted-foreground hover:text-foreground",
        "group-data-[orientation=vertical]/attachment:border-border group-data-[orientation=vertical]/attachment:bg-background",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(
          "absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 no-scrollbar snap-x snap-mandatory scroll-px-1 gap-2 overflow-x-auto overscroll-x-contain p-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
