import * as React from "react"

import { cn } from "@/lib/utils"

import {
  describeSize,
  leafName,
  tokenByName,
  tokensIn,
  toPx,
  toRem,
  tokens,
  withoutUsage,
  type DesignToken,
} from "./data"
import { Code, CodeList, FoundationPage, Meta, Section } from "./layout"

const round = (n: number) => Math.round(n * 100) / 100

/* ------------------------------------------------------------------------ */
/* Spacing unit ladder                                                       */
/* ------------------------------------------------------------------------ */

/* Where a named token sits on a step, the note names it, so the two never disagree. */
const ladder: { step: number; use: React.ReactNode }[] = [
  { step: 0.5, use: "Focus offset, icon nudges" },
  { step: 1, use: "Badge padding, title to caption" },
  { step: 1.5, use: <>Menu padding (<Code>--overlay-padding</Code>), icon to text in small controls</> },
  { step: 2, use: "Icon to label, tight stacks" },
  { step: 2.5, use: "Dense row padding, swatch to label" },
  { step: 3, use: "Menu item padding, gaps between list items" },
  { step: 3.5, use: <>Input side padding (<Code>--control-padding-x</Code>)</> },
  { step: 4, use: <>Compact card padding (<Code>--card-padding-sm</Code>), smallest gutter</> },
  { step: 5, use: "Between form fields, heading to lead" },
  { step: 6, use: <>Card padding (<Code>--card-padding</Code>), stacked blocks (<Code>gap-stack</Code>)</> },
  { step: 8, use: "Between groups in a card" },
  { step: 10, use: "Between blocks in a section" },
  { step: 12, use: "Section heading to content" },
  { step: 16, use: "Between large blocks" },
  { step: 20, use: <>Panel padding on wide screens (<Code>--panel-padding</Code> tops out here)</> },
  { step: 24, use: "Hero spacing" },
]

