"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  PauseButton,
  readTokens,
  ReducedMotionNote,
  useLoop,
  useSectionLoop,
} from "./motion-loop"

/* The Motion page's "In use": the system's own overlay transitions, as scenes on a timeline. */

/**
 * A scene on a timeline in milliseconds: each step animates its element from
 * `at` for the duration and easing of the given tokens.
 */
type Step = {
  el: Element
  at: number
  duration: number
  easing: string
  from: Keyframe
  to: Keyframe
}

function scene(steps: Step[], length: number): Animation[] {
  // Group the steps by element, so each element gets one keyframe track per scene.
  const byEl = new Map<Element, Step[]>()
  for (const step of steps)
    byEl.set(step.el, [...(byEl.get(step.el) ?? []), step])
  const animations: Animation[] = []
  for (const [el, list] of byEl) {
    list.sort((a, b) => a.at - b.at)
    const frames: Keyframe[] = [{ ...list[0].from, offset: 0 }]
    for (const step of list) {
      frames.push({
        ...step.from,
        offset: step.at / length,
        easing: step.easing,
      })
      frames.push({ ...step.to, offset: (step.at + step.duration) / length })
    }
    frames.push({ ...list[list.length - 1].to, offset: 1 })
    animations.push(
      el.animate(frames, { duration: length, iterations: Infinity })
    )
  }
  return animations
}

const q = (root: HTMLElement, name: string) =>
  root.querySelector(`[data-part="${name}"]`)!

function setupMenu(root: HTMLElement) {
  const t = readTokens(root)
  const menu = q(root, "menu")
  const hidden = { opacity: 0, transform: "translateY(-4px)" }
  const shown = { opacity: 1, transform: "translateY(0)" }
  return scene(
    [
      {
        el: menu,
        at: 500,
        duration: t.ms("base"),
        easing: t.ease("out"),
        from: hidden,
        to: shown,
      },
      {
        el: menu,
        at: 2100,
        duration: t.ms("fast"),
        easing: t.ease("in"),
        from: shown,
        to: hidden,
      },
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
      {
        el: scrim,
        at: 500,
        duration: enter,
        easing: t.ease("out"),
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      {
        el: scrim,
        at: 2300,
        duration: leave,
        easing: t.ease("in"),
        from: { opacity: 1 },
        to: { opacity: 0 },
      },
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
      {
        el: toast,
        at: 500,
        duration: t.ms("base"),
        easing: t.ease("out"),
        from: hidden,
        to: shown,
      },
      {
        el: toast,
        at: 2400,
        duration: t.ms("fast"),
        easing: t.ease("in"),
        from: shown,
        to: hidden,
      },
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
        <span className="font-mono text-xs text-muted-foreground">
          {tokens}
        </span>
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
          The system&apos;s own transitions, on the live tokens. They loop here
          so you can watch them; in a product, each runs once per change.
        </p>
        {loop.reduced ? null : (
          <PauseButton paused={loop.paused} onChange={loop.setPaused} />
        )}
      </div>
      {loop.reduced ? <ReducedMotionNote /> : null}
      <div className="grid gap-6 @prose:grid-cols-2 @wide:grid-cols-4">
        <Scene
          title="Menu"
          tokens="base · out, fast · in"
          running={loop.running}
          setup={setupMenu}
        >
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

        <Scene
          title="Dialog"
          tokens="slow · out, base · in"
          running={loop.running}
          setup={setupDialog}
        >
          <div className="grid w-40 gap-2 self-start pt-6">
            <span className={cn(line, "w-3/4")} />
            <span className={cn(line, "w-1/2")} />
            <span className={cn(line, "w-2/3")} />
          </div>
          <span
            data-part="scrim"
            className="absolute inset-0 bg-overlay backdrop-blur-glass"
          />
          <span
            data-part="dialog"
            className="absolute grid w-36 gap-2.5 rounded-(--dialog-radius) border bg-popover p-4"
          >
            <span className="block h-2 w-3/4 rounded-full bg-foreground" />
            <span className={cn(line, "w-full")} />
            <span className="mt-1 block h-5 w-14 justify-self-end rounded-(--button-radius) bg-primary" />
          </span>
        </Scene>

        <Scene
          title="Tabs"
          tokens="base · in-out"
          running={loop.running}
          setup={setupTabs}
        >
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

        <Scene
          title="Toast"
          tokens="base · out, fast · in"
          running={loop.running}
          setup={setupToast}
        >
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
