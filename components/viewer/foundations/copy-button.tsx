"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Copies text to the clipboard and reports success for a short moment. */
export function useCopy(timeout = 1400) {
  const [copied, setCopied] = React.useState<string | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        return false
      }
      setCopied(text)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), timeout)
      return true
    },
    [timeout]
  )

  return { copied, copy }
}

/** Small icon button that copies `value`. */
export function CopyButton({
  value,
  label,
  inverse = false,
}: {
  value: string
  /** Accessible label, e.g. "Copy --brand". */
  label?: string
  /** Use on dark panels. */
  inverse?: boolean
}) {
  const { copied, copy } = useCopy()
  const done = copied === value
  return (
    <Button
      type="button"
      size="icon-xs"
      variant={inverse ? "outline-inverse" : "ghost"}
      aria-label={label ?? `Copy ${value}`}
      onClick={() => void copy(value)}
      className={inverse ? undefined : "text-muted-foreground hover:text-foreground"}
    >
      {done ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite" className="sr-only">
        {done ? "Copied" : ""}
      </span>
    </Button>
  )
}
