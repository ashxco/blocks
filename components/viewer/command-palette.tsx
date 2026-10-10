"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { defaultFilter } from "cmdk"
import {
  AppWindowIcon,
  ArrowUpRightIcon,
  BoxIcon,
  ComponentIcon,
  LayersIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  type LucideIcon,
} from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useThemePreset } from "@/components/theme-provider"
import { navSections, type SectionId } from "@/components/viewer/nav"
import { ThemeSwatch, themeTagline, useChooseTheme } from "@/components/viewer/theme-picker"
import { useAppearance } from "@/components/viewer/theme-toggle"
import { themes } from "@/lib/themes"

const sectionIcon: Record<SectionId, LucideIcon> = {
  foundations: PaletteIcon,
  components: ComponentIcon,
  molecules: LayersIcon,
  templates: AppWindowIcon,
}

/** One row of the palette. */
interface Entry {
  /** cmdk's id for the row: unique across the palette. */
  value: string
  /** What the row says: the text a query is matched against first. */
  label: string
  /** Another name for the row, matched like the label: a page's slug ("colors" for Colour). */
  alias?: string
  /** More text a query may match: group, section, description. */
  keywords: string[]
  onSelect: () => void
  content: React.ReactNode
}

interface Section {
  id: string
  heading: string
  /** A hairline above the group (hidden while searching). */
  separated?: boolean
  entries: Entry[]
}

/**
 * How well a row matches: cmdk's own score, with the row's name ahead of its
 * keywords. cmdk scores a word anywhere in the text the same, so a query found
 * in a long description would tie with (or beat) one found in the name; here a
 * keyword-only match counts nine tenths, so "dark" finds the appearance action
 * before every page that mentions dark mode.
 */
function score(entry: Entry, search: string) {
  const name = Math.max(defaultFilter(entry.label, search), entry.alias ? defaultFilter(entry.alias, search) : 0)
  return Math.max(name, 0.9 * defaultFilter(entry.label, search, entry.keywords))
}

/**
 * The sections with only the rows that match `query`, best match first:
 * rows sorted by score inside each group, and groups by their best row.
 * Rendered in that order by React, not re-sorted by cmdk, so the first row
 * (the one Enter runs) is always the best match. An empty query keeps the
 * natural order.
 */
function rank(sections: Section[], query: string): Section[] {
  const search = query.trim()
  if (!search) return sections
  return sections
    .map((section) => {
      const scored = section.entries
        .map((entry) => ({ entry, score: score(entry, search) }))
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score)
      return { section: { ...section, entries: scored.map((row) => row.entry) }, best: scored[0]?.score ?? 0 }
    })
    .filter((group) => group.best > 0)
    .sort((a, b) => b.best - a.best)
    .map((group) => group.section)
}

/**
 * ⌘K / Ctrl+K palette over everything in the registry, the themes and a few
 * actions. The open state lives with the caller so a header button can open
 * it too.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { theme: activeTheme } = useThemePreset()
  const chooseTheme = useChooseTheme()
  const appearance = useAppearance()
  const [query, setQuery] = React.useState("")

  // Every opening starts from an empty search.
  const [wasOpen, setWasOpen] = React.useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setQuery("")
  }

  const run = React.useCallback(
    (action: () => void) => {
      onOpenChange(false)
      action()
    },
    [onOpenChange]
  )

  const pages = React.useMemo<Section[]>(
    () =>
      navSections.map((section) => {
        const Icon = sectionIcon[section.id]
        return {
          id: section.id,
          heading: section.title,
          entries: section.groups.flatMap((group) =>
            group.items.map((item) => {
              const label = item.href === section.href ? `${section.title} ${item.title.toLowerCase()}` : item.title
              return {
                value: item.href,
                label,
                alias: item.href.split("/").pop()?.replace(/-/g, " "),
                keywords: [group.title ?? "", section.title, item.description],
                onSelect: () => run(() => router.push(item.href)),
                content: (
                  <>
                    <Icon aria-hidden="true" className="text-muted-foreground" />
                    <span className="truncate text-foreground">{label}</span>
                    {group.title ? (
                      <span className="ml-auto hidden shrink-0 text-caption text-muted-foreground sm:inline">
                        {group.title}
                      </span>
                    ) : null}
                  </>
                ),
              }
            })
          ),
        }
      }),
    [router, run]
  )

  const themeSection: Section = {
    id: "theme",
    heading: "Theme",
    separated: true,
    entries: themes.map((theme) => ({
      // The name itself, so typing a theme's name is an exact match.
      value: theme.name,
      label: theme.name,
      keywords: ["theme", theme.fonts.sans, themeTagline(theme)],
      onSelect: () => run(() => chooseTheme(theme.id)),
      content: (
        <>
          <ThemeSwatch theme={theme.id} />
          <span className="text-foreground">{theme.name}</span>
          <span className="ml-auto hidden shrink-0 text-caption text-muted-foreground sm:inline">
            {theme.id === activeTheme ? "Current theme" : themeTagline(theme)}
          </span>
        </>
      ),
    })),
  }

  const appearanceLabel = `Switch to ${appearance.next} appearance`
  const actions: Section = {
    id: "actions",
    heading: "Actions",
    separated: true,
    entries: [
      {
        value: "action-appearance",
        label: appearanceLabel,
        keywords: ["appearance", "dark", "light", "mode"],
        onSelect: () => run(appearance.toggle),
        content: (
          <>
            {appearance.next === "light" ? (
              <SunIcon aria-hidden="true" className="text-muted-foreground" />
            ) : (
              <MoonIcon aria-hidden="true" className="text-muted-foreground" />
            )}
            <span className="text-foreground">{appearanceLabel}</span>
            <CommandShortcut className="hidden sm:not-pointer-coarse:inline">D</CommandShortcut>
          </>
        ),
      },
      {
        value: "action-live",
        label: "Open the live templates",
        keywords: ["live", "templates", "acme", "site", "preview"],
        onSelect: () => run(() => window.open("/live", "_blank", "noopener")),
        content: (
          <>
            <ArrowUpRightIcon aria-hidden="true" className="text-muted-foreground" />
            <span className="text-foreground">Open the live templates</span>
            <span className="ml-auto hidden shrink-0 text-caption text-muted-foreground sm:inline">New tab</span>
          </>
        ),
      },
      {
        value: "action-overview",
        label: "Go to the overview",
        keywords: ["home", "overview", "blocks"],
        onSelect: () => run(() => router.push("/")),
        content: (
          <>
            <BoxIcon aria-hidden="true" className="text-muted-foreground" />
            <span className="text-foreground">Go to the overview</span>
          </>
        ),
      },
    ],
  }

  const sections = rank([...pages, themeSection, actions], query)

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Blocks"
      description="Jump to a foundation, component, molecule or template."
      className="sm:max-w-144"
    >
      {/* Filtering and order are done here (rank), not by cmdk. */}
      <Command shouldFilter={false}>
        {/* Short enough for a phone, and covers every section and action. */}
        <CommandInput placeholder="Search Blocks…" value={query} onValueChange={setQuery} />
        <CommandList className="max-h-[min(26rem,60dvh)]">
          <CommandEmpty>No results. Try “button”, “pricing” or “color”.</CommandEmpty>
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              {section.separated ? <CommandSeparator /> : null}
              <CommandGroup heading={section.heading}>
                {section.entries.map((entry) => (
                  <CommandItem key={entry.value} value={entry.value} onSelect={entry.onSelect}>
                    {entry.content}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
