"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export type SiteTheme = "light" | "dark"

const subscribe = () => () => {}

/** True after hydration, so theme-dependent UI never mismatches the server. */
export function useHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

/**
 * The site's theme as the visitor sees it: the forced theme when the page was
 * opened with ?theme=, otherwise the resolved one. Undefined before hydration.
 */
export function useSiteTheme(): SiteTheme | undefined {
  const { resolvedTheme, forcedTheme } = useTheme()
  const hydrated = useHydrated()
  if (!hydrated) return undefined
  return (forcedTheme ?? resolvedTheme) === "dark" ? "dark" : "light"
}

/** Class that scopes the tokens of a region to one theme. */
export function themeScope(theme: SiteTheme | undefined) {
  if (theme === "dark") return "dark"
  if (theme === "light") return "light"
  return undefined
}
