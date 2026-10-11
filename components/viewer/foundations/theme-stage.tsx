"use client"

import * as React from "react"

import { Segmented } from "@/components/viewer/segmented"
import { useSiteLook } from "@/components/viewer/site-theme"
import { PortalScope } from "@/lib/portal-container"
import {
  isThemeId,
  themeScopeProps,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes"
import { cn } from "@/lib/utils"

import { modes } from "./data"

/*
 * The Themes page's stage: one theme at a time, large. A row of tabs, each
 * named in its own theme's heading face, picks the theme; Light and Dark pick
 * the stage's mode. Neither is saved: "Use this theme" in the panel saves.
 *
 * The URL hash is the selection (#ocean), so the side-by-side strip's column
 * names and shared links open the stage on that theme. With no hash the stage
 * shows the site's own theme, and follows the site's Appearance until Light
 * or Dark is chosen here.
 */

export interface StageItem {
  id: ThemeId
  name: string
  /** The live composition, rendered inside the theme's scope. */
  composition: React.ReactNode
  /** Description and actions, under the stage. */
  summary: React.ReactNode
  /** Colour, shape and type details. */
  details: React.ReactNode
}

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

function useHashTheme(): ThemeId | undefined {
  const hash = React.useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  )
  return isThemeId(hash) ? hash : undefined
}

function selectTheme(id: ThemeId) {
  // The hash holds the choice without scrolling the page or adding history.
  window.history.replaceState(null, "", `#${id}`)
  window.dispatchEvent(new HashChangeEvent("hashchange"))
}

export function ThemeStage({ items }: { items: StageItem[] }) {
  const site = useSiteLook()
  const fromHash = useHashTheme()
  const [chosenMode, setChosenMode] = React.useState<ThemeMode | null>(null)
  const selected = fromHash ?? site.theme ?? items[0].id
  const mode: ThemeMode = chosenMode ?? site.mode ?? "light"
  const tabRefs = React.useRef<Map<ThemeId, HTMLButtonElement>>(new Map())

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = items[(index + step + items.length) % items.length]
    selectTheme(next.id)
    tabRefs.current.get(next.id)?.focus()
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div
          role="tablist"
          aria-label="Themes"
          className="-mx-1 flex flex-wrap gap-1"
        >
          {items.map((item, index) => {
            const active = item.id === selected
            return (
              <button
                key={item.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(item.id, node)
                  else tabRefs.current.delete(item.id)
                }}
                type="button"
                role="tab"
                id={item.id}
                aria-selected={active}
                aria-controls={`${item.id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectTheme(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                {...themeScopeProps(
                  item.id,
                  undefined,
                  cn(
                    "flex h-(--button-height-md) scroll-mt-24 items-center gap-2.5 rounded-(--button-radius) px-4 outline-none",
                    "font-heading text-label font-semibold transition-colors duration-(--duration-fast) focus-visible:focus-ring",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-brand"
                />
                {item.name}
              </button>
            )
          })}
        </div>
        <Segmented
          value={mode}
          onValueChange={setChosenMode}
          options={modes}
          label="Stage appearance"
        />
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${item.id}-panel`}
          aria-labelledby={item.id}
          hidden={item.id !== selected}
          className="grid gap-12"
        >
          {/* Menus opened on the stage (the select) take its theme and mode. */}
          <PortalScope theme={item.id} className={mode}>
            <div
              {...themeScopeProps(
                item.id,
                mode,
                "@container rounded-(--panel-radius) bg-subtle p-3 text-copy transition-colors duration-(--duration-base) sm:p-6 @wide:p-10"
              )}
            >
              <div className="mx-auto grid max-w-4xl min-w-0 gap-6 rounded-(--card-radius) border bg-background p-4 @prose:p-8">
                {item.composition}
              </div>
            </div>
          </PortalScope>
          <div {...themeScopeProps(item.id, undefined, "grid gap-12")}>
            {item.summary}
            {item.details}
          </div>
        </div>
      ))}
    </div>
  )
}
