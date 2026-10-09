import * as React from "react"
import { CheckIcon, LockIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Flat fills for covers, portraits and screenshots. "panel" is the dark emphasis surface. */
export type CoverTint = "violet" | "mint" | "sand" | "sky" | "rose" | "panel"

/** Simple shape compositions. No gradients, no images. */
export type CoverPattern =
  | "window"
  | "terminal"
  | "orbit"
  | "bars"
  | "grid"
  | "branch"
  | "compare"
  | "regions"
  | "uptime"
  | "stack"
  | "menubar"
  | "fields"
  | "address"

/** One bar of the "compare" pattern. */
export interface CoverFigure {
  /** Short label above the bar, e.g. "Before". */
  label: string
  /** The figure printed at the end of the bar, e.g. "61s". */
  value: string
  /** Bar length from 0 to 1, relative to the longest bar. */
  share: number
}

export const coverTints: CoverTint[] = ["violet", "mint", "sand", "sky", "rose", "panel"]
export const coverPatterns: CoverPattern[] = [
  "window",
  "terminal",
  "orbit",
  "bars",
  "grid",
  "branch",
  "compare",
  "regions",
  "uptime",
  "stack",
  "menubar",
  "fields",
  "address",
]

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
  /** Between soft and ink, for a second series. */
  mid: string
  soft: string
  paper: string
  paperSoft: string
  line: string
  hair: string
  text: string
  muted: string
}

const lightTone: Tone = {
  ink: "bg-foreground",
  mid: "bg-foreground/35",
  soft: "bg-foreground/12",
  paper: "bg-background",
  paperSoft: "bg-background/60",
  line: "border-foreground",
  hair: "border-foreground/10",
  text: "text-foreground",
  muted: "text-foreground/60",
}

const panelTone: Tone = {
  ink: "bg-panel-foreground",
  mid: "bg-panel-foreground/40",
  soft: "bg-panel-foreground/15",
  paper: "bg-panel-raised",
  paperSoft: "bg-panel-raised/70",
  line: "border-panel-foreground",
  hair: "border-panel-border",
  text: "text-panel-foreground",
  muted: "text-panel-muted",
}

const defaultFigures: CoverFigure[] = [
  { label: "Before", value: "61s", share: 1 },
  { label: "After", value: "18s", share: 0.29 },
]

export interface PostCoverProps {
  pattern?: CoverPattern
  tint?: CoverTint
  /** Bars for the "compare" pattern, longest first. The last bar is drawn in ink. */
  figures?: CoverFigure[]
  /**
   * "sm" is a fixed 6rem × 4.5rem thumbnail for lists. It draws the whole
   * composition at card size and scales it down, so the pattern reads as a
   * miniature of the cover instead of a cropped corner.
   */
  size?: "default" | "sm"
  /** Aspect ratio and radius come from the caller; defaults to 16:10 with the card radius. */
  className?: string
}

/**
 * A flat, tinted cover drawn from simple shapes. Decorative: it is hidden
 * from assistive technology, so the post title must carry the meaning.
 */
export function PostCover({
  pattern = "window",
  tint = "violet",
  figures = defaultFigures,
  size = "default",
  className,
}: PostCoverProps) {
  const tone = tint === "panel" ? panelTone : lightTone
  const small = size === "sm"

  const shape = (
    <>
      {pattern === "window" && <WindowShape tone={tone} />}
      {pattern === "terminal" && <TerminalShape />}
      {pattern === "orbit" && <OrbitShape tone={tone} />}
      {pattern === "bars" && <BarsShape tone={tone} />}
      {pattern === "grid" && <GridShape tone={tone} />}
      {pattern === "branch" && <BranchShape tone={tone} />}
      {pattern === "compare" && <CompareShape tone={tone} figures={figures} />}
      {pattern === "regions" && <RegionsShape tone={tone} />}
      {pattern === "uptime" && <UptimeShape tone={tone} />}
      {pattern === "stack" && <StackShape tone={tone} />}
      {pattern === "menubar" && <MenubarShape tone={tone} />}
      {pattern === "fields" && <FieldsShape tone={tone} />}
      {pattern === "address" && <AddressShape tone={tone} />}
    </>
  )

  return (
    <div
      aria-hidden="true"
      data-slot="post-cover"
      data-pattern={pattern}
      data-size={size}
      className={cn(
        "@container/cover relative isolate overflow-hidden",
        small ? "aspect-4/3 w-24 shrink-0 rounded-md" : "aspect-16/10 w-full rounded-(--card-radius)",
        tintClass[tint],
        className
      )}
    >
      <div className="absolute inset-0 transition-transform duration-(--duration-slower) ease-out group-hover:scale-103">
        {small ? (
          // 16rem × 12rem drawn at 0.375 is exactly the 6rem × 4.5rem thumbnail.
          <div className="absolute top-0 left-0 h-48 w-64 origin-top-left scale-[0.375]">{shape}</div>
        ) : (
          shape
        )}
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
        <span className="text-panel-success">✓ live</span>
      </div>
    </div>
  )
}

