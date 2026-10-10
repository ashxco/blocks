import * as React from "react"
import Link from "next/link"

import { formatRatio, parseOklch, textContrast, wcagLevel } from "./color"
import {
  aliasHue,
  aliasSource,
  aliasSummary,
  colorAlias,
  defaultThemeId,
  fixedScales,
  perTheme,
  roleName,
  scaleKind,
  semanticGroups,
  sentenceCase,
  themes,
  themeById,
  themesUsing,
  themeScales,
  themeValues,
  tokenByVar,
  tokens,
  valueIn,
  type ColorScale,
  type DesignToken,
  type ScaleKind,
  type ScaleRole,
  type ThemeId,
} from "./data"
import { Badge } from "@/components/ui/badge"
import { themeScopeProps } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { ByTheme, OnlyInTheme, ThemeText } from "./by-theme"
import { Code, CodeList, FoundationPage, Meta, Section, SubHeading } from "./layout"
import { rampFill, rampSteps } from "./scale-fill"

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

type Mode = "light" | "dark"

/**
 * The primitive behind a role in one mode of a theme ("neutral.950",
 * "red.600", "neutral.0 at 9%"), or the raw value for a tuned one-off.
 */
function refIn(t: DesignToken, mode: Mode, theme: ThemeId) {
  const v = valueIn(theme, t)
  const resolved = mode === "dark" && v.dark ? v.dark : v
  return colorAlias(String(resolved.value), resolved.ref, theme) ?? String(resolved.value)
}

/*
 * Display order for groups whose source order reads poorly: the panel-* run
 * (surfaces, line and text, then the status accents), with terminal, its own
 * surface, last. Roles not listed follow in source order.
 */
const displayOrder: Record<string, string[]> = {
  panel: [
    "--panel",
    "--panel-raised",
    "--panel-border",
    "--panel-muted",
    "--panel-brand",
    "--panel-success",
    "--panel-warning",
    "--panel-destructive",
    "--terminal",
  ],
}

function ordered(list: DesignToken[]) {
  const order = displayOrder[list[0]?.group ?? ""]
  if (!order) return list
  const rank = (t: DesignToken) => {
    const i = order.indexOf(t.cssVar)
    return i === -1 ? order.length : i
  }
  return [...list].sort((a, b) => rank(a) - rank(b))
}

/** The utility hint from the token build, or the bare variable for a role without one. */
function utilityOf(t: DesignToken) {
  return t.utility ?? `var(${t.cssVar})`
}

type Base = "background" | "panel"

function swatchBase(t: DesignToken): Base {
  return t.group === "panel" && roleName(t) !== "panel" && roleName(t) !== "terminal" ? "panel" : "background"
}

/* ------------------------------------------------------------------------ */
/* Roles: each fill is shown with the text role made for it                  */
/* ------------------------------------------------------------------------ */

interface Role {
  token: DesignToken
  /** The `-foreground` role that sits on this fill, folded into its tile. */
  on?: DesignToken
  kind: "fill" | "text" | "line"
}

/** "--card-foreground" -> "--card", "--foreground" -> "--background". */
function parentOf(t: DesignToken) {
  if (t.cssVar === "--foreground") return "--background"
  return t.cssVar.endsWith("-foreground") ? t.cssVar.replace(/-foreground$/, "") : undefined
}

/*
 * How a role is drawn, from the first utility the build suggests: border and
 * outline roles as a line, text roles as "Aa" on their canvas, the rest as a
 * fill. Status colours that are also fills (text-info · bg-info) stay fills;
 * accents on panels (text-panel-brand · bg-panel-brand) are mostly text, so
 * they show as text on the panel.
 */
function kindOf(t: DesignToken, on?: DesignToken): Role["kind"] {
  if (on) return "fill"
  const utility = utilityOf(t)
  if (/^(border|outline)-/.test(utility)) return "line"
  if (utility.startsWith("text-") && (!utility.includes(" bg-") || t.group === "panel")) return "text"
  return "fill"
}

