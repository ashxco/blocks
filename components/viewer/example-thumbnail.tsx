"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { viewportStyle } from "@/components/viewer/devices"
import { thumbnailExample } from "@/components/viewer/thumbnail-example"

/** How the preview canvas lays out its children (see ExampleProps in example-canvas.tsx). */
export type ExampleLayout = "center" | "stack" | "full"
export type ExampleSurface = "default" | "subtle" | "panel"

export function canvasSurface(surface: ExampleSurface) {
  if (surface === "subtle") return "bg-subtle"
  if (surface === "panel") return "bg-panel text-panel-foreground"
  return "bg-background"
}

/*
 * The stack layout's children: full width up to their own max-width, centred.
 * Written with :where() so it has no specificity and a child's own width or
 * margin classes (w-64, w-fit, mx-0) always win.
 */
export const stackChildren = "[:where(&>*)]:mx-auto [:where(&>*)]:w-full"

/**
 * Set by EntryThumbnail (components/viewer/entry-thumbnail.tsx) to the size
 * of a thumbnail tile. Inside it, <Examples> renders only its thumbnail example
 * and <Example> renders only its canvas, scaled into the tile.
 */
export const ExampleThumbnailContext =
  React.createContext<ExampleThumbnailSize | null>(null)

interface ExampleThumbnailSize {
  /** The tile's size. */
  width: number
  height: number
  /** Virtual viewport widths the example lays out at before scaling: full-width examples, then the rest. */
  viewport: { full: number; other: number }
}

/** The client half of <Examples> (docs/kit.tsx): the list, or only the thumbnail example in a thumbnail. */
export function ExamplesList({ children }: { children: React.ReactNode }) {
  const thumbnail = React.useContext(ExampleThumbnailContext)
  if (thumbnail) return <>{thumbnailExample(children)}</>
  // One column that never grows past the page: an example wider than its
  // canvas is clipped by the canvas, never by the window.
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-16 sm:gap-20">
      {children}
    </div>
  )
}

/*
 * How a thumbnail frames its example.
 *
 * Full-width examples (sections, app screens) fill the tile's width. When a
 * section is short for the tile, it steps down to a narrower viewport (its
 * tablet layout), which is taller and larger, then sits centred.
 *
 * A stage (a page with a dialog, sheet or drawer pinned open inside it: a
 * root with layout containment that fills the height it is given) has no
 * height of its own to fit. It lays out at STAGE_WIDTH and is sized to the
 * tile exactly, so its popup reads at the size of the neighbouring tiles
 * instead of shrinking to fit a desktop-wide page.
 *
 * Other examples (a button row, a single input, a card) are framed like a
 * camera: the box around the content is zoomed to fit the tile with a margin,
 * so a small control grows and a tall card shrinks a little, instead of
 * floating in an empty tile or being cut off.
 */
const FULL_FILL = 0.6
const FULL_WIDTHS = [1024, 768]
const STAGE_WIDTH = 640
/*
 * A narrow zoom band keeps neighbouring tiles at nearly the same type size: a
 * small control is not blown up next to a form drawn at its natural scale.
 */
const ZOOM_MAX = 1.1
const ZOOM_MIN = 0.7
const MARGIN_X = 0.1
const MARGIN_Y = 0.12

interface Box {
  left: number
  top: number
  width: number
  height: number
}

interface Framing {
  originX: number
  originY: number
  x: number
  y: number
  zoom: number
}

/** The widths a full-width example may lay out at, widest first. */
function fullWidths(full: number) {
  return [full, ...FULL_WIDTHS.filter((w) => w < full)]
}

/**
 * The layout box around an element's content, in its own coordinates (the
 * element must be positioned). Boxless wrappers (display: contents) are
 * looked through. Layout offsets ignore transforms, so the result does not
 * change with the zoom applied to the element.
 */
function contentBox(container: HTMLElement): Box | null {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  const visit = (parent: Element) => {
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement)) continue
      if (child.offsetParent !== container) {
        if (
          child.offsetParent === null &&
          getComputedStyle(child).display === "contents"
        )
          visit(child)
        continue
      }
      if (child.offsetWidth === 0 && child.offsetHeight === 0) continue
      left = Math.min(left, child.offsetLeft)
      top = Math.min(top, child.offsetTop)
      right = Math.max(right, child.offsetLeft + child.offsetWidth)
      bottom = Math.max(bottom, child.offsetTop + child.offsetHeight)
    }
  }
  visit(container)
  if (!Number.isFinite(left)) return null
  return { left, top, width: right - left, height: bottom - top }
}

/**
 * Whether the example is a stage: its only laid-out root has layout
 * containment (which docs stages use to hold fixed popups inside them) and
 * stretches to the full height it is given. A frame with a height of its own,
 * such as a scrolling page preview, is laid out like any other section.
 */
function isStage(container: HTMLElement, height: number) {
  const roots: HTMLElement[] = []
  const visit = (parent: Element) => {
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement)) continue
      const style = getComputedStyle(child)
      if (style.display === "contents") visit(child)
      else if (
        style.display !== "none" &&
        style.position !== "fixed" &&
        style.position !== "absolute"
      )
        roots.push(child)
    }
  }
  visit(container)
  if (roots.length !== 1) return false
  const root = roots[0]
  const style = getComputedStyle(root)
  if (!/\b(?:layout|content|strict)\b/.test(style.contain)) return false
  // Stretched to the height given, or held taller than it by its own minimum.
  const minHeight = parseFloat(style.minHeight) || 0
  return (
    Math.abs(root.offsetHeight - height) < 1 ||
    (root.offsetHeight > height && Math.abs(root.offsetHeight - minHeight) < 1)
  )
}

