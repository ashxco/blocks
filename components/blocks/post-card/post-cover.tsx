import * as React from "react"

import { cn } from "@/lib/utils"

/** Flat fills for covers, portraits and screenshots. "panel" is the dark emphasis surface. */
export type CoverTint = "violet" | "mint" | "sand" | "sky" | "rose" | "panel"

/** Simple shape compositions. No gradients, no images. */
export type CoverPattern = "window" | "terminal" | "orbit" | "bars" | "grid" | "branch"

export const coverTints: CoverTint[] = ["violet", "mint", "sand", "sky", "rose", "panel"]
export const coverPatterns: CoverPattern[] = ["window", "terminal", "orbit", "bars", "grid", "branch"]

/** Background utility for each tint. Full class names so Tailwind can see them. */
export const tintClass: Record<CoverTint, string> = {
  violet: "bg-tint-violet",
  mint: "bg-tint-mint",
  sand: "bg-tint-sand",
  sky: "bg-tint-sky",
  rose: "bg-tint-rose",
  panel: "bg-panel",
}

/** Text colour that reads on each tint. */
export const tintInkClass: Record<CoverTint, string> = {
  violet: "text-foreground",
  mint: "text-foreground",
  sand: "text-foreground",
  sky: "text-foreground",
  rose: "text-foreground",
  panel: "text-panel-foreground",
}

interface Tone {
  ink: string
  soft: string
  paper: string
  paperSoft: string
  line: string
  hair: string
}

const lightTone: Tone = {
  ink: "bg-foreground",
  soft: "bg-foreground/12",
  paper: "bg-background",
  paperSoft: "bg-background/60",
  line: "border-foreground",
  hair: "border-foreground/10",
}

const panelTone: Tone = {
  ink: "bg-panel-foreground",
  soft: "bg-panel-foreground/15",
  paper: "bg-panel-raised",
  paperSoft: "bg-panel-raised/70",
  line: "border-panel-foreground",
  hair: "border-panel-border",
}

export interface PostCoverProps {
  pattern?: CoverPattern
  tint?: CoverTint
  /** Aspect ratio and radius come from the caller; defaults to 16:10 with the card radius. */
  className?: string
}

/**
 * A flat, tinted cover drawn from simple shapes. Decorative: it is hidden
 * from assistive technology, so the post title must carry the meaning.
 */
export function PostCover({ pattern = "window", tint = "violet", className }: PostCoverProps) {
  const tone = tint === "panel" ? panelTone : lightTone

  return (
    <div
      aria-hidden="true"
      data-slot="post-cover"
      data-pattern={pattern}
      className={cn(
        "relative isolate aspect-16/10 w-full overflow-hidden rounded-(--card-radius)",
        tintClass[tint],
        className
      )}
    >
      <div className="absolute inset-0 transition-transform duration-(--duration-slower) ease-out group-hover:scale-103">
        {pattern === "window" && <WindowShape tone={tone} />}
        {pattern === "terminal" && <TerminalShape />}
        {pattern === "orbit" && <OrbitShape tone={tone} />}
        {pattern === "bars" && <BarsShape tone={tone} />}
        {pattern === "grid" && <GridShape tone={tone} />}
        {pattern === "branch" && <BranchShape tone={tone} />}
      </div>
    </div>
  )
}

