"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ExampleThumbnailContext } from "@/components/viewer/example-canvas"
import { useElementSize } from "@/components/viewer/scaled-frame"

/*
 * On phones each tile is the width of the screen, and a 1280px section scaled
 * into it is unreadable, so full-width examples show their tablet layout.
 * Tiles in a two-up phone grid also give the other examples a narrower canvas.
 */
const phoneQuery = "(max-width: 639px)"
const SMALL_TILE = 240

function subscribePhone(onChange: () => void) {
  const query = window.matchMedia(phoneQuery)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function usePhone() {
  return React.useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(phoneQuery).matches,
    () => false
  )
}

/**
 * A live miniature of a docs module's first example. The example renders
 * inert at a fixed virtual width and is scaled into the tile, so it is a
 * picture of the real thing, not a control. It mounts only when the tile
 * comes within a screen of the viewport; until then the tile shows its
 * placeholder.
 */
export function EntryThumbnail({
  children,
  placeholder,
  viewport = { full: 1280, other: 640 },
  className,
}: {
  /** A docs module, e.g. <ButtonDocs />. */
  children: React.ReactNode
  placeholder?: React.ReactNode
  /** Widths the example lays out at before it is scaled into the tile (narrower on phones). */
  viewport?: { full: number; other: number }
  className?: string
}) {
  const [ref, size] = useElementSize<HTMLDivElement>()
  const [visible, setVisible] = React.useState(false)
  const phone = usePhone()

  React.useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, visible])

  const ready = visible && size !== null && size.width > 0
  const full = phone ? Math.min(viewport.full, 768) : viewport.full
  const other = size && size.width < SMALL_TILE ? Math.min(viewport.other, 400) : viewport.other
  const value = React.useMemo(
    () => (size ? { width: size.width, height: size.height, viewport: { full, other } } : null),
    [size, full, other]
  )

  return (
    <div
      ref={ref}
      inert
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-subtle select-none",
        // Guidance and API tables are never part of a thumbnail.
        "[&_[data-slot=api]]:hidden [&_[data-slot=guidelines]]:hidden",
        className
      )}
    >
      {ready ? (
        <ExampleThumbnailContext.Provider value={value}>{children}</ExampleThumbnailContext.Provider>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6">{placeholder}</div>
      )}
    </div>
  )
}
