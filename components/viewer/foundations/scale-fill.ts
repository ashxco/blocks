/**
 * Fill classes for the theme's alias scales, drawn from their CSS variables
 * so a swatch shows whatever theme scope it sits in. Literal class names so
 * Tailwind generates every step.
 */
import type { ScaleRole } from "./data"

/** The steps both alias scales have, light to dark. */
export const rampSteps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const

export const rampFill: Record<ScaleRole, Record<(typeof rampSteps)[number], string>> = {
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
