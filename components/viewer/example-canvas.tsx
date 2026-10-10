"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PortalScope } from "@/lib/portal-container"
import { defaultThemeId, isThemeId, THEME_ATTRIBUTE, type ThemeId } from "@/lib/themes"
import { CodeBlock } from "@/components/viewer/code-block"
import { CopyButton } from "@/components/viewer/copy-button"
import { deviceOrder, devices, viewportStyle, type Device } from "@/components/viewer/devices"
import { slugify } from "@/components/viewer/nav"
import { useElementSize } from "@/components/viewer/use-element-size"
import { Segmented } from "@/components/viewer/segmented"
import { themeScope, useSiteLook, type SiteTheme } from "@/components/viewer/site-theme"
import { thumbnailExample } from "@/components/viewer/thumbnail-example"
import { TokenText } from "@/components/viewer/token-text"

export { themeScope, useHydrated, useSiteTheme } from "@/components/viewer/site-theme"

export interface ExampleProps {
  /** Short name of the example, e.g. "Variants". */
  title: string
  /** One sentence on when to use this example. */
  description?: string
  /** Source shown in the Code tab. Optional. */
  code?: string
  /**
   * How the preview canvas lays out its children.
   * - center: centred, wrapping row (default)
   * - stack: a column centred on the canvas. Each child fills the column up
   *   to its own max-width (max-w-sm, max-w-prose …) and centres; a child
   *   with its own width or margins keeps them.
   * - full: no padding, children fill the canvas (app frames, site navigation, a page with a dialog pinned open)
   *
   * The canvas is a container that includes the center and stack padding, so
   * container queries and cqw units in an example see about 5rem more than
   * its content gets. An example that switches layout at an exact width
   * should wrap itself in its own @container (see docs/components/table.tsx).
   */
  layout?: "center" | "stack" | "full"
  /** Canvas surface. Use "panel" to preview components that sit on dark panels. */
  surface?: "default" | "subtle" | "panel"
  /** Minimum canvas height, as a Tailwind class (e.g. "min-h-96"). */
  minHeight?: string
  /**
   * Use this example as the module's thumbnail on the index pages instead of
   * the first one. Set it on a direct child of <Examples>.
   */
  thumbnail?: boolean
  children: React.ReactNode
}

type CanvasTheme = SiteTheme

/*
 * The stack layout's children: full width up to their own max-width, centred.
 * Written with :where() so it has no specificity and a child's own width or
 * margin classes (w-64, w-fit, mx-0) always win.
 */
const stackChildren = "[:where(&>*)]:mx-auto [:where(&>*)]:w-full"

/* -------------------------------------------------------------------------- */
/* Thumbnails                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Set by EntryThumbnail (components/viewer/entry-thumbnail.tsx) to the size
 * of a thumbnail tile. Inside it, <Examples> renders only its thumbnail example
 * and <Example> renders only its canvas, scaled into the tile.
 */
export const ExampleThumbnailContext = React.createContext<ExampleThumbnailSize | null>(null)

