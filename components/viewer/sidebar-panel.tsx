"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { openSearch, useModKey } from "@/components/viewer/search-trigger"
import { SidebarNav } from "@/components/viewer/sidebar-nav"
import { ThemePicker } from "@/components/viewer/theme-picker"
import { ThemeToggle } from "@/components/viewer/theme-toggle"
import { Wordmark } from "@/components/viewer/wordmark"

/** A quiet field-shaped button that opens the command palette. */
function SidebarSearch() {
  const mod = useModKey()
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search Blocks"
      aria-keyshortcuts="Meta+K Control+K /"
      className={cn(
        "flex h-(--control-height-sm) w-full items-center gap-2 rounded-(--control-radius) border border-transparent bg-muted pr-1.5 pl-3 text-label font-medium text-muted-foreground outline-none",
        "transition-colors duration-(--duration-fast) hover:border-border hover:text-foreground focus-visible:focus-ring"
      )}
    >
      <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
      Search
      <Kbd
        aria-hidden="true"
        className="ml-auto bg-background pointer-coarse:hidden"
      >
        {mod}K
      </Kbd>
    </button>
  )
}

/**
 * Everything the viewer needs to get around, in one column: the wordmark,
 * search, the Foundations and Components tree, and Theme and Appearance at
 * the foot. The desktop sidebar and the phone sheet both render it.
 */
export function SidebarPanel({
  onNavigate,
  end,
  navRef,
}: {
  /** Called when a link is followed, so the phone sheet can close. */
  onNavigate?: () => void
  /** Extra control beside the wordmark, such as the sheet's close button. */
  end?: React.ReactNode
  /** The scrolling list, so the sidebar can bring the current page into view. */
  navRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 pr-3 pl-6">
        <Wordmark onClick={onNavigate} />
        {end}
      </div>
      <div className="shrink-0 px-4 pb-2">
        <SidebarSearch />
      </div>
      <div
        ref={navRef}
        className="min-h-0 flex-1 [scrollbar-width:thin] overflow-y-auto overscroll-contain px-3 pt-4 pb-8"
      >
        <SidebarNav onNavigate={onNavigate} />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 border-t px-3 py-3">
        <ThemePicker />
        <ThemeToggle />
      </div>
    </div>
  )
}
