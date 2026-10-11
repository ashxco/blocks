"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/lib/utils"

/**
 * Blocks radio group. Items are hairline circles that fill with ink and show
 * a canvas-coloured dot when selected. The accent appears only as the focus
 * outline. Lay items out with `className` (a column by default); wrap items
 * in <FieldLabel> around a <Field> for choice cards.
 */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative inline-flex aspect-square size-(--selection-size) max-w-(--selection-size) min-w-(--selection-size) shrink-0 items-center justify-center rounded-full border border-muted-foreground/75 bg-background",
        "transition-[background-color,border-color] duration-(--duration-fast) ease-standard outline-none",
        "after:absolute after:-inset-2.5",
        "data-unchecked:hover:border-foreground",
        "focus-visible:focus-ring",
        "data-checked:border-primary data-checked:bg-primary",
        "group-data-[invalid=true]/field:border-destructive aria-invalid:border-destructive",
        "group-data-[invalid=true]/field:aria-checked:border-primary aria-invalid:aria-checked:border-primary",
        // Disabled: an empty circle takes the muted fill and a lighter border,
        // so it stays visible; a selected circle fades its ink.
        "data-disabled:cursor-not-allowed data-disabled:data-checked:opacity-50",
        "data-disabled:data-unchecked:border-muted-foreground/50 data-disabled:data-unchecked:bg-muted",
        "group-has-[>[data-slot=field]]/field-label:focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "flex items-center justify-center",
          "transition-[opacity,scale] duration-(--duration-fast) ease-out",
          "data-ending-style:scale-0 data-ending-style:opacity-0 data-starting-style:scale-0 data-starting-style:opacity-0"
        )}
      >
        <span className="size-2 rounded-full bg-primary-foreground" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
