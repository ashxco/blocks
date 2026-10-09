"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"
import { MonitorIcon, MoonIcon, SmartphoneIcon, SunIcon, TabletIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/components/viewer/cn"
import { CopyButton } from "@/components/viewer/copy-button"
import { slugify } from "@/components/viewer/nav"
import { Segmented } from "@/components/viewer/segmented"

export interface ExampleProps {
  /** Short name of the example, e.g. "Variants". */
  title: string
  /** One sentence on when to use this example. */
  description?: string
  /** Source shown in the Code tab. Optional. */
  code?: string
  /**
   * How the preview canvas lays out its children.
   * - center: centred, wrapping row (default)
   * - stack: left-aligned column
   * - full: no padding, children fill the canvas (molecules, sections)
   */
  layout?: "center" | "stack" | "full"
  /** Canvas surface. Use "panel" to preview components that sit on dark panels. */
  surface?: "default" | "subtle" | "panel"
  /** Minimum canvas height, as a Tailwind class (e.g. "min-h-96"). */
  minHeight?: string
  children: React.ReactNode
}

type CanvasTheme = "light" | "dark"
type Device = "desktop" | "tablet" | "mobile"

const deviceWidth: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
}

const subscribe = () => () => {}
/** True after hydration, so theme-dependent UI never mismatches the server. */
export function useHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

/** The site's resolved theme, or undefined before hydration. */
export function useSiteTheme(): CanvasTheme | undefined {
  const { resolvedTheme } = useTheme()
  const hydrated = useHydrated()
  if (!hydrated) return undefined
  return resolvedTheme === "dark" ? "dark" : "light"
}

/** Class that scopes the tokens of a region to one theme. */
export function themeScope(theme: CanvasTheme | undefined) {
  if (theme === "dark") return "dark"
  if (theme === "light") return "bk-light"
  return undefined
}

const tabClass = cn(
  "relative flex h-full items-center px-3 text-label text-muted-foreground outline-none select-none",
  "transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring data-[active]:text-foreground"
)

/**
 * A preview canvas for one example: Preview and Code tabs, a copy button, a
 * per-example light/dark switch and, for full-width examples, a
 * desktop/tablet/mobile width switch.
 */
export function Example({
  title,
  description,
  code,
  layout = "center",
  surface = "default",
  minHeight,
  children,
}: ExampleProps) {
  const siteTheme = useSiteTheme()
  const [chosenTheme, setChosenTheme] = React.useState<CanvasTheme | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const [tab, setTab] = React.useState<"preview" | "code">("preview")

  const theme = chosenTheme ?? siteTheme ?? "light"
  // Only scope the canvas when it differs from the site, so it inherits
  // everything else (fonts, focus) untouched.
  const scope = chosenTheme && chosenTheme !== siteTheme ? themeScope(chosenTheme) : undefined
  const constrained = layout === "full" && device !== "desktop"
  const id = slugify(title)

  return (
    <section data-slot="example" id={id} className="grid scroll-mt-24 gap-5">
      <header className="grid gap-2">
        <h2 className="text-h3">{title}</h2>
        {description ? <p className="max-w-prose text-body text-copy">{description}</p> : null}
      </header>

      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "code")}
        className="overflow-hidden rounded-(--card-radius) border bg-background"
      >
        <div className="flex h-12 items-center justify-between gap-2 border-b pr-2 pl-1 sm:pl-2">
          <Tabs.List aria-label={`${title} example`} className="relative flex h-full items-center">
            <Tabs.Tab value="preview" className={tabClass}>
              Preview
            </Tabs.Tab>
            {code ? (
              <Tabs.Tab value="code" className={tabClass}>
                Code
              </Tabs.Tab>
            ) : null}
            <Tabs.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-foreground transition-[translate,width] duration-(--duration-base) ease-out" />
          </Tabs.List>

          <div className="flex items-center gap-1.5">
            {layout === "full" && tab === "preview" ? (
              <Segmented
                label="Canvas width"
                iconOnly
                value={device}
                onValueChange={setDevice}
                className="hidden sm:inline-flex"
                options={[
                  { value: "desktop", label: "Desktop width", icon: MonitorIcon },
                  { value: "tablet", label: "Tablet width, 768px", icon: TabletIcon },
                  { value: "mobile", label: "Mobile width, 390px", icon: SmartphoneIcon },
                ]}
              />
            ) : null}
            {tab === "preview" ? (
              <Segmented
                label="Canvas theme"
                iconOnly
                value={theme}
                onValueChange={setChosenTheme}
                options={[
                  { value: "light", label: "Light", icon: SunIcon },
                  { value: "dark", label: "Dark", icon: MoonIcon },
                ]}
              />
            ) : null}
            {code ? <CopyButton text={code} /> : null}
          </div>
        </div>

        <Tabs.Panel value="preview" keepMounted className="outline-none data-[hidden]:hidden">
          <div className={scope}>
            <div
              data-surface={surface}
              data-theme={theme}
              className={cn(
                "text-copy transition-colors duration-(--duration-base)",
                constrained ? "bg-subtle px-3 py-6 sm:px-6" : canvasSurface(surface)
              )}
            >
              <div
                style={{ maxWidth: layout === "full" ? deviceWidth[device] : undefined }}
                className={cn(
                  "@container mx-auto w-full transition-[max-width] duration-(--duration-slow) ease-out",
                  constrained && cn("overflow-hidden rounded-(--card-radius) border", canvasSurface(surface))
                )}
              >
                <div
                  className={cn(
                    layout === "center" && "flex min-h-52 flex-wrap items-center justify-center gap-4 p-6 sm:p-12",
                    layout === "stack" && "grid gap-4 p-6 sm:p-10",
                    layout === "full" && "w-full",
                    minHeight
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        {code ? (
          <Tabs.Panel value="code" className="outline-none">
            <pre className="max-h-[32rem] overflow-auto bg-terminal p-5 font-mono text-code text-terminal-foreground [scrollbar-width:thin] sm:p-6">
              <code>{code}</code>
            </pre>
          </Tabs.Panel>
        ) : null}
      </Tabs.Root>
    </section>
  )
}

function canvasSurface(surface: ExampleProps["surface"]) {
  if (surface === "subtle") return "bg-subtle"
  if (surface === "panel") return "bg-panel text-panel-foreground"
  return "bg-background"
}
