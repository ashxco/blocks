import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { defaultProjects, formatDue } from "@/components/blocks/data-table/data"
import { StatusBadge } from "@/components/blocks/data-table/status-badge"
import { personTone } from "@/components/blocks/members-list/people"
import { cn } from "@/lib/utils"

/** The latest status update each lead posted, by project id. Dates come early and never break, so the two-line clamp on a phone never cuts them. */
const updates: Record<string, string> = {
  "website-relaunch": "Launch email goes out on Nov\u00a012. Sitemap and customer interviews are done.",
  "mobile-app": "Push notifications slip a week while we wait for the app store review.",
  "q4-planning": "Leadership review on Oct\u00a014. Budget drafts are in.",
  "customer-portal": "Proposing Nov\u00a06 for the beta. Sign-in needs a security review.",
  "brand-refresh": "Type tests start Monday. Logo and colors are approved.",
  "billing-migration": "6 tasks moved to next week. Invoice export is behind.",
}

/** The six active projects Maya follows, most recently updated first. Statuses and numbers match the projects page. */
const followed = defaultProjects.filter((project) => project.id in updates)

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

/** Columns step in as the card gets room, like the projects table: due date, then progress, then lead. */
const columnFrom = {
  due: "hidden @min-[34rem]/projects:table-cell",
  progress: "hidden @min-[44rem]/projects:table-cell",
  lead: "hidden @min-[56rem]/projects:table-cell",
}

const head = "h-(--table-row-height-sm) px-3 text-caption font-semibold text-muted-foreground"
/** Until the due date column steps in, status is the last column and keeps the card's edge padding. */
const statusEdge = "@max-[34rem]/projects:pr-(--card-padding)"

/**
 * The projects Maya follows, with the lead's latest update under each name,
 * the status, progress, lead and due date. On a phone the row is the project
 * and its status, with the due date under the status.
 */
export function ProjectUpdates({ className }: { className?: string }) {
  return (
    <Card role="region" aria-labelledby="project-updates-title" className={cn("gap-0 p-0", className)}>
      <div className="flex items-start justify-between gap-4 border-b border-border p-(--card-padding)">
        <div className="grid min-w-0 gap-1">
          <h2 id="project-updates-title" className="text-title text-foreground">
            Projects you follow
          </h2>
          <p className="text-caption text-muted-foreground">The latest update from each project lead.</p>
        </div>
        {/* The negative margin cancels the ghost padding, so the label lines up with the column below. */}
        <Button
          variant="ghost"
          size="sm"
          className="-mr-(--button-padding-x-sm) shrink-0"
          nativeButton={false}
          render={<Link href="/live/app/projects" />}
        >
          All projects
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      <div className="@container/projects">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(head, "pl-(--card-padding)")}>Project</TableHead>
              <TableHead className={cn(head, statusEdge)}>Status</TableHead>
              <TableHead className={cn(head, columnFrom.progress)}>Progress</TableHead>
              <TableHead className={cn(head, columnFrom.lead)}>Lead</TableHead>
              <TableHead className={cn(head, "pr-(--card-padding)", columnFrom.due)}>Due date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followed.map((project) => {
              const progress = Math.round((project.done / project.total) * 100)
              return (
                <TableRow key={project.id} className="hover:bg-subtle">
                  <TableCell className="py-3.5 pr-3 pl-(--card-padding) whitespace-normal">
                    <div className="grid min-w-0 gap-1">
                      <Link
                        href="/live/app/projects"
                        className="w-fit rounded-xs text-label text-foreground outline-none hover:underline hover:underline-offset-4 focus-visible:focus-ring"
                      >
                        {project.name}
                      </Link>
                      <p className="line-clamp-2 max-w-prose text-caption text-copy @min-[44rem]/projects:line-clamp-1">
                        {updates[project.id]}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className={cn("px-3 py-3.5 align-top @min-[34rem]/projects:align-middle", statusEdge)}>
                    {/* Flex, not grid: in a grid the overflow-hidden badge drops its min-content width, so the table sizes the column too narrow. */}
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={project.status} />
                      <span className="text-caption whitespace-nowrap text-muted-foreground @min-[34rem]/projects:hidden">
                        Due {formatDue(project.due)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("px-3", columnFrom.progress)}>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={progress}
                        aria-label={`${project.name}: ${project.done} of ${project.total} tasks done`}
                        className="w-20 gap-0"
                      />
                      <span className="text-caption text-muted-foreground tabular">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("px-3", columnFrom.lead)}>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback tone={personTone(project.lead)}>{initials(project.lead)}</AvatarFallback>
                      </Avatar>
                      <span className="text-copy whitespace-nowrap">{project.lead}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("pr-(--card-padding) pl-3 whitespace-nowrap text-copy tabular", columnFrom.due)}>
                    <time dateTime={project.due}>{formatDue(project.due)}</time>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
