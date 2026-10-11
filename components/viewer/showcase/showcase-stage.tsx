"use client"

import * as React from "react"

import { Segmented } from "@/components/viewer/segmented"
import { AcmeDashboard } from "@/components/viewer/showcase/acme-dashboard"
import { useSiteLook } from "@/components/viewer/site-theme"
import { loadThemeFonts, warmThemeFonts } from "@/components/viewer/theme-fonts"
import { PortalScope } from "@/lib/portal-container"
import { ThemeScope } from "@/lib/theme-scope"
import { defaultThemeId, themeIds, themes, type ThemeId } from "@/lib/themes"

const options = themes.map((theme) => ({ value: theme.id, label: theme.name }))

/**
 * The showcase: one Acme screen, previewed in whichever theme is chosen in
 * the segmented control above it. The choice is for the preview only; it
 * never touches the site's saved theme. The preview follows the site's mode
 * (Appearance) and scopes its overlays with it, and a theme's fonts load
 * before the preview switches, so the first switch never flashes.
 */
export function ShowcaseStage() {
  const { theme: siteTheme, mode } = useSiteLook()
  const [choice, setChoice] = React.useState<ThemeId>()
  const selected = choice ?? siteTheme ?? defaultThemeId
  const request = React.useRef(0)

  React.useEffect(() => {
    warmThemeFonts(themeIds)
  }, [])

  const select = (theme: ThemeId) => {
    const id = ++request.current
    void loadThemeFonts(theme).then(() => {
      if (id === request.current) setChoice(theme)
    })
  }

  return (
    <section aria-label="Showcase" className="grid min-w-0 gap-6">
      <Segmented
        value={selected}
        onValueChange={select}
        options={options}
        label="Preview theme"
        className="max-w-full justify-self-start"
      />
      <PortalScope theme={selected} className={mode}>
        <ThemeScope
          theme={selected}
          mode={mode}
          className="min-w-0 overflow-hidden rounded-(--panel-radius) border bg-background text-copy"
        >
          <AcmeDashboard />
        </ThemeScope>
      </PortalScope>
    </section>
  )
}
