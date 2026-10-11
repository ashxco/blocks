"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PortalScope } from "@/lib/portal-container"
import {
  defaultThemeId,
  isThemeId,
  THEME_ATTRIBUTE,
  type ThemeId,
} from "@/lib/themes"
import { CodeBlock } from "@/components/viewer/code-block"
import { CopyButton } from "@/components/viewer/copy-button"
import {
  deviceOrder,
  devices,
  viewportStyle,
  type Device,
} from "@/components/viewer/devices"
import {
  canvasSurface,
  ExampleThumbnail,
  ExampleThumbnailContext,
  stackChildren,
  type ExampleLayout,
  type ExampleSurface,
} from "@/components/viewer/example-thumbnail"
import { useElementSize } from "@/components/viewer/hooks"
import { slugify } from "@/components/viewer/nav"
import { Segmented } from "@/components/viewer/segmented"
import { useSiteLook, type SiteMode } from "@/components/viewer/site-theme"
import { TokenText } from "@/components/viewer/token-text"

export { ExamplesList } from "@/components/viewer/example-thumbnail"

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
   * - stack: a column centred on the canvas. Each child fills the column up
   *   to its own max-width (max-w-sm, max-w-prose …) and centres; a child
   *   with its own width or margins keeps them.
   * - full: no padding, children fill the canvas (app frames, site navigation, a page with a dialog pinned open)
   *
   * The canvas is a container that includes the center and stack padding, so
   * container queries and cqw units in an example see about 5rem more than
   * its content gets. An example that switches layout at an exact width
   * should wrap itself in its own @container (see docs/components/table.tsx).
   */
  layout?: ExampleLayout
  /** Canvas surface. Use "panel" to preview components that sit on dark panels. */
  surface?: ExampleSurface
  /** Minimum canvas height, as a Tailwind class (e.g. "min-h-96"). */
  minHeight?: string
  /**
   * Use this example as the module's thumbnail on the index pages instead of
   * the first one. Set it on a direct child of <Examples>.
   */
  thumbnail?: boolean
  children: React.ReactNode
}

/* -------------------------------------------------------------------------- */
/* Outer scopes                                                                */
/* -------------------------------------------------------------------------- */

interface OuterLook {
  theme?: ThemeId
  mode?: SiteMode
}

/**
 * The theme and mode scopes an element sits in below <html>: the nearest
 * data-theme and the nearest .dark or .light between it and the page, if
 * any (a ThemeScope around an example, say). The page's own theme and mode
 * live on <html> and every overlay inherits them already; an outer scope has
 * to be handed to the example's overlays explicitly.
 */
function useOuterLook(
  ref: React.RefObject<HTMLElement | null>,
  siteLook: string
): OuterLook {
  const [outer, setOuter] = React.useState<OuterLook>({})
  // Two closest() lookups, and a state update only when a scope changed.
  // Read again whenever the page's look changes.
  React.useLayoutEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const root = parent.ownerDocument.documentElement
    const themeScope = parent.closest(`[${THEME_ATTRIBUTE}]`)
    const modeScope = parent.closest(".dark, .light")
    const value =
      themeScope && themeScope !== root
        ? themeScope.getAttribute(THEME_ATTRIBUTE)
        : null
    const next: OuterLook = {
      theme:
        value === null ? undefined : isThemeId(value) ? value : defaultThemeId,
      mode:
        modeScope && modeScope !== root
          ? modeScope.classList.contains("dark")
            ? "dark"
            : "light"
          : undefined,
    }
    setOuter((prev) =>
      prev.theme === next.theme && prev.mode === next.mode ? prev : next
    )
  }, [ref, siteLook])
  return outer
}

/* -------------------------------------------------------------------------- */
/* Example                                                                     */
/* -------------------------------------------------------------------------- */

const deviceOptions = deviceOrder.map((value) => ({
  value,
  icon: devices[value].icon,
  label:
    value === "desktop"
      ? "Desktop, full canvas width"
      : `${devices[value].label}, ${devices[value].width}px`,
}))

