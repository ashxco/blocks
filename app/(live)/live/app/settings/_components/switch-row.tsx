"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export interface SwitchRowProps {
  label: string
  /** Form field name, when the row sits in a form that saves with a button. */
  name?: string
  description: React.ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

/**
 * An on/off setting: label and description on the left, a switch on the
 * right. Stack rows inside a `divide-y` list, or give one row a `border-t`
 * at the end of a form.
 */
export function SwitchRow({
  label,
  name,
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
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(next) => onCheckedChange?.(next)}
      />
    </Field>
  )
}
