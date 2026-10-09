import * as React from "react"
import { DatabaseIcon, GitBranchIcon, GlobeIcon, KeyRoundIcon } from "lucide-react"

import { DeploymentStatusBadge } from "@/components/blocks/hero/product-moment"
import { cn } from "@/lib/utils"

export interface ReleaseShotRow {
  /** A lucide icon element, e.g. <DatabaseIcon />. */
  icon: React.ReactNode
  label: string
  /** Shown in mono, e.g. a branch name or URL. */
  value: string
  /** Short readout on the right, e.g. "ready in 1.8s". */
  meta?: string
}

export interface ReleaseShotProps {
  /** Git branch the preview was built from. */
  branch?: string
  /** Commit and pull request line under the branch. */
  detail?: string
  rows?: ReleaseShotRow[]
  className?: string
}

const defaultRows: ReleaseShotRow[] = [
  { icon: <GlobeIcon />, label: "URL", value: "feat-billing.acme.dev", meta: "HTTPS" },
  { icon: <DatabaseIcon />, label: "Database", value: "preview/feat-billing", meta: "ready in 1.8s" },
  { icon: <KeyRoundIcon />, label: "Variables", value: "14 inherited", meta: "2 preview only" },
]

/**
 * The default screenshot for a changelog entry: a preview environment card
 * built from real components (branch, status, URL, database branch and
 * variables). It sits centred in the tinted frame that ChangelogEntry draws.
 * Decorative only.
 */
export function ReleaseShot({
  branch = "feat/billing",
  detail = "7f02b1d · pull request #482",
  rows = defaultRows,
  className,
}: ReleaseShotProps) {
  return (
    <div aria-hidden="true" className={cn("grid place-items-center p-5 @lg:p-10", className)}>
      <div className="@container/shot w-full max-w-md overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground">
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="grid min-w-0 gap-1">
            <p className="flex min-w-0 items-center gap-2 text-title text-foreground">
              <GitBranchIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{branch}</span>
            </p>
            <p className="truncate font-mono text-caption text-muted-foreground">{detail}</p>
          </div>
          <DeploymentStatusBadge status="ready" />
        </div>

        <ul className="divide-y border-t">
          {rows.map((row) => (
            <li
              key={row.label}
              className="grid grid-cols-[1rem_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 px-5 py-3 text-sm @min-[24rem]/shot:grid-cols-[1rem_5.5rem_minmax(0,1fr)_auto]"
            >
              <span className="text-muted-foreground [&_svg]:size-4">{row.icon}</span>
              <span className="text-muted-foreground">{row.label}</span>
              <span className="col-start-2 truncate font-mono text-caption text-foreground @min-[24rem]/shot:col-start-auto">
                {row.value}
              </span>
              {row.meta ? (
                <span className="col-start-2 text-caption text-muted-foreground tabular @min-[24rem]/shot:col-start-auto @min-[24rem]/shot:text-right">
                  {row.meta}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
