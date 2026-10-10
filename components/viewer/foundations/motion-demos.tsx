"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * The Motion page's demos. Every one loops so the tokens can be watched, not
 * replayed: each section runs its demos on one shared clock, reads durations
 * and easings from the live CSS variables when it starts, stops while it is
 * off screen, and has its own Pause. With reduced motion everything stays
 * still. In a product, motion runs once per change; the loop is for the docs.
 */

/* ------------------------------------------------------------------------ */
/* Clock and controls                                                        */
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

/** True while the element is at least partly on screen. */
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView] as const
}

/** A section's loop: running while on screen, unless paused or motion is reduced. */
function useSectionLoop() {
  const reduced = useReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const [ref, inView] = useInView<HTMLDivElement>()
  return [ref, { reduced, paused, setPaused, running: inView && !paused && !reduced }] as const
}

function PauseButton({
  paused,
  onChange,
  inverse = false,
}: {
  paused: boolean
  onChange: (paused: boolean) => void
  inverse?: boolean
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={inverse ? "outline-inverse" : "secondary"}
      aria-pressed={paused}
      onClick={() => onChange(!paused)}
    >
      {paused ? <PlayIcon data-icon="inline-start" /> : <PauseIcon data-icon="inline-start" />}
      {paused ? "Play" : "Pause"}
    </Button>
  )
}

function ReducedMotionNote({ inverse = false }: { inverse?: boolean }) {
  return (
    <p
      role="note"
      className={cn(
        "rounded-(--card-radius) border p-4 text-caption",
        inverse ? "border-panel-border bg-panel-raised text-panel-muted" : "bg-subtle text-copy"
      )}
    >
      Your system asks for less motion, so these demos stay still. Blocks does the same everywhere: transitions finish
      instantly, so state still changes but nothing travels.
    </p>
  )
}

function parseMs(value: string) {
  const v = value.trim()
  if (v.endsWith("ms")) return Number.parseFloat(v)
  if (v.endsWith("s")) return Number.parseFloat(v) * 1000
  return Number.parseFloat(v) || 0
}

function readTokens(el: Element) {
  const styles = getComputedStyle(el)
  return {
    ms: (name: string) => parseMs(styles.getPropertyValue(`--duration-${name}`)),
    ease: (name: string) => styles.getPropertyValue(`--ease-${name}`).trim() || "linear",
  }
}

/** Runs `setup` while `running`, and cancels what it started when it stops. */
function useLoop(
  ref: React.RefObject<HTMLElement | null>,
  running: boolean,
  setup: (root: HTMLElement) => Animation[]
) {
  React.useEffect(() => {
    const root = ref.current
    if (!running || !root || typeof root.animate !== "function") return
    const animations = setup(root)
    return () => animations.forEach((a) => a.cancel())
  }, [ref, running, setup])
}

/** Rest at each end of a back-and-forth leg, shared between both ends. */
const HOLD = 900

/*
 * Back and forth on a shared cycle: rest, travel for `duration` with
 * `easing`, then rest again; every other iteration plays in reverse, so the
 * dot comes back the same way (a reversed leg mirrors its easing, so a dot on
 * a curve slides back down the line it is drawn on). Every demo in a section
 * uses the same cycle, so they leave together and get back together.
 */
function move(el: Element, property: "left" | "bottom", duration: number, easing: string, cycle: number) {
  const rest = HOLD / 2 / cycle
  return el.animate(
    [
      { [property]: "0%", offset: 0 },
      { [property]: "0%", offset: rest, easing },
      { [property]: "100%", offset: rest + duration / cycle },
      { [property]: "100%", offset: 1 },
    ],
    { duration: cycle, iterations: Infinity, direction: "alternate" }
  )
}

/* ------------------------------------------------------------------------ */
/* In use                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * A scene on a timeline in milliseconds: each step animates its element from
 * `at` for the duration and easing of the given tokens.
 */
type Step = { el: Element; at: number; duration: number; easing: string; from: Keyframe; to: Keyframe }

function scene(steps: Step[], length: number): Animation[] {
  // Group the steps by element, so each element gets one keyframe track per scene.
  const byEl = new Map<Element, Step[]>()
  for (const step of steps) byEl.set(step.el, [...(byEl.get(step.el) ?? []), step])
  const animations: Animation[] = []
  for (const [el, list] of byEl) {
    list.sort((a, b) => a.at - b.at)
    const frames: Keyframe[] = [{ ...list[0].from, offset: 0 }]
    for (const step of list) {
      frames.push({ ...step.from, offset: step.at / length, easing: step.easing })
      frames.push({ ...step.to, offset: (step.at + step.duration) / length })
    }
    frames.push({ ...list[list.length - 1].to, offset: 1 })
    animations.push(el.animate(frames, { duration: length, iterations: Infinity }))
  }
  return animations
}

