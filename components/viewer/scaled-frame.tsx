"use client"

import * as React from "react"
import { RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { defaultThemeId, THEME_ATTRIBUTE, withLook, type ThemeId, type ThemeMode } from "@/lib/themes"
import { useSiteLook } from "@/components/viewer/site-theme"
import { loadThemeFonts } from "@/components/viewer/theme-fonts"

/**
 * Measures an element and keeps the size up to date. Reads the content box
 * by default; pass "border-box" to include padding and borders.
 */
export function useElementSize<T extends HTMLElement>(box: "content-box" | "border-box" = "content-box") {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const border = entry.borderBoxSize?.[0]
      const { width, height } =
        box === "border-box" && border
          ? { width: border.inlineSize, height: border.blockSize }
          : entry.contentRect
      setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el, { box })
    return () => observer.disconnect()
  }, [box])

  return [ref, size] as const
}

/**
 * Hides the Next.js development badge inside a same-origin preview frame, so
 * thumbnails and previews show only the page. Does nothing in production.
 */
export function hideDevIndicator(frame: HTMLIFrameElement) {
  if (process.env.NODE_ENV === "production") return
  try {
    const doc = frame.contentDocument
    if (!doc || doc.getElementById("bk-hide-dev-indicator")) return
    const style = doc.createElement("style")
    style.id = "bk-hide-dev-indicator"
    style.textContent = "nextjs-portal{display:none !important;}"
    doc.head.appendChild(style)
  } catch {
    // Cross-origin frames cannot be styled; the badge stays.
  }
}

/** The theme and mode a preview frame shows. */
export interface FrameLook {
  theme: ThemeId
  mode: ThemeMode
}

/** A frame's address with ?theme=<id>&mode=<mode>, so the page paints in that look from its first frame. */
export function withFrameLook(src: string, look: Partial<FrameLook> | undefined) {
  return withLook(src, { theme: look?.theme, mode: look?.mode })
}

/* -------------------------------------------------------------------------- */
/* Frame look                                                                  */
/* -------------------------------------------------------------------------- */

/** What <html> carries for a theme: no attribute for the default theme. */
const themeAttribute = (theme: ThemeId) => (theme === defaultThemeId ? null : theme)

/**
 * Puts a same-origin document on one look, the way the site itself does it:
 * the mode class on <html> with a matching color-scheme (as next-themes
 * does), and data-theme for the theme. Transitions are paused for the switch
 * so every surface changes in the same frame.
 */
function applyDocumentLook(doc: Document, look: FrameLook, pauseTransitions: boolean) {
  const root = doc.documentElement
  const { mode, theme } = look
  const other = mode === "dark" ? "light" : "dark"
  const classOk = root.classList.contains(mode) && !root.classList.contains(other)
  const schemeOk = root.style.colorScheme === mode
  const themeOk = root.getAttribute(THEME_ATTRIBUTE) === themeAttribute(theme)
  if (classOk && schemeOk && themeOk) return

  let pause: HTMLStyleElement | null = null
  if (pauseTransitions && doc.head) {
    pause = doc.createElement("style")
    pause.textContent = "*,*::before,*::after{transition:none !important;}"
    doc.head.appendChild(pause)
  }
  if (!classOk) {
    root.classList.remove(other)
    root.classList.add(mode)
  }
  if (!schemeOk) root.style.colorScheme = mode
  if (!themeOk) {
    const value = themeAttribute(theme)
    if (value) root.setAttribute(THEME_ATTRIBUTE, value)
    else root.removeAttribute(THEME_ATTRIBUTE)
  }
  if (pause) {
    // Force a style recalc, then let transitions run again.
    void doc.defaultView?.getComputedStyle(doc.body ?? root).opacity
    const done = pause
    doc.defaultView?.setTimeout(() => done.remove(), 1)
  }
}

/** True when a same-origin frame's document is already on the look. */
export function frameHasLook(frame: HTMLIFrameElement | null, look: FrameLook) {
  try {
    const root = frame?.contentDocument?.documentElement
    if (!root) return false
    return root.classList.contains(look.mode) && root.getAttribute(THEME_ATTRIBUTE) === themeAttribute(look.theme)
  } catch {
    return true
  }
}

