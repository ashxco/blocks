import * as React from "react"
import {
  AnchorIcon,
  CloverIcon,
  CompassIcon,
  HexagonIcon,
  LeafIcon,
  MountainIcon,
  StethoscopeIcon,
  TriangleIcon,
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

/** Acme customers. Fictional names, each with a simple monochrome mark. */
export const logoCloudItems: LogoCloudItem[] = [
  { name: "Northwind", icon: CompassIcon },
  { name: "Globex", icon: HexagonIcon },
  { name: "Initech", icon: TriangleIcon },
  { name: "Brightline", icon: MountainIcon },
  { name: "Fieldstone", icon: LeafIcon },
  { name: "Copperleaf", icon: CloverIcon },
  { name: "Harbor & Co.", icon: AnchorIcon },
  { name: "Meridian Health", icon: StethoscopeIcon },
]

/**
 * A quiet, monochrome row of customer logos or the tools a product connects to.
 */
export function LogoCloud({
  title = "Trusted by 12,000+ teams, including",
  items = logoCloudItems,
  layout = "split",
  tone = "default",
  contained = true,
  className,
}: LogoCloudProps) {
  const panel = tone === "panel"
  const split = layout === "split"
  // Six or more marks fill the whole row; fewer would leave wide gaps.
  const spread = items.length >= 6
  // Long names, such as eight customers, can't share one line beside the
  // label at page width, so they stay in the four-by-two grid.
  const oneRow = items.reduce((total, item) => total + item.name.length, 0) <= 60

  // Split: the label moves beside the marks from 52rem (a four-by-two grid),
  // and short names join one row from 68rem, the narrowest width where eight
  // of them fit on one line. Container queries, so docs and pages match.
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
                "grid grid-cols-2 gap-x-6 gap-y-5 @prose:grid-cols-4",
                oneRow && "@min-[68rem]:flex @min-[68rem]:items-center",
                // A full row spreads across; a short list stays grouped beside the label.
                oneRow && (spread ? "@min-[68rem]:justify-between" : "@min-[68rem]:justify-start @min-[68rem]:gap-x-16")
              )
            : oneRow
              ? "flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
              : // Long names wrap unevenly in a free row, so they sit in an even grid instead.
                "grid grid-cols-2 justify-items-center gap-x-10 gap-y-5 @prose:grid-cols-4"
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
      aria-label={typeof title === "string" ? title : "Customers"}
      className={cn("@container", contained && (panel ? "border-y border-panel-border" : "border-y"), className)}
    >
      {contained ? <div className="container-page py-10">{row}</div> : row}
    </section>
  )
}
