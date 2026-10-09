import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { CodeWindow } from "@/components/blocks/code-window"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const popular = [
  { title: "Pricing", description: "Plans from $5 a month", href: "/live/pricing" },
  { title: "Features", description: "What Lumen does for you", href: "/live/features" },
  { title: "Changelog", description: "What shipped this week", href: "/live/changelog" },
  { title: "Blog", description: "Guides and engineering notes", href: "/live/blog" },
]

/**
 * The not-found screen: a dark panel with the message and two ways out, a
 * terminal that shows the failed request, and links to the most visited
 * pages along the bottom.
 */
export function NotFoundPanel({ className }: { className?: string }) {
  return (
    <section className={cn("container-page", className)}>
      <div className="@container relative isolate overflow-hidden rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 600"
          fill="none"
          className="pointer-events-none absolute -bottom-72 -left-72 -z-10 size-160 stroke-panel-border"
        >
          {[60, 120, 180, 240, 299].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <div className="grid items-center gap-12 @min-[60rem]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @min-[60rem]:gap-16">
          <div className="grid justify-items-start gap-6">
            <h1 className="max-w-narrow text-display text-panel-foreground">This page didn’t ship.</h1>
            <p className="max-w-prose text-lead text-panel-muted">
              The link may be out of date, or the page moved when we reorganised the site. Check the address for typos,
              or head back to the start.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="inverse" size="lg" nativeButton={false} render={<Link href="/live" />}>
                <ArrowLeftIcon data-icon="inline-start" />
                Back home
              </Button>
              <Button variant="outline-inverse" size="lg" nativeButton={false} render={<Link href="/live/contact" />}>
                Contact support
              </Button>
            </div>
          </div>

          <CodeWindow
            title="lumen.dev"
            lines={[
              "$ curl -I https://lumen.dev/docs/v1/quickstart",
              "HTTP/2 404",
              "x-lumen-region: fra-1",
              "x-lumen-route: no match",
              "→ No deployment serves this path",
              "→ Checked 12 redirects and 3 rewrites",
            ]}
          />
        </div>

        <nav aria-label="Popular pages" className="mt-14 border-t border-panel-border pt-8 @min-[60rem]:mt-20">
          <ul className="grid gap-x-6 gap-y-2 @min-[34rem]:grid-cols-2 @min-[60rem]:grid-cols-4">
            {popular.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="group/link -mx-3 flex items-start justify-between gap-4 rounded-md px-3 py-3 outline-none transition-colors duration-(--duration-fast) ease-standard hover:bg-panel-raised focus-visible:focus-ring"
                >
                  <span className="grid gap-0.5">
                    <span className="text-title text-panel-foreground">{page.title}</span>
                    <span className="text-caption text-panel-muted">{page.description}</span>
                  </span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4.5 shrink-0 text-panel-muted transition-[color,translate] duration-(--duration-fast) ease-standard group-hover/link:translate-x-0.5 group-hover/link:text-panel-foreground"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
