"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export interface WorkspaceUrlInputProps
  extends React.ComponentProps<typeof InputGroupInput> {
  /** Host shown before the slug. */
  domain?: string
  /** Content at the end of the field, such as an availability check. */
  endAddon?: React.ReactNode
  /** Classes for the field's group (the bordered box). `className` goes to the input. */
  groupClassName?: string
}

/**
 * The workspace URL field: the host as a mono prefix and the slug in mono
 * right after it, so the two read as one address. Onboarding, the workspace
 * settings and the SettingsSection defaults all use it, so the field looks
 * the same wherever people meet it.
 */
export function WorkspaceUrlInput({
  domain = "app.acme.com",
  endAddon,
  groupClassName,
  className,
  ...props
}: WorkspaceUrlInputProps) {
  return (
    <InputGroup className={groupClassName}>
      <InputGroupAddon>
        <InputGroupText className="font-mono">{domain}/</InputGroupText>
      </InputGroupAddon>
      {/* A text prefix: the input group starts the slug right after it, so the two read as one address. */}
      <InputGroupInput
        spellCheck={false}
        autoCapitalize="none"
        autoComplete="off"
        className={cn("font-mono", className)}
        {...props}
      />
      {endAddon ? (
        <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
