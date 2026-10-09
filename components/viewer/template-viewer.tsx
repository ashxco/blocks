"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon, MonitorIcon, MoonIcon, RotateCwIcon, SmartphoneIcon, SunIcon, TabletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/components/viewer/cn"
import { useSiteTheme } from "@/components/viewer/example-canvas"
import { useElementSize } from "@/components/viewer/scaled-frame"
import { Segmented } from "@/components/viewer/segmented"

type Device = "desktop" | "tablet" | "mobile"
type Theme = "light" | "dark"

const devices: Record<Device, { width: number; label: string }> = {
  desktop: { width: 1440, label: "Desktop, 1440px" },
  tablet: { width: 834, label: "Tablet, 834px" },
  mobile: { width: 390, label: "Mobile, 390px" },
}

/**
 * Keeps the viewer's own theme steady while a preview sets its theme from
 * ?theme=. The preview shares this origin's storage, and next-themes in this
 * window would otherwise follow the preview's write.
 */
function useIsolateThemeStorage() {
  React.useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === "theme") event.stopImmediatePropagation()
    }
    window.addEventListener("storage", onStorage, { capture: true })
    return () => window.removeEventListener("storage", onStorage, { capture: true })
  }, [])
}

/**
 * A full template in a resizable frame: desktop, tablet and mobile widths,
 * light and dark themes, and a link to the full page.
 */
export function TemplateViewer({ href, title }: { href: string; title: string }) {
  const siteTheme = useSiteTheme()
  const [chosenTheme, setChosenTheme] = React.useState<Theme | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const [reloadKey, setReloadKey] = React.useState(0)
  const [loaded, setLoaded] = React.useState(false)
  const [stageRef, size] = useElementSize<HTMLDivElement>()
  useIsolateThemeStorage()

  const theme = chosenTheme ?? siteTheme ?? "light"
  const src = `${href}?theme=${theme}`
  const target = devices[device].width
  const scale = size ? Math.min(1, size.width / target) : 0
  const ready = size !== null && size.width > 0 && siteTheme !== undefined

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Preview width"
            value={device}
            onValueChange={setDevice}
            options={[
              { value: "desktop", label: "Desktop", icon: MonitorIcon },
              { value: "tablet", label: "Tablet", icon: TabletIcon },
              { value: "mobile", label: "Mobile", icon: SmartphoneIcon },
            ]}
            labelClassName="hidden sm:inline"
          />
          <Segmented
            label="Preview theme"
            iconOnly
            value={theme}
            onValueChange={(value) => {
              setLoaded(false)
              setChosenTheme(value)
            }}
            options={[
              { value: "light", label: "Light", icon: SunIcon },
              { value: "dark", label: "Dark", icon: MoonIcon },
            ]}
          />
          <span className="hidden font-mono text-caption text-muted-foreground tabular sm:inline">
            {target}px{scale > 0 && scale < 1 ? ` at ${Math.round(scale * 100)}%` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reload preview"
            title="Reload preview"
            onClick={() => {
              setLoaded(false)
              setReloadKey((k) => k + 1)
            }}
          >
            <RotateCwIcon aria-hidden="true" />
          </Button>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={src} />}>
            Open full page
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative h-[min(78dvh,60rem)] min-h-[28rem] overflow-hidden rounded-(--card-radius) border bg-subtle"
      >
        {ready ? (
          <div
            className={cn(
              "absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden bg-background",
              "transition-[width] duration-(--duration-slow) ease-out",
              scale >= 1 && "border-x"
            )}
            style={{ width: target * scale }}
          >
            <iframe
              key={`${src}-${reloadKey}`}
              src={src}
              title={`${title} template preview`}
              onLoad={() => setLoaded(true)}
              className={cn(
                "absolute top-0 left-0 origin-top-left border-0 bg-background",
                "transition-opacity duration-(--duration-base) ease-out",
                loaded ? "opacity-100" : "opacity-0"
              )}
              style={{
                width: target,
                height: size.height / scale,
                transform: scale < 1 ? `scale(${scale})` : undefined,
              }}
            />
          </div>
        ) : null}
        {!loaded ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-muted-foreground">
            <Spinner className="size-5" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
