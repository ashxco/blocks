import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/components/viewer/cn"
import { groupDescriptions, slugify } from "@/components/viewer/nav"
import type { RegistryEntry } from "@/lib/registry"

/**
 * A section index: one block per group, the group's name and purpose on the
 * left, its entries on the right as hairline rows. Hovering a row turns its
 * hairline to ink and nudges the arrow.
 */
export function EntryIndex({
  groups,
  entries,
  base,
}: {
  groups: readonly string[]
  entries: RegistryEntry[]
  base: string
}) {
  return (
    <div className="grid gap-16 sm:gap-20">
      {groups.map((group) => {
        const items = entries.filter((e) => e.group === group)
        if (!items.length) return null
        const id = slugify(group)
        return (
          <section
            key={group}
            id={id}
            aria-labelledby={`${id}-title`}
            className="grid scroll-mt-24 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-12"
          >
            <div className="grid content-start gap-2 lg:sticky lg:top-[calc(var(--viewer-bar)+2rem)]">
              <h2 id={`${id}-title`} className="text-h3">
                {group}
              </h2>
              {groupDescriptions[group] ? (
                <p className="max-w-80 text-body text-copy">{groupDescriptions[group]}</p>
              ) : null}
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {items.map((entry) => (
                <li key={entry.slug} className="grid">
                  <EntryRow href={`${base}/${entry.slug}`} title={entry.title} description={entry.description} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export function EntryRow({
  href,
  title,
  description,
  className,
}: {
  href: string
  title: string
  description: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/entry relative grid gap-1.5 border-t py-5 pr-10 outline-none",
        "transition-colors duration-(--duration-base) ease-standard hover:border-foreground focus-visible:focus-ring",
        className
      )}
    >
      <span className="text-title text-foreground">{title}</span>
      <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>
      <ArrowUpRightIcon
        aria-hidden="true"
        className={cn(
          "absolute top-5 right-1 size-4 text-muted-foreground",
          "transition-[translate,color] duration-(--duration-base) ease-out",
          "group-hover/entry:translate-x-0.5 group-hover/entry:-translate-y-0.5 group-hover/entry:text-foreground"
        )}
      />
    </Link>
  )
}
