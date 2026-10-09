"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface InstallCommandProps {
  /** The shell command to show and copy. */
  command?: string
  /** Use "panel" inside dark panels. */
  tone?: "default" | "panel"
  className?: string
}

/**
 * A one-line shell command with a copy button. The button confirms with
 * "Copied" for a moment after a successful copy.
 */
export function InstallCommand({ command = "npm i -g lumen", tone = "default", className }: InstallCommandProps) {
  const panel = tone === "panel"
  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard is unavailable (insecure context or denied): select the
      // command so it can be copied by hand.
      const node = codeRef.current
      const selection = window.getSelection()
      if (node && selection) selection.selectAllChildren(node)
    }
  }

  return (
    <div
      data-slot="install-command"
      data-tone={tone}
      className={cn(
        "inline-flex h-(--control-height-lg) w-fit max-w-full min-w-0 items-center gap-3 rounded-(--control-radius) border pr-1.5 pl-4",
        panel ? "border-panel-border bg-terminal" : "border-border bg-subtle",
        className
      )}
    >
      <span aria-hidden="true" className={panel ? "font-mono text-code text-panel-muted select-none" : "font-mono text-code text-brand select-none"}>
        $
      </span>
      <code
        ref={codeRef}
        className={
          panel
            ? "min-w-0 flex-1 overflow-x-auto font-mono text-code whitespace-nowrap text-panel-foreground [scrollbar-width:none]"
            : "min-w-0 flex-1 overflow-x-auto font-mono text-code whitespace-nowrap text-foreground [scrollbar-width:none]"
        }
      >
        {command}
      </code>
      <Button
        type="button"
        variant="ghost"
        size={copied ? "sm" : "icon-sm"}
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className={cn(
          "shrink-0",
          panel
            ? "text-panel-muted hover:bg-panel-raised hover:text-panel-foreground aria-expanded:bg-panel-raised"
            : "text-muted-foreground hover:bg-background hover:text-foreground"
        )}
      >
        {copied ? (
          <>
            <CheckIcon data-icon="inline-start" className="text-success" />
            <span className={panel ? "text-panel-foreground" : "text-foreground"}>Copied</span>
          </>
        ) : (
          <CopyIcon />
        )}
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  )
}
