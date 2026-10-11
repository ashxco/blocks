"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks badge. Status and counts in app UI only ("On track", "3 new").
 * Never a section label or an eyebrow above a heading.
 *
 * Height and radius come from --badge-height and --badge-radius. Status
 * variants use the -subtle fills with the matching status colour for text.
 * Single characters render as wide as the badge is tall, so counts line up.
 */
const badgeVariants = cva(
  [
    "group/badge inline-flex h-(--badge-height) w-fit min-w-(--badge-height) shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-(--badge-radius) border border-transparent px-2.5",
    // Tight, relative to the theme's own text-xs tracking (-0.025em where it has none).
    "font-sans text-xs font-semibold tracking-[calc(var(--text-xs--letter-spacing)-0.025em)] whitespace-nowrap tabular-nums",
    "transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:focus-ring",
    "has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
    "aria-invalid:border-destructive",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/85",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-accent",
        outline:
          "border-input bg-transparent text-foreground [a&]:hover:border-foreground/40",
        success: "bg-success-subtle text-success [a&]:hover:border-success/30",
        warning: "bg-warning-subtle text-warning [a&]:hover:border-warning/30",
        destructive:
          "bg-destructive-subtle text-destructive [a&]:hover:border-destructive/30",
        info: "bg-info-subtle text-info [a&]:hover:border-info/30",
        brand:
          "bg-brand-subtle text-brand-subtle-foreground [a&]:hover:border-brand/30",
        ghost:
          "bg-transparent text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-foreground",
        link: "h-auto min-w-0 rounded-none px-0 text-brand [a&]:link-underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