function OrbitShape({ tone }: { tone: Tone }) {
  return (
    <>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 aspect-square h-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full border-(length:--border-width-strong)",
          tone.line
        )}
      />
      <span className={cn("absolute top-1/2 left-1/2 aspect-square h-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full", tone.ink)} />
      <span
        className={cn(
          "absolute top-1/10 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-(length:--border-width-strong)",
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
      <span
        className={cn(
          "absolute top-1/3 right-1/4 bottom-2/5 left-1/4 rounded-t-3xl border-(length:--border-width-strong) border-b-0",
          tone.line
        )}
      />
      {commitDots.map((dot) => (
        <span
          key={dot.pos}
          className={cn(
            "absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-(length:--border-width-strong)",
            dot.pos,
            tone.line,
            dot.filled ? tone.ink : tone.paper
          )}
        />
      ))}
    </>
  )
}

/** Horizontal bars with their figures: a before and after, or any short ranking. */
function CompareShape({ tone, figures }: { tone: Tone; figures: CoverFigure[] }) {
  return (
    <div className="absolute inset-x-1/8 inset-y-0 flex flex-col justify-center gap-5 @3xl/cover:gap-8">
      {figures.map((figure, i) => {
        const last = i === figures.length - 1
        const share = Math.min(Math.max(figure.share, 0.04), 1)
        return (
          <div key={figure.label} className="grid gap-2 @3xl/cover:gap-3">
            <span className={cn("font-mono text-xs font-semibold @lg/cover:text-sm @4xl/cover:text-base", tone.muted)}>
              {figure.label}
            </span>
            <div className="flex items-center gap-3 @3xl/cover:gap-5">
              <span
                className={cn("h-7 shrink-0 rounded-md @lg/cover:h-10 @4xl/cover:h-14", last ? tone.ink : tone.mid)}
                // The figure needs about 6rem beside the longest bar.
                style={{ width: `calc(${share} * (100% - 6rem))` }}
              />
              <span
                className={cn(
                  "text-xl font-extrabold tracking-tight tabular-nums @lg/cover:text-3xl @4xl/cover:text-5xl",
                  tone.text
                )}
              >
                {figure.value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* A dot map of the world, 24 columns by 10 rows. "x" is land, "o" a region. */
const worldRows = [
  ".xxxxxxxx...xxxxxxxxxxx.",
  "..xxxxxxx..xxoxxxxxxxxxx",
  "...xxxxo...xxxxxxxxxxox.",
  "....oxxx...xxxxxxxxxxx..",
  ".....xx....xxxxx.xoxx...",
  "......xxx...xxxx..xx.x..",
  "......xxxx..xxxx....xxx.",
  ".......xox...xx....xxxx.",
  ".......xx...........xo..",
  "........x...............",
]

function RegionsShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/10 top-1/2 grid -translate-y-1/2 grid-cols-24 gap-1 @lg/cover:gap-1.5">
      {worldRows.flatMap((row, r) =>
        row.split("").map((cell, c) => (
          <span
            key={`${r}-${c}`}
            className={cn(
              "aspect-square rounded-full",
              cell === "o" ? tone.ink : cell === "x" ? tone.soft : undefined
            )}
          />
        ))
      )}
    </div>
  )
}

const uptimeBlocks = 12

/** Two releases side by side: the old one hands over to the new one with an overlap. */
function UptimeShape({ tone }: { tone: Tone }) {
  const rows = [
    { from: 0, to: 8, fill: tone.mid },
    { from: 5, to: uptimeBlocks, fill: tone.ink },
  ]
  return (
    <div className="absolute inset-x-1/8 top-1/2 grid -translate-y-1/2 gap-2.5 @3xl/cover:gap-4">
      {rows.map((row, r) => (
        <div key={r} className="flex h-12 gap-2 @3xl/cover:h-20 @3xl/cover:gap-3">
          {Array.from({ length: uptimeBlocks }, (_, i) => (
            <span key={i} className={cn("flex-1 rounded-md", i >= row.from && i < row.to ? row.fill : tone.soft)} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Three services stacked like cards: web in front, worker and database behind. */
function StackShape({ tone }: { tone: Tone }) {
  const card = cn("absolute h-1/2 w-1/2 rounded-lg border p-3", tone.paper, tone.hair)
  return (
    <>
      <div className={cn(card, "top-1/8 left-[34%]")}>
        <span className={cn("block h-1.5 w-1/4 rounded-full", tone.soft)} />
      </div>
      <div className={cn(card, "top-1/4 left-[25%]")}>
        <span className={cn("block h-1.5 w-1/3 rounded-full", tone.soft)} />
      </div>
      <div className={cn(card, "top-3/8 left-[16%] grid content-start gap-2")}>
        <span className={cn("h-2.5 w-2/5 rounded-full", tone.ink)} />
        <span className={cn("h-1.5 w-3/4 rounded-full", tone.soft)} />
        <span className={cn("h-1.5 w-1/2 rounded-full", tone.soft)} />
        <div className="mt-2 flex gap-1.5">
          <span className={cn("h-5 w-12 rounded-full", tone.ink)} />
          <span className={cn("h-5 w-10 rounded-full border", tone.hair)} />
        </div>
      </div>
    </>
  )
}

/** A menu bar with the Lumen mark and its open menu, floating inside the cover. */
function MenubarShape({ tone }: { tone: Tone }) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-x-1/10 top-1/10 flex h-8 items-center justify-end gap-3 rounded-md border px-3",
          tone.paper,
          tone.hair
        )}
      >
        <span className={cn("mr-auto size-2 rounded-full", tone.soft)} />
        <span className={cn("h-1.5 w-5 rounded-full", tone.soft)} />
        <span className={cn("h-1.5 w-8 rounded-full", tone.soft)} />
        <span className={cn("grid size-5 shrink-0 place-items-center rounded-xs", tone.ink)}>
          <span className={cn("size-2 rounded-full", tone.paper)} />
        </span>
        <span className={cn("h-1.5 w-6 rounded-full", tone.soft)} />
      </div>
      <div
        className={cn(
          "absolute top-[calc(10%+2.75rem)] right-[calc(10%+2.25rem)] grid w-1/2 gap-1 rounded-lg border p-2",
          tone.paper,
          tone.hair
        )}
      >
        <div className={cn("flex items-center gap-2 rounded-md px-2 py-2", tone.soft)}>
          <span className="size-2 shrink-0 rounded-full bg-success" />
          <span className={cn("h-1.5 w-1/2 rounded-full", tone.ink)} />
          <span className={cn("ml-auto h-1.5 w-1/6 rounded-full", tone.mid)} />
        </div>
        {["w-2/5", "w-3/5", "w-1/3"].map((w) => (
          <div key={w} className="flex items-center gap-2 px-2 py-2">
            <span className={cn("size-2 shrink-0 rounded-full", tone.soft)} />
            <span className={cn("h-1.5 rounded-full", w, tone.soft)} />
          </div>
        ))}
        <div className={cn("mx-2 my-1 border-t", tone.hair)} />
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className={cn("h-5 w-16 rounded-full", tone.ink)} />
        </div>
      </div>
    </>
  )
}

const logFields = [
  { key: "level", value: "\"error\"" },
  { key: "route", value: "\"/api/checkout\"", highlight: true },
  { key: "status", value: "502" },
  { key: "duration_ms", value: "1210" },
  { key: "region", value: "\"gru1\"" },
]

/** One structured log line, pretty-printed, with a field picked out. */
function FieldsShape({ tone }: { tone: Tone }) {
  return (
    <div
      className={cn(
        "absolute top-1/6 left-1/2 h-full w-3/4 -translate-x-1/2 rounded-lg border px-3 py-4 font-mono text-xs leading-6 whitespace-nowrap @3xl/cover:text-sm @3xl/cover:leading-7",
        tone.paper,
        tone.hair,
        tone.muted
      )}
    >
      <span className="block px-2">{"{"}</span>
      {logFields.map((field) => (
        <span key={field.key} className={cn("block rounded-sm px-2 pl-6", field.highlight && tone.soft)}>
          {`"${field.key}": `}
          <span className={cn("font-semibold", tone.text)}>{field.value}</span>
        </span>
      ))}
      <span className="block px-2">{"}"}</span>
    </div>
  )
}

/** An address bar with the padlock, and the certificate it was issued. */
function AddressShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/8 top-1/2 grid -translate-y-1/2 gap-4 @3xl/cover:gap-6">
      <div
        className={cn(
          "flex h-12 min-w-0 items-center gap-3 rounded-full border px-5 @3xl/cover:h-16 @3xl/cover:px-7",
          tone.paper,
          tone.hair
        )}
      >
        <LockIcon className={cn("size-4 shrink-0 @3xl/cover:size-5", tone.text)} strokeWidth={2.5} />
        <span className={cn("truncate font-mono text-sm @3xl/cover:text-lg", tone.muted)}>
          https://<span className={cn("font-semibold", tone.text)}>shop.acme.dev</span>
        </span>
      </div>
      <div className="flex items-center gap-3 px-5 @3xl/cover:px-7">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
          <CheckIcon className="size-3" strokeWidth={3} />
        </span>
        <span className={cn("h-1.5 w-1/3 rounded-full", tone.ink)} />
        <span className={cn("h-1.5 w-1/5 rounded-full", tone.soft)} />
      </div>
    </div>
  )
}
