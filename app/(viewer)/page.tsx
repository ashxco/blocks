import Link from "next/link"
import { ArrowRightIcon, ArrowUpRightIcon, BoldIcon, BracesIcon, DropletIcon, PanelsTopLeftIcon, SquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/components/viewer/cn"
import {
  ComponentsMiniature,
  DeployCard,
  EntryTile,
  FoundationsMiniature,
  MoleculesMiniature,
  TemplatesMiniature,
} from "@/components/viewer/overview"
import { sectionDescription } from "@/components/viewer/nav"
import { SearchTrigger } from "@/components/viewer/search-trigger"
import { tokens } from "@/design-system/generated/tokens"
import { components, foundations, molecules, templates } from "@/lib/registry"

const counts = [
  { value: tokens.length, label: "Tokens", href: "/foundations/tokens" },
  { value: components.length, label: "Components", href: "/components" },
  { value: molecules.length, label: "Molecules", href: "/molecules" },
  { value: templates.length, label: "Templates", href: "/templates" },
]

const principles = [
  {
    icon: BracesIcon,
    title: "Tokens only",
    text: "Every colour, size, radius and duration comes from a token. Change the token and everything that uses it follows.",
  },
  {
    icon: SquareIcon,
    title: "No shadows",
    text: "Nothing floats. Surfaces sit flat on the page and stay crisp at any size, in either theme.",
  },
  {
    icon: DropletIcon,
    title: "No gradients",
    text: "Solid colour throughout. One violet accent, saved for links, focus and the one thing that matters most.",
  },
  {
    icon: BoldIcon,
    title: "Bold type",
    text: "Extra-bold headings in full ink with tight tracking. Never light, never grey.",
  },
  {
    icon: PanelsTopLeftIcon,
    title: "Borders and panels for depth",
    text: "Hairlines separate and tinted bands group. Dark panels carry emphasis and stay dark in both themes.",
  },
]

export default function Overview() {
  return (
    <div className="grid gap-section pb-section">
      {/* Statement */}
      <section className="container-wide grid gap-12 pt-14 sm:gap-16 sm:pt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h1 className="text-display">
            Blocks<span className="text-brand">.</span>
            <span className="mt-3 block text-h2 text-foreground">Build it once, in tokens.</span>
          </h1>
          <div className="grid gap-8 lg:pb-2">
            <p className="max-w-prose text-lead text-copy">
              A design system and template kit for Next.js. Foundations, components, molecules and full pages that all
              answer to one set of tokens, so the whole product changes when the system does.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/components" />}>
                Browse components
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/live" />}>
                Open live templates
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-y bg-border md:grid-cols-4">
          {counts.map((c, i) => (
            <div
              key={c.label}
              className={cn(
                "relative grid gap-1 bg-background py-6 pr-4 sm:py-8",
                i % 2 === 0 ? "pl-0" : "pl-5 sm:pl-8",
                i > 0 && "md:pl-8"
              )}
            >
              <dt className="order-2 text-label text-muted-foreground">
                <Link
                  href={c.href}
                  className="outline-none after:absolute after:inset-0 hover:text-foreground focus-visible:after:focus-ring"
                >
                  {c.label}
                </Link>
              </dt>
              <dd className="order-1 text-h1 text-foreground tabular">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Entry tiles */}
      <section aria-labelledby="explore" className="container-wide grid gap-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="explore" className="text-h2">
            Four layers, one system.
          </h2>
          <p className="max-w-prose text-lead text-copy">
            Tokens become components, components become molecules, molecules become pages. Start anywhere: each layer
            only uses the one below it.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <EntryTile
            href="/foundations"
            title="Foundations"
            description={sectionDescription.foundations}
            meta={`${foundations.length} pages.`}
          >
            <FoundationsMiniature />
          </EntryTile>
          <EntryTile
            href="/components"
            title="Components"
            description={sectionDescription.components}
            meta={`${components.length} components.`}
          >
            <ComponentsMiniature />
          </EntryTile>
          <EntryTile
            href="/molecules"
            title="Molecules"
            description={sectionDescription.molecules}
            meta={`${molecules.length} molecules.`}
          >
            <MoleculesMiniature />
          </EntryTile>
          <EntryTile
            href="/templates"
            title="Templates"
            description={sectionDescription.templates}
            meta={`${templates.length} pages.`}
            tone="panel"
          >
            <TemplatesMiniature />
          </EntryTile>
        </div>
      </section>

      {/* Light and dark */}
      <section aria-labelledby="themes" className="container-wide grid gap-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="themes" className="text-h2">
            One set of tokens. Two themes.
          </h2>
          <p className="max-w-prose text-lead text-copy">
            Components read semantic roles, not colours. The markup below is identical on both sides: only the tokens
            underneath change.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {(
            [
              { scope: "bk-light", label: "Light" },
              { scope: "dark", label: "Dark" },
            ] as const
          ).map(({ scope, label }) => (
            <figure key={scope} className="grid gap-3">
              <div className={scope}>
                <div className="grid min-h-96 place-items-center rounded-(--panel-radius) border bg-subtle p-5 text-copy sm:p-10">
                  <DeployCard />
                </div>
              </div>
              <figcaption className="text-caption text-muted-foreground">
                {label}, from <code className="font-mono text-foreground">{scope === "dark" ? ".dark" : ":root"}</code>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles" className="container-wide">
        <div className="grid gap-12 rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--viewer-bar)+2rem)]">
            <h2 id="principles" className="text-h2 text-panel-foreground">
              Five rules. No exceptions.
            </h2>
            <p className="max-w-prose text-lead text-panel-muted">
              The look comes from what the system leaves out. A lint check holds every file to these rules.
            </p>
            <div className="pt-2">
              <Button variant="inverse" nativeButton={false} render={<Link href="/foundations" />}>
                Read the foundations
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </div>
          <ul className="grid divide-y divide-panel-border border-y border-panel-border">
            {principles.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 py-6 sm:gap-6 sm:py-7">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-panel-border text-panel-foreground">
                  <Icon aria-hidden="true" className="size-4.5" />
                </span>
                <div className="grid gap-1.5">
                  <h3 className="text-h4 text-panel-foreground">{title}</h3>
                  <p className="text-body text-panel-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section aria-labelledby="find" className="container-wide">
        <div className="flex flex-col items-start gap-6 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-2">
            <h2 id="find" className="text-h3">
              Looking for something specific?
            </h2>
            <p className="text-body text-copy">
              Search every foundation, component, molecule and template. Press D at any time to switch themes.
            </p>
          </div>
          <SearchTrigger />
        </div>
      </section>
    </div>
  )
}