export interface ExampleThumbnailSize {
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
  return <div className="grid grid-cols-[minmax(0,1fr)] gap-16 sm:gap-20">{children}</div>
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
        if (child.offsetParent === null && getComputedStyle(child).display === "contents") visit(child)
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
      else if (style.display !== "none" && style.position !== "fixed" && style.position !== "absolute") roots.push(child)
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
  const zoom = Math.max(ZOOM_MIN, Math.min(roomX / box.width, roomY / box.height, ZOOM_MAX))
  const originX = box.left + box.width / 2
  const originY = box.top + box.height / 2
  // Centred; anything still too big after the minimum zoom starts at the top left.
  const targetX = box.width * zoom > roomX ? width * MARGIN_X + (box.width * zoom) / 2 : width / 2
  const targetY = box.height * zoom > roomY ? height * MARGIN_Y + (box.height * zoom) / 2 : height / 2
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
function useContentResize(ref: React.RefObject<HTMLElement | null>, measure: () => void) {
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

function ExampleThumbnail({
  layout,
  surface,
  size,
  children,
}: {
  layout: NonNullable<ExampleProps["layout"]>
  surface: ExampleProps["surface"]
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
  const virtualWidth = stage ? Math.min(STAGE_WIDTH, widths[widths.length - 1]) : widths[index]
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
  }, [full, current.final, scale, size.height, index, widths.length, sizeKey, virtualWidth, virtualHeight])

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
            layout === "center" && "flex h-full flex-wrap content-center items-center justify-center gap-4 p-10",
            layout === "stack" && cn("grid h-full content-center gap-4 p-10", stackChildren)
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

/* -------------------------------------------------------------------------- */
/* Outer scopes                                                                */
/* -------------------------------------------------------------------------- */

interface OuterLook {
  theme?: ThemeId
  mode?: CanvasTheme
}

/**
 * The theme and mode scopes an element sits in below <html>: the nearest
 * data-theme and the nearest .dark or .light between it and the page, if
 * any (a ThemeScope around an example, say). The page's own theme and mode
 * live on <html> and every overlay inherits them already; an outer scope has
 * to be handed to the example's overlays explicitly.
 */
function useOuterLook(ref: React.RefObject<HTMLElement | null>, siteLook: string): OuterLook {
  const [outer, setOuter] = React.useState<OuterLook>({})
  // Two closest() lookups, and a state update only when a scope changed.
  // Read again whenever the page's look changes.
  React.useLayoutEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const root = parent.ownerDocument.documentElement
    const themeScope = parent.closest(`[${THEME_ATTRIBUTE}]`)
    const modeScope = parent.closest(".dark, .light")
    const value = themeScope && themeScope !== root ? themeScope.getAttribute(THEME_ATTRIBUTE) : null
    const next: OuterLook = {
      theme: value === null ? undefined : isThemeId(value) ? value : defaultThemeId,
      mode: modeScope && modeScope !== root ? (modeScope.classList.contains("dark") ? "dark" : "light") : undefined,
    }
    setOuter((prev) => (prev.theme === next.theme && prev.mode === next.mode ? prev : next))
  }, [ref, siteLook])
  return outer
}

/* -------------------------------------------------------------------------- */
/* Example                                                                     */
/* -------------------------------------------------------------------------- */

const deviceOptions = deviceOrder.map((value) => ({
  value,
  icon: devices[value].icon,
  label: value === "desktop" ? "Desktop, full canvas width" : `${devices[value].label}, ${devices[value].width}px`,
}))

/**
 * A preview canvas for one example: Preview and Code tabs, a copy button, a
 * per-example light/dark switch (Appearance) and, for full-width examples, a
 * desktop/tablet/mobile switch.
 *
 * The canvas is in the site's theme. Forcing its mode keeps that theme: only
 * .dark or .light is scoped on the canvas. Menus, dialogs and popovers opened
 * from the example portal into a body-level element with the canvas's mode,
 * and with the theme and mode of any scope around the example (PortalScope).
 *
 * Tablet and mobile render the example in a virtual viewport of exactly that
 * width, scaled down when the canvas is narrower. Container queries respond to
 * the frame, every fluid token (type, gutter, section rhythm) is computed for
 * the device width, and tokens with breakpoint values (such as the 16px text
 * in form controls on phones) take the value for that width, so the preview
 * matches a real phone or tablet.
 */
