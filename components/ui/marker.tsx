"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks marker. Quiet inline status inside a conversation: "Acme is
 * reading the project brief", "Priya joined", "Yesterday". Caption-sized, muted,
 * with an optional leading icon, spinner or status dot.
 *
 * - default: a single line of status.
 * - separator: centred between two hairlines, for dates and hand-offs.
 * - border: a hairline underneath, for the end of a section.
 */
const markerVariants = cva(
  [
    "group/marker relative flex min-h-5 w-full items-center gap-2 text-left text-caption text-muted-foreground",
    "[&_svg:not([class*='size-'])]:size-3.5",
    "[a]:underline [a]:decoration-border-strong [a]:underline-offset-3 [a]:transition-colors [a]:duration-(--duration-fast) [a]:hover:text-foreground [a]:hover:decoration-foreground [a]:focus-visible:focus-ring",
  ],
  {
    variants: {
      variant: {
        default: "",
        separator:
          "gap-3 before:h-px before:min-w-0 before:flex-1 before:bg-border after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-3",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word",
        "group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
        "*:[strong]:font-semibold *:[strong]:text-foreground",
        "*:[a]:underline *:[a]:decoration-border-strong *:[a]:underline-offset-3 *:[a]:transition-colors *:[a]:duration-(--duration-fast) *:[a]:hover:text-foreground *:[a]:hover:decoration-foreground *:[a]:focus-visible:focus-ring",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
