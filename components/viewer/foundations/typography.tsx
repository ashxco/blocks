import * as React from "react"

import {
  describeSize,
  familyStack,
  leafName,
  sentenceCase,
  tokenByName,
  tokensIn,
  typeValue,
} from "./data"
import { Code, FoundationPage, Meta, Section } from "./layout"
import { TypeSpecimens, type RoleSpec } from "./type-specimens"

/* Literal class names so Tailwind generates every step and weight. */
const scaleClass: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
}

const weightClass: Record<string, string> = {
  "font-normal": "font-normal",
  "font-medium": "font-medium",
  "font-semibold": "font-semibold",
  "font-bold": "font-bold",
  "font-extrabold": "font-extrabold",
}

function roleSpecs(): RoleSpec[] {
  return tokensIn("typography", "roles").flatMap((t) => {
    const v = typeValue(t)
    if (!v) return []
    return [
      {
        key: leafName(t.name),
        utility: t.utility ?? `text-${leafName(t.name)}`,
        description: t.description,
        size: describeSize(v.fontSize),
        lineHeight: v.lineHeight,
        tracking: v.letterSpacing,
        weight: String(v.fontWeight),
      },
    ]
  })
}

/* ------------------------------------------------------------------------ */
/* Scale ladder                                                              */
/* ------------------------------------------------------------------------ */

function ScaleLadder() {
  const steps = tokensIn("typography", "scale")
  return (
    <ol className="grid">
      {steps.map((t) => {
        const v = typeValue(t)
        const step = leafName(t.name)
        if (!v) return null
        return (
          <li
            key={t.name}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4 @prose:grid-cols-[8rem_6rem_minmax(0,1fr)]"
          >
            <code className="font-mono text-label text-foreground">{t.utility ?? `text-${step}`}</code>
            <Meta className="hidden @prose:block">
              {describeSize(v.fontSize)} / {v.lineHeight}
            </Meta>
            <span className={`${scaleClass[step] ?? "text-base"} min-w-0 truncate font-extrabold text-foreground`}>
              Lumen
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------------ */
/* Families                                                                  */
/* ------------------------------------------------------------------------ */

/** Token descriptions start with the family name, which the card already shows. */
function withoutName(description: string | undefined, name: string) {
  return description?.startsWith(`${name}. `) ? description.slice(name.length + 2) : description
}

const metrics: [label: string, value: string][] = [
  ["Build time", "41.2s"],
  ["Requests today", "1,284,310"],
  ["Error rate", "0.02%"],
  ["Region", "iad1"],
]

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowercase = "abcdefghijklmnopqrstuvwxyz"
const figures = "0123456789 & @ # % ( ) → ·"

function Families() {
  const sans = tokenByName("font.family.sans")
  const mono = tokenByName("font.family.mono")
  const weights = tokensIn("primitive", "font-weight")

  return (
    <div className="grid gap-6 @narrow:grid-cols-2">
      {/* Sans */}
      <div className="grid content-start gap-10 rounded-(--panel-radius) border bg-card p-(--card-padding) @prose:p-10">
        <div className="grid gap-2">
          <h3 className="text-h3">Plus Jakarta Sans</h3>
          <p className="text-caption text-copy">{withoutName(sans?.description, "Plus Jakarta Sans")}</p>
          <Code className="text-muted-foreground">font-sans · font-heading</Code>
        </div>
        <p aria-hidden className="text-7xl leading-none font-extrabold text-foreground">
          Aa
        </p>
        <div aria-label="Glyph sample" className="grid gap-1 font-sans text-xl text-foreground [overflow-wrap:anywhere]">
          <span>{uppercase}</span>
          <span>{lowercase}</span>
          <span className="tabular">{figures}</span>
        </div>
        <ul className="grid border-b">
          {weights.map((w) => (
            <li key={w.name} className="flex items-baseline justify-between gap-4 border-t py-3">
              <span className={`${weightClass[w.utility ?? ""] ?? ""} text-2xl text-foreground`}>
                {sentenceCase(leafName(w.name))}
              </span>
              <Meta>
                {String(w.value)} · {w.utility}
              </Meta>
            </li>
          ))}
        </ul>
        <Meta className="[overflow-wrap:anywhere]">{familyStack(sans?.value)}</Meta>
      </div>

      {/* Mono, on a panel */}
      <div className="grid content-start gap-10 rounded-(--panel-radius) bg-panel p-(--card-padding) text-panel-foreground @prose:p-10">
        <div className="grid gap-2">
          <h3 className="text-h3 text-panel-foreground">Geist Mono</h3>
          <p className="text-caption text-panel-muted">{withoutName(mono?.description, "Geist Mono")}</p>
          <code className="font-mono text-code text-panel-muted">font-mono</code>
        </div>
        <p aria-hidden className="font-mono text-7xl leading-none font-bold text-panel-foreground">
          Aa
        </p>
        <div aria-label="Glyph sample" className="grid gap-1 font-mono text-lg text-panel-foreground [overflow-wrap:anywhere]">
          <span>{uppercase}</span>
          <span>{lowercase}</span>
          <span>{"0123456789 {} [] <> => != #"}</span>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-panel-border bg-terminal p-5 font-mono text-code text-terminal-foreground">
          <code>
            <span className="text-panel-muted">$ </span>lumen deploy --prod{"\n"}
            <span className="text-panel-muted">Building lumen-web at a1f9c2e{"\n"}</span>
            Ready in 41s
          </code>
        </pre>
        <dl className="grid border-b border-panel-border">
          {metrics.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-t border-panel-border py-3">
              <dt className="text-label text-panel-muted">{label}</dt>
              <dd className="font-mono text-xl text-panel-foreground tabular">{value}</dd>
            </div>
          ))}
        </dl>
        <span className="font-mono text-xs text-panel-muted [overflow-wrap:anywhere]">{familyStack(mono?.value)}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function TypographyFoundation({ title, description }: { title: string; description: string }) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="roles"
        title="Type roles"
        description="One utility sets size, line height, tracking and weight together. Pick the role for the job; never assemble type by hand. Headings are always extra-bold and full ink."
      >
        <TypeSpecimens roles={roleSpecs()} />
      </Section>

      <Section
        id="scale"
        title="Size scale"
        description="A plain size ladder for dense interfaces: tables, dashboards and settings. Marketing and docs pages use the roles above."
      >
        <ScaleLadder />
      </Section>

      <Section
        id="families"
        title="Families"
        description="Two families and five weights. There are no light weights and no slanted styles."
      >
        <Families />
      </Section>
    </FoundationPage>
  )
}
