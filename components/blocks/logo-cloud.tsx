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
  /** Render only the row, without the page container, hairlines and padding. */
  bare?: boolean
  className?: string
}

/** Joins classes without merging, so type roles and text colours both survive. */
function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
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
  bare = false,
  className,
}: LogoCloudProps) {
  const panel = tone === "panel"
  const split = layout === "split"

  const row = (
    <div
      className={
        split
          ? "grid gap-7 @page:grid-cols-[12rem_minmax(0,1fr)] @page:items-center @page:gap-12"
          : "grid justify-items-center gap-7 text-center"
      }
    >
      <p
        className={cx(
          split ? "max-w-60" : "max-w-prose",
          "text-label text-balance",
          panel ? "text-panel-foreground" : "text-foreground"
        )}
      >
        {title}
      </p>
      <ul
        className={
          split
            ? "grid grid-cols-2 gap-x-6 gap-y-5 @prose:grid-cols-4 @page:flex @page:items-center @page:justify-between"
            : "flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        }
      >
        {items.map(({ name, icon: Icon }) => (
          <li
            key={name}
            className={
              panel
                ? "flex items-center gap-2.5 text-panel-muted"
                : "flex items-center gap-2.5 text-muted-foreground"
            }
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
      className={cn("@container", !bare && (panel ? "border-y border-panel-border" : "border-y"), className)}
    >
      {bare ? row : <div className="container-page py-10">{row}</div>}
    </section>
  )
}
