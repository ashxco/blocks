import Link from "next/link"
import { ArrowRightIcon, BoldIcon, BracesIcon, DropletIcon, PanelsTopLeftIcon, SquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ComponentsMiniature, EntryTile, FoundationsMiniature, ProjectCard } from "@/components/viewer/overview"
import { Kern, Punct } from "@/components/viewer/kern"
import { sectionDescription } from "@/components/viewer/nav"
import { SearchTrigger } from "@/components/viewer/search-trigger"
import { ThemeShowcase } from "@/components/viewer/theme-showcase"
import { tokens } from "@/design-system/generated/tokens"
import { components, foundations } from "@/lib/registry"
import { themes } from "@/lib/themes"

const counts = [
  { value: tokens.length, label: "Tokens", href: "/foundations/tokens" },
  { value: foundations.length, label: "Foundations", href: "/foundations" },
  { value: components.length, label: "Components", href: "/components" },
  { value: themes.length, label: "Themes", href: "/foundations/themes" },
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
    text: "Nothing floats. Surfaces sit flat on the page and stay crisp at any size, in light and dark.",
  },
  {
    icon: DropletIcon,
    title: "No gradients",
    text: "Solid colour throughout. One accent per theme, saved for links, focus and the one thing that matters most.",
  },
  {
    icon: BoldIcon,
    title: "Bold type",
    text: "Extra-bold headings in full ink with tight tracking. Never light, never grey.",
  },
  {
    icon: PanelsTopLeftIcon,
    title: "Borders and panels, not depth",
    text: "Hairlines separate and tinted bands group. Dark panels carry emphasis and stay dark in both modes.",
  },
]

export default function Overview() {
  return (
    <div className="grid gap-section pb-section">
      {/* Statement */}
      <section className="container-wide grid gap-12 pt-14 sm:gap-16 sm:pt-20 lg:pt-24">
        <div className="grid gap-10 sm:gap-14">
          <h1 className="text-hero">
            <span className="block">
              Build it once<Punct>,</Punct>
            </span>
            <span className="block">
              in <span className="text-brand">tokens</span>
              <Punct>.</Punct>
            </span>
          </h1>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <p className="max-w-prose text-lead text-copy">
              Blocks is a design system for Next.js. Its foundations and {components.length} accessible components
              all answer to one set of tokens, so every component changes when the system does.
            </p>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button size="lg" nativeButton={false} render={<Link href="/components" />}>
                Browse Components
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/foundations/themes" />}>
                Explore the Themes
                <ArrowRightIcon data-icon="inline-end" />
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
            <Kern>Two layers, built in order.</Kern>
          </h2>
          <p className="max-w-prose text-lead text-copy">
            Foundations are the tokens: colour, type, space, shape and motion. Components are made of nothing else, so
            each one changes the moment a token does.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_auto] md:gap-5">
          <EntryTile
            href="/foundations"
            title="Foundations"
            description={sectionDescription.foundations}
          >
            <FoundationsMiniature />
          </EntryTile>
          <EntryTile
            href="/components"
            title="Components"
            description={sectionDescription.components}
            tone="panel"
          >
            <ComponentsMiniature />
          </EntryTile>
        </div>
      </section>

      {/* Themes */}
      <section aria-labelledby="themes" className="container-wide grid gap-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="themes" className="text-h2">
            <Kern>Five themes. One system.</Kern>
          </h2>
          <div className="grid justify-items-start gap-4">
            <p className="max-w-prose text-lead text-copy">
              A theme sets the accent, the neutrals, the corner radii and the type, in light and dark. The components
              stay the same. Choose one and the whole site follows, every example included.
            </p>
            <Button variant="link" nativeButton={false} render={<Link href="/foundations/themes" />}>
              How Themes Work
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <ThemeShowcase />
      </section>

      {/* Light and dark */}
      <section aria-labelledby="modes" className="container-wide grid gap-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="modes" className="text-h2">
            <Kern>One set of tokens. Light and dark.</Kern>
          </h2>
          <p className="max-w-prose text-lead text-copy">
            Components read semantic roles, not colours. The markup below is identical on both sides: only the tokens
            underneath change.
          </p>
        </div>
        {/* Side by side from lg: below that the cards need the full width. */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {(
            [
              { scope: "light", label: "Light" },
              { scope: "dark", label: "Dark" },
            ] as const
          ).map(({ scope, label }) => (
            <figure key={scope} className="grid gap-3">
              <div className={scope}>
                <div className="grid min-h-96 place-items-center rounded-(--panel-radius) border bg-subtle p-4 text-copy sm:p-10">
                  <ProjectCard />
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
          <div className="grid content-start gap-5 lg:sticky lg:top-8">
            <h2 id="principles" className="text-h2 text-panel-foreground">
              <span className="block">
                <Kern>Five rules.</Kern>
              </span>
              <span className="block">
                <Kern>No exceptions.</Kern>
              </span>
            </h2>
            <p className="max-w-prose text-lead text-panel-muted">
              The look comes from what the system leaves out. A lint check holds every file to these rules.
            </p>
            <div className="pt-2">
              <Button variant="inverse" nativeButton={false} render={<Link href="/foundations" />}>
                Read the Foundations
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
              <Kern>Looking for something specific?</Kern>
            </h2>
            <p className="text-body text-copy">
              Search every foundation, component and theme.
              <span className="hidden sm:not-pointer-coarse:inline"> Press D at any time to switch between light and dark.</span>
            </p>
          </div>
          <SearchTrigger />
        </div>
      </section>
    </div>
  )
}
