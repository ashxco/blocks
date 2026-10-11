"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Segmented } from "@/components/viewer/segmented"
import { useHydrated } from "@/components/viewer/hooks"
import { useSiteMode } from "@/components/viewer/site-theme"
import { themeFontsLabel } from "@/components/viewer/theme-picker"
import { ThemeScope } from "@/lib/theme-scope"
import type { ThemeMode } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { OnlyInTheme } from "./by-theme"
import { modes, themes, type Theme } from "./data"

/*
 * The Themes page's comparison strip: the same small composition five
 * times side by side, each column scoped to one theme, so the only things
 * that change from column to column are what the theme sets. Every column
 * shares the strip's rows (subgrid), so the heading samples, the buttons,
 * the controls, the cards and the panels line up across themes and read as
 * one comparison. Under each composition, a line names the theme's faces.
 *
 * The strip follows the page's Appearance until Light or Dark is chosen
 * above it; that choice applies to the strip only and is not saved. Below
 * @5xl the strip scrolls sideways, one column at a time.
 */

/* Tasks completed per day over a week, for the chart in every column. */
const week = [46, 58, 52, 71, 64, 83, 77]
const weekMax = Math.max(...week)

/** Rows every column shares: name, heading, text, buttons, control, card, panel, fonts. */
const ROWS = "grid-rows-[repeat(8,auto)]"

export function ThemeCompare() {
  const site = useSiteMode()
  const hydrated = useHydrated()
  const [chosen, setChosen] = React.useState<ThemeMode>()

  return (
    <div className="grid gap-5">
      <div className="flex justify-end">
        {/* Invisible until hydrated, so it never shows the wrong mode as chosen. */}
        <Segmented
          label="Mode of the comparison"
          options={modes}
          value={chosen ?? site ?? "light"}
          onValueChange={setChosen}
          className={cn(!hydrated && "invisible")}
        />
      </div>
      <ul
        aria-label="Themes side by side"
        className={cn(
          "-mx-gutter grid snap-x snap-mandatory scroll-px-gutter [scrollbar-width:thin] auto-cols-[15rem] grid-flow-col gap-x-4 overflow-x-auto px-gutter pt-1 pb-3",
          "@5xl:mx-0 @5xl:grid-flow-row @5xl:grid-cols-5 @5xl:overflow-visible @5xl:px-0 @5xl:pt-0 @5xl:pb-0",
          ROWS
        )}
      >
        {themes.map((theme) => (
          <li
            key={theme.id}
            className="row-span-8 grid min-w-0 snap-start grid-rows-subgrid"
          >
            <CompareColumn theme={theme} mode={chosen} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function CompareColumn({
  theme,
  mode,
}: {
  theme: Theme
  mode: ThemeMode | undefined
}) {
  return (
    <ThemeScope
      theme={theme.id}
      className="row-span-8 grid min-w-0 grid-rows-subgrid gap-y-0 text-copy"
    >
      <div className="flex items-baseline justify-between gap-3 pb-3">
        <a
          href={`#${theme.id}`}
          className="text-h4 text-foreground underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
        >
          {theme.name}
        </a>
        {/* Printed for every theme; CSS shows the active one, so it is right on the first frame. */}
        <OnlyInTheme theme={theme.id}>
          <span className="text-caption font-semibold text-brand">Current</span>
        </OnlyInTheme>
      </div>

      {/* The composition: a picture of the theme, so it is inert and hidden from assistive tech. */}
      <ThemeScope
        theme={theme.id}
        mode={mode}
        inert
        aria-hidden="true"
        className="row-span-6 grid min-w-0 grid-rows-subgrid gap-y-4 rounded-(--panel-radius) border bg-background p-4"
      >
        <p className="text-h3 font-extrabold text-balance text-foreground">
          Ship it <span className="text-brand">together</span>.
        </p>
        <p className="text-caption text-copy">
          Plan, track and ship your team&apos;s work in one place.
        </p>
        <div className="flex flex-wrap content-start gap-2">
          <Button size="sm" tabIndex={-1}>
            Publish
          </Button>
          <Button size="sm" variant="outline" tabIndex={-1}>
            Preview
          </Button>
        </div>
        <Input
          tabIndex={-1}
          defaultValue="Website relaunch"
          aria-label="Project"
          size="sm"
        />
        <div className="grid content-start gap-3 rounded-(--card-radius) border bg-card p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-label text-foreground">Tasks done</span>
            <Badge variant="success">+12%</Badge>
          </div>
          <span className="flex h-14 items-end gap-1.5">
            {week.map((value, i) => (
              <span
                key={i}
                className={cn(
                  "block flex-1 rounded-t-xs",
                  i === week.length - 1 ? "bg-chart-1" : "bg-chart-1/45"
                )}
                style={{ height: `${(value / weekMax) * 100}%` }}
              />
            ))}
          </span>
        </div>
        <div className="grid content-start gap-1 rounded-(--panel-radius) bg-panel p-4 text-panel-foreground">
          <span className="text-h4 text-panel-foreground tabular">92%</span>
          <span className="text-caption text-panel-muted">
            On-time delivery,{" "}
            <span className="font-semibold whitespace-nowrap text-panel-brand">
              +4 pts
            </span>
          </span>
        </div>
      </ThemeScope>

      <p className="pt-3 text-caption text-muted-foreground">
        {themeFontsLabel(theme)}
      </p>
    </ThemeScope>
  )
}
