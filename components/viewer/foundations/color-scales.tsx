import * as React from "react"
import Link from "next/link"

import { parseOklch } from "./color"
import { AliasRamp } from "./alias-ramp"
import { OnlyInTheme, ThemeText } from "./by-theme"
import {
  aliasHue,
  aliasSource,
  aliasSummary,
  defaultThemeId,
  fixedScales,
  perTheme,
  scaleKind,
  sentenceCase,
  sharedSteps,
  themeById,
  themes,
  themesUsing,
  themeScales,
  valueIn,
  type ColorScale,
  type ScaleKind,
  type ScaleRole,
  type ThemeId,
} from "./data"
import { Code, Meta, SubHeading } from "./layout"
import { cn } from "@/lib/utils"

/* The Colour page's scales: the theme's alias scales, where each theme points them, and the fixed OKLCH scales. */

function trimNumber(n: number) {
  return String(Math.round(n * 1000) / 1000)
}

type Step = ColorScale["steps"][number]

/**
 * The OKLCH channels of a step as a theme resolves it. Fixed scales are the
 * same in every theme; an alias step takes the theme's own value.
 */
function channelsIn(s: Step, theme: ThemeId, alias: boolean) {
  return alias ? parseOklch(valueIn(theme, s.token).value) : s.oklch
}

/**
 * "Hue 283" for a scale with colour (read at its middle step), "No hue" for
 * pure greys. Alias scales use aliasHue, as the Themes page and the table
 * below do, so a scale prints the same hue everywhere.
 */
function hueLabel(scale: ColorScale, theme: ThemeId, alias: boolean) {
  if (alias && (scale.name === "accent" || scale.name === "neutral")) {
    const hue = aliasHue(theme, scale.name)
    return hue === null ? "No hue" : `Hue ${hue}`
  }
  const middle = ["600", "500"].flatMap((step) =>
    scale.steps.filter((s) => s.step === step)
  )
  const coloured = [...middle, ...scale.steps]
    .map((s) => channelsIn(s, theme, alias))
    .find((c) => (c?.c ?? 0) > 0)
  return coloured ? `Hue ${trimNumber(coloured.h)}` : "No hue"
}

/** A step's L or C, printed for the theme the page is on. */
function Channel({
  step,
  channel,
  alias,
}: {
  step: Step
  channel: "l" | "c"
  alias: boolean
}) {
  const label = channel === "l" ? "L" : "C"
  const text = perTheme((theme) => {
    const c = channelsIn(step, theme, alias)
    return c ? `${label} ${trimNumber(c[channel])}` : ""
  })
  return <ThemeText value={text} />
}

