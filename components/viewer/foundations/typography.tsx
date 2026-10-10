import * as React from "react"

import { ThemeText } from "./by-theme"
import {
  breakpointValues,
  describeSize,
  familyStack,
  leafName,
  perTheme,
  sentenceCase,
  themeById,
  tokenByName,
  tokensIn,
  typeValue,
  valueIn,
  type DesignToken,
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
        // Size · line height · tracking · weight, in each theme: a theme may retune tracking for its font.
        meta: perTheme((theme) => {
          const tv = typeValue({ ...t, value: valueIn(theme, t).value }) ?? v
          return [describeSize(tv.fontSize).replace(/ fluid$/, ""), tv.lineHeight, tv.letterSpacing, String(tv.fontWeight)].join(" · ")
        }),
        // Roles with breakpoint values: the size and line height from each breakpoint up.
        responsive: breakpointValues(t).flatMap((b) => {
          const bv = typeValue({ ...t, value: b.value })
          return bv ? [`From ${b.name}: ${describeSize(bv.fontSize)} / ${bv.lineHeight}`] : []
        }),
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
            {/* Medium, as the scale is used in tables and settings; bold belongs to the roles above. */}
            <span className={`${scaleClass[step] ?? "text-base"} min-w-0 truncate font-medium text-foreground`}>
              Acme
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

/** Token descriptions start with the family name ("Geist Mono. Code, …"), which the card already shows. */
function withoutName(description: string | undefined) {
  return description?.replace(/^[^.]+\.\s+/, "")
}

/** The family's name and its CSS stack in each theme. */
function familyIn(t: DesignToken | undefined, kind: "sans" | "mono") {
  return {
    name: perTheme((theme) => themeById(theme).fonts[kind]),
    stack: perTheme((theme) => (t ? familyStack(valueIn(theme, t).value) : "")),
  }
}

const metrics: [label: string, value: string][] = [
  ["Tasks completed", "1,284"],
  ["On-time delivery", "92%"],
  ["Automation runs", "7,240"],
  ["Storage used", "42 GB"],
]

/* Half alphabets per line, so no line wraps and leaves a few letters behind. */
const alphabet = ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "abcdefghijklm", "nopqrstuvwxyz"]
const figures = "0123456789 & @ # % ( ) → ·"

function Families() {
  const sans = tokenByName("font.family.sans")
  const mono = tokenByName("font.family.mono")
  const weights = tokensIn("primitive", "font-weight")
  const sansFamily = familyIn(sans, "sans")
  const monoFamily = familyIn(mono, "mono")

  return (
    <div className="grid gap-6 @narrow:grid-cols-2">
      {/* Sans */}
      <div className="flex flex-col gap-10 rounded-(--panel-radius) border bg-card p-(--panel-padding-sm)">
        <div className="grid gap-2">
          <h3 className="text-h3 text-foreground">
            <ThemeText value={sansFamily.name} />
          </h3>
          <p className="text-caption text-copy">{withoutName(sans?.description)}</p>
          {/* font-heading is an alias of the sans stack that headings use. */}
          <Code className="text-muted-foreground">{[sans?.utility ?? "font-sans", "font-heading"].join(" · ")}</Code>
        </div>
        <p aria-hidden className="text-7xl leading-none font-extrabold text-foreground">
          Aa
        </p>
        <div aria-label="Glyph sample" className="grid gap-1 font-sans text-xl text-foreground">
          {alphabet.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="tabular">{figures}</span>
        </div>
        {/* Heading and body together, as the family is used on every page. */}
        <div className="grid gap-2">
          <p className="text-h4 text-foreground">Every project, four views</p>
          <p className="text-body text-copy">
            See the same work as a list, a board, a timeline or a calendar, and switch views without losing your place.
          </p>
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
        {/* mt-auto: both cards end on their font stack, on the same line. */}
        <Meta className="mt-auto [overflow-wrap:anywhere]">
          <ThemeText value={sansFamily.stack} />
        </Meta>
      </div>

      {/* Mono, on a panel */}
      <div className="flex flex-col gap-10 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground">
        <div className="grid gap-2">
          <h3 className="text-h3 text-panel-foreground">
            <ThemeText value={monoFamily.name} />
          </h3>
          <p className="text-caption text-panel-muted">{withoutName(mono?.description)}</p>
          <code className="font-mono text-code text-panel-muted">{mono?.utility ?? "font-mono"}</code>
        </div>
        <p aria-hidden className="font-mono text-7xl leading-none font-bold text-panel-foreground">
          Aa
        </p>
        <div aria-label="Glyph sample" className="grid gap-1 font-mono text-lg text-panel-foreground">
          {alphabet.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span>{"0123456789 {} [] <> => != #"}</span>
        </div>
        {/* An SDK call, the one place Acme content shows code. */}
        <pre className="overflow-x-auto rounded-lg border border-panel-border bg-terminal p-5 font-mono text-code text-terminal-foreground">
          <code>
            <span className="text-panel-muted">{"// Create a task from your own app\n"}</span>
            {"await acme.tasks.create({\n"}
            {'  title: "Review homepage copy",\n'}
            {'  projectId: "website-relaunch",\n'}
            {'  assignee: "maya@acme.com",\n'}
            {"})"}
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
        <span className="mt-auto font-mono text-xs text-panel-muted [overflow-wrap:anywhere]">
          <ThemeText value={monoFamily.stack} />
        </span>
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
        description="One utility sets size, line height, tracking and weight together; a size range means the role scales with the viewport. Pick the role for the job; never assemble type by hand. Hero to h2 are extra-bold (800), h3 to title are bold (700), and every heading is full ink. A theme may retune tracking for its font, never size or weight; the values shown are the theme you are on."
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
        description="Two families, set by the theme, and five weights. Components only name font-sans, font-heading and font-mono, so a theme changes the type everywhere at once. There are no light weights and no slanted styles."
      >
        <Families />
      </Section>
    </FoundationPage>
  )
}
