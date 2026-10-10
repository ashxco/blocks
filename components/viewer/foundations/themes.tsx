import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CodeBlock } from "@/components/viewer/code-block"
import { ThemeScope } from "@/lib/theme-scope"
import { themeScopeProps, withLook, type ThemeMode } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { OnlyInTheme } from "./by-theme"
import { formatRatio, textContrast, wcagLevel } from "./color"
import {
  aliasHue,
  aliasScaleLabel,
  describeSize,
  themes,
  themeValues,
  tokenByName,
  tokenByVar,
  typeValue,
  valueIn,
  type ScaleRole,
  type Theme,
} from "./data"
import { Code, FoundationPage, Meta, ScopedChip, Section, SubHeading } from "./layout"
import { rampFill, rampSteps } from "./scale-fill"
import { ThemeActions } from "./theme-actions"

/*
 * Every preview on this page is scoped with data-theme (and .light / .dark
 * for the mode), so it shows that theme whatever the site is on. Only the
 * "Current theme" marks follow the site's own theme.
 */

const modes: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
]

/** "9999px" reads as a pill, anything else as pixels. */
function shapeOf(value: string) {
  const size = describeSize(value)
  return size === "Fully round" ? "Pill" : size
}

/* ------------------------------------------------------------------------ */
/* Presets at a glance                                                       */
/* ------------------------------------------------------------------------ */

/**
 * Where a preset card sits. Two across on phones, a lone last card spanning
 * both; three across from @prose (on a six-column grid, so a short last row
 * shares the full width); one row from @5xl, where each card is wide enough
 * for its name, its mark and both chips.
 */
function railSpan(index: number, count: number) {
  const short = count % 3
  const inShortRow = short > 0 && index >= count - short
  return cn(
    count % 2 === 1 && index === count - 1 && "col-span-2",
    !inShortRow ? "@prose:col-span-2" : short === 2 ? "@prose:col-span-3" : "@prose:col-span-6",
    "@5xl:col-span-1"
  )
}

