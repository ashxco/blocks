"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { isIconOnly, toggleVariants } from "@/components/ui/toggle"

type ToggleGroupSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>
type ToggleGroupVariant = NonNullable<VariantProps<typeof toggleVariants>["variant"]>

/**
 * Blocks toggle group.
 *
 * - `variant="default"`: a segmented control. Items sit in a muted track in
 *   the button radius (the small button radius at `size="sm"`); the items take
 *   the track's radius minus its 1px border and 3px padding, so the corners
 *   nest, and the pressed item turns ink. The track is exactly as tall as a
 *   button of the same size. Vertical tracks hold rounded-rectangle items.
 * - `variant="outline"`: separate outline items, like filter chips. With
 *   `spacing={0}` they join into one shape with shared hairlines.
 */
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
    disabled?: boolean
  }
>({
  size: "default",
  variant: "default",
  spacing: 1,
  orientation: "horizontal",
  disabled: false,
})

/* Items inside the segmented track: the track adds 1px border + 3px padding
   on each side, so items are 0.5rem shorter than the button height and their
   radius is 0.25rem smaller than the track's (pills stay pills). */
const trackItemSizes: Record<ToggleGroupSize, string> = {
  sm: "h-[calc(var(--button-height-sm)-0.5rem)] min-w-[calc(var(--button-height-sm)-0.5rem)] rounded-[max(0px,calc(var(--button-radius-sm)-0.25rem))] px-2.5",
  default:
    "h-[calc(var(--button-height-md)-0.5rem)] min-w-[calc(var(--button-height-md)-0.5rem)] rounded-[max(0px,calc(var(--button-radius)-0.25rem))] px-3.5",
  lg: "h-[calc(var(--button-height-lg)-0.5rem)] min-w-[calc(var(--button-height-lg)-0.5rem)] rounded-[max(0px,calc(var(--button-radius)-0.25rem))] px-4",
}

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  spacing,
  orientation = "horizontal",
  disabled = false,
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    /** Gap between items, in spacing units. Defaults to 1 in the segmented track and 2 for outline items. */
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  const resolvedVariant: ToggleGroupVariant = variant ?? "default"
  const resolvedSize: ToggleGroupSize = size ?? "default"
  const gap = spacing ?? (resolvedVariant === "outline" ? 2 : 1)

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-spacing={gap}
      data-orientation={orientation}
      orientation={orientation}
      disabled={disabled}
      style={{ "--gap": gap } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
        // A disabled group fades as a whole, so the selected item keeps its ink.
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        resolvedVariant === "default" && [
          "rounded-(--button-radius) border border-border bg-muted p-0.75",
          // Small tracks follow small buttons, so a soft square (Forest) never turns into a pill.
          resolvedSize === "sm" && "rounded-(--button-radius-sm)",
          // Vertical tracks hold rounded rectangles; the track radius is the
          // item radius plus the 1px border and 3px padding, so corners nest.
          "data-vertical:rounded-[calc(var(--control-radius)+0.25rem)]",
        ],
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          variant: resolvedVariant,
          size: resolvedSize,
          spacing: gap,
          orientation,
          disabled,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const itemVariant: ToggleGroupVariant = context.variant || variant || "default"
  const itemSize: ToggleGroupSize = context.size || size || "default"
  const joined = itemVariant === "outline" && context.spacing === 0
  const vertical = context.orientation === "vertical"

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={itemVariant}
      data-size={itemSize}
      data-spacing={context.spacing}
      data-icon-only={isIconOnly(children) || undefined}
      className={cn(
        toggleVariants({ variant: itemVariant, size: itemSize }),
        "focus-visible:z-20",
        itemVariant === "default" && trackItemSizes[itemSize],
        // Vertical track items are rounded rectangles that read as a list.
        itemVariant === "default" &&
          vertical &&
          "justify-start rounded-(--control-radius) data-icon-only:justify-center",
        // Inside a disabled group the group fades, not each item.
        context.disabled && "disabled:opacity-100 data-disabled:opacity-100",
        joined && [
          "rounded-none hover:z-10 data-pressed:z-10",
          // Two pressed neighbours keep a faint divider so they read as two items.
          vertical
            ? "-mt-px first:mt-0 first:rounded-t-(--button-radius) last:rounded-b-(--button-radius) [[data-pressed]+&]:data-pressed:border-t-primary-foreground/40"
            : "-ml-px first:ml-0 first:rounded-l-(--button-radius) last:rounded-r-(--button-radius) [[data-pressed]+&]:data-pressed:border-l-primary-foreground/40",
        ],
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
