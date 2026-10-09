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

import { primitiveScales, refLabel, tokenByName, tokenByVar, tokens } from "./data"
import { cx, FoundationPage } from "./layout"

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
      <div className="grid gap-4 @narrow:grid-cols-2 @narrow:items-end @narrow:gap-10">
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
          <span aria-hidden className="flex h-14 items-center gap-3 rounded-md border border-panel-border px-4">
            <span className="size-3 rounded-full bg-brand" />
            <span className="text-label text-brand">Links, focus, highlights</span>
          </span>
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Semantic</p>
            <code className="font-mono text-code text-panel-muted">
              {brand.cssVar} · bg-brand
            </code>
            <span className="font-mono text-xs text-panel-muted">
              {refLabel(brand.ref)} in light, {refLabel(brand.dark?.ref)} in dark
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
            <span className="font-mono text-xs text-panel-muted">
              {radius?.cssVar} · {height?.cssVar}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Tile samples                                                              */
/* ------------------------------------------------------------------------ */

function ColorSample() {
  const scales = primitiveScales()
  return (
    <div
      aria-hidden
      className="grid size-full gap-1 p-5"
      style={{ gridTemplateRows: `repeat(${scales.length}, minmax(0, 1fr))` }}
    >
      {scales.map((scale) => (
        <div key={scale.name} className="flex gap-1">
          {scale.steps.map((s) => (
            <span
              key={s.step}
              className="block h-full flex-1 rounded-xs"
              style={{ backgroundColor: `var(${s.token.cssVar})` }}
            />
          ))}
        </div>
      ))}
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

function ShapeSample() {
  return (
    <div aria-hidden className="flex size-full items-center justify-center gap-3 p-6">
      <span className="size-14 rounded-sm border bg-background" />
      <span className="size-14 rounded-lg border bg-background" />
      <span className="size-14 rounded-2xl bg-foreground" />
      <span className="size-14 rounded-full border bg-background" />
    </div>
  )
}

function MotionSample() {
  return (
    <div aria-hidden className="grid size-full content-center gap-3 p-6">
      <span className="relative block h-10 rounded-full border bg-background">
        <span className="absolute top-1 left-1 size-7.5 rounded-full bg-foreground transition-[left] duration-(--duration-slower) ease-out group-hover:left-[calc(100%-2.125rem)] group-focus-visible:left-[calc(100%-2.125rem)]" />
      </span>
      <span className="relative block h-10 rounded-full border bg-background">
        <span className="absolute top-1 left-1 size-7.5 rounded-full bg-muted-foreground transition-[left] duration-(--duration-slower) ease-in-out group-hover:left-[calc(100%-2.125rem)] group-focus-visible:left-[calc(100%-2.125rem)]" />
      </span>
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

function TokensSample() {
  const sample = ["--brand", "--radius-lg", "--duration-base", "--text-h2"]
    .map((v) => tokens.find((t) => t.cssVar === v))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  return (
    <div aria-hidden className="grid size-full content-center p-5">
      <div className="grid overflow-hidden rounded-md border bg-background">
        {sample.map((t) => (
          <div key={t.cssVar} className="flex items-center gap-3 border-t px-3 py-2 first:border-t-0">
            {t.type === "color" ? (
              <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: `var(${t.cssVar})` }} />
            ) : (
              <span className="size-3 shrink-0 rounded-full border" />
            )}
            <span className="font-mono text-xs text-foreground">{t.cssVar}</span>
            <span className="ml-auto truncate font-mono text-xs text-muted-foreground">
              {t.type === "typography" ? "type role" : String(t.value)}
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
  motion: { sample: <MotionSample /> },
  iconography: { sample: <IconSample /> },
  tokens: { sample: <TokensSample />, span: "@narrow:col-span-2" },
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

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
              <li key={entry.slug} className={cx("min-w-0", tile?.span)}>
                <Link
                  href={`/foundations/${entry.slug}`}
                  className="group grid h-full grid-rows-[11rem_auto] overflow-hidden rounded-(--card-radius) border bg-card transition-colors duration-(--duration-fast) ease-standard hover:border-foreground"
                >
                  <div className="overflow-hidden border-b bg-subtle">{tile?.sample}</div>
                  <div className="grid content-start gap-1.5 p-(--card-padding)">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-h4">{entry.title}</h2>
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

      <section aria-labelledby="in-code-title" className="grid gap-10 border-t pt-10 @narrow:grid-cols-2 @narrow:gap-10">
        <div className="grid content-start gap-4">
          <h2 id="in-code-title" className="text-h2">
            In code
          </h2>
          <p className="max-w-prose text-body text-copy">
            Reach for a semantic utility first, a component token through Tailwind&apos;s variable syntax second, and a raw
            CSS variable only in hand-written CSS. Primitives stay out of components.
          </p>
        </div>
        <pre className="overflow-x-auto rounded-(--card-radius) bg-terminal p-(--card-padding) font-mono text-code text-terminal-foreground">
          <code>
            <span className="text-panel-muted">{"// Semantic colour and type role\n"}</span>
            {'<p className="text-caption text-muted-foreground">\n\n'}
            <span className="text-panel-muted">{"// Component token\n"}</span>
            {'<div className="h-(--control-height-md) rounded-(--control-radius)">\n\n'}
            <span className="text-panel-muted">{"/* Plain CSS */\n"}</span>
            {".chart-grid { stroke: var(--border); }"}
          </code>
        </pre>
      </section>
    </FoundationPage>
  )
}
