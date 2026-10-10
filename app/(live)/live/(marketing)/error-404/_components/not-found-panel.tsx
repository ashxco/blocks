import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

const popular = [
  { title: "Pricing", description: "Free for up to 3 members", href: "/live/pricing" },
  { title: "Features", description: "What Acme does for your team", href: "/live/features" },
  { title: "Changelog", description: "What shipped this month", href: "/live/changelog" },
  { title: "Blog", description: "Guides and product news", href: "/live/blog" },
]

const subtasks = [
  { title: "Check the address for typos", done: true },
  { title: "Try one of the pages below", done: false },
  { title: "Still lost? Write to support@acme.com", done: false },
]

/** The missing page as an Acme task, with the ways out as its subtasks. Decorative. */
function MissingPageTask() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-5 rounded-(--card-radius) border border-panel-border bg-panel-raised p-5 text-panel-foreground sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-caption text-panel-muted">acme.com · Task</p>
          <p className="text-h4 text-panel-foreground">Find the page you were looking for</p>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-panel-border px-2.5 py-0.5 text-caption font-semibold text-panel-foreground">
          <span className="size-1.5 rounded-full bg-panel-warning" />
          Not found
        </span>
      </div>
      <ul className="grid gap-3 border-t border-panel-border pt-5">
        {subtasks.map((subtask) => (
          <li key={subtask.title} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "grid size-(--selection-size) shrink-0 place-items-center rounded-xs border",
                subtask.done ? "border-panel-foreground bg-panel-foreground text-panel" : "border-panel-muted"
              )}
            >
              {subtask.done ? <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
            </span>
            <span className={subtask.done ? "text-panel-muted line-through" : "text-panel-foreground"}>
              {subtask.title}
            </span>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between gap-3 border-t border-panel-border pt-4 text-caption text-panel-muted">
        <span>Assigned to you</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          Due today
        </span>
      </p>
    </div>
  )
}

/**
 * The not-found screen: a dark panel with the message and two ways out, the
 * missing page drawn as an Acme task with the next steps as its subtasks,
 * and links to the most visited pages along the bottom.
 */
export function NotFoundPanel({ className }: { className?: string }) {
  return (
    <section className={cn("container-page", className)}>
      <div className="@container rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground">
        <div className="grid items-center gap-12 @min-[60rem]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @min-[60rem]:gap-16">
          <div className="grid justify-items-start gap-6">
            <h1 className="max-w-narrow text-display text-panel-foreground">
              <Kern>This page isn’t on the plan.</Kern>
            </h1>
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

          <MissingPageTask />
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
