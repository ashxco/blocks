import * as React from "react"

import { formatRatio, parseOklch, textContrast, wcagLevel, type WcagLevel } from "./color"
import {
  lightColor,
  primaryColorUtility,
  primitiveScales,
  refLabel,
  roleName,
  semanticGroups,
  sentenceCase,
  themeValues,
  tokenByVar,
  tokens,
  type ColorScale,
  type DesignToken,
} from "./data"
import { Code, cx, DarkScope, FoundationPage, Meta, Section, SubHeading, ThemeSwatch } from "./layout"

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const primitiveColors = tokens.filter((t) => t.tier === "primitive" && t.type === "color")

/**
 * Names the primitive behind a colour value: the token reference when there
 * is one, otherwise the primitive with the same OKLCH channels plus opacity
 * ("ink.0 at 9%").
 */
function describeColor(value: string, ref?: string) {
  if (ref) return refLabel(ref) ?? value
  const parsed = parseOklch(value)
  if (!parsed) return value
  const match = primitiveColors.find((p) => {
    const q = parseOklch(p.value)
    return q && q.l === parsed.l && q.c === parsed.c && (q.c === 0 || q.h === parsed.h)
  })
  const base = match ? refLabel(match.name) : parsed.l === 0 && parsed.c === 0 ? "black" : value
  return parsed.alpha < 1 ? `${base} at ${Math.round(parsed.alpha * 100)}%` : String(base)
}

function swatchBase(t: DesignToken) {
  return t.group === "panel" && roleName(t) !== "panel" && roleName(t) !== "terminal" ? "panel" : "background"
}

/* ------------------------------------------------------------------------ */
/* Semantic roles                                                            */
/* ------------------------------------------------------------------------ */

function RoleCard({ token }: { token: DesignToken }) {
  const role = roleName(token)
  const light = describeColor(String(token.value), token.ref)
  const dark = token.dark ? describeColor(String(token.dark.value), token.dark.ref) : light
  const base = swatchBase(token)
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start items-start gap-4 @prose:grid-cols-1">
      <div className="grid h-20 grid-cols-2 overflow-hidden rounded-(--card-radius) border @prose:h-28">
        <ThemeSwatch cssVar={token.cssVar} theme="light" base={base} />
        <ThemeSwatch cssVar={token.cssVar} theme="dark" base={base} />
      </div>
      <div className="grid min-w-0 gap-1.5">
        <h4 className="text-title [overflow-wrap:anywhere]">{role}</h4>
        <Code className="text-muted-foreground [overflow-wrap:anywhere]">{primaryColorUtility(token)}</Code>
        {token.description ? <p className="text-caption text-copy">{token.description}</p> : null}
        <dl className="mt-1 grid grid-cols-2 gap-3 border-t pt-3">
          <div className="grid gap-0.5">
            <dt className="text-caption text-muted-foreground">Light</dt>
            <dd className="font-mono text-xs text-foreground">{light}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-caption text-muted-foreground">Dark</dt>
            <dd className="font-mono text-xs text-foreground">{dark}</dd>
          </div>
        </dl>
      </div>
    </li>
  )
}