/**
 * Keeps a same-origin preview frame on the viewer's chosen look (theme and
 * mode), in place.
 *
 * The frame's address carries the look it starts with (withFrameLook), and
 * the page applies it before its first paint. After that the viewer applies
 * the look to the frame's document itself: as soon as it loads, again
 * whenever the page tries to change it (hydration, a saved theme or mode
 * synced from another tab), and whenever the viewer's choice changes, without
 * reloading. A new theme waits for its fonts in the frame first (at most a
 * moment), so the preview never flashes a fallback font.
 *
 * Returns a callback for the frame's onLoad.
 */
export function useFrameLook(look: FrameLook | undefined) {
  const mode = look?.mode
  const theme = look?.theme
  const lookRef = React.useRef(look)
  const frameRef = React.useRef<HTMLIFrameElement | null>(null)
  const observerRef = React.useRef<MutationObserver | null>(null)

  React.useEffect(() => {
    const current = mode && theme ? { mode, theme } : undefined
    lookRef.current = current
    if (!current) return
    let doc: Document | null | undefined
    try {
      doc = frameRef.current?.contentDocument
    } catch {
      return
    }
    if (!doc?.documentElement) return
    const target = doc
    const themeChanges = target.documentElement.getAttribute(THEME_ATTRIBUTE) !== themeAttribute(current.theme)
    if (!themeChanges) {
      applyDocumentLook(target, current, true)
      return
    }
    void loadThemeFonts(current.theme, target).then(() => {
      const wanted = lookRef.current
      if (wanted && wanted.theme === current.theme && target.documentElement) applyDocumentLook(target, wanted, true)
    })
  }, [mode, theme])

  React.useEffect(() => () => observerRef.current?.disconnect(), [])

  return React.useCallback((frame: HTMLIFrameElement) => {
    frameRef.current = frame
    observerRef.current?.disconnect()
    observerRef.current = null
    let doc: Document | null = null
    try {
      doc = frame.contentDocument
    } catch {
      return
    }
    if (!doc?.documentElement) return
    const current = lookRef.current
    if (current) applyDocumentLook(doc, current, false)
    const target = doc
    const observer = new MutationObserver(() => {
      const wanted = lookRef.current
      if (wanted) applyDocumentLook(target, wanted, false)
    })
    observer.observe(target.documentElement, { attributes: true, attributeFilter: ["class", "style", THEME_ATTRIBUTE] })
    observerRef.current = observer
  }, [])
}

/* -------------------------------------------------------------------------- */
/* Load queue                                                                  */
/* -------------------------------------------------------------------------- */

/*
 * Every thumbnail is a full Next.js page. Starting all of them at once makes
 * every one of them slow, so at most a few load at a time, nearest first.
 */
const MAX_LOADING = 3
/** How long a preview may take to load before it shows as unavailable. */
export const LOAD_TIMEOUT = 20000
let loading = 0
const waiting: (() => void)[] = []

/** Starts queued loads while there are free slots. */
function pump() {
  while (loading < MAX_LOADING && waiting.length) waiting.shift()?.()
}

/** Waits for a free load slot, then calls start. Returns a release function. */
function requestLoadSlot(start: () => void) {
  let started = false
  let released = false
  const run = () => {
    started = true
    loading += 1
    start()
  }
  if (loading < MAX_LOADING) run()
  else waiting.push(run)

  return () => {
    if (released) return
    released = true
    if (started) {
      loading -= 1
      // Release often happens inside another frame's cleanup or load event.
      // The next frame starts afterwards, never in the middle of that work.
      queueMicrotask(pump)
    } else {
      const index = waiting.indexOf(run)
      if (index >= 0) waiting.splice(index, 1)
    }
  }
}

/**
 * True when a frame holds a page that rendered. A failed load (the browser's
 * own error page) is cross-origin, so its document is unreadable; a page that
 * crashed on the server comes back as a Next.js error document or empty.
 */
export function frameRendered(frame: HTMLIFrameElement) {
  try {
    const doc = frame.contentDocument
    if (!doc?.body || doc.URL === "about:blank") return false
    if (doc.documentElement.id === "__next_error__") return false
    return Array.from(doc.body.children).some((el) => el.tagName !== "SCRIPT" && el.tagName !== "NEXTJS-PORTAL")
  } catch {
    return false
  }
}

