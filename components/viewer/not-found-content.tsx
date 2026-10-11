import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntryRow } from "@/components/viewer/entry-index"
import { Punct } from "@/components/ui/kern"
import { MissingPath } from "@/components/viewer/missing-path"
import { topLinks } from "@/components/viewer/nav"

/**
 * The body of a 404 page: a statement, what went wrong and how to recover,
 * then Foundations, Components and Themes as hairline rows. "hero" fills a
 * page of its own; "page" sits inside the viewer's content column.
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
        <h1
          className={
            size === "hero" ? "pb-3 text-hero sm:pb-5" : "text-display"
          }
        >
          Page not <span className="text-brand">found</span>
          <Punct>.</Punct>
        </h1>
        <p className="max-w-prose text-lead text-copy">
          There is nothing at <MissingPath />. The page may have moved, or the
          address has a typo. Start again from the overview, or browse the
          components.
        </p>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Button size="lg" nativeButton={false} render={<Link href="/" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to the Overview
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/components" />}
          >
            Browse Components
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          {actions}
        </div>
      </div>

      <nav aria-label="Blocks sections" className="grid gap-5">
        <h2 className="text-h4">Or go straight to a section</h2>
        <ul className="grid gap-x-8 md:grid-cols-3">
          {topLinks.map((link) => (
            <li key={link.id} className="grid">
              <EntryRow
                href={link.href}
                title={link.title}
                description={link.description}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
