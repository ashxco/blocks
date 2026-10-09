import * as React from "react"
import {
  ContainerIcon,
  CogIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  HexagonIcon,
  LayersIcon,
  TriangleIcon,
  WindIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export interface LogoCloudItem {
  name: string
  /** A monochrome mark shown before the name. */
  icon?: LucideIcon
}

export interface LogoCloudProps {
  /** Short line that says what the row shows. */
  title?: React.ReactNode
  items?: LogoCloudItem[]
  /** split puts the title beside the row on wide screens; center stacks and centres both. */
  layout?: "split" | "center"
  /** Use "panel" on dark panels. */
  tone?: "default" | "panel"
  /** Renders its own page container, hairlines and padding. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const logoCloudItems: LogoCloudItem[] = [
  { name: "Next.js", icon: TriangleIcon },
  { name: "Node.js", icon: HexagonIcon },
  { name: "Python", icon: FlaskConicalIcon },
  { name: "Go", icon: WindIcon },
  { name: "Rust", icon: CogIcon },
  { name: "Docker", icon: ContainerIcon },
  { name: "Postgres", icon: DatabaseIcon },
  { name: "Redis", icon: LayersIcon },
]

/**
 * A quiet, monochrome row of supported technologies or customer logos.
 */
export function LogoCloud({
  title = "Deploys the stack you already use",
  items = logoCloudItems,
  layout = "split",
  tone = "default",
  contained = true,
  className,
}: LogoCloudProps) {
  const panel = tone === "panel"
  const split = layout === "split"
  // Six or more marks fill the row edge to edge; fewer would leave wide gaps.
  const spread = items.length >= 6

  // Split: the label moves beside the marks from 52rem (a four-by-two grid),
  // and the marks join one row from 68rem, the narrowest width where all
  // eight fit on one line. Container queries, so docs and pages match.
  const row = (
    <div
      className={
        split
          ? "grid gap-7 @min-[52rem]:grid-cols-[10rem_minmax(0,1fr)] @min-[52rem]:items-center @min-[52rem]:gap-10"
          : "grid justify-items-center gap-7 text-center"
      }
    >
      <p
        className={cn(
          "text-label text-balance",
          split ? "max-w-60" : "max-w-prose",
          panel ? "text-panel-foreground" : "text-foreground"
        )}
      >
        {title}
      </p>
      <ul
        className={
          split
            ? cn(
                "grid grid-cols-2 gap-x-6 gap-y-5 @prose:grid-cols-4 @min-[68rem]:flex @min-[68rem]:items-center",
                // A full row spreads to the edge; a short list stays grouped beside the label.
                spread ? "@min-[68rem]:justify-between" : "@min-[68rem]:justify-start @min-[68rem]:gap-x-16"
              )
            : "flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        }
      >
        {items.map(({ name, icon: Icon }) => (
          <li
            key={name}
            className={cn("flex items-center gap-2.5", panel ? "text-panel-muted" : "text-muted-foreground")}
          >
            {Icon ? <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} /> : null}
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section
      data-slot="logo-cloud"
      aria-label={typeof title === "string" ? title : "Supported technologies"}
      className={cn("@container", contained && (panel ? "border-y border-panel-border" : "border-y"), className)}
    >
      {contained ? <div className="container-page py-10">{row}</div> : row}
    </section>
  )
}
