import * as React from "react"

import { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"
import { tintClass, type CoverTint } from "@/components/blocks/post-card/post-cover"
import { cn } from "@/lib/utils"

export { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"

export interface ChangelogEntryProps {
  /** Display date, e.g. "Oct 6, 2026". */
  date?: string
  /** Machine-readable date for the <time> element, e.g. "2026-10-06". */
  dateTime?: string
  /** Release version, shown in mono. */
  version?: string
  title?: React.ReactNode
  /** One or two sentences on what changed and why it matters. */
  description?: React.ReactNode
  /**
   * Screenshot slot. Pass true for the built-in preview environment card, or
   * your own image or component. It sits in a tinted, rounded frame.
   */
  media?: React.ReactNode
  /** Fill behind the screenshot. */
  mediaTint?: Exclude<CoverTint, "panel">
  /** Smaller changes, shown as a bullet list. */
  items?: React.ReactNode[]
  /** Marks the newest release with a brand dot on the rail. */
  latest?: boolean
  /** Heading level of the title. */
  as?: "h2" | "h3"
  /** Extra content under the list, such as a link to the docs. */
  children?: React.ReactNode
  className?: string
}

/* Defaults match the Lumen changelog template, so docs and pages tell one story. */
const defaultEntry = {
  date: "Oct 6, 2026",
  dateTime: "2026-10-06",
  version: "v2.12.0",
  title: "Branch your database with every preview",
  description:
    "Preview environments now get a copy-on-write branch of your Postgres database. Run migrations against real data without touching production. Lumen deletes the branch when the pull request closes.",
  media: true,
  mediaTint: "violet" as const,
  items: [
    "Branches are ready in under two seconds, whatever the size of the database",
    "Seed scripts run after branching when you set preview.seed in lumen.toml",
    "Fixed preview URLs returning 404 for a few seconds after a force push",
  ],
}

/**
 * One release on a vertical rail: a dot on the rail, the date and version,
 * a title, a short summary, an optional screenshot and a list of smaller
 * changes. On wide screens the date and version move to the left of the rail.
 */
export function ChangelogEntry({
  date = defaultEntry.date,
  dateTime = defaultEntry.dateTime,
  version = defaultEntry.version,
  title = defaultEntry.title,
  description = defaultEntry.description,
  media = defaultEntry.media,
  mediaTint = defaultEntry.mediaTint,
  items = defaultEntry.items,
  latest = false,
  as: Heading = "h2",
  children,
  className,
}: ChangelogEntryProps) {
  return (
    <article
      data-slot="changelog-entry"
      data-latest={latest || undefined}
      className={cn("group/entry @container relative", className)}
    >
      <div className="relative pb-20 pl-10 group-last/entry:pb-0 @narrow:ml-48">
        {/* Rail and dot */}
        <span aria-hidden="true" className="absolute inset-y-0 left-1.5 w-px -translate-x-1/2 bg-border" />
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 left-1.5 size-3 -translate-x-1/2 rounded-full border-(length:--border-width-strong) outline-4 outline-background @narrow:top-2.5",
            latest ? "border-brand bg-brand" : "border-foreground bg-background"
          )}
        />

        {/* Date and version: above the title in narrow slots, left of the rail when wide */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 @narrow:absolute @narrow:top-1.5 @narrow:right-full @narrow:mr-8 @narrow:mb-0 @narrow:w-40 @narrow:flex-col @narrow:items-end @narrow:gap-1.5">
          {date ? (
            <time dateTime={dateTime} className="text-label text-foreground">
              {date}
            </time>
          ) : null}
          {version ? (
            <span className="rounded-xs border px-1.5 font-mono text-xs leading-5 text-muted-foreground">
              {version}
            </span>
          ) : null}
        </div>

        <div className="grid max-w-narrow gap-4">
          <Heading className="text-h3 text-foreground">{title}</Heading>
          {description ? <p className="max-w-prose text-body text-copy">{description}</p> : null}
        </div>

        {media ? (
          <figure
            className={cn(
              "mt-8 max-w-narrow overflow-hidden rounded-(--card-radius) border",
              tintClass[mediaTint]
            )}
          >
            {media === true ? <ReleaseShot /> : media}
          </figure>
        ) : null}

        {items && items.length > 0 ? (
          <ul className="mt-8 grid max-w-prose gap-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-body text-copy">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {children ? <div className="mt-8 max-w-prose">{children}</div> : null}
      </div>
    </article>
  )
}

export const defaultChangelog: ChangelogEntryProps[] = [
  defaultEntry,
  {
    date: "Sep 24, 2026",
    dateTime: "2026-09-24",
    version: "v2.11.0",
    title: "Live logs in your terminal",
    description:
      "lumen logs now streams from every replica at once, with filters for level, route and status code. Leave it running through a deploy and the stream moves to the new version on its own.",
    items: [
      "Filter with --level error, --route /api or --status 5xx",
      "Search the last 30 days with --since 30d on Pro and Scale",
      "Timestamps now use your local time zone",
    ],
  },
  {
    date: "Sep 10, 2026",
    dateTime: "2026-09-10",
    version: "v2.10.0",
    title: "New regions in São Paulo, Mumbai and Sydney",
    description:
      "You can now deploy to 14 regions. Choose regions per project, and Lumen sends each request to the nearest healthy replica.",
    items: [
      "Move a project between regions without downtime",
      "Latency from each region now shows on the metrics page",
    ],
  },
  {
    date: "Aug 27, 2026",
    dateTime: "2026-08-27",
    version: "v2.9.0",
    title: "Spending caps and usage alerts",
    description:
      "Set a monthly cap on usage charges for each workspace. Owners get an email at 50%, 80% and 100%, and you decide what happens at the cap.",
    items: [
      "Caps apply to bandwidth, build minutes and database storage",
      "Alerts can also post to a Slack channel or a webhook",
    ],
  },
]

export interface ChangelogTimelineProps {
  /** Releases, newest first. Ignored when children are passed. */
  entries?: ChangelogEntryProps[]
  /** Your own <ChangelogEntry> elements. */
  children?: React.ReactNode
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

/**
 * The rail that holds changelog entries. Marks the first entry as the latest
 * release.
 */
export function ChangelogTimeline({
  entries = defaultChangelog,
  children,
  contained = true,
  className,
}: ChangelogTimelineProps) {
  return (
    <section data-slot="changelog-timeline" className={cn(contained && "container-page py-section", className)}>
      <div className="grid">
        {children ??
          entries.map((entry, i) => (
            <ChangelogEntry
              key={entry.version ?? i}
              description={null}
              media={null}
              items={[]}
              latest={i === 0}
              {...entry}
            />
          ))}
      </div>
    </section>
  )
}
