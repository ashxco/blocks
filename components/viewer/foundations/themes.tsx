import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/viewer/code-block"
import { withLook, type ThemeMode } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { formatRatio, textContrast, wcagLevel } from "./color"
import {
  aliasHue,
  aliasScaleLabel,
  describeSize,
  themes,
  themeValues,
  tokenByVar,
  type ScaleRole,
  type Theme,
} from "./data"
import { Code, FoundationPage, Meta, ScopedChip, Section, SubHeading } from "./layout"
import { rampFill, rampSteps } from "./scale-fill"
import { ThemeActions } from "./theme-actions"
import { ThemeCompare } from "./theme-compare"
import { ThemeStage, type StageItem } from "./theme-stage"

/*
 * Every preview on this page is scoped with data-theme (and .light / .dark
 * for the mode), so it shows that theme whatever the site is on. Only the
 * "Current" and "Current theme" marks follow the site's own theme.
 *
 * - The stage (theme-stage.tsx): one theme at a time, large, as a live
 *   project page of real components (tabs, a card with a chart, an input, a
 *   select, a table, every button variant, badges and a dark panel), with
 *   its description, actions, scales, shapes and faces under it.
 * - Side by side: the comparison strip (theme-compare.tsx), the same small
 *   composition in all five themes.
 * - Make your own: the theme file, scoping, previewing and the two gates.
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
/* One theme: a live composition in light and dark, then its tokens          */
/* ------------------------------------------------------------------------ */

const projects = [
  { name: "Website relaunch", open: 42 },
  { name: "Mobile app 2.0", open: 31 },
  { name: "Brand refresh", open: 24 },
  { name: "Help center", open: 16 },
  { name: "Q4 planning", open: 9 },
]

/* Literal class names so Tailwind generates every series. */
const seriesFill = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
const people = [
  { initials: "MP", fill: "bg-tint-violet" },
  { initials: "SA", fill: "bg-tint-mint" },
  { initials: "JL", fill: "bg-tint-sand" },
]

const priorities = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const tasks: { title: string; owner: string; status: string; tone: "success" | "info" | "warning" }[] = [
  { title: "Write the homepage hero copy", owner: "Priya Raman", status: "Done", tone: "success" },
  { title: "Review the pricing page", owner: "Maya Patel", status: "In progress", tone: "info" },
  { title: "Choose the new icon set", owner: "Sofia Alvarez", status: "At risk", tone: "warning" },
]

/** The bar chart card: open tasks per project in the chart series. */
function ChartCard() {
  const max = Math.max(...projects.map((p) => p.open))
  return (
    <figure className="grid gap-4 rounded-(--card-radius) border bg-card p-(--card-padding) text-card-foreground">
      <figcaption className="flex items-start justify-between gap-3">
        <span className="grid gap-0.5">
          <span className="text-h4 text-foreground">Open tasks by project</span>
          <span className="text-caption text-muted-foreground">122 open across 5 projects</span>
        </span>
        <Badge variant="brand">3 new</Badge>
      </figcaption>
      <ul className="grid gap-2">
        {projects.map((p, i) => (
          <li key={p.name} className="grid grid-cols-[7.5rem_minmax(0,1fr)_1.75rem] items-center gap-3">
            <span className="truncate text-caption text-copy">{p.name}</span>
            <span aria-hidden className="block h-2.5 overflow-hidden rounded-xs bg-muted">
              <span className={cn("block h-full rounded-xs", seriesFill[i])} style={{ width: `${(p.open / max) * 100}%` }} />
            </span>
            <span className="text-right font-mono text-xs text-foreground tabular">{p.open}</span>
          </li>
        ))}
      </ul>
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
          View All Tasks
        </Button>
      </div>
    </figure>
  )
}

/**
 * Real components on the theme's tokens, as a project page: tabs over a
 * card with a chart, an input and a select, a table, every button variant,
 * the badges and a dark panel. `label` names the copy ("Ember, dark") so
 * every control on the page has its own accessible name.
 */