/**
 * A preview canvas for one example: Preview and Code tabs, a copy button, a
 * per-example light/dark switch (Appearance) and, for full-width examples, a
 * desktop/tablet/mobile switch.
 *
 * The canvas is in the site's theme. Forcing its mode keeps that theme: only
 * .dark or .light is scoped on the canvas. Menus, dialogs and popovers opened
 * from the example portal into a body-level element with the canvas's mode,
 * and with the theme and mode of any scope around the example (PortalScope).
 *
 * Tablet and mobile render the example in a virtual viewport of exactly that
 * width, scaled down when the canvas is narrower. Container queries respond to
 * the frame, every fluid token (type, gutter, section rhythm) is computed for
 * the device width, and tokens with breakpoint values (such as the 16px text
 * in form controls on phones) take the value for that width, so the preview
 * matches a real phone or tablet.
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
  const thumbnail = React.useContext(ExampleThumbnailContext)
  const siteLook = useSiteLook()
  const sectionRef = React.useRef<HTMLElement>(null)
  const outer = useOuterLook(sectionRef, `${siteLook.theme}:${siteLook.mode}`)
  const siteTheme = outer.mode ?? siteLook.mode
  const [chosenTheme, setChosenTheme] = React.useState<SiteMode | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [stageRef, stage] = useElementSize<HTMLDivElement>()
  const [frameRef, frame] = useElementSize<HTMLDivElement>("border-box")

  const theme = chosenTheme ?? siteTheme ?? "light"
  // Only scope the canvas when it differs from what it inherits, so it keeps
  // everything else (the theme, fonts, focus) untouched.
  const scope =
    chosenTheme && chosenTheme !== siteTheme ? chosenTheme : undefined
  // Overlays leave the canvas for <body>: they need the canvas's mode, and
  // any theme or mode scoped around the example, but not the page's own.
  const portalMode = scope ?? outer.mode
  const constrained = layout === "full" && device !== "desktop"
  const virtualWidth = constrained ? devices[device].width : undefined
  const scale =
    virtualWidth && stage ? Math.min(1, stage.width / virtualWidth) : 1
  const id = slugify(title)

  if (thumbnail) {
    return (
      <ExampleThumbnail layout={layout} surface={surface} size={thumbnail}>
        {children}
      </ExampleThumbnail>
    )
  }

  return (
    <section
      ref={sectionRef}
      data-slot="example"
      id={id}
      className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-5"
    >
      <header className="grid gap-2">
        <h2 className="text-h3">{title}</h2>
        {description ? (
          <p className="max-w-prose text-body text-copy">
            <TokenText text={description} />
          </p>
        ) : null}
      </header>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "code")}
        className="gap-0 overflow-hidden rounded-(--card-radius) border bg-background"
      >
        <div className="flex h-12 items-stretch justify-between gap-2 border-b pr-2 pl-4 sm:pl-5">
          <TabsList
            variant="line"
            aria-label={`${title} example`}
            className="-mb-px data-horizontal:h-auto"
          >
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {code ? <TabsTrigger value="code">Code</TabsTrigger> : null}
          </TabsList>

          <div className="flex items-center gap-1.5">
            {layout === "full" && tab === "preview" ? (
              <Segmented
                label="Preview width"
                iconOnly
                value={device}
                onValueChange={setDevice}
                className="hidden sm:flex"
                options={deviceOptions}
              />
            ) : null}
            {tab === "preview" ? (
              <Segmented
                label="Preview appearance"
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

        <TabsContent
          value="preview"
          keepMounted
          className="text-copy data-[hidden]:hidden"
        >
          {/* The same element tree in every mode, so switching the device or the
              theme never remounts the example or resets its state. */}
          <div className={scope} data-example-scope={scope}>
            <div
              ref={stageRef}
              data-surface={surface}
              data-device={layout === "full" ? device : undefined}
              className={cn(
                "text-copy",
                // Fades only when the reader switches this example's theme,
                // never while the page itself is loading or changing theme.
                chosenTheme !== null &&
                  "transition-colors duration-(--duration-base)",
                constrained
                  ? "bg-subtle px-3 py-6 sm:px-6 sm:py-10"
                  : canvasSurface(surface)
              )}
            >
              <div
                className={cn(constrained && "mx-auto overflow-hidden")}
                style={
                  virtualWidth
                    ? {
                        width: virtualWidth * scale,
                        height:
                          frame && scale < 1 ? frame.height * scale : undefined,
                      }
                    : undefined
                }
              >
                <div
                  ref={frameRef}
                  className={cn(
                    "@container w-full",
                    // Full-width examples compute fluid type and spacing for the
                    // canvas they sit in, at every device size, not the window.
                    layout === "full" && "bk-viewport",
                    constrained &&
                      cn(
                        "origin-top-left overflow-hidden rounded-(--card-radius) border",
                        canvasSurface(surface)
                      )
                  )}
                  style={
                    virtualWidth
                      ? {
                          ...viewportStyle(virtualWidth),
                          width: virtualWidth,
                          transform: scale < 1 ? `scale(${scale})` : undefined,
                        }
                      : layout === "full" && stage
                        ? viewportStyle(stage.width)
                        : undefined
                  }
                >
                  <div
                    className={cn(
                      layout === "center" &&
                        "flex min-h-52 flex-wrap content-center items-center justify-center gap-4 p-6 sm:p-12",
                      layout === "stack" &&
                        cn("grid gap-4 p-6 sm:p-10", stackChildren),
                      layout === "full" && "w-full",
                      minHeight
                    )}
                  >
                    {/* Menus, dialogs and popovers opened here portal into a
                        body-level element with the example's theme and mode. */}
                    <PortalScope className={portalMode} theme={outer.theme}>
                      {children}
                    </PortalScope>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {code ? (
          <TabsContent value="code">
            <CodeBlock code={code} className="max-h-[32rem]" />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  )
}
