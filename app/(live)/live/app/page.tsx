import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheckIcon, FolderKanbanIcon, ListChecksIcon, PlusIcon, TimerIcon, UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ActivityFeed } from "@/components/blocks/activity-feed"
import { ChartCard } from "@/components/blocks/chart-card"
import { isActiveProject } from "@/components/blocks/data-table/data"
import { PageHeader } from "@/components/blocks/page-header"
import { StatCard } from "@/components/blocks/stat-card"

import { OverviewPanel } from "./_components/overview-panel"
import { ProjectUpdates } from "./_components/project-updates"
import { projects } from "./projects/_data/projects"

export const metadata: Metadata = {
  title: "Overview",
  description:
    "The Acme Inc. overview: projects that need attention, this month’s delivery metrics, tasks completed each day and what your team changed.",
}

const activeCount = projects.filter(isActiveProject).length

export default function DashboardPage() {
  return (
    <div className="@container/dashboard grid gap-8 @min-[48rem]/dashboard:gap-10">
      <PageHeader
        title="Overview"
        description={`How work is moving across the ${activeCount} active projects in Acme Inc.`}
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/live/app/team" />}>
              <UserPlusIcon data-icon="inline-start" />
              Invite members
            </Button>
            <Button nativeButton={false} render={<Link href="/live/onboarding?step=template" />}>
              <PlusIcon data-icon="inline-start" />
              New project
            </Button>
          </>
        }
      />

      <OverviewPanel />

      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" className="sr-only">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 gap-3 @min-[20rem]/dashboard:grid-cols-2 @min-[30rem]/dashboard:gap-4 @min-[64rem]/dashboard:grid-cols-4">
          <StatCard
            label="Active projects"
            value={String(activeCount)}
            change={3}
            changeUnit=""
            changeLabel="this month"
            icon={FolderKanbanIcon}
            trend={[18, 19, 19, 20, 21, 21, 22, 21, 22, 23, 23, 24]}
          />
          <StatCard icon={ListChecksIcon} />
          <StatCard
            label="On-time delivery"
            value="92"
            unit="%"
            change={4}
            changeUnit="pts"
            changeLabel="vs last month"
            icon={CalendarCheckIcon}
            trend={[84, 85, 87, 86, 88, 87, 89, 88, 90, 89, 91, 92]}
          />
          <StatCard
            label="Average cycle time"
            value="3.4"
            unit="days"
            change={-0.6}
            changeUnit="days"
            changeLabel="vs last month"
            goodWhen="down"
            icon={TimerIcon}
            trend={[4.6, 4.4, 4.5, 4.2, 4.1, 4.2, 3.9, 4, 3.8, 3.7, 3.6, 3.4]}
          />
        </div>
      </section>

      <section aria-labelledby="progress-title" className="grid gap-4 @min-[60rem]/dashboard:grid-cols-3">
        <h2 id="progress-title" className="sr-only">
          Progress and activity
        </h2>
        <ChartCard className="@min-[60rem]/dashboard:col-span-2" />
        <ActivityFeed
          limit={3}
          description="Latest changes across your projects."
          action={
            // The negative margin cancels the ghost padding, so the label lines up with the times below.
            <Button
              variant="ghost"
              size="sm"
              className="-mr-(--button-padding-x-sm)"
              nativeButton={false}
              render={<Link href="/live/app/projects" />}
            >
              View all
            </Button>
          }
        />
      </section>

      <ProjectUpdates />
    </div>
  )
}
