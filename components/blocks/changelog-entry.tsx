import * as React from "react"

import { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"
import { tintClass, type CoverTint } from "@/components/blocks/post-card/post-cover"
import { cn } from "@/lib/utils"

export { ReleaseShot } from "@/components/blocks/changelog-entry/release-shot"

export interface ChangelogEntryProps {
  /** Display date, e.g. "Oct 1, 2026". */
  date?: string
  /** Machine-readable date for the <time> element, e.g. "2026-10-01". */
  dateTime?: string
  /** Release version, shown in mono, e.g. for an SDK release. Leave it out for product updates. */
  version?: string
  title?: React.ReactNode
  /** One or two sentences on what changed and why it matters. */
  description?: React.ReactNode
  /**
   * Screenshot slot. Pass true for the built-in automation rule card, or
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

/**
 * Inline code in release notes: API fields, webhook events, SDK methods and
 * package names. A token never breaks across lines, so `task.completed`
 * stays one pill on a phone; keep each one short (under about 30 characters).
 */
export function ChangelogCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code
      data-slot="changelog-code"
      className={cn(
        "rounded-xs bg-muted box-decoration-clone px-1 font-mono text-code whitespace-nowrap text-foreground",
        className
      )}
    >
      {children}
    </code>
  )
}

/* Defaults match the Acme changelog template, so docs and pages tell one story. */
const defaultEntry = {
  date: "Oct 1, 2026",
  dateTime: "2026-10-01",
  title: "Automations 2.0",
  description:
    "Rules can now run several steps, check a condition before they act and post to the apps your team uses. Start from a recipe or build your own in the new rule editor.",
  media: true,
  mediaTint: "violet" as const,
  items: [
    "Add up to ten steps to a rule, with a condition between any two",
    "A run history shows every task a rule touched and what it changed",
    <>
      Trigger rules from your own tools with the new <ChangelogCode>automation.run</ChangelogCode> API event
    </>,
  ],
}

/**
 * One update on a vertical rail: a dot on the rail, the date (and a
 * version, for an SDK release), a title, a short summary, an optional
 * screenshot and a list of smaller changes. On wide screens the date moves
 * to the left of the rail.
 */
export function ChangelogEntry({
  date = defaultEntry.date,
  dateTime = defaultEntry.dateTime,
  version,
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
    date: "Sep 17, 2026",
    dateTime: "2026-09-17",
    title: "Timeline view",
    description:
      "See a project as bars across the calendar. Drag a bar to change its dates, link tasks that depend on each other and spot clashes before they happen.",
    items: ["Zoom from days to quarters", "Linked tasks move together when you reschedule one"],
  },
  {
    date: "Sep 3, 2026",
    dateTime: "2026-09-03",
    title: "Guest access",
    description:
      "Invite clients, contractors and agencies to the projects they work on. Guests see only what you share with them, and they never take a member seat.",
    items: ["Guests can comment on tasks and complete the ones assigned to them", "Pro includes 10 guests"],
  },
  {
    date: "Aug 20, 2026",
    dateTime: "2026-08-20",
    title: "Shared dashboards",
    description:
      "Share a report dashboard with your whole workspace, or with one team. Dashboards update as tasks move, so the numbers are always current.",
    items: ["Pin a dashboard to the top of a project", "Send a weekly summary to a Slack channel"],
  },
  {
    date: "Aug 6, 2026",
    dateTime: "2026-08-06",
    title: "Recurring tasks",
    description:
      "Set a task to repeat every day, week or month. The next one appears when you complete the current one, with the same owner, subtasks and project.",
    items: ["Repeat on weekdays only, or on the last Friday of each month", "Skip one date without breaking the schedule"],
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
              key={entry.dateTime ?? entry.version ?? i}
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
