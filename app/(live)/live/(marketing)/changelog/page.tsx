import type { Metadata } from "next"

import {
  ChangelogCode as Code,
  ChangelogTimeline,
  ReleaseShot,
  type ChangelogEntryProps,
} from "@/components/blocks/changelog-entry"
import { CtaBand } from "@/components/blocks/cta-band"
import { NewsletterForm } from "@/components/blocks/newsletter-form"

import { DashboardShot, TimelineShot } from "./_components/release-media"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "New features and improvements in Acme, newest first: Automations 2.0, timeline view, guest access, shared dashboards and recurring tasks.",
}

const releases: ChangelogEntryProps[] = [
  {
    date: "Oct 1, 2026",
    dateTime: "2026-10-01",
    title: "Automations 2.0",
    description:
      "Rules can now run several steps, check a condition before they act and post to the apps your team uses. Start from one of 20 recipes, or build your own in the new rule editor.",
    media: <ReleaseShot />,
    mediaTint: "violet",
    items: [
      "Add up to ten steps to a rule, with a condition between any two",
      "A run history shows every task a rule touched and what it changed",
      <>
        Trigger rules from your own tools with the new <Code>automation.run</Code> API event
      </>,
      "Runs still count against your plan: 1,000 a month on Free, 10,000 on Pro and 50,000 on Business",
    ],
  },
  {
    date: "Sep 17, 2026",
    dateTime: "2026-09-17",
    title: "Timeline view",
    description:
      "See a project as bars across the calendar. Drag a bar to change its dates, link tasks that depend on each other and spot clashes before they happen.",
    media: <TimelineShot />,
    mediaTint: "sand",
    items: [
      "Zoom from days to quarters",
      "Linked tasks move together when you reschedule one",
      "Milestones show as diamonds, so launch dates stand out",
    ],
  },
  {
    date: "Sep 3, 2026",
    dateTime: "2026-09-03",
    title: "Guest access",
    description:
      "Invite clients, contractors and agencies to the projects they work on. Guests see only what you share with them, and they never take a member seat.",
    items: [
      "Guests can comment on tasks and complete the ones assigned to them",
      "Owners and Admins see every guest on the Members page",
      "Pro includes 10 guests, and Business and Enterprise include more",
    ],
  },
  {
    date: "Aug 20, 2026",
    dateTime: "2026-08-20",
    title: "Shared dashboards",
    description:
      "Share a report dashboard with your whole workspace, or with one team. Dashboards update as tasks move, so the numbers in the weekly review are always current.",
    media: <DashboardShot />,
    mediaTint: "mint",
    items: ["Pin a dashboard to the top of any project", "Send a weekly summary to a Slack channel or by email"],
  },
  {
    date: "Aug 6, 2026",
    dateTime: "2026-08-06",
    title: "Recurring tasks",
    description:
      "Set a task to repeat every day, week or month. The next one appears when you complete the current one, with the same owner, subtasks and project.",
    items: [
      "Repeat on weekdays only, or on the last Friday of each month",
      "Skip one date without breaking the schedule",
      <>
        Create recurring tasks from the API with the <Code>repeat</Code> field
      </>,
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
              New features and improvements in Acme, newest first. Something new ships every two weeks, and every change
              you would notice is written up here.
            </p>
          </div>

          {/* Flush right on wide screens, under the lead on phones. */}
          <div className="grid w-full gap-3 lg:max-w-112 lg:justify-self-end lg:pb-2">
            <NewsletterForm label="Email address for product updates" buttonLabel="Subscribe" />
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
          <p className="pl-10 text-caption text-muted-foreground @narrow:ml-48">Showing the 5 newest of 86 updates.</p>
        </div>
      </div>

      <CtaBand
        title="Try what shipped this month."
        description="Every update on this page is live now. Start a 14-day Pro trial and set up your first automation in a few minutes."
      />
    </>
  )
}
