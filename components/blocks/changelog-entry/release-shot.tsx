import * as React from "react"
import { BellIcon, FilterIcon, MessageSquareIcon, ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ReleaseShotRow {
  /** A lucide icon element, e.g. <BellIcon />. */
  icon: React.ReactNode
  /** The step's role in the rule, such as "When", "If" or "Then". */
  label: string
  /** What the step does. */
  value: string
  /** Short readout on the right, e.g. the app it posts to. */
  meta?: string
}

export interface ReleaseShotProps {
  /** Name of the automation. */
  title?: string
  /** Project and owner line under the name. */
  detail?: string
  rows?: ReleaseShotRow[]
  /** Line at the foot of the card. Pass an empty string to hide it. */
  footer?: string
  className?: string
}

const defaultRows: ReleaseShotRow[] = [
  { icon: <ZapIcon />, label: "When", value: "A task moves to Done" },
  { icon: <FilterIcon />, label: "If", value: "Priority is High or Urgent" },
  { icon: <BellIcon />, label: "Then", value: "Notify the task owner" },
  { icon: <MessageSquareIcon />, label: "And", value: "Post in #website-relaunch", meta: "Slack" },
]

/**
 * The default screenshot for a changelog entry: an automation rule built
 * from real components (its name, trigger, condition and actions, and how
 * often it ran). It sits centred in the tinted frame that ChangelogEntry
 * draws. Decorative only.
 */
export function ReleaseShot({
  title = "Tell owners when work is done",
  detail = "Website relaunch · Created by Maya Patel",
  rows = defaultRows,
  footer = "Ran 12 times",
  className,
}: ReleaseShotProps) {
  return (
    <div aria-hidden="true" className={cn("grid place-items-center p-5 @lg:p-10", className)}>
      <div className="@container/shot w-full max-w-md overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground">
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="grid min-w-0 gap-1">
            <p className="text-title text-foreground">{title}</p>
            <p className="truncate text-caption text-muted-foreground">{detail}</p>
          </div>
          <Badge variant="success">
            <span className="size-1.5 rounded-full bg-current" />
            On
          </Badge>
        </div>

        <ol className="grid gap-2 border-t bg-subtle p-3">
          {rows.map((row) => (
            <li
              key={`${row.label}-${row.value}`}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 rounded-md border bg-card px-3 py-2.5 @min-[24rem]/shot:grid-cols-[1.75rem_2.75rem_minmax(0,1fr)_auto]"
            >
              <span className="grid size-7 place-items-center rounded-sm bg-muted text-foreground [&_svg]:size-3.5">
                {row.icon}
              </span>
              <span className="hidden text-caption font-semibold text-muted-foreground @min-[24rem]/shot:block">
                {row.label}
              </span>
              <span className="min-w-0 text-sm font-medium text-foreground @min-[24rem]/shot:truncate">
                <span className="text-muted-foreground @min-[24rem]/shot:hidden">{row.label} </span>
                {row.value}
              </span>
              {row.meta ? (
                <span className="hidden text-caption text-muted-foreground @min-[24rem]/shot:block">{row.meta}</span>
              ) : null}
            </li>
          ))}
        </ol>

        {footer ? (
          <p className="border-t px-5 py-3 text-caption text-muted-foreground tabular">{footer}</p>
        ) : null}
      </div>
    </div>
  )
}
