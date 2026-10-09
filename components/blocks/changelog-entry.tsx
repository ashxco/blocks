import * as React from "react"

import { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"
import { tintClass, type CoverTint } from "@/components/blocks/post-card/post-cover"
import { cn } from "@/lib/utils"

export { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"

export interface ChangelogEntryProps {
  /** Display date, e.g. "Oct 2, 2026". */
  date?: string
  /** Machine-readable date for the <time> element, e.g. "2026-10-02". */
  dateTime?: string
  /** Release version, shown in mono. */
  version?: string
  title?: React.ReactNode
  /** One or two sentences on what changed and why it matters. */
  description?: React.ReactNode
  /**
   * Screenshot slot. Pass true for the built-in flat sketch, or your own
   * image or component. It sits in a tinted, rounded frame.
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

const defaultEntry = {
  date: "Oct 2, 2026",
  dateTime: "2026-10-02",
  version: "v2.4.0",
  title: "Preview environments for every branch",
  description:
    "Every branch now gets its own environment with a stable URL, its own variables and a copy of your database. Share it with a reviewer and it stays up until the branch merges.",
  media: true,
  mediaTint: "violet" as const,
  items: [
    "Preview URLs show a QR code for testing on a phone",
    "Variables can be scoped to previews only",
    "Fixed a race when two pushes landed within the same second",
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
            "absolute top-1 left-1.5 size-3 -translate-x-1/2 rounded-full border-2 outline-4 outline-background @narrow:top-2.5",
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
    date: "Sep 18, 2026",
    dateTime: "2026-09-18",
    version: "v2.3.0",
    title: "Builds up to 3× faster with layer caching",
    description:
      "Lumen now caches dependency and build layers across branches, so most pushes skip the install step entirely.",
    items: [
      "Shared cache across every branch in a project",
      "Cache hit rate shown at the top of each build log",
      "Run lumen build --no-cache to start from a clean slate",
    ],
  },
  {
    date: "Sep 4, 2026",
    dateTime: "2026-09-04",
    version: "v2.2.0",
    title: "Export the audit log",
    description:
      "Workspace owners can export every action taken in a workspace as CSV or JSON, ready for a compliance review.",
    items: ["Filter by member, project or action before you export", "Exports include IP address and user agent"],
  },
  {
    date: "Aug 21, 2026",
    dateTime: "2026-08-21",
    version: "v2.1.0",
    title: "Lumen for Windows",
    description:
      "The desktop app now runs on Windows 11, with deploy notifications in the system tray and one-click rollbacks.",
    media: true,
    mediaTint: "sky",
    items: ["Signed installer with automatic updates", "Tray alerts when a build fails or a deploy goes live"],
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
