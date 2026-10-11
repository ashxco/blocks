/**
 * Preview stages for docs examples that show an overlay already open.
 *
 * An overlay that opens on load portals into a stage inside its example
 * instead of <body>, so it follows the example's theme and mode and scrolls
 * with the page. isolate keeps the overlay's z-index inside the example, so it
 * scrolls under the site header. The overlay only opens once the stage
 * exists, so it is placed inside the stage from its first frame.
 */
import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

/** The stage element, once it is mounted. */
export type Stage = HTMLDivElement | null

const stageClass = {
  /** Popovers, menus, hover cards: the overlay hangs off a trigger in the stage. */
  anchored: "relative isolate flex w-full items-start justify-center",
  /**
   * Dialogs, sheets, drawers: contain-layout makes the stage the containing
   * block for the fixed overlay and popup.
   */
  overlay: "relative isolate h-full w-full overflow-hidden contain-layout",
}

/**
 * A stage, passing its element to `children` once it exists. With
 * returnFocus, focus that an opening menu takes is handed back to the page.
 */
export function PreviewStage({
  kind = "anchored",
  returnFocus = false,
  className,
  children,
}: {
  kind?: keyof typeof stageClass
  returnFocus?: boolean
  className?: string
  children: (container: Stage) => React.ReactNode
}) {
  const [container, setContainer] = React.useState<Stage>(null)
  useReturnFocus(returnFocus ? container : null)
  return (
    <div ref={setContainer} className={cn(stageClass[kind], className)}>
      {children(container)}
    </div>
  )
}

/** Blurs whatever inside `container` has focus. */
export function blurWithin(container: HTMLElement) {
  const active = document.activeElement
  if (active instanceof HTMLElement && container.contains(active)) active.blur()
}

/**
 * A menu focuses itself when it opens, and Base UI has no option to skip
 * that. Examples that show a menu open on load call this with their stage, so
 * the page keeps focus: once the menu has opened, focus inside the stage is
 * handed back to the page.
 */
export function useReturnFocus(container: HTMLElement | null, delay = 250) {
  React.useEffect(() => {
    if (!container) return
    const timer = window.setTimeout(() => blurWithin(container), delay)
    return () => window.clearTimeout(timer)
  }, [container, delay])
}

/**
 * Whether an overlay is closing because people clicked or tabbed elsewhere.
 * Shown overlays ignore that, so they stay open while people use the page;
 * their trigger and Escape still close them.
 */
export function isOutsideDismiss(details: { reason: string }) {
  return details.reason === "outside-press" || details.reason === "focus-out"
}

/** Open on load, and kept open when people click or tab elsewhere. */
export function usePinnedOpen(container: Stage) {
  const [open, setOpen] = React.useState(true)
  const onOpenChange = React.useCallback(
    (next: boolean, details: { reason: string }) => {
      if (!next && isOutsideDismiss(details)) return
      setOpen(next)
    },
    []
  )
  return { open: open && container !== null, setOpen, onOpenChange }
}

/**
 * Shown overlays keep their side, so they never flip over the example's own
 * text as the page scrolls, and they stay inside their stage.
 */
export function pinnedTo(container: Stage) {
  return {
    collisionAvoidance: { side: "none" },
    collisionBoundary: container ?? undefined,
  } as const
}

/**
 * Shown menus also keep their full height, and the wheel carries on to the
 * page over them. Each stage leaves room below.
 */
export const pinnedMenuClass = "max-h-none overscroll-auto"

/** A dialog, sheet or drawer open in place: no focus move, no scroll lock, no dismissal on outside clicks. */
export const openInPlace = {
  defaultOpen: true,
  modal: false,
  disablePointerDismissal: true,
} as const

/**
 * A dialog's content in a stage: portalled into it, leaving focus on the
 * page, and fitting the stage rather than the viewport. The wheel carries on
 * to the page once the dialog has nothing left to scroll.
 */
export function dialogInStage(container: Stage) {
  return {
    container,
    initialFocus: false,
    className: "max-h-[calc(100%-2rem)] overscroll-auto",
  } as const
}

/**
 * The page an open dialog, sheet or drawer sits on: a title, a meta line,
 * the action that opens the overlay, then the page's content. The overlay
 * tints and blurs it, as it does over a real page.
 */
export function StagePage({
  title,
  meta,
  action,
  children,
}: {
  title: string
  meta: string
  action: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid content-start gap-8 p-6 sm:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-h3 text-foreground">{title}</p>
          <p className="text-caption text-muted-foreground">{meta}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export interface StageDetail {
  label: string
  value: React.ReactNode
  /** Set in mono, for keys and IDs. */
  mono?: boolean
}

/** Label and value rows between hairlines, for a StagePage. */
export function StageDetails({ rows }: { rows: StageDetail[] }) {
  return (
    <dl className="grid divide-y border-y">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-6 py-4"
        >
          <dt className="text-sm text-muted-foreground">{row.label}</dt>
          <dd
            className={
              row.mono
                ? "font-mono text-code text-foreground"
                : "text-sm font-medium text-foreground"
            }
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * The bar above a stage that switches the open overlay between options, such
 * as a dialog's sizes or a sheet's sides.
 */
export function StageSwitcher<Value extends string>({
  label,
  "aria-label": ariaLabel,
  value,
  options,
  onValueChange,
  itemClassName,
}: {
  /** What the bar shows on its start side. */
  label: React.ReactNode
  "aria-label": string
  value: Value
  options: readonly { value: Value; label: string }[]
  onValueChange: (value: Value) => void
  itemClassName?: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
      {label}
      <ToggleGroup
        size="sm"
        aria-label={ariaLabel}
        value={[value]}
        onValueChange={(next) => {
          const option = next[0] as Value | undefined
          if (option) onValueChange(option)
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={itemClassName}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

/** The current prop value, for a StageSwitcher's label: size="lg". */
export function PropValue({ name, value }: { name: string; value: string }) {
  return (
    <code className="font-mono text-code text-muted-foreground">
      {name}=&quot;{value}&quot;
    </code>
  )
}
