"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { SidebarNav } from "@/components/viewer/sidebar-nav"

/**
 * Sticky desktop sidebar. Hidden on the overview, which is a full-bleed
 * landing page, and below the lg breakpoint, where the mobile menu takes over.
 */
export function ViewerSidebar() {
  const pathname = usePathname()
  const ref = React.useRef<HTMLElement>(null)

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

  if (pathname === "/") return null

  return (
    <aside
      ref={ref}
      aria-label="Documentation"
      className="sticky top-(--viewer-bar) hidden h-[calc(100dvh-var(--viewer-bar))] w-(--sidebar-width) shrink-0 overflow-y-auto overscroll-contain border-r px-4 pt-8 pb-16 [scrollbar-width:thin] lg:block"
    >
      <SidebarNav />
    </aside>
  )
}
