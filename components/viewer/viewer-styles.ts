/**
 * Global CSS the viewer needs that Tailwind utilities cannot express. Every
 * value is read from the generated token list or from token variables, so
 * nothing here is hand-picked.
 *
 * - `.bk-viewport`: a virtual viewport for device previews. Every fluid token
 *   (type roles, gutter, section rhythm, panel padding) is defined with `vw`,
 *   which would follow the real browser window. Inside `.bk-viewport` the same
 *   formulas are recomputed against `--bk-vw` (1% of the previewed device
 *   width), so a 390px preview gets the type and spacing of a real phone.
 * - View transition timing for page changes, from the motion tokens: the old
 *   page fades out fast, the new one fades in with a 4px rise just after it,
 *   about 300ms in all. The sidebar stays put. Reduced motion turns the
 *   transition off entirely.
 * - `[data-theme-text="<id>"]`: text that belongs to one theme (ThemeName in
 *   theme-picker.tsx). Only the page theme's text shows, the theme on <html>,
 *   so a trigger names the right theme on first paint, before React hydrates.
 *   With `data-stable` the others stay in the layout, invisible, so the text
 *   is as wide as the widest one.
 * - `[data-theme-card="<id>"]`: a card that stands for one theme (ThemeShowcase).
 *   The page theme's card gets an ink border and a filled check
 *   (`[data-theme-check]`), keyed on <html> like the text above, so the
 *   selection is right on first paint. Colours come from the card's own scope.
 */
import {
  defaultThemeId,
  themeIds,
  tokens,
} from "@/design-system/generated/tokens"
import { toVirtualVw } from "@/components/viewer/devices"

/** The CSS value of a token: its own value, or its font size for type roles. */
function cssValue(value: unknown): string | undefined {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "fontSize" in value) {
    const size = (value as { fontSize?: unknown }).fontSize
    return typeof size === "string" ? size : undefined
  }
  return undefined
}

const fluidTokens = tokens
  .map((t) => ({ cssVar: t.cssVar, value: cssValue(t.value) }))
  .filter((t): t is { cssVar: string; value: string } =>
    Boolean(t.value?.includes("vw"))
  )
  .map((t) => `${t.cssVar}:${toVirtualVw(t.value)};`)
  .join("")

/** The selector for the page's own theme: <html data-theme="<id>">, or no attribute for the default. */
const pageTheme = (id: string) =>
  id === defaultThemeId
    ? `:root:not([data-theme]),:root[data-theme="${id}"]`
    : `:root[data-theme="${id}"]`

/** Each page-theme root paired with that theme's element: `:root[data-theme="ocean"] [data-theme-card="ocean"]`. */
const onPageTheme = (attribute: string, suffix = "") =>
  themeIds
    .flatMap((id) =>
      pageTheme(id)
        .split(",")
        .map((root) => `${root} [${attribute}="${id}"]${suffix}`)
    )
    .join(",")

const themeTextCss = [
  `[data-theme-text]{display:none;}`,
  `[data-theme-text][data-stable]{display:inline;visibility:hidden;}`,
  `${onPageTheme("data-theme-text")}{display:inline;visibility:visible;}`,
].join("\n")

const themeCardCss = [
  `${onPageTheme("data-theme-card")}{border-color:var(--foreground);}`,
  `${onPageTheme("data-theme-card", " [data-theme-check]")}{border-color:var(--foreground);background-color:var(--foreground);color:var(--background);}`,
].join("\n")

export const viewerCss = [
  // 1vw until a preview measures its width and sets --bk-vw inline.
  `.bk-viewport{--bk-vw:1vw;${fluidTokens}}`,
  `::view-transition{pointer-events:none;}`,
  `::view-transition-group(viewer-content){animation-duration:var(--duration-base);animation-timing-function:var(--ease-out);}`,
  `::view-transition-old(viewer-content){animation:var(--duration-fast) var(--ease-in) both bk-page-out;}`,
  `::view-transition-new(viewer-content){animation:var(--duration-base) var(--ease-out) var(--duration-instant) both bk-page-in;}`,
  `::view-transition-old(root),::view-transition-new(root){animation-duration:var(--duration-base);animation-timing-function:var(--ease-standard);}`,
  `::view-transition-group(viewer-sidebar),::view-transition-new(viewer-sidebar){animation:none;}`,
  `::view-transition-old(viewer-sidebar){display:none;}`,
  `@keyframes bk-page-out{to{opacity:0;}}`,
  `@keyframes bk-page-in{from{opacity:0;translate:0 4px;}}`,
  `@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none !important;}}`,
  themeTextCss,
  themeCardCss,
].join("\n")
