"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  HOLD,
  move,
  parseMs,
  PauseButton,
  ReducedMotionNote,
  useLoop,
  useSectionLoop,
} from "./motion-loop"

/* The Motion page's durations and easings: dots that travel with each token. */

export interface DurationItem {
  name: string
  cssVar: string
  value: string
  utility: string
  description?: string
}

/** A thin rail with a tick at each end; the dot crosses it (data-part="dot"). */
function Rail({ inverse = false }: { inverse?: boolean }) {
  return (
    <div aria-hidden className="relative h-10 min-w-0 flex-1">
      <span
        className={cn(
          "absolute inset-x-1.5 top-1/2 h-(--border-width-strong) -translate-y-1/2 rounded-full",
          inverse ? "bg-panel-foreground/20" : "bg-border-strong"
        )}
      />
      {/* The dot travels this inner track, so 100% puts its right edge on the end tick. */}
      <span className="absolute inset-y-0 right-3 left-0">
        <span
          data-part="dot"
          className={cn(
            "absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full",
            inverse ? "bg-panel-foreground" : "bg-foreground"
          )}
        />
      </span>
    </div>
  )
}

export function DurationDemos({
  items,
  easingVar,
}: {
  items: DurationItem[]
  easingVar: string
}) {
  const [loopRef, loop] = useSectionLoop()
  const setup = React.useCallback(
    (root: HTMLElement) => {
      const styles = getComputedStyle(root)
      const easing = styles.getPropertyValue(easingVar).trim() || "linear"
      const durations = items.map((i) =>
        parseMs(styles.getPropertyValue(i.cssVar))
      )
      const cycle = Math.max(...durations) + HOLD
      return Array.from(root.querySelectorAll('[data-part="dot"]')).map(
        (dot, i) => move(dot, "left", durations[i], easing, cycle)
      )
    },
    [items, easingVar]
  )
  useLoop(loopRef, loop.running, setup)

  return (
    <div
      ref={loopRef}
      className="grid gap-6 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-panel-muted">
          The same distance and the standard easing; only the duration changes.
          All five leave together and get back together.
        </p>
        {loop.reduced ? null : (
          <PauseButton paused={loop.paused} onChange={loop.setPaused} inverse />
        )}
      </div>
      {loop.reduced ? <ReducedMotionNote inverse /> : null}
      <ul className="grid">
        {items.map((item) => (
          <li
            key={item.cssVar}
            className="grid gap-3 border-t border-panel-border py-5 @narrow:grid-cols-[13rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-10"
          >
            <div className="grid gap-0.5">
              <div className="flex items-baseline gap-3">
                <h3 className="text-title text-panel-foreground">
                  {item.name}
                </h3>
                <span className="font-mono text-label text-panel-muted tabular">
                  {item.value}
                </span>
              </div>
              {item.description ? (
                <p className="text-caption text-panel-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <Rail inverse />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Easings                                                                   */
/* ------------------------------------------------------------------------ */

export interface EasingItem {
  name: string
  cssVar: string
  utility: string
  points: [number, number, number, number]
  description?: string
}

/**
 * The curve, with a dot that rides it: across at a steady pace (time), up
 * with the easing (progress), so it traces the line it is drawn on.
 */
function Curve({ points }: { points: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = points
  const p = (x: number, y: number) => `${x * 100} ${100 - y * 100}`
  return (
    <div className="relative aspect-square w-full max-w-44">
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          className="fill-none stroke-border"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 100 L100 0"
          className="fill-none stroke-border-strong"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M0 100 C${p(x1, y1)} ${p(x2, y2)} 100 0`}
          className="fill-none stroke-foreground"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        data-part="rider"
        aria-hidden
        className="absolute bottom-0 left-0 size-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand"
      />
    </div>
  )
}

export function EasingDemos({
  items,
  durationVar,
}: {
  items: EasingItem[]
  durationVar: string
}) {
  const [loopRef, loop] = useSectionLoop()
  const setup = React.useCallback(
    (root: HTMLElement) => {
      const styles = getComputedStyle(root)
      const duration = parseMs(styles.getPropertyValue(durationVar))
      const cycle = duration + HOLD
      const cards = Array.from(root.querySelectorAll("[data-easing]"))
      return cards.flatMap((card) => {
        const easing =
          styles.getPropertyValue(card.getAttribute("data-easing")!).trim() ||
          "linear"
        const rider = card.querySelector('[data-part="rider"]')!
        const dot = card.querySelector('[data-part="dot"]')!
        return [
          // Across at a steady pace, up with the easing: the rider traces the curve.
          move(rider, "left", duration, "linear", cycle),
          move(rider, "bottom", duration, easing, cycle),
          move(dot, "left", duration, easing, cycle),
        ]
      })
    },
    [durationVar]
  )
  useLoop(loopRef, loop.running, setup)

  return (
    <div ref={loopRef} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-muted-foreground">
          Each runs at the slower duration so the shape is easy to see. The dot
          on the curve and the dot on the rail move together, there and back.
        </p>
        {loop.reduced ? null : (
          <PauseButton paused={loop.paused} onChange={loop.setPaused} />
        )}
      </div>
      {loop.reduced ? <ReducedMotionNote /> : null}
      <ul className="grid gap-6 @prose:grid-cols-2 @wide:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.cssVar}
            data-easing={item.cssVar}
            className="grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)"
          >
            <div className="grid place-items-center rounded-(--control-radius) bg-muted px-6 py-8">
              <Curve points={item.points} />
            </div>
            <div className="grid gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-title text-foreground">{item.name}</h3>
                <code className="font-mono text-xs text-muted-foreground">
                  {item.utility}
                </code>
              </div>
              {item.description ? (
                <p className="text-caption text-copy">{item.description}</p>
              ) : null}
            </div>
            <Rail />
          </li>
        ))}
      </ul>
    </div>
  )
}
