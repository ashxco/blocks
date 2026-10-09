/**
 * Global CSS the viewer needs that Tailwind utilities cannot express. Every
 * value is read from the generated token list or from token variables, so
 * nothing here is hand-picked.
 *
 * - `--viewer-bar`: height of the viewer's top bar, from the header token.
 * - `.bk-viewport`: a virtual viewport for device previews. Every fluid token
 *   (type roles, gutter, section rhythm, panel padding) is defined with `vw`,
 *   which would follow the real browser window. Inside `.bk-viewport` the same
 *   formulas are recomputed against `--bk-vw` (1% of the previewed device
 *   width), so a 390px preview gets the type and spacing of a real phone.
 * - View transition timing for page changes, from the motion tokens: the old
 *   page fades out fast, the new one fades in with a 4px rise just after it,
 *   about 300ms in all. The header stays put. Reduced motion turns the
 *   transition off entirely.
 */
import { tokens } from "@/design-system/generated/tokens"

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
  .filter((t): t is { cssVar: string; value: string } => Boolean(t.value?.includes("vw")))
  .map((t) => `${t.cssVar}:${t.value.replace(/(\d*\.?\d+)vw/g, "calc($1 * var(--bk-vw))")};`)
  .join("")

export const viewerCss = [
  `:root{--viewer-bar:var(--header-height-sm);}`,
  // 1vw until a preview measures its width and sets --bk-vw inline.
  `.bk-viewport{--bk-vw:1vw;${fluidTokens}}`,
  `::view-transition{pointer-events:none;}`,
  `::view-transition-group(viewer-content){animation-duration:var(--duration-base);animation-timing-function:var(--ease-out);}`,
  `::view-transition-old(viewer-content){animation:var(--duration-fast) var(--ease-in) both bk-page-out;}`,
  `::view-transition-new(viewer-content){animation:var(--duration-base) var(--ease-out) var(--duration-instant) both bk-page-in;}`,
  `::view-transition-old(root),::view-transition-new(root){animation-duration:var(--duration-base);animation-timing-function:var(--ease-standard);}`,
  `::view-transition-group(viewer-header),::view-transition-new(viewer-header){animation:none;}`,
  `::view-transition-old(viewer-header){display:none;}`,
  `@keyframes bk-page-out{to{opacity:0;}}`,
  `@keyframes bk-page-in{from{opacity:0;translate:0 4px;}}`,
  `@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none !important;}}`,
].join("\n")
