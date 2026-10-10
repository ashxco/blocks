"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { useToggleAppearance } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useSiteTheme, type SiteMode } from "@/components/viewer/site-theme"

/**
 * The site's Appearance as the visitor sees it (forced by the URL or not),
 * the mode a switch would go to, and the switch itself. Switching saves the
 * new mode; on a page whose URL forces one, it drops that first, so the
 * change shows at once and later switches keep working. Use it wherever the
 * viewer offers light or dark.
 */
export function useAppearance(): { mode: SiteMode | undefined; next: SiteMode; toggle: () => void } {
  const mode = useSiteTheme()
  const next: SiteMode = mode === "dark" ? "light" : "dark"
  const toggle = useToggleAppearance()
  return { mode, next, toggle }
}

/**
 * The Appearance toggle: switches the whole site between light and dark.
 * Press D anywhere for the same. The theme (Ocean, Forest, …) is separate:
 * see ThemePicker.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, next, toggle } = useAppearance()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={mode ? `Appearance: switch to ${next}` : "Appearance: switch between light and dark"}
      title="Appearance (D)"
      onClick={toggle}
    >
      <SunIcon aria-hidden="true" className="hidden dark:block" />
      <MoonIcon aria-hidden="true" className="dark:hidden" />
    </Button>
  )
}
