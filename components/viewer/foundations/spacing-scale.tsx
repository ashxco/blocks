import * as React from "react"

import { cn } from "@/lib/utils"

import {
  describeSize,
  leafName,
  round,
  tokenByName,
  tokensIn,
  toPx,
  withoutUsage,
  type DesignToken,
} from "./data"
import { Code, Meta } from "./layout"

/* The Spacing page's spacing: the unit ladder and the named page spacing. */

/* Where a named token sits on a step, the note names it, so the two never disagree. */
const ladder: { step: number; use: React.ReactNode }[] = [
  { step: 0.5, use: "Focus offset, icon nudges" },
  { step: 1, use: "Badge padding, title to caption" },
  {
    step: 1.5,
    use: (
      <>
        Menu padding (<Code>--overlay-padding</Code>), icon to text in small
        controls
      </>
    ),
  },
  { step: 2, use: "Icon to label, tight stacks" },
  { step: 2.5, use: "Dense row padding, swatch to label" },
  { step: 3, use: "Menu item padding, gaps between list items" },
  {
    step: 3.5,
    use: (
      <>
        Input side padding (<Code>--control-padding-x</Code>)
      </>
    ),
  },
  {
    step: 4,
    use: (
      <>
        Compact card padding (<Code>--card-padding-sm</Code>), smallest gutter
      </>
    ),
  },
  { step: 5, use: "Between form fields, heading to lead" },
  {
    step: 6,
    use: (
      <>
        Card padding (<Code>--card-padding</Code>), stacked blocks (
        <Code>gap-stack</Code>)
      </>
    ),
  },
  { step: 8, use: "Between groups in a card" },
  { step: 10, use: "Between blocks in a section" },
  { step: 12, use: "Section heading to content" },
  { step: 16, use: "Between large blocks" },
  {
    step: 20,
    use: (
      <>
        Panel padding on wide screens (<Code>--panel-padding</Code> tops out
        here)
      </>
    ),
  },
  { step: 24, use: "Hero spacing" },
]

export function SpacingLadder() {
  const unit = tokenByName("spacing")
  const unitPx = toPx(String(unit?.value ?? "0.25rem")) ?? 4
  return (
    <ol className="grid">
      {ladder.map(({ step, use }) => (
        <li
          key={step}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 border-t py-3 @narrow:grid-cols-[3rem_4rem_8rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-x-6"
        >
          <span className="flex h-6 items-center font-mono text-label text-foreground tabular">
            {step}
          </span>
          {/* Small screens: value and bar on one line, usage under them. Wide: four columns. */}
          <span className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 @narrow:contents">
            <Meta>{round(step * unitPx)}px</Meta>
            <span className="flex h-6 items-center">
              <span
                className="h-5 bg-foreground"
                style={{ width: `calc(var(--spacing) * ${step})` }}
              />
            </span>
            <span className="col-span-2 text-caption text-copy @narrow:col-span-1">
              {use}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------------ */
/* Named spacing                                                             */
/* ------------------------------------------------------------------------ */

/*
 * Each diagram sits in a stage tall enough for the largest section value, so
 * the cards line up. Muted, the fill for wells inside a card: it stands clear
 * of the card in both modes.
 */
const stage = "grid h-48 content-center rounded-md bg-muted px-4"

/* The highlighted space: a brand wash with dashed edges, which keeps its accent colour in both modes. */
const highlight = "border-dashed border-brand/60 bg-brand/25"

function GutterDiagram() {
  return (
    <div aria-hidden className={stage}>
      <div className="flex h-24 overflow-hidden rounded-sm border bg-background">
        <span
          className={cn(highlight, "border-r")}
          style={{ width: "var(--spacing-gutter)" }}
        />
        <span className="grid flex-1 content-center gap-2 px-3">
          <span className="h-2 w-3/4 rounded-full bg-muted" />
          <span className="h-2 w-1/2 rounded-full bg-muted" />
        </span>
        <span
          className={cn(highlight, "border-l")}
          style={{ width: "var(--spacing-gutter)" }}
        />
      </div>
    </div>
  )
}

function GapDiagram({ cssVar, block }: { cssVar: string; block: string }) {
  return (
    <div aria-hidden className={stage}>
      <div className="grid overflow-hidden rounded-sm border bg-background">
        <span className={block} />
        <span
          className={cn(highlight, "border-y")}
          style={{ height: `var(${cssVar})` }}
        />
        <span className={block} />
      </div>
    </div>
  )
}

export function NamedSpacing() {
  const named = tokensIn("layout", "spacing").filter(
    (t) => t.name !== "spacing"
  )
  const diagram = (t: DesignToken) => {
    if (t.name === "space.gutter") return <GutterDiagram />
    return (
      <GapDiagram
        cssVar={t.cssVar}
        block={t.name === "space.stack" ? "h-10" : "h-4"}
      />
    )
  }
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {named.map((t) => (
        <li
          key={t.name}
          className="grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)"
        >
          {diagram(t)}
          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-title text-foreground">{leafName(t.name)}</h3>
              <Meta>{describeSize(t.value)}</Meta>
            </div>
            {t.utility ? (
              <Code className="text-muted-foreground">{t.utility}</Code>
            ) : null}
            {withoutUsage(t.description) ? (
              <p className="text-caption text-copy">
                {withoutUsage(t.description)}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
