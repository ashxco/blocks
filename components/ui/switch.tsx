"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

/**
 * Blocks switch. The track is sized by --switch-width and --switch-height,
 * a hairline grey (`bg-input`) when off and ink (`bg-primary`) when on. The
 * thumb slides with the base duration and stretches while pressed.
 *
 * Use a switch for settings that apply immediately. In a form that is saved
 * with a button, use a checkbox.
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent",
        "[--switch-track-h:var(--switch-height)] [--switch-track-w:var(--switch-width)]",
        "data-[size=sm]:[--switch-track-h:--spacing(5)] data-[size=sm]:[--switch-track-w:--spacing(8)]",
        "h-(--switch-track-h) w-(--switch-track-w) max-w-(--switch-track-w) min-w-(--switch-track-w)",
        "outline-none transition-[background-color,border-color] duration-(--duration-base) ease-standard",
        "after:absolute after:-inset-x-2 after:-inset-y-2.5",
        "data-unchecked:bg-input data-unchecked:hover:bg-muted-foreground/45",
        "data-checked:bg-primary data-checked:hover:bg-primary/85",
        "focus-visible:focus-ring",
        "group-data-[invalid=true]/field:border-destructive aria-invalid:border-destructive",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[calc(var(--switch-track-h)-var(--spacing))] rounded-full bg-white",
          "transition-[translate,width,background-color] duration-(--duration-base) ease-out",
          "data-checked:translate-x-[calc(var(--switch-track-w)-var(--switch-track-h))] data-checked:bg-primary-foreground",
          "[:not([data-disabled]):active>&]:w-(--switch-track-h)",
          "[:not([data-disabled]):active>&]:data-checked:translate-x-[calc(var(--switch-track-w)-var(--switch-track-h)-var(--spacing))]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
