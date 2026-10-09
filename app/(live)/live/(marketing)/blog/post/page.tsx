import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { CodeWindow } from "@/components/blocks/code-window"
import { PostGrid } from "@/components/blocks/post-card"
import { PostCover } from "@/components/blocks/post-card/post-cover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NewsletterBand } from "../_components/newsletter-band"
import { featuredPost, relatedPosts, withoutCategoryLabel } from "../_data/posts"
import { AuthorCard } from "./_components/author-card"
import { CopyLinkButton } from "./_components/copy-link-button"
import { Prose } from "./_components/prose"
import { PullQuote } from "./_components/pull-quote"
import { TableOfContents, type TocItem } from "./_components/table-of-contents"

export const metadata: Metadata = {
  title: "How we cut build times by 70%",
  description:
    "Layer caching, a smarter dependency graph and one very slow Docker step: the changes behind Lumen 2.3, with the numbers.",
}

const sections: TocItem[] = [
  { id: "where-the-time-went", title: "Where the time went" },
  { id: "cache-layers", title: "Cache layers, not images" },
  { id: "lockfile-keys", title: "Keying the cache on the lockfile", level: 3 },
  { id: "build-what-changed", title: "Build only what changed" },
  { id: "slow-docker-step", title: "The one slow Docker step" },
  { id: "results", title: "The results" },
  { id: "whats-next", title: "What comes next" },
]

const heading = Object.fromEntries(sections.map((s) => [s.id, s.title])) as Record<string, string>

const results = [
  { metric: "Median build", before: "61.2s", after: "17.8s", change: "−71%" },
  { metric: "95th percentile build", before: "4m 12s", after: "1m 38s", change: "−61%" },
  { metric: "Median image export", before: "11.6s", after: "2.4s", change: "−79%" },
  { metric: "Builds that skip install", before: "0%", after: "83%", change: "+83 pts" },
]

const author = {
  name: "Priya Natarajan",
  role: "Staff engineer, build team",
  initials: "PN",
  bio: "Priya leads the team that runs Lumen’s build fleet. Before Lumen she worked on CI infrastructure at a large payments company, where she learned to measure before she optimises.",
}

