"use client"

import * as React from "react"

import { isTypingTarget } from "@/lib/dom"

/** Keys that move focus or act on the focused control, not keys that type. */
const NAVIGATION_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Enter",
  " ",
  "Escape",
])

/**
 * Shows focus for the keyboard only. A mouse or touch press marks <html>
 * with data-modality="pointer", which collapses every focus outline
 * (globals.css); Tab, or a navigation key outside a text field, removes the
 * mark so focus shows again. Typing in a field the pointer focused keeps it
 * hidden. Mounted once in the root layout.
 */
export function FocusModality() {
  React.useEffect(() => {
    const root = document.documentElement
    function onPointerDown() {
      root.dataset.modality = "pointer"
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const navigating =
        event.key === "Tab" ||
        (NAVIGATION_KEYS.has(event.key) && !isTypingTarget(event.target))
      if (navigating) delete root.dataset.modality
    }
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("keydown", onKeyDown, true)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("keydown", onKeyDown, true)
    }
  }, [])
  return null
}
