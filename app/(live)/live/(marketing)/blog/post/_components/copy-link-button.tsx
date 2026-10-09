"use client"

import * as React from "react"
import { CheckIcon, LinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Copies the current page URL and confirms with "Link copied" for a moment. */
export function CopyLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable (insecure context or permission denied): leave the button as it was.
    }
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={copy} className={className}>
        {copied ? (
          <CheckIcon data-icon="inline-start" className="text-success" />
        ) : (
          <LinkIcon data-icon="inline-start" />
        )}
        {copied ? "Link copied" : "Copy link"}
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </>
  )
}
