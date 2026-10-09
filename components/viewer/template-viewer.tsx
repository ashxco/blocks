"use client"

import * as React from "react"
import { ArrowUpRightIcon, MoonIcon, RotateCwIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { deviceOrder, devices, type Device } from "@/components/viewer/devices"
import {
  LOAD_TIMEOUT,
  frameHasTheme,
  frameRendered,
  hideDevIndicator,
  useElementSize,
  useFrameTheme,
} from "@/components/viewer/scaled-frame"
import { Segmented } from "@/components/viewer/segmented"
import { useSiteTheme, type SiteTheme } from "@/components/viewer/site-theme"

const deviceOptions = deviceOrder.map((value) => ({
  value,
  icon: devices[value].icon,
  label: devices[value].label,
}))

/** Phones start on the mobile preview: a desktop page at 25% is unreadable. */
const phoneQuery = "(max-width: 639px)"

function subscribePhone(onChange: () => void) {
  const query = window.matchMedia(phoneQuery)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** True on phone-width windows; null on the server and while hydrating. */
function usePhone() {
  return React.useSyncExternalStore<boolean | null>(
    subscribePhone,
    () => window.matchMedia(phoneQuery).matches,
    () => null
  )
}

/**
 * A full template in a resizable frame: desktop, tablet and mobile widths,
 * light and dark themes, and a link that opens the page in a new tab.
 *
 * The frame loads once. Switching the theme restyles the page in place
 * (useFrameTheme), so there is no reload and no flash of the other theme;
 * ?theme= on the address only tells the page which theme to keep once it
 * hydrates, and is never saved.
 */
export function TemplateViewer({ href, title }: { href: string; title: string }) {
  const siteTheme = useSiteTheme()
  const [chosenTheme, setChosenTheme] = React.useState<SiteTheme | null>(null)
  const [chosenDevice, setChosenDevice] = React.useState<Device | null>(null)
  const [frame, setFrame] = React.useState<{ src: string; key: number } | null>(null)
  const [loadedKey, setLoadedKey] = React.useState<number | null>(null)
  const [failedKey, setFailedKey] = React.useState<number | null>(null)
  const [stageRef, size] = useElementSize<HTMLDivElement>()
  const phone = usePhone()

  // The default device follows the stage once it is measured, and the window
  // before that. Until either is known, the width switch stays hidden, so it
  // never shows Desktop and then jumps to Mobile.
  const autoDevice: Device | null = size
    ? size.width < 600
      ? "mobile"
      : "desktop"
    : phone === null
      ? null
      : phone
        ? "mobile"
        : "desktop"
  const known = chosenDevice ?? autoDevice
  const device = known ?? "desktop"
  const theme = chosenTheme ?? siteTheme ?? "light"
  const fullPage = `${href}?theme=${theme}`
  const target = devices[device].width
  const scale = size ? Math.min(1, size.width / target) : 0
  const ready = size !== null && size.width > 0 && siteTheme !== undefined
  const syncTheme = useFrameTheme(ready ? theme : undefined)

  // The frame's address is fixed when it first mounts (and on reload).
  if (ready && !frame) setFrame({ src: fullPage, key: 0 })
  const loaded = frame !== null && loadedKey === frame.key
  const failed = frame !== null && failedKey === frame.key && !loaded
  const reload = () => setFrame((f) => ({ src: fullPage, key: (f?.key ?? 0) + 1 }))

  // A page that never finishes loading shows as unavailable, with a reload.
  const frameKey = frame?.key
  React.useEffect(() => {
    if (frameKey === undefined || loaded) return
    const id = window.setTimeout(() => setFailedKey(frameKey), LOAD_TIMEOUT)
    return () => window.clearTimeout(id)
  }, [frameKey, loaded])

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Segmented
            label="Preview width"
            value={device}
            onValueChange={setChosenDevice}
            options={deviceOptions}
            labelClassName="hidden md:inline"
            className={cn(!known && "invisible")}
          />
          <Segmented
            label="Preview theme"
            iconOnly
            value={theme}
            onValueChange={setChosenTheme}
            options={[
              { value: "light", label: "Light", icon: SunIcon },
              { value: "dark", label: "Dark", icon: MoonIcon },
            ]}
          />
          <span className="hidden font-mono text-caption whitespace-nowrap text-muted-foreground tabular xl:inline">
            {target}px{scale > 0 && scale < 1 ? ` at ${Math.round(scale * 100)}%` : ""}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reload preview"
            title="Reload preview"
            onClick={reload}
          >
            <RotateCwIcon aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            nativeButton={false}
            render={<a href={fullPage} target="_blank" rel="noopener" />}
            aria-label="Open full page in a new tab"
            title="Open full page in a new tab"
            className="sm:hidden"
          >
            <ArrowUpRightIcon aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href={fullPage} target="_blank" rel="noopener" />}
            className="hidden sm:inline-flex"
          >
            Open full page
            <ArrowUpRightIcon data-icon="inline-end" />
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative h-[min(78dvh,60rem)] min-h-[28rem] overflow-hidden rounded-(--card-radius) border bg-subtle"
      >
        {ready && frame ? (
          <div
            className={cn(
              "absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden bg-background",
              "transition-[width] duration-(--duration-slow) ease-out",
              scale >= 1 && "border-x"
            )}
            style={{ width: target * scale }}
          >
            <iframe
              key={frame.key}
              src={frame.src}
              title={`${title} template preview`}
              onLoad={(event) => {
                const el = event.currentTarget
                if (!frameRendered(el)) {
                  setFailedKey(frame.key)
                  return
                }
                hideDevIndicator(el)
                syncTheme(el)
                if (frameHasTheme(el, theme)) setLoadedKey(frame.key)
              }}
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
        {failed ? (
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="grid max-w-xs justify-items-center gap-4 text-center">
              <div className="grid gap-1">
                <p className="text-title text-foreground">Preview unavailable</p>
                <p className="text-caption text-muted-foreground">
                  <span className="font-mono">{href}</span> did not load. Reload to try again.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={reload}>
                <RotateCwIcon data-icon="inline-start" />
                Reload preview
              </Button>
            </div>
          </div>
        ) : !loaded ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-muted-foreground">
            <div className="grid justify-items-center gap-3 text-center">
              <Spinner className="size-5" />
              <span className="font-mono text-caption">{href}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
