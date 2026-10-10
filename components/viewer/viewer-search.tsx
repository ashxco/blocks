"use client"

import * as React from "react"

import { CommandPalette } from "@/components/viewer/command-palette"
import { OPEN_SEARCH_EVENT } from "@/components/viewer/search-trigger"

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

/**
 * The command palette and the ways to open it: ⌘K (Ctrl K) toggles it, "/"
 * opens it when no field has focus, and any SearchTrigger or sidebar search
 * button opens it through OPEN_SEARCH_EVENT. Mounted once by the viewer shell.
 */
export function ViewerSearch() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault()
        setOpen(true)
      }
    }
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen)
    }
  }, [])

  return <CommandPalette open={open} onOpenChange={setOpen} />
}
