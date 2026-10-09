"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { CodeWindow } from "@/components/blocks/code-window"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export interface PipelineStep {
  title: string
  description: string
  /** Short readout on the right of the step, such as a duration. */
  meta?: string
  /** Terminal output for this step. "$" prompts, "✓" successes, "→" notes. */
  lines: string[]
}

export interface PipelineShowcaseProps {
  title?: React.ReactNode
  description?: React.ReactNode
  steps?: PipelineStep[]
  /** Label in the terminal title bar. */
  windowTitle?: string
  /** Advance through the steps on a timer until someone interacts. Off when reduced motion is on. */
  autoPlay?: boolean
  /** Milliseconds per step while auto-playing. */
  interval?: number
  /** Index of the step selected first. */
  defaultStep?: number
  /** Renders its own container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultSteps: PipelineStep[] = [
  {
    title: "Push",
    description: "Push to git, run lumen deploy or start a deploy from your editor.",
    meta: "0.4s",
    lines: [
      "$ git push origin main",
      "→ Received push to main (a41c9e2)",
      "→ Detected Next.js 16 on Node 22",
      "→ Using lumen.toml from the repository root",
      "✓ Queued build on fra-1",
    ],
  },
  {
    title: "Build",
    description: "Every commit builds in isolation into a versioned image.",
    meta: "14.2s",
    lines: [
      "→ Restoring build cache (92% hit)",
      "$ npm ci",
      "→ Installed 612 packages in 3.1s",
      "$ npm run build",
      "→ Compiled 214 routes in 11.8s",
      "✓ Image lumen/web:a41c9e2 (14.2s)",
    ],
  },
  {
    title: "Ship",
    description: "The new version starts beside the old one on a private network.",
    meta: "6.1s",
    lines: [
      "→ Pushing image to fra-1 and iad-1",
      "→ Starting 2 replicas in each region",
      "→ Waiting for GET /healthz",
      "→ fra-1: 2 of 2 healthy",
      "→ iad-1: 2 of 2 healthy",
      "✓ a41c9e2 ready beside a3f7d10",
    ],
  },
  {
    title: "Route",
    description: "Domains, TLS and edge rules apply, then traffic switches over.",
    meta: "1.8s",
    lines: [
      "→ Certificate valid for web.acme.dev",
      "→ Applying 3 edge rules",
      "→ Shifting traffic 0% → 25% → 100%",
      "→ Draining a3f7d10",
      "✓ Live at https://web.acme.dev",
    ],
  },
  {
    title: "Watch",
    description: "Logs and metrics stream in from the first request.",
    meta: "live",
    lines: [
      "$ lumen logs --tail",
      "GET  /             200  8ms",
      "GET  /pricing      200 11ms",
      "POST /api/login    200 41ms",
      "GET  /api/projects 200 23ms",
      "✓ p95 112ms, error rate 0.0%",
    ],
  },
]

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(reducedMotionQuery)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

/** True when the visitor asks for reduced motion. Assumes reduced on the server. */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true
  )
}

/** True while at least a quarter of the element is on screen. */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
}

/**
 * A dark panel that walks through the deploy pipeline. Steps are listed on
 * the left as a vertical tab list; the terminal on the right shows the
 * selected step's output. It advances on its own every few seconds while on
 * screen, pauses on hover, and stops for good once someone picks a step or
 * presses pause. With reduced motion it never advances on its own.
 */
