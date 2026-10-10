/**
 * Theme presets: ids, URL parameters, persistence and scoping. Framework-free,
 * so server components, client components and the before-paint script share
 * one definition. The React side (useThemePreset, ThemeProvider) lives in
 * components/theme-provider.tsx; ThemeScope in lib/theme-scope.tsx.
 *
 * Vocabulary: the theme is the preset (blocks, ocean, …: accent, neutrals,
 * radii, fonts). The mode is light or dark ("Appearance" in the UI). They are
 * independent: every theme works in both modes.
 *
 * - data-theme="<id>" on any element scopes a theme to its subtree; no
 *   attribute means the default theme. .dark / .light scope the mode.
 * - ?theme=<id> forces a theme for the page and &mode=dark|light forces the
 *   mode, without saving either. ?theme=dark|light still forces the mode.
 * - The visitor's chosen theme is saved in localStorage under
 *   THEME_STORAGE_KEY and applied before first paint (themeScript).
 */
import {
  defaultThemeId,
  themeIds,
  themes,
  type Theme,
  type ThemeId,
  type ThemeMode,
} from "@/design-system/generated/tokens"

export { defaultThemeId, themeIds, themes }
export type { Theme, ThemeId, ThemeMode }

/** localStorage key of the visitor's chosen theme. The mode stays in next-themes' own key. */
export const THEME_STORAGE_KEY = "blocks-theme"

/** The attribute that scopes a theme. */
export const THEME_ATTRIBUTE = "data-theme"

/** URL parameters: ?theme=<id> forces a theme, &mode=dark|light forces the mode. */
export const THEME_PARAM = "theme"
export const MODE_PARAM = "mode"

export const themeModes: readonly ThemeMode[] = ["light", "dark"]

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (themeIds as readonly string[]).includes(value)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark"
}

export function getTheme(id: ThemeId): Theme {
  return themes.find((t) => t.id === id) ?? themes.find((t) => t.id === defaultThemeId) ?? themes[0]
}

/** The theme and mode a URL forces. Unknown values are ignored. */
export function readLookQuery(search: string | URLSearchParams): { theme?: ThemeId; mode?: ThemeMode } {
  const params = typeof search === "string" ? new URLSearchParams(search) : search
  const theme = params.get(THEME_PARAM)
  const mode = params.get(MODE_PARAM)
  return {
    theme: isThemeId(theme) ? theme : undefined,
    // ?theme=dark|light predates themes and keeps meaning the mode.
    mode: isThemeMode(mode) ? mode : isThemeMode(theme) ? theme : undefined,
  }
}

/**
 * A URL with ?theme= and &mode= set, keeping its other parameters and hash:
 * for preview frames, shared links and screenshots. Pass `null` to remove one.
 * Works with absolute and relative URLs.
 */
export function withLook(href: string, look: { theme?: ThemeId | null; mode?: ThemeMode | null }): string {
  const base = "http://blocks.invalid"
  const url = new URL(href, base)
  if (look.theme === null) url.searchParams.delete(THEME_PARAM)
  else if (look.theme) url.searchParams.set(THEME_PARAM, look.theme)
  if (look.mode === null) url.searchParams.delete(MODE_PARAM)
  else if (look.mode) {
    url.searchParams.set(MODE_PARAM, look.mode)
    // A legacy ?theme=dark|light would contradict the mode.
    if (isThemeMode(url.searchParams.get(THEME_PARAM))) url.searchParams.delete(THEME_PARAM)
  }
  const out = url.toString()
  return /^[a-z][a-z\d+.-]*:/i.test(href) ? out : out.slice(base.length)
}

/**
 * Props that scope a subtree to a theme and/or a mode. Spread them onto any
 * element: `<section {...themeScopeProps("ocean", "dark")}>`. A theme of
 * "blocks" is written out, so it resets the default inside another theme.
 * Undefined leaves that part inherited.
 */
export function themeScopeProps(
  theme?: ThemeId,
  mode?: ThemeMode,
  className?: string
): { "data-theme"?: ThemeId; className?: string } {
  const classes = [mode, className].filter(Boolean).join(" ")
  return {
    ...(theme ? { [THEME_ATTRIBUTE]: theme } : {}),
    ...(classes ? { className: classes } : {}),
  }
}

/**
 * Before-paint script, run right after next-themes' own: applies &mode= (or
 * the old ?theme=dark|light) to <html>, then the theme: ?theme=<id> if the URL
 * forces one, else the saved one. The default theme leaves <html> without a
 * data-theme attribute.
 */
export const themeScript = `(function(){try{var ids=${JSON.stringify(themeIds)},d=document.documentElement,q=new URLSearchParams(location.search),t=q.get(${JSON.stringify(THEME_PARAM)}),m=q.get(${JSON.stringify(MODE_PARAM)});if(m!=="dark"&&m!=="light")m=t==="dark"||t==="light"?t:null;if(m){d.classList.remove("light","dark");d.classList.add(m);d.style.colorScheme=m}var s=null;try{s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var a=ids.indexOf(t)>=0?t:ids.indexOf(s)>=0?s:null;if(a&&a!==${JSON.stringify(defaultThemeId)})d.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},a);else d.removeAttribute(${JSON.stringify(THEME_ATTRIBUTE)})}catch(e){}})()`