function rolesOf(list: DesignToken[]): Role[] {
  const inGroup = new Set(list.map((t) => t.cssVar))
  const folded = new Set(list.filter((t) => inGroup.has(parentOf(t) ?? "")).map((t) => t.cssVar))
  return ordered(list)
    .filter((t) => !folded.has(t.cssVar))
    .map((t) => {
      const on = list.find((f) => folded.has(f.cssVar) && parentOf(f) === t.cssVar)
      return { token: t, on, kind: kindOf(t, on) }
    })
}

function roleUtilities(role: Role) {
  const fill = utilityOf(role.token)
  return role.on ? `${fill} · ${utilityOf(role.on)}` : fill
}

/** The fill's description, plus the text role's when it says more than "Text on …". */
function roleDescription(role: Role) {
  const extra = role.on?.description && !/^Text (on|in)\b/.test(role.on.description) ? role.on.description : ""
  return [role.token.description, extra].filter(Boolean).join(" ") || undefined
}

function roleRefs(role: Role, mode: Mode, theme: ThemeId) {
  return role.on ? `${refIn(role.token, mode, theme)} · ${refIn(role.on, mode, theme)}` : refIn(role.token, mode, theme)
}

/**
 * One mode's half of a role swatch, resolved inside a mode scope in the
 * page's theme: a fill with "Aa" in its text role, a text colour on its
 * canvas, or a line drawn as an outline.
 */
function SwatchHalf({ role, mode, size }: { role: Role; mode: Mode; size: "sm" | "md" }) {
  const t = role.token
  const base = swatchBase(t)
  const text = size === "md" ? "text-h4" : "text-title"
  return (
    <div className={cn(mode, "relative grid place-items-center", base === "panel" ? "bg-panel" : "bg-background")}>
      {t.cssVar === "--overlay" ? <OverlayScene /> : null}
      {role.kind === "fill" && t.cssVar !== "--overlay" ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `var(${t.cssVar})`, color: role.on ? `var(${role.on.cssVar})` : undefined }}
        >
          {role.on ? <span className={cn("grid size-full place-items-center", text)}>Aa</span> : null}
        </div>
      ) : null}
      {role.kind === "text" ? (
        <span className={text} style={{ color: `var(${t.cssVar})` }}>
          Aa
        </span>
      ) : null}
      {role.kind === "line" ? (
        <span
          // A control-shaped outline, wider than tall, so it reads as a line at every swatch width.
          className={cn(
            "absolute top-1/2 -translate-y-1/2 border-(length:--border-width-strong)",
            size === "sm"
              ? "inset-x-2 h-3.5 rounded-xs"
              : "inset-x-2 h-4 rounded-xs @prose:inset-x-3 @prose:h-8 @prose:rounded-md"
          )}
          style={{ borderColor: `var(${t.cssVar})` }}
        />
      ) : null}
    </div>
  )
}

/*
 * The backdrop only shows against something to dim: a few lines of page
 * content, with the backdrop over the right two thirds so the dimmed part
 * sits next to the clear one. On a black canvas a plain fill shows nothing.
 */
function OverlayScene() {
  return (
    <>
      <span className="absolute inset-x-2 top-1/2 grid -translate-y-1/2 gap-1.5 @prose:inset-x-3">
        <span className="h-1.5 w-full rounded-full bg-foreground" />
        <span className="h-1.5 w-3/4 rounded-full bg-muted-foreground" />
        <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground" />
      </span>
      <span className="absolute inset-y-0 right-0 left-1/3" style={{ backgroundColor: "var(--overlay)" }} />
    </>
  )
}

/** Light on the left, dark on the right. */
function RoleSwatch({ role, size = "md", className }: { role: Role; size?: "sm" | "md"; className?: string }) {
  return (
    <div aria-hidden className={cn("relative grid grid-cols-2 overflow-hidden rounded-lg border", className)}>
      <SwatchHalf role={role} mode="light" size={size} />
      <SwatchHalf role={role} mode="dark" size={size} />
      {/*
       * The hairline between the halves keeps them apart when both modes
       * share a value. It sits outside both mode scopes so it takes the
       * page's border colour, like the frame around it.
       */}
      <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
    </div>
  )
}

