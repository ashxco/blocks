"use client"

import Link from "next/link"
import {
  ActivityIcon,
  GaugeIcon,
  PlusIcon,
  RocketIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/blocks/page-header"
import { StatCard } from "@/components/blocks/stat-card"

/**
 * Sample overview page shown when AppShell renders without children: the page
 * header and the metric row. It stays short, so a preview frame ends on a
 * whole section instead of cutting a card in half.
 */
export function AppShellDemo() {
  return (
    <div className="@container/demo grid gap-8">
      <PageHeader
        title="Overview"
        description="Production health for the 12 projects in Acme Inc."
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/live/app/projects" />}
            >
              <TerminalIcon data-icon="inline-start" />
              View logs
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/live/app/projects" />}
            >
              <PlusIcon data-icon="inline-start" />
              New project
            </Button>
          </>
        }
      />
      <div className="grid gap-4 @min-[40rem]/demo:grid-cols-2 @min-[68rem]/demo:grid-cols-4">
        <StatCard icon={ActivityIcon} />
        <StatCard
          label="Deployments"
          value="148"
          change={12}
          changeLabel="vs previous 7 days"
          icon={RocketIcon}
          trend={[9, 14, 11, 18, 16, 21, 19, 24, 22, 20, 27, 25]}
          tone="panel"
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
    </div>
  )
}
