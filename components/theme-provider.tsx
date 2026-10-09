"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const forcedTheme = useThemeFromQuery()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forcedTheme}
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

/**
 * Lets screenshots and template previews force a theme with ?theme=dark|light.
 * The theme is forced, not saved, so a preview never changes the visitor's
 * own theme or other open tabs.
 */
function useThemeFromQuery() {
  const [theme, setTheme] = React.useState<"light" | "dark" | undefined>()

  React.useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("theme")
    // Reading the URL is only possible after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value === "dark" || value === "light") setTheme(value)
  }, [])

  return theme
}

export { ThemeProvider }
