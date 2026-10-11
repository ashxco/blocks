"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** How long a copy is confirmed before the control returns to normal. */
const CONFIRM_MS = 2000

/**
 * Copies text to the clipboard. `copied` is the text last copied, for a
 * moment, so a list of copy controls can confirm the one that was used.
 */
export function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (copied === null) return
    const id = window.setTimeout(() => setCopied(null), CONFIRM_MS)
    return () => window.clearTimeout(id)
  }, [copied])

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
    } catch {
      setCopied(null)
    }
  }, [])

  return { copied, copy }
}

/** An icon button that copies `text` and confirms with a check. */
export function CopyButton({
  text,
  label = "Copy code",
  size = "icon-sm",
  className,
}: {
  text: string
  /** Accessible name, e.g. "Copy --brand". */
  label?: string
  size?: "icon-sm" | "icon-xs"
  className?: string
}) {
  const { copied, copy } = useCopy()
  const done = copied === text
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={className}
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
      onClick={() => void copy(text)}
    >
      {done ? (
        <CheckIcon aria-hidden="true" className="text-success" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
      <span aria-live="polite" className="sr-only">
        {done ? "Copied to clipboard" : ""}
      </span>
    </Button>
  )
}
