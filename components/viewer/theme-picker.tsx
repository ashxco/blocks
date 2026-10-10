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
import { getTheme, isThemeId, THEME_ATTRIBUTE, themeIds, themes, type Theme, type ThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { loadThemeFonts, warmThemeFonts } from "@/components/viewer/theme-fonts"

/*
 * The theme picker: a compact trigger showing the active theme, and a menu
 * of every preset, each row drawn in its own theme (data-theme on the row):
 * its font in "Aa" on a tile with its input radius, and its accent and
 * neutral as two dots in a chip shaped like its buttons. Choosing a row saves
 * and applies the theme (useThemePreset), after its fonts have loaded. The
 * theme is the preset; light or dark is the separate Appearance toggle.
 */

/** One line per theme for the picker. A theme without one falls back to the start of its description. */
const taglines: Partial<Record<ThemeId, string>> = {
  blocks: "Violet on ink. The default.",
  ocean: "Confident blue on cool slate.",
  forest: "Deep emerald on soft sage.",
  ember: "Warm orange on stone.",
  mono: "Ink and grey. No hue at all.",
}

/** A short, one-line description of a theme. */
export function themeTagline(theme: Theme): string {
  return taglines[theme.id] ?? theme.description.split(/[,.:]/)[0]
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

function scope(theme: ThemeId | undefined) {
  return theme ? { [THEME_ATTRIBUTE]: theme } : {}
}

/**
 * A theme's accent and neutral as two dots in a small outline shaped like
 * the theme's buttons: its --button-radius scaled from a full-size button to
 * the chip, so a pill stays a pill and an 8px button reads as a rounded
 * square. Without `theme` it shows whatever theme it sits in.
 */
export function ThemeSwatch({ theme, className }: { theme?: ThemeId; className?: string }) {
  return (
    <span
      aria-hidden="true"
      {...scope(theme)}
      className={cn(
        "flex h-5 shrink-0 items-center gap-1 border border-border-strong px-1.5",
        "rounded-[calc(min(var(--button-radius),var(--button-height-md)/2)*0.5)]",
        className
      )}
    >
      <span className="size-2.5 rounded-full bg-brand" />
      <span className="size-2.5 rounded-full bg-muted-foreground" />
    </span>
  )
}

/** The accent of the theme it sits in (or of `theme`), as one dot: for triggers. */
function AccentDot({ theme, className }: { theme?: ThemeId; className?: string }) {
  return <span aria-hidden="true" {...scope(theme)} className={cn("size-3 shrink-0 rounded-full bg-brand", className)} />
}

/**
 * A theme's name, as wide as the widest name so a trigger never changes
 * width when the theme does. With `theme` it shows that theme. Without it,
 * it shows the page's theme (the data-theme on <html>) through CSS
 * (viewer-styles.ts), so the right name is there on first paint, before
 * React hydrates. Use that form only outside any other theme scope.
 */
export function ThemeName({ theme, className }: { theme?: ThemeId; className?: string }) {
  return (
    <span className={cn("inline-grid text-left", className)}>
      {themes.map((t) =>
        theme ? (
          <span key={t.id} className={cn("[grid-area:1/1]", t.id !== theme && "invisible")}>
            {t.name}
          </span>
        ) : (
          <span key={t.id} data-theme-text={t.id} data-stable="" className="[grid-area:1/1]">
            {t.name}
          </span>
        )
      )}
    </span>
  )
}

/**
 * A fact about the page's theme (the data-theme on <html>): its name or a
 * font name. Shown through CSS like ThemeName, so it is right on first paint;
 * it takes the width of the current text. Use it only outside any other
 * theme scope.
 */
export function PageThemeText({ field }: { field: "name" | "sans" | "mono" }) {
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

export interface ThemePickerProps {
  /**
   * The theme shown as chosen. Pass it with onValueChange to pick a theme for
   * something other than the site, such as a preview; the choice is not saved.
   * Omit both to show, save and apply the site theme.
   */
  value?: ThemeId
  onValueChange?: (theme: ThemeId) => void
  /**
   * - header: a ghost button, the accent dot alone below xl, plus the name and a chevron from xl (below
   *   that the header has no room for them next to the search field and the section links)
   * - toolbar: a hairline track like the viewer's segmented switches: the dot and a chevron, plus the name from md
   */
  variant?: "header" | "toolbar"
  /** Classes for the visible name, e.g. "inline-grid" to show it at every width. */
  nameClassName?: string
  /** Heading of the menu and start of the trigger's accessible name. */
  label?: string
  align?: "start" | "center" | "end"
  className?: string
}

export function ThemePicker({
  value,
  onValueChange,
  variant = "header",
  nameClassName,
  label = "Theme",
  align = "end",
  className,
}: ThemePickerProps) {
  const site = useThemePreset()
  const choose = useChooseTheme()
  const controlled = onValueChange !== undefined
  const current = controlled ? value : site.theme
  const currentName = current ? getTheme(current).name : undefined
  const warm = React.useCallback(() => warmThemeFonts(themeIds), [])
  // Keeps the open menu 16px clear of the window's sides, like the page gutter
  // on phones (the positioner adds its own 5px on top of this inset). Below sm
  // the menu is as wide as the space between the gutters.
  const [boundary, setBoundary] = React.useState<{ x: number; y: number; width: number; height: number }>()
  const onOpenChange = (open: boolean) => {
    if (!open) return
    warm()
    setBoundary({ x: 11, y: 0, width: window.innerWidth - 22, height: window.innerHeight })
  }

  const select = (next: string) => {
    if (!isThemeId(next)) return
    if (controlled) onValueChange(next)
    else choose(next)
  }

  // A controlled picker shows its own value; the site picker reads <html> through CSS.
  const shown = controlled ? current : undefined

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label={currentName ? `${label}: ${currentName}` : label}
        title={label}
        onPointerEnter={warm}
        onFocus={warm}
        render={
          variant === "header" ? (
            <Button
              variant="ghost"
              size="sm"
              className={cn("w-(--button-height-sm) gap-2 px-0 xl:w-auto xl:px-3", className)}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 border-border bg-muted px-3 hover:border-border-strong hover:bg-muted aria-expanded:border-border-strong aria-expanded:bg-muted",
                className
              )}
            />
          )
        }
      >
        <AccentDot theme={shown} />
        <ThemeName
          theme={shown}
          className={cn(nameClassName ?? (variant === "header" ? "hidden xl:inline-grid" : "hidden md:inline-grid"))}
        />
        <ChevronDownIcon
          aria-hidden="true"
          className={cn("size-3.5! text-muted-foreground", !nameClassName && variant === "header" && "hidden xl:block")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        collisionBoundary={boundary}
        className="w-[calc(100vw-2rem)] sm:w-88"
      >
        <DropdownMenuRadioGroup value={current ?? null} onValueChange={select}>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {themes.map((theme) => (
            <ThemeOption key={theme.id} theme={theme} />
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * One preset in the menu, drawn in that theme (and the menu's mode): the row
 * takes the theme's font, colours and radii, so it previews the theme. The
 * chosen row inks its "Aa" tile and shows a check at the end, in place of the
 * menu's own radio dot, which would read as a third swatch dot.
 */
function ThemeOption({ theme }: { theme: Theme }) {
  return (
    <DropdownMenuRadioItem
      value={theme.id}
      closeOnClick
      label={theme.name}
      {...scope(theme.id)}
      className="group/theme-option gap-3 py-2 pr-2.5 pl-2 [&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
    >
      {/* The theme's font, on a tile the size and radius of its inputs. */}
      <span
        aria-hidden="true"
        className={cn(
          "grid size-(--control-height-md) shrink-0 place-items-center rounded-(--control-radius) border bg-background",
          "font-heading text-lg font-extrabold text-foreground group-data-checked/theme-option:border-foreground"
        )}
      >
        Aa
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-label font-bold text-foreground">{theme.name}</span>
        <span className="truncate text-caption font-normal text-muted-foreground">{themeTagline(theme)}</span>
      </span>
      <ThemeSwatch />
      <CheckIcon
        aria-hidden="true"
        strokeWidth={2.5}
        className="size-4 shrink-0 text-foreground opacity-0 group-data-checked/theme-option:opacity-100"
      />
    </DropdownMenuRadioItem>
  )
}
