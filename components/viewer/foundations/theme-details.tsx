import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { withLook } from "@/lib/themes"

import { AliasRamp } from "./alias-ramp"
import {
  aliasHue,
  aliasScaleLabel,
  describeRadius,
  type ScaleRole,
  type Theme,
} from "./data"
import { Meta } from "./layout"
import { ThemeActions } from "./theme-actions"

/* Under the Themes page's stage: what the selected theme is, its actions, and its colour, shape and type. */

/** The theme's alias scale, drawn from its CSS variables inside the theme's scope. */
function ScaleStrip({ theme, role }: { theme: Theme; role: ScaleRole }) {
  const scale = aliasScaleLabel(theme.id, role)
  const h = aliasHue(theme.id, role)
  const hue = h === null ? "No hue" : `Hue ${h}`
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-foreground">
          {role === "accent" ? "Accent" : "Neutral"}{" "}
          <span className="font-normal text-muted-foreground">· {scale}</span>
        </span>
        <Meta>{hue}</Meta>
      </div>
      <AliasRamp role={role} className="h-10 rounded-md border" />
    </div>
  )
}

function ShapeDetails({ theme }: { theme: Theme }) {
  const components: [label: string, value: string][] = [
    ["Buttons", describeRadius(theme.radius.button)],
    ["Controls", describeRadius(theme.radius.control)],
    ["Cards", describeRadius(theme.radius.card)],
    ["Panels", describeRadius(theme.radius.panel)],
  ]
  return (
    <div className="grid content-start gap-5">
      <h3 className="text-title text-foreground">Shape</h3>
      <dl className="grid border-b">
        {components.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-t py-2.5"
          >
            <dt className="text-caption text-copy">{label}</dt>
            <dd className="font-mono text-xs text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** The theme's heading face and text face, each as a short sample with its name. */
function TypeDetails({ theme }: { theme: Theme }) {
  return (
    <div className="grid content-start gap-5">
      <h3 className="text-title text-foreground">Type</h3>
      <div className="grid gap-1.5 border-t pt-4">
        <p className="text-h3 text-foreground">Plan it. Track it.</p>
        <Meta>{theme.fonts.heading}</Meta>
      </div>
      <div className="grid gap-1.5 border-t pt-4">
        <p className="text-body text-copy">
          Give each task an owner and a due date.
        </p>
        <Meta>{theme.fonts.sans}</Meta>
      </div>
    </div>
  )
}

export function ThemeDetails({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-x-10 gap-y-12 @narrow:grid-cols-3">
      <div className="grid content-start gap-5">
        <h3 className="text-title text-foreground">Colour</h3>
        <ScaleStrip theme={theme} role="accent" />
        <ScaleStrip theme={theme} role="neutral" />
      </div>
      <ShapeDetails theme={theme} />
      <TypeDetails theme={theme} />
    </div>
  )
}

/** Under the stage: what the theme is, its id, and the actions to use or preview it. */
export function ThemeSummary({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @narrow:items-end @narrow:gap-10">
      <p className="max-w-prose text-lead text-copy">{theme.description}</p>
      <div className="flex flex-wrap items-center gap-3 @narrow:justify-end">
        <ThemeActions theme={theme.id} name={theme.name} />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={withLook("/components", { theme: theme.id })}
              target="_blank"
              rel="noopener"
            />
          }
        >
          Preview Components
          <ArrowUpRightIcon data-icon="inline-end" />
          <span className="sr-only">(Opens in a New Tab)</span>
        </Button>
      </div>
    </div>
  )
}
