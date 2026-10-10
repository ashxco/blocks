"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useThemePreset } from "@/components/theme-provider"
import { useChooseTheme } from "@/components/viewer/theme-picker"
import { defaultThemeId, type ThemeId } from "@/lib/themes"

import { ByTheme } from "./by-theme"

/**
 * The action at the top of a theme's section on the Themes page:
 *
 * - "Use this theme" saves the theme for this browser and applies it at once,
 *   in this tab and every other open one.
 * - "Current theme" stands in for it on the theme the site is on. Choosing a
 *   theme moves focus there and announces the change, so keyboard and screen
 *   reader users never lose their place.
 * - On a page that forces a theme (?theme=<id>) other than the saved one, the
 *   forced theme reads "Previewing" and keeps its button, so the visitor can
 *   save what they are looking at; the saved theme (or the default, when
 *   nothing is saved) keeps the check as "Your theme".
 *
 * Before hydration the site's theme is only known to CSS, so the first frame
 * picks "Current theme" or the button from <html data-theme> (ByTheme).
 */
export function ThemeActions({ theme, name }: { theme: ThemeId; name: string }) {
  const { theme: active, forced, savedTheme } = useThemePreset()
  const chooseTheme = useChooseTheme()
  const statusRef = React.useRef<HTMLSpanElement>(null)
  const pendingFocus = React.useRef(false)
  const [applied, setApplied] = React.useState(false)
  // Once the site moves to another theme, this section's announcement is spent.
  const [lastActive, setLastActive] = React.useState(active)
  if (active !== lastActive) {
    setLastActive(active)
    if (active !== theme) setApplied(false)
  }

  const saved = savedTheme ?? defaultThemeId
  const previewing = active !== undefined && forced !== undefined && forced !== saved
  const isCurrent = previewing ? theme === saved : theme === active

  // After choosing this theme, move focus from the button (now gone) to the status that replaced it.
  React.useEffect(() => {
    if (!pendingFocus.current || !isCurrent) return
    pendingFocus.current = false
    statusRef.current?.focus()
  }, [isCurrent])

  const choose = () => {
    pendingFocus.current = true
    setApplied(true)
    chooseTheme(theme)
  }

  const button = (
    <Button type="button" onClick={choose}>
      Use This Theme<span className="sr-only"> ({name})</span>
    </Button>
  )
  const status = (label: string) => (
    <span
      ref={statusRef}
      tabIndex={-1}
      className="inline-flex h-(--button-height-md) items-center gap-2 rounded-(--button-radius) text-label text-foreground outline-none focus-visible:focus-ring"
    >
      <CheckIcon aria-hidden className="size-4 text-brand" strokeWidth={2.5} />
      {label}
    </span>
  )

  let content: React.ReactNode
  if (active === undefined) {
    // First frame and hydration: CSS shows the right one for the theme on <html>.
    content = (
      <ByTheme by={(id) => (id === theme ? "current" : "other")}>
        {(id) => (id === theme ? status("Current theme") : button)}
      </ByTheme>
    )
  } else if (previewing && theme === forced) {
    content = (
      <>
        <span className="text-label text-muted-foreground">Previewing</span>
        {button}
      </>
    )
  } else if (isCurrent) {
    content = status(previewing ? "Your theme" : "Current theme")
  } else {
    content = button
  }

  return (
    <>
      {content}
      {/* Polite, and only for the theme just chosen here, so a change from the picker is not announced five times. */}
      <span role="status" className="sr-only">
        {applied && active === theme ? `${name} theme applied` : ""}
      </span>
    </>
  )
}
