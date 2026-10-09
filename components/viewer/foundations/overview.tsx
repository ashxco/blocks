import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  GitBranchIcon,
  GlobeIcon,
  RocketIcon,
  ServerIcon,
  TerminalIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { foundations } from "@/lib/registry"
import { cn } from "@/lib/utils"

import { primitiveScales, refLabel, tokenByName, tokenByVar, tokens } from "./data"
import { FoundationPage, Section } from "./layout"

/* ------------------------------------------------------------------------ */
/* Tier chain: primitive -> semantic -> component                            */
/* ------------------------------------------------------------------------ */

function TierChain() {
  const brand = tokenByVar("--brand")
  const primitive = brand?.ref ? tokenByName(brand.ref) : undefined
  const radius = tokenByVar("--button-radius")
  const height = tokenByVar("--button-height-md")
  if (!brand || !primitive) return null

  const step = "grid content-start gap-4 rounded-(--card-radius) border border-panel-border bg-panel-raised p-5"
  const arrow = "size-5 shrink-0 rotate-90 justify-self-center text-panel-muted @narrow:rotate-0 @narrow:self-center"
  return (
    <section
      aria-labelledby="tiers-title"
      className="grid gap-10 rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground"
    >
      <div className="grid gap-4 @narrow:grid-cols-2 @narrow:items-start @narrow:gap-10">
        <h2 id="tiers-title" className="text-h2 text-panel-foreground">
          One source of truth
        </h2>
        <p className="max-w-prose text-body text-panel-muted">
          Tokens are written once and compiled to CSS variables and Tailwind utilities. Change a primitive and every
          role, component and template that uses it follows, in both themes.
        </p>
      </div>

      <div className="grid gap-3 @narrow:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className={step}>
          <span
            aria-hidden
            className="block h-14 rounded-md"
            style={{ backgroundColor: `var(${primitive.cssVar})` }}
          />
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Primitive</p>
            <code className="font-mono text-code text-panel-muted">{primitive.cssVar}</code>
            <span className="font-mono text-xs text-panel-muted">{String(primitive.value)}</span>
          </div>
        </div>
        <ArrowRightIcon aria-hidden className={arrow} />
        <div className={step}>
          {/* The role on the page canvas, in the current theme. */}
          <span aria-hidden className="flex h-14 items-center gap-3 rounded-md border bg-background px-4">
            <span className="size-3 shrink-0 rounded-full bg-brand" />
            <span className="truncate text-label text-brand">Links, focus, highlights</span>
          </span>
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Semantic</p>
            <code className="font-mono text-code text-panel-muted">
              {brand.cssVar} · bg-brand
            </code>
            <span className="font-mono text-xs text-panel-muted">
              {refLabel(brand.ref)} light · {refLabel(brand.dark?.ref)} dark
            </span>
          </div>
        </div>
        <ArrowRightIcon aria-hidden className={arrow} />
        <div className={step}>
          <span className="flex h-14 items-center">
            <Button type="button" variant="brand" tabIndex={-1} aria-hidden>
              <RocketIcon data-icon="inline-start" />
              Deploy
            </Button>
          </span>
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Component</p>
            <code className="font-mono text-code text-panel-muted">Button variant=&quot;brand&quot;</code>
            {[radius, height].map((t) =>
              t ? (
                <span key={t.cssVar} className="font-mono text-xs text-panel-muted">
                  {t.cssVar}
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Tile samples                                                              */
/* ------------------------------------------------------------------------ */

/** Steps every primitive scale shares (50 … 950), so the rows form one grid. */
function sharedSteps() {
  const scales = primitiveScales()
  const [first, ...rest] = scales
  if (!first) return { scales, steps: [] as string[] }
  const steps = first.steps
    .map((s) => s.step)
    .filter((step) => rest.every((scale) => scale.steps.some((s) => s.step === step)))
  return { scales, steps }
}

function ColorSample() {
  const { scales, steps } = sharedSteps()
  return (
    <div
      aria-hidden
      className="grid size-full gap-1 p-5"
      style={{
        gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${scales.length}, minmax(0, 1fr))`,
      }}
    >
      {scales.flatMap((scale) =>
        steps.map((step) => {
          const token = scale.steps.find((s) => s.step === step)?.token
          return token ? (
            <span
              key={`${scale.name}-${step}`}
              className="block rounded-xs border"
              style={{ backgroundColor: `var(${token.cssVar})` }}
            />
          ) : null
        })
      )}
    </div>
  )
}

function TypeSample() {
  return (
    <div aria-hidden className="flex size-full items-end gap-4 p-6">
      <span className="text-7xl leading-none font-extrabold text-foreground">Aa</span>
      <span className="pb-1 font-mono text-4xl leading-none text-muted-foreground">Aa</span>
    </div>
  )
}

function SpacingSample() {
  const steps = [2, 4, 6, 10, 16, 24]
  return (
    <div aria-hidden className="grid size-full content-center gap-2 p-6">
      {steps.map((n) => (
        <span
          key={n}
          className="block h-2.5 rounded-xs bg-foreground"
          style={{ width: `min(100%, calc(var(--spacing) * ${n * 2}))` }}
        />
      ))}
    </div>
  )
}

/*
 * Four steps of the radius scale on equal squares (sm, lg, 2xl, full), far
 * enough apart to read as different shapes. Outlines use the strong line so
 * they hold up on the muted tile in both themes.
 */
function ShapeSample() {
  const square = "aspect-square w-full max-w-16 justify-self-center"
  return (
    <div aria-hidden className="grid size-full grid-cols-4 content-center items-center gap-3 p-6">
      <span className={cn(square, "rounded-sm border border-border-strong bg-background")} />
      <span className={cn(square, "rounded-lg border border-border-strong bg-background")} />
      <span className={cn(square, "rounded-2xl bg-foreground")} />
      <span className={cn(square, "rounded-full border border-border-strong bg-background")} />
    </div>
  )
}

/*
 * Two dots on rails, frozen at the same moment: ease-out has nearly arrived
 * while ease-in-out is halfway. Hover or focus the tile and both finish.
 */
const motionRails: { name: string; at: string; dot: string }[] = [
  { name: "out", at: "85%", dot: "bg-foreground ease-out" },
  { name: "in-out", at: "50%", dot: "bg-muted-foreground ease-in-out" },
]

function MotionSample() {
  return (
    <div aria-hidden className="grid size-full content-center gap-6 p-6">
      {motionRails.map((rail) => (
        <div key={rail.name} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{rail.name}</span>
          <span className="relative block h-4">
            <span className="absolute inset-x-0 top-1/2 h-(--border-width-strong) -translate-y-1/2 rounded-full bg-border-strong" />
            <span className="absolute top-1/2 left-0 h-4 w-(--border-width-strong) -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground" />
            <span className="absolute top-1/2 left-full h-4 w-(--border-width-strong) -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground" />
            <span
              className={cn(
                "absolute top-1/2 left-(--at) size-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left] duration-(--duration-slower) group-hover:[--at:100%] group-focus-visible:[--at:100%]",
                rail.dot
              )}
              style={{ "--at": rail.at } as React.CSSProperties}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

function IconSample() {
  const icons = [RocketIcon, GitBranchIcon, TerminalIcon, GlobeIcon, ServerIcon, BellIcon]
  return (
    <div aria-hidden className="grid size-full grid-cols-3 place-items-center p-6 text-foreground">
      {icons.map((Icon, i) => (
        <Icon key={i} className="size-6" />
      ))}
    </div>
  )
}

/** A small mark per token type: a chip for colour, a corner for radius, a bar for time, Aa for type. */
function TokenGlyph({ type, cssVar }: { type: string; cssVar: string }) {
  if (type === "color") {
    return <span className="size-3.5 shrink-0 rounded-full border" style={{ backgroundColor: `var(${cssVar})` }} />
  }
  if (type === "typography") {
    return <span className="w-3.5 shrink-0 text-center text-xs leading-none font-extrabold text-foreground">Aa</span>
  }
  if (type === "duration") {
    return (
      <span className="flex w-3.5 shrink-0 items-center">
        <span className="h-1 w-full rounded-full bg-foreground" />
      </span>
    )
  }
  /* Dimensions such as radius: one rounded corner, drawn as an outline. */
  return <span className="size-3.5 shrink-0 rounded-tl-sm border-t-(length:--border-width-strong) border-l-(length:--border-width-strong) border-foreground" />
}

function TokensSample() {
  const sample = ["--brand", "--radius-lg", "--duration-base", "--text-h2"]
    .map((v) => tokens.find((t) => t.cssVar === v))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  return (
    <div aria-hidden className="grid size-full content-center p-5">
      <div className="grid overflow-hidden rounded-md border bg-background">
        {sample.map((t) => (
          <div key={t.cssVar} className="flex items-center gap-3 border-t px-3 py-2 first:border-t-0">
            <TokenGlyph type={t.type} cssVar={t.cssVar} />
            <span className="font-mono text-xs text-foreground">{t.cssVar}</span>
            <span className="ml-auto truncate font-mono text-xs text-muted-foreground">
              {t.type === "typography"
                ? "type role"
                : t.dark
                  ? // Theme colours: the primitive behind each theme, true in both.
                    `${refLabel(t.ref) ?? String(t.value)} · ${refLabel(t.dark.ref) ?? String(t.dark.value)}`
                  : String(t.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const samples: Record<string, { sample: React.ReactNode; span?: string }> = {
  colors: { sample: <ColorSample />, span: "@prose:col-span-2" },
  typography: { sample: <TypeSample /> },
  spacing: { sample: <SpacingSample /> },
  radius: { sample: <ShapeSample /> },
  shape: { sample: <ShapeSample /> },
  motion: { sample: <MotionSample /> },
  iconography: { sample: <IconSample /> },
  tokens: { sample: <TokensSample />, span: "@narrow:col-span-2" },
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

/** A line of code that may wrap between words but never inside one (not even at a hyphen). */
function Words({ children }: { children: string }) {
  return children.split(" ").map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 ? " " : null}
      <span className="whitespace-nowrap">{word}</span>
    </React.Fragment>
  ))
}

export function FoundationsOverview() {
  return (
    <FoundationPage
      title="Foundations"
      description="The decisions every Blocks component is built on: colour, type, space, shape, motion and icons. All of it lives in tokens, so the whole kit changes from one place."
    >
      <TierChain />

      <section aria-label="Foundation pages">
        <ul className="grid gap-6 @prose:grid-cols-2 @narrow:grid-cols-3">
          {foundations.map((entry) => {
            const tile = samples[entry.slug]
            return (
              <li key={entry.slug} className={cn("min-w-0", tile?.span)}>
                <Link
                  href={`/foundations/${entry.slug}`}
                  className="group grid h-full grid-rows-[11rem_auto] overflow-hidden rounded-(--card-radius) border bg-card transition-colors duration-(--duration-fast) ease-standard hover:border-foreground"
                >
                  <div className="overflow-hidden border-b bg-muted">{tile?.sample}</div>
                  <div className="grid content-start gap-1.5 p-(--card-padding)">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-h4 text-foreground">{entry.title}</h2>
                      <ArrowUpRightIcon
                        aria-hidden
                        className="size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-(--duration-fast) ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                      />
                    </div>
                    <p className="text-caption text-copy">{entry.description}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <Section
        id="in-code"
        title="In code"
        description="Reach for a semantic utility first, a component token through Tailwind's variable syntax second, and a raw CSS variable only in hand-written CSS. Primitives stay out of components."
      >
        {/* Narrow screens wrap long lines between class names rather than cutting them off at the edge. */}
        <pre className="overflow-x-auto rounded-(--card-radius) border border-panel-border bg-panel p-(--card-padding) font-mono text-code whitespace-pre-wrap text-panel-foreground [overflow-wrap:anywhere] @prose:p-8 @prose:whitespace-pre @prose:[overflow-wrap:normal]">
          <code>
            <span className="text-panel-muted">{"// Semantic colour and type role\n"}</span>
            <Words>{'<p className="text-caption text-muted-foreground">'}</Words>
            {"\n\n"}
            <span className="text-panel-muted">{"// Component token\n"}</span>
            <Words>{'<div className="h-(--control-height-md) rounded-(--control-radius)">'}</Words>
            {"\n\n"}
            <span className="text-panel-muted">{"/* Plain CSS */\n"}</span>
            {".chart-grid { stroke: var(--border); }"}
          </code>
        </pre>
      </Section>
    </FoundationPage>
  )
}