function SemanticRoles() {
  return (
    <div className="grid gap-16">
      {semanticGroups().map((group) => (
        <div key={group.name} className="grid gap-8">
          <SubHeading>{sentenceCase(group.name)}</SubHeading>
          <ul className="grid gap-x-6 gap-y-12 @prose:grid-cols-2 @narrow:grid-cols-3">
            {group.tokens.map((t) => (
              <RoleCard key={t.cssVar} token={t} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Primitive scales                                                          */
/* ------------------------------------------------------------------------ */

function trimNumber(n: number) {
  return String(Math.round(n * 1000) / 1000)
}

function Ramp({ scale }: { scale: ColorScale }) {
  const hue = scale.steps.find((s) => (s.oklch?.c ?? 0) > 0)?.oklch?.h
  const count = scale.steps.length
  return (
    <div className="grid gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-h4">{sentenceCase(scale.name)}</h3>
        {hue !== undefined ? <Meta>Hue {trimNumber(hue)}</Meta> : null}
      </div>

      {/* Wide: one continuous ramp with labels under each step. */}
      <ol
        aria-label={`${scale.name} scale`}
        className="hidden @narrow:grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {scale.steps.map((s, i) => (
          <li key={s.step} className="grid content-start gap-3">
            <div
              className={cx(
                "h-24 border-y",
                i === 0 && "rounded-l-lg border-l",
                i === count - 1 && "rounded-r-lg border-r"
              )}
              style={{ backgroundColor: `var(${s.token.cssVar})` }}
            />
            <div className="grid gap-0.5 pr-2">
              <span className="font-mono text-xs font-semibold text-foreground">{s.step}</span>
              {s.oklch ? (
                <>
                  <Meta>{trimNumber(s.oklch.l)}</Meta>
                  <Meta>{trimNumber(s.oklch.c)}</Meta>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {/* Narrow: a list with the full OKLCH value. */}
      <ol aria-label={`${scale.name} scale`} className="grid overflow-hidden rounded-(--card-radius) border @narrow:hidden">
        {scale.steps.map((s) => (
          <li key={s.step} className="flex items-center gap-4 border-t px-3 py-2 first:border-t-0">
            <span
              aria-hidden
              className="size-9 shrink-0 rounded-sm border"
              style={{ backgroundColor: `var(${s.token.cssVar})` }}
            />
            <span className="w-10 font-mono text-xs font-semibold text-foreground">{s.step}</span>
            <Meta className="ml-auto text-right">{s.value}</Meta>
          </li>
        ))}
      </ol>
    </div>
  )
}

function PrimitiveScales() {
  return (
    <div className="grid gap-14">
      <p className="text-caption text-muted-foreground @narrow:block hidden">
        Under each step: OKLCH lightness, then chroma.
      </p>
      {primitiveScales().map((scale) => (
        <Ramp key={scale.name} scale={scale} />
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
  { text: "--terminal-foreground", surface: "--terminal", use: "Code and terminal output" },
]

const levelStyles: Record<WcagLevel, string> = {
  AAA: "bg-success-subtle text-success",
  AA: "bg-success-subtle text-success",
  "AA Large": "bg-warning-subtle text-warning",
  Fail: "bg-destructive-subtle text-destructive",
}

function Ratio({ ratio, theme }: { ratio: number | null; theme: string }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const level = wcagLevel(ratio)
  return (
    <div className="flex items-center gap-3">
      <span className="text-caption text-muted-foreground @narrow:hidden">{theme}</span>
      <span className="font-mono text-label text-foreground tabular">{formatRatio(ratio)}</span>
      <span
        className={cx(
          "inline-flex h-(--badge-height) items-center rounded-(--badge-radius) px-2 text-xs font-semibold whitespace-nowrap",
          levelStyles[level]
        )}
      >
        {level}
      </span>
    </div>
  )
}

function Sample({ text, surface }: { text: string; surface: string }) {
  const chip = "grid size-11 place-items-center rounded-md border text-title"
  return (
    <div className="flex gap-1.5">
      <span
        className={chip}
        style={{ color: lightColor(text), backgroundColor: lightColor(surface), borderColor: lightColor("--border") }}
      >
        Aa
      </span>
      <DarkScope>
        <span className={chip} style={{ color: `var(${text})`, backgroundColor: `var(${surface})` }}>
          Aa
        </span>
      </DarkScope>
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

  const th = "h-11 px-5 text-left text-caption font-semibold text-muted-foreground"
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
        description="Components only use roles. Each role points at a primitive in light and dark, so switching theme never touches component code. In every pair, light is on the left and dark on the right."
      >
        <SemanticRoles />
      </Section>

      <Section
        id="scales"
        title="Primitive scales"
        description="Raw OKLCH ramps with even lightness steps across hues. They feed the roles above and are never used in components directly."
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
