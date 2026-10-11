/**
 * Printed values that differ by theme (OKLCH numbers, px, font names), shown
 * for the theme the page is on without a flash.
 *
 * The theme is only known in the browser (saved in localStorage, or forced
 * with ?theme=), and the before-paint script puts it on <html data-theme>.
 * So every theme's version goes into the HTML, grouped where themes agree,
 * and a small stylesheet keyed on that attribute shows the active one. It is
 * right on the first frame, before hydration and without JavaScript, and it
 * follows a theme change at once. Hidden versions are display: none, so
 * screen readers and find-in-page only meet the visible one.
 *
 * Server-safe: no hooks, usable from server and client components alike.
 * Render <ByThemeStyles /> once on the page (FoundationPage does).
 */
import * as React from "react"

import {
  defaultThemeId,
  THEME_ATTRIBUTE,
  themeIds,
  type ThemeId,
} from "@/lib/themes"

const ATTR = "data-theme-only"

const sel = (id: ThemeId) => `[${ATTR}~="${id}"]`

/*
 * The active theme is the one on <html>; no attribute (or an id the build
 * does not know) is the default theme.
 */
const css = [
  `[${ATTR}]{display:none}`,
  ...themeIds.map((id) => {
    const roots =
      id === defaultThemeId
        ? [
            `:root:not([${THEME_ATTRIBUTE}])`,
            `:root[${THEME_ATTRIBUTE}="${id}"]`,
            `:root[${THEME_ATTRIBUTE}]${themeIds.map((t) => `:not([${THEME_ATTRIBUTE}="${t}"])`).join("")}`,
          ]
        : [`:root[${THEME_ATTRIBUTE}="${id}"]`]
    return `${roots.map((r) => `${r} ${sel(id)}`).join(",")}{display:contents}`
  }),
].join("\n")

/** The stylesheet that shows the active theme's version. React hoists it into <head> once. */
export function ByThemeStyles() {
  return (
    <style href="blocks-by-theme" precedence="default">
      {css}
    </style>
  )
}

/** Themes grouped by the key `by` gives them, in picker order. */
function groupThemes(by: (theme: ThemeId) => string): ThemeId[][] {
  const groups = new Map<string, ThemeId[]>()
  for (const id of themeIds) {
    const key = by(id)
    groups.set(key, [...(groups.get(key) ?? []), id])
  }
  return [...groups.values()]
}

/**
 * Renders `children(theme)` for the active theme. Themes that give the same
 * `by` key share one copy; when every theme agrees there is no wrapper at
 * all. The wrapper is display: contents, so layout is as if it were not
 * there; use `as="div"` where a span may not hold the content.
 */
export function ByTheme({
  children,
  by,
  as: Tag = "span",
}: {
  children: (theme: ThemeId) => React.ReactNode
  /** Grouping key. Default: one copy per theme. */
  by?: (theme: ThemeId) => string
  as?: "span" | "div"
}) {
  const groups = groupThemes(by ?? ((id) => id))
  if (groups.length === 1) return <>{children(groups[0][0])}</>
  return (
    <>
      {groups.map((ids) => (
        <Tag key={ids.join(" ")} {...{ [ATTR]: ids.join(" ") }}>
          {children(ids[0])}
        </Tag>
      ))}
    </>
  )
}

/** A value per theme. Build one with perTheme() from ./data. */
export type PerTheme<T = string> = Record<ThemeId, T>

/** Text that differs by theme: the active theme's string. Serialisable, so client components take it as a prop. */
export function ThemeText({ value }: { value: PerTheme }) {
  return <ByTheme by={(id) => value[id]}>{(id) => value[id]}</ByTheme>
}

/** Shows its children only while the page is on `theme`, such as a "Current" mark beside that theme. */
export function OnlyInTheme({
  theme,
  children,
}: {
  theme: ThemeId
  children: React.ReactNode
}) {
  return (
    <ByTheme by={(active) => (active === theme ? "on" : "off")}>
      {(active) => (active === theme ? children : null)}
    </ByTheme>
  )
}
