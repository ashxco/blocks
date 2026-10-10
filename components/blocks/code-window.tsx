import * as React from "react"

import { cn } from "@/lib/utils"

export interface CodeWindowProps {
  /** Label in the title bar, such as a file name. */
  title?: string
  /**
   * Lines of code or output. Lines starting with "//" are comments and "→"
   * are notes, both shown muted; "$" starts a shell prompt and "✓" marks a
   * success.
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
  'import { Acme } from "@acme/sdk"',
  "",
  "const acme = new Acme({",
  "  apiKey: process.env.ACME_API_KEY,",
  "})",
  "",
  "// Add a task to Website relaunch",
  "const task = await acme.tasks.create({",
  '  title: "Write launch announcement",',
  '  projectId: "website-relaunch",',
  '  assignee: "priya@acme.com",',
  "})",
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
        <span className="text-panel-success">✓</span>
        {text.slice(1)}
      </span>
    )
  }
  if (text.startsWith("→") || text.trimStart().startsWith("//")) {
    return <span className="block text-panel-muted">{text}</span>
  }
  return <span className="block">{text === "" ? " " : text}</span>
}

/**
 * A dark editor frame with a title bar, for code samples such as an API
 * example. Pass lines for code or shell output, or children for anything
 * else, such as a highlighted response.
 */
export function CodeWindow({ title = "create-task.ts", lines, children, wrap = false, className }: CodeWindowProps) {
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
      {/* Narrow windows set the title after the dots, left-aligned; from 20rem it centres in the bar. */}
      <div className="@container/bar relative flex h-11 shrink-0 items-center gap-3 border-b border-panel-border px-4">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
          <span className="size-2.5 rounded-full bg-panel-foreground/15" />
        </span>
        <figcaption className="pointer-events-none min-w-0 flex-1 truncate font-mono text-xs text-panel-muted @min-[20rem]/bar:absolute @min-[20rem]/bar:inset-x-20 @min-[20rem]/bar:text-center">
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
