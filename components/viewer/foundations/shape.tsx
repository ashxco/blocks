import * as React from "react"
import { EllipsisIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { ByTheme, ThemeText } from "./by-theme"
import {
  colorAlias,
  describeSize,
  leafName,
  perTheme,
  refLabel,
  tokenByName,
  tokenByVar,
  tokens,
  tokensIn,
  valueIn,
  type DesignToken,
  type ThemeId,
} from "./data"
import { Code, FoundationPage, Meta, Section, SubHeading } from "./layout"

/** Component tokens that point at a radius step in a theme (themes can re-point them). */
function usedBy(t: DesignToken, theme: ThemeId) {
  return tokens.filter((c) => c.tier === "component" && valueIn(theme, c).ref === t.name).map((c) => c.cssVar)
}

/** A radius as a theme sizes it: "12px", or "Pill" where it is fully round. */
function radiusIn(t: DesignToken, theme: ThemeId, pill = "Fully round") {
  const size = describeSize(valueIn(theme, t).value)
  return size === "Fully round" ? pill : size
}

/* ------------------------------------------------------------------------ */
/* Radius: each step on the element it is made for, at true size             */
/* ------------------------------------------------------------------------ */

/* Large surfaces run off the bottom of the stage, so only their top corners show, at 1:1. */
const cropped = "absolute inset-x-4 top-4 h-48 @prose:inset-x-6 @prose:top-6"

/*
 * Literal class names so Tailwind generates every radius. Stages are muted;
 * the input sits on a card instead, so its own muted fill still reads.
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
      <span className="grid w-full max-w-(--menu-min-width) rounded-md border border-popover-border bg-popover p-(--overlay-padding)">
        <span className="flex h-(--overlay-item-height) items-center rounded-sm bg-accent px-3 text-label text-accent-foreground">
          Edit task
        </span>
        <span className="flex h-(--overlay-item-height) items-center rounded-sm px-3 text-label text-popover-foreground">
          Copy link
        </span>
      </span>
    ),
  },
  md: {
    label: "Inputs and menus",
    stage: "bg-card",
    demo: (
      <span className="flex h-(--control-height-md) w-full max-w-56 items-center rounded-md border border-input bg-muted px-(--control-padding-x) text-body text-muted-foreground">
        Q4 planning
      </span>
    ),
  },
  lg: {
    label: "Cards",
    stage: "bg-muted",
    demo: (
      <span className="grid w-full max-w-60 gap-0.5 rounded-lg border bg-card p-4">
        <span className="text-title text-foreground">Q4 planning</span>
        <span className="text-caption text-muted-foreground">12 open tasks</span>
      </span>
    ),
  },
  xl: {
    label: "Dialogs",
    demo: (
      <span className={`${cropped} grid content-start gap-1 rounded-xl border bg-popover p-4 @prose:p-5`}>
        <span className="text-label text-popover-foreground @prose:text-title">Delete project?</span>
        <span className="text-caption text-muted-foreground">This removes 32 tasks.</span>
      </span>
    ),
  },
  "2xl": {
    label: "Panels",
    demo: (
      <span className={`${cropped} grid content-start rounded-2xl bg-panel p-4 @prose:p-6`}>
        <span className="text-label text-panel-foreground @prose:text-h4">Work in one place</span>
      </span>
    ),
  },
  "3xl": { label: "Hero media", demo: <span className={`${cropped} rounded-3xl bg-tint-sky`} /> },
  "4xl": { label: "Large media frames", demo: <span className={`${cropped} rounded-4xl bg-tint-violet`} /> },
  full: {
    label: "Avatars, dots and switches",
    demo: (
      <span className="flex items-center gap-3">
        <span className="grid size-(--avatar-size-md) place-items-center rounded-full bg-tint-mint text-caption font-semibold text-foreground">
          MP
        </span>
        <span className="flex h-(--switch-height) w-(--switch-width) items-center justify-end rounded-full bg-primary p-0.5">
          <span className="aspect-square h-full rounded-full bg-primary-foreground" />
        </span>
        <span className="flex items-center gap-1.5 text-caption text-foreground">
          <span className="size-2 rounded-full bg-success" />
          Online
        </span>
      </span>
    ),
  },
}

/* The scale step's own description, except where a theme makes it wrong: full is never a button. */
const radiusUse: Record<string, React.ReactNode> = {
  full: (
    <>
      Avatars, status dots, switches and other shapes that stay round in every theme. Buttons never use it
      directly: they read <code className="font-mono text-xs whitespace-nowrap text-foreground">--button-radius</code>,
      which a theme may point here.
    </>
  ),
}

function RadiusTile({ token }: { token: DesignToken }) {
  const name = leafName(token.name)
  const users = perTheme((theme) => usedBy(token, theme))
  const demo = radiusDemo[name]
  return (
    // Two across below @narrow, so the last of an odd count spans the row rather than leaving half of it empty.
    <li className="grid content-start gap-4 @max-narrow:last:odd:col-span-2">
      <div
        aria-hidden
        className={`relative grid h-32 place-items-center overflow-hidden rounded-(--card-radius) border p-4 @prose:h-36 @prose:p-6 ${demo?.stage ?? "bg-muted"}`}
      >
        {demo?.demo}
      </div>
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3 className="text-title text-foreground">{name}</h3>
          <Meta>
            <ThemeText value={perTheme((theme) => radiusIn(token, theme))} />
          </Meta>
        </div>
        <Code className="text-muted-foreground">{token.utility ?? `rounded-${name}`}</Code>
        <p className="text-caption text-copy">{radiusUse[name] ?? token.description ?? demo?.label}</p>
        <ByTheme as="div" by={(theme) => users[theme].join(" ")}>
          {(theme) =>
            users[theme].length ? (
              <p className="flex flex-wrap items-baseline gap-x-1.5 text-caption text-muted-foreground">
                Used by
                {users[theme].map((u) => (
                  <code key={u} className="font-mono text-xs whitespace-nowrap text-foreground">
                    {u}
                  </code>
                ))}
              </p>
            ) : null
          }
        </ByTheme>
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------------ */
/* Component radii: what themes change most                                  */
/* ------------------------------------------------------------------------ */

const croppedSmall = "absolute inset-x-4 top-4 h-40 @prose:inset-x-6 @prose:top-6"

/* Each component radius on its component. Literal class names so Tailwind generates them. */
const componentDemo: Record<string, { label: string; demo: React.ReactNode; stage?: string }> = {
  "--button-radius": {
    label: "Every button size and variant.",
    /* Small sizes so the pair fits a two-up tile on phones; the icon button wraps under on the narrowest. */
    demo: (
      <span className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" size="sm" tabIndex={-1} aria-hidden>
          <PlusIcon data-icon="inline-start" />
          New task
        </Button>
        <Button type="button" variant="outline" size="icon-sm" tabIndex={-1} aria-hidden>
          <EllipsisIcon />
        </Button>
      </span>
    ),
  },
  "--control-radius": {
    label: "Inputs, selects, textareas and comboboxes.",
    stage: "bg-card",
    demo: (
      <span className="flex h-(--control-height-md) w-full max-w-56 items-center rounded-(--control-radius) border border-input bg-muted px-(--control-padding-x) text-body text-muted-foreground">
        Q4 planning
      </span>
    ),
  },
  "--badge-radius": {
    label: "Status and count badges.",
    stage: "bg-card",
    demo: (
      <span className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="success">On track</Badge>
        <Badge variant="secondary">In review</Badge>
      </span>
    ),
  },
  "--card-radius": {
    label: "Cards, tiles and table frames.",
    stage: "bg-muted",
    demo: (
      <span className="grid w-full max-w-60 gap-0.5 rounded-(--card-radius) border bg-card p-4">
        <span className="text-title text-foreground">Q4 planning</span>
        <span className="text-caption text-muted-foreground">12 open tasks</span>
      </span>
    ),
  },
  "--overlay-radius": {
    label: "Menus, popovers, selects and hover cards.",
    demo: (
      <span className="grid w-full max-w-(--menu-min-width) rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding)">
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">Edit task</span>
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">Copy link</span>
      </span>
    ),
  },
  "--overlay-item-radius": {
    label: "The highlight on a menu item.",
    demo: (
      <span className="grid w-full max-w-(--menu-min-width) rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding)">
        <span className="flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label text-accent-foreground">
          Edit task
        </span>
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">Copy link</span>
      </span>
    ),
  },
  "--dialog-radius": {
    label: "Dialogs and alert dialogs.",
    demo: (
      <span className={`${croppedSmall} grid content-start gap-1 rounded-(--dialog-radius) border bg-popover p-4 @prose:p-5`}>
        <span className="text-label text-popover-foreground @prose:text-title">Delete project?</span>
        <span className="text-caption text-muted-foreground">This removes 32 tasks.</span>
      </span>
    ),
  },
  "--panel-radius": {
    label: "Dark panels and feature bands.",
    demo: (
      <span className={`${croppedSmall} grid content-start rounded-(--panel-radius) bg-panel p-4 @prose:p-6`}>
        <span className="text-label text-panel-foreground @prose:text-h4">Work in one place</span>
      </span>
    ),
  },
}

function ComponentRadii() {
  const radii = Object.keys(componentDemo).flatMap((cssVar) => {
    const t = tokenByVar(cssVar)
    return t ? [t] : []
  })
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 @prose:gap-x-6 @prose:gap-y-12 @narrow:grid-cols-4">
      {radii.map((t) => {
        const demo = componentDemo[t.cssVar]
        const from = perTheme((theme) => {
          const ref = valueIn(theme, t).ref
          return ref ? `From ${refLabel(ref)}` : "Its own value"
        })
        return (
          <li key={t.cssVar} className="grid content-start gap-4">
            <div
              aria-hidden
              className={`relative grid h-32 place-items-center overflow-hidden rounded-(--card-radius) border p-4 @prose:h-36 @prose:p-6 ${demo?.stage ?? "bg-muted"}`}
            >
              {demo?.demo}
            </div>
            <div className="grid gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="text-title text-foreground">{t.cssVar.slice(2).replace(/-radius$/, "")}</h3>
                <Meta>
                  <ThemeText value={perTheme((theme) => radiusIn(t, theme, "Pill"))} />
                </Meta>
              </div>
              <Code className="text-muted-foreground">{t.utility ?? `rounded-(${t.cssVar})`}</Code>
              <p className="text-caption text-copy">{demo?.label ?? t.description}</p>
              <Meta>
                <ThemeText value={from} />
              </Meta>
            </div>
          </li>
        )
      })}
    </ul>
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
            <div aria-hidden className="grid h-36 place-items-center rounded-(--card-radius) border bg-muted p-6">
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
              <Code className="text-muted-foreground">{w.utility ?? w.cssVar}</Code>
              {w.description ? <p className="text-caption text-copy">{w.description}</p> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/*
 * Each line colour drawn on the element it is made for. The page lines run
 * three across; the two edges of floating and dark surfaces share the second
 * row. The card sits on muted, which stands clear of bg-card in both modes.
 */
const lineDemos: { cssVar: string; demo: React.ReactNode; stage?: string; span?: string }[] = [
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
        Q4 planning
      </span>
    ),
  },
  {
    cssVar: "--popover-border",
    stage: "bg-muted",
    span: "@narrow:col-span-3",
    demo: (
      <span className="grid w-full max-w-(--menu-min-width) rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding)">
        <span className="flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label text-accent-foreground">
          Edit task
        </span>
        <span className="flex h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) px-3 text-label text-popover-foreground">
          Copy link
        </span>
      </span>
    ),
  },
]

function BorderColors() {
  const panelBorder = tokenByVar("--panel-border")
  /* Bordered like the radius stages, so a card-coloured stage still reads as a tile on the page. */
  const tile = "grid h-36 place-items-center rounded-(--card-radius) border p-5"
  return (
    <ul className="grid gap-x-6 gap-y-10 @prose:grid-cols-2 @narrow:grid-cols-6">
      {lineDemos.map(({ cssVar, demo, stage, span }) => {
        const t = tokenByVar(cssVar)
        if (!t) return null
        return (
          <li key={cssVar} className={`grid content-start gap-4 ${span ?? "@narrow:col-span-2"}`}>
            <span aria-hidden className={`${tile} ${stage ?? "bg-muted"}`}>
              {demo}
            </span>
            <div className="grid gap-1">
              <h4 className="text-title text-foreground">{cssVar.slice(2)}</h4>
              <Code className="text-muted-foreground">{t.utility ?? `border-${cssVar.slice(2)}`}</Code>
              {t.description ? <p className="text-caption text-copy">{t.description}</p> : null}
            </div>
          </li>
        )
      })}
      {panelBorder ? (
        <li className="grid content-start gap-4 @prose:col-span-2 @narrow:col-span-3">
          <span aria-hidden className={`${tile} border-transparent bg-panel`}>
            <span className="grid w-full gap-2 rounded-lg border border-panel-border bg-panel-raised p-4">
              <span className="h-2 w-2/3 rounded-full bg-panel-foreground/20" />
              <span className="h-2 w-1/2 rounded-full bg-panel-foreground/20" />
            </span>
          </span>
          <div className="grid gap-1">
            <h4 className="text-title text-foreground">panel-border</h4>
            <Code className="text-muted-foreground">{panelBorder.utility ?? "border-panel-border"}</Code>
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
            Create project
          </span>
          <span className="focus-ring flex h-(--control-height-md) w-56 max-w-full items-center rounded-(--control-radius) border border-ring bg-muted px-(--control-padding-x) text-body text-foreground">
            Website relaunch
          </span>
        </div>
        <div className="grid gap-3">
          <p className="text-caption text-muted-foreground">Try it: press Tab to move through these buttons.</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="sm">
              Assign
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Set due date
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Add subtask
            </Button>
          </div>
        </div>
      </div>
      <dl className="grid content-start @narrow:border-b">
        {[
          { label: "Width", token: width, value: String(width?.value ?? "") },
          { label: "Offset", token: offset, value: String(offset?.value ?? "") },
          {
            label: "Colour",
            token: ring,
            value: perTheme((theme) => {
              if (!ring) return ""
              const v = valueIn(theme, ring)
              const light = colorAlias(String(v.value), v.ref, theme)
              const dark = v.dark ? colorAlias(String(v.dark.value), v.dark.ref, theme) : light
              return [light && `${light} light`, dark && `${dark} dark`].filter(Boolean).join(" · ")
            }),
          },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4">
            <dt className="text-label text-foreground">{row.label}</dt>
            <dd className="grid gap-0.5">
              <Code>{row.token?.cssVar}</Code>
              <Meta>{typeof row.value === "string" ? row.value : <ThemeText value={row.value} />}</Meta>
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
    body: "Menus and popovers sit on bg-popover with the popover edge; dialogs keep the plain hairline. Backdrops dim with the overlay colour and blur the page behind.",
    tokens: ["bg-popover", "border-popover-border", "bg-overlay", "backdrop-blur-glass"],
  },
]

const tasks: { title: string; owner: string; status: string }[] = [
  { title: "Review homepage copy", owner: "Maya Patel", status: "In review" },
  { title: "Final hero images", owner: "Sofia Alvarez", status: "In progress" },
  { title: "Redirect old blog links", owner: "Jordan Lee", status: "To do" },
  { title: "Write launch email", owner: "Priya Raman", status: "To do" },
]

/*
 * The open menu. Phones get a compact two-item menu that covers the first
 * row; from @prose the full menu covers two.
 */
const menuItems: { label: string; wide?: boolean }[] = [
  { label: "Edit task" },
  { label: "Move to another project", wide: true },
  { label: "Archive" },
]

/* Status labels the open menu sits over: hidden, so they do not peek past its corner. */
const coveredStatus = ["invisible", "@prose:invisible"]

/* Tasks completed per day, Monday to Sunday. Today is highlighted. */
const week = [62, 78, 54, 91, 70, 38, 84]

function DepthScene() {
  return (
    /* Muted, so the card on it stands clear in both modes. */
    <div aria-hidden className="grid gap-6 rounded-(--panel-radius) border bg-muted p-(--panel-padding-sm) @narrow:grid-cols-2">
      {/* Card with an open menu on top of it */}
      <div className="relative grid content-start gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-title text-foreground">Website relaunch</p>
            <p className="text-caption text-muted-foreground">4 tasks due this week</p>
          </div>
          <span className="grid size-(--button-height-sm) shrink-0 place-items-center rounded-(--button-radius) bg-accent text-foreground">
            <EllipsisIcon className="size-4" />
          </span>
        </div>
        <ul className="grid border-t">
          {tasks.map((task, i) => (
            <li key={task.title} className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0 last:pb-0">
              <span className="grid min-w-0">
                <span className="truncate text-label text-foreground">{task.title}</span>
                <span className="text-caption text-muted-foreground">{task.owner}</span>
              </span>
              <span className={`shrink-0 text-caption text-muted-foreground ${coveredStatus[i] ?? ""}`}>{task.status}</span>
            </li>
          ))}
        </ul>
        <div className="absolute top-[calc(var(--card-padding)+var(--button-height-sm)+--spacing(2))] right-(--card-padding) grid w-max @prose:min-w-(--menu-min-width) rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding)">
          {menuItems.map((item, i) => (
            <span
              key={item.label}
              className={
                (item.wide ? "hidden @prose:flex " : "flex ") +
                (i === 0
                  ? "h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label whitespace-nowrap text-accent-foreground"
                  : "h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) px-3 text-label whitespace-nowrap text-popover-foreground")
              }
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Dark panel with raised tiles */}
      <div className="grid content-start gap-6 rounded-(--card-radius) bg-panel p-(--card-padding) text-panel-foreground">
        <div className="grid gap-1">
          <p className="text-title text-panel-foreground">Tasks completed this week</p>
          <p className="text-caption text-panel-muted">Across 24 active projects</p>
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
            <span className="text-h3 text-panel-foreground tabular">286</span>
            <span className="text-caption text-panel-muted">Completed</span>
          </div>
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">92%</span>
            <span className="text-caption text-panel-muted">On time</span>
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
        description="Small things get small corners, large surfaces get generous ones. Each theme sets its own scale, from Mono's sharp corners to Ember's soft ones; the sizes shown are the theme you are on. Only full is the same everywhere."
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 @prose:gap-x-6 @prose:gap-y-12 @narrow:grid-cols-3">
          {radii.map((t) => (
            <RadiusTile key={t.name} token={t} />
          ))}
        </ul>
      </Section>

      <Section
        id="component-radii"
        title="Component radii"
        description="Components read their corners through their own tokens, never a scale step by name, so a theme can make buttons pills in one theme and rounded squares in another without touching component code. Most point at a step of the scale; a theme can re-point them."
      >
        <ComponentRadii />
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
        description="One outline for every focusable element: solid, in the theme's accent (ink in Mono), offset from the edge so it never hides the control."
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
