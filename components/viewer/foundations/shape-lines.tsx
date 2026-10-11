import * as React from "react"

import { Button } from "@/components/ui/button"

import { ThemeText } from "./by-theme"
import {
  colorAlias,
  leafName,
  perTheme,
  tokenByName,
  tokenByVar,
  tokensIn,
  valueIn,
} from "./data"
import { Code, Meta } from "./layout"

/* The Shape page's lines: border widths and colours, and the focus outline. */

/* What each width is for, drawn with the utility people should write. Literal class names so Tailwind generates them. */
const widthDemo: Record<string, { label: string; className: string }> = {
  "border.hairline": {
    label: "Card outline",
    className: "border border-border",
  },
  "border.strong": {
    label: "Selected card",
    className: "border-(length:--border-width-strong) border-foreground",
  },
}

export function BorderWidths() {
  const widths = tokensIn("layout", "border-width")
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {widths.map((w) => {
        const demo = widthDemo[w.name]
        return (
          <li key={w.name} className="grid content-start gap-5">
            <div
              aria-hidden
              className="grid h-36 place-items-center rounded-(--card-radius) border bg-muted p-6"
            >
              <span
                className={`flex h-16 w-full max-w-64 items-center gap-3 rounded-lg bg-background px-4 ${demo?.className ?? "border"}`}
              >
                <span className="size-6 shrink-0 rounded-full bg-tint-violet" />
                <span className="text-label text-foreground">
                  {demo?.label ?? leafName(w.name)}
                </span>
              </span>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="text-title text-foreground">
                  {leafName(w.name)}
                </h4>
                <Meta>
                  {String(w.value)} · {w.cssVar}
                </Meta>
              </div>
              <Code className="text-muted-foreground">
                {w.utility ?? w.cssVar}
              </Code>
              {w.description ? (
                <p className="text-caption text-copy">{w.description}</p>
              ) : null}
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
const lineDemos: {
  cssVar: string
  demo: React.ReactNode
  stage?: string
  span?: string
}[] = [
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

export function BorderColors() {
  const panelBorder = tokenByVar("--panel-border")
  /* Bordered like the radius stages, so a card-coloured stage still reads as a tile on the page. */
  const tile = "grid h-36 place-items-center rounded-(--card-radius) border p-5"
  return (
    <ul className="grid gap-x-6 gap-y-10 @prose:grid-cols-2 @narrow:grid-cols-6">
      {lineDemos.map(({ cssVar, demo, stage, span }) => {
        const t = tokenByVar(cssVar)
        if (!t) return null
        return (
          <li
            key={cssVar}
            className={`grid content-start gap-4 ${span ?? "@narrow:col-span-2"}`}
          >
            <span aria-hidden className={`${tile} ${stage ?? "bg-muted"}`}>
              {demo}
            </span>
            <div className="grid gap-1">
              <h4 className="text-title text-foreground">{cssVar.slice(2)}</h4>
              <Code className="text-muted-foreground">
                {t.utility ?? `border-${cssVar.slice(2)}`}
              </Code>
              {t.description ? (
                <p className="text-caption text-copy">{t.description}</p>
              ) : null}
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
            <Code className="text-muted-foreground">
              {panelBorder.utility ?? "border-panel-border"}
            </Code>
            {panelBorder.description ? (
              <p className="text-caption text-copy">
                {panelBorder.description}
              </p>
            ) : null}
          </div>
        </li>
      ) : null}
    </ul>
  )
}

/* ------------------------------------------------------------------------ */
/* Focus                                                                     */
/* ------------------------------------------------------------------------ */

export function Focus() {
  const width = tokenByName("focus.width")
  const offset = tokenByName("focus.offset")
  const ring = tokenByVar("--ring")
  return (
    <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="grid content-center justify-items-start gap-8 rounded-(--panel-radius) border bg-subtle p-(--panel-padding-sm)">
        <div className="flex flex-wrap items-center gap-6">
          <span className="inline-flex h-(--button-height-md) items-center rounded-(--button-radius) bg-primary px-(--button-padding-x-md) text-label text-primary-foreground focus-ring">
            Create project
          </span>
          <span className="flex h-(--control-height-md) w-56 max-w-full items-center rounded-(--control-radius) border border-ring bg-muted px-(--control-padding-x) text-body text-foreground focus-ring">
            Website relaunch
          </span>
        </div>
        <div className="grid gap-3">
          <p className="text-caption text-muted-foreground">
            Try it: press Tab to move through these buttons.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="sm">
              Assign
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Set Due Date
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Add Subtask
            </Button>
          </div>
        </div>
      </div>
      <dl className="grid content-start @narrow:border-b">
        {[
          { label: "Width", token: width, value: String(width?.value ?? "") },
          {
            label: "Offset",
            token: offset,
            value: String(offset?.value ?? ""),
          },
          {
            label: "Colour",
            token: ring,
            value: perTheme((theme) => {
              if (!ring) return ""
              const v = valueIn(theme, ring)
              const light = colorAlias(String(v.value), v.ref, theme)
              const dark = v.dark
                ? colorAlias(String(v.dark.value), v.dark.ref, theme)
                : light
              return [light && `${light} light`, dark && `${dark} dark`]
                .filter(Boolean)
                .join(" · ")
            }),
          },
        ].map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4"
          >
            <dt className="text-label text-foreground">{row.label}</dt>
            <dd className="grid gap-0.5">
              <Code>{row.token?.cssVar}</Code>
              <Meta>
                {typeof row.value === "string" ? (
                  row.value
                ) : (
                  <ThemeText value={row.value} />
                )}
              </Meta>
            </dd>
          </div>
        ))}
        <div className="border-t py-4">
          <p className="text-caption text-copy">
            Apply it with <Code>focus-visible:focus-ring</Code>. It shows for
            keyboard focus only, never as a glow.
          </p>
        </div>
      </dl>
    </div>
  )
}
