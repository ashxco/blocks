import * as React from "react"

import { Button } from "@/components/ui/button"

import { describeSize, leafName, refLabel, tokenByName, tokens, tokensIn, type DesignToken } from "./data"
import { Code, FoundationPage, Meta, Section, SubHeading } from "./layout"

/* Literal class names so Tailwind generates every radius. */
const radiusClass: Record<string, string> = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "4xl": "rounded-4xl",
  full: "rounded-full",
}

function usedBy(t: DesignToken) {
  return tokens.filter((c) => c.tier === "component" && c.ref === t.name).map((c) => c.cssVar)
}

/* ------------------------------------------------------------------------ */
/* Radius                                                                    */
/* ------------------------------------------------------------------------ */

function RadiusTile({ token }: { token: DesignToken }) {
  const name = leafName(token.name)
  const users = usedBy(token)
  return (
    <li className="grid content-start gap-4">
      {/* Only the top-left corner is in frame, drawn at 1:1. */}
      <div aria-hidden className="relative h-36 overflow-hidden rounded-(--card-radius) border bg-subtle">
        <span className={`${radiusClass[name] ?? ""} absolute top-8 left-8 h-56 w-[150%] bg-foreground`} />
      </div>
      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-title">{name}</h3>
          <Meta>{describeSize(token.value)}</Meta>
        </div>
        <Code className="text-muted-foreground">{token.utility ?? `rounded-${name}`}</Code>
        {token.description ? <p className="text-caption text-copy">{token.description}</p> : null}
        {users.length ? (
          <p className="text-caption text-muted-foreground">
            Behind{" "}
            {users.map((u, i) => (
              <React.Fragment key={u}>
                {i > 0 ? ", " : null}
                <code className="font-mono text-xs text-foreground">{u}</code>
              </React.Fragment>
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

function BorderWidths() {
  const widths = tokensIn("layout", "border")
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {widths.map((w) => (
        <li key={w.name} className="grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <span aria-hidden className="flex h-16 items-center">
            <span className="block w-full bg-foreground" style={{ height: String(w.value) }} />
          </span>
          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-title">{leafName(w.name)}</h4>
              <Meta>{String(w.value)}</Meta>
            </div>
            <Code className="text-muted-foreground">{w.cssVar}</Code>
            {w.description ? <p className="text-caption text-copy">{w.description}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

const lineRoles = ["--border", "--border-strong", "--input"]

function BorderColors() {
  const roles = lineRoles.map((v) => tokens.find((t) => t.cssVar === v && t.type === "color")).filter(Boolean) as DesignToken[]
  const panelBorder = tokens.find((t) => t.cssVar === "--panel-border")
  return (
    <ul className="grid gap-6 @prose:grid-cols-2 @narrow:grid-cols-4">
      {roles.map((t) => (
        <li key={t.cssVar} className="grid content-start gap-4">
          <span
            aria-hidden
            className="block h-24 rounded-(--card-radius) border bg-background"
            style={{ borderColor: `var(${t.cssVar})` }}
          />
          <div className="grid gap-1">
            <h4 className="text-title">{t.cssVar.slice(2)}</h4>
            <Code className="text-muted-foreground">border-{t.cssVar.slice(2)}</Code>
            {t.description ? <p className="text-caption text-copy">{t.description}</p> : null}
          </div>
        </li>
      ))}
      {panelBorder ? (
        <li className="grid content-start gap-4">
          <span aria-hidden className="grid h-24 place-items-center rounded-(--card-radius) bg-panel p-4">
            <span className="block size-full rounded-md border border-panel-border" />
          </span>
          <div className="grid gap-1">
            <h4 className="text-title">panel-border</h4>
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
      <div className="grid content-center justify-items-start gap-8 rounded-(--panel-radius) border bg-subtle p-8 @prose:p-12">
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

function DepthScene() {
  return (
    <div className="grid gap-6 rounded-(--panel-radius) border bg-subtle p-5 @prose:p-10 @narrow:grid-cols-2">
      <div className="relative grid min-h-72 content-start gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <div className="grid gap-1">
          <p className="text-title text-foreground">lumen-web</p>
          <p className="text-caption text-muted-foreground">Production · main · a1f9c2e</p>
        </div>
        <div className="grid gap-2 border-t pt-4">
          <span className="h-2 w-2/3 rounded-full bg-muted" />
          <span className="h-2 w-1/2 rounded-full bg-muted" />
        </div>
        <div
          aria-hidden
          className="absolute top-24 right-4 left-12 grid rounded-(--overlay-radius) border bg-popover p-(--overlay-padding) @prose:left-auto @prose:w-56"
        >
          {["Redeploy", "Promote to production", "Roll back"].map((item, i) => (
            <span
              key={item}
              className={
                i === 0
                  ? "flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label text-accent-foreground"
                  : "flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) px-3 text-label text-popover-foreground"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="grid content-between gap-8 rounded-(--card-radius) bg-panel p-(--card-padding) text-panel-foreground">
        <div className="grid gap-1">
          <p className="text-title text-panel-foreground">Deploys this week</p>
          <p className="text-caption text-panel-muted">Across 12 projects</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">128</span>
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
            <h3 className="text-title">{layer.name}</h3>
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
        <ul className="grid gap-x-6 gap-y-12 @prose:grid-cols-2 @narrow:grid-cols-3">
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
