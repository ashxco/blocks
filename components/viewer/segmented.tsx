"use client"

import type { LucideIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

/**
 * A compact single-choice switch for viewer toolbars (appearance, width). It is
 * the system's own segmented toggle group: a hairline track where the chosen
 * segment turns ink, so the viewer's chrome matches what it documents.
 */
export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  label,
  iconOnly = false,
  className,
}: {
  value: T
  onValueChange: (value: T) => void
  options: SegmentedOption<T>[]
  /** Accessible name for the group. */
  label: string
  /** Show icons only; labels become accessible names and tooltips. */
  iconOnly?: boolean
  className?: string
}) {
  return (
    <ToggleGroup
      size="sm"
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0] as T)
      }}
      aria-label={label}
      className={cn("shrink-0", className)}
    >
      {options.map((option) => {
        const Icon = option.icon
        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            title={iconOnly ? option.label : undefined}
          >
            {Icon ? <Icon aria-hidden="true" /> : null}
            {iconOnly ? null : <span>{option.label}</span>}
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
