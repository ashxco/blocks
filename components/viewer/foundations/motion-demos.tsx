"use client"

import * as React from "react"
import { PlayIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { cx } from "./layout"

/* ------------------------------------------------------------------------ */
/* Reduced motion                                                            */
/* ------------------------------------------------------------------------ */

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

/** Shown in place of the demos when the system asks for reduced motion. */
function ReducedMotionNote({ inverse = false }: { inverse?: boolean }) {
  return (
    <div
      role="note"
      className={cx(
        "grid gap-1 rounded-(--card-radius) border p-(--card-padding)",
        inverse ? "border-panel-border bg-panel-raised" : "bg-subtle"
      )}
    >
      <p className={cx("text-title", inverse ? "text-panel-foreground" : "text-foreground")}>
        Reduced motion is on
      </p>
      <p className={cx("text-caption", inverse ? "text-panel-muted" : "text-copy")}>
        Your system asks for less motion, so these demos stay still. Blocks honours the same setting everywhere: transitions
        and animations finish almost instantly, so state still changes but nothing travels across the screen.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Demo track                                                                */
/* ------------------------------------------------------------------------ */

function parseMs(value: string) {
  const v = value.trim()
  if (v.endsWith("ms")) return Number.parseFloat(v)
  if (v.endsWith("s")) return Number.parseFloat(v) * 1000
  return Number.parseFloat(v) || 0
}

interface DemoProps {
  /** CSS variable holding the duration, e.g. "--duration-base". */
  durationVar: string
  /** CSS variable holding the easing, e.g. "--ease-out". */
  easingVar: string
  /** Increment to replay from outside. */
  run: number
  label: string
  inverse?: boolean
  reduced: boolean
}

/**
 * A dot that crosses its track using the live token values, read from CSS at
 * play time, so the demo always matches the stylesheet.
 */
function Demo({ durationVar, easingVar, run, label, inverse = false, reduced }: DemoProps) {
  const dotRef = React.useRef<HTMLSpanElement>(null)
  const [local, setLocal] = React.useState(0)

  const play = React.useCallback(() => {
    const dot = dotRef.current
    const track = dot?.parentElement
    if (!dot || !track || typeof dot.animate !== "function") return
    const styles = getComputedStyle(dot)
    const duration = parseMs(styles.getPropertyValue(durationVar))
    const easing = styles.getPropertyValue(easingVar).trim() || "linear"
    const trackStyles = getComputedStyle(track)
    const distance =
      track.clientWidth -
      Number.parseFloat(trackStyles.paddingLeft) -
      Number.parseFloat(trackStyles.paddingRight) -
      dot.offsetWidth
    dot.getAnimations().forEach((a) => a.cancel())
    dot.animate([{ transform: "translateX(0)" }, { transform: `translateX(${distance}px)` }], {
      duration,
      easing,
      fill: "forwards",
    })
  }, [durationVar, easingVar])

  React.useEffect(() => {
    if (reduced || run + local === 0) return
    play()
  }, [run, local, play, reduced])

  // Snap back to the start when reduced motion turns on mid-way.
  React.useEffect(() => {
    if (reduced) dotRef.current?.getAnimations().forEach((a) => a.cancel())
  }, [reduced])

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden
        className={cx(
          "relative flex h-12 min-w-0 flex-1 items-center rounded-full px-2",
          inverse ? "bg-panel-raised" : "border bg-muted"
        )}
      >
        <span
          ref={dotRef}
          className={cx("block size-8 rounded-full", inverse ? "bg-panel-foreground" : "bg-foreground")}
        />
      </div>
      {reduced ? null : (
        <Button
          type="button"
          size="icon-sm"
          variant={inverse ? "outline-inverse" : "secondary"}
          aria-label={`Replay ${label}`}
          onClick={() => setLocal((n) => n + 1)}
        >
          <RotateCcwIcon />
        </Button>
      )}
    </div>
  )
}

/** Plays once when the element first scrolls into view. */
function usePlayOnView<T extends HTMLElement>(onView: () => void, disabled: boolean) {
  const ref = React.useRef<T>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el || disabled || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onView()
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onView, disabled])
  return ref
}

/* ------------------------------------------------------------------------ */
/* Durations                                                                 */
/* ------------------------------------------------------------------------ */

export interface DurationItem {
  name: string
  cssVar: string
  value: string
  utility: string
  description?: string
}

