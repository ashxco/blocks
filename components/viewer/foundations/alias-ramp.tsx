/**
 * A theme's alias scale (accent or neutral) as a strip of its eleven steps,
 * drawn from the CSS variables so it shows whatever theme scope it sits in.
 * Server-safe.
 */
import { themeScopeProps, type ThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"

import type { ScaleRole } from "./data"

const steps = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const

/* Literal class names so Tailwind generates every step. */
const fill: Record<ScaleRole, Record<(typeof steps)[number], string>> = {
  accent: {
    "50": "bg-(--bk-accent-50)",
    "100": "bg-(--bk-accent-100)",
    "200": "bg-(--bk-accent-200)",
    "300": "bg-(--bk-accent-300)",
    "400": "bg-(--bk-accent-400)",
    "500": "bg-(--bk-accent-500)",
    "600": "bg-(--bk-accent-600)",
    "700": "bg-(--bk-accent-700)",
    "800": "bg-(--bk-accent-800)",
    "900": "bg-(--bk-accent-900)",
    "950": "bg-(--bk-accent-950)",
  },
  neutral: {
    "50": "bg-(--bk-neutral-50)",
    "100": "bg-(--bk-neutral-100)",
    "200": "bg-(--bk-neutral-200)",
    "300": "bg-(--bk-neutral-300)",
    "400": "bg-(--bk-neutral-400)",
    "500": "bg-(--bk-neutral-500)",
    "600": "bg-(--bk-neutral-600)",
    "700": "bg-(--bk-neutral-700)",
    "800": "bg-(--bk-neutral-800)",
    "900": "bg-(--bk-neutral-900)",
    "950": "bg-(--bk-neutral-950)",
  },
}

/** The strip, light to dark. Pass `theme` to draw another theme's scale than the one around it. */
export function AliasRamp({
  role,
  theme,
  className,
}: {
  role: ScaleRole
  theme?: ThemeId
  className?: string
}) {
  return (
    <span
      aria-hidden
      {...themeScopeProps(
        theme,
        undefined,
        cn("grid grid-cols-11 overflow-hidden", className)
      )}
    >
      {steps.map((step) => (
        <span key={step} className={fill[role][step]} />
      ))}
    </span>
  )
}