/** Zooms a content box to fit a viewport of width × height, with a margin. */
function frame(box: Box, width: number, height: number): Framing {
  const roomX = width * (1 - 2 * MARGIN_X)
  const roomY = height * (1 - 2 * MARGIN_Y)
  const zoom = Math.max(
    ZOOM_MIN,
    Math.min(roomX / box.width, roomY / box.height, ZOOM_MAX)
  )
  const originX = box.left + box.width / 2
  const originY = box.top + box.height / 2
  // Centred; anything still too big after the minimum zoom starts at the top left.
  const targetX =
    box.width * zoom > roomX
      ? width * MARGIN_X + (box.width * zoom) / 2
      : width / 2
  const targetY =
    box.height * zoom > roomY
      ? height * MARGIN_Y + (box.height * zoom) / 2
      : height / 2
  return { originX, originY, x: targetX - originX, y: targetY - originY, zoom }
}

function sameFraming(a: Framing | null, b: Framing) {
  return (
    a !== null &&
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.zoom - b.zoom) < 0.005 &&
    Math.abs(a.originX - b.originX) < 0.5 &&
    Math.abs(a.originY - b.originY) < 0.5
  )
}

/**
 * Calls measure now, and again whenever the element or any of its direct
 * children (including ones added later) changes size.
 */
function useContentResize(
  ref: React.RefObject<HTMLElement | null>,
  measure: () => void
) {
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    // Later changes are measured on the next frame, outside the observer
    // callback, so a re-layout never loops inside ResizeObserver.
    let frameId = 0
    const schedule = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    }
    const resize = new ResizeObserver(schedule)
    const observeChildren = () => {
      resize.observe(el)
      for (const child of el.children) resize.observe(child)
    }
    observeChildren()
    const mutations = new MutationObserver(() => {
      observeChildren()
      schedule()
    })
    mutations.observe(el, { childList: true })
    return () => {
      cancelAnimationFrame(frameId)
      resize.disconnect()
      mutations.disconnect()
    }
  }, [ref, measure])
}

/** An example's canvas inside an index thumbnail, laid out at a virtual width and scaled into the tile. */
export function ExampleThumbnail({
  layout,
  surface,
  size,
  children,
}: {
  layout: ExampleLayout
  surface: ExampleSurface
  size: ExampleThumbnailSize
  children: React.ReactNode
}) {
  const full = layout === "full"
  const widths = full ? fullWidths(size.viewport.full) : [size.viewport.other]

  // Which of the widths a full-width example uses, or whether it is a stage.
  // Starts from the widest again whenever the tile changes size.
  const sizeKey = `${size.width}:${size.height}:${widths.join(",")}`
  const initial = { key: sizeKey, index: 0, final: false, stage: false }
  const [step, setStep] = React.useState(initial)
  const current = step.key === sizeKey ? step : initial
  const index = Math.min(current.index, widths.length - 1)
  const stage = full && current.stage
  const virtualWidth = stage
    ? Math.min(STAGE_WIDTH, widths[widths.length - 1])
    : widths[index]
  const scale = size.width / virtualWidth
  const virtualHeight = size.height / scale

  const contentRef = React.useRef<HTMLDivElement>(null)
  const [framing, setFraming] = React.useState<Framing | null>(null)

  const measure = React.useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const box = contentBox(el)
    if (!box || box.width === 0 || box.height === 0) return
    if (full) {
      if (current.final) return
      if (isStage(el, virtualHeight)) {
        setStep({ key: sizeKey, index, final: true, stage: true })
        return
      }
      const fill = (box.height * scale) / size.height
      if (fill > 1 && index > 0) {
        // The narrower layout no longer fits: keep the last one that did.
        setStep({ key: sizeKey, index: index - 1, final: true, stage: false })
      } else if (fill < FULL_FILL && index < widths.length - 1) {
        setStep({ key: sizeKey, index: index + 1, final: false, stage: false })
      }
      return
    }
    const next = frame(box, virtualWidth, virtualHeight)
    setFraming((prev) => (sameFraming(prev, next) ? prev : next))
  }, [
    full,
    current.final,
    scale,
    size.height,
    index,
    widths.length,
    sizeKey,
    virtualWidth,
    virtualHeight,
  ])

  useContentResize(contentRef, measure)

  return (
    // Every tile shares one canvas: a subtle example surface is drawn plain here.
    <div
      className={cn(
        "absolute inset-0 overflow-hidden text-copy",
        canvasSurface(surface === "subtle" ? "default" : surface)
      )}
    >
      <div
        className="bk-viewport @container origin-top-left"
        style={{
          ...viewportStyle(virtualWidth),
          width: virtualWidth,
          height: virtualHeight,
          transform: `scale(${scale})`,
        }}
      >
        <div
          ref={contentRef}
          className={cn(
            "relative",
            // One row at least as tall as the tile: a section shorter than
            // that sits centred, and h-full content stretches to every edge.
            full && !stage && "grid min-h-full w-full grid-rows-1 items-center",
            // A stage is exactly the tile, whatever its own minimum height:
            // its popup stays inside, and a long page or panel is clipped.
            stage && "grid h-full w-full grid-rows-1 *:h-full! *:min-h-0!",
            layout === "center" &&
              "flex h-full flex-wrap content-center items-center justify-center gap-4 p-10",
            layout === "stack" &&
              cn("grid h-full content-center gap-4 p-10", stackChildren)
          )}
          style={
            framing && !full
              ? {
                  transformOrigin: `${framing.originX}px ${framing.originY}px`,
                  transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.zoom})`,
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
