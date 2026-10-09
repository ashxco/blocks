import * as React from "react"

import { cn } from "@/lib/utils"

export interface SparklineProps {
  /** Values in order, oldest first. Twelve points read well at this size. */
  data: number[]
  /** Draw a flat 10% wash under the line. */
  fill?: boolean
  className?: string
}

/**
 * A tiny trend line. It takes its colour from `currentColor`, so set a text
 * colour token on it (text-brand, text-panel-foreground, text-chart-2...).
 */
export function Sparkline({ data, fill = true, className }: SparklineProps) {
  const width = 100
  const height = 32
  const inset = 3

  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - inset - ((value - min) / range) * (height - inset * 2)
    return [x, y] as const
  })
  const line = points
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    )
    .join(" ")
  const area = `${line} L${width} ${height} L0 ${height} Z`

  return (
    <svg
      data-slot="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block overflow-visible", className)}
    >
      {fill ? <path d={area} className="fill-current opacity-10" /> : null}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
