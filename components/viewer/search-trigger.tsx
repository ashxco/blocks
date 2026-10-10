"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

/** Event the viewer's search (ViewerSearch) listens for to open the command palette. */
export const OPEN_SEARCH_EVENT = "blocks:open-search"

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))
}

const subscribe = () => () => {}

/** "⌘" on Apple platforms, "Ctrl" elsewhere. "⌘" before hydration. */
export function useModKey() {
  return React.useSyncExternalStore(
    subscribe,
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl "),
    () => "⌘"
  )
}

/**
 * A button that opens the command palette from anywhere on the page. The
 * keyboard shortcut only shows where there is likely to be a keyboard.
 */
export function SearchTrigger({ label = "Search Blocks" }: { label?: string }) {
  const mod = useModKey()
  return (
    <Button variant="outline" size="lg" onClick={openSearch} aria-keyshortcuts="Meta+K Control+K">
      <SearchIcon data-icon="inline-start" />
      {label}
      <Kbd aria-hidden="true" className="ml-1 hidden sm:not-pointer-coarse:inline-flex">
        {mod}K
      </Kbd>
    </Button>
  )
}
