"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Copies text to the clipboard and confirms with a check for two seconds. */
export function CopyButton({
  text,
  label = "Copy code",
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <CheckIcon aria-hidden="true" className="text-success" /> : <CopyIcon aria-hidden="true" />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  )
}
