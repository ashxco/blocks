"use client"

import * as React from "react"

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
