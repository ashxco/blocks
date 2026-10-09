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
  /**
   * Wrap a long command onto more lines, with a hanging indent, instead of
   * scrolling it sideways. Use it in narrow slots, where a command cut off at
   * the edge looks broken. The copy button still copies it as one line.
   */
  wrap?: boolean
  className?: string
}

/**
 * A one-line shell command with a copy button. The button confirms with
 * "Copied" for a moment after a successful copy.
 */
export function InstallCommand({
  command = "npm i -g lumen",
  tone = "default",
  wrap = false,
  className,
}: InstallCommandProps) {
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
      data-wrap={wrap || undefined}
      className={cn(
        "inline-flex w-fit max-w-full min-w-0 items-center gap-3 rounded-(--control-radius) border pr-1.5 pl-4",
        wrap ? "min-h-(--control-height-lg) py-1.5" : "h-(--control-height-lg)",
        panel ? "border-panel-border bg-terminal" : "border-border bg-subtle",
        className
      )}
    >
      {wrap ? (
        // The prompt flows with the first line; wrapped lines hang under the command.
        <p
          className={cn(
            "min-w-0 flex-1 py-1 pl-[calc(1ch+--spacing(3))] -indent-[calc(1ch+--spacing(3))] font-mono text-code",
            panel ? "text-panel-foreground" : "text-foreground"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("mr-3 inline-block indent-0 select-none", panel ? "text-panel-muted" : "text-muted-foreground")}
          >
            $
          </span>
          {/* Each word is one box, so lines break at spaces, never after the hyphens in a flag. A word wider than the box breaks inside. */}
          <code ref={codeRef}>
            {command.split(" ").map((word, i) => (
              <React.Fragment key={i}>
                {i > 0 ? " " : null}
                <span className="inline-block max-w-full indent-0 wrap-anywhere">{word}</span>
              </React.Fragment>
            ))}
          </code>
        </p>
      ) : (
        <>
          <span aria-hidden="true" className={cn("font-mono text-code select-none", panel ? "text-panel-muted" : "text-muted-foreground")}>
            $
          </span>
          <code
            ref={codeRef}
            className={cn(
              "min-w-0 flex-1 overflow-x-auto font-mono text-code whitespace-nowrap [scrollbar-width:none]",
              panel ? "text-panel-foreground" : "text-foreground"
            )}
          >
            {command}
          </code>
        </>
      )}
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
            <CheckIcon data-icon="inline-start" className={panel ? "text-panel-success" : "text-success"} />
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
