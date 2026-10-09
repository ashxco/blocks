import type { Metadata } from "next"
import Link from "next/link"
import { ActivityIcon, GaugeIcon, PlusIcon, RocketIcon, TriangleAlertIcon, UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ActivityFeed } from "@/components/blocks/activity-feed"
import { ChartCard } from "@/components/blocks/chart-card"
import { PageHeader } from "@/components/blocks/page-header"
import { StatCard } from "@/components/blocks/stat-card"

import { ProductionPanel } from "./_components/production-panel"
import { RecentDeployments } from "./_components/recent-deployments"
import { projects } from "./projects/_data/projects"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "The Lumen overview for Acme Inc.: production health, edge traffic, recent deployments and what your team changed.",
}

export default function DashboardPage() {
  return (
    <div className="@container/dashboard grid gap-8 @min-[48rem]/dashboard:gap-10">
      <PageHeader
        title="Overview"
        description={`Production health, traffic and deploys for the ${projects.length} projects in Acme Inc.`}
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/live/app/team" />}>
              <UserPlusIcon data-icon="inline-start" />
              Invite members
            </Button>
            <Button nativeButton={false} render={<Link href="/live/onboarding" />}>
              <PlusIcon data-icon="inline-start" />
              New project
            </Button>
          </>
        }
      />

      <ProductionPanel />

      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" className="sr-only">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 gap-3 @min-[20rem]/dashboard:grid-cols-2 @min-[30rem]/dashboard:gap-4 @min-[64rem]/dashboard:grid-cols-4">
          <StatCard icon={ActivityIcon} />
          <StatCard
            label="Deployments"
            value="148"
            change={12}
            icon={RocketIcon}
            trend={[9, 14, 11, 18, 16, 21, 19, 24, 22, 20, 27, 25]}
          />
          <StatCard
            label="p95 latency"
            value="112"
            unit="ms"
            change={-8.4}
            goodWhen="down"
            icon={GaugeIcon}
            trend={[138, 131, 134, 128, 126, 129, 121, 118, 120, 116, 114, 112]}
          />
          <StatCard
            label="Error rate"
            value="0.04"
            unit="%"
            change={21.5}
            goodWhen="down"
            icon={TriangleAlertIcon}
            trend={[3, 3, 2, 4, 3, 3, 5, 4, 4, 5, 4, 5]}
          />
        </div>
      </section>

      <section aria-labelledby="traffic-title" className="grid gap-4 @min-[60rem]/dashboard:grid-cols-3">
        <h2 id="traffic-title" className="sr-only">
          Traffic and activity
        </h2>
        <ChartCard
          title="Edge requests"
          description="Requests served across all projects and regions."
          seriesLabel="Requests"
          className="@min-[60rem]/dashboard:col-span-2"
        />
        <ActivityFeed limit={4} description="Latest changes across your projects." />
      </section>

      <RecentDeployments />
    </div>
  )
}
