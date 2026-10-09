import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/viewer/cn"

/**
 * Blocks empty state. A dashed outline marks the space content will fill;
 * an icon tile, a bold title, one sentence and the action that fixes it.
 *
 * - `variant="default"`: dashed border on the canvas.
 * - `variant="subtle"`: dashed border on a tinted band.
 * - `variant="plain"`: no border, for space that is already framed (a card,
 *   a table body).
 */
const emptyVariants = cva(
  "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-(--card-radius) px-(--card-padding) py-12 text-center text-balance sm:py-16",
  {
    variants: {
      variant: {
        default: "border border-dashed border-border-strong",
        subtle: "border border-dashed border-border-strong bg-subtle",
        plain: "border-0 py-10 sm:py-12",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Empty({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(emptyVariants({ variant }), className)}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-112 flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-3 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent text-muted-foreground",
        icon: "size-12 rounded-(--control-radius) border border-border bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("font-heading text-h4 text-foreground", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-body text-copy",
        "[&>a]:font-semibold [&>a]:text-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-brand",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-112 min-w-0 flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
