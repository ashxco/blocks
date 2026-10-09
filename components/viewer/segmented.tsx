"use client"

import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

/**
 * A compact single-choice switch for viewer toolbars (theme, width). The
 * selected segment is a background-coloured pill with a hairline, so it reads
 * as raised without a shadow.
 */
export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  label,
  iconOnly = false,
  labelClassName,
  className,
}: {
  value: T
  onValueChange: (value: T) => void
  options: SegmentedOption<T>[]
  /** Accessible name for the group. */
  label: string
  /** Show icons only; labels become accessible names and tooltips. */
  iconOnly?: boolean
  /** Classes for the visible labels, e.g. "hidden sm:inline" to show icons only on phones. */
  labelClassName?: string
  className?: string
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0] as T)
      }}
      aria-label={label}
      className={cn("inline-flex items-center gap-0.5 rounded-(--button-radius) border bg-muted p-0.5", className)}
    >
      {options.map((option) => {
        const Icon = option.icon
        return (
          <Toggle
            key={option.value}
            value={option.value}
            aria-label={option.label}
            title={iconOnly ? option.label : undefined}
            className={cn(
              "inline-flex h-7 items-center justify-center gap-1.5 rounded-(--button-radius) border border-transparent text-caption font-semibold text-muted-foreground outline-none select-none",
              "transition-colors duration-(--duration-fast) ease-standard hover:text-foreground focus-visible:focus-ring",
              "data-[pressed]:border-border data-[pressed]:bg-background data-[pressed]:text-foreground",
              iconOnly ? "w-8" : "px-2.5 sm:px-3",
              "[&_svg]:size-3.5 [&_svg]:shrink-0"
            )}
          >
            {Icon ? <Icon aria-hidden="true" /> : null}
            {iconOnly ? null : <span className={labelClassName}>{option.label}</span>}
          </Toggle>
        )
      })}
    </ToggleGroup>
  )
}
