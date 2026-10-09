import * as React from "react"
import { ActivityIcon, GitBranchIcon, GlobeIcon, KeyRoundIcon, RefreshCwIcon, UsersIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import {
  AvatarStack,
  LiveMetrics,
  MaskedSecrets,
  PreviewUrls,
  RegionMap,
  TrafficShift,
} from "@/components/blocks/feature-bento/visuals"
import { cn } from "@/lib/utils"

export {
  AvatarStack,
  LiveMetrics,
  MaskedSecrets,
  PreviewUrls,
  RegionMap,
  Sparkline,
  TrafficShift,
} from "@/components/blocks/feature-bento/visuals"

export interface BentoFeature {
  title: string
  description: string
  /** A lucide icon element, e.g. <GitBranchIcon />. */
  icon?: React.ReactNode
  /** "dark" is a panel tile for emphasis (one per grid). "tint" is a brand-subtle tile. */
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
    title: "Push to deploy",
    description: "Every commit builds and ships. Every branch gets its own preview URL to share with the team.",
    icon: <GitBranchIcon />,
    wide: true,
    visual: <PreviewUrls />,
  },
  {
    title: "Live metrics",
    description: "CPU, memory and latency, streamed from the first request.",
    icon: <ActivityIcon />,
    tone: "dark",
    visual: <LiveMetrics />,
  },
  {
    title: "Zero-downtime deploys",
    description: "New versions start beside old ones and take traffic only when healthy.",
    icon: <RefreshCwIcon />,
    visual: <TrafficShift />,
  },
  {
    title: "Secrets vault",
    description: "Encrypted at rest and scoped to each environment.",
    icon: <KeyRoundIcon />,
    visual: <MaskedSecrets />,
  },
  {
    title: "Global edge",
    description: "TLS, caching and rate limits run at the edge in 38 regions, close to your users.",
    icon: <GlobeIcon />,
    tone: "tint",
    wide: true,
    visual: <RegionMap />,
  },
  {
    title: "Teams and roles",
    description: "Invite the whole team. Granular roles and a full audit log on every plan.",
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
    tile: "border-panel-border bg-panel text-panel-foreground",
    icon: "border-panel-border bg-panel-raised text-panel-foreground",
    title: "text-h4 text-panel-foreground",
    body: "mt-2 text-body text-panel-muted",
  },
  tint: {
    tile: "border-transparent bg-brand-subtle",
    icon: "border-transparent bg-background text-brand",
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
      Everything included.
      <br />
      Nothing bolted on.
    </>
  ),
  description = "Builds, previews, metrics, secrets, domains and roles come with every plan. No add-on store and no surprise line items on your bill.",
  features = defaultBentoFeatures,
  contained = true,
  className,
}: FeatureBentoProps) {
  return (
    <section
      data-slot="feature-bento"
      className={cn(contained && "container-page py-section", className)}
    >
      {title ? <SectionHeading title={title} description={description} className="mb-12 md:mb-16" /> : null}
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
