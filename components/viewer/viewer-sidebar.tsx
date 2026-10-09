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
  React.useEffect(() => {
    const container = ref.current
    const active = container?.querySelector<HTMLElement>("[data-active]")
    if (!container || !active) return
    const top =
      active.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
    if (top < container.scrollTop || top > container.scrollTop + container.clientHeight - 48) {
      container.scrollTop = Math.max(0, top - container.clientHeight / 3)
    }
    // Only on mount: later navigations happen from the sidebar itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
