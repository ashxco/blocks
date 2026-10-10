"use client"

import * as React from "react"
import { SidebarPanel } from "@/components/viewer/sidebar-panel"

/**
 * The viewer's only chrome: a full-height sidebar on every page, with the
 * wordmark, search, navigation, Theme and Appearance. Below lg the phone menu
 * opens the same panel in a sheet.
 */
export function ViewerSidebar() {
  const ref = React.useRef<HTMLDivElement>(null)

  // Bring the active link into view on first load, without moving the page.
  // The list stops on a whole row: the active section's heading sits at the
  // top (or its group's heading when the section is too long, or the link
  // itself as a last resort), and the row above it is either fully shown in
  // the sidebar's top padding or scrolled fully out, never cut in half.
  React.useEffect(() => {
    const container = ref.current
    const active = container?.querySelector<HTMLElement>("[data-active]")
    if (!container || !active) return
    const offsetOf = (el: Element) =>
      el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
    const padding = parseFloat(getComputedStyle(container).paddingTop) || 0
    // Room left under the last row, so the link never sits on the bottom edge.
    const room = container.clientHeight - 48
    const bottom = offsetOf(active) + active.offsetHeight
    if (offsetOf(active) >= container.scrollTop && bottom <= container.scrollTop + room) return

    const rows = Array.from(container.querySelectorAll<HTMLElement>("a, button, [data-slot=input-group]")).filter(
      (el) => el.offsetHeight > 0
    )
    const scrollFor = (anchor: Element) => {
      const top = offsetOf(anchor)
      // Bottom of the last row that ends above the anchor.
      const edge = rows.reduce((max, el) => {
        const end = offsetOf(el) + el.offsetHeight
        return end <= top + 0.5 ? Math.max(max, end) : max
      }, 0)
      return Math.max(0, edge, top - padding)
    }
    const candidates = [
      active.closest("[data-nav-section]")?.firstElementChild,
      active.closest("[data-nav-group]")?.firstElementChild,
      active,
    ].filter((el): el is Element => Boolean(el))
    const anchor = candidates.find((el) => bottom - scrollFor(el) <= room) ?? active
    container.scrollTop = scrollFor(anchor)
    // Only on mount: later navigations happen from the sidebar itself.
  }, [])

  return (
    <aside
      aria-label="Documentation"
      style={{ viewTransitionName: "viewer-sidebar" }}
      className="sticky top-0 hidden h-dvh w-(--sidebar-width) shrink-0 border-r lg:block"
    >
      <SidebarPanel navRef={ref} />
    </aside>
  )
}