/**
 * One mode's primitives for a role, in the theme the page is on. Wraps
 * between the fill and its text role, never inside one, and the separator
 * stays at the end of the line it follows rather than starting the next.
 */
function RefLine({ role, mode }: { role: Role; mode: Mode }) {
  return (
    <dd className="flex flex-wrap gap-x-1.5 font-mono text-xs text-foreground">
      <ByTheme by={(theme) => roleRefs(role, mode, theme)}>
        {(theme) => {
          const refs = roleRefs(role, mode, theme).split(" · ")
          return refs.map((ref, i) => (
            <span key={i} className="whitespace-nowrap">
              {ref}
              {i < refs.length - 1 ? " ·" : ""}
            </span>
          ))
        }}
      </ByTheme>
    </dd>
  )
}

const modeRows: { mode: Mode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
]

/*
 * From @prose, tiles sit several to a row: the text column fills the row's
 * height and the Light and Dark lines sit at its foot, so they line up across
 * tiles whose descriptions differ in length.
 */
function RoleTile({ role, compact = false }: { role: Role; compact?: boolean }) {
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start items-start gap-4 @prose:grid-cols-1 @prose:grid-rows-[auto_minmax(0,1fr)] @prose:items-stretch">
      <RoleSwatch role={role} className={compact ? "h-14" : "h-16"} />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h4 className="text-title text-foreground">{roleName(role.token)}</h4>
        <CodeList value={roleUtilities(role)} className="text-muted-foreground" />
        {!compact && roleDescription(role) ? <p className="text-caption text-copy">{roleDescription(role)}</p> : null}
        {/* One line per mode, label first: the same at every width, and it fits four-across tiles. */}
        <div className="mt-auto pt-1">
          <dl className="grid gap-1 border-t pt-2.5">
            {modeRows.map(({ mode, label }) => (
              <div key={mode} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-2">
                <dt className="text-caption text-muted-foreground">{label}</dt>
                <RefLine role={role} mode={mode} />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------------ */
/* Sidebar: a compact table, since it mirrors the page roles                  */
/* ------------------------------------------------------------------------ */

const pageRoles = tokens.filter((t) => t.tier === "semantic" && t.group !== "sidebar")

function sameValues(a: DesignToken, b: DesignToken, theme: ThemeId) {
  const x = themeValues(a, theme)
  const y = themeValues(b, theme)
  return x.light === y.light && x.dark === y.dark
}

/**
 * The page role a sidebar role copies in both modes of a theme, if any. A
 * role with the same name wins ("sidebar-accent" mirrors accent, not
 * secondary, which happens to share its values).
 */
function mirrorOf(role: Role, theme: ThemeId) {
  const twin = (t: DesignToken) => {
    const matches = pageRoles.filter((p) => sameValues(p, t, theme))
    const name = roleName(t).replace(/^sidebar-?/, "") || "background"
    return matches.find((p) => roleName(p) === name) ?? matches[0]
  }
  const fill = twin(role.token)
  if (!fill) return undefined
  return !role.on || twin(role.on) ? roleName(fill) : undefined
}

function SidebarRoles({ roles }: { roles: Role[] }) {
  const th = "h-(--table-row-height-sm) px-4 text-left text-caption font-semibold text-muted-foreground"
  const td = "align-middle @narrow:h-(--table-row-height) @narrow:px-4 @narrow:py-3"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">Sidebar colour roles in light and dark</caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={cn(th, "w-24")}>
              <span className="sr-only">Sample</span>
            </th>
            <th scope="col" className={th}>Role</th>
            <th scope="col" className={th}>Light</th>
            <th scope="col" className={th}>Dark</th>
            <th scope="col" className={th}>Mirrors</th>
          </tr>
        </thead>
        <tbody className="block @narrow:table-row-group">
          {roles.map((role) => {
            const mirror = perTheme((theme) => mirrorOf(role, theme) ?? "")
            const mirrorText = perTheme((theme) => mirror[theme] || "Own value")
            return (
              <tr
                key={role.token.cssVar}
                className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-t p-4 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
              >
                <td className={cn(td, "row-span-2")}>
                  <RoleSwatch role={role} size="sm" className="h-10 w-20 rounded-md" />
                </td>
                <td className={td}>
                  <div className="grid gap-0.5">
                    <span className="text-label text-foreground">{roleName(role.token)}</span>
                    <CodeList value={roleUtilities(role)} className="text-xs text-muted-foreground" />
                  </div>
                </td>
                {/* Small screens: the same labelled Light and Dark lines as the role tiles. */}
                <td className={cn(td, "col-start-2 @narrow:hidden")}>
                  <dl className="grid gap-1 border-t pt-2.5">
                    {modeRows.map(({ mode, label }) => (
                      <div key={mode} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2">
                        <dt className="text-caption text-muted-foreground">{label}</dt>
                        <RefLine role={role} mode={mode} />
                      </div>
                    ))}
                    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2">
                      <dt className="text-caption text-muted-foreground">Mirrors</dt>
                      <dd className="font-mono text-xs text-foreground">
                        <ThemeText value={mirrorText} />
                      </dd>
                    </div>
                  </dl>
                </td>
                {modeRows.map(({ mode }) => (
                  <td key={mode} className={cn(td, "hidden @narrow:table-cell")}>
                    <Meta className="text-foreground">
                      <ThemeText value={perTheme((theme) => roleRefs(role, mode, theme))} />
                    </Meta>
                  </td>
                ))}
                <td className={cn(td, "hidden @narrow:table-cell")}>
                  <ByTheme by={(theme) => mirror[theme]}>
                    {(theme) =>
                      mirror[theme] ? (
                        <code className="font-mono text-xs text-foreground">{mirror[theme]}</code>
                      ) : (
                        <Meta>Own value</Meta>
                      )
                    }
                  </ByTheme>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Semantic roles                                                            */
/* ------------------------------------------------------------------------ */

const groupBlurb: Record<string, string> = {
  "surface & text": "The canvas, its text colours and the surfaces that sit on it.",
  interactive: "Fills for actions, controls and hovered or selected rows.",
  brand: "The theme's accent, used sparingly: links, focus, active indicators and one highlighted word. Mono's accent is ink.",
  status: "Each status has a strong colour for text and fills, and a quiet fill for banners and badges.",
  "lines & focus": "Hairlines, control and overlay edges, the focus outline and the backdrop behind dialogs.",
  panel:
    "Dark emphasis surfaces. They stay dark in both modes and sit above the canvas in dark mode. Accents on them use the panel roles: panel-brand for the theme's accent, and panel-success, panel-warning and panel-destructive for status.",
  tint: "Flat decorative fills for covers, avatars and placeholders. The names are fixed; a theme may retune the colours, as Mono does with greys.",
  chart: "Data series in order. Marks take the fill and stroke utilities; chart config reads the variable.",
  sidebar: "The app sidebar copies the page roles, so an app shell can be themed on its own.",
}

const compactGroups = new Set(["tint", "chart"])

/*
 * Columns follow the number of roles, so rows come out full: four or eight
 * roles run four across (status pairs each strong colour with its subtle
 * fill), two run side by side, the rest three across.
 */
function gridFor(count: number, compact: boolean) {
  if (compact) return "@prose:grid-cols-3 @narrow:grid-cols-5"
  if (count % 4 === 0) return "@prose:grid-cols-2 @narrow:grid-cols-4"
  if (count === 2) return "@prose:grid-cols-2"
  return "@prose:grid-cols-2 @narrow:grid-cols-3"
}

function SemanticRoles() {
  return (
    <div className="grid gap-16">
      {semanticGroups().map((group) => {
        const roles = rolesOf(group.tokens)
        const compact = compactGroups.has(group.name)
        return (
          <div key={group.name} className="grid gap-6">
            <div className="grid gap-1">
              <SubHeading>{sentenceCase(group.name)}</SubHeading>
              {groupBlurb[group.name] ? (
                <p className="max-w-prose text-caption text-copy">{groupBlurb[group.name]}</p>
              ) : null}
            </div>
            {group.name === "sidebar" ? (
              <SidebarRoles roles={roles} />
            ) : (
              <ul className={cn("grid gap-x-6 gap-y-6 @prose:gap-y-10", gridFor(roles.length, compact))}>
                {roles.map((role) => (
                  <RoleTile key={role.token.cssVar} role={role} compact={compact} />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Scales                                                                    */
/* ------------------------------------------------------------------------ */

function trimNumber(n: number) {
  return String(Math.round(n * 1000) / 1000)
}

/** Steps every scale has (50 … 950). Every ramp is drawn on these columns, so step 500 lines up across hues. */
function sharedSteps(scales: ColorScale[]) {
  const [first, ...rest] = scales
  if (!first) return []
  return first.steps
    .map((s) => s.step)
    .filter((step) => rest.every((scale) => scale.steps.some((s) => s.step === step)))
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
  const middle = ["600", "500"].flatMap((step) => scale.steps.filter((s) => s.step === step))
  const coloured = [...middle, ...scale.steps].map((s) => channelsIn(s, theme, alias)).find((c) => (c?.c ?? 0) > 0)
  return coloured ? `Hue ${trimNumber(coloured.h)}` : "No hue"
}

/** A step's L or C, printed for the theme the page is on. */
function Channel({ step, channel, alias }: { step: Step; channel: "l" | "c"; alias: boolean }) {
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
  const main = steps.flatMap((step) => scale.steps.filter((s) => s.step === step))
  const extra = scale.steps.filter((s) => !steps.includes(s.step))
  const count = main.length
  const Heading = level === 3 ? "h3" : "h4"
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="grid gap-1">
          <Heading className={level === 3 ? "text-h3 text-foreground" : "text-h4 text-foreground"}>
            {title ?? sentenceCase(scale.name)}
          </Heading>
          {note ? <p className="text-caption text-muted-foreground">{note}</p> : null}
        </div>
        <Meta>
          <ThemeText value={perTheme((theme) => hueLabel(scale, theme, alias))} /> · L lightness · C chroma
        </Meta>
      </div>

      <ol
        aria-label={`${title ?? scale.name} scale`}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {main.map((s, i) => (
          <li key={s.step} className="grid min-w-0 content-start gap-2 @narrow:gap-3">
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
              <span className="font-mono text-xs font-semibold text-foreground">{s.step}</span>
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
            {extra.some((s) => s.step === "dim") && extra.length === 1 ? "Quiet dark-mode fill" : "Fine steps for UI greys"}
          </p>
          <ol aria-label={`${title ?? scale.name} fine steps`} className="flex flex-wrap gap-x-5 gap-y-3">
            {extra.map((s) => (
              <li key={s.step} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  title={alias ? undefined : s.value}
                  className="size-7 shrink-0 rounded-sm border"
                  style={{ backgroundColor: `var(${s.token.cssVar})` }}
                />
                <span className="grid">
                  <span className="font-mono text-xs font-semibold text-foreground">{s.step}</span>
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

const aliasTitles: Record<string, { title: string; role: ScaleRole; cssVar: string }> = {
  accent: { title: "Accent", role: "accent", cssVar: "--bk-accent-*" },
  neutral: { title: "Neutral", role: "neutral", cssVar: "--bk-neutral-*" },
}

function ThemeScaleRamps() {
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
                  <ThemeText value={perTheme((theme) => aliasSource(theme, themeById(theme).name, meta.role))} />
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
function AliasMap() {
  const th = "h-(--table-row-height-sm) px-5 text-left text-caption font-semibold text-muted-foreground"
  const td = "align-middle @narrow:h-(--table-row-height) @narrow:px-5 @narrow:py-3"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">The scale each theme points its accent and neutral at</caption>
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
                  <span className="text-label text-foreground">{theme.name}</span>
                  <OnlyInTheme theme={theme.id}>
                    <span className="text-caption text-muted-foreground">Current</span>
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
                      <span
                        aria-hidden
                        {...themeScopeProps(
                          theme.id,
                          undefined,
                          "grid h-6 w-32 shrink-0 grid-cols-11 overflow-hidden rounded-xs border border-border-strong"
                        )}
                      >
                        {rampSteps.map((step) => (
                          <span key={step} className={rampFill[role][step]} />
                        ))}
                      </span>
                      <span className="font-mono text-xs text-foreground">{aliasSummary(theme.id, role)}</span>
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
  accent: { title: "Accents", blurb: "Hues a preset points its accent scale at." },
  neutral: {
    title: "Neutrals",
    blurb: "Greys from 0 (white) to 1000 (the dark canvas) that a preset uses as its neutral scale.",
  },
  status: {
    title: "Status",
    blurb: "Read by success, warning, destructive and info in every theme, so a status keeps its meaning.",
  },
}

/** "Blocks accent", "Mono accent and neutral", or how a scale is used when no theme points at it. */
function usedBy(scale: ColorScale, kind: ScaleKind) {
  if (kind === "status") return "Status roles in every theme"
  const uses = themesUsing(scale.name)
  if (!uses.length) return "Not used by a preset"
  const names = [...new Set(uses.map((u) => u.theme.name))]
  return names
    .map((name) => `${name} ${uses.filter((u) => u.theme.name === name).map((u) => u.role).join(" and ")}`)
    .join(", ")
}

/** True for status scales and for scales a preset points its accent or neutral at. */
function inUse(scale: ColorScale) {
  return scaleKind(scale) === "status" || themesUsing(scale.name).length > 0
}

/** A fixed scale no preset uses, at a glance: name, kind, hue and a strip of its steps. */
function AvailableScale({ scale, steps }: { scale: ColorScale; steps: string[] }) {
  const main = steps.flatMap((step) => scale.steps.filter((s) => s.step === step))
  return (
    <li className="grid min-w-0 gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-foreground">
          {sentenceCase(scale.name)}{" "}
          <span className="font-normal text-muted-foreground">· {scaleKind(scale)}</span>
        </span>
        <Meta>{hueLabel(scale, defaultThemeId, false)}</Meta>
      </div>
      <span
        aria-hidden
        className="grid h-8 overflow-hidden rounded-md border"
        style={{ gridTemplateColumns: `repeat(${main.length}, minmax(0, 1fr))` }}
      >
        {main.map((s) => (
          <span key={s.step} title={s.value} style={{ backgroundColor: `var(${s.token.cssVar})` }} />
        ))}
      </span>
      <Code className="text-muted-foreground">{`color.${scale.name}.*`}</Code>
    </li>
  )
}

function FixedScales() {
  const scales = fixedScales()
  const steps = sharedSteps(scales)
  const available = scales.filter((scale) => !inUse(scale))
  return (
    <div className="grid gap-16">
      {(["accent", "neutral", "status"] as const).map((kind) => {
        const group = scales.filter((scale) => scaleKind(scale) === kind && inUse(scale))
        if (!group.length) return null
        return (
          <div key={kind} className="grid gap-10">
            <div className="grid gap-1">
              <SubHeading>{kindBlurb[kind].title}</SubHeading>
              <p className="max-w-prose text-caption text-copy">{kindBlurb[kind].blurb}</p>
            </div>
            {group.map((scale) => (
              <Ramp key={scale.name} scale={scale} steps={steps} level={4} note={usedBy(scale, kind)} />
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
              Ready-made accents and neutrals that no preset points at yet. A theme can use one in place of its own
              values by pointing each alias step at it, such as <Code>{"{color.blue.600}"}</Code>. Every step is listed
              on the{" "}
              <Link
                href="/foundations/tokens"
                className="text-brand link-underline outline-none focus-visible:focus-ring"
              >
                Tokens page
              </Link>
              .
            </p>
          </div>
          <ul aria-label="Available scales" className="grid gap-x-10 gap-y-8 @prose:grid-cols-2">
            {available.map((scale) => (
              <AvailableScale key={scale.name} scale={scale} steps={steps} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Contrast                                                                  */
/* ------------------------------------------------------------------------ */

const contrastPairs: { text: string; surface: string; use: string }[] = [
  { text: "--foreground", surface: "--background", use: "Headings and primary text" },
  { text: "--copy", surface: "--background", use: "Paragraphs" },
  { text: "--muted-foreground", surface: "--background", use: "Meta text and captions" },
  { text: "--muted-foreground", surface: "--subtle", use: "Captions on tinted bands" },
  { text: "--primary-foreground", surface: "--primary", use: "Primary buttons" },
  { text: "--secondary-foreground", surface: "--secondary", use: "Secondary buttons" },
  { text: "--brand", surface: "--background", use: "Links and highlights" },
  { text: "--brand-foreground", surface: "--brand", use: "Brand buttons" },
  { text: "--brand-subtle-foreground", surface: "--brand-subtle", use: "Quiet brand fills" },
  { text: "--destructive", surface: "--background", use: "Error messages" },
  { text: "--destructive-foreground", surface: "--destructive", use: "Destructive buttons" },
  { text: "--success", surface: "--background", use: "Success text" },
  { text: "--warning", surface: "--background", use: "Warning text" },
  { text: "--info", surface: "--background", use: "Informational text" },
  { text: "--panel-foreground", surface: "--panel", use: "Headings on panels" },
  { text: "--panel-muted", surface: "--panel", use: "Body text on panels" },
  { text: "--panel-brand", surface: "--panel", use: "Links and highlights on panels" },
  { text: "--panel-success", surface: "--panel", use: "Success on panels" },
  { text: "--panel-warning", surface: "--panel", use: "Warnings on panels" },
  { text: "--panel-destructive", surface: "--panel", use: "Errors on panels" },
  { text: "--terminal-foreground", surface: "--terminal", use: "Code and terminal output" },
]

/** The ratio, with the level it reaches as quiet text. Only a failure gets a badge. */
function Ratio({ ratio, label }: { ratio: number | null; label: string }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const level = wcagLevel(ratio)
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-caption text-muted-foreground @narrow:hidden">{label}</span>
      <span className="font-mono text-label text-foreground tabular">{formatRatio(ratio)}</span>
      {level === "Fail" ? (
        <Badge variant="destructive">Fail</Badge>
      ) : (
        <span className="text-caption text-muted-foreground">{level}</span>
      )}
    </div>
  )
}

/** The ratio a pair reaches in one mode, printed for the theme the page is on. */
function ThemedRatio({ ratios, mode, label }: { ratios: Record<ThemeId, Record<Mode, number | null>>; mode: Mode; label: string }) {
  const key = (theme: ThemeId) => {
    const r = ratios[theme][mode]
    return r === null ? "none" : `${formatRatio(r)} ${wcagLevel(r)}`
  }
  return (
    <ByTheme as="div" by={key}>
      {(theme) => <Ratio ratio={ratios[theme][mode]} label={label} />}
    </ByTheme>
  )
}

/** The pair as each mode paints it: two equal chips, each with its own hairline. */
function Sample({ text, surface }: { text: string; surface: string }) {
  return (
    <div aria-hidden className="flex gap-2">
      {(["light", "dark"] as const).map((mode) => (
        <span key={mode} className="block size-10 overflow-hidden rounded-md border border-border-strong">
          <span className={cn(mode, "block size-full bg-background")}>
            <span
              className="grid size-full place-items-center text-title"
              style={{ color: `var(${text})`, backgroundColor: `var(${surface})` }}
            >
              Aa
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

function ContrastTable() {
  const canvas = tokenByVar("--background")
  if (!canvas) return null

  const rows = contrastPairs.flatMap((pair) => {
    const text = tokenByVar(pair.text)
    const surface = tokenByVar(pair.surface)
    if (!text || !surface) return []
    const ratios = perTheme((theme) => {
      const c = themeValues(canvas, theme)
      const t = themeValues(text, theme)
      const s = themeValues(surface, theme)
      return {
        light: textContrast(t.light, s.light, c.light),
        dark: textContrast(t.dark, s.dark, c.dark),
      }
    })
    return [{ ...pair, ratios }]
  })

  const th = "h-(--table-row-height-sm) px-5 text-left text-caption font-semibold text-muted-foreground"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">WCAG contrast of key text and surface pairs in light and dark, for the current theme</caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={th}>Sample</th>
            <th scope="col" className={th}>Text on surface</th>
            <th scope="col" className={th}>Light</th>
            <th scope="col" className={th}>Dark</th>
          </tr>
        </thead>
        <tbody className="block @narrow:table-row-group">
          {rows.map((r) => (
            <tr
              key={`${r.text}-${r.surface}`}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 border-t p-5 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
            >
              <td className="row-span-2 align-middle @narrow:h-(--table-row-height) @narrow:w-32 @narrow:px-5 @narrow:py-3">
                <Sample text={r.text} surface={r.surface} />
              </td>
              <td className="align-middle @narrow:px-5 @narrow:py-3">
                <div className="grid gap-0.5">
                  <span className="text-label text-foreground">
                    {r.text.slice(2)} <span className="font-normal text-muted-foreground">on</span>{" "}
                    {r.surface.slice(2)}
                  </span>
                  <span className="text-caption text-copy">{r.use}</span>
                </div>
              </td>
              <td className="col-start-2 align-middle @narrow:px-5 @narrow:py-3">
                <div className="flex flex-wrap gap-x-6 gap-y-2 @narrow:block">
                  <ThemedRatio ratios={r.ratios} mode="light" label="Light" />
                  <div className="@narrow:hidden">
                    <ThemedRatio ratios={r.ratios} mode="dark" label="Dark" />
                  </div>
                </div>
              </td>
              <td className="hidden align-middle @narrow:table-cell @narrow:px-5 @narrow:py-3">
                <ThemedRatio ratios={r.ratios} mode="dark" label="Dark" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function ColorsFoundation({ title, description }: { title: string; description: string }) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="roles"
        title="Semantic roles"
        description={
          <>
            Components only use roles, so changing the theme or the mode never touches component code. Most roles point
            at a step of the theme scales below (<Code>neutral.950</Code>, <Code>accent.600</Code>); status roles read
            the fixed status scales. Dark-mode lines, both overlays and the panel&apos;s muted text and hairline are a
            step at reduced opacity, and tuned one-offs show as raw OKLCH. Swatches show light on the left and dark on
            the right, in the theme you are on, and the values listed are that theme&apos;s; Aa is the text role made
            for that fill.
          </>
        }
      >
        <SemanticRoles />
      </Section>

      <Section
        id="theme-scales"
        title="Theme scales"
        description={
          <>
            Two alias scales sit between the roles and the raw colours: accent (<Code>--bk-accent-*</Code>) and neutral
            (<Code>--bk-neutral-*</Code>). Roles read them, never a hue by name, and each theme points them at its own
            colours: a fixed scale below, or values of its own. The ramps and numbers show the theme you are on.
          </>
        }
      >
        <div className="grid gap-12">
          <ThemeScaleRamps />
          <div className="grid gap-6">
            <SubHeading>In every theme</SubHeading>
            <AliasMap />
          </div>
        </div>
      </Section>

      <Section
        id="scales"
        title="Fixed scales"
        description="Raw OKLCH ramps with even lightness steps across hues, drawn on shared columns so each step lines up. They are the same in every theme and are never used in components directly."
      >
        <FixedScales />
      </Section>

      <Section
        id="contrast"
        title="Contrast"
        description="WCAG 2 ratios for the pairs people read most, computed from the token values of the theme you are on. Body text needs AA (4.5:1); large text and icons need 3:1. The build checks every theme the same way."
      >
        <ContrastTable />
      </Section>
    </FoundationPage>
  )
}
