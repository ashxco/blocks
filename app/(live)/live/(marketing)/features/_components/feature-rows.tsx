import * as React from "react"
import { CheckIcon } from "lucide-react"

import { ReleaseShot } from "@/components/blocks/changelog-entry"
import {
  BoardScreen,
  ReportScreen,
  ScreenFrame,
  TimelineScreen,
} from "@/components/blocks/product-tour/screens"
import { Kern } from "@/components/ui/kern"

import { DetailsCard, RunHistoryCard, StatusCard, TrendCard } from "./row-visuals"

interface Feature {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  points: string[]
  /** The product screen for the area, built from components. */
  screen: React.ReactNode
  /** A small product card laid over the empty band at the foot of the screen. */
  card: React.ReactNode
}

const features: Feature[] = [
  {
    id: "plan",
    title: "Plan in the view that fits.",
    description:
      "Every project has list, board, timeline and calendar views of the same tasks. Planners work from the timeline, the team works from the board, and nobody copies anything between them.",
    points: [
      "Timeline with milestones and linked tasks",
      "Templates for roadmaps, sprints and client work",
      "Docs for specs and notes beside the plan",
    ],
    screen: (
      <ScreenFrame view="Timeline" className="pb-14">
        <TimelineScreen />
      </ScreenFrame>
    ),
    card: <StatusCard />,
  },
  {
    id: "track",
    title: "Every task has an owner.",
    description:
      "Tasks carry an assignee, a due date, a priority and the subtasks it takes to finish. Comments keep the discussion on the task instead of in a chat thread.",
    points: [
      "Priorities from Urgent to Low",
      "Subtasks, comments and recurring tasks",
      "An inbox for everything that needs you",
    ],
    screen: (
      <ScreenFrame view="Board" className="pb-14">
        <BoardScreen />
      </ScreenFrame>
    ),
    card: <DetailsCard />,
  },
  {
    id: "automate",
    title: "Let rules do the busywork.",
    description:
      "Automations move tasks along, remind owners and post updates to Slack, so handoffs happen even when nobody remembers them.",
    points: [
      "Start from a recipe or build your own rule",
      "Conditions, several steps and a run history",
      "1,000 runs a month on Free, 10,000 on Pro",
    ],
    screen: (
      <ScreenFrame title="Automations" view="Rule" className="pb-14">
        <ReleaseShot className="p-4 @lg:p-6" />
      </ScreenFrame>
    ),
    card: <RunHistoryCard />,
  },
  {
    id: "report",
    title: "Know where every project stands.",
    description:
      "Reports build themselves from the work: workload by person, on-time delivery and cycle time. Share a dashboard and skip the status meeting.",
    points: [
      "Dashboards for workload and delivery",
      "Share with the workspace or one team",
      "A weekly summary to Slack or email",
    ],
    screen: (
      <ScreenFrame title="Delivery report" view="Report" className="pb-14">
        <ReportScreen />
      </ScreenFrame>
    ),
    card: <TrendCard />,
  },
]

function FeatureRow({ feature, reverse }: { feature: Feature; reverse: boolean }) {
  const headingId = `feature-${feature.id}`
  return (
    <section
      aria-labelledby={headingId}
      className="grid items-center gap-10 py-section-sm first:pt-0 lg:grid-cols-2 lg:gap-20"
    >
      <div className={reverse ? "min-w-0 lg:order-last" : "min-w-0"}>
        <h2 id={headingId} className="max-w-prose text-h2 text-foreground">
          <Kern>{feature.title}</Kern>
        </h2>
        <p className="mt-6 max-w-prose text-lead text-copy">{feature.description}</p>
        <ul className="mt-8 max-w-prose border-t">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-3 border-b py-3.5 text-label text-foreground">
              <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* The screen and its card illustrate the copy beside them, so they stay out of the way of assistive technology. */}
      <div aria-hidden="true" inert className="min-w-0 rounded-(--panel-radius) bg-subtle p-3 sm:p-8 xl:p-10">
        {feature.screen}
        <div className="relative -mt-12 flex justify-end pr-3 pl-8 sm:pr-6 sm:pl-16">{feature.card}</div>
      </div>
    </section>
  )
}

/**
 * Four product areas in alternating rows: copy with a short checklist on one
 * side, a product screen with a small card laid over it on the other. Rows
 * are separated by hairlines.
 */
export function FeatureRows() {
  return (
    <div className="container-page divide-y pt-section">
      {features.map((feature, i) => (
        <FeatureRow key={feature.id} feature={feature} reverse={i % 2 === 1} />
      ))}
    </div>
  )
}
