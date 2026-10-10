"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks toggle. Shaped like a button (--button-radius) and turns ink when
 * pressed, like every selection control in Blocks. Heights follow the button
 * tokens so toggles line up with buttons in a toolbar. Icon-only toggles are
 * square, like icon buttons.
 */
const toggleVariants = cva(
  [
    "group/toggle relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-(--button-radius) border border-transparent",
    "text-label whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,translate] duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:focus-ring active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
    "aria-invalid:border-destructive",
    "data-pressed:bg-primary data-pressed:text-primary-foreground",
    "data-icon-only:aspect-square data-icon-only:px-0",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground data-pressed:hover:bg-primary/85 data-pressed:hover:text-primary-foreground",
        outline:
          "border-input bg-background text-foreground hover:border-foreground/40 dark:bg-transparent data-pressed:border-primary data-pressed:hover:border-primary/85 data-pressed:hover:bg-primary/85",
      },
      size: {
        default:
          "h-(--button-height-md) min-w-(--button-height-md) px-(--button-padding-x-sm) has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        sm: "h-(--button-height-sm) min-w-(--button-height-sm) gap-1 rounded-(--button-radius-sm) px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--button-height-lg) min-w-(--button-height-lg) px-(--button-padding-x-md) has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * True when the only child is a single element without children of its own,
 * such as a lucide icon. Icon-only toggles render square, like icon buttons.
 */
function isIconOnly(children: React.ReactNode) {
  const items = React.Children.toArray(children)
  if (items.length !== 1) return false
  const only = items[0]
  return (
    React.isValidElement<{ children?: React.ReactNode }>(only) &&
    only.props.children == null
  )
}

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      data-icon-only={isIconOnly(props.children) || undefined}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, isIconOnly, toggleVariants }
