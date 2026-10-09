"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { navSections, type SectionId } from "@/components/viewer/nav"

const sectionIcon: Record<SectionId, LucideIcon> = {
  foundations: PaletteIcon,
  components: ComponentIcon,
  molecules: LayersIcon,
  templates: AppWindowIcon,
}

/**
 * ⌘K / Ctrl+K palette over everything in the registry. The open state lives
 * with the caller so a header button can open it too.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  const run = React.useCallback(
    (action: () => void) => {
      onOpenChange(false)
      action()
    },
    [onOpenChange]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Blocks"
      description="Jump to a foundation, component, molecule or template."
      className="sm:max-w-144"
    >
      {/* Short enough for a phone, and covers every section and action. */}
      <CommandInput placeholder="Search Blocks…" />
      <CommandList className="max-h-[min(26rem,60dvh)]">
        <CommandEmpty>No results. Try “button”, “pricing” or “color”.</CommandEmpty>
        {navSections.map((section) => {
          const Icon = sectionIcon[section.id]
          return (
            <CommandGroup key={section.id} heading={section.title}>
              {section.groups.flatMap((group) =>
                group.items.map((item) => {
                  const isIndex = item.href === section.href
                  return (
                    <CommandItem
                      key={item.href}
                      value={item.href}
                      keywords={[item.title, group.title ?? "", section.title, item.description]}
                      onSelect={() => run(() => router.push(item.href))}
                    >
                      <Icon aria-hidden="true" className="text-muted-foreground" />
                      <span className="truncate text-foreground">
                        {isIndex ? `${section.title} ${item.title.toLowerCase()}` : item.title}
                      </span>
                      {group.title ? (
                        <span className="ml-auto hidden shrink-0 text-caption text-muted-foreground sm:inline">
                          {group.title}
                        </span>
                      ) : null}
                    </CommandItem>
                  )
                })
              )}
            </CommandGroup>
          )
        })}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="action-theme"
            keywords={["theme", "dark", "light", "mode"]}
            onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
          >
            {resolvedTheme === "dark" ? (
              <SunIcon aria-hidden="true" className="text-muted-foreground" />
            ) : (
              <MoonIcon aria-hidden="true" className="text-muted-foreground" />
            )}
            <span className="text-foreground">
              Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
            </span>
          </CommandItem>
          <CommandItem
            value="action-live"
            keywords={["live", "templates", "lumen", "site", "preview"]}
            onSelect={() => run(() => window.open("/live", "_blank", "noopener"))}
          >
            <ArrowUpRightIcon aria-hidden="true" className="text-muted-foreground" />
            <span className="text-foreground">Open the live templates</span>
            <span className="ml-auto hidden shrink-0 text-caption text-muted-foreground sm:inline">New tab</span>
          </CommandItem>
          <CommandItem
            value="action-overview"
            keywords={["home", "overview", "blocks"]}
            onSelect={() => run(() => router.push("/"))}
          >
            <BoxIcon aria-hidden="true" className="text-muted-foreground" />
            <span className="text-foreground">Go to the overview</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
