"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Event the viewer header listens for to open the command palette. */
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

/** A button that opens the command palette from anywhere on the page. */
export function SearchTrigger({ label = "Search Blocks" }: { label?: string }) {
  const mod = useModKey()
  return (
    <Button variant="outline" size="lg" onClick={openSearch}>
      <SearchIcon data-icon="inline-start" />
      {label}
      <kbd className="ml-1 rounded-full border bg-muted px-2 font-mono text-xs text-muted-foreground">{mod}K</kbd>
    </Button>
  )
}