function SpacingLadder() {
  const unit = tokenByName("spacing")
  const unitPx = toPx(String(unit?.value ?? "0.25rem")) ?? 4
  return (
    <ol className="grid">
      {ladder.map(({ step, use }) => (
        <li
          key={step}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 border-t py-3 @narrow:grid-cols-[3rem_4rem_8rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-x-6"
        >
          <span className="flex h-6 items-center font-mono text-label text-foreground tabular">{step}</span>
          {/* Small screens: value and bar on one line, usage under them. Wide: four columns. */}
          <span className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 @narrow:contents">
            <Meta>{round(step * unitPx)}px</Meta>
            <span className="flex h-6 items-center">
              <span className="h-5 bg-foreground" style={{ width: `calc(var(--spacing) * ${step})` }} />
            </span>
            <span className="col-span-2 text-caption text-copy @narrow:col-span-1">{use}</span>
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
        <span className={cn(highlight, "border-r")} style={{ width: "var(--spacing-gutter)" }} />
        <span className="grid flex-1 content-center gap-2 px-3">
          <span className="h-2 w-3/4 rounded-full bg-muted" />
          <span className="h-2 w-1/2 rounded-full bg-muted" />
        </span>
        <span className={cn(highlight, "border-l")} style={{ width: "var(--spacing-gutter)" }} />
      </div>
    </div>
  )
}

function GapDiagram({ cssVar, block }: { cssVar: string; block: string }) {
  return (
    <div aria-hidden className={stage}>
      <div className="grid overflow-hidden rounded-sm border bg-background">
        <span className={block} />
        <span className={cn(highlight, "border-y")} style={{ height: `var(${cssVar})` }} />
        <span className={block} />
      </div>
    </div>
  )
}

function NamedSpacing() {
  const named = tokensIn("layout", "spacing").filter((t) => t.name !== "spacing")
  const diagram = (t: DesignToken) => {
    if (t.name === "space.gutter") return <GutterDiagram />
    return <GapDiagram cssVar={t.cssVar} block={t.name === "space.stack" ? "h-10" : "h-4"} />
  }
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {named.map((t) => (
        <li key={t.name} className="grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
          {diagram(t)}
          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-title text-foreground">{leafName(t.name)}</h3>
              <Meta>{describeSize(t.value)}</Meta>
            </div>
            {t.utility ? <Code className="text-muted-foreground">{t.utility}</Code> : null}
            {withoutUsage(t.description) ? (
              <p className="text-caption text-copy">{withoutUsage(t.description)}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------------ */
/* Containers and breakpoints, drawn against the widest breakpoint           */
/* ------------------------------------------------------------------------ */

function scaleMax() {
  const widths = [...tokensIn("layout", "breakpoint"), ...tokensIn("layout", "container")]
    .map((t) => toRem(String(t.value)) ?? 0)
  return Math.max(...widths, 1)
}

function BreakpointRuler({ max }: { max: number }) {
  const breakpoints = tokensIn("layout", "breakpoint")
  return (
    <div aria-hidden className="relative h-10 border-b">
      {breakpoints.map((b, i) => {
        const pct = ((toRem(String(b.value)) ?? 0) / max) * 100
        const last = i === breakpoints.length - 1
        return (
          <span key={b.name} className="absolute bottom-0" style={{ left: `${pct}%` }}>
            <span
              className={cn(
                "absolute bottom-4 font-mono text-xs font-semibold whitespace-nowrap text-foreground",
                last ? "right-0" : "-translate-x-1/2"
              )}
            >
              {leafName(b.name)}
            </span>
            <span className={cn("absolute bottom-0 block h-3 w-px bg-muted-foreground", last && "-translate-x-full")} />
          </span>
        )
      })}
    </div>
  )
}

function Containers() {
  const max = scaleMax()
  const containers = tokensIn("layout", "container")
  /* The page-level containers also have a centring utility with gutters. */
  const centred: Record<string, string> = {
    narrow: "container-narrow",
    page: "container-page",
    wide: "container-wide",
  }
  return (
    <div className="grid gap-8">
      <BreakpointRuler max={max} />
      <ul className="grid gap-8">
        {containers.map((c) => {
          const rem = toRem(String(c.value)) ?? 0
          const name = leafName(c.name)
          return (
            <li key={c.name} className="grid gap-3">
              <span
                aria-hidden
                className={cn(
                  "block h-10 rounded-sm border",
                  name === "page" ? "border-foreground bg-foreground" : "border-border-strong bg-muted"
                )}
                style={{ width: `${(rem / max) * 100}%` }}
              />
              <div className="grid gap-1 @prose:grid-cols-[8rem_minmax(0,1fr)] @prose:gap-6">
                <div className="flex items-baseline gap-3 @prose:grid @prose:gap-0.5">
                  <h3 className="text-title text-foreground">{name}</h3>
                  <Meta>
                    {round(rem)}rem · {round(rem * 16)}px
                  </Meta>
                </div>
                <div className="grid gap-1">
                  <CodeList
                    value={[centred[name], c.utility ?? `max-w-(${c.cssVar})`].filter(Boolean).join(" · ")}
                    className="text-muted-foreground"
                  />
                  {withoutUsage(c.description) ? (
                    <p className="text-caption text-copy">{withoutUsage(c.description)}</p>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const deviceHint: Record<string, string> = {
  sm: "Large phones in landscape",
  md: "Tablets in portrait",
  lg: "Tablets in landscape, small laptops",
  xl: "Laptops and desktops",
  "2xl": "Large displays",
}

/** Pure CSS: exactly one label is visible, matching the current viewport. */
function CurrentBreakpoint() {
  const pill = "items-center gap-2 font-mono text-label text-foreground"
  return (
    <p className="flex flex-wrap items-center gap-3 rounded-(--card-radius) border bg-subtle px-5 py-4">
      <span className="text-label text-copy">This window is at</span>
      <span className={cn(pill, "flex sm:hidden")}>base</span>
      <span className={cn(pill, "hidden sm:flex md:hidden")}>sm:</span>
      <span className={cn(pill, "hidden md:flex lg:hidden")}>md:</span>
      <span className={cn(pill, "hidden lg:flex xl:hidden")}>lg:</span>
      <span className={cn(pill, "hidden xl:flex 2xl:hidden")}>xl:</span>
      <span className={cn(pill, "hidden 2xl:flex")}>2xl:</span>
    </p>
  )
}

function Breakpoints() {
  const breakpoints = tokensIn("layout", "breakpoint")
  const th = "h-(--table-row-height-sm) px-4 text-left text-caption font-semibold text-muted-foreground @prose:px-5"
  // Baseline, not middle: the mono prefix and the values sit on one line.
  const td = "h-(--table-row-height) px-4 py-3 align-baseline @prose:px-5"
  return (
    <div className="grid gap-6">
      <CurrentBreakpoint />
      <div className="overflow-hidden rounded-(--card-radius) border">
        <table className="w-full border-collapse">
          <caption className="sr-only">Breakpoints</caption>
          <thead className="bg-subtle">
            <tr>
              <th scope="col" className={th}>Prefix</th>
              <th scope="col" className={th}>Min width</th>
              <th scope="col" className={th}>Typical screen</th>
            </tr>
          </thead>
          <tbody>
            {breakpoints.map((b) => {
              const name = leafName(b.name)
              const rem = toRem(String(b.value)) ?? 0
              return (
                <tr key={b.name} className="border-t">
                  <td className={td}>
                    <Code>{name}:</Code>
                  </td>
                  <td className={td}>
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <Meta className="text-foreground">{round(rem * 16)}px</Meta>
                      <Meta>{round(rem)}rem</Meta>
                    </span>
                  </td>
                  <td className={cn(td, "text-caption text-copy")}>{deviceHint[name]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Overlay widths, drawn to scale against the widest                         */
/* ------------------------------------------------------------------------ */

/* Component groups that size a floating surface, in the order people meet them. */
const overlayGroups = ["menu", "tooltip", "popover", "hover-card", "toast", "dialog", "sheet"]

/* Width tokens only (not the radius or padding in the same groups), smallest first within each component. */
function overlayWidths() {
  const rem = (t: DesignToken) => toRem(String(t.value)) ?? 0
  return overlayGroups.flatMap((group) =>
    tokens
      .filter((t) => t.tier === "component" && t.group === group && /^(min-|max-)?w-/.test(t.utility ?? ""))
      .sort((a, b) => rem(a) - rem(b))
  )
}

/* What the bar's end means: menus start at their width and grow, tooltips and dialogs stop at theirs. */
function bound(utility?: string) {
  if (utility?.startsWith("min-w-")) return "min"
  if (utility?.startsWith("max-w-")) return "max"
  return null
}

function OverlayWidths() {
  const items = overlayWidths()
  const max = Math.max(...items.map((t) => toRem(String(t.value)) ?? 0), 1)
  return (
    <ul className="grid">
      {items.map((t, i) => {
        const rem = toRem(String(t.value)) ?? 0
        const utility = t.utility
        const kind = bound(utility)
        const caption = t.description
        return (
          <li
            key={t.name}
            className={cn(
              "grid gap-3 py-4 @narrow:grid-cols-[17rem_minmax(0,1fr)] @narrow:items-center @narrow:gap-8",
              i > 0 && "border-t"
            )}
          >
            <div className="grid gap-0.5">
              <Code>{utility ?? t.cssVar}</Code>
              <Meta>
                {[kind, `${round(rem)}rem`, `${round(rem * 16)}px`].filter(Boolean).join(" · ")}
              </Meta>
            </div>
            <div className="grid gap-2">
              <span
                aria-hidden
                className={cn(
                  "block h-6 rounded-sm border bg-muted",
                  kind ? "border-dashed border-muted-foreground" : "border-border-strong"
                )}
                style={{ width: `${(rem / max) * 100}%` }}
              />
              {caption ? <p className="text-caption text-copy">{caption}</p> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function SpacingFoundation({ title, description }: { title: string; description: string }) {
  const unit = tokenByName("spacing")
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="unit"
        title="Spacing unit"
        description={
          <>
            Padding, margin and gap come from this ladder of <Code>--spacing</Code> ({describeSize(unit?.value)}) multiples:{" "}
            <Code>p-4</Code> is four units, 16px. Use steps from the ladder; half steps exist only below 16px. Fluid page
            spacing has its own names, below. Spacing, sizes and widths are the same in every theme.
          </>
        }
      >
        <SpacingLadder />
      </Section>

      <Section
        id="named"
        title="Named spacing"
        description="Page-level rhythm has names, so every template breathes the same way. Gutters and sections are fluid: resize the window and the highlighted space follows."
      >
        <NamedSpacing />
      </Section>

      <Section
        id="containers"
        title="Containers"
        description="Four widths, drawn to scale against the breakpoint ruler; page, in ink, is the default. The container utilities centre the column and add gutters; the max-width utilities only cap it."
      >
        <Containers />
      </Section>

      <Section
        id="breakpoints"
        title="Breakpoints"
        description="Mobile first: unprefixed utilities apply everywhere, prefixed ones from that width up. Inside variable-width slots, prefer container queries."
      >
        <Breakpoints />
      </Section>

      <Section
        id="overlays"
        title="Overlay widths"
        description="Menus, popovers, toasts and dialogs take their width from tokens, drawn here to scale. A dashed bar is a bound, not a size: menus start at theirs and grow with their content, tooltips wrap once they reach theirs, and dialogs and sheets stop at theirs and shrink to fit a phone."
      >
        <OverlayWidths />
      </Section>
    </FoundationPage>
  )
}
