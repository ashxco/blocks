import * as React from "react"
import { EllipsisIcon, RocketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  describeSize,
  leafName,
  refLabel,
  tokenByName,
  tokenByVar,
  tokens,
  tokensIn,
  utilityFor,
  type DesignToken,
} from "./data"
import { Code, FoundationPage, Meta, Section, SubHeading } from "./layout"

function usedBy(t: DesignToken) {
  return tokens.filter((c) => c.tier === "component" && c.ref === t.name).map((c) => c.cssVar)
}

/* ------------------------------------------------------------------------ */
/* Radius: each step on the element it is made for, at true size             */
/* ------------------------------------------------------------------------ */

/* Large surfaces run off the bottom of the stage, so only their top corners show, at 1:1. */
const cropped = "absolute inset-x-4 top-4 h-48 @prose:inset-x-6 @prose:top-6"

/*
 * Literal class names so Tailwind generates every radius. Stages are subtle,
 * except where the sample is a card: in dark mode subtle and card are the
 * same colour, so a card sits on muted instead.
 */
const radiusDemo: Record<string, { label: string; demo: React.ReactNode; stage?: string }> = {
  xs: {
    label: "Keyboard keys",
    demo: (
      <span className="flex gap-1.5">
        {["⌘", "K"].map((key) => (
          <span
            key={key}
            className="grid h-8 min-w-8 place-items-center rounded-xs border border-border-strong bg-background px-2 text-label text-foreground"
          >
            {key}
          </span>
        ))}
      </span>
    ),
  },
  sm: {
    label: "Menu items",
    demo: (
      <span className="grid w-full max-w-48 rounded-md border bg-popover p-1">
        <span className="flex h-8 items-center rounded-sm bg-accent px-2.5 text-label text-accent-foreground">
          Redeploy
        </span>
        <span className="flex h-8 items-center rounded-sm px-2.5 text-label text-popover-foreground">View logs</span>
      </span>
    ),
  },
  md: {
    label: "Inputs and menus",
    stage: "bg-card",
    demo: (
      <span className="flex h-(--control-height-md) w-full max-w-56 items-center rounded-md border border-input bg-muted px-(--control-padding-x) text-body text-muted-foreground">
        lumen-web
      </span>
    ),
  },
  lg: {
    label: "Cards",
    stage: "bg-muted",
    demo: (
      <span className="grid w-full max-w-60 gap-0.5 rounded-lg border bg-card p-4">
        <span className="text-title text-foreground">lumen-web</span>
        <span className="text-caption text-muted-foreground">Ready · 2m ago</span>
      </span>
    ),
  },
  xl: {
    label: "Dialogs",
    demo: (
      <span className={`${cropped} grid content-start gap-1 rounded-xl border bg-popover p-4 @prose:p-5`}>
        <span className="text-label text-popover-foreground @prose:text-title">Delete project?</span>
        <span className="text-caption text-muted-foreground">This removes 14 deployments.</span>
      </span>
    ),
  },
  "2xl": {
    label: "Panels",
    demo: (
      <span className={`${cropped} grid content-start rounded-2xl bg-panel p-4 @prose:p-6`}>
        <span className="text-label text-panel-foreground @prose:text-h4">Ship on every push</span>
      </span>
    ),
  },
  "3xl": { label: "Hero media", demo: <span className={`${cropped} rounded-3xl bg-tint-sky`} /> },
  "4xl": { label: "Large media frames", demo: <span className={`${cropped} rounded-4xl bg-tint-violet`} /> },
  full: {
    label: "Buttons and avatars",
    demo: (
      <span className="flex items-center gap-3">
        <Button type="button" tabIndex={-1}>
          <RocketIcon data-icon="inline-start" />
          Deploy
        </Button>
        <span className="hidden size-(--avatar-size-md) place-items-center rounded-full bg-tint-mint text-caption font-semibold text-foreground @prose:grid">
          PS
        </span>
      </span>
    ),
  },
}