const q = (root: HTMLElement, name: string) => root.querySelector(`[data-part="${name}"]`)!

function setupMenu(root: HTMLElement) {
  const t = readTokens(root)
  const menu = q(root, "menu")
  const hidden = { opacity: 0, transform: "translateY(-4px)" }
  const shown = { opacity: 1, transform: "translateY(0)" }
  return scene(
    [
      { el: menu, at: 500, duration: t.ms("base"), easing: t.ease("out"), from: hidden, to: shown },
      { el: menu, at: 2100, duration: t.ms("fast"), easing: t.ease("in"), from: shown, to: hidden },
    ],
    2800
  )
}

function setupDialog(root: HTMLElement) {
  const t = readTokens(root)
  const scrim = q(root, "scrim")
  const dialog = q(root, "dialog")
  const enter = t.ms("slow")
  const leave = t.ms("base")
  return scene(
    [
      { el: scrim, at: 500, duration: enter, easing: t.ease("out"), from: { opacity: 0 }, to: { opacity: 1 } },
      { el: scrim, at: 2300, duration: leave, easing: t.ease("in"), from: { opacity: 1 }, to: { opacity: 0 } },
      {
        el: dialog,
        at: 500,
        duration: enter,
        easing: t.ease("out"),
        from: { opacity: 0, transform: "scale(0.98)" },
        to: { opacity: 1, transform: "scale(1)" },
      },
      {
        el: dialog,
        at: 2300,
        duration: leave,
        easing: t.ease("in"),
        from: { opacity: 1, transform: "scale(1)" },
        to: { opacity: 0, transform: "scale(0.98)" },
      },
    ],
    3200
  )
}

function setupTabs(root: HTMLElement) {
  const t = readTokens(root)
  const bar = q(root, "indicator")
  const d = t.ms("base")
  const e = t.ease("in-out")
  const at = (i: number) => ({ left: `${(i * 100) / 3}%` })
  return scene(
    [
      { el: bar, at: 800, duration: d, easing: e, from: at(0), to: at(1) },
      { el: bar, at: 1800, duration: d, easing: e, from: at(1), to: at(2) },
      { el: bar, at: 2800, duration: d, easing: e, from: at(2), to: at(0) },
    ],
    3600
  )
}

function setupToast(root: HTMLElement) {
  const t = readTokens(root)
  const toast = q(root, "toast")
  const hidden = { opacity: 0, transform: "translateY(4px)" }
  const shown = { opacity: 1, transform: "translateY(0)" }
  return scene(
    [
      { el: toast, at: 500, duration: t.ms("base"), easing: t.ease("out"), from: hidden, to: shown },
      { el: toast, at: 2400, duration: t.ms("fast"), easing: t.ease("in"), from: shown, to: hidden },
    ],
    3000
  )
}

