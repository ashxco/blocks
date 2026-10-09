"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export interface SwitchRowProps {
  label: string
  description: React.ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

/**
 * A setting that applies the moment it changes: label and description on the
 * left, a switch on the right. Stack rows inside a `divide-y` list.
 */
export function SwitchRow({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  className,
}: SwitchRowProps) {
  const id = React.useId()
  return (
    <Field orientation="horizontal" className={cn("gap-6 py-5 first:pt-0 last:pb-0", className)}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      <Switch
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(next) => onCheckedChange?.(next)}
      />
    </Field>
  )
}
