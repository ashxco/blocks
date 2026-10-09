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
      scriptProps={INLINE_SCRIPT_PROPS}
      {...props}
    >
      <ThemeQueryScript />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

/**
 * Inline scripts only run from the server HTML. When React creates one on the
 * client (a client-rendered boundary), it would never run and React warns, so
 * on the client the same tag is marked as a data block. suppressHydrationWarning
 * keeps the server's attribute during hydration.
 */
const INLINE_SCRIPT_PROPS = {
  type: typeof window === "undefined" ? "text/javascript" : "application/json",
}

/** Runs before paint, right after next-themes' own script: applies ?theme=dark|light. */
const themeQueryScript = `(function(){try{var t=new URLSearchParams(location.search).get("theme");if(t!=="dark"&&t!=="light")return;var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t}catch(e){}})()`

function ThemeQueryScript() {
  return (
    <script
      {...INLINE_SCRIPT_PROPS}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeQueryScript }}
    />
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
 * own theme or other open tabs. ThemeQueryScript applies it before paint; this
 * hook hands it to next-themes as soon as React hydrates.
 */
function readThemeQuery(): "light" | "dark" | undefined {
  const value = new URLSearchParams(window.location.search).get("theme")
  return value === "dark" || value === "light" ? value : undefined
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  return () => window.removeEventListener("popstate", onChange)
}

function useThemeFromQuery() {
  return React.useSyncExternalStore(subscribeToNavigation, readThemeQuery, () => undefined)
}

export { ThemeProvider }