function Composition({ label }: { label: string }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <p className="text-h3 text-foreground">Website relaunch</p>
          <p className="text-caption text-muted-foreground">Marketing · 12 of 18 tasks done · Due Nov 14</p>
        </div>
        <Badge variant="success">On track</Badge>
      </div>

      <Tabs defaultValue="overview" className="gap-5">
        <TabsList aria-label={`Project views (${label})`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ChartCard />
        </TabsContent>
        <TabsContent value="board" className="text-caption">
          18 tasks in four columns: To do, In progress, In review and Done.
        </TabsContent>
        <TabsContent value="timeline" className="text-caption">
          Six milestones from Sep 1 to the launch on Nov 14.
        </TabsContent>
      </Tabs>

      <div className="grid gap-2 @md:grid-cols-[minmax(0,1fr)_8.5rem_auto]">
        <Input aria-label={`New task (${label})`} placeholder="Add a task" />
        <Select items={priorities} defaultValue="high">
          <SelectTrigger aria-label={`Priority (${label})`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button">Add Task</Button>
      </div>

      {/* On a phone the owner moves under the task and a long title wraps, so Status stays in view. */}
      <Table variant="card" size="sm" aria-label={`Tasks (${label})`}>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden @md:table-cell">Owner</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.title}>
              <TableCell className="py-2.5 font-semibold text-pretty whitespace-normal">
                {task.title}
                <span className="block text-caption font-normal text-muted-foreground @md:hidden">{task.owner}</span>
              </TableCell>
              <TableCell className="hidden text-copy @md:table-cell">{task.owner}</TableCell>
              <TableCell>
                <Badge variant={task.tone}>{task.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button">Create Project</Button>
        <Button type="button" variant="brand">
          Start Free Trial
        </Button>
        <Button type="button" variant="secondary">
          Duplicate
        </Button>
        <Button type="button" variant="outline">
          Share
        </Button>
        <Button type="button" variant="ghost">
          Archive
        </Button>
        <Button type="button" variant="destructive">
          Delete
        </Button>
        <Button type="button" variant="link">
          View Report
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="success">On track</Badge>
        <Badge variant="warning">At risk</Badge>
        <Badge variant="destructive">Off track</Badge>
        <Badge variant="brand">3 new</Badge>
        <Badge variant="secondary">Paused</Badge>
        <Badge variant="outline">Guest</Badge>
        <Badge>Owner</Badge>
      </div>

      <div className="grid gap-4 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground">
        <p className="text-h4 text-panel-foreground">Ship the relaunch on time</p>
        <p className="text-body text-panel-muted">
          <span className="font-semibold text-panel-brand">92%</span> of tasks closed on schedule this month.
        </p>
        <ul className="grid gap-1.5 text-caption text-panel-muted">
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-2 rounded-full bg-panel-success" />
            Homepage copy approved
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-2 rounded-full bg-panel-warning" />
            Pricing review due Friday
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="inverse" size="sm">
            Invite Team
          </Button>
          <Button type="button" variant="outline-inverse" size="sm">
            View Report
          </Button>
        </div>
      </div>
    </>
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
    </div>
  )
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
        <p className="text-body text-copy">Give each task an owner and a due date.</p>
        <Meta>{theme.fonts.sans}</Meta>
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

/** Under the stage: what the theme is, its id, and the actions to use or preview it. */
function ThemeSummary({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @narrow:items-end @narrow:gap-10">
      <p className="max-w-prose text-lead text-copy">{theme.description}</p>
      <div className="flex flex-wrap items-center gap-3 @narrow:justify-end">
        <ThemeActions theme={theme.id} name={theme.name} />
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={withLook("/components", { theme: theme.id })} target="_blank" rel="noopener" />}
        >
          Preview Components
          <ArrowUpRightIcon data-icon="inline-end" />
          <span className="sr-only">(Opens in a New Tab)</span>
        </Button>
      </div>
    </div>
  )
}

const stageItems: StageItem[] = themes.map((theme) => ({
  id: theme.id,
  name: theme.name,
  composition: <Composition label={theme.name} />,
  summary: <ThemeSummary theme={theme} />,
  details: <ThemeDetails theme={theme} />,
}))

/* ------------------------------------------------------------------------ */
/* Make your own theme                                                       */
/* ------------------------------------------------------------------------ */

const themeFile = `{
  "$description": "A fuchsia accent on ink, 8px buttons, 12px cards, Space Grotesk headings over Inter.",
  "$extensions": {
    "blocks": {
      "theme": { "name": "Orchid", "order": 5, "modes": ["light", "dark"] }
    }
  },
  "theme": {
    "accent": {
      "50": { "$value": "{color.fuchsia.50}" },
      "100": { "$value": "{color.fuchsia.100}" },
      "200": { "$value": "{color.fuchsia.200}" },
      "300": { "$value": "{color.fuchsia.300}" },
      "400": { "$value": "{color.fuchsia.400}" },
      "500": { "$value": "{color.fuchsia.500}" },
      "600": { "$value": "{color.fuchsia.600}" },
      "700": { "$value": "{color.fuchsia.700}" },
      "800": { "$value": "{color.fuchsia.800}" },
      "900": { "$value": "{color.fuchsia.900}" },
      "950": { "$value": "{color.fuchsia.950}" },
      "dim": { "$value": "{color.fuchsia.dim}" }
    }
  },
  "component": {
    "button": { "radius": { "$value": "{radius.sm}" } },
    "card": { "radius": { "$value": "{radius.md}" } },
    "badge": { "radius": { "$value": "{radius.xs}" } }
  },
  "font": {
    "family": {
      "heading": {
        "$value": [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        "$extensions": { "blocks": { "name": "Space Grotesk" } }
      },
      "sans": {
        "$value": [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        "$extensions": { "blocks": { "name": "Inter" } }
      }
    }
  },
  "type": {
    "h1": { "$value": { "letterSpacing": "-0.03em" } },
    "h2": { "$value": { "letterSpacing": "-0.028em" } }
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
npm run themes
`

const settable: { keys: string[]; sets: string }[] = [
  {
    keys: ["theme.accent.50 … 950", "dim"],
    sets: "The accent scale that links, focus, the brand button and highlights read. Point each step at a fixed scale, such as {color.cobalt.600}, or give it an OKLCH value.",
  },
  { keys: ["theme.neutral.0 … 1000"], sets: "The neutral scale, and with it the tint of every surface, line and text colour." },
  {
    keys: ["radius.xs … 4xl"],
    sets: "The radius scale. Component radii that point at it follow: controls at md, cards at lg, dialogs at xl, panels at 2xl.",
  },
  {
    keys: [
      "component.button.radius",
      "component.button.radius-sm",
      "component.card.radius",
      "component.badge.radius",
      "component.kern.pull",
      "component.link.decoration-line",
    ],
    sets: "Component tokens: a shape of its own for buttons, cards or badges, how far display headings pull in punctuation for the font, and whether links underline at rest.",
  },
  {
    keys: ["font.family.sans", "font.family.heading", "font.family.mono"],
    sets: "Font stacks, with the family's name in $extensions.blocks.name and its genre (geometric, neo-grotesque, grotesque, humanist, serif or mono) in $extensions.blocks.genre. The heading face follows the sans face unless the theme gives it one, such as Forest's grotesque, Ember's serif or Mono's monospace.",
  },
  { keys: ["type.<role>"], sets: "Tracking only: { \"letterSpacing\": … }, where a font needs it." },
  { keys: ["light.color.*", "dark.color.*"], sets: "One semantic colour in one mode, such as Mono's ink accent." },
]

const previewLinks: { label: string; href: string }[] = [
  { label: "Components in Ember, dark", href: withLook("/components", { theme: "ember", mode: "dark" }) },
  { label: "Dialog in Forest, light", href: withLook("/components/dialog", { theme: "forest", mode: "light" }) },
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
  {
    pairs: [
      ["--ring", "--background"],
      ["--ring", "--panel"],
      ["--ring", "--panel-raised"],
    ],
    label: "Focus ring",
    min: 3,
  },
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
            in <Code>primitives.tokens.json</Code>: <Code>node scripts/color-scale.mjs accent 330 0.2</Code> prints one
            built like the others, such as the fuchsia scale the example points at. A new font loads with <Code>next/font/google</Code> in <Code>app/layout.tsx</Code>,
            with a <Code>variable</Code> and <Code>preload: false</Code>, and the theme names that variable.
          </p>
        </div>
        <div className="grid min-w-0 gap-3">
          <Meta>design-system/themes/orchid.tokens.json</Meta>
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
            <SubHeading>Pass the gates</SubHeading>
            <p className="text-body text-copy">
              <Code>npm run tokens</Code> compiles every theme into the CSS and the typed token list.{" "}
              <Code>npm run contrast</Code> then checks every theme in light and dark against WCAG AA: 4.5:1 for text,
              links and status colours on the surfaces they sit on, 3:1 for the focus ring on the canvas and on panels
              and for every chart series, and 4.5:1 for the syntax colours of code blocks on the terminal. Lines are
              not gated: they are hairlines by design. Add <Code>-- --all</Code> to print every ratio.
            </p>
            <p className="text-body text-copy">
              <Code>npm run themes</Code> checks that the theme is an identity of its own, not a recolour: against every
              other theme it has to differ on at least four of six traits, the accent hue, the neutrals&apos; tint, the
              button shape, the card radius, and the kind of heading face and of text face. Faces compare by genre, so
              two geometric sans count as alike. It prints each theme&apos;s traits and what every pair shares. <Code>npm run check</Code> runs all three, and a failure stops it. The table shows
              the contrast pairs that come closest.
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
      <ThemeStage items={stageItems} />

      <Section
        id="side-by-side"
        title="Side by side"
        description="The same composition in all five themes."
      >
        <ThemeCompare />
      </Section>

      <Section
        id="make-your-own"
        title="Make your own theme"
        description="A theme is one token file. The build turns it into a data-theme scope and adds it to the Theme picker and the ?theme= parameter. Two gates check it: its contrast, and that it stands apart from every other theme."
      >
        <MakeYourOwn />
      </Section>
    </FoundationPage>
  )
}
