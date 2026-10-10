import * as React from "react"
import { ChartColumnIcon, KanbanIcon, ListTodoIcon, PlugIcon, UsersIcon, ZapIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import {
  AvatarStack,
  BarList,
  BoardPreview,
  LinkChips,
  LiveMetrics,
  RuleCard,
} from "@/components/blocks/feature-bento/visuals"
import { cn } from "@/lib/utils"

export {
  AvatarStack,
  BarList,
  BoardPreview,
  LinkChips,
  LiveMetrics,
  RuleCard,
  ShareBars,
  Sparkline,
} from "@/components/blocks/feature-bento/visuals"
export type {
  BarListItem,
  BoardPreviewColumn,
  LinkChip,
  LiveMetric,
  ShareBar,
  StackPerson,
} from "@/components/blocks/feature-bento/visuals"

export interface BentoFeature {
  title: string
  description: string
  /** A lucide icon element, e.g. <KanbanIcon />. */
  icon?: React.ReactNode
  /** "dark" is a panel tile for emphasis (one per grid). "tint" is a flat tinted tile. */
  tone?: "default" | "dark" | "tint"
  /** Spans two columns from the two-column layout up. */
  wide?: boolean
  /** A small live visual pinned to the bottom of the tile. */
  visual?: React.ReactNode
}

export interface FeatureBentoProps {
  /** Section title. Pass null to render the grid without a heading. */
  title?: React.ReactNode
  description?: React.ReactNode
  features?: BentoFeature[]
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const defaultBentoFeatures: BentoFeature[] = [
  {
    title: "One plan, four views",
    description: "List, board, timeline and calendar views of the same work. Everyone picks the view that suits them.",
    icon: <KanbanIcon />,
    wide: true,
    visual: <BoardPreview />,
  },
  {
    title: "Reports that keep up",
    description: "Workload, on-time delivery and cycle time, updated as work moves.",
    icon: <ChartColumnIcon />,
    tone: "dark",
    visual: <LiveMetrics />,
  },
  {
    title: "Automations",
    description: "Rules handle the handoffs, reminders and status changes nobody wants to do by hand.",
    icon: <ZapIcon />,
    visual: <RuleCard />,
  },
  {
    title: "Tasks with owners",
    description: "Assignees, due dates, priorities, subtasks and comments on every task.",
    icon: <ListTodoIcon />,
    visual: <BarList />,
  },
  {
    title: "Works with your tools",
    description: "Connect Slack, Google Drive, GitHub, Figma, Zoom and HubSpot, so updates land where your team already works.",
    icon: <PlugIcon />,
    tone: "tint",
    wide: true,
    visual: <LinkChips />,
  },
  {
    title: "Members and guests",
    description: "Invite the whole team and bring clients in as guests. SSO and an audit log come with Business.",
    icon: <UsersIcon />,
    visual: <AvatarStack />,
  },
]

const tileTone = {
  default: {
    tile: "border-border bg-card",
    icon: "border-border bg-background text-foreground",
    title: "text-h4 text-foreground",
    body: "mt-2 text-body text-copy",
  },
  dark: {
    // The emphasis panel: it sits above the cards in both themes.
    tile: "border-panel-border bg-panel text-panel-foreground",
    icon: "border-panel-border bg-panel-raised text-panel-foreground",
    title: "text-h4 text-panel-foreground",
    body: "mt-2 text-body text-panel-muted",
  },
  tint: {
    // A flat decorative tint, not brand violet: the page keeps violet for its one highlighted word.
    tile: "border-transparent bg-tint-sky",
    icon: "border-transparent bg-background text-foreground",
    title: "text-h4 text-foreground",
    body: "mt-2 text-body text-copy",
  },
} as const

function BentoTile({ feature }: { feature: BentoFeature }) {
  const tone = tileTone[feature.tone ?? "default"]
  return (
    <article
      data-slot="bento-tile"
      data-tone={feature.tone ?? "default"}
      className={cn(
        "flex min-h-72 min-w-0 flex-col overflow-hidden rounded-(--card-radius) border p-6 @min-[64rem]/bento:p-7",
        tone.tile,
        feature.wide && "@min-[34rem]/bento:col-span-2"
      )}
    >
      {feature.icon ? (
        <span
          aria-hidden="true"
          className={cn("mb-6 grid size-10 place-items-center rounded-md border [&_svg]:size-5", tone.icon)}
        >
          {feature.icon}
        </span>
      ) : null}
      <h3 className={tone.title}>{feature.title}</h3>
      <p className={tone.body}>{feature.description}</p>
      {feature.visual ? <div className="mt-auto pt-8">{feature.visual}</div> : null}
    </article>
  )
}

/**
 * Mixed-size feature tiles on a four-column grid: wide tiles, one dark tile,
 * one tinted tile and small live visuals. Lays out from its own width.
 */
export function FeatureBento({
  title = (
    <>
      Everything in one place.
      <br />
      Nothing to stitch together.
    </>
  ),
  description = "Projects, tasks, docs, automations and reports share one workspace, so the plan, the work and the status never drift apart.",
  features = defaultBentoFeatures,
  contained = true,
  className,
}: FeatureBentoProps) {
  return (
    <section
      data-slot="feature-bento"
      className={cn("@container/bento-section", contained && "container-page py-section", className)}
    >
      {title ? (
        <SectionHeading title={title} description={description} className="mb-12 @3xl/bento-section:mb-16" />
      ) : null}
      <div className="@container/bento">
        <div className="grid grid-flow-row-dense gap-4 @min-[34rem]/bento:grid-cols-2 @min-[60rem]/bento:grid-cols-4">
          {features.map((f) => (
            <BentoTile key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  )
}
