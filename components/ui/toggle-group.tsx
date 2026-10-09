"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { isIconOnly, toggleVariants } from "@/components/ui/toggle"

type ToggleGroupSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>
type ToggleGroupVariant = NonNullable<VariantProps<typeof toggleVariants>["variant"]>

/**
 * Blocks toggle group.
 *
 * - `variant="default"`: a segmented control. Pill items sit in a muted pill
 *   track; the pressed item turns ink. The track is exactly as tall as a
 *   button of the same size.
 * - `variant="outline"`: separate outline pills, like filter chips. With
 *   `spacing={0}` they join into one pill with shared hairlines.
 */
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 1,
  orientation: "horizontal",
})

/* Items inside the segmented track: the track adds 1px border + 3px padding
   on each side, so items are 0.5rem shorter than the button height. */
const trackItemSizes: Record<ToggleGroupSize, string> = {
  sm: "h-[calc(var(--button-height-sm)-0.5rem)] min-w-[calc(var(--button-height-sm)-0.5rem)] px-2.5",
  default:
    "h-[calc(var(--button-height-md)-0.5rem)] min-w-[calc(var(--button-height-md)-0.5rem)] px-3.5",
  lg: "h-[calc(var(--button-height-lg)-0.5rem)] min-w-[calc(var(--button-height-lg)-0.5rem)] px-4",
}

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  spacing,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    /** Gap between items, in spacing units. Defaults to 1 in the segmented track and 2 for outline pills. */
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
      style={{ "--gap": gap } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
        resolvedVariant === "default" &&
          "rounded-(--button-radius) border border-border bg-muted p-0.75 data-vertical:rounded-xl",
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
        joined && [
          "rounded-none hover:z-10 data-pressed:z-10",
          vertical
            ? "-mt-px first:mt-0 first:rounded-t-(--button-radius) last:rounded-b-(--button-radius)"
            : "-ml-px first:ml-0 first:rounded-l-(--button-radius) last:rounded-r-(--button-radius)",
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
