"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/components/viewer/hooks"
import { cn } from "@/lib/utils"

/*
 * The Motion page's demos. Every one loops so the tokens can be watched, not
 * replayed: each section runs its demos on one shared clock, reads durations
 * and easings from the live CSS variables when it starts, stops while it is
 * off screen, and has its own Pause. With reduced motion everything stays
 * still. In a product, motion runs once per change; the loop is for the docs.
 * This module is the shared clock and controls; motion-scenes.tsx and
 * motion-timing.tsx are the demos.
 */

/** True while the element is at least partly on screen. */
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      {
        threshold: 0.15,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView] as const
}

/** A section's loop: running while on screen, unless paused or motion is reduced. */
export function useSectionLoop() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [paused, setPaused] = React.useState(false)
  const [ref, inView] = useInView<HTMLDivElement>()
  return [
    ref,
    { reduced, paused, setPaused, running: inView && !paused && !reduced },
  ] as const
}

export function PauseButton({
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
      {paused ? (
        <PlayIcon data-icon="inline-start" />
      ) : (
        <PauseIcon data-icon="inline-start" />
      )}
      {paused ? "Play" : "Pause"}
    </Button>
  )
}

export function ReducedMotionNote({ inverse = false }: { inverse?: boolean }) {
  return (
    <p
      role="note"
      className={cn(
        "rounded-(--card-radius) border p-4 text-caption",
        inverse
          ? "border-panel-border bg-panel-raised text-panel-muted"
          : "bg-subtle text-copy"
      )}
    >
      Your system asks for less motion, so these demos stay still. Blocks does
      the same everywhere: transitions finish instantly, so state still changes
      but nothing travels.
    </p>
  )
}

export function parseMs(value: string) {
  const v = value.trim()
  if (v.endsWith("ms")) return Number.parseFloat(v)
  if (v.endsWith("s")) return Number.parseFloat(v) * 1000
  return Number.parseFloat(v) || 0
}

export function readTokens(el: Element) {
  const styles = getComputedStyle(el)
  return {
    ms: (name: string) =>
      parseMs(styles.getPropertyValue(`--duration-${name}`)),
    ease: (name: string) =>
      styles.getPropertyValue(`--ease-${name}`).trim() || "linear",
  }
}

/** Runs `setup` while `running`, and cancels what it started when it stops. */
export function useLoop(
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
export const HOLD = 900

/*
 * Back and forth on a shared cycle: rest, travel for `duration` with
 * `easing`, then rest again; every other iteration plays in reverse, so the
 * dot comes back the same way (a reversed leg mirrors its easing, so a dot on
 * a curve slides back down the line it is drawn on). Every demo in a section
 * uses the same cycle, so they leave together and get back together.
 */
export function move(
  el: Element,
  property: "left" | "bottom",
  duration: number,
  easing: string,
  cycle: number
) {
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