/* -------------------------------------------------------------------------- */
/* Scaled frame                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A live, non-interactive thumbnail of a page: the page renders in an iframe
 * at a desktop viewport width, scaled down to fit the frame, in the viewer's
 * theme and mode. The frame only starts loading when it comes within a
 * screen of the viewport, a few at a time; until then it shows the
 * placeholder.
 *
 * The iframe is a real viewport of viewportWidth, so vw units, media queries
 * and tokens with breakpoint values all follow that width on their own. Only
 * the in-page previews of <Example> (a scaled element, not a frame) recompute
 * them, with viewportStyle from components/viewer/devices.ts.
 */
export function ScaledFrame({
  src,
  title,
  viewportWidth = 1280,
  placeholder,
  className,
}: {
  src: string
  title: string
  /** Width the page is rendered at before scaling. */
  viewportWidth?: number
  /** Fills the frame until the page has loaded, e.g. a wireframe of the page. */
  placeholder?: React.ReactNode
  className?: string
}) {
  const [ref, size] = useElementSize<HTMLDivElement>()
  const site = useSiteLook()
  const look = site.mode && site.theme ? { mode: site.mode, theme: site.theme } : undefined
  // Read when the frame starts, so a look change while it waits for a slot keeps its place in the queue.
  const lookRef = React.useRef(look)
  React.useEffect(() => {
    lookRef.current = look
  })
  const [phase, setPhase] = React.useState<"idle" | "loading" | "loaded" | "error">("idle")
  // The address is fixed once the frame starts: look changes are applied in place.
  const [frameSrc, setFrameSrc] = React.useState<string | null>(null)
  const releaseRef = React.useRef<(() => void) | null>(null)
  const syncLook = useFrameLook(look)
  const scale = size ? size.width / viewportWidth : 0
  const hasLook = look !== undefined

  React.useEffect(() => {
    const el = ref.current
    if (!el || !hasLook || frameSrc) return
    let release: (() => void) | null = null
    let granted = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        release = requestLoadSlot(() => {
          granted = true
          if (release) releaseRef.current = release
          setFrameSrc(withFrameLook(src, lookRef.current))
          setPhase("loading")
        })
        if (granted) releaseRef.current = release
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      // Still waiting for a slot: give up the place in the queue.
      if (!granted) release?.()
    }
  }, [ref, src, hasLook, frameSrc])

  // Free the slot and say so if the page never loads, and free it when the
  // card goes away. A page that loads late still replaces the message.
  React.useEffect(() => {
    if (phase !== "loading") return
    const id = window.setTimeout(() => {
      releaseRef.current?.()
      setPhase("error")
    }, LOAD_TIMEOUT)
    return () => window.clearTimeout(id)
  }, [phase])
  React.useEffect(() => () => releaseRef.current?.(), [])

  const retry = () => {
    releaseRef.current?.()
    releaseRef.current = null
    setPhase("idle")
    setFrameSrc(null)
  }

  const loaded = phase === "loaded"
  const failed = phase === "error"

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-subtle", className)}>
      {/* Under the frame, which fades in over it once the page has loaded. */}
      {placeholder ? (
        <div aria-hidden="true" className="absolute inset-0">
          {placeholder}
        </div>
      ) : null}
      {frameSrc && size && scale > 0 ? (
        <iframe
          src={frameSrc}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          inert
          onLoad={(event) => {
            const el = event.currentTarget
            releaseRef.current?.()
            if (!frameRendered(el)) {
              setPhase("error")
              return
            }
            hideDevIndicator(el)
            syncLook(el)
            setPhase("loaded")
          }}
          className={cn(
            "pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-background",
            "transition-opacity duration-(--duration-slow) ease-out",
            loaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            width: viewportWidth,
            height: size.height / scale,
            transform: `scale(${scale})`,
          }}
        />
      ) : null}
      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center">
          {failed ? (
            <div className="flex items-center gap-3 rounded-(--button-radius) border bg-background py-1 pr-1 pl-4">
              <span className="text-caption text-muted-foreground">Preview unavailable</span>
              {/* Above the card's stretched link, so it can be clicked. */}
              <Button
                variant="outline"
                size="xs"
                onClick={retry}
                aria-label={`Retry the ${title} preview`}
                className="pointer-events-auto relative z-10"
              >
                <RotateCwIcon data-icon="inline-start" />
                Retry
              </Button>
            </div>
          ) : (
            <Spinner
              aria-hidden="true"
              className={cn(
                "size-4 text-muted-foreground transition-opacity duration-(--duration-base)",
                phase === "loading" ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
