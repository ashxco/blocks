/**
 * Loads a theme's fonts before the theme is applied, so switching to it
 * never paints a frame in the fallback font and then swaps (a flash plus a
 * layout shift). Every theme font except the default one is declared with
 * preload: false (app/layout.tsx), so the first switch to a theme would
 * otherwise fetch its font only once text starts using it.
 *
 * The family names are read from the page's own CSS: a hidden probe scoped
 * with data-theme reports the theme's --font-sans and --font-mono as
 * computed font-family lists, whatever names next/font generated.
 */
import { THEME_ATTRIBUTE, type ThemeId } from "@/lib/themes"

/** The weights the system uses: body, label, title and heading. */
const WEIGHTS = [400, 500, 600, 700, 800]

/** Longest a switch waits for fonts; after that it applies anyway and the font swaps in. */
const MAX_WAIT = 600

const families = new WeakMap<Document, Map<ThemeId, string[]>>()
const loaded = new WeakMap<Document, Map<ThemeId, Promise<void>>>()

/** The computed font-family lists of a theme's sans and mono fonts in `doc`. */
function themeFamilies(doc: Document, theme: ThemeId): string[] {
  let byTheme = families.get(doc)
  if (!byTheme) {
    byTheme = new Map()
    families.set(doc, byTheme)
  }
  const cached = byTheme.get(theme)
  if (cached) return cached
  const view = doc.defaultView
  if (!view || !doc.body) return []
  const probe = doc.createElement("div")
  probe.setAttribute(THEME_ATTRIBUTE, theme)
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inset:0 auto auto 0;"
  const mono = doc.createElement("span")
  mono.className = "font-mono"
  probe.appendChild(mono)
  doc.body.appendChild(probe)
  const sans = view.getComputedStyle(probe).fontFamily
  const code = view.getComputedStyle(mono).fontFamily
  probe.remove()
  const result = [...new Set([sans, code].filter(Boolean))]
  byTheme.set(theme, result)
  return result
}

/**
 * Starts loading a theme's fonts in `doc` (the page, or a same-origin preview
 * frame) and resolves once they are ready, or after MAX_WAIT at the latest.
 * Never rejects. Repeated calls share one load.
 */
export function loadThemeFonts(theme: ThemeId, doc: Document = document): Promise<void> {
  let byTheme = loaded.get(doc)
  if (!byTheme) {
    byTheme = new Map()
    loaded.set(doc, byTheme)
  }
  const pending = byTheme.get(theme)
  if (pending) return withTimeout(pending)
  let load: Promise<void>
  try {
    const fonts = doc.fonts
    const lists = themeFamilies(doc, theme)
    load = fonts
      ? Promise.all(lists.flatMap((list) => WEIGHTS.map((weight) => fonts.load(`${weight} 1em ${list}`)))).then(
          () => undefined,
          () => undefined
        )
      : Promise.resolve()
  } catch {
    load = Promise.resolve()
  }
  byTheme.set(theme, load)
  return withTimeout(load)
}

function withTimeout(load: Promise<void>) {
  return Promise.race([load, new Promise<void>((resolve) => window.setTimeout(resolve, MAX_WAIT))])
}

/** Starts loading every listed theme's fonts in the background, e.g. when a picker opens. */
export function warmThemeFonts(themes: readonly ThemeId[], doc: Document = document) {
  for (const theme of themes) void loadThemeFonts(theme, doc)
}
