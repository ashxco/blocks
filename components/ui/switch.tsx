"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * Blocks switch. The track is sized by --switch-width and --switch-height
 * (--switch-*-sm for the small size), a mid grey when off and ink
 * (`bg-primary`) when on, so both states stay readable. The
 * thumb slides with the base duration and stretches while pressed.
 *
 * On dark panels use `variant="inverse"`: the track turns panel-foreground
 * when on and the thumb takes the panel colour, so the state keeps its
 * contrast in both themes.
 *
 * Use a switch for settings that apply immediately. In a form that is saved
 * with a button, use a checkbox.
 */
function Switch({
  className,
  size = "default",
  variant = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
  variant?: "default" | "inverse"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-variant={variant}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent",
        "[--switch-track-h:var(--switch-height)] [--switch-track-w:var(--switch-width)]",
        "data-[size=sm]:[--switch-track-h:var(--switch-height-sm)] data-[size=sm]:[--switch-track-w:var(--switch-width-sm)]",
        "h-(--switch-track-h) w-(--switch-track-w) max-w-(--switch-track-w) min-w-(--switch-track-w)",
        "outline-none transition-[background-color,border-color] duration-(--duration-base) ease-standard",
        "after:absolute after:-inset-x-2 after:-inset-y-2.5",
        variant === "inverse"
          ? [
              "data-unchecked:bg-panel-foreground/25 data-unchecked:hover:bg-panel-foreground/35",
              "data-checked:bg-panel-foreground data-checked:hover:bg-panel-foreground/88",
            ]
          : [
              "data-unchecked:bg-muted-foreground/35 data-unchecked:hover:bg-muted-foreground/50",
              "data-checked:bg-primary data-checked:hover:bg-primary/85",
            ],
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
          "pointer-events-none block size-[calc(var(--switch-track-h)-var(--spacing))] rounded-full",
          "transition-[translate,width,background-color] duration-(--duration-base) ease-out",
          variant === "inverse"
            ? "bg-panel-foreground data-checked:bg-panel"
            : "bg-white data-checked:bg-primary-foreground",
          "data-checked:translate-x-[calc(var(--switch-track-w)-var(--switch-track-h))]",
          "[:not([data-disabled]):active>&]:w-(--switch-track-h)",
          "[:not([data-disabled]):active>&]:data-checked:translate-x-[calc(var(--switch-track-w)-var(--switch-track-h)-var(--spacing))]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
