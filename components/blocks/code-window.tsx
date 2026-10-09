import * as React from "react"

import { cn } from "@/lib/utils"

export interface CodeWindowProps {
  /** Label in the title bar, such as "terminal" or a file name. */
  title?: string
  /**
   * Lines of output. Lines starting with "$" are prompts, "✓" are successes
   * and "→" are progress notes, shown muted.
   */
  lines?: string[]
  /** Custom content for the body. Replaces lines when set. */
  children?: React.ReactNode
  /**
   * Wrap long lines instead of scrolling sideways, with a hanging indent so
   * each line still reads as one. Use it for sentence-like output in
   * marketing visuals that must fit a phone; leave it off for logs and
   * tables, whose columns should scroll, and for code people copy.
   */
  wrap?: boolean
  className?: string
}

const defaultLines = [
  "$ lumen deploy",
  "→ Building acme/web from main (a41c9e2)",
  "→ Restored build cache in 1.2s",
  "✓ Built image in 14.2s",
  "→ Starting 2 replicas in fra-1",
  "✓ Health checks passed",
  "✓ Live at https://web.acme.dev",
]

function CodeLine({ text }: { text: string }) {
  if (text.startsWith("$")) {
    return (
      <span className="block">
        <span aria-hidden="true" className="text-panel-muted select-none">
          ${" "}
        </span>
        <span className="text-panel-foreground">{text.slice(1).trimStart()}</span>
      </span>
    )
  }
  if (text.startsWith("✓")) {
    return (
      <span className="block text-panel-foreground">
        <span className="text-success">✓</span>
        {text.slice(1)}
      </span>
    )
  }
  if (text.startsWith("→")) {
    return <span className="block text-panel-muted">{text}</span>
  }
  return <span className="block">{text === "" ? " " : text}</span>
}

/**
 * A dark terminal frame with a title bar. Pass lines for shell output, or
 * children for anything else (an editor view, a log stream).
 */
export function CodeWindow({ title = "terminal", lines, children, wrap = false, className }: CodeWindowProps) {
  const content = lines ?? (children ? null : defaultLines)
  return (
    <figure
      data-slot="code-window"
      aria-label={title}
      className={cn(
        "m-0 flex min-w-0 flex-col overflow-hidden rounded-(--card-radius) border border-panel-border bg-terminal",
        className
      )}
    >
      <div className="relative flex h-11 shrink-0 items-center border-b border-panel-border px-4">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
        </span>
        <figcaption className="pointer-events-none absolute inset-x-20 truncate text-center font-mono text-xs text-panel-muted">
          {title}
        </figcaption>
      </div>
      <div className={cn("min-h-0 flex-1", !wrap && "overflow-x-auto")}>
        {content ? (
          <pre
            data-wrap={wrap || undefined}
            className={cn(
              "m-0 px-5 py-5 font-mono text-code text-terminal-foreground",
              wrap ? "w-full whitespace-pre-wrap break-words" : "w-max min-w-full"
            )}
          >
            <code className={wrap ? "[&>span]:-indent-[2ch] [&>span]:pl-[2ch]" : undefined}>
              {content.map((line, i) => (
                <CodeLine key={i} text={line} />
              ))}
            </code>
          </pre>
        ) : (
          <div className="px-5 py-5 font-mono text-code text-terminal-foreground">{children}</div>
        )}
      </div>
    </figure>
  )
}
