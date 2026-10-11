import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { EntryThumbnail } from "@/components/viewer/entry-thumbnail"
import { groupDescriptions, slugify } from "@/components/viewer/nav"
import type { RegistryEntry } from "@/lib/registry"

/**
 * A section index: one block per group, its name and purpose, then its
 * entries as cards. Each card shows a live miniature of the entry's first
 * example (when a preview is given), then its title and description.
 */
export function EntryIndex({
  groups,
  entries,
  base,
  previews,
  viewport,
}: {
  groups: readonly string[]
  entries: RegistryEntry[]
  base: string
  /** Live previews by slug, e.g. each entry's docs module. */
  previews?: Record<string, React.ReactNode>
  /** Widths previews lay out at before scaling: full-width examples, then the rest. */
  viewport?: { full: number; other: number }
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
            className="grid scroll-mt-24 gap-8"
          >
            <div className="grid gap-2">
              <h2 id={`${id}-title`} className="text-h3">
                {group}
              </h2>
              {groupDescriptions[group] ? (
                <p className="max-w-prose text-body text-copy">
                  {groupDescriptions[group]}
                </p>
              ) : null}
            </div>
            <ul className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-5 xl:grid-cols-3">
              {items.map((entry) => (
                <li key={entry.slug} className="grid">
                  <EntryCard
                    href={`${base}/${entry.slug}`}
                    title={entry.title}
                    description={entry.description}
                    preview={previews?.[entry.slug]}
                    viewport={viewport}
                  />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

/**
 * An entry as a card: the live preview in a hairline frame, then the title
 * and description. The whole card is one link (a stretched link, so the
 * preview stays outside it); hovering turns the frame's hairline to ink.
 */
function EntryCard({
  href,
  title,
  description,
  preview,
  viewport,
}: {
  href: string
  title: string
  description: string
  preview?: React.ReactNode
  viewport?: { full: number; other: number }
}) {
  return (
    <article className="group/entry relative grid content-start gap-4">
      <div
        className={cn(
          "overflow-hidden rounded-(--card-radius) border",
          "transition-colors duration-(--duration-base) ease-standard group-hover/entry:border-foreground"
        )}
      >
        <EntryThumbnail className="aspect-[4/3]" viewport={viewport}>
          {preview}
        </EntryThumbnail>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h3 className="text-title">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-(--card-radius) focus-visible:after:focus-ring"
            >
              {title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-caption text-muted-foreground">
            {description}
          </p>
        </div>
        <ArrowRightIcon
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-(--duration-base) ease-out group-hover/entry:translate-x-0.5 group-hover/entry:text-foreground"
        />
      </div>
    </article>
  )
}

/** A link as a hairline row: title, description and an arrow that nudges on hover. */
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
        "group/entry relative grid content-start gap-1.5 border-t py-5 pr-10 outline-none",
        "transition-colors duration-(--duration-base) ease-standard hover:border-foreground focus-visible:focus-ring",
        className
      )}
    >
      <span className="text-title text-foreground">{title}</span>
      <span className="line-clamp-2 text-caption text-muted-foreground">
        {description}
      </span>
      <ArrowRightIcon
        aria-hidden="true"
        className={cn(
          "absolute top-5.5 right-1 size-4 text-muted-foreground",
          "transition-[translate,color] duration-(--duration-base) ease-out",
          "group-hover/entry:translate-x-0.5 group-hover/entry:text-foreground"
        )}
      />
    </Link>
  )
}
