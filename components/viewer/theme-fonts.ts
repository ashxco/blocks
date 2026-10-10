/**
 * Loads a theme's fonts before the theme is applied, so switching to it
 * never paints a frame in the fallback font and then swaps (a flash plus a
 * layout shift). Every theme font except the default one is declared with
 * preload: false (app/layout.tsx), so the first switch to a theme would
 * otherwise fetch its font only once text starts using it.
 *
 * The family names are read from the page's own CSS: a hidden probe scoped
 * with data-theme reports the theme's body, heading and mono fonts as
 * computed font-family lists, whatever names next/font generated. So a theme
 * whose headings have a face of their own (Forest's Bricolage Grotesque,
 * Ember's Fraunces, Mono's Geist Mono at 800) gets that face loaded too, at
 * every weight the system uses, and a new theme font needs no change here.
 */
import { THEME_ATTRIBUTE, type ThemeId } from "@/lib/themes"

/** The weights the system uses: body, label, title and heading. */
const WEIGHTS = [400, 500, 600, 700, 800]

/** Longest a switch waits for fonts; after that it applies anyway and the font swaps in. */
const MAX_WAIT = 600

const families = new Map<ThemeId, string[]>()
const loaded = new Map<ThemeId, Promise<void>>()

/** The computed font-family lists of a theme's sans, heading and mono fonts. */
function themeFamilies(theme: ThemeId): string[] {
  const cached = families.get(theme)
  if (cached) return cached
  if (!document.body) return []
  const probe = document.createElement("div")
  probe.setAttribute(THEME_ATTRIBUTE, theme)
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inset:0 auto auto 0;"
  const heading = document.createElement("span")
  heading.className = "font-heading"
  const mono = document.createElement("span")
  mono.className = "font-mono"
  probe.append(heading, mono)
  document.body.appendChild(probe)
  const lists = [probe, heading, mono].map((el) => getComputedStyle(el).fontFamily)
  probe.remove()
  const result = [...new Set(lists.filter(Boolean))]
  families.set(theme, result)
  return result
}

/**
 * Starts loading a theme's fonts and resolves once they are ready, or after
 * MAX_WAIT at the latest. Never rejects. Repeated calls share one load.
 */
export function loadThemeFonts(theme: ThemeId): Promise<void> {
  const pending = loaded.get(theme)
  if (pending) return withTimeout(pending)
  let load: Promise<void>
  try {
    const fonts = document.fonts
    const lists = themeFamilies(theme)
    load = fonts
      ? Promise.all(lists.flatMap((list) => WEIGHTS.map((weight) => fonts.load(`${weight} 1em ${list}`)))).then(
          () => undefined,
          () => undefined
        )
      : Promise.resolve()
  } catch {
    load = Promise.resolve()
  }
  loaded.set(theme, load)
  return withTimeout(load)
}

function withTimeout(load: Promise<void>) {
  return Promise.race([load, new Promise<void>((resolve) => window.setTimeout(resolve, MAX_WAIT))])
}

/** Starts loading every listed theme's fonts in the background, e.g. when a picker opens. */
export function warmThemeFonts(themes: readonly ThemeId[]) {
  for (const theme of themes) void loadThemeFonts(theme)
}