function Ramp({
  scale,
  steps,
  alias = false,
  title,
  note,
  level = 3,
}: {
  scale: ColorScale
  steps: string[]
  /** An alias scale (accent, neutral): its values change with the theme. */
  alias?: boolean
  title?: string
  note?: React.ReactNode
  level?: 3 | 4
}) {
  const main = steps.flatMap((step) =>
    scale.steps.filter((s) => s.step === step)
  )
  const extra = scale.steps.filter((s) => !steps.includes(s.step))
  const count = main.length
  const Heading = level === 3 ? "h3" : "h4"
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="grid gap-1">
          <Heading
            className={
              level === 3
                ? "text-h3 text-foreground"
                : "text-h4 text-foreground"
            }
          >
            {title ?? sentenceCase(scale.name)}
          </Heading>
          {note ? (
            <p className="text-caption text-muted-foreground">{note}</p>
          ) : null}
        </div>
        <Meta>
          <ThemeText
            value={perTheme((theme) => hueLabel(scale, theme, alias))}
          />{" "}
          · L lightness · C chroma
        </Meta>
      </div>

      <ol
        aria-label={`${title ?? scale.name} scale`}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {main.map((s, i) => (
          <li
            key={s.step}
            className="grid min-w-0 content-start gap-2 @narrow:gap-3"
          >
            <div
              title={alias ? undefined : s.value}
              className={cn(
                "h-12 border-y @narrow:h-20",
                i === 0 && "rounded-l-lg border-l",
                i === count - 1 && "rounded-r-lg border-r"
              )}
              style={{ backgroundColor: `var(${s.token.cssVar})` }}
            />
            <div className="grid gap-0.5 @narrow:pr-2">
              <span className="font-mono text-xs font-semibold text-foreground">
                {s.step}
              </span>
              <span className="hidden gap-0.5 @narrow:grid">
                <Meta>
                  <Channel step={s} channel="l" alias={alias} />
                </Meta>
                <Meta>
                  <Channel step={s} channel="c" alias={alias} />
                </Meta>
              </span>
            </div>
          </li>
        ))}
      </ol>

      {extra.length ? (
        <div className="grid gap-3 @narrow:grid-cols-[auto_minmax(0,1fr)] @narrow:items-start @narrow:gap-6">
          <p className="text-caption text-muted-foreground @narrow:pt-1">
            {extra.some((s) => s.step === "dim") && extra.length === 1
              ? "Quiet dark-mode fill"
              : "Fine steps for UI greys"}
          </p>
          <ol
            aria-label={`${title ?? scale.name} fine steps`}
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {extra.map((s) => (
              <li key={s.step} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  title={alias ? undefined : s.value}
                  className="size-7 shrink-0 rounded-sm border"
                  style={{ backgroundColor: `var(${s.token.cssVar})` }}
                />
                <span className="grid">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {s.step}
                  </span>
                  <Meta>
                    <Channel step={s} channel="l" alias={alias} />
                  </Meta>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}

/* Theme scales: the aliases semantic roles read ---------------------------- */

const aliasTitles: Record<
  string,
  { title: string; role: ScaleRole; cssVar: string }
> = {
  accent: { title: "Accent", role: "accent", cssVar: "--bk-accent-*" },
  neutral: { title: "Neutral", role: "neutral", cssVar: "--bk-neutral-*" },
}

export function ThemeScaleRamps() {
  const scales = themeScales()
  const steps = sharedSteps([...scales, ...fixedScales()])
  return (
    <div className="grid gap-12">
      {scales.map((scale) => {
        const meta = aliasTitles[scale.name]
        return (
          <Ramp
            key={scale.name}
            scale={scale}
            steps={steps}
            alias
            title={meta?.title}
            note={
              meta ? (
                <>
                  <Code className="text-muted-foreground">{meta.cssVar}</Code> ·{" "}
                  <ThemeText
                    value={perTheme((theme) =>
                      aliasSource(theme, themeById(theme).name, meta.role)
                    )}
                  />
                </>
              ) : undefined
            }
          />
        )
      })}
    </div>
  )
}

/** Where each theme points its two alias scales, each drawn inside that theme's scope. */
export function AliasMap() {
  const th =
    "h-(--table-row-height-sm) px-5 text-left text-caption font-semibold text-muted-foreground"
  const td =
    "align-middle @narrow:h-(--table-row-height) @narrow:px-5 @narrow:py-3"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">
          The scale each theme points its accent and neutral at
        </caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={th}>
              Theme
            </th>
            <th scope="col" className={th}>
              Accent
            </th>
            <th scope="col" className={th}>
              Neutral
            </th>
          </tr>
        </thead>
        <tbody className="block @narrow:table-row-group">
          {themes.map((theme) => (
            <tr
              key={theme.id}
              className="grid gap-3 border-t p-5 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
            >
              <th scope="row" className={cn(td, "text-left font-normal")}>
                <span className="flex items-baseline gap-2.5">
                  <span className="text-label text-foreground">
                    {theme.name}
                  </span>
                  <OnlyInTheme theme={theme.id}>
                    <span className="text-caption text-muted-foreground">
                      Current
                    </span>
                  </OnlyInTheme>
                </span>
              </th>
              {(["accent", "neutral"] as const).map((role) => (
                <td key={role} className={td}>
                  <span className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 @narrow:flex">
                    <span className="text-caption text-muted-foreground @narrow:hidden">
                      {role === "accent" ? "Accent" : "Neutral"}
                    </span>
                    <span className="flex min-w-0 items-center gap-3">
                      <AliasRamp
                        role={role}
                        theme={theme.id}
                        className="h-6 w-32 shrink-0 rounded-xs border border-border-strong"
                      />
                      <span className="font-mono text-xs text-foreground">
                        {aliasSummary(theme.id, role)}
                      </span>
                    </span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* Fixed scales: the raw colours, the same in every theme ------------------- */

const kindBlurb: Record<ScaleKind, { title: string; blurb: string }> = {
  accent: {
    title: "Accents",
    blurb: "Hues a preset points its accent scale at.",
  },
  neutral: {
    title: "Neutrals",
    blurb:
      "Greys from 0 (white) to 1000 (the dark canvas) that a preset uses as its neutral scale.",
  },
  status: {
    title: "Status",
    blurb:
      "Read by success, warning, destructive and info in every theme, so a status keeps its meaning.",
  },
}

/** "Blocks accent", "Mono accent and neutral", or how a scale is used when no theme points at it. */
function usedBy(scale: ColorScale, kind: ScaleKind) {
  if (kind === "status") return "Status roles in every theme"
  const uses = themesUsing(scale.name)
  if (!uses.length) return "Not used by a preset"
  const names = [...new Set(uses.map((u) => u.theme.name))]
  return names
    .map(
      (name) =>
        `${name} ${uses
          .filter((u) => u.theme.name === name)
          .map((u) => u.role)
          .join(" and ")}`
    )
    .join(", ")
}

/** True for status scales and for scales a preset points its accent or neutral at. */
function inUse(scale: ColorScale) {
  return scaleKind(scale) === "status" || themesUsing(scale.name).length > 0
}

/** A fixed scale no preset uses, at a glance: name, kind, hue and a strip of its steps. */
function AvailableScale({
  scale,
  steps,
}: {
  scale: ColorScale
  steps: string[]
}) {
  const main = steps.flatMap((step) =>
    scale.steps.filter((s) => s.step === step)
  )
  return (
    <li className="grid min-w-0 gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-foreground">
          {sentenceCase(scale.name)}{" "}
          <span className="font-normal text-muted-foreground">
            · {scaleKind(scale)}
          </span>
        </span>
        <Meta>{hueLabel(scale, defaultThemeId, false)}</Meta>
      </div>
      <span
        aria-hidden
        className="grid h-8 overflow-hidden rounded-md border"
        style={{
          gridTemplateColumns: `repeat(${main.length}, minmax(0, 1fr))`,
        }}
      >
        {main.map((s) => (
          <span
            key={s.step}
            title={s.value}
            style={{ backgroundColor: `var(${s.token.cssVar})` }}
          />
        ))}
      </span>
      <Code className="text-muted-foreground">{`color.${scale.name}.*`}</Code>
    </li>
  )
}

export function FixedScales() {
  const scales = fixedScales()
  const steps = sharedSteps(scales)
  const available = scales.filter((scale) => !inUse(scale))
  return (
    <div className="grid gap-16">
      {(["accent", "neutral", "status"] as const).map((kind) => {
        const group = scales.filter(
          (scale) => scaleKind(scale) === kind && inUse(scale)
        )
        if (!group.length) return null
        return (
          <div key={kind} className="grid gap-10">
            <div className="grid gap-1">
              <SubHeading>{kindBlurb[kind].title}</SubHeading>
              <p className="max-w-prose text-caption text-copy">
                {kindBlurb[kind].blurb}
              </p>
            </div>
            {group.map((scale) => (
              <Ramp
                key={scale.name}
                scale={scale}
                steps={steps}
                level={4}
                note={usedBy(scale, kind)}
              />
            ))}
          </div>
        )
      })}

      {/* Scales no preset points at: kept short, since nothing on screen uses them. */}
      {available.length ? (
        <div className="grid gap-8">
          <div className="grid gap-1">
            <SubHeading>Available scales</SubHeading>
            <p className="max-w-prose text-caption text-copy">
              Ready-made accents and neutrals that no preset points at yet. A
              theme can use one in place of its own values by pointing each
              alias step at it, such as{" "}
              <Code>{`{color.${available[0].name}.600}`}</Code>. Every step is
              listed on the{" "}
              <Link
                href="/foundations/tokens"
                className="text-brand link-underline outline-none focus-visible:focus-ring"
              >
                Tokens page
              </Link>
              .
            </p>
          </div>
          <ul
            aria-label="Available scales"
            className="grid gap-x-10 gap-y-8 @prose:grid-cols-2"
          >
            {available.map((scale) => (
              <AvailableScale key={scale.name} scale={scale} steps={steps} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
