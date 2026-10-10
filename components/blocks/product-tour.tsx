"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import {
  BoardScreen,
  ReportScreen,
  ScreenFrame,
  TaskScreen,
  TimelineScreen,
} from "@/components/blocks/product-tour/screens"
import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

export {
  BoardScreen,
  PriorityBadge,
  PersonAvatar,
  ReportScreen,
  ScreenFrame,
  TaskScreen,
  TimelineScreen,
} from "@/components/blocks/product-tour/screens"
export type {
  BoardCard,
  BoardColumn,
  ReportFigure,
  ReportScreenProps,
  ScreenFrameProps,
  TaskPriority,
  TimelineItem,
} from "@/components/blocks/product-tour/screens"

export interface ProductTourStep {
  title: string
  description: string
  /** Short readout on the right of the step, such as the view it opens. Also shown in the window bar. */
  meta?: string
  /** The product screen for this step, such as <BoardScreen />. It fills the window under the bar. */
  screen: React.ReactNode
}

export interface ProductTourProps {
  title?: React.ReactNode
  description?: React.ReactNode
  steps?: ProductTourStep[]
  /** Page name in the window bar. */
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

const defaultSteps: ProductTourStep[] = [
  {
    title: "Plan",
    description: "Lay out the work on a timeline, set milestones and see where tasks overlap.",
    meta: "Timeline",
    screen: <TimelineScreen />,
  },
  {
    title: "Assign",
    description: "Give every task one owner, a due date, a priority and the subtasks it needs.",
    meta: "Task",
    screen: <TaskScreen />,
  },
  {
    title: "Track",
    description: "Move cards across the board as work happens. Everyone sees the same status.",
    meta: "Board",
    screen: <BoardScreen />,
  },
  {
    title: "Report",
    description: "Delivery, workload and cycle time update on their own, ready for the weekly review.",
    meta: "Report",
    screen: <ReportScreen />,
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
 * A dark panel that walks through a product tour. Steps are listed on the
 * left as a vertical tab list; the app window on the right shows the product
 * screen for the selected step. It advances on its own every few seconds while on
 * screen, pauses on hover, and stops for good once someone picks a step or
 * presses pause. With reduced motion it never advances on its own.
 */
export function ProductTour({
  title = (
    <>
      From first plan
      <br />
      to final report.
    </>
  ),
  description = "Follow one project through Acme. Every step happens in the same workspace, so nothing gets lost between tools and nobody asks for a status update.",
  steps = defaultSteps,
  windowTitle = "Website relaunch",
  autoPlay = true,
  interval = 4500,
  defaultStep = 0,
  contained = true,
  className,
}: ProductTourProps) {
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
      data-slot="product-tour"
      className={cn(contained && "container-wide py-section", className)}
    >
      <div className="@container/tour rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <div className="mx-auto max-w-page">
          {/* The same split as SectionHeading: title left, lead right, sharing a baseline. */}
          <div className="mb-12 grid gap-6 @narrow/tour:mb-16 @narrow/tour:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @narrow/tour:items-end @narrow/tour:gap-16">
            {title ? (
              <h2 className="max-w-narrow text-h2 text-panel-foreground">
                <Kern>{title}</Kern>
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-prose text-lead text-panel-muted @narrow/tour:pb-1.5">{description}</p>
            ) : null}
          </div>

          <div
            className="grid gap-6 @narrow/tour:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @narrow/tour:gap-10"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <div className="grid content-start justify-items-start gap-6">
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label="Tour steps"
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
                          <span className="text-caption text-panel-muted">{step.meta}</span>
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

            {/* Beside the steps, the window runs the full height of the list and the pause button. */}
            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId(active)}
              className="min-w-0 self-start @narrow/tour:flex @narrow/tour:flex-col @narrow/tour:self-stretch"
            >
              <ScreenFrame title={windowTitle} view={current.meta} className="@narrow/tour:flex-1">
                {/* Every screen sits in the same cell, so the window takes the height of the tallest and never jumps. */}
                <div className="grid flex-1">
                  {steps.map((step, i) => {
                    const shown = i === active
                    return (
                      // The shown screen is announced as one image; the screen inside stays inert.
                      <div
                        key={step.title}
                        role={shown ? "img" : undefined}
                        aria-label={shown ? `${step.title}: ${step.description}` : undefined}
                        aria-hidden={shown ? undefined : true}
                        className={cn(
                          "col-start-1 row-start-1 flex min-w-0 flex-col transition-opacity duration-(--duration-slow) ease-out",
                          shown ? "opacity-100" : "invisible opacity-0"
                        )}
                      >
                        <div inert className="flex min-w-0 flex-1 flex-col">
                          {step.screen}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScreenFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