function WindowShape({ tone }: { tone: Tone }) {
  return (
    <div className={cn("absolute top-1/5 left-1/8 h-full w-full rounded-lg border p-3", tone.paper, tone.hair)}>
      <div className="flex gap-1">
        <span className={cn("size-1.5 rounded-full", tone.soft)} />
        <span className={cn("size-1.5 rounded-full", tone.soft)} />
        <span className={cn("size-1.5 rounded-full", tone.soft)} />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="grid w-1/6 content-start gap-2">
          <span className={cn("h-1.5 rounded-full", tone.ink)} />
          <span className={cn("h-1.5 rounded-full", tone.soft)} />
          <span className={cn("h-1.5 rounded-full", tone.soft)} />
          <span className={cn("h-1.5 w-2/3 rounded-full", tone.soft)} />
        </div>
        <div className="grid flex-1 content-start gap-2">
          <span className={cn("h-2.5 w-1/3 rounded-full", tone.ink)} />
          <span className={cn("h-1.5 w-1/2 rounded-full", tone.soft)} />
          <div className="mt-2 grid grid-cols-3 gap-2 pr-10">
            <span className={cn("h-10 rounded-md", tone.soft)} />
            <span className={cn("h-10 rounded-md", tone.soft)} />
            <span className={cn("h-10 rounded-md", tone.ink)} />
          </div>
          <span className={cn("mt-1 h-1.5 w-1/2 rounded-full", tone.soft)} />
          <span className={cn("h-1.5 w-2/5 rounded-full", tone.soft)} />
        </div>
      </div>
    </div>
  )
}

function TerminalShape() {
  return (
    <div className="absolute top-1/5 left-1/8 h-full w-full rounded-lg border border-panel-border bg-terminal p-4 font-mono text-xs text-terminal-foreground">
      <div className="flex gap-1">
        <span className="size-1.5 rounded-full bg-terminal-foreground/30" />
        <span className="size-1.5 rounded-full bg-terminal-foreground/30" />
        <span className="size-1.5 rounded-full bg-terminal-foreground/30" />
      </div>
      <div className="mt-4 grid gap-1.5 whitespace-nowrap">
        <span>
          <span className="text-terminal-foreground/50">$ </span>lumen deploy
        </span>
        <span className="text-terminal-foreground/50">→ build 12s</span>
        <span className="text-success">✓ live</span>
      </div>
    </div>
  )
}

function OrbitShape({ tone }: { tone: Tone }) {
  return (
    <>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 aspect-square h-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
          tone.line
        )}
      />
      <span className={cn("absolute top-1/2 left-1/2 aspect-square h-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full", tone.ink)} />
      <span
        className={cn(
          "absolute top-1/10 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
          tone.paper,
          tone.line
        )}
      />
      <span className={cn("absolute bottom-1/10 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full", tone.ink)} />
    </>
  )
}

const barHeights = ["h-2/5", "h-1/2", "h-1/3", "h-3/5", "h-4/5", "h-full"]

function BarsShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/6 top-1/5 bottom-0 flex items-end gap-2">
      {barHeights.map((h, i) => (
        <span
          key={h}
          className={cn("flex-1 rounded-t-md", h, i === barHeights.length - 1 ? tone.ink : i === 3 ? tone.paper : tone.soft)}
        />
      ))}
    </div>
  )
}

function GridShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/8 inset-y-1/5 grid grid-cols-6 grid-rows-3 gap-2">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className={cn("rounded-md", i === 8 ? tone.ink : i === 3 || i === 13 ? tone.paper : tone.paperSoft)}
        />
      ))}
    </div>
  )
}

const commitDots = [
  { pos: "top-3/5 left-1/8", filled: false },
  { pos: "top-3/5 left-1/4", filled: false },
  { pos: "top-1/3 left-5/12", filled: false },
  { pos: "top-1/3 left-7/12", filled: false },
  { pos: "top-3/5 left-3/4", filled: true },
  { pos: "top-3/5 left-7/8", filled: false },
]

function BranchShape({ tone }: { tone: Tone }) {
  return (
    <>
      <span className={cn("absolute inset-x-0 top-3/5 h-0.5 -translate-y-1/2", tone.ink)} />
      <span className={cn("absolute top-1/3 right-1/4 bottom-2/5 left-1/4 rounded-t-3xl border-2 border-b-0", tone.line)} />
      {commitDots.map((dot) => (
        <span
          key={dot.pos}
          className={cn(
            "absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
            dot.pos,
            tone.line,
            dot.filled ? tone.ink : tone.paper
          )}
        />
      ))}
    </>
  )
}
