import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { foundations } from "@/lib/registry"
import { cn } from "@/lib/utils"

import { FoundationPage, Section } from "./layout"
import { samples } from "./overview-samples"
import { TierChain } from "./overview-tiers"

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
      description="The decisions every Blocks component is built on: themes, colour, type, space, shape, motion and icons. All of it lives in tokens, so the whole kit changes from one place, and a theme changes it all at once."
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
                  <div className="overflow-hidden border-b bg-muted">
                    {tile?.sample}
                  </div>
                  <div className="grid content-start gap-1.5 p-(--card-padding)">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-h4 text-foreground">{entry.title}</h2>
                      <ArrowRightIcon
                        aria-hidden
                        className="size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-(--duration-fast) ease-standard group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </div>
                    <p className="text-caption text-copy">
                      {entry.description}
                    </p>
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
        <pre className="overflow-x-auto rounded-(--card-radius) border border-panel-border bg-panel p-(--card-padding) font-mono text-code [overflow-wrap:anywhere] whitespace-pre-wrap text-panel-foreground @prose:p-8 @prose:[overflow-wrap:normal] @prose:whitespace-pre">
          <code>
            <span className="text-panel-muted">
              {"// Semantic colour and type role\n"}
            </span>
            <Words>
              {'<p className="text-caption text-muted-foreground">'}
            </Words>
            {"\n\n"}
            <span className="text-panel-muted">{"// Component token\n"}</span>
            <Words>
              {
                '<div className="h-(--control-height-md) rounded-(--control-radius)">'
              }
            </Words>
            {"\n\n"}
            <span className="text-panel-muted">{"/* Plain CSS */\n"}</span>
            {".chart-grid { stroke: var(--border); }"}
          </code>
        </pre>
      </Section>
    </FoundationPage>
  )
}
