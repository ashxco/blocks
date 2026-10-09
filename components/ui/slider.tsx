"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

function toValues(input: number | readonly number[] | undefined) {
  if (input === undefined) return undefined
  return typeof input === "number" ? [input] : input
}

/**
 * Blocks slider. A hairline-grey track with an ink range and a
 * canvas-coloured thumb ringed in ink. Pass a number for one thumb or an
 * array for a range. The violet focus outline sits on the thumb.
 *
 * Label it with `aria-labelledby` (pointing at a <Label id>) or with
 * `getAriaLabel` for range sliders, where each thumb needs its own name.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  ...props
}: SliderPrimitive.Root.Props & {
  /** Accessible name for each thumb, by index. */
  getAriaLabel?: (index: number) => string
  /** Readable value for each thumb, such as "1,024 MB". */
  getAriaValueText?: (formattedValue: string, value: number, index: number) => string
}) {
  const values = toValues(value) ?? toValues(defaultValue) ?? [min]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "group/slider relative data-horizontal:w-full data-vertical:h-full",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(
          "relative flex w-full touch-none items-center py-2 select-none",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-vertical:px-2 data-vertical:py-0"
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-input select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            className={cn(
              "relative block size-5 shrink-0 rounded-full border-2 border-primary bg-background select-none",
              "transition-[scale] duration-(--duration-fast) ease-standard",
              "after:absolute after:-inset-2.5",
              "hover:scale-110 data-dragging:scale-110",
              "has-[:focus-visible]:focus-ring",
              "data-disabled:pointer-events-none"
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