export function DurationDemos({ items, easingVar }: { items: DurationItem[]; easingVar: string }) {
  const reduced = useReducedMotion()
  const [run, setRun] = React.useState(0)
  const playAll = React.useCallback(() => setRun((n) => n + 1), [])
  const ref = usePlayOnView<HTMLDivElement>(playAll, reduced)

  return (
    <div ref={ref} className="grid gap-6 rounded-(--panel-radius) bg-panel p-(--card-padding) text-panel-foreground @prose:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-panel-muted">
          Each dot crosses the same distance with the standard easing. Only the duration changes.
        </p>
        {reduced ? null : (
          <Button type="button" variant="inverse" size="sm" onClick={playAll}>
            <PlayIcon data-icon="inline-start" />
            Play all
          </Button>
        )}
      </div>
      {reduced ? <ReducedMotionNote inverse /> : null}
      <ul className="grid">
        {items.map((item) => (
          <li
            key={item.cssVar}
            className="grid gap-4 border-t border-panel-border py-6 @narrow:grid-cols-[15rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-10"
          >
            <div className="grid gap-1">
              <div className="flex items-baseline gap-3">
                <h3 className="text-h4 text-panel-foreground">{item.name}</h3>
                <span className="font-mono text-label text-panel-muted tabular">{item.value}</span>
              </div>
              <code className="font-mono text-xs text-panel-muted">{item.utility}</code>
              {item.description ? <p className="text-caption text-panel-muted">{item.description}</p> : null}
            </div>
            <Demo
              durationVar={item.cssVar}
              easingVar={easingVar}
              run={run}
              label={item.name}
              inverse
              reduced={reduced}
            />
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

function Curve({ points }: { points: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = points
  const p = (x: number, y: number) => `${x * 100} ${100 - y * 100}`
  return (
    <svg viewBox="-6 -6 112 112" aria-hidden className="aspect-square w-full max-w-48 overflow-visible">
      <rect x="0" y="0" width="100" height="100" className="fill-none stroke-border" vectorEffect="non-scaling-stroke" />
      <path d="M0 100 L100 0" className="fill-none stroke-border" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      <path d={`M0 100 L${p(x1, y1)}`} className="fill-none stroke-muted-foreground" vectorEffect="non-scaling-stroke" />
      <path d={`M100 0 L${p(x2, y2)}`} className="fill-none stroke-muted-foreground" vectorEffect="non-scaling-stroke" />
      <circle cx={x1 * 100} cy={100 - y1 * 100} r="2.5" className="fill-background stroke-muted-foreground" vectorEffect="non-scaling-stroke" />
      <circle cx={x2 * 100} cy={100 - y2 * 100} r="2.5" className="fill-background stroke-muted-foreground" vectorEffect="non-scaling-stroke" />
      <path
        d={`M0 100 C${p(x1, y1)} ${p(x2, y2)} 100 0`}
        className="fill-none stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function EasingDemos({ items, durationVar }: { items: EasingItem[]; durationVar: string }) {
  const reduced = useReducedMotion()
  const [run, setRun] = React.useState(0)
  const playAll = React.useCallback(() => setRun((n) => n + 1), [])
  const ref = usePlayOnView<HTMLDivElement>(playAll, reduced)

  return (
    <div ref={ref} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-muted-foreground">
          Every curve runs at the slower duration here so the shape is easy to see.
        </p>
        {reduced ? null : (
          <Button type="button" variant="secondary" size="sm" onClick={playAll}>
            <PlayIcon data-icon="inline-start" />
            Play all
          </Button>
        )}
      </div>
      {reduced ? <ReducedMotionNote /> : null}
      <ul className="grid gap-6 @prose:grid-cols-2">
        {items.map((item) => (
          <li key={item.cssVar} className="grid content-start gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
            <div className="grid place-items-center rounded-lg bg-subtle p-6">
              <Curve points={item.points} />
            </div>
            <div className="grid gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-title">{item.name}</h3>
                <code className="font-mono text-code text-muted-foreground">{item.utility}</code>
              </div>
              <span className="font-mono text-xs text-muted-foreground">cubic-bezier({item.points.join(", ")})</span>
              {item.description ? <p className="text-caption text-copy">{item.description}</p> : null}
            </div>
            <Demo durationVar={durationVar} easingVar={item.cssVar} run={run} label={item.name} reduced={reduced} />
          </li>
        ))}
      </ul>
    </div>
  )
}
