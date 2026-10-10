"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { useThemePreset } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeScope } from "@/lib/theme-scope"
import { defaultThemeId, isThemeId, THEME_ATTRIBUTE, themes, type Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { ThemeSwatch, themeTagline, useChooseTheme } from "@/components/viewer/theme-picker"

/**
 * The overview's row of themes: the same small composition five times, each
 * scoped to one theme (and the page's mode), so the accent, neutrals, radii
 * and type are the only things that differ. Choosing a card saves and
 * applies that theme to the whole site. Below xl the row scrolls sideways,
 * edge to edge, so it stays one row on every screen.
 *
 * The cards share two grid rows (subgrid), so every card's band starts at the
 * same height even when one tagline wraps and another does not. The page's
 * theme is marked through CSS keyed on <html data-theme> (viewer-styles.ts),
 * so the right card is selected on first paint, before React hydrates.
 */
export function ThemeShowcase({ className }: { className?: string }) {
  const { theme: active } = useThemePreset()
  const choose = useChooseTheme()
  const listRef = React.useRef<HTMLUListElement>(null)

  // When the row scrolls (below xl), it opens on the page's theme, so a
  // phone shows which theme is on without a swipe. Only the row scrolls. The
  // theme is read from <html>, where the before-paint script put it.
  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list || list.scrollWidth <= list.clientWidth) return
    const page = document.documentElement.getAttribute(THEME_ATTRIBUTE)
    const id = isThemeId(page) ? page : defaultThemeId
    const item = list.querySelector<HTMLElement>(`[data-theme-card="${id}"]`)?.closest("li")
    if (!item) return
    const padding = parseFloat(getComputedStyle(list).scrollPaddingInlineStart) || 0
    list.scrollLeft = Math.max(0, item.offsetLeft - list.offsetLeft - padding)
    // Once, on mount: later choices are made in view.
  }, [])

  return (
    <ul
      ref={listRef}
      aria-label="Themes"
      className={cn(
        // Room above and below for a card's 4px focus ring: the scroller clips.
        "-mx-gutter grid snap-x snap-mandatory scroll-px-gutter auto-cols-max grid-flow-col grid-rows-[auto_auto] gap-x-4 gap-y-0 overflow-x-auto px-gutter pt-2 pb-3 [scrollbar-width:none]",
        "xl:mx-0 xl:grid-flow-row xl:grid-cols-5 xl:overflow-visible xl:px-0 xl:pt-0 xl:pb-0",
        className
      )}
    >
      {themes.map((theme) => (
        <li key={theme.id} className="row-span-2 grid w-64 snap-start grid-rows-subgrid xl:w-auto">
          <ThemeCard theme={theme} active={active === theme.id} onChoose={() => choose(theme.id)} />
        </li>
      ))}
    </ul>
  )
}

function ThemeCard({ theme, active, onChoose }: { theme: Theme; active: boolean; onChoose: () => void }) {
  const descriptionId = React.useId()
  return (
    <ThemeScope
      theme={theme.id}
      data-theme-card={theme.id}
      className={cn(
        "group/theme relative row-span-2 grid grid-rows-subgrid overflow-hidden rounded-(--card-radius) border bg-background text-copy",
        "transition-colors duration-(--duration-base) ease-standard hover:border-foreground",
        // The ring sits on the card: the button's own box is clipped by overflow-hidden.
        "has-[button:focus-visible]:focus-ring"
      )}
    >
      {/* A picture of the theme, not a control. */}
      <div inert aria-hidden="true" className="grid content-start gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-heading text-6xl leading-none font-extrabold text-foreground">Aa</span>
          <ThemeSwatch className="mt-1" />
        </div>
        <p className="text-h4 text-foreground">
          Ship it <span className="text-brand">together</span>.
        </p>
        <Input readOnly tabIndex={-1} defaultValue="maya@acme.com" aria-label="Email" className="h-(--control-height-sm)" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" tabIndex={-1}>
            Publish
          </Button>
          <Button size="sm" variant="outline" tabIndex={-1}>
            Preview
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 border-t bg-subtle px-5 py-4">
        <div className="grid min-w-0 gap-0.5">
          <h3 className="text-title text-foreground">
            <button
              type="button"
              aria-pressed={active}
              aria-describedby={descriptionId}
              onClick={onChoose}
              className="outline-none after:absolute after:inset-0 after:rounded-(--card-radius)"
            >
              {theme.name}
            </button>
          </h3>
          <p id={descriptionId} className="line-clamp-2 text-caption text-muted-foreground">
            {themeTagline(theme)}
          </p>
        </div>
        <span
          aria-hidden="true"
          data-theme-check=""
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full border border-border-strong text-transparent",
            "transition-colors duration-(--duration-base) ease-standard group-hover/theme:border-foreground"
          )}
        >
          <CheckIcon className="size-3.5" strokeWidth={2.75} />
        </span>
      </div>
    </ThemeScope>
  )
}
