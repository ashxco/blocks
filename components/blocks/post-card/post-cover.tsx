import * as React from "react"
import { BellIcon, CheckIcon, FilterIcon, ZapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Flat fills for covers, portraits and screenshots. "panel" is the dark emphasis surface. */
export type CoverTint = "violet" | "mint" | "sand" | "sky" | "rose" | "panel"

/** Simple shape compositions. No gradients, no images. */
export type CoverPattern =
  | "window"
  | "checklist"
  | "orbit"
  | "bars"
  | "grid"
  | "board"
  | "compare"
  | "calendar"
  | "timeline"
  | "stack"
  | "menubar"
  | "flow"
  | "inbox"

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
  "checklist",
  "orbit",
  "bars",
  "grid",
  "board",
  "compare",
  "calendar",
  "timeline",
  "stack",
  "menubar",
  "flow",
  "inbox",
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
  /** Text and icons drawn on an ink fill. */
  onInk: string
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
  onInk: "text-background",
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
  onInk: "text-panel",
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
  { label: "Before", value: "4", share: 1 },
  { label: "After", value: "2", share: 0.5 },
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
      {pattern === "checklist" && <ChecklistShape tone={tone} />}
      {pattern === "orbit" && <OrbitShape tone={tone} />}
      {pattern === "bars" && <BarsShape tone={tone} />}
      {pattern === "grid" && <GridShape tone={tone} />}
      {pattern === "board" && <BoardShape tone={tone} />}
      {pattern === "compare" && <CompareShape tone={tone} figures={figures} />}
      {pattern === "calendar" && <CalendarShape tone={tone} />}
      {pattern === "timeline" && <TimelineShape tone={tone} />}
      {pattern === "stack" && <StackShape tone={tone} />}
      {pattern === "menubar" && <MenubarShape tone={tone} />}
      {pattern === "flow" && <FlowShape tone={tone} />}
      {pattern === "inbox" && <InboxShape tone={tone} />}
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

const checklistRows = [
  { done: true, width: "w-3/5" },
  { done: true, width: "w-2/5" },
  { done: false, width: "w-1/2" },
  { done: false, width: "w-1/3" },
]

/** A task list on a card: two items ticked off, two to go. */
function ChecklistShape({ tone }: { tone: Tone }) {
  return (
    <div className={cn("absolute top-1/5 left-1/8 h-full w-full rounded-lg border p-4 @3xl/cover:p-7", tone.paper, tone.hair)}>
      <span className={cn("block h-2.5 w-1/4 rounded-full @3xl/cover:h-4", tone.ink)} />
      <div className="mt-5 grid gap-3.5 @3xl/cover:mt-8 @3xl/cover:gap-6">
        {checklistRows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 @3xl/cover:gap-5">
            <span
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-xs border-(length:--border-width-strong) @3xl/cover:size-7",
                tone.line,
                row.done ? cn(tone.ink, tone.onInk) : tone.paper
              )}
            >
              {row.done ? <CheckIcon className="size-3 @3xl/cover:size-5" strokeWidth={3} /> : null}
            </span>
            <span className={cn("h-1.5 rounded-full @3xl/cover:h-2.5", row.width, row.done ? tone.soft : tone.mid)} />
          </div>
        ))}
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

const boardColumns = [
  { cards: 2, highlight: -1 },
  { cards: 3, highlight: 1 },
  { cards: 1, highlight: -1 },
]

/** Three board columns of cards, one card picked out in ink. */
function BoardShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/10 top-1/6 -bottom-2 grid grid-cols-3 gap-3 @3xl/cover:gap-5">
      {boardColumns.map((column, c) => (
        <div key={c} className={cn("grid content-start gap-2 rounded-t-lg p-2 @3xl/cover:gap-3 @3xl/cover:p-3", tone.paperSoft)}>
          <span className={cn("mb-1 block h-1.5 w-1/2 rounded-full @3xl/cover:h-2.5", tone.mid)} />
          {Array.from({ length: column.cards }, (_, i) => (
            <span
              key={i}
              className={cn(
                "grid h-10 content-start gap-1.5 rounded-md border p-2 @3xl/cover:h-16 @3xl/cover:p-3",
                i === column.highlight ? cn(tone.ink, "border-transparent") : cn(tone.paper, tone.hair)
              )}
            >
              <span className={cn("h-1.5 w-3/4 rounded-full @3xl/cover:h-2", i === column.highlight ? tone.paper : tone.soft)} />
              <span className={cn("h-1.5 w-1/2 rounded-full @3xl/cover:h-2", i === column.highlight ? tone.mid : tone.soft)} />
            </span>
          ))}
        </div>
      ))}
    </div>
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
            <span className={cn("text-caption font-semibold @lg/cover:text-sm @4xl/cover:text-base", tone.muted)}>
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

