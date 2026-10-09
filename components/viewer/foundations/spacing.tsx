import * as React from "react"

import { describeSize, leafName, tokenByName, tokensIn, toPx, toRem, type DesignToken } from "./data"
import { Code, cx, FoundationPage, Meta, Section } from "./layout"

const round = (n: number) => Math.round(n * 100) / 100

/* ------------------------------------------------------------------------ */
/* Spacing unit ladder                                                       */
/* ------------------------------------------------------------------------ */

const ladder: { step: number; use?: string }[] = [
  { step: 0.5 },
  { step: 1, use: "Hairline offsets, badge padding" },
  { step: 1.5, use: "Icon to text in small controls" },
  { step: 2, use: "Icon to label, tight stacks" },
  { step: 3, use: "Items in a menu or list" },
  { step: 4, use: "Control padding, form fields" },
  { step: 5 },
  { step: 6, use: "Card padding, grid gaps" },
  { step: 8, use: "Between groups in a card" },
  { step: 10, use: "Between blocks in a section" },
  { step: 12 },
  { step: 16, use: "Between large blocks" },
  { step: 20 },
  { step: 24, use: "Hero and panel breathing room" },
]

function SpacingLadder() {
  const unit = tokenByName("spacing")
  const unitPx = toPx(String(unit?.value ?? "0.25rem")) ?? 4
  return (
    <ol className="grid">
      {ladder.map(({ step, use }) => (
        <li
          key={step}
          className="grid grid-cols-[2.5rem_3.5rem_minmax(0,1fr)] items-center gap-4 border-t py-3 @narrow:grid-cols-[3rem_4rem_8rem_minmax(0,1fr)] @narrow:gap-6"
        >
          <span className="font-mono text-label text-foreground tabular">{step}</span>
          <Meta>{round(step * unitPx)}px</Meta>
          <span className="flex h-6 items-center">
            <span
              className="h-5 bg-foreground"
              style={{ width: `calc(var(--spacing) * ${step})` }}
            />
          </span>
          <span className="hidden text-caption text-copy @narrow:block">{use}</span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------------ */
/* Named spacing                                                             */
/* ------------------------------------------------------------------------ */

function GutterDiagram() {
  return (
    <div aria-hidden className="flex h-24 overflow-hidden rounded-md border">
      <span className="bg-tint-violet" style={{ width: "var(--spacing-gutter)" }} />
      <span className="grid flex-1 content-center gap-2 bg-subtle px-3">
        <span className="h-2 w-3/4 rounded-full bg-border" />
        <span className="h-2 w-1/2 rounded-full bg-border" />
      </span>
      <span className="bg-tint-violet" style={{ width: "var(--spacing-gutter)" }} />
    </div>
  )
}

function SectionDiagram({ cssVar }: { cssVar: string }) {
  return (
    <div aria-hidden className="grid overflow-hidden rounded-md border">
      <span className="h-6 bg-subtle" />
      <span className="bg-tint-violet" style={{ height: `var(${cssVar})` }} />
      <span className="h-6 bg-subtle" />
    </div>
  )
}

function StackDiagram() {
  return (
    <div aria-hidden className="grid overflow-hidden rounded-md border">
      <span className="h-10 bg-subtle" />
      <span className="bg-tint-violet" style={{ height: "var(--spacing-stack)" }} />
      <span className="h-10 bg-subtle" />
    </div>
  )
}

function NamedSpacing() {
  const named = tokensIn("layout", "spacing").filter((t) => t.name !== "spacing")
  const diagram = (t: DesignToken) => {
    if (t.name === "space.gutter") return <GutterDiagram />
    if (t.name === "space.stack") return <StackDiagram />
    return <SectionDiagram cssVar={t.cssVar} />
  }
  const utility: Record<string, string> = {
    "space.gutter": "px-gutter",
    "space.section": "py-section",
    "space.section-sm": "py-section-sm",
    "space.stack": "gap-stack",
  }
  return (
    <ul className="grid gap-6 @prose:grid-cols-2">
      {named.map((t) => (
        <li key={t.name} className="grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
          {diagram(t)}
          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-title">{leafName(t.name)}</h3>
              <Meta>{describeSize(t.value)}</Meta>
            </div>
            <Code className="text-muted-foreground">{utility[t.name] ?? t.utility}</Code>
            {t.description ? <p className="text-caption text-copy">{t.description}</p> : null}
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
              className={cx(
                "absolute bottom-4 font-mono text-xs font-semibold whitespace-nowrap text-foreground",
                last ? "right-0" : "-translate-x-1/2"
              )}
            >
              {leafName(b.name)}
            </span>
            <span className={cx("absolute bottom-0 block h-3 w-px bg-muted-foreground", last && "-translate-x-full")} />
          </span>
        )
      })}
    </div>
  )
}

function Containers() {
  const max = scaleMax()
  const containers = tokensIn("layout", "container")
  const utility: Record<string, string> = {
    prose: "max-w-prose",
    narrow: "container-narrow · max-w-narrow",
    page: "container-page · max-w-page",
    wide: "container-wide · max-w-wide",
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
              <span className="block h-10 rounded-sm bg-foreground" style={{ width: `${(rem / max) * 100}%` }} />
              <div className="grid gap-1 @prose:grid-cols-[8rem_minmax(0,1fr)] @prose:gap-6">
                <div className="flex items-baseline gap-3 @prose:grid @prose:gap-0.5">
                  <h3 className="text-title">{name}</h3>
                  <Meta>
                    {round(rem)}rem · {round(rem * 16)}px
                  </Meta>
                </div>
                <div className="grid gap-1">
                  <Code className="text-muted-foreground">{utility[name] ?? `max-w-${name}`}</Code>
                  {c.description ? <p className="text-caption text-copy">{c.description}</p> : null}
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
      <span className={cx(pill, "flex sm:hidden")}>base</span>
      <span className={cx(pill, "hidden sm:flex md:hidden")}>sm:</span>
      <span className={cx(pill, "hidden md:flex lg:hidden")}>md:</span>
      <span className={cx(pill, "hidden lg:flex xl:hidden")}>lg:</span>
      <span className={cx(pill, "hidden xl:flex 2xl:hidden")}>xl:</span>
      <span className={cx(pill, "hidden 2xl:flex")}>2xl:</span>
    </p>
  )
}

function Breakpoints() {
  const breakpoints = tokensIn("layout", "breakpoint")
  const th = "h-11 px-4 text-left text-caption font-semibold text-muted-foreground @prose:px-5"
  const td = "h-(--table-row-height) px-4 py-3 align-middle @prose:px-5"
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
                    <Meta className="text-foreground">
                      {round(rem)}rem · {round(rem * 16)}px
                    </Meta>
                  </td>
                  <td className={cx(td, "text-caption text-copy")}>{deviceHint[name]}</td>
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
            Every padding, margin, gap and size is a multiple of <Code>--spacing</Code> ({describeSize(unit?.value)}).{" "}
            <Code>p-4</Code> is four units, 16px. Stay on the ladder; there are no in-between values.
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
        description="Four widths, drawn to scale against the breakpoints above them. The container utilities centre the column and add gutters; the max-width utilities only cap it."
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
    </FoundationPage>
  )
}