export function Example({
  title,
  description,
  code,
  layout = "center",
  surface = "default",
  minHeight,
  children,
}: ExampleProps) {
  const thumbnail = React.useContext(ExampleThumbnailContext)
  const siteLook = useSiteLook()
  const sectionRef = React.useRef<HTMLElement>(null)
  const outer = useOuterLook(sectionRef, `${siteLook.theme}:${siteLook.mode}`)
  const siteTheme = outer.mode ?? siteLook.mode
  const [chosenTheme, setChosenTheme] = React.useState<CanvasTheme | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [stageRef, stage] = useElementSize<HTMLDivElement>()
  const [frameRef, frame] = useElementSize<HTMLDivElement>("border-box")

  const theme = chosenTheme ?? siteTheme ?? "light"
  // Only scope the canvas when it differs from what it inherits, so it keeps
  // everything else (the theme, fonts, focus) untouched.
  const scope = chosenTheme && chosenTheme !== siteTheme ? themeScope(chosenTheme) : undefined
  // Overlays leave the canvas for <body>: they need the canvas's mode, and
  // any theme or mode scoped around the example, but not the page's own.
  const portalMode = scope ?? outer.mode
  const constrained = layout === "full" && device !== "desktop"
  const virtualWidth = constrained ? devices[device].width : undefined
  const scale = virtualWidth && stage ? Math.min(1, stage.width / virtualWidth) : 1
  const id = slugify(title)

  if (thumbnail) {
    return (
      <ExampleThumbnail layout={layout} surface={surface} size={thumbnail}>
        {children}
      </ExampleThumbnail>
    )
  }

  return (
    <section ref={sectionRef} data-slot="example" id={id} className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-5">
      <header className="grid gap-2">
        <h2 className="text-h3">{title}</h2>
        {description ? (
          <p className="max-w-prose text-body text-copy">
            <TokenText text={description} />
          </p>
        ) : null}
      </header>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "code")}
        className="gap-0 overflow-hidden rounded-(--card-radius) border bg-background"
      >
        <div className="flex h-12 items-stretch justify-between gap-2 border-b pr-2 pl-4 sm:pl-5">
          <TabsList variant="line" aria-label={`${title} example`} className="-mb-px data-horizontal:h-auto">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {code ? <TabsTrigger value="code">Code</TabsTrigger> : null}
          </TabsList>

          <div className="flex items-center gap-1.5">
            {layout === "full" && tab === "preview" ? (
              <Segmented
                label="Preview width"
                iconOnly
                value={device}
                onValueChange={setDevice}
                className="hidden sm:flex"
                options={deviceOptions}
              />
            ) : null}
            {tab === "preview" ? (
              <Segmented
                label="Preview appearance"
                iconOnly
                value={theme}
                onValueChange={setChosenTheme}
                options={[
                  { value: "light", label: "Light", icon: SunIcon },
                  { value: "dark", label: "Dark", icon: MoonIcon },
                ]}
              />
            ) : null}
            {code ? <CopyButton text={code} /> : null}
          </div>
        </div>

        <TabsContent value="preview" keepMounted className="text-copy data-[hidden]:hidden">
          {/* The same element tree in every mode, so switching the device or the
              theme never remounts the example or resets its state. */}
          <div className={scope} data-example-scope={scope}>
            <div
              ref={stageRef}
              data-surface={surface}
              data-device={layout === "full" ? device : undefined}
              className={cn(
                "text-copy",
                // Fades only when the reader switches this example's theme,
                // never while the page itself is loading or changing theme.
                chosenTheme !== null && "transition-colors duration-(--duration-base)",
                constrained ? "bg-subtle px-3 py-6 sm:px-6 sm:py-10" : canvasSurface(surface)
              )}
            >
              <div
                className={cn(constrained && "mx-auto overflow-hidden")}
                style={
                  virtualWidth
                    ? { width: virtualWidth * scale, height: frame && scale < 1 ? frame.height * scale : undefined }
                    : undefined
                }
              >
                <div
                  ref={frameRef}
                  className={cn(
                    "@container w-full",
                    // Full-width examples compute fluid type and spacing for the
                    // canvas they sit in, at every device size, not the window.
                    layout === "full" && "bk-viewport",
                    constrained &&
                      cn("origin-top-left overflow-hidden rounded-(--card-radius) border", canvasSurface(surface))
                  )}
                  style={
                    virtualWidth
                      ? {
                          ...viewportStyle(virtualWidth),
                          width: virtualWidth,
                          transform: scale < 1 ? `scale(${scale})` : undefined,
                        }
                      : layout === "full" && stage
                        ? viewportStyle(stage.width)
                        : undefined
                  }
                >
                  <div
                    className={cn(
                      layout === "center" && "flex min-h-52 flex-wrap content-center items-center justify-center gap-4 p-6 sm:p-12",
                      layout === "stack" && cn("grid gap-4 p-6 sm:p-10", stackChildren),
                      layout === "full" && "w-full",
                      minHeight
                    )}
                  >
                    {/* Menus, dialogs and popovers opened here portal into a
                        body-level element with the example's theme and mode. */}
                    <PortalScope className={portalMode} theme={outer.theme}>
                      {children}
                    </PortalScope>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {code ? (
          <TabsContent value="code">
            <CodeBlock code={code} className="max-h-[32rem]" />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  )
}

function canvasSurface(surface: ExampleProps["surface"]) {
  if (surface === "subtle") return "bg-subtle"
  if (surface === "panel") return "bg-panel text-panel-foreground"
  return "bg-background"
}
