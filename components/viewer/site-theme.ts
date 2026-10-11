"use client"

import { useTheme } from "next-themes"

import { useThemePreset } from "@/components/theme-provider"
import { useHydrated } from "@/components/viewer/hooks"
import type { ThemeId, ThemeMode } from "@/lib/themes"

/** Light or dark: the site's mode ("Appearance" in the UI). */
export type SiteMode = ThemeMode

/**
 * The site's mode as the visitor sees it: the forced mode when the page was
 * opened with &mode= (or ?theme=dark|light), otherwise the resolved one.
 * Undefined before hydration.
 */
export function useSiteMode(): SiteMode | undefined {
  const { resolvedTheme, forcedTheme } = useTheme()
  const hydrated = useHydrated()
  if (!hydrated) return undefined
  return (forcedTheme ?? resolvedTheme) === "dark" ? "dark" : "light"
}

/**
 * The site's theme preset (blocks, ocean, …) as the visitor sees it: the
 * forced one when the page was opened with ?theme=<id>, otherwise the saved
 * one. Undefined before hydration.
 */
export function useSitePreset(): ThemeId | undefined {
  return useThemePreset().theme
}

/** The site's theme and mode together. Both undefined before hydration. */
export function useSiteLook(): {
  theme: ThemeId | undefined
  mode: SiteMode | undefined
} {
  return { theme: useSitePreset(), mode: useSiteMode() }
}