function RadiusTile({ token }: { token: DesignToken }) {
  const name = leafName(token.name)
  const users = usedBy(token)
  const demo = radiusDemo[name]
  return (
    <li className="grid content-start gap-4">
      <div
        aria-hidden
        className={`relative grid h-32 place-items-center overflow-hidden rounded-(--card-radius) border p-4 @prose:h-36 @prose:p-6 ${demo?.stage ?? "bg-muted"}`}
      >
        {demo?.demo}
      </div>
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3 className="text-title text-foreground">{name}</h3>
          <Meta>{describeSize(token.value)}</Meta>
        </div>
        <Code className="text-muted-foreground">{token.utility ?? `rounded-${name}`}</Code>
        <p className="text-caption text-copy">{token.description ?? demo?.label}</p>
        {users.length ? (
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-caption text-muted-foreground">
            Used by
            {users.map((u) => (
              <code key={u} className="font-mono text-xs whitespace-nowrap text-foreground">
                {u}
              </code>
            ))}
          </p>
        ) : null}
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------------ */
/* Borders                                                                   */
/* ------------------------------------------------------------------------ */

/* What each width is for, drawn with the utility people should write. Literal class names so Tailwind generates them. */
const widthDemo: Record<string, { label: string; className: string }> = {
  "border.hairline": { label: "Card outline", className: "border border-border" },
  "border.strong": { label: "Selected card", className: "border-(length:--border-width-strong) border-foreground" },
}

function BorderWidths() {
  const widths = tokensIn("layout", "border-width")
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {widths.map((w) => {
        const demo = widthDemo[w.name]
        return (
          <li key={w.name} className="grid content-start gap-5">
            <div aria-hidden className="grid h-36 place-items-center rounded-(--card-radius) bg-muted p-6">
              <span
                className={`flex h-16 w-full max-w-64 items-center gap-3 rounded-lg bg-background px-4 ${demo?.className ?? "border"}`}
              >
                <span className="size-6 shrink-0 rounded-full bg-tint-violet" />
                <span className="text-label text-foreground">{demo?.label ?? leafName(w.name)}</span>
              </span>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="text-title text-foreground">{leafName(w.name)}</h4>
                <Meta>
                  {String(w.value)} · {w.cssVar}
                </Meta>
              </div>
              <Code className="text-muted-foreground">{utilityFor(w) ?? w.cssVar}</Code>
              {w.description ? <p className="text-caption text-copy">{w.description}</p> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* Each line colour drawn on the element it is made for. The card sits on muted, which stays distinct from bg-card in dark mode. */
const lineDemos: { cssVar: string; demo: React.ReactNode; stage?: string }[] = [
  {
    cssVar: "--border",
    stage: "bg-muted",
    demo: (
      <span className="grid w-full gap-2 rounded-lg border border-border bg-card p-4">
        <span className="h-2 w-2/3 rounded-full bg-muted" />
        <span className="h-2 w-1/2 rounded-full bg-muted" />
      </span>
    ),
  },
  {
    cssVar: "--border-strong",
    demo: (
      <span className="inline-flex h-(--button-height-sm) items-center rounded-(--button-radius) border border-border-strong bg-background px-(--button-padding-x-sm) text-label text-foreground">
        Cancel
      </span>
    ),
  },
  {
    cssVar: "--input",
    stage: "bg-card",
    demo: (
      <span className="flex h-(--control-height-sm) w-full items-center rounded-(--control-radius) border border-input bg-muted px-(--control-padding-x) text-body text-muted-foreground">
        lumen-web
      </span>
    ),
  },
]

function BorderColors() {
  const panelBorder = tokenByVar("--panel-border")
  const tile = "grid h-32 place-items-center rounded-(--card-radius) p-5"
  return (
    <ul className="grid gap-x-6 gap-y-10 @prose:grid-cols-2 @narrow:grid-cols-4">
      {lineDemos.map(({ cssVar, demo, stage }) => {
        const t = tokenByVar(cssVar)
        if (!t) return null
        return (
          <li key={cssVar} className="grid content-start gap-4">
            <span aria-hidden className={`${tile} ${stage ?? "bg-muted"}`}>
              {demo}
            </span>
            <div className="grid gap-1">
              <h4 className="text-title text-foreground">{cssVar.slice(2)}</h4>
              <Code className="text-muted-foreground">border-{cssVar.slice(2)}</Code>
              {t.description ? <p className="text-caption text-copy">{t.description}</p> : null}
            </div>
          </li>
        )
      })}
      {panelBorder ? (
        <li className="grid content-start gap-4">
          <span aria-hidden className={`${tile} bg-panel`}>
            <span className="grid w-full gap-2 rounded-lg border border-panel-border bg-panel-raised p-4">
              <span className="h-2 w-2/3 rounded-full bg-panel-foreground/20" />
              <span className="h-2 w-1/2 rounded-full bg-panel-foreground/20" />
            </span>
          </span>
          <div className="grid gap-1">
            <h4 className="text-title text-foreground">panel-border</h4>
            <Code className="text-muted-foreground">border-panel-border</Code>
            {panelBorder.description ? <p className="text-caption text-copy">{panelBorder.description}</p> : null}
          </div>
        </li>
      ) : null}
    </ul>
  )
}

/* ------------------------------------------------------------------------ */
/* Focus                                                                     */
/* ------------------------------------------------------------------------ */

function Focus() {
  const width = tokenByName("focus.width")
  const offset = tokenByName("focus.offset")
  const ring = tokens.find((t) => t.cssVar === "--ring")
  return (
    <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="grid content-center justify-items-start gap-8 rounded-(--panel-radius) border bg-subtle p-(--panel-padding-sm)">
        <div className="flex flex-wrap items-center gap-6">
          <span className="focus-ring inline-flex h-(--button-height-md) items-center rounded-(--button-radius) bg-primary px-(--button-padding-x-md) text-label text-primary-foreground">
            Deploy
          </span>
          <span className="focus-ring flex h-(--control-height-md) w-56 max-w-full items-center rounded-(--control-radius) border border-ring bg-muted px-(--control-padding-x) text-body text-foreground">
            lumen-web
          </span>
        </div>
        <div className="grid gap-3">
          <p className="text-caption text-muted-foreground">Try it: press Tab to move through these buttons.</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="sm">
              Redeploy
            </Button>
            <Button type="button" variant="secondary" size="sm">
              View logs
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Open preview
            </Button>
          </div>
        </div>
      </div>
      <dl className="grid content-start border-b">
        {[
          { label: "Width", token: width, value: String(width?.value ?? "") },
          { label: "Offset", token: offset, value: String(offset?.value ?? "") },
          {
            label: "Colour",
            token: ring,
            value: [refLabel(ring?.ref), refLabel(ring?.dark?.ref)].filter(Boolean).join(" · "),
          },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4">
            <dt className="text-label text-foreground">{row.label}</dt>
            <dd className="grid gap-0.5">
              <Code>{row.token?.cssVar}</Code>
              <Meta>{row.value}</Meta>
            </dd>
          </div>
        ))}
        <div className="border-t py-4">
          <p className="text-caption text-copy">
            Apply it with <Code>focus-visible:focus-ring</Code>. It shows for keyboard focus only, never as a glow.
          </p>
        </div>
      </dl>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Depth                                                                     */
/* ------------------------------------------------------------------------ */

const layers: { name: string; body: string; tokens: string[] }[] = [
  {
    name: "Hairlines",
    body: "A 1px border defines every edge: cards, inputs, tables and menus.",
    tokens: ["border", "border-border"],
  },
  {
    name: "Surfaces",
    body: "Tinted bands and fills separate regions without lifting them off the page.",
    tokens: ["bg-subtle", "bg-muted", "bg-card"],
  },
  {
    name: "Panels",
    body: "Dark panels carry emphasis. Inside them, raised tiles step one shade lighter.",
    tokens: ["bg-panel", "bg-panel-raised"],
  },
  {
    name: "Overlays",
    body: "Menus and dialogs sit on bg-popover with a border. Backdrops dim with the overlay colour.",
    tokens: ["bg-popover", "bg-overlay"],
  },
]

const deploys: { env: string; branch: string; status: string }[] = [
  { env: "Production", branch: "main", status: "Ready" },
  { env: "Preview", branch: "fix-cache", status: "Ready" },
  { env: "Preview", branch: "docs-nav", status: "Building" },
  { env: "Preview", branch: "edge-config", status: "Ready" },
]

/* Rows the open menu sits over. */
const menuCovers = 2

/* Builds per day, Monday to Sunday. Today is highlighted. */
const week = [62, 78, 54, 91, 70, 38, 84]

function DepthScene() {
  return (
    /* Muted, not subtle: in dark mode subtle is the same colour as the card on it. */
    <div aria-hidden className="grid gap-6 rounded-(--panel-radius) border bg-muted p-(--panel-padding-sm) @narrow:grid-cols-2">
      {/* Card with an open menu on top of it */}
      <div className="relative grid content-start gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-title text-foreground">lumen-web</p>
            <p className="text-caption text-muted-foreground">4 deployments today</p>
          </div>
          <span className="grid size-(--button-height-sm) shrink-0 place-items-center rounded-(--button-radius) bg-accent text-foreground">
            <EllipsisIcon className="size-4" />
          </span>
        </div>
        <ul className="grid border-t">
          {deploys.map((d, i) => (
            <li key={d.branch} className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0 last:pb-0">
              <span className="grid min-w-0">
                <span className="truncate text-label text-foreground">{d.branch}</span>
                <span className="text-caption text-muted-foreground">{d.env}</span>
              </span>
              {/* From @prose the open menu covers the first two rows; their status would peek past its corner. */}
              <span className={i < menuCovers ? "text-caption text-muted-foreground @prose:invisible" : "text-caption text-muted-foreground"}>
                {d.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="absolute top-[calc(var(--card-padding)+var(--button-height-sm)+--spacing(2))] right-(--card-padding) hidden w-max min-w-48 rounded-(--overlay-radius) @prose:grid border bg-popover p-(--overlay-padding)">
          {["Redeploy", "Promote to production", "Roll back"].map((item, i) => (
            <span
              key={item}
              className={
                i === 0
                  ? "flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label whitespace-nowrap text-accent-foreground"
                  : "flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) px-3 text-label whitespace-nowrap text-popover-foreground"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Dark panel with raised tiles */}
      <div className="grid content-start gap-6 rounded-(--card-radius) bg-panel p-(--card-padding) text-panel-foreground">
        <div className="grid gap-1">
          <p className="text-title text-panel-foreground">Deploys this week</p>
          <p className="text-caption text-panel-muted">Across 12 projects</p>
        </div>
        <div className="grid h-24 grid-cols-7 items-end gap-2">
          {week.map((value, i) => (
            <span
              key={i}
              className={i === week.length - 1 ? "rounded-xs bg-panel-brand" : "rounded-xs bg-panel-raised"}
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">477</span>
            <span className="text-caption text-panel-muted">Builds</span>
          </div>
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">41s</span>
            <span className="text-caption text-panel-muted">Median build</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Depth() {
  return (
    <div className="grid gap-10">
      <DepthScene />
      <ul className="grid gap-x-8 gap-y-8 @prose:grid-cols-2 @narrow:grid-cols-4">
        {layers.map((layer) => (
          <li key={layer.name} className="grid content-start gap-2 border-t pt-5">
            <h3 className="text-title text-foreground">{layer.name}</h3>
            <p className="text-caption text-copy">{layer.body}</p>
            <p className="flex flex-wrap gap-x-3 gap-y-1">
              {layer.tokens.map((t) => (
                <Code key={t} className="text-muted-foreground">
                  {t}
                </Code>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function ShapeFoundation({ title, description }: { title: string; description: string }) {
  const radii = tokensIn("layout", "radius")
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="radius"
        title="Corner radius"
        description="Small things get small corners, large surfaces get generous ones. Buttons, badges and avatars are fully round. Components read radius through their own tokens, so a card can change shape without touching the scale."
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 @prose:gap-x-6 @prose:gap-y-12 @narrow:grid-cols-3">
          {radii.map((t) => (
            <RadiusTile key={t.name} token={t} />
          ))}
        </ul>
      </Section>

      <Section
        id="borders"
        title="Borders"
        description="Lines do the work that shadows do elsewhere. Default to the hairline; use the strong width only to mark a selected or emphasised outline."
      >
        <div className="grid gap-12">
          <div className="grid gap-6">
            <SubHeading>Widths</SubHeading>
            <BorderWidths />
          </div>
          <div className="grid gap-6">
            <SubHeading>Colours</SubHeading>
            <BorderColors />
          </div>
        </div>
      </Section>

      <Section
        id="focus"
        title="Focus"
        description="One outline for every focusable element: solid brand violet, offset from the edge so it never hides the control."
      >
        <Focus />
      </Section>

      <Section
        id="depth"
        title="Depth without shadows"
        description="Blocks has no shadows. Hierarchy comes from four tools, used in this order: hairlines, tinted surfaces, dark panels and bordered overlays."
      >
        <Depth />
      </Section>
    </FoundationPage>
  )
}