function PresetRail() {
  return (
    <ul className="grid grid-cols-2 gap-4 @prose:grid-cols-6 @5xl:grid-flow-col @5xl:grid-cols-none @5xl:auto-cols-fr">
      {themes.map((theme, i) => (
        <li key={theme.id} className={cn("min-w-0", railSpan(i, themes.length))}>
          <a
            href={`#${theme.id}`}
            {...themeScopeProps(
              theme.id,
              undefined,
              "group grid h-full overflow-hidden rounded-(--card-radius) border bg-card transition-colors duration-(--duration-fast) ease-standard hover:border-foreground focus-visible:focus-ring outline-none"
            )}
          >
            <span aria-hidden className="grid h-32 content-between bg-subtle p-4">
              <span className="flex items-start justify-between gap-2">
                <span className="text-h2 leading-none text-foreground">Aa</span>
                <span className="flex -space-x-1">
                  <span className="size-4 rounded-full border-2 border-subtle bg-brand" />
                  <span className="size-4 rounded-full border-2 border-subtle bg-muted-foreground" />
                  <span className="size-4 rounded-full border-2 border-subtle bg-panel" />
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-(--button-height-xs) items-center rounded-(--button-radius) bg-primary px-(--button-padding-x-xs) text-caption font-semibold text-primary-foreground">
                  Create
                </span>
                <span className="inline-flex h-(--button-height-xs) items-center rounded-(--control-radius) border border-input bg-background px-2.5 text-caption text-muted-foreground">
                  Search
                </span>
              </span>
            </span>
            <span className="grid content-start gap-0.5 border-t p-4">
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-title text-foreground">{theme.name}</span>
                {/* Printed for every theme; CSS shows the active one, so it is right on the first frame. */}
                <OnlyInTheme theme={theme.id}>
                  <span className="text-caption font-semibold text-brand">Current</span>
                </OnlyInTheme>
              </span>
              <span className="text-caption text-muted-foreground">{theme.fonts.sans}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------------ */
/* One theme: a live composition in light and dark, then its tokens          */
/* ------------------------------------------------------------------------ */

const projects = [
  { name: "Website", open: 42 },
  { name: "Mobile app", open: 31 },
  { name: "Brand refresh", open: 24 },
  { name: "Help centre", open: 16 },
  { name: "Hiring", open: 9 },
]

/* Literal class names so Tailwind generates every series. */
const seriesFill = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
const people = [
  { initials: "MP", fill: "bg-tint-violet" },
  { initials: "SA", fill: "bg-tint-mint" },
  { initials: "JL", fill: "bg-tint-sand" },
]

/** Real components on the theme's tokens: card, badge, chart, input, buttons and a dark panel. */
function Composition({ label }: { label: string }) {
  const max = Math.max(...projects.map((p) => p.open))
  return (
    <>
      <div className="grid gap-5 rounded-(--card-radius) border bg-card p-(--card-padding) text-card-foreground">
        <div className="flex items-start justify-between gap-4">
          <div className="grid min-w-0 gap-1">
            <p className="text-h4 text-foreground">Website relaunch</p>
            <p className="text-caption text-muted-foreground">12 of 18 tasks done · Due 24 October</p>
          </div>
          <Badge variant="success">On track</Badge>
        </div>

        <figure className="grid gap-3">
          <figcaption className="flex items-center justify-between gap-3">
            <span className="text-label text-foreground">Open tasks by project</span>
            <Badge variant="brand">3 new</Badge>
          </figcaption>
          <ul className="grid gap-2">
            {projects.map((p, i) => (
              <li key={p.name} className="grid grid-cols-[6.5rem_minmax(0,1fr)_1.75rem] items-center gap-3">
                <span className="truncate text-caption text-copy">{p.name}</span>
                <span aria-hidden className="block h-2.5 overflow-hidden rounded-xs bg-muted">
                  <span className={cn("block h-full rounded-xs", seriesFill[i])} style={{ width: `${(p.open / max) * 100}%` }} />
                </span>
                <span className="text-right font-mono text-xs text-foreground tabular">{p.open}</span>
              </li>
            ))}
          </ul>
        </figure>

        <div className="flex gap-2">
          <Input aria-label={`New task (${label})`} placeholder="Add a task" className="min-w-0 flex-1" />
          <Button type="button">Add task</Button>
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <span className="flex -space-x-1.5">
            {people.map((p) => (
              <span
                key={p.initials}
                aria-hidden
                className={cn(
                  "grid size-(--avatar-size-sm) place-items-center rounded-full border-2 border-card text-xs font-semibold text-foreground",
                  p.fill
                )}
              >
                {p.initials}
              </span>
            ))}
          </span>
          <Button type="button" variant="link">
            View all tasks
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground">
        <p className="text-h4 text-panel-foreground">Ship the relaunch on time</p>
        <p className="text-body text-panel-muted">
          <span className="font-semibold text-panel-brand">92%</span> of tasks closed on schedule this month.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="inverse" size="sm">
            Invite team
          </Button>
          <Button type="button" variant="outline-inverse" size="sm">
            View report
          </Button>
        </div>
      </div>
    </>
  )
}

function Compositions({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-6 @narrow:grid-cols-2">
      {modes.map(({ mode, label }) => (
        <figure key={mode} className="grid min-w-0 content-start gap-3">
          <figcaption className="text-caption text-muted-foreground">{label}</figcaption>
          <ThemeScope
            theme={theme.id}
            mode={mode}
            className="grid gap-4 rounded-(--panel-radius) border bg-background p-4 text-copy @prose:p-6"
          >
            <Composition label={`${theme.name}, ${label.toLowerCase()}`} />
          </ThemeScope>
        </figure>
      ))}
    </div>
  )
}

/** The theme's alias scale, drawn from its CSS variables inside the theme's scope. */
function Ramp({ theme, role }: { theme: Theme; role: ScaleRole }) {
  const scale = aliasScaleLabel(theme.id, role)
  const h = aliasHue(theme.id, role)
  const hue = h === null ? "No hue" : `Hue ${h}`
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-foreground">
          {role === "accent" ? "Accent" : "Neutral"} <span className="font-normal text-muted-foreground">· {scale}</span>
        </span>
        <Meta>{hue}</Meta>
      </div>
      <span aria-hidden className="grid h-10 grid-cols-11 overflow-hidden rounded-md border">
        {rampSteps.map((step) => (
          <span key={step} className={rampFill[role][step]} />
        ))}
      </span>
      <span aria-hidden className="flex justify-between">
        <Meta>50</Meta>
        <Meta>500</Meta>
        <Meta>950</Meta>
      </span>
    </div>
  )
}

/* Literal class names so Tailwind generates every corner. */
const cornerClass: Record<string, string> = {
  xs: "rounded-tl-xs",
  sm: "rounded-tl-sm",
  md: "rounded-tl-md",
  lg: "rounded-tl-lg",
  xl: "rounded-tl-xl",
  "2xl": "rounded-tl-2xl",
}

function ShapeDetails({ theme }: { theme: Theme }) {
  const components: [label: string, value: string][] = [
    ["Buttons", shapeOf(theme.radius.button)],
    ["Controls", shapeOf(theme.radius.control)],
    ["Cards", shapeOf(theme.radius.card)],
    ["Panels", shapeOf(theme.radius.panel)],
  ]
  return (
    <div className="grid content-start gap-5">
      <h3 className="text-title text-foreground">Shape</h3>
      <ul aria-label="Radius scale" className="grid grid-cols-6 gap-2">
        {Object.keys(cornerClass).map((step) => {
          const t = tokenByName(`radius.${step}`)
          return (
            <li key={step} className="grid min-w-0 justify-items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "block aspect-square w-full max-w-12 border-t-(length:--border-width-strong) border-l-(length:--border-width-strong) border-foreground",
                  cornerClass[step]
                )}
              />
              <span className="grid">
                <span className="font-mono text-xs font-semibold text-foreground">{step}</span>
                <Meta>{t ? describeSize(valueIn(theme.id, t).value) : ""}</Meta>
              </span>
            </li>
          )
        })}
      </ul>
      <dl className="grid border-b">
        {components.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-t py-2.5">
            <dt className="text-caption text-copy">{label}</dt>
            <dd className="font-mono text-xs text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function TypeDetails({ theme }: { theme: Theme }) {
  const h1 = tokenByName("type.h1")
  const tracking = h1 ? typeValue({ ...h1, value: valueIn(theme.id, h1).value })?.letterSpacing : undefined
  return (
    <div className="grid content-start gap-5">
      <h3 className="text-title text-foreground">Type</h3>
      <div className="grid gap-4 border-t pt-4">
        <div className="flex items-end justify-between gap-4">
          <span aria-hidden className="text-6xl leading-none font-extrabold text-foreground">
            Aa
          </span>
          <span className="grid justify-items-end text-right">
            <span className="text-label text-foreground">{theme.fonts.sans}</span>
            <Meta>{tracking ? `h1 tracking ${tracking}` : "Headings and UI"}</Meta>
          </span>
        </div>
        <p className="text-h3 text-balance text-foreground">Plan it. Track it. Ship it together.</p>
        <p className="text-caption text-copy">
          Give each task an owner and a due date, and keep the discussion next to the work.
        </p>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t pt-4">
        <code className="truncate font-mono text-code text-foreground">npm install @acme/sdk</code>
        <span className="shrink-0 text-label text-foreground">{theme.fonts.mono}</span>
      </div>
    </div>
  )
}

function ThemeDetails({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-x-10 gap-y-12 @narrow:grid-cols-3">
      <div className="grid content-start gap-5">
        <h3 className="text-title text-foreground">Colour</h3>
        <Ramp theme={theme} role="accent" />
        <Ramp theme={theme} role="neutral" />
      </div>
      <ShapeDetails theme={theme} />
      <TypeDetails theme={theme} />
    </div>
  )
}

/**
 * A theme's section is itself scoped to the theme, in the page's mode: its
 * heading, buttons and details are drawn by that theme.
 */
function ThemeSection({ theme }: { theme: Theme }) {
  const titleId = `${theme.id}-title`
  return (
    <section
      id={theme.id}
      aria-labelledby={titleId}
      data-slot="foundation-section"
      {...themeScopeProps(theme.id, undefined, "grid min-w-0 scroll-mt-24 gap-10 border-t pt-10")}
    >
      <header className="grid gap-5 @narrow:grid-cols-2 @narrow:items-start @narrow:gap-10">
        <div className="grid gap-3">
          <h2 id={titleId} className="text-h2 text-foreground">
            {theme.name}
          </h2>
          <Code className="text-muted-foreground">data-theme=&quot;{theme.id}&quot;</Code>
        </div>
        <div className="grid gap-5 @narrow:justify-items-start">
          <p className="max-w-prose text-body text-copy">{theme.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeActions theme={theme.id} name={theme.name} />
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={withLook("/live", { theme: theme.id })} target="_blank" rel="noopener" />}
            >
              Preview templates
              <ArrowUpRightIcon data-icon="inline-end" />
              <span className="sr-only">(opens in a new tab)</span>
            </Button>
          </div>
        </div>
      </header>
      <Compositions theme={theme} />
      <ThemeDetails theme={theme} />
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Make your own theme                                                       */
/* ------------------------------------------------------------------------ */

const themeFile = `{
  "$description": "A blue accent on ink neutrals, rounded-square buttons and Manrope.",
  "$extensions": {
    "blocks": {
      "theme": { "name": "Harbor", "order": 5, "modes": ["light", "dark"] }
    }
  },
  "theme": {
    "accent": {
      "50": { "$value": "{color.blue.50}" },
      "100": { "$value": "{color.blue.100}" },
      "200": { "$value": "{color.blue.200}" },
      "300": { "$value": "{color.blue.300}" },
      "400": { "$value": "{color.blue.400}" },
      "500": { "$value": "{color.blue.500}" },
      "600": { "$value": "{color.blue.600}" },
      "700": { "$value": "{color.blue.700}" },
      "800": { "$value": "{color.blue.800}" },
      "900": { "$value": "{color.blue.900}" },
      "950": { "$value": "{color.blue.950}" },
      "dim": { "$value": "{color.blue.dim}" }
    }
  },
  "component": {
    "button": { "radius": { "$value": "{radius.md}" } },
    "badge": { "radius": { "$value": "{radius.sm}" } }
  },
  "font": {
    "family": {
      "sans": {
        "$value": [
          "var(--font-manrope)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        "$extensions": { "blocks": { "name": "Manrope" } }
      }
    }
  },
  "type": {
    "h1": { "$value": { "letterSpacing": "-0.038em" } },
    "h2": { "$value": { "letterSpacing": "-0.035em" } }
  },
  "light": {
    "color": { "ring": { "$value": "{theme.accent.700}" } }
  }
}
`

const scopeCode = `// Any element. The theme applies to its subtree;
// the mode comes from the nearest .dark or .light.
<section data-theme="ocean" className="dark bg-background text-copy">
  …
</section>

// In React, from server or client components
import { ThemeScope } from "@/lib/theme-scope"
import { PortalScope } from "@/lib/portal-container"

<ThemeScope theme="forest" mode="light" className="bg-background">
  {/* Menus and dialogs opened in here use Forest, light */}
  <PortalScope theme="forest" className="light">…</PortalScope>
</ThemeScope>
`

/* The terminal surface sits close to the dark canvas, so a hairline keeps its edge in dark mode. */
const codeFrame = "rounded-(--card-radius) border"

const commands = `npm run tokens
npm run contrast
npm run contrast -- --all
`

const settable: { keys: string[]; sets: string }[] = [
  {
    keys: ["theme.accent.50 … 950", "dim"],
    sets: "The accent scale that links, focus, the brand button and highlights read. Point each step at a fixed scale, such as {color.blue.600}, or give it an OKLCH value.",
  },
  { keys: ["theme.neutral.0 … 1000"], sets: "The neutral scale, and with it the tint of every surface, line and text colour." },
  { keys: ["radius.xs … 4xl"], sets: "The radius scale. Component radii that point at it follow." },
  {
    keys: ["component.button.radius", "component.badge.radius", "component.kern.pull", "component.link.decoration-line"],
    sets: "Component tokens: the button and badge shape, how far display headings pull in punctuation for the font, and whether links underline at rest.",
  },
  { keys: ["font.family.sans", "font.family.mono"], sets: "Font stacks, with the family's name in $extensions.blocks.name." },
  { keys: ["type.<role>"], sets: "Tracking only: { \"letterSpacing\": … }, where a font needs it." },
  { keys: ["light.color.*", "dark.color.*"], sets: "One semantic colour in one mode, such as Mono's ink accent." },
]

const previewLinks: { label: string; href: string }[] = [
  { label: "Home in Ember, dark", href: withLook("/live", { theme: "ember", mode: "dark" }) },
  { label: "Dashboard in Forest, light", href: withLook("/live/app", { theme: "forest", mode: "light" }) },
  { label: "Colour in Mono", href: withLook("/foundations/colors", { theme: "mono" }) },
]

/*
 * The pairs of the gate that come closest to failing, per theme and mode,
 * computed from the token values. A column with several pairs shows the
 * lowest.
 */
const gatePairs: { pairs: [text: string, surface: string][]; label: string; min: number }[] = [
  { pairs: [["--muted-foreground", "--muted"]], label: "Meta on muted", min: 4.5 },
  { pairs: [["--brand", "--background"]], label: "Accent text", min: 4.5 },
  { pairs: [["--panel-brand", "--panel-raised"]], label: "Accent on panels", min: 4.5 },
  {
    pairs: (["destructive", "success", "warning", "info"] as const).map((s) => [`--${s}`, `--${s}-subtle`]),
    label: "Status on its fill",
    min: 4.5,
  },
  { pairs: [["--ring", "--background"]], label: "Focus ring", min: 3 },
]

function GateRatio({ ratio, min }: { ratio: number | null; min: number }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const pass = ratio >= min
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-mono text-xs text-foreground tabular">{formatRatio(ratio)}</span>
      {pass ? (
        <span className="text-caption text-muted-foreground">{min === 3 ? "3:1" : wcagLevel(ratio)}</span>
      ) : (
        <Badge variant="destructive">Fail</Badge>
      )}
    </span>
  )
}

function ContrastGate() {
  const canvas = tokenByVar("--background")
  const rows = themes.flatMap((theme) =>
    modes.map(({ mode, label }) => {
      const base = canvas ? themeValues(canvas, theme.id)[mode] : ""
      return {
        key: `${theme.id}-${mode}`,
        theme,
        mode,
        label,
        ratios: gatePairs.map((column) => {
          const ratios = column.pairs.flatMap(([textVar, surfaceVar]) => {
            const text = tokenByVar(textVar)
            const surface = tokenByVar(surfaceVar)
            const ratio =
              text && surface
                ? textContrast(themeValues(text, theme.id)[mode], themeValues(surface, theme.id)[mode], base)
                : null
            return ratio === null ? [] : [ratio]
          })
          return ratios.length ? Math.min(...ratios) : null
        }),
      }
    })
  )
  const th = "h-(--table-row-height-sm) px-4 text-left align-middle text-caption font-semibold text-muted-foreground"
  return (
    <div className="overflow-x-auto rounded-(--card-radius) border">
      <table className="w-full min-w-xl border-collapse">
        <caption className="sr-only">Contrast of the tightest pairs in every theme and mode</caption>
        <thead className="bg-subtle">
          <tr>
            <th scope="col" className={th}>
              Theme
            </th>
            {gatePairs.map((pair) => (
              <th key={pair.label} scope="col" className={th}>
                {pair.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t">
              <th scope="row" className="h-(--table-row-height-sm) px-4 text-left align-middle font-normal">
                <span className="flex items-center gap-2.5">
                  <ScopedChip cssVar="--brand" theme={row.theme.id} mode={row.mode} className="size-4" />
                  <span className="text-label text-foreground">{row.theme.name}</span>
                  <span className="text-caption text-muted-foreground">{row.label}</span>
                </span>
              </th>
              {row.ratios.map((ratio, i) => (
                <td key={gatePairs[i].label} className="px-4 align-middle">
                  <GateRatio ratio={ratio} min={gatePairs[i].min} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MakeYourOwn() {
  return (
    <div className="grid gap-16">
      <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <SubHeading>The theme file</SubHeading>
            <p className="text-body text-copy">
              Add <Code>design-system/themes/&lt;id&gt;.tokens.json</Code>. It holds only what it changes, plus a
              description and its name, order and modes. Everything else stays as the default theme has it.
            </p>
          </div>
          <ul className="grid border-b">
            {settable.map((row) => (
              <li key={row.keys.join()} className="grid gap-1 border-t py-3.5">
                <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {row.keys.map((key) => (
                    <code key={key} className="font-mono text-code whitespace-nowrap text-foreground">
                      {key}
                    </code>
                  ))}
                </span>
                <span className="text-caption text-copy">{row.sets}</span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-copy">
            A theme never changes spacing, sizes, type sizes or weights, motion, or what the status colours mean. Tokens
            with breakpoint values cannot be themed. The build stops with an error on anything else. A new scale goes
            in <Code>primitives.tokens.json</Code>: <Code>node scripts/color-scale.mjs accent 250 0.18</Code> prints one
            built like the others. A new font loads with <Code>next/font/google</Code> in <Code>app/layout.tsx</Code>,
            with a <Code>variable</Code> and <Code>preload: false</Code>, and the theme names that variable.
          </p>
        </div>
        <div className="grid min-w-0 gap-3">
          <Meta>design-system/themes/harbor.tokens.json</Meta>
          <CodeBlock code={themeFile} className={codeFrame} />
        </div>
      </div>

      <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <SubHeading>Scope it</SubHeading>
            <p className="text-body text-copy">
              <Code>data-theme=&quot;&lt;id&gt;&quot;</Code> on any element gives its subtree that theme, the way{" "}
              <Code>.dark</Code> and <Code>.light</Code> give it a mode. No attribute means Blocks. Scopes nest in any
              order: each element takes the nearest theme and the nearest mode.
            </p>
          </div>
          <div className="grid gap-2">
            <SubHeading>Preview it</SubHeading>
            <p className="text-body text-copy">
              <Code>?theme=&lt;id&gt;</Code> forces a theme for one page and <Code>&amp;mode=dark</Code> or{" "}
              <Code>light</Code> forces the mode. Neither is saved, so links and screenshots never change anyone&apos;s
              choice.
            </p>
            <ul className="grid gap-1.5 pt-1">
              {previewLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-label text-brand link-underline outline-none focus-visible:focus-ring"
                  >
                    {link.label}
                  </Link>{" "}
                  <Meta>{link.href}</Meta>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <CodeBlock code={scopeCode} className={cn("min-w-0", codeFrame)} />
      </div>

      <div className="grid gap-8">
        <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
          <div className="grid gap-2">
            <SubHeading>Pass the contrast gate</SubHeading>
            <p className="text-body text-copy">
              <Code>npm run tokens</Code> compiles every theme into the CSS and the typed token list.{" "}
              <Code>npm run contrast</Code> then checks every theme in light and dark against WCAG AA: 4.5:1 for text,
              links and status colours on the surfaces they sit on, 3:1 for the focus ring. Lines are not gated: they are hairlines by design. Add{" "}
              <Code>-- --all</Code> to print every ratio. <Code>npm run check</Code> runs both, and a failing pair stops
              it, so a theme that ships is readable. The table shows the pairs that come closest.
            </p>
          </div>
          <CodeBlock code={commands} className={cn("min-w-0", codeFrame)} />
        </div>
        <ContrastGate />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function ThemesFoundation({ title, description }: { title: string; description: string }) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="presets"
        title="Presets"
        description="A theme sets the accent, the neutrals' tint, the radius scale and the fonts. Appearance, light or dark, is separate: every theme works in both. The theme you choose is saved in this browser and applies to the viewer and the templates."
      >
        <PresetRail />
      </Section>

      {themes.map((theme) => (
        <ThemeSection key={theme.id} theme={theme} />
      ))}

      <Section
        id="make-your-own"
        title="Make your own theme"
        description="A theme is one token file. The build turns it into a data-theme scope, adds it to the Theme picker and the ?theme= parameter, and checks its contrast."
      >
        <MakeYourOwn />
      </Section>
    </FoundationPage>
  )
}
