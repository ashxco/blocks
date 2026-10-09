import * as React from "react"

import { formatRatio, textContrast, wcagLevel } from "./color"
import {
  colorAlias,
  primaryColorUtility,
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

/** Roles listed right after a related role rather than in source order. */
const placeAfter: Record<string, string> = { "--panel-brand": "--panel-muted" }

function ordered(list: DesignToken[]) {
  const rest = list.filter((t) => !placeAfter[t.cssVar])
  for (const t of list) {
    const anchor = placeAfter[t.cssVar]
    if (!anchor) continue
    const i = rest.findIndex((r) => r.cssVar === anchor)
    rest.splice(i === -1 ? rest.length : i + 1, 0, t)
  }
  return rest
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

function rolesOf(list: DesignToken[]): Role[] {
  const inGroup = new Set(list.map((t) => t.cssVar))
  const folded = new Set(list.filter((t) => inGroup.has(parentOf(t) ?? "")).map((t) => t.cssVar))
  return ordered(list)
    .filter((t) => !folded.has(t.cssVar))
    .map((t) => {
      const on = list.find((f) => folded.has(f.cssVar) && parentOf(f) === t.cssVar)
      const utility = primaryColorUtility(t)
      const kind = on
        ? "fill"
        : utility.startsWith("text-") && !utility.includes("bg-")
          ? "text"
          : utility.startsWith("border-") || utility.startsWith("outline-")
            ? "line"
            : "fill"
      return { token: t, on, kind }
    })
}

function roleUtilities(role: Role) {
  const fill = primaryColorUtility(role.token)
  return role.on ? `${fill} · ${primaryColorUtility(role.on)}` : fill
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
      {role.kind === "fill" ? (
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
          // A control-shaped outline: reads as a line at every swatch width.
          className="absolute inset-x-2 top-1/2 h-6 -translate-y-1/2 rounded-sm border-(length:--border-width-strong) @prose:inset-x-3 @prose:h-8 @prose:rounded-md"
          style={{ borderColor: `var(${t.cssVar})` }}
        />
      ) : null}
    </div>
  )
}

/** Light on the left, dark on the right. */
function RoleSwatch({ role, size = "md", className }: { role: Role; size?: "sm" | "md"; className?: string }) {
  return (
    // The hairline between the halves keeps them apart when both themes share a value.
    <div aria-hidden className={cn("grid grid-cols-2 divide-x overflow-hidden rounded-lg border", className)}>
      <SwatchHalf role={role} theme="light" size={size} />
      <SwatchHalf role={role} theme="dark" size={size} />
    </div>
  )
}

/** One theme's primitives for a role. Wraps between the fill and its text role, never inside one. */
function RefLine({ role, theme }: { role: Role; theme: "light" | "dark" }) {
  return (
    <dd className="flex flex-wrap gap-x-1.5 font-mono text-xs text-foreground">
      {roleRefs(role, theme)
        .split(" · ")
        .map((ref, i) => (
          <span key={i} className="whitespace-nowrap">
            {i > 0 ? "· " : ""}
            {ref}
          </span>
        ))}
    </dd>
  )
}

function RoleTile({ role, compact = false }: { role: Role; compact?: boolean }) {
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start items-start gap-4 @prose:grid-cols-1">
      <RoleSwatch role={role} className={compact ? "h-14" : "h-16"} />
      <div className="grid min-w-0 gap-1.5">
        <h4 className="text-title text-foreground">{roleName(role.token)}</h4>
        <CodeList value={roleUtilities(role)} className="text-muted-foreground" />
        {!compact && roleDescription(role) ? <p className="text-caption text-copy">{roleDescription(role)}</p> : null}
        {/* One line per theme, label first: the same at every width, and it fits four-across tiles. */}
        <dl className="mt-1 grid gap-1 border-t pt-2.5">
          {(["light", "dark"] as const).map((theme) => (
            <div key={theme} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-2">
              <dt className="text-caption text-muted-foreground">{theme === "light" ? "Light" : "Dark"}</dt>
              <RefLine role={role} theme={theme} />
            </div>
          ))}
        </dl>
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
  "lines & focus": "Hairlines, control borders, the focus outline and the backdrop behind dialogs.",
  panel: "Dark emphasis surfaces. They stay dark in both themes; use panel-brand for violet on them.",
  tint: "Flat decorative fills for covers, avatars and placeholders.",
  chart: "Data series in order. Fill marks with fill-chart-1, or read var(--chart-1) in chart config.",
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
        description="Components only use roles, so switching theme never touches component code. Most roles point at a primitive in each theme; lines and overlays are a primitive at reduced opacity, and the dark subtle fills and tints are tuned one-offs, shown as raw OKLCH. Every swatch shows light on the left and dark on the right; Aa is the text role made for that fill."
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