export function PipelineShowcase({
  title = (
    <>
      One push. Five steps.
      <br />
      Zero config.
    </>
  ),
  description = "Follow a commit from git push to live traffic. Every step streams to your terminal and to the dashboard as it happens.",
  steps = defaultSteps,
  windowTitle = "lumen — acme/web",
  autoPlay = true,
  interval = 4500,
  defaultStep = 0,
  contained = true,
  className,
}: PipelineShowcaseProps) {
  const id = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const count = steps.length
  const [active, setActive] = React.useState(() => Math.min(Math.max(defaultStep, 0), Math.max(count - 1, 0)))
  const [userPlaying, setUserPlaying] = React.useState<boolean | null>(null)
  const [hovered, setHovered] = React.useState(false)

  const reducedMotion = usePrefersReducedMotion()
  const inView = useInView(rootRef)

  const playing = count > 1 && (userPlaying ?? (autoPlay && !reducedMotion))
  const running = playing && inView && !hovered

  React.useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), interval)
    return () => window.clearInterval(timer)
  }, [running, interval, count])

  const current = steps[Math.min(active, count - 1)]
  if (!current) return null

  // The terminal sizes to its content. Shorter steps are padded with blank
  // rows up to the longest one, so the window keeps one height as it advances.
  const rows = Math.max(...steps.map((step) => step.lines.length))
  const lines = [...current.lines, ...Array.from({ length: rows - current.lines.length }, () => "")]

  function select(index: number, focus = false) {
    setActive(index)
    setUserPlaying(false)
    if (focus) tabRefs.current[index]?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: (index + 1) % count,
      ArrowRight: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  const tabId = (i: number) => `${id}-tab-${i}`
  const panelId = `${id}-panel`

  return (
    <section
      ref={rootRef}
      data-slot="pipeline-showcase"
      className={cn(contained && "container-wide py-section", className)}
    >
      <div className="@container/pipeline rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <div className="mx-auto max-w-page">
          {/* The same split as SectionHeading: title left, lead right, sharing a baseline. */}
          <div className="mb-12 grid gap-6 @narrow/pipeline:mb-16 @narrow/pipeline:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow/pipeline:items-end @narrow/pipeline:gap-16">
            {title ? (
              <h2 className="max-w-narrow text-h2 text-panel-foreground">
                <Kern>{title}</Kern>
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-prose text-lead text-panel-muted @narrow/pipeline:pb-1.5">{description}</p>
            ) : null}
          </div>

          <div
            className="grid gap-6 @narrow/pipeline:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @narrow/pipeline:gap-10"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <div className="grid content-start justify-items-start gap-6">
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label="Pipeline steps"
                className="grid w-full content-start gap-1"
                onFocus={() => setUserPlaying(false)}
              >
                {steps.map((step, i) => {
                  const selected = i === active
                  return (
                    <button
                      key={step.title}
                      ref={(node) => {
                        tabRefs.current[i] = node
                      }}
                      type="button"
                      role="tab"
                      id={tabId(i)}
                      aria-selected={selected}
                      aria-controls={panelId}
                      aria-labelledby={`${tabId(i)}-title`}
                      aria-describedby={`${tabId(i)}-desc`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className={cn(
                        "grid w-full rounded-r-sm border-l-(length:--border-width-strong) px-5 py-4 text-left outline-none",
                        "transition-colors duration-(--duration-base) ease-standard focus-visible:focus-ring",
                        selected
                          ? "border-l-panel-brand bg-panel-raised"
                          : "border-l-panel-border hover:bg-panel-raised/50"
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span id={`${tabId(i)}-title`} className="text-title text-panel-foreground">
                          {step.title}
                        </span>
                        {step.meta ? (
                          <span className="font-mono text-caption text-panel-muted tabular">{step.meta}</span>
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-out",
                          selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <span className="overflow-hidden">
                          <span id={`${tabId(i)}-desc`} className="block pt-1.5 text-sm text-panel-muted">
                            {step.description}
                          </span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>

              {count > 1 ? (
                <Button
                  type="button"
                  variant="outline-inverse"
                  size="sm"
                  onClick={() => setUserPlaying(!playing)}
                  aria-controls={panelId}
                >
                  {playing ? <PauseIcon data-icon="inline-start" /> : <PlayIcon data-icon="inline-start" />}
                  {playing ? "Pause walkthrough" : "Play walkthrough"}
                </Button>
              ) : null}
            </div>

            <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className="min-w-0 self-start">
              <CodeWindow wrap title={windowTitle} lines={lines} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
