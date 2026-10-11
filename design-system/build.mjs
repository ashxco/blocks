/**
 * Blocks design tokens build.
 *
 * Source of truth: design-system/tokens/*.tokens.json (W3C DTCG format) for
 * the default theme, and design-system/themes/<id>.tokens.json for the theme
 * presets. Style Dictionary parses the files and resolves references; this
 * script writes three outputs:
 *
 *   app/styles/tokens.css             Tailwind v4 @theme, :root, mode and theme scopes,
 *                                     and the fonts of the type roles
 *   design-system/generated/tokens.ts Typed token and theme list for the viewer
 *   design-system/generated/themes.json Every semantic colour resolved per theme
 *                                       and mode, for scripts/check-contrast.mjs,
 *                                       and each theme's identity (accent,
 *                                       neutral, shapes, fonts) for
 *                                       scripts/check-themes.mjs
 *
 * Run with `npm run tokens`. Never edit the generated files by hand.
 *
 * The steps live in design-system/build/, one module each:
 *
 *   load.mjs         the source files, Style Dictionary, merging and writing
 *   sources-hash.mjs the sources' fingerprint, shared with the checks (scripts/lib)
 *   naming.mjs       each token's CSS variable, tier, group and utility
 *   tokens.mjs       the default tokens in both modes, and CSS values (alpha)
 *   breakpoints.mjs  breakpoint values ($extensions.blocks.breakpoints)
 *   themes.mjs       theme files, validated and resolved per mode
 *   scopes.mjs       root declarations and the mode and theme scopes
 *   css.mjs          tokens.css, with the role fonts
 *   ts.mjs           tokens.ts
 *   themes-json.mjs  themes.json
 */
import { writeIfChanged } from "./build/load.mjs"
import { css } from "./build/css.mjs"
import { list, ts } from "./build/ts.mjs"
import { themesJson } from "./build/themes-json.mjs"
import { themes } from "./build/themes.mjs"

const outputs = {
  "app/styles/tokens.css": css,
  "design-system/generated/tokens.ts": ts,
  "design-system/generated/themes.json": themesJson,
}

let changed = false
for (const [file, content] of Object.entries(outputs))
  changed = (await writeIfChanged(file, content)) || changed

console.log(
  `Blocks tokens: ${list.length} tokens, ${themes.length} themes (${themes.map((t) => t.id).join(", ")}) → ${Object.keys(outputs).join(", ")}${changed ? "" : " (unchanged)"}`
)
