import type * as React from "react"
import { MonitorIcon, SmartphoneIcon, TabletIcon, type LucideIcon } from "lucide-react"

import { responsiveVars } from "@/design-system/generated/tokens"

export type Device = "desktop" | "tablet" | "mobile"

/**
 * Preview widths of the example canvas's width switch. The previews
 * render at exactly these widths and scale down when the stage is
 * narrower, so a "Mobile" preview always lays out like a 390px phone.
 */
export const devices: Record<Device, { width: number; label: string; icon: LucideIcon }> = {
  desktop: { width: 1440, label: "Desktop", icon: MonitorIcon },
  tablet: { width: 834, label: "Tablet", icon: TabletIcon },
  mobile: { width: 390, label: "Mobile", icon: SmartphoneIcon },
}

export const deviceOrder: Device[] = ["desktop", "tablet", "mobile"]

/** Media queries read rem at the browser default, whatever the page's font size. */
const ROOT_PX = 16

function minPx(min: string) {
  const value = Number.parseFloat(min)
  return min.trim().endsWith("rem") ? value * ROOT_PX : value
}

/** A token formula written with vw, recomputed against the virtual viewport. */
const toVirtualVw = (value: string) => value.replace(/(\d*\.?\d+)vw/g, "calc($1 * var(--bk-vw))")

/**
 * Inline style for a virtual viewport (`.bk-viewport`, see viewer-styles.ts)
 * of the given width in CSS pixels.
 *
 * Media queries follow the real browser window, not a scaled preview. So a
 * preview sets two things for its own width: `--bk-vw`, 1% of the width, which
 * every fluid (vw) token is recomputed against, and the value of every token
 * that changes at a breakpoint (responsiveVars, from the token build), so a
 * Mobile preview gets the phone values, such as 16px text in form controls.
 */
export function viewportStyle(width: number): React.CSSProperties {
  const style: Record<string, string> = { "--bk-vw": `${width / 100}px` }
  const layers = [responsiveVars.base, ...responsiveVars.breakpoints.filter((b) => width >= minPx(b.min)).map((b) => b.vars)]
  for (const vars of layers) {
    for (const [name, value] of Object.entries(vars)) style[name] = toVirtualVw(value)
  }
  return style as React.CSSProperties
}
