"use client"

import Link from "next/link"
import {
  CalendarCheckIcon,
  FolderKanbanIcon,
  ListChecksIcon,
  PlusIcon,
  TimerIcon,
  UserPlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/blocks/page-header"
import { StatCard } from "@/components/blocks/stat-card"

/**
 * Sample overview page shown when AppShell renders without children: the page
 * header and the metric row of the Dashboard template. It stays short, so a
 * preview frame ends on a whole section instead of cutting a card in half.
 */
export function AppShellDemo() {
  return (
    <div className="@container/demo grid gap-8">
      {/* h2: the demo only renders as a sample inside previews, where the host page has the h1. */}
      <PageHeader
        as="h2"
        title="Overview"
        description="How work is moving across the 24 active projects in Acme Inc."
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/live/app/team" />}
            >
              <UserPlusIcon data-icon="inline-start" />
              Invite members
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/live/onboarding?step=template" />}
            >
              <PlusIcon data-icon="inline-start" />
              New project
            </Button>
          </>
        }
      />
      <div className="grid gap-4 @min-[40rem]/demo:grid-cols-2 @min-[68rem]/demo:grid-cols-4">
        <StatCard
          label="Active projects"
          value="24"
          change={3}
          changeUnit=""
          changeLabel="this month"
          icon={FolderKanbanIcon}
          trend={[18, 19, 19, 20, 21, 21, 22, 21, 22, 23, 23, 24]}
        />
        <StatCard icon={ListChecksIcon} tone="panel" />
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
    </div>
  )
}
