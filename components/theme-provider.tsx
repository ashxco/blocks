"use client"

import * as React from "react"
import { isTypingTarget } from "@/lib/dom"
import { usePathname, useSearchParams } from "next/navigation"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

import {
  defaultThemeId,
  isThemeId,
  isThemeMode,
  readLookQuery,
  THEME_ATTRIBUTE,
  THEME_PARAM,
  THEME_STORAGE_KEY,
  themes,
  themeScript,
  withLook,
  type Theme,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes"

/**
 * The site's look: the mode (light or dark, "Appearance") through
 * next-themes, and the theme preset (blocks, ocean, …) through
 * useThemePreset. Both are applied to <html> before first paint, can be
 * forced by the URL (?theme=<id>&mode=dark|light) and follow other tabs.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const forcedMode = useModeFromQuery()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forcedMode}
      scriptProps={INLINE_SCRIPT_PROPS}
      {...props}
    >
      <ThemeScript />
      <ThemeHotkey />
      <ThemePresetSync />
      {/* useSearchParams needs a Suspense boundary on prerendered pages; this renders nothing. */}
      <React.Suspense fallback={null}>
        <ThemeRouteSync />
      </React.Suspense>
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

/** Runs before paint, right after next-themes' own script: the forced mode, then the theme (lib/themes.ts). */
function ThemeScript() {
  return (
    <script
      {...INLINE_SCRIPT_PROPS}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  )
}

/**
 * Drops a mode the URL forces (&mode=dark|light, or the older
 * ?theme=dark|light) so a saved mode can show, and tells the forced-mode
 * listener (it follows popstate) to read the URL again. A ?theme=<id> stays.
 */
function releaseForcedMode() {
  if (!readLookQuery(window.location.search).mode) return
  const legacy = isThemeMode(
    new URLSearchParams(window.location.search).get(THEME_PARAM)
  )
  // Null state: Next.js copies its own history state and picks up the new URL.
  window.history.replaceState(
    null,
    "",
    withLook(window.location.href, {
      mode: null,
      ...(legacy ? { theme: null } : {}),
    })
  )
  // No state, so the router ignores it; only the look listeners react.
  window.dispatchEvent(new PopStateEvent("popstate"))
}

/**
 * Switches Appearance from what is on screen, forced by the URL or not:
 * releases a forced mode, then saves the other one. The D hotkey and the
 * Appearance toggle both use it.
 */
function useToggleAppearance(): () => void {
  const { setTheme } = useTheme()
  return React.useCallback(() => {
    const shown = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
    releaseForcedMode()
    setTheme(shown === "dark" ? "light" : "dark")
  }, [setTheme])
}

/** D switches Appearance, unless a modifier is held or focus is in a text field. */
function ThemeHotkey() {
  const toggleAppearance = useToggleAppearance()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.toLowerCase() !== "d" ||
        isTypingTarget(event.target)
      ) {
        return
      }
      toggleAppearance()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleAppearance])

  return null
}

/** Components listening for look changes in this tab: the theme, and the forced theme and mode. */
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

/* -------------------------------------------------------------------------- */
/* Forced mode                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Lets screenshots and previews force the mode with &mode=dark|light (or the
 * older ?theme=dark|light). The mode is forced, not saved, so a preview never
 * changes the visitor's own mode or other open tabs. ThemeScript applies it
 * before paint; this hands it to next-themes as soon as React hydrates.
 */
function readModeQuery(): ThemeMode | undefined {
  return readLookQuery(window.location.search).mode
}

function subscribeToNavigation(onChange: () => void) {
  // listeners: ThemeRouteSync notifies after client-side navigations.
  listeners.add(onChange)
  window.addEventListener("popstate", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("popstate", onChange)
  }
}

function useModeFromQuery() {
  return React.useSyncExternalStore(
    subscribeToNavigation,
    readModeQuery,
    () => undefined
  )
}

/* -------------------------------------------------------------------------- */
/* Theme preset                                                                */
/* -------------------------------------------------------------------------- */

function readSavedTheme(): ThemeId | undefined {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeId(value) ? value : undefined
  } catch {
    return undefined
  }
}

function readForcedTheme(): ThemeId | undefined {
  return readLookQuery(window.location.search).theme
}

/** The theme <html> is on: the attribute is the source of truth, so a change made from outside (a preview frame's host) shows up too. */
function readActiveTheme(): ThemeId {
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  return isThemeId(value) ? value : defaultThemeId
}

