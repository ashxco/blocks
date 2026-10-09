/**
 * Global CSS the viewer needs that Tailwind utilities cannot express. Every
 * value is read from the generated token list or from token variables, so
 * nothing here is hand-picked.
 *
 * - `.bk-light` forces the light theme inside a region, even when the site is
 *   dark. It is generated from the semantic tokens' light references, the
 *   mirror image of the `.dark` class in app/styles/tokens.css.
 * - View transition timing for page changes, from the motion tokens.
 */
import { tokens } from "@/design-system/generated/tokens"

const varByName = new Map(tokens.map((t) => [t.name, t.cssVar]))

const lightScope = tokens
  .filter((t) => t.tier === "semantic")
  .map((t) => {
    const ref = t.ref ? varByName.get(t.ref) : undefined
    return `${t.cssVar}:${ref ? `var(${ref})` : String(t.value)};`
  })
  .join("")

export const viewerCss = [
  `:root{--viewer-bar:calc(var(--spacing) * 14);}`,
  `.bk-light{${lightScope}color-scheme:light;}`,
  `::view-transition{pointer-events:none;}`,
  `::view-transition-group(viewer-content){animation-duration:var(--duration-base);animation-timing-function:var(--ease-out);}`,
  `::view-transition-old(viewer-content){animation:var(--duration-fast) var(--ease-in) both bk-page-out;}`,
  `::view-transition-new(viewer-content){animation:var(--duration-slow) var(--ease-out) var(--duration-instant) both bk-page-in;}`,
  `::view-transition-group(viewer-header),::view-transition-new(viewer-header){animation:none;}`,
  `::view-transition-old(viewer-header){display:none;}`,
  `@keyframes bk-page-out{to{opacity:0;}}`,
  `@keyframes bk-page-in{from{opacity:0;translate:0 4px;}}`,
  `@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none !important;}}`,
].join("\n")
