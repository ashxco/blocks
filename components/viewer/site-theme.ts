"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { useThemePreset } from "@/components/theme-provider"
import { themeScopeProps, type ThemeId, type ThemeMode } from "@/lib/themes"

/**
 * Light or dark: the site's mode ("Appearance" in the UI). The name predates
 * theme presets; SiteMode is the same type.
 */
export type SiteTheme = ThemeMode
export type SiteMode = ThemeMode

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
 * The site's mode as the visitor sees it: the forced mode when the page was
 * opened with &mode= (or ?theme=dark|light), otherwise the resolved one.
 * Undefined before hydration. Same as useSiteMode.
 */
export function useSiteTheme(): SiteMode | undefined {
  const { resolvedTheme, forcedTheme } = useTheme()
  const hydrated = useHydrated()
  if (!hydrated) return undefined
  return (forcedTheme ?? resolvedTheme) === "dark" ? "dark" : "light"
}

/** The site's mode (light or dark). Undefined before hydration. */
export const useSiteMode = useSiteTheme

/**
 * The site's theme preset (blocks, ocean, …) as the visitor sees it: the
 * forced one when the page was opened with ?theme=<id>, otherwise the saved
 * one. Undefined before hydration.
 */
export function useSitePreset(): ThemeId | undefined {
  return useThemePreset().theme
}

/** The site's theme and mode together. Both undefined before hydration. */
export function useSiteLook(): { theme: ThemeId | undefined; mode: SiteMode | undefined } {
  return { theme: useSitePreset(), mode: useSiteTheme() }
}

/** Class that scopes the tokens of a region to one mode. */
export function themeScope(mode: SiteMode | undefined) {
  if (mode === "dark") return "dark"
  if (mode === "light") return "light"
  return undefined
}

/**
 * Props that scope a region to a theme and/or a mode, e.g. a preview that
 * shows another theme than the site: `<div {...lookScope("mono", "dark")}>`.
 */
export function lookScope(theme: ThemeId | undefined, mode: SiteMode | undefined, className?: string) {
  return themeScopeProps(theme, themeScope(mode), className)
}