/** Puts <html> on a theme, with transitions paused so every surface changes in the same frame. */
function applyTheme(theme: ThemeId) {
  const root = document.documentElement
  const current = root.getAttribute(THEME_ATTRIBUTE)
  const next = theme === defaultThemeId ? null : theme
  if (current === next) return
  const pause = document.createElement("style")
  pause.textContent = "*,*::before,*::after{transition:none !important;}"
  document.head.appendChild(pause)
  if (next) root.setAttribute(THEME_ATTRIBUTE, next)
  else root.removeAttribute(THEME_ATTRIBUTE)
  // Force a style recalc, then let transitions run again.
  void window.getComputedStyle(document.body).opacity
  window.setTimeout(() => pause.remove(), 1)
}

function subscribeToTheme(onChange: () => void) {
  listeners.add(onChange)
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  })
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) onChange()
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener("popstate", onChange)
  return () => {
    listeners.delete(onChange)
    observer.disconnect()
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("popstate", onChange)
  }
}

const serverSnapshot = () => undefined

/**
 * Chooses a theme: saves it, applies it to this page and (through the
 * storage event) every other open tab of the site. A page whose URL forces a
 * theme (?theme=<id>) drops that parameter, so the choice shows at once.
 */
function setThemePreset(theme: ThemeId) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  if (readForcedTheme()) {
    // Null state: Next.js copies its own history state and syncs
    // useSearchParams with the new URL (it skips states that carry its own).
    window.history.replaceState(
      null,
      "",
      withLook(window.location.href, { theme: null })
    )
  }
  applyTheme(theme)
  notify()
}

/** The theme a page should be on: the one its URL forces, else the saved one, else the default. */
const wantedTheme = () =>
  readForcedTheme() ?? readSavedTheme() ?? defaultThemeId

/** True inside a preview frame: the viewer that embeds it keeps it on the viewer's look. */
const inFrame = () => window.self !== window.top

/**
 * Follows the saved theme when another tab changes it, unless this page's URL
 * forces one. On mount it also applies the theme where the before-paint
 * script did not run, such as a not-found page rendered on the client.
 */
function ThemePresetSync() {
  React.useLayoutEffect(() => {
    if (inFrame() || readActiveTheme() === wantedTheme()) return
    applyTheme(wantedTheme())
    notify()
  }, [])

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
      if (readForcedTheme()) return
      applyTheme(readSavedTheme() ?? defaultThemeId)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return null
}

/**
 * Client-side navigations change the URL without a reload, so the before-paint
 * script does not run again. When a navigation adds or drops ?theme=<id> (or
 * &mode=), this puts the page on the look a reload of the new URL would show.
 */
function ThemeRouteSync() {
  const pathname = usePathname()
  const search = useSearchParams()?.toString() ?? ""
  const route = `${pathname}?${search}`
  const previous = React.useRef(route)

  React.useEffect(() => {
    if (previous.current === route) return
    previous.current = route
    if (inFrame()) return
    applyTheme(wantedTheme())
    // Re-reads the forced theme and mode for useThemePreset and next-themes.
    notify()
  }, [route])

  return null
}

export interface ThemePresetState {
  /** The theme the page is on. Undefined until hydration, so the server and first client render agree. */
  theme: ThemeId | undefined
  /** Saves and applies a theme, in this tab and every other open tab. */
  setTheme: (theme: ThemeId) => void
  /** Every theme, in picker order, with names, swatches, radii and fonts. */
  themes: readonly Theme[]
  /** The theme the URL forces (?theme=<id>), if any. Choosing a theme releases it. */
  forced: ThemeId | undefined
  /** The visitor's saved theme, if they have chosen one. */
  savedTheme: ThemeId | undefined
}

/** The active theme preset and a way to change it. Works anywhere under the root layout. */
function useThemePreset(): ThemePresetState {
  const theme = React.useSyncExternalStore(
    subscribeToTheme,
    readActiveTheme,
    serverSnapshot
  )
  const forced = React.useSyncExternalStore(
    subscribeToTheme,
    readForcedTheme,
    serverSnapshot
  )
  const savedTheme = React.useSyncExternalStore(
    subscribeToTheme,
    readSavedTheme,
    serverSnapshot
  )
  return { theme, setTheme: setThemePreset, themes, forced, savedTheme }
}

export { ThemeProvider, useThemePreset, useToggleAppearance }
