import type { ThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { ByTheme, ThemeText } from "./by-theme"
import {
  familyStack,
  leafName,
  perTheme,
  sentenceCase,
  themeById,
  tokenByName,
  tokensIn,
  valueIn,
  type DesignToken,
} from "./data"
import { Code, Meta } from "./layout"

/* The Typography page's families: the theme's heading, text and mono faces, and the weights. */

/* Literal class names so Tailwind generates every weight. */
const weightClass: Record<string, string> = {
  "font-normal": "font-normal",
  "font-medium": "font-medium",
  "font-semibold": "font-semibold",
  "font-bold": "font-bold",
  "font-extrabold": "font-extrabold",
}

/** Token descriptions start with the family name ("Geist Mono. Code, …"), which the card already shows. */
function withoutName(description: string | undefined) {
  return description?.replace(/^[^.]+\.\s+/, "")
}

/** The family's name and its CSS stack in each theme. */
function familyIn(
  t: DesignToken | undefined,
  kind: "heading" | "sans" | "mono"
) {
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
const alphabet = [
  "ABCDEFGHIJKLM",
  "NOPQRSTUVWXYZ",
  "abcdefghijklm",
  "nopqrstuvwxyz",
]
const figures = "0123456789 & @ # % ( ) → ·"

/** The alphabet and a last line of figures (tabular) or symbols, in the face `className` sets. */
function Glyphs({
  line = figures,
  className,
}: {
  line?: string
  className: string
}) {
  return (
    <div aria-label="Glyph sample" className={cn("grid gap-1", className)}>
      {alphabet.map((half) => (
        <span key={half}>{half}</span>
      ))}
      <span className={line === figures ? "tabular" : undefined}>{line}</span>
    </div>
  )
}

/** True when the theme gives headings their own face (Forest's Bricolage Grotesque, Ember's Fraunces, Mono's Geist Mono). */
function ownHeading(theme: ThemeId) {
  const { heading, sans } = themeById(theme).fonts
  return heading !== sans
}

/**
 * The heading face, in themes that give headings their own: it sets every
 * display and heading role, h1 to h6 and font-heading, at 800 or 700. Spans
 * both columns above the text and mono cards.
 */
function HeadingFamily({ theme, stack }: { theme: ThemeId; stack: string }) {
  const { heading, sans } = themeById(theme).fonts
  return (
    <div className="grid gap-10 rounded-(--panel-radius) border bg-card p-(--panel-padding-sm) @narrow:col-span-2 @narrow:grid-cols-2">
      <div className="flex flex-col gap-10">
        <div className="grid gap-2">
          <h3 className="text-h3 text-foreground">{heading}</h3>
          <p className="text-caption text-copy">
            The heading face: hero to h4 and title, h1 to h6 and anything set in
            font-heading, always at 800 or 700. Body copy, labels and controls
            stay in {sans}.
          </p>
          <Code className="text-muted-foreground">font-heading</Code>
        </div>
        <p
          aria-hidden
          className="font-heading text-7xl leading-none font-extrabold text-foreground"
        >
          Aa
        </p>
        <Meta className="mt-auto [overflow-wrap:anywhere]">{stack}</Meta>
      </div>
      <div className="flex flex-col gap-10">
        <Glyphs className="font-heading text-xl font-bold text-foreground" />
        {/* Heading over body, as the two faces meet on every page. */}
        <div className="grid gap-2">
          <p className="text-h4 text-foreground">Every project, four views</p>
          <p className="text-body text-copy">
            See the same work as a list, a board, a timeline or a calendar, and
            switch views without losing your place.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Families() {
  const heading = tokenByName("font.family.heading")
  const sans = tokenByName("font.family.sans")
  const mono = tokenByName("font.family.mono")
  const weights = tokensIn("primitive", "font-weight")
  const headingFamily = familyIn(heading, "heading")
  const sansFamily = familyIn(sans, "sans")
  const monoFamily = familyIn(mono, "mono")

  return (
    <div className="grid gap-6 @narrow:grid-cols-2">
      {/* Heading face: only in themes that give headings their own. */}
      <ByTheme as="div" by={(id) => (ownHeading(id) ? id : "follows")}>
        {(id) =>
          ownHeading(id) ? (
            <HeadingFamily theme={id} stack={headingFamily.stack[id]} />
          ) : null
        }
      </ByTheme>

      {/* Sans */}
      <div className="flex flex-col gap-10 rounded-(--panel-radius) border bg-card p-(--panel-padding-sm)">
        <div className="grid gap-2">
          <h3 className="text-h3 text-foreground">
            <ThemeText value={sansFamily.name} />
          </h3>
          <p className="text-caption text-copy">
            {withoutName(sans?.description)}
          </p>
          {/* font-heading is its own token; it resolves to this stack unless the theme gives headings a face. */}
          <Code className="text-muted-foreground">
            <ThemeText
              value={perTheme((id) =>
                [
                  sans?.utility ?? "font-sans",
                  ...(ownHeading(id) ? [] : ["font-heading"]),
                ].join(" · ")
              )}
            />
          </Code>
        </div>
        <p
          aria-hidden
          className="font-sans text-7xl leading-none font-extrabold text-foreground"
        >
          Aa
        </p>
        <Glyphs className="font-sans text-xl text-foreground" />
        {/* Heading and body together where the family sets both; a label and body where headings have their own face. */}
        <ByTheme as="div" by={(id) => (ownHeading(id) ? "text" : "both")}>
          {(id) =>
            ownHeading(id) ? (
              <div className="grid gap-2">
                <p className="text-label text-foreground">
                  Weekly summary email
                </p>
                <p className="text-body text-copy">
                  Every Monday at 9:00, what moved last week, what is due this
                  week and which projects are at risk.
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                <p className="text-h4 text-foreground">
                  Every project, four views
                </p>
                <p className="text-body text-copy">
                  See the same work as a list, a board, a timeline or a
                  calendar, and switch views without losing your place.
                </p>
              </div>
            )
          }
        </ByTheme>
        <ul className="grid border-b">
          {weights.map((w) => (
            <li
              key={w.name}
              className="flex items-baseline justify-between gap-4 border-t py-3"
            >
              <span
                className={`${weightClass[w.utility ?? ""] ?? ""} text-2xl text-foreground`}
              >
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
          <p className="text-caption text-panel-muted">
            {withoutName(mono?.description)}
          </p>
          <code className="font-mono text-code text-panel-muted">
            {mono?.utility ?? "font-mono"}
          </code>
        </div>
        <p
          aria-hidden
          className="font-mono text-7xl leading-none font-bold text-panel-foreground"
        >
          Aa
        </p>
        <Glyphs
          line="0123456789 {} [] <> => != #"
          className="font-mono text-lg text-panel-foreground"
        />
        {/* An SDK call, the one place Acme content shows code. */}
        <pre className="overflow-x-auto rounded-lg border border-panel-border bg-terminal p-5 font-mono text-code text-terminal-foreground">
          <code>
            <span className="text-panel-muted">
              {"// Create a task from your own app\n"}
            </span>
            {"await acme.tasks.create({\n"}
            {'  title: "Review homepage copy",\n'}
            {'  projectId: "website-relaunch",\n'}
            {'  assignee: "maya@acme.com",\n'}
            {"})"}
          </code>
        </pre>
        <dl className="grid border-b border-panel-border">
          {metrics.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-t border-panel-border py-3"
            >
              <dt className="text-label text-panel-muted">{label}</dt>
              <dd className="font-mono text-xl text-panel-foreground tabular">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto font-mono text-xs [overflow-wrap:anywhere] text-panel-muted">
          <ThemeText value={monoFamily.stack} />
        </span>
      </div>
    </div>
  )
}
