"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { useThemePreset } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getTheme,
  isThemeId,
  themeIds,
  themes,
  themeScopeProps,
  type Theme,
  type ThemeId,
} from "@/lib/themes"
import { cn } from "@/lib/utils"
import { loadThemeFonts, warmThemeFonts } from "@/components/viewer/theme-fonts"

/*
 * The theme picker: a compact trigger showing the active theme, and a menu
 * of every preset, each row drawn in its own theme (data-theme on the row):
 * its name set in its heading font, a line on its look in its body font, and
 * a ThemeChip, its accent as a dot on its muted fill. Choosing a row saves and applies the theme
 * (useThemePreset), after its fonts have loaded. The theme is the preset;
 * light or dark is the separate Appearance toggle.
 */

/**
 * One line per theme on what makes it itself, for the picker, the command
 * palette and the overview. A theme without one falls back to the start of
 * its description.
 */
const taglines: Partial<Record<ThemeId, string>> = {
  blocks: "Violet on ink, pills. The default.",
  ocean: "Cobalt on slate, crisp corners.",
  forest: "Emerald on sage, soft squares.",
  ember: "Orange on stone, serif headings.",
  mono: "Ink on grey, sharp and mono.",
}

/** A short, one-line description of a theme. */
export function themeTagline(theme: Theme): string {
  return taglines[theme.id] ?? theme.description.split(/[,.:]/)[0]
}

/** "Fraunces and DM Sans" when headings have their own face, else the one family. */
export function themeFontsLabel(theme: Theme): string {
  const { heading, sans } = theme.fonts
  return heading === sans ? sans : `${heading} and ${sans}`
}

/* -------------------------------------------------------------------------- */
/* Choosing                                                                    */
/* -------------------------------------------------------------------------- */

/** Only the latest choice applies, even if an earlier one's fonts load later. */
let chooseRequest = 0

/**
 * Saves and applies a theme once its fonts are ready (at most a moment
 * later), so the page never paints a frame in a fallback font. Use it
 * wherever the viewer lets people choose a theme.
 */
export function useChooseTheme() {
  const { setTheme } = useThemePreset()
  return React.useCallback(
    (theme: ThemeId) => {
      const request = ++chooseRequest
      void loadThemeFonts(theme).then(() => {
        if (request === chooseRequest) setTheme(theme)
      })
    },
    [setTheme]
  )
}

/* -------------------------------------------------------------------------- */
/* Swatches and names                                                          */
/* -------------------------------------------------------------------------- */

/**
 * A theme's accent and neutral as two dots in a small outline shaped like
 * the theme's buttons: its --button-radius scaled from a full-size button to
 * the chip, so a pill stays a pill and an 8px button reads as a rounded
 * square.
 */
export function ThemeSwatch({ theme }: { theme: ThemeId }) {
  return (
    <span
      aria-hidden="true"
      {...themeScopeProps(
        theme,
        undefined,
        cn(
          "flex h-5 shrink-0 items-center gap-1 border border-border-strong px-1.5",
          "rounded-[calc(min(var(--button-radius),var(--button-height-md)/2)*0.5)]"
        )
      )}
    >
      <span className="size-2.5 rounded-full bg-brand" />
      <span className="size-2.5 rounded-full bg-muted-foreground" />
    </span>
  )
}

/**
 * A theme in one quiet mark: its accent as a dot on its own muted fill,
 * inside a hairline circle, so every row in the menu has the same shape and
 * only the colours change. It shows the theme it sits in.
 */
function ThemeChip() {
  return (
    <span
      aria-hidden="true"
      className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted"
    >
      <span className="size-3 rounded-full bg-brand" />
    </span>
  )
}

/** The accent of the theme it sits in, as one dot: for triggers. */
function AccentDot() {
  return (
    <span
      aria-hidden="true"
      className="size-3 shrink-0 rounded-full bg-brand"
    />
  )
}

/**
 * The page's theme name (the data-theme on <html>), shown through CSS
 * (viewer-styles.ts) so it is right on first paint, before React hydrates.
 * It is as wide as the widest name, so the trigger never changes width when
 * the theme does. Use it only outside any other theme scope.
 */
function ThemeName() {
  return (
    <span className="inline-grid text-left">
      {themes.map((t) => (
        <span
          key={t.id}
          data-theme-text={t.id}
          data-stable=""
          className="[grid-area:1/1]"
        >
          {t.name}
        </span>
      ))}
    </span>
  )
}

/**
 * A fact about the page's theme (the data-theme on <html>): its name or a
 * font name. Shown through CSS like ThemeName, so it is right on first paint;
 * it takes the width of the current text. Use it only outside any other
 * theme scope.
 */
export function PageThemeText({
  field,
}: {
  field: "name" | "heading" | "sans" | "mono"
}) {
  return (
    <>
      {themes.map((t) => (
        <span key={t.id} data-theme-text={t.id}>
          {field === "name" ? t.name : t.fonts[field]}
        </span>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Picker                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The site's theme picker, at the foot of the sidebar: the accent dot, the
 * theme's name and a chevron, opening a menu of every preset. Choosing one
 * saves and applies it.
 */
export function ThemePicker() {
  const site = useThemePreset()
  const choose = useChooseTheme()
  const currentName = site.theme ? getTheme(site.theme).name : undefined
  const warm = React.useCallback(() => warmThemeFonts(themeIds), [])
  // Keeps the open menu 16px clear of the window's sides, like the page gutter
  // on phones (the positioner adds its own 5px on top of this inset). Below sm
  // the menu is as wide as the space between the gutters.
  const [boundary, setBoundary] = React.useState<{
    x: number
    y: number
    width: number
    height: number
  }>()
  const onOpenChange = (open: boolean) => {
    if (!open) return
    warm()
    setBoundary({
      x: 11,
      y: 0,
      width: window.innerWidth - 22,
      height: window.innerHeight,
    })
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label={currentName ? `Theme: ${currentName}` : "Theme"}
        title="Theme"
        onPointerEnter={warm}
        onFocus={warm}
        render={<Button variant="ghost" size="sm" className="gap-2 px-3" />}
      >
        {/* The trigger shows the page's theme through CSS (<html data-theme>), right on first paint. */}
        <AccentDot />
        <ThemeName />
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5! text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        collisionBoundary={boundary}
        className="w-[calc(100vw-2rem)] sm:w-88"
      >
        <DropdownMenuRadioGroup
          value={site.theme ?? null}
          onValueChange={(next: string) => {
            if (isThemeId(next)) choose(next)
          }}
        >
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          {themes.map((theme) => (
            <ThemeOption key={theme.id} theme={theme} />
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * One preset in the menu, drawn in that theme (and the menu's mode): the
 * name is set in the theme's heading font, the line under it in its body
 * font, and the chip shows its accent on its muted fill. The chosen row shows a
 * check at the end, in place of the menu's own radio dot.
 */
function ThemeOption({ theme }: { theme: Theme }) {
  return (
    <DropdownMenuRadioItem
      value={theme.id}
      closeOnClick
      label={theme.name}
      {...themeScopeProps(theme.id)}
      className="group/theme-option gap-3 py-2 pr-2.5 pl-2 [&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
    >
      <ThemeChip />
      <span className="grid min-w-0 flex-1">
        <span className="truncate font-heading text-sm font-semibold text-foreground">
          {theme.name}
        </span>
        <span className="truncate text-caption font-normal text-muted-foreground">
          {themeTagline(theme)}
        </span>
      </span>
      <CheckIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-foreground opacity-0 group-data-checked/theme-option:opacity-100"
      />
    </DropdownMenuRadioItem>
  )
}
