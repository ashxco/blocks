import Link from "next/link"
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EntryRow } from "@/components/viewer/entry-index"
import { Punct } from "@/components/viewer/kern"
import { MissingPath } from "@/components/viewer/missing-path"
import { navSections } from "@/components/viewer/nav"

/**
 * The body of a 404 page: a statement, what went wrong and how to recover,
 * then the four sections of Blocks as hairline rows. "hero" fills a page of
 * its own; "page" sits inside the viewer's content column.
 */
export function NotFoundContent({
  size = "hero",
  actions,
}: {
  size?: "hero" | "page"
  /** Extra actions after the two links, such as a search button. */
  actions?: React.ReactNode
}) {
  return (
    <div className="grid gap-14 sm:gap-20">
      <div className="grid gap-8">
        <h1 className={size === "hero" ? "pb-3 text-hero sm:pb-5" : "text-display"}>
          Page not <span className="text-brand">found</span>
          <Punct>.</Punct>
        </h1>
        <p className="max-w-prose text-lead text-copy">
          There is nothing at <MissingPath />. The page may have moved, or the address has a typo. Start again from
          the overview, or open the live templates.
        </p>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Button size="lg" nativeButton={false} render={<Link href="/" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to the overview
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="/live" target="_blank" rel="noopener" />}
          >
            Open live templates
            <ArrowUpRightIcon data-icon="inline-end" />
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
          {actions}
        </div>
      </div>

      <nav aria-label="Blocks sections" className="grid gap-5">
        <h2 className="text-h4">Or go straight to a section</h2>
        <ul className={cn("grid gap-x-8 sm:grid-cols-2", size === "hero" && "lg:grid-cols-4")}>
          {navSections.map((section) => (
            <li key={section.id} className="grid">
              <EntryRow href={section.href} title={section.title} description={section.description} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