export default function BlogPostPage() {
  return (
    <>
      <article id="article" className="scroll-mt-(--header-height)">
        <header className="container-page pt-section-sm">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-3 lg:pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                nativeButton={false}
                render={<Link href="/live/blog" />}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                All posts
              </Button>
            </div>

            <div className="min-w-0 lg:col-span-9 xl:col-span-8">
              <h1 className="text-h1 text-foreground">{featuredPost.title}</h1>
              <p className="mt-6 max-w-prose text-lead text-copy">{featuredPost.excerpt}</p>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback tone="violet">{author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <p className="text-label text-foreground">{author.name}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-caption text-muted-foreground">
                      <time dateTime={featuredPost.dateTime}>{featuredPost.date}</time>
                      <span aria-hidden="true">·</span>
                      <span>{featuredPost.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <Link
                        href="/live/blog"
                        className="rounded-xs font-semibold text-foreground underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
                      >
                        {featuredPost.category}
                      </Link>
                    </p>
                  </div>
                </div>
                <CopyLinkButton />
              </div>
            </div>
          </div>
        </header>

        <div className="container-wide mt-12 md:mt-16">
          <PostCover
            pattern={featuredPost.cover?.pattern}
            tint={featuredPost.cover?.tint}
            className="aspect-16/10 rounded-(--panel-radius) sm:aspect-2/1 lg:aspect-21/9"
          />
        </div>

        <div className="container-page py-section-sm">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
                <TableOfContents items={sections} topId="article" />
              </div>
            </div>

            <div className="min-w-0 lg:col-span-8 xl:col-span-7">
              <Prose>
                <p>
                  In June, the median Lumen build took 61 seconds from push to a running image. Today it takes 18.
                  Nothing about your code changed, and there is no setting to turn on. This post walks through the
                  three changes that got us there, one idea that did not work, and the numbers before and after.
                </p>

                <h2 id="where-the-time-went">{heading["where-the-time-went"]}</h2>
                <p>
                  Before changing anything, we traced every step of the build pipeline and sampled 200,000 builds from
                  the first two weeks of June. We expected dependency installs to dominate. They did, but not for the
                  reason we assumed.
                </p>
                <ul>
                  <li>
                    <strong>Installing dependencies</strong> took 41% of build time, and in 83% of those builds the
                    lockfile had not changed since the previous deploy.
                  </li>
                  <li>
                    <strong>Rebuilding unchanged packages</strong> in monorepos took another 27%. A one-line fix to a docs
                    site rebuilt every app in the repository.
                  </li>
                  <li>
                    <strong>Exporting the image</strong> took 19%, almost all of it in a single compression step.
                  </li>
                </ul>
                <p>Most of a typical build was spent redoing work from the build before it.</p>

                <h2 id="cache-layers">{heading["cache-layers"]}</h2>
                <p>
                  Lumen has always cached the final image of your last successful build. The trouble is that a final
                  image is all or nothing: change one file and the whole cache misses. We now cache each step of the
                  build as its own layer, and keep layers in the region your builds run in, so restoring one is a local
                  disk read instead of a download.
                </p>

                <h3 id="lockfile-keys">{heading["lockfile-keys"]}</h3>
                <p>
                  Each layer gets a key made from the inputs that can change its output. For the install step, that is
                  your lockfile, your runtime version and the build image. If none of them changed, we restore{" "}
                  <code>node_modules</code> in about a second and skip the install entirely.
                </p>
                <p>
                  You can see and extend the keys in <code>lumen.toml</code>. Most projects never need to, but if your
                  build reads files outside the usual places, list them so a change invalidates the cache:
                </p>
                <CodeWindow title="lumen.toml">
                  <pre className="m-0 font-mono">
                    <code>
                      <span className="block">
                        <span className="text-panel-foreground">[build]</span>
                      </span>
                      <span className="block">command = &quot;npm run build&quot;</span>
                      <span className="block"> </span>
                      <span className="block text-panel-muted"># Restore these directories between builds.</span>
                      <span className="block">cache = [&quot;node_modules&quot;, &quot;.next/cache&quot;]</span>
                      <span className="block"> </span>
                      <span className="block text-panel-muted"># Rebuild the install layer when any of these change.</span>
                      <span className="block">
                        <span className="text-panel-foreground">[build.cache.keys]</span>
                      </span>
                      <span className="block">install = [&quot;package-lock.json&quot;, &quot;.nvmrc&quot;]</span>
                    </code>
                  </pre>
                </CodeWindow>

                <h2 id="build-what-changed">{heading["build-what-changed"]}</h2>
                <p>
                  For monorepos, Lumen now reads your workspace configuration and builds a graph of your packages before
                  the build starts. When you push, we compare the changed files against the graph and rebuild only the
                  packages they touch, plus anything that depends on them.
                </p>
                <p>
                  This works without configuration for Turborepo, Nx, and npm, pnpm or Yarn workspaces. A change to the
                  marketing site no longer rebuilds the API, and a change to a shared UI package rebuilds the apps that
                  import it and nothing else.
                </p>
                <PullQuote cite="Daniel Reyes, co-founder and CTO">
                  The fastest build step is the one you can prove you don’t need to run.
                </PullQuote>
                <p>
                  We also tried predicting which tests to skip from the same graph. It saved time, but it skipped a
                  test that mattered twice in the first week of the beta, so we turned it off. Skipping work is only
                  safe when the proof is exact.
                </p>

                <h2 id="slow-docker-step">{heading["slow-docker-step"]}</h2>
                <p>
                  The last fifth of every build went to exporting the image, and most of that was gzip running on a
                  single core. We switched layer compression to zstd, which compresses in parallel and decompresses
                  faster when a new replica starts.
                </p>
                <p>
                  That one change took export time from 11.6 seconds to 2.4 at the median, and cut cold starts for new
                  replicas by about a third as a side effect. Here is a build of our own dashboard today:
                </p>
                <CodeWindow
                  title="lumen deploy"
                  lines={[
                    "$ lumen deploy",
                    "→ Building lumen/dashboard from main (7c1e0b4)",
                    "✓ Restored install layer in 1.1s, lockfile unchanged",
                    "→ Skipped 38 of 41 packages, unchanged since 3e9d2aa",
                    "✓ Built 3 packages in 12.9s",
                    "✓ Exported image in 2.4s with zstd",
                    "✓ Live at https://dashboard.lumen.app in 17.8s",
                  ]}
                />

                <h2 id="results">{heading["results"]}</h2>
                <p>
                  We rolled the changes out to 10% of builds in August, then to everyone on September 16. Across every
                  build in the two weeks that followed:
                </p>
                <figure>
                  <Table variant="card">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Before</TableHead>
                        <TableHead className="text-right">After</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((row) => (
                        <TableRow key={row.metric}>
                          <TableCell className="font-semibold">{row.metric}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{row.before}</TableCell>
                          <TableCell className="text-right">{row.after}</TableCell>
                          <TableCell className="text-right font-semibold text-success">{row.change}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>1.4 million builds, September 16 to 30, 2026.</TableCaption>
                  </Table>
                </figure>
                <p>
                  Build minutes are billed by the second, so the change also lowered the bill for most teams. The
                  median team on the Pro plan used 64% fewer build minutes in the second half of September than in the
                  first.
                </p>

                <h2 id="whats-next">{heading["whats-next"]}</h2>
                <p>Builds that miss the cache are still slower than we want. Next, we are working on:</p>
                <ul>
                  <li>
                    <strong>Shared caches across branches</strong>, so a new preview environment starts from the layers
                    of main instead of from scratch.
                  </li>
                  <li>
                    <strong>Faster cold installs</strong>, by fetching your dependencies while the build machine boots.
                  </li>
                  <li>
                    <strong>Build insights</strong> in the dashboard: a timeline of every step, so you can see where your
                    own build spends its time.
                  </li>
                </ul>
                <p>
                  If your builds have not got faster, or you have a setup we did not plan for,{" "}
                  <Link href="/live/contact">tell us about it</Link>. We read every message.
                </p>
              </Prose>

              <AuthorCard {...author} href="/live/blog" className="mt-16" />
            </div>
          </div>
        </div>
      </article>

      <section aria-label="Related posts" className="border-t bg-subtle">
        <PostGrid
          posts={relatedPosts.map(withoutCategoryLabel)}
          title="Keep reading"
          viewAll={{ label: "All posts", href: "/live/blog" }}
          filter={false}
        />
      </section>

      <NewsletterBand className="container-page py-section" />
    </>
  )
}
