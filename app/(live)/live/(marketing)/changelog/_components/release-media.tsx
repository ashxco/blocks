import { LinkIcon, UsersIcon } from "lucide-react"

import { ScreenFrame, TimelineScreen } from "@/components/blocks/product-tour/screens"
import { cn } from "@/lib/utils"

/**
 * Screenshot-style media for changelog entries. They sit inside the tinted
 * frame that ChangelogEntry draws, so each one pads itself away from the
 * frame. Decorative: the entry's title and summary carry the meaning.
 */

/** The Website relaunch project in the new timeline view, for the timeline release. */
export function TimelineShot({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" inert className={cn("p-3 sm:p-10", className)}>
      <ScreenFrame view="Timeline">
        <TimelineScreen />
      </ScreenFrame>
    </div>
  )
}

const figures = [
  { label: "On-time delivery", value: "92%", change: "+4 pts" },
  { label: "Cycle time", value: "3.4 days", change: "−0.6" },
]

/** Workload per person, as a share of the busiest. */
const workload = [
  { name: "Jordan Lee", share: 100 },
  { name: "Priya Raman", share: 78 },
  { name: "Maya Patel", share: 67 },
  { name: "Sofia Alvarez", share: 50 },
]

/** A shared dashboard card with who can see it, for the shared dashboards release. */
export function DashboardShot({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid place-items-center p-5 sm:p-10", className)}>
      <div className="@container/dash grid w-full max-w-md gap-5 rounded-(--card-radius) border bg-background p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-title text-foreground">Delivery report</p>
          <p className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <UsersIcon className="size-3.5" />
            Shared with Acme Inc.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {figures.map((figure) => (
            <div key={figure.label} className="grid gap-1 rounded-md border p-3">
              <dt className="text-caption text-muted-foreground">{figure.label}</dt>
              <dd className="text-h4 text-foreground tabular">{figure.value}</dd>
              <dd className="text-caption font-semibold text-success tabular">{figure.change}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-2.5 border-t pt-5">
          <p className="text-label text-foreground">Workload</p>
          <ul className="grid gap-2">
            {workload.map((person) => (
              <li key={person.name} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 text-caption">
                <span className="truncate text-copy">{person.name}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <span className="block h-full rounded-full bg-foreground" style={{ width: `${person.share}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="flex min-w-0 items-center gap-2 rounded-(--control-radius) border bg-subtle px-3 py-2 text-caption text-muted-foreground">
          <LinkIcon className="size-3.5 shrink-0 text-foreground" />
          <span className="truncate">app.acme.com/acme/dashboards/delivery-report</span>
        </p>
      </div>
    </div>
  )
}
