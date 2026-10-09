"use client"

import * as React from "react"

import { CodeWindow } from "@/components/blocks/code-window"
import { cn } from "@/lib/utils"

type LineKind = "prompt" | "note" | "ok"

interface LogLine {
  /** Seconds since the push, as the log prints it. */
  at: string
  kind: LineKind
  text: string
  /** Pause before this line appears, in milliseconds. */
  delay: number
}

const LINES: LogLine[] = [
  { at: "0.0s", kind: "prompt", text: "git push origin main", delay: 500 },
  { at: "0.4s", kind: "note", text: "Building acme/storefront at 9f2c41e", delay: 700 },
  { at: "1.1s", kind: "note", text: "Restored build cache (412 MB)", delay: 550 },
  { at: "7.9s", kind: "ok", text: "Installed 1,284 packages", delay: 900 },
  { at: "26.3s", kind: "ok", text: "Built 214 routes", delay: 1100 },
  { at: "29.8s", kind: "note", text: "Rolling out to iad1, fra1, sin1", delay: 800 },
  { at: "34.2s", kind: "ok", text: "Health checks passed (6/6)", delay: 950 },
  { at: "34.6s", kind: "ok", text: "Live at storefront.acme.dev", delay: 500 },
]

const symbol: Record<LineKind, { char: string; className: string }> = {
  prompt: { char: "$", className: "text-panel-muted" },
  note: { char: "→", className: "text-panel-muted" },
  ok: { char: "✓", className: "text-success" },
}

/**
 * A production deploy streaming into a terminal window, one line at a time.
 * Every line is laid out from the start, so the window never changes height.
 * Under reduced motion the finished log shows straight away.
 */
export function DeployLog({ className }: { className?: string }) {
  const [shown, setShown] = React.useState(0)
  const ready = shown >= LINES.length

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timers: ReturnType<typeof setTimeout>[] = []
    if (reduce) {
      timers.push(setTimeout(() => setShown(LINES.length), 0))
    } else {
      let elapsed = 0
      LINES.forEach((line, index) => {
        elapsed += line.delay
        timers.push(setTimeout(() => setShown(index + 1), elapsed))
      })
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <CodeWindow title="acme/storefront · production" className={className}>
      <ol className="grid gap-0.5">
        {LINES.map((line, index) => {
          const visible = index < shown
          const s = symbol[line.kind]
          return (
            <li
              key={line.at + line.text}
              aria-hidden={visible ? undefined : true}
              className={cn(
                "flex gap-3 whitespace-nowrap transition-opacity duration-(--duration-base) ease-out",
                visible ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="w-11 shrink-0 text-right text-panel-foreground/35 tabular">{line.at}</span>
              <span aria-hidden="true" className={cn("shrink-0 select-none", s.className)}>
                {s.char}
              </span>
              <span className={line.kind === "note" ? "text-panel-muted" : "text-panel-foreground"}>
                {line.text}
                {index === shown - 1 && !ready ? (
                  <span
                    aria-hidden="true"
                    className="ml-1.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-panel-foreground/70"
                  />
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-panel-border pt-4 font-sans text-caption">
        <span className="flex items-center gap-2 text-panel-foreground">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full transition-colors duration-(--duration-base)",
              ready ? "bg-success" : "animate-pulse bg-warning"
            )}
          />
          <span className="font-semibold">{ready ? "Ready" : "Building"}</span>
          {ready ? <span className="text-panel-muted tabular">in 34.6s</span> : null}
        </span>
        <span className="truncate text-panel-muted">main · 9f2c41e</span>
      </div>
    </CodeWindow>
  )
}
