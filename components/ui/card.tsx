import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Blocks card. Flat: a hairline border, --card-radius corners and
 * --card-padding inside (--card-padding-sm at size="sm"). No shadow.
 *
 * - `variant="default"`: bg-card on the canvas.
 * - `variant="subtle"`: a tinted fill (bg-muted, which stays one step off
 *   bg-card in dark), for cards that should recede.
 * - `variant="panel"`: the dark emphasis surface; stays dark in both themes.
 *
 * A CardHeader with `border-b` and the CardFooter run edge to edge. The inset
 * they use is the --card-inset variable, which follows the size.
 */
const cardVariants = cva(
  [
    "group/card relative flex min-w-0 flex-col overflow-hidden rounded-(--card-radius) border p-(--card-inset) text-body",
    // Media placed first or last bleeds to the edges.
    "*:[img:first-child]:-mx-(--card-inset) *:[img:first-child]:-mt-(--card-inset) *:[img:first-child]:w-[calc(100%+var(--card-inset)*2)] *:[img:first-child]:max-w-none",
    "*:[img:last-child]:-mx-(--card-inset) *:[img:last-child]:-mb-(--card-inset) *:[img:last-child]:w-[calc(100%+var(--card-inset)*2)] *:[img:last-child]:max-w-none",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        subtle: "border-border bg-muted text-foreground",
        panel: "border-panel-border bg-panel text-panel-foreground",
      },
      size: {
        default: "gap-6 [--card-inset:var(--card-padding)]",
        sm: "gap-4 [--card-inset:var(--card-padding-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5",
        "has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] has-data-[slot=card-action]:gap-x-4",
        // With a hairline, the header becomes an edge-to-edge band.
        "[.border-b]:-mx-(--card-inset) [.border-b]:-mt-(--card-inset) [.border-b]:p-(--card-inset)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-h4 text-foreground group-data-[size=sm]/card:text-title group-data-[variant=panel]/card:text-panel-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-pretty text-muted-foreground group-data-[variant=panel]/card:text-panel-muted",
        "[&_a]:font-semibold [&_a]:text-foreground [&_a]:underline-offset-4 [&_a:hover]:underline",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-2 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "min-w-0 text-copy group-data-[variant=panel]/card:text-panel-muted",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // The tinted band: bg-subtle sits one step off bg-card in both themes.
        "-mx-(--card-inset) -mb-(--card-inset) flex items-center gap-3 border-t border-border bg-subtle px-(--card-inset) py-4",
        "group-data-[variant=subtle]/card:bg-secondary group-data-[variant=panel]/card:border-panel-border group-data-[variant=panel]/card:bg-panel-raised",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
