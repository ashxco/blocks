"use client"

import * as React from "react"

import { cn } from "@/components/viewer/cn"

/** Measures an element's content box and keeps it up to date. */
export function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}

/**
 * A live, non-interactive thumbnail of a page: the page renders in an iframe
 * at a desktop viewport width, scaled down to fit the frame.
 */
export function ScaledFrame({
  src,
  title,
  viewportWidth = 1280,
  className,
}: {
  src: string
  title: string
  /** Width the page is rendered at before scaling. */
  viewportWidth?: number
  className?: string
}) {
  const [ref, size] = useElementSize<HTMLDivElement>()
  const [loaded, setLoaded] = React.useState(false)
  const scale = size ? size.width / viewportWidth : 0

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-subtle", className)}>
      {size && scale > 0 ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          inert
          onLoad={() => setLoaded(true)}
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
    </div>
  )
}
