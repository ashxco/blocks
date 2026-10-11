import * as React from "react"
import { EllipsisIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ByTheme, ThemeText } from "./by-theme"
import {
  describeRadius,
  describeSize,
  leafName,
  perTheme,
  refLabel,
  tokenByVar,
  tokens,
  tokensIn,
  valueIn,
  type DesignToken,
  type ThemeId,
} from "./data"
import { Code, Meta } from "./layout"

/* The Shape page's radii: each scale step and each component radius on the element it is made for, at true size. */

/** Component tokens that point at a radius step in a theme (themes can re-point them). */
function usedBy(t: DesignToken, theme: ThemeId) {
  return tokens
    .filter((c) => c.tier === "component" && valueIn(theme, c).ref === t.name)
    .map((c) => c.cssVar)
}

/** The muted (or `stage`) tile a radius demo sits in. */
function DemoStage({
  stage,
  children,
}: {
  stage?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid h-32 place-items-center overflow-hidden rounded-(--card-radius) border p-4 @prose:h-36 @prose:p-6",
        stage ?? "bg-muted"
      )}
    >
      {children}
    </div>
  )
}

/* Large surfaces run off the bottom of the stage, so only their top corners show, at 1:1. */
const cropped = "absolute inset-x-4 top-4 h-48 @prose:inset-x-6 @prose:top-6"

/*
 * Literal class names so Tailwind generates every radius. Stages are muted;
 * the input sits on a card instead, so its own muted fill still reads.
 */
const radiusDemo: Record<
  string,
  { label: string; demo: React.ReactNode; stage?: string }
> = {
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
        <span className="text-caption text-muted-foreground">
          12 open tasks
        </span>
      </span>
    ),
  },
  xl: {
    label: "Dialogs",
    demo: (
      <span
        className={`${cropped} grid content-start gap-1 rounded-xl border bg-popover p-4 @prose:p-5`}
      >
        <span className="text-label text-popover-foreground @prose:text-title">
          Delete project?
        </span>
        <span className="text-caption text-muted-foreground">
          This removes 32 tasks.
        </span>
      </span>
    ),
  },
  "2xl": {
    label: "Panels",
    demo: (
      <span
        className={`${cropped} grid content-start rounded-2xl bg-panel p-4 @prose:p-6`}
      >
        <span className="text-label text-panel-foreground @prose:text-h4">
          Work in one place
        </span>
      </span>
    ),
  },
  "3xl": {
    label: "Hero media",
    demo: <span className={`${cropped} rounded-3xl bg-tint-sky`} />,
  },
  "4xl": {
    label: "Large media frames",
    demo: <span className={`${cropped} rounded-4xl bg-tint-violet`} />,
  },
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
      Avatars, status dots, switches and other shapes that stay round in every
      theme. Buttons never use it directly: they read{" "}
      <code className="font-mono text-xs whitespace-nowrap text-foreground">
        --button-radius
      </code>
      , which a theme may point here.
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
      <DemoStage stage={demo?.stage}>{demo?.demo}</DemoStage>
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3 className="text-title text-foreground">{name}</h3>
          <Meta>
            <ThemeText
              value={perTheme((theme) =>
                describeSize(valueIn(theme, token).value)
              )}
            />
          </Meta>
        </div>
        <Code className="text-muted-foreground">
          {token.utility ?? `rounded-${name}`}
        </Code>
        <p className="text-caption text-copy">
          {radiusUse[name] ?? token.description ?? demo?.label}
        </p>
        <ByTheme as="div" by={(theme) => users[theme].join(" ")}>
          {(theme) =>
            users[theme].length ? (
              <p className="flex flex-wrap items-baseline gap-x-1.5 text-caption text-muted-foreground">
                Used by
                {users[theme].map((u) => (
                  <code
                    key={u}
                    className="font-mono text-xs whitespace-nowrap text-foreground"
                  >
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

const croppedSmall =
  "absolute inset-x-4 top-4 h-40 @prose:inset-x-6 @prose:top-6"

/* Each component radius on its component. Literal class names so Tailwind generates them. */
const componentDemo: Record<
  string,
  { label: string; demo: React.ReactNode; stage?: string }
> = {
  "--button-radius": {
    label: "Every button size and variant.",
    /* Small sizes so the pair fits a two-up tile on phones; the icon button wraps under on the narrowest. */
    demo: (
      <span className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" size="sm" tabIndex={-1} aria-hidden>
          <PlusIcon data-icon="inline-start" />
          New Task
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          tabIndex={-1}
          aria-hidden
        >
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
        <span className="text-caption text-muted-foreground">
          12 open tasks
        </span>
      </span>
    ),
  },
  "--overlay-radius": {
    label: "Menus, popovers, selects and hover cards.",
    demo: (
      <span className="grid w-full max-w-(--menu-min-width) rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding)">
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">
          Edit task
        </span>
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">
          Copy link
        </span>
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
        <span className="flex h-(--overlay-item-height) items-center px-3 text-label text-popover-foreground">
          Copy link
        </span>
      </span>
    ),
  },
  "--dialog-radius": {
    label: "Dialogs and alert dialogs.",
    demo: (
      <span
        className={`${croppedSmall} grid content-start gap-1 rounded-(--dialog-radius) border bg-popover p-4 @prose:p-5`}
      >
        <span className="text-label text-popover-foreground @prose:text-title">
          Delete project?
        </span>
        <span className="text-caption text-muted-foreground">
          This removes 32 tasks.
        </span>
      </span>
    ),
  },
  "--panel-radius": {
    label: "Dark panels and feature bands.",
    demo: (
      <span
        className={`${croppedSmall} grid content-start rounded-(--panel-radius) bg-panel p-4 @prose:p-6`}
      >
        <span className="text-label text-panel-foreground @prose:text-h4">
          Work in one place
        </span>
      </span>
    ),
  },
}

export function ComponentRadii() {
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
            <DemoStage stage={demo?.stage}>{demo?.demo}</DemoStage>
            <div className="grid gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="text-title text-foreground">
                  {t.cssVar.slice(2).replace(/-radius$/, "")}
                </h3>
                <Meta>
                  <ThemeText
                    value={perTheme((theme) =>
                      describeRadius(valueIn(theme, t).value)
                    )}
                  />
                </Meta>
              </div>
              <Code className="text-muted-foreground">
                {t.utility ?? `rounded-(${t.cssVar})`}
              </Code>
              <p className="text-caption text-copy">
                {demo?.label ?? t.description}
              </p>
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

/** Every step of the theme's radius scale. */
export function RadiusScale() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 @prose:gap-x-6 @prose:gap-y-12 @narrow:grid-cols-3">
      {tokensIn("layout", "radius").map((t) => (
        <RadiusTile key={t.name} token={t} />
      ))}
    </ul>
  )
}
