"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"

/**
 * Blocks checkbox. A hairline square on the canvas that fills with ink when
 * checked or indeterminate. The accent appears only as the focus outline.
 *
 * Label it with <Label htmlFor> or <FieldLabel>, or wrap it in a label.
 * The hit area extends past the box so it is easy to tap.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative inline-flex size-(--selection-size) max-w-(--selection-size) min-w-(--selection-size) shrink-0 items-center justify-center rounded-xs border border-muted-foreground/75 bg-background text-primary-foreground",
        "outline-none transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
        "after:absolute after:-inset-2.5",
        "data-unchecked:not-data-indeterminate:hover:border-foreground",
        "focus-visible:focus-ring",
        "data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary",
        "group-data-[invalid=true]/field:border-destructive aria-invalid:border-destructive",
        "aria-invalid:aria-checked:border-primary group-data-[invalid=true]/field:aria-checked:border-primary",
        // Disabled: an empty box takes the muted fill and a lighter border, so
        // it stays visible; a checked box fades its ink.
        "data-disabled:cursor-not-allowed data-disabled:data-checked:opacity-50 data-disabled:data-indeterminate:opacity-50",
        "data-disabled:data-unchecked:not-data-indeterminate:border-muted-foreground/50 data-disabled:data-unchecked:not-data-indeterminate:bg-muted",
        "group-has-[>[data-slot=field]]/field-label:focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "grid place-content-center",
          "transition-[opacity,scale] duration-(--duration-fast) ease-out",
          "data-starting-style:scale-50 data-starting-style:opacity-0 data-ending-style:scale-50 data-ending-style:opacity-0"
        )}
      >
        <CheckIcon
          aria-hidden="true"
          strokeWidth={3}
          className="size-3.5 group-data-indeterminate/checkbox:hidden"
        />
        <MinusIcon
          aria-hidden="true"
          strokeWidth={3}
          className="hidden size-3.5 group-data-indeterminate/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