function Scene({
  title,
  tokens,
  running,
  setup,
  children,
}: {
  title: string
  tokens: string
  running: boolean
  setup: (root: HTMLElement) => Animation[]
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useLoop(ref, running, setup)
  return (
    <figure className="grid content-start gap-3">
      <div
        ref={ref}
        aria-hidden="true"
        className="relative grid h-48 place-items-center overflow-hidden rounded-(--card-radius) border bg-subtle"
      >
        {children}
      </div>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-title text-foreground">{title}</span>
        <span className="font-mono text-xs text-muted-foreground">{tokens}</span>
      </figcaption>
    </figure>
  )
}

const line = "block h-1.5 rounded-full bg-muted-foreground/30"

export function MotionInUse() {
  const [loopRef, loop] = useSectionLoop()
  // Before the first frame the scenes show their resting, open state.
  return (
    <div ref={loopRef} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-muted-foreground">
          The system&apos;s own transitions, on the live tokens. They loop here so you can watch them; in a product,
          each runs once per change.
        </p>
        {loop.reduced ? null : <PauseButton paused={loop.paused} onChange={loop.setPaused} />}
      </div>
      {loop.reduced ? <ReducedMotionNote /> : null}
      <div className="grid gap-6 @prose:grid-cols-2 @wide:grid-cols-4">
        <Scene title="Menu" tokens="base · out, fast · in" running={loop.running} setup={setupMenu}>
          <div className="grid w-40 justify-items-start gap-1.5">
            <span className="flex h-8 items-center rounded-(--button-radius) border bg-background px-3 text-caption font-semibold text-foreground">
              Actions
            </span>
            <span
              data-part="menu"
              className="grid w-full gap-2.5 rounded-(--overlay-radius) border border-popover-border bg-popover p-3"
            >
              <span className={cn(line, "w-4/5")} />
              <span className={cn(line, "w-3/5")} />
              <span className={cn(line, "w-2/3")} />
            </span>
          </div>
        </Scene>

        <Scene title="Dialog" tokens="slow · out, base · in" running={loop.running} setup={setupDialog}>
          <div className="grid w-40 gap-2 self-start pt-6">
            <span className={cn(line, "w-3/4")} />
            <span className={cn(line, "w-1/2")} />
            <span className={cn(line, "w-2/3")} />
          </div>
          <span data-part="scrim" className="absolute inset-0 bg-overlay backdrop-blur-glass" />
          <span
            data-part="dialog"
            className="absolute grid w-36 gap-2.5 rounded-(--dialog-radius) border bg-popover p-4"
          >
            <span className="block h-2 w-3/4 rounded-full bg-foreground" />
            <span className={cn(line, "w-full")} />
            <span className="mt-1 block h-5 w-14 justify-self-end rounded-(--button-radius) bg-primary" />
          </span>
        </Scene>

        <Scene title="Tabs" tokens="base · in-out" running={loop.running} setup={setupTabs}>
          <div className="relative grid w-44 grid-cols-3 border-b pb-2.5 text-center text-caption font-semibold text-foreground">
            <span>Board</span>
            <span>List</span>
            <span>Timeline</span>
            <span
              data-part="indicator"
              className="absolute -bottom-px left-0 h-(--border-width-strong) w-1/3 rounded-full bg-foreground"
            />
          </div>
        </Scene>

        <Scene title="Toast" tokens="base · out, fast · in" running={loop.running} setup={setupToast}>
          <span
            data-part="toast"
            className="absolute bottom-4 flex w-44 items-center gap-2.5 rounded-(--overlay-radius) border border-popover-border bg-popover p-3"
          >
            <span className="size-2 shrink-0 rounded-full bg-success" />
            <span className={cn(line, "w-full")} />
          </span>
        </Scene>
      </div>
    </div>
  )
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

export function DurationDemos({ items, easingVar }: { items: DurationItem[]; easingVar: string }) {
  const [loopRef, loop] = useSectionLoop()
  const setup = React.useCallback(
    (root: HTMLElement) => {
      const styles = getComputedStyle(root)
      const easing = styles.getPropertyValue(easingVar).trim() || "linear"
      const durations = items.map((i) => parseMs(styles.getPropertyValue(i.cssVar)))
      const cycle = Math.max(...durations) + HOLD
      return Array.from(root.querySelectorAll('[data-part="dot"]')).map((dot, i) =>
        move(dot, "left", durations[i], easing, cycle)
      )
    },
    [items, easingVar]
  )
  useLoop(loopRef, loop.running, setup)

  return (
    <div ref={loopRef} className="grid gap-6 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-prose text-caption text-panel-muted">
          The same distance and the standard easing; only the duration changes. All five leave together and get back together.
        </p>
        {loop.reduced ? null : <PauseButton paused={loop.paused} onChange={loop.setPaused} inverse />}
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
                <h3 className="text-title text-panel-foreground">{item.name}</h3>
                <span className="font-mono text-label text-panel-muted tabular">{item.value}</span>
              </div>
              {item.description ? <p className="text-caption text-panel-muted">{item.description}</p> : null}
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
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full overflow-visible">
        <rect x="0" y="0" width="100" height="100" className="fill-none stroke-border" vectorEffect="non-scaling-stroke" />
        <path d="M0 100 L100 0" className="fill-none stroke-border-strong" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
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

export function EasingDemos({ items, durationVar }: { items: EasingItem[]; durationVar: string }) {
  const [loopRef, loop] = useSectionLoop()
  const setup = React.useCallback(
    (root: HTMLElement) => {
      const styles = getComputedStyle(root)
      const duration = parseMs(styles.getPropertyValue(durationVar))
      const cycle = duration + HOLD
      const cards = Array.from(root.querySelectorAll("[data-easing]"))
      return cards.flatMap((card) => {
        const easing = styles.getPropertyValue(card.getAttribute("data-easing")!).trim() || "linear"
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
          Each runs at the slower duration so the shape is easy to see. The dot on the curve and the dot on the rail
          move together, there and back.
        </p>
        {loop.reduced ? null : <PauseButton paused={loop.paused} onChange={loop.setPaused} />}
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
                <code className="font-mono text-xs text-muted-foreground">{item.utility}</code>
              </div>
              {item.description ? <p className="text-caption text-copy">{item.description}</p> : null}
            </div>
            <Rail />
          </li>
        ))}
      </ul>
    </div>
  )
}
