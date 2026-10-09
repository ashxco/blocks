import Link from "next/link"
import { ArrowRightIcon, ScaleIcon, StarIcon, TagIcon } from "lucide-react"

import { InstallCommand } from "@/components/blocks/install-command"
import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"

const repoStats = [
  { label: "GitHub stars", value: "12.4k" },
  { label: "Contributors", value: "186" },
  { label: "Releases", value: "94" },
]

/** The three newest releases, matching the changelog template. */
const releases = [
  { version: "v2.12.0", title: "Branch your database with every preview", date: "Oct 6" },
  { version: "v2.11.0", title: "Live logs in your terminal", date: "Sep 24" },
  { version: "v2.10.0", title: "New regions in São Paulo, Mumbai and Sydney", date: "Sep 10" },
]

/**
 * Home page band about the open-source core: a bold pitch on the left and a
 * repository card with stars, contributors, recent releases and the
 * self-host install command on the right.
 */
export function OpenSourceBand() {
  return (
    <section aria-labelledby="open-source-heading" className="container-page pb-section">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div className="grid justify-items-start gap-6">
          <h2 id="open-source-heading" className="max-w-narrow text-h2 text-foreground">
            <Kern>
              Apache 2.0.
              <br />
              Fork it, run it, ship it.
            </Kern>
          </h2>
          <p className="max-w-prose text-lead text-copy">
            The builder, the router and the dashboard are open source. Run Lumen on one server or a hundred, with
            no licence key and nothing phoning home.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/live/blog/post" />}>
              Self-hosting guide
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<a href="https://github.com" />}>
              <StarIcon data-icon="inline-start" />
              Star on GitHub
            </Button>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-sm bg-foreground">
                <span className="size-3 rounded-full bg-brand" />
              </span>
              <div className="grid min-w-0 gap-0.5">
                <p className="truncate font-mono text-label text-foreground">lumen-dev/lumen</p>
                <p className="truncate text-caption text-muted-foreground">The open-source deployment platform</p>
              </div>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-caption text-muted-foreground sm:inline-flex">
              <ScaleIcon aria-hidden="true" className="size-3.5" />
              Apache-2.0
            </span>
          </div>

          <dl className="grid grid-cols-3 divide-x border-b">
            {repoStats.map((stat) => (
              <div key={stat.label} className="flex min-w-0 flex-col gap-1 px-4 py-5 sm:px-6 sm:py-6">
                <dt className="order-2 truncate text-caption text-muted-foreground">{stat.label}</dt>
                <dd className="order-1 text-h3 text-foreground tabular">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="px-4 pt-5 sm:px-6">
            <h3 className="text-label text-foreground">Latest releases</h3>
          </div>
          <ul className="divide-y px-4 pb-2 sm:px-6">
            {releases.map((release) => (
              <li key={release.version} className="flex items-start gap-3 py-3.5">
                <TagIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="shrink-0 font-mono text-caption text-foreground">{release.version}</span>
                  <span className="min-w-0 text-sm text-copy sm:truncate">{release.title}</span>
                </span>
                <span className="shrink-0 text-caption text-muted-foreground tabular">{release.date}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-3 border-t bg-subtle px-4 py-5 sm:px-6">
            <p className="text-label text-foreground">Self-host on any Linux server</p>
            <InstallCommand command="curl -fsSL get.lumen.dev | sh" className="w-full bg-background" />
          </div>
        </div>
      </div>
    </section>
  )
}
