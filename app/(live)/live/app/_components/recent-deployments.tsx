import Link from "next/link"
import { ArrowRightIcon, GitBranchIcon, GitCommitHorizontalIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatusBadge, type ProjectStatus } from "@/components/blocks/data-table"
import { cn } from "@/lib/utils"

interface Deployment {
  id: string
  project: string
  message: string
  sha: string
  branch: string
  environment: "Production" | "Preview"
  status: Exclude<ProjectStatus, "paused">
  author: { name: string; initials: string; tint: "violet" | "mint" | "sand" | "sky" | "rose" }
  duration: string
  time: string
}

const deployments: Deployment[] = [
  {
    id: "dpl_c90d1f4",
    project: "dashboard",
    message: "Add usage page with a build minute breakdown",
    sha: "c90d1f4",
    branch: "feat/usage-page",
    environment: "Preview",
    status: "building",
    author: { name: "Priya Shah", initials: "PS", tint: "mint" },
    duration: "1m 12s",
    time: "Just now",
  },
  {
    id: "dpl_a41c9e2",
    project: "web",
    message: "Fix redirect loop on checkout",
    sha: "a41c9e2",
    branch: "main",
    environment: "Production",
    status: "ready",
    author: { name: "Maya Chen", initials: "MC", tint: "violet" },
    duration: "28s",
    time: "2 min ago",
  },
  {
    id: "dpl_e7b3a90",
    project: "api",
    message: "Add per-key rate limits to /v2/events",
    sha: "e7b3a90",
    branch: "feat/rate-limits",
    environment: "Preview",
    status: "failed",
    author: { name: "Leo Martins", initials: "LM", tint: "sand" },
    duration: "41s",
    time: "18 min ago",
  },
  {
    id: "dpl_5d2e8c1",
    project: "docs",
    message: "Document password protection for preview URLs",
    sha: "5d2e8c1",
    branch: "main",
    environment: "Production",
    status: "ready",
    author: { name: "Daniel Okafor", initials: "DO", tint: "sky" },
    duration: "19s",
    time: "1 hr ago",
  },
  {
    id: "dpl_91fa0b7",
    project: "checkout",
    message: "Retry card authorisation once on timeout",
    sha: "91fa0b7",
    branch: "main",
    environment: "Production",
    status: "ready",
    author: { name: "Maya Chen", initials: "MC", tint: "violet" },
    duration: "34s",
    time: "3 hr ago",
  },
  {
    id: "dpl_3c4d7e2",
    project: "mobile-api",
    message: "Rotate expired push tokens on sign-in",
    sha: "3c4d7e2",
    branch: "fix/push-tokens",
    environment: "Preview",
    status: "failed",
    author: { name: "Sam Rivera", initials: "SR", tint: "rose" },
    duration: "52s",
    time: "7 hr ago",
  },
]

/**
 * The latest builds across every project, production and preview. Rows
 * collapse to two lines in narrow slots and spread into columns when there
 * is room.
 */
export function RecentDeployments({ className }: { className?: string }) {
  return (
    <Card role="region" aria-labelledby="recent-deployments-title" className={cn("gap-0 p-0", className)}>
      <div className="flex items-start justify-between gap-4 border-b border-border p-(--card-padding)">
        <div className="grid min-w-0 gap-1">
          <h2 id="recent-deployments-title" className="text-title text-foreground">
            Recent deployments
          </h2>
          <p className="text-caption text-muted-foreground">
            Builds from every branch. Production keeps the last good build when one fails.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          nativeButton={false}
          render={<Link href="/live/app/projects" />}
        >
          All projects
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      <ol className="@container/deploys divide-y divide-border">
        {deployments.map((deployment) => (
          <li
            key={deployment.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-(--card-padding) py-4 @min-[44rem]/deploys:grid-cols-[minmax(0,1fr)_7rem_11rem_9rem] @min-[44rem]/deploys:gap-x-6"
          >
            <div className="grid min-w-0 gap-1">
              <p className="flex min-w-0 items-center gap-2">
                <Link
                  href="/live/app/projects"
                  className="truncate rounded-xs text-label text-foreground outline-none hover:underline hover:underline-offset-4 focus-visible:focus-ring"
                >
                  {deployment.project}
                </Link>
                <Badge variant={deployment.environment === "Production" ? "secondary" : "outline"}>
                  {deployment.environment}
                </Badge>
              </p>
              <p className="truncate text-caption text-copy">{deployment.message}</p>
            </div>

            <div className="justify-self-end @min-[44rem]/deploys:justify-self-start">
              <StatusBadge status={deployment.status} />
            </div>

            <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 @min-[44rem]/deploys:contents">
              <div className="flex min-w-0 items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground @min-[44rem]/deploys:grid">
                <span className="inline-flex items-center gap-1.5">
                  <GitCommitHorizontalIcon aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="sr-only">Commit </span>
                  {deployment.sha}
                </span>
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <GitBranchIcon aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="sr-only">Branch </span>
                  <span className="truncate">{deployment.branch}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5 @min-[44rem]/deploys:justify-self-end">
                <Avatar size="sm">
                  <AvatarFallback tone={deployment.author.tint}>{deployment.author.initials}</AvatarFallback>
                </Avatar>
                <p className="flex gap-x-2 text-caption @min-[44rem]/deploys:grid @min-[44rem]/deploys:text-right">
                  <span className="sr-only">{deployment.author.name}, </span>
                  <span className="text-foreground">{deployment.time}</span>
                  <span aria-hidden="true" className="text-muted-foreground @min-[44rem]/deploys:hidden">
                    ·
                  </span>
                  <span className="text-muted-foreground tabular">
                    <span className="sr-only">Build took </span>
                    {deployment.duration}
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