/** A month on a card: the same weekday marked every week, and today filled in. */
function CalendarShape({ tone }: { tone: Tone }) {
  return (
    <div className={cn("absolute inset-x-1/8 top-1/6 bottom-0 rounded-t-lg border border-b-0 p-3 @3xl/cover:p-6", tone.paper, tone.hair)}>
      <span className={cn("block h-2 w-1/4 rounded-full @3xl/cover:h-3", tone.ink)} />
      <div className="mt-3 grid grid-cols-7 gap-1.5 @3xl/cover:mt-6 @3xl/cover:gap-3">
        {Array.from({ length: 28 }, (_, i) => {
          const repeat = i % 7 === 1
          const today = i === 16
          return (
            <span
              key={i}
              className={cn("grid aspect-square place-items-center rounded-sm", today ? tone.ink : tone.paperSoft, !today && "border", !today && tone.hair)}
            >
              {repeat ? <span className={cn("size-1.5 rounded-full @3xl/cover:size-2.5", tone.ink)} /> : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}

const timelineBars = [
  { left: "0%", width: "34%", fill: "soft" },
  { left: "18%", width: "38%", fill: "mid" },
  { left: "40%", width: "32%", fill: "ink" },
  { left: "58%", width: "30%", fill: "soft" },
  { left: "80%", width: "20%", fill: "mid" },
] as const

/** Tasks as bars across weeks, overlapping where work runs side by side. */
function TimelineShape({ tone }: { tone: Tone }) {
  return (
    <div className="absolute inset-x-1/8 top-1/2 -translate-y-1/2">
      {[25, 50, 75].map((left) => (
        <span key={left} className={cn("absolute -inset-y-4 border-l", tone.hair)} style={{ left: `${left}%` }} />
      ))}
      <div className="relative grid gap-2.5 @3xl/cover:gap-4">
        {timelineBars.map((bar, i) => (
          <div key={i} className="relative h-5 @3xl/cover:h-8">
            <span className={cn("absolute inset-y-0 rounded-full", tone[bar.fill])} style={{ left: bar.left, width: bar.width }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Three docs stacked like cards: the open one in front, two behind. */
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
          <span className={cn("h-5 w-12 rounded-(--button-radius)", tone.ink)} />
          <span className={cn("h-5 w-10 rounded-(--button-radius) border", tone.hair)} />
        </div>
      </div>
    </>
  )
}

/** A menu bar with the app icon and its open menu, floating inside the cover. */
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
          <span className={cn("h-5 w-16 rounded-(--button-radius)", tone.ink)} />
        </div>
      </div>
    </>
  )
}

/** An automation rule: the trigger in ink, joined by hairlines to a condition and an action. A wide cover spells the steps out. */
function FlowShape({ tone }: { tone: Tone }) {
  const node =
    "flex h-14 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 @lg/cover:h-18 @lg/cover:gap-3 @lg/cover:px-4 @3xl/cover:h-24 @3xl/cover:px-6"
  const link = cn("h-0.5 w-4 shrink-0 @lg/cover:w-6 @3xl/cover:w-10", tone.ink)
  // Skeleton lines in a small cover; from @3xl/cover the rule reads out in words.
  const lines = (first: string, second: string, label: string, text?: string) => (
    <>
      <span className="grid min-w-0 flex-1 gap-1.5 @3xl/cover:hidden">
        <span className={cn("h-1.5 w-4/5 rounded-full", first)} />
        <span className={cn("h-1.5 w-1/2 rounded-full", second)} />
      </span>
      <span className={cn("hidden min-w-0 flex-1 text-label text-balance @3xl/cover:block @4xl/cover:text-base", text)}>
        {label}
      </span>
    </>
  )
  return (
    <div className="absolute inset-x-1/12 top-1/2 flex -translate-y-1/2 items-center">
      <div className={cn(node, tone.ink, tone.onInk)}>
        <ZapIcon className="size-4 shrink-0 @lg/cover:size-5 @3xl/cover:size-7" strokeWidth={2.5} />
        {lines(tone.paper, tone.paperSoft, "A task moves to Done")}
      </div>
      <span className={link} />
      <div className={cn(node, "border", tone.paper, tone.hair)}>
        <FilterIcon className={cn("size-4 shrink-0 @lg/cover:size-5 @3xl/cover:size-7", tone.muted)} strokeWidth={2.5} />
        {lines(tone.mid, tone.soft, "Priority is High or Urgent", tone.text)}
      </div>
      <span className={link} />
      <div className={cn(node, "border", tone.paper, tone.hair)}>
        <BellIcon className={cn("size-4 shrink-0 @lg/cover:size-5 @3xl/cover:size-7", tone.muted)} strokeWidth={2.5} />
        {lines(tone.mid, tone.soft, "Notify the task owner", tone.text)}
      </div>
    </div>
  )
}

const inboxRows = [
  { unread: true, width: "w-3/5" },
  { unread: true, width: "w-1/2" },
  { unread: false, width: "w-2/3" },
  { unread: false, width: "w-2/5" },
]

/** An inbox: two unread updates marked with a dot, two read below them. */
function InboxShape({ tone }: { tone: Tone }) {
  return (
    <div className={cn("absolute inset-x-1/8 top-1/6 -bottom-2 grid content-start rounded-t-lg border", tone.paper, tone.hair)}>
      {inboxRows.map((row, i) => (
        <div
          key={i}
          className={cn("flex items-center gap-3 border-b px-4 py-3 @3xl/cover:gap-5 @3xl/cover:px-6 @3xl/cover:py-5", tone.hair, i === 0 && tone.paperSoft)}
        >
          <span className={cn("size-2 shrink-0 rounded-full @3xl/cover:size-3", row.unread ? tone.ink : "bg-transparent")} />
          <span className={cn("size-6 shrink-0 rounded-full @3xl/cover:size-10", tone.soft)} />
          <span className="grid flex-1 gap-1.5 @3xl/cover:gap-2.5">
            <span className={cn("h-1.5 rounded-full @3xl/cover:h-2.5", row.width, row.unread ? tone.ink : tone.mid)} />
            <span className={cn("h-1.5 w-1/3 rounded-full @3xl/cover:h-2", tone.soft)} />
          </span>
        </div>
      ))}
    </div>
  )
}
