import type { Metadata } from "next"
import type * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ChangelogTimeline, ReleaseShot, type ChangelogEntryProps } from "@/components/blocks/changelog-entry"
import { CtaBand } from "@/components/blocks/cta-band"
import { NewsletterForm } from "@/components/blocks/newsletter-form"
import { Button } from "@/components/ui/button"

import { LogsShot, SpendLimitShot } from "./_components/release-media"

/** Inline code in release notes. */
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-xs bg-muted px-1 font-mono text-code text-foreground">{children}</code>
}

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "New features, improvements and fixes in Lumen, newest first. Database branching, live logs, new regions and more.",
}

const releases: ChangelogEntryProps[] = [
  {
    date: "Oct 6, 2026",
    dateTime: "2026-10-06",
    version: "v2.12.0",
    title: "Branch your database with every preview",
    description:
      "Preview environments now get a copy-on-write branch of your Postgres database. Run migrations against real data without touching production. Lumen deletes the branch when the pull request closes.",
    media: <ReleaseShot />,
    mediaTint: "violet",
    items: [
      "Branches are ready in under two seconds, whatever the size of the database",
      <>
        Seed scripts run after branching when you set <Code>preview.seed</Code> in <Code>lumen.toml</Code>
      </>,
      "Fixed preview URLs returning 404 for a few seconds after a force push",
    ],
  },
  {
    date: "Sep 24, 2026",
    dateTime: "2026-09-24",
    version: "v2.11.0",
    title: "Live logs in your terminal",
    description: (
      <>
        <Code>lumen logs</Code> now streams from every replica at once, with filters for level, route and status
        code. Leave it running through a deploy and the stream moves to the new version on its own.
      </>
    ),
    media: <LogsShot />,
    mediaTint: "sand",
    items: [
      <>
        Filter with <Code>--level error</Code>, <Code>--route /api</Code> or <Code>--status 5xx</Code>
      </>,
      <>
        Search the last 30 days with <Code>--since 30d</Code> on Pro and Scale
      </>,
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
      "Postgres read replicas are available in every region on Scale",
    ],
  },
  {
    date: "Aug 27, 2026",
    dateTime: "2026-08-27",
    version: "v2.9.0",
    title: "Spending caps and usage alerts",
    description:
      "Set a monthly cap on usage charges for each workspace. Owners get an email at 50%, 80% and 100%, and you decide what happens at the cap: pause previews, or keep everything running.",
    media: <SpendLimitShot />,
    mediaTint: "mint",
    items: [
      "Caps apply to bandwidth, build minutes and database storage",
      "Alerts can also post to a Slack channel or a webhook",
    ],
  },
  {
    date: "Aug 13, 2026",
    dateTime: "2026-08-13",
    version: "v2.8.2",
    title: "Faster cold starts for Node.js",
    description:
      "Node.js services now start from a snapshot of the warmed-up process. The median cold start dropped from 1.4 seconds to 310 milliseconds.",
    items: [
      "Works with Node.js 20 and 22, with no code changes",
      <>
        Turn it off with <Code>runtime.snapshot = false</Code> in <Code>lumen.toml</Code>
      </>,
      "Fixed health checks timing out on services that only listen on IPv6",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <section className="container-page pt-section-sm">
        <div className="grid gap-10 border-b pb-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-20">
          <div className="grid gap-6">
            <h1 className="text-display text-foreground">Changelog</h1>
            <p className="max-w-prose text-lead text-copy">
              New features, improvements and fixes in Lumen, newest first. We ship most weeks and write up everything
              you would notice.
            </p>
          </div>

          {/* Flush with the right edge on wide screens, under the lead on phones. */}
          <div className="grid w-full gap-3 lg:max-w-112 lg:justify-self-end lg:pb-2">
            <NewsletterForm label="Email address for release notes" buttonLabel="Subscribe" />
            <p className="pl-5 text-caption text-muted-foreground">
              One email a month with the highlights. Unsubscribe in one click.
            </p>
          </div>
        </div>
      </section>

      <ChangelogTimeline entries={releases} contained={false} className="container-page pt-16 lg:pt-24" />

      {/* Lines up with the entries: past the date column and the rail. */}
      <div className="container-page pt-16">
        <div className="@container">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pl-10 @narrow:ml-48">
            <Button variant="outline" nativeButton={false} render={<Link href="/live/changelog?page=2" />}>
              Older releases
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <p className="text-caption text-muted-foreground">Showing the 5 newest of 94 releases.</p>
          </div>
        </div>
      </div>

      <CtaBand
        title="Try what shipped this week."
        description="Every release on this page is live on every plan. Start a 14-day Pro trial and get a preview URL for your first branch in about a minute."
      />
    </>
  )
}
