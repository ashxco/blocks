/**
 * Names for a theme's alias scales: "violet" or "grey" when the theme points
 * the scale at a fixed one, otherwise the name its author gave it, the lead
 * phrase of the scale's $description in the theme file ("Cobalt blue. The
 * hue drifts …" reads "cobalt blue").
 *
 * The theme files are read here rather than in ./data, so only the server
 * components that print these names load them, not the client token explorer.
 */
import blocks from "@/design-system/themes/blocks.tokens.json"
import ember from "@/design-system/themes/ember.tokens.json"
import forest from "@/design-system/themes/forest.tokens.json"
import mono from "@/design-system/themes/mono.tokens.json"
import ocean from "@/design-system/themes/ocean.tokens.json"

import { aliasHue, aliasScaleIn, type ScaleRole, type ThemeId } from "./data"

/* A theme added later without an entry here falls back to "own OKLCH values". */
const sources: Partial<Record<ThemeId, unknown>> = { blocks, ocean, forest, ember, mono }

function scaleDescription(theme: ThemeId, role: ScaleRole): unknown {
  const source = sources[theme] as { theme?: Partial<Record<ScaleRole, { $description?: unknown }>> } | undefined
  return source?.theme?.[role]?.$description
}

/**
 * "Deep emerald at hue 165. Steps …" -> "deep emerald"; "Sage: the ink …" ->
 * "sage". Only a short name (three words at most) counts.
 */
function leadPhrase(description: unknown): string | undefined {
  if (typeof description !== "string") return undefined
  const phrase = /^(.+?)(?=\s+at hue\b|[.:;,(])/.exec(description.trim())?.[1].trim()
  if (!phrase || phrase.split(/\s+/).length > 3) return undefined
  return phrase.charAt(0).toLowerCase() + phrase.slice(1)
}

/** The name a theme gives a scale it writes itself, if it gives one. */
export function ownScaleName(theme: ThemeId, role: ScaleRole) {
  return leadPhrase(scaleDescription(theme, role))
}

/** "violet" (a fixed scale), "cobalt blue" (the theme's own, named), or "own OKLCH values". */
export function aliasScaleLabel(theme: ThemeId, role: ScaleRole) {
  return aliasScaleIn(theme, role) ?? ownScaleName(theme, role) ?? "own OKLCH values"
}

/** "violet · hue 283", "cobalt blue · hue 263", "grey · no hue". */
export function aliasSummary(theme: ThemeId, role: ScaleRole) {
  const hue = aliasHue(theme, role)
  return `${aliasScaleLabel(theme, role)} · ${hue === null ? "no hue" : `hue ${hue}`}`
}

/** "Blocks points it at violet", "Ocean uses its own cobalt blue scale". */
export function aliasSource(theme: ThemeId, themeName: string, role: ScaleRole) {
  const fixed = aliasScaleIn(theme, role)
  if (fixed) return `${themeName} points it at ${fixed}`
  const own = ownScaleName(theme, role)
  return own ? `${themeName} uses its own ${own} scale` : `${themeName} sets its own OKLCH values`
}
