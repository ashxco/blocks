import * as React from "react"

import { formatRatio, textContrast, wcagLevel } from "./color"
import {
  colorAlias,
  primitiveScales,
  roleName,
  semanticGroups,
  sentenceCase,
  themeValues,
  tokenByVar,
  tokens,
  type ColorScale,
  type DesignToken,
} from "./data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { CodeList, FoundationPage, Meta, Section, SubHeading } from "./layout"

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

/** The primitive behind a colour value, or the raw value for a tuned one-off. */
function describeColor(value: string, ref?: string) {
  return colorAlias(value, ref) ?? value
}

function lightRef(t: DesignToken) {
  return describeColor(String(t.value), t.ref)
}

function darkRef(t: DesignToken) {
  return t.dark ? describeColor(String(t.dark.value), t.dark.ref) : lightRef(t)
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

function roleRefs(role: Role, theme: "light" | "dark") {
  const ref = theme === "light" ? lightRef : darkRef
  return role.on ? `${ref(role.token)} · ${ref(role.on)}` : ref(role.token)
}

/**
 * One theme's half of a role swatch, resolved inside a theme scope: a fill
 * with "Aa" in its text role, a text colour on its canvas, or a line drawn
 * as an outline.
 */
function SwatchHalf({ role, theme, size }: { role: Role; theme: "light" | "dark"; size: "sm" | "md" }) {
  const t = role.token
  const base = swatchBase(t)
  const text = size === "md" ? "text-h4" : "text-title"
  return (
    <div className={cn(theme, "relative grid place-items-center", base === "panel" ? "bg-panel" : "bg-background")}>
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
      <SwatchHalf role={role} theme="light" size={size} />
      <SwatchHalf role={role} theme="dark" size={size} />
      {/*
       * The hairline between the halves keeps them apart when both themes
       * share a value. It sits outside both theme scopes so it takes the
       * page's border colour, like the frame around it.
       */}
      <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
    </div>
  )
}

/**
 * One theme's primitives for a role. Wraps between the fill and its text
 * role, never inside one, and the separator stays at the end of the line it
 * follows rather than starting the next.
 */
function RefLine({ role, theme }: { role: Role; theme: "light" | "dark" }) {
  const refs = roleRefs(role, theme).split(" · ")
  return (
    <dd className="flex flex-wrap gap-x-1.5 font-mono text-xs text-foreground">
      {refs.map((ref, i) => (
        <span key={i} className="whitespace-nowrap">
          {ref}
          {i < refs.length - 1 ? " ·" : ""}
        </span>
      ))}
    </dd>
  )
}

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
        {/* One line per theme, label first: the same at every width, and it fits four-across tiles. */}
        <div className="mt-auto pt-1">
          <dl className="grid gap-1 border-t pt-2.5">
            {(["light", "dark"] as const).map((theme) => (
              <div key={theme} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-2">
                <dt className="text-caption text-muted-foreground">{theme === "light" ? "Light" : "Dark"}</dt>
                <RefLine role={role} theme={theme} />
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

function sameValues(a: DesignToken, b: DesignToken) {
  const x = themeValues(a)
  const y = themeValues(b)
  return x.light === y.light && x.dark === y.dark
}

/**
 * The page role a sidebar role copies in both themes, if any. A role with the
 * same name wins ("sidebar-accent" mirrors accent, not secondary, which
 * happens to share its values).
 */
function mirrorOf(role: Role) {
  const twin = (t: DesignToken) => {
    const matches = pageRoles.filter((p) => sameValues(p, t))
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
        <caption className="sr-only">Sidebar colour roles in both themes</caption>
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
            const mirror = mirrorOf(role)
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
                    {(["light", "dark"] as const).map((theme) => (
                      <div key={theme} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2">
                        <dt className="text-caption text-muted-foreground">{theme === "light" ? "Light" : "Dark"}</dt>
                        <RefLine role={role} theme={theme} />
                      </div>
                    ))}
                    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2">
                      <dt className="text-caption text-muted-foreground">Mirrors</dt>
                      <dd className={cn("font-mono text-xs", mirror ? "text-foreground" : "text-muted-foreground")}>
                        {mirror ?? "Own value"}
                      </dd>
                    </div>
                  </dl>
                </td>
                <td className={cn(td, "hidden @narrow:table-cell")}>
                  <Meta className="text-foreground">{roleRefs(role, "light")}</Meta>
                </td>
                <td className={cn(td, "hidden @narrow:table-cell")}>
                  <Meta className="text-foreground">{roleRefs(role, "dark")}</Meta>
                </td>
                <td className={cn(td, "hidden @narrow:table-cell")}>
                  {mirror ? <code className="font-mono text-xs text-foreground">{mirror}</code> : <Meta>Own value</Meta>}
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
  brand: "Violet, used sparingly: links, focus, active indicators and one highlighted word.",
  status: "Each status has a strong colour for text and fills, and a quiet fill for banners and badges.",
  "lines & focus": "Hairlines, control and overlay edges, the focus outline and the backdrop behind dialogs.",
  panel:
    "Dark emphasis surfaces. They stay dark in both themes and sit above the canvas in dark mode. Accents on them use the panel roles: panel-brand for violet, and panel-success, panel-warning and panel-destructive for status.",
  tint: "Flat decorative fills for covers, avatars and placeholders.",
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
/* Primitive scales                                                          */
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

function Ramp({ scale, steps }: { scale: ColorScale; steps: string[] }) {
  const hue = scale.steps.find((s) => (s.oklch?.c ?? 0) > 0)?.oklch?.h
  const main = steps.flatMap((step) => scale.steps.filter((s) => s.step === step))
  const extra = scale.steps.filter((s) => !steps.includes(s.step))
  const count = main.length
  return (
    <div className="grid gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <SubHeading>{sentenceCase(scale.name)}</SubHeading>
        <Meta>{hue !== undefined ? `Hue ${trimNumber(hue)} · ` : ""}L lightness · C chroma</Meta>
      </div>

      <ol
        aria-label={`${scale.name} scale`}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {main.map((s, i) => (
          <li key={s.step} className="grid min-w-0 content-start gap-2 @narrow:gap-3">
            <div
              title={s.value}
              className={cn(
                "h-12 border-y @narrow:h-20",
                i === 0 && "rounded-l-lg border-l",
                i === count - 1 && "rounded-r-lg border-r"
              )}
              style={{ backgroundColor: `var(${s.token.cssVar})` }}
            />
            <div className="grid gap-0.5 @narrow:pr-2">
              <span className="font-mono text-xs font-semibold text-foreground">{s.step}</span>
              {s.oklch ? (
                <span className="hidden gap-0.5 @narrow:grid">
                  <Meta>L {trimNumber(s.oklch.l)}</Meta>
                  <Meta>C {trimNumber(s.oklch.c)}</Meta>
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {extra.length ? (
        <div className="grid gap-3 @narrow:grid-cols-[auto_minmax(0,1fr)] @narrow:items-start @narrow:gap-6">
          <p className="text-caption text-muted-foreground @narrow:pt-1">Fine steps for UI greys</p>
          <ol aria-label={`${scale.name} fine steps`} className="flex flex-wrap gap-x-5 gap-y-3">
            {extra.map((s) => (
              <li key={s.step} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  title={s.value}
                  className="size-7 shrink-0 rounded-sm border"
                  style={{ backgroundColor: `var(${s.token.cssVar})` }}
                />
                <span className="grid">
                  <span className="font-mono text-xs font-semibold text-foreground">{s.step}</span>
                  {s.oklch ? <Meta>L {trimNumber(s.oklch.l)}</Meta> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}

function PrimitiveScales() {
  const scales = primitiveScales()
  const steps = sharedSteps(scales)
  return (
    <div className="grid gap-12">
      {scales.map((scale) => (
        <Ramp key={scale.name} scale={scale} steps={steps} />
      ))}
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
function Ratio({ ratio, theme }: { ratio: number | null; theme: string }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const level = wcagLevel(ratio)
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-caption text-muted-foreground @narrow:hidden">{theme}</span>
      <span className="font-mono text-label text-foreground tabular">{formatRatio(ratio)}</span>
      {level === "Fail" ? (
        <Badge variant="destructive">Fail</Badge>
      ) : (
        <span className="text-caption text-muted-foreground">{level}</span>
      )}
    </div>
  )
}

/** The pair as each theme paints it: two equal chips, each with its own hairline. */
function Sample({ text, surface }: { text: string; surface: string }) {
  return (
    <div aria-hidden className="flex gap-2">
      {(["light", "dark"] as const).map((theme) => (
        <span key={theme} className="block size-10 overflow-hidden rounded-md border border-border-strong">
          <span className={cn(theme, "block size-full bg-background")}>
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
  const canvasValues = themeValues(canvas)

  const rows = contrastPairs.flatMap((pair) => {
    const text = tokenByVar(pair.text)
    const surface = tokenByVar(pair.surface)
    if (!text || !surface) return []
    const t = themeValues(text)
    const s = themeValues(surface)
    return [
      {
        ...pair,
        light: textContrast(t.light, s.light, canvasValues.light),
        dark: textContrast(t.dark, s.dark, canvasValues.dark),
      },
    ]
  })

  const th = "h-(--table-row-height-sm) px-5 text-left text-caption font-semibold text-muted-foreground"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">WCAG contrast of key text and surface pairs in both themes</caption>
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
                  <Ratio ratio={r.light} theme="Light" />
                  <div className="@narrow:hidden">
                    <Ratio ratio={r.dark} theme="Dark" />
                  </div>
                </div>
              </td>
              <td className="hidden align-middle @narrow:table-cell @narrow:px-5 @narrow:py-3">
                <Ratio ratio={r.dark} theme="Dark" />
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
        description="Components only use roles, so switching theme never touches component code. Most roles point at a primitive in each theme. Dark-mode lines, both overlays and the panel's muted text and hairline are a primitive at reduced opacity; in dark mode the quiet fills (brand-subtle and the status -subtle roles) and the tints are tuned one-offs, shown as raw OKLCH. Every swatch shows light on the left and dark on the right; Aa is the text role made for that fill."
      >
        <SemanticRoles />
      </Section>

      <Section
        id="scales"
        title="Primitive scales"
        description="Raw OKLCH ramps with even lightness steps across hues, drawn on shared columns so each step lines up. They feed the roles above and are never used in components directly."
      >
        <PrimitiveScales />
      </Section>

      <Section
        id="contrast"
        title="Contrast"
        description="WCAG 2 ratios for the pairs people read most, computed from the token values. Body text needs AA (4.5:1); large text and icons need 3:1."
      >
        <ContrastTable />
      </Section>
    </FoundationPage>
  )
}
