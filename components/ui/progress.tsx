"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

/**
 * Blocks progress. A thin ink bar on a bg-secondary track. Put a ProgressLabel and
 * ProgressValue inside to show them above the bar. Pass `value={null}` for
 * work of unknown length: the bar sweeps, or rests at low contrast when the
 * user prefers reduced motion.
 */
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn(
        "flex w-full flex-wrap items-baseline gap-x-3 gap-y-2.5",
        className
      )}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1 w-full items-center overflow-hidden rounded-full bg-secondary",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full rounded-full bg-primary transition-[width] duration-(--duration-slow) ease-out",
        "data-indeterminate:w-2/5 data-indeterminate:-translate-x-full data-indeterminate:animate-out data-indeterminate:ease-in-out data-indeterminate:repeat-infinite data-indeterminate:[--tw-animation-duration:calc(var(--duration-slower)*2.5)] data-indeterminate:slide-out-to-right-[350%]",
        "motion-reduce:data-indeterminate:w-full motion-reduce:data-indeterminate:translate-x-0 motion-reduce:data-indeterminate:animate-none motion-reduce:data-indeterminate:opacity-30",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      // Tight, relative to the theme's own text-sm tracking (-0.025em where it has none).
      className={cn(
        "text-sm font-semibold tracking-[calc(var(--text-sm--letter-spacing)-0.025em)] text-foreground",
        className
      )}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
