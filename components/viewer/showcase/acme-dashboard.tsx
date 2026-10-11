"use client"

import * as React from "react"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChartColumnIcon,
  FileTextIcon,
  FolderKanbanIcon,
  ListTodoIcon,
  SearchIcon,
  ZapIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  chartMotion,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Inline } from "@/components/ui/inline"
import { Input } from "@/components/ui/input"
import { Stack } from "@/components/ui/stack"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AcmeMark } from "@/docs/sample/acme-wordmark"
import { addDays, formatMonthDay } from "@/docs/sample/dates"
import { initialsTone } from "@/docs/sample/people"
import { StatusBadge, type Status } from "@/docs/sample/status"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Data: Acme's Reports screen, from the facts in DESIGN.md                    */
/* -------------------------------------------------------------------------- */

const NAV = [
  { label: "Projects", icon: FolderKanbanIcon },
  { label: "Tasks", icon: ListTodoIcon },
  { label: "Docs", icon: FileTextIcon },
  { label: "Automations", icon: ZapIcon },
  { label: "Reports", icon: ChartColumnIcon, current: true },
]

const KPIS: {
  label: string
  value: string
  delta: string
  direction: "up" | "down"
}[] = [
  {
    label: "Active projects",
    value: "24",
    delta: "+3 this month",
    direction: "up",
  },
  {
    label: "Tasks completed",
    value: "1,284",
    delta: "+12% this month",
    direction: "up",
  },
  { label: "On-time delivery", value: "92%", delta: "+4 pts", direction: "up" },
  {
    label: "Average cycle time",
    value: "3.4 days",
    delta: "−0.6 days",
    direction: "down",
  },
]

/*
 * The 30 days to Oct 9, 2026: 1,284 tasks completed (the KPI), 12% more
 * than the 30 days before (1,143). Weekends are quiet. The last 14 days are
 * the same numbers as the Chart docs.
 */
const START = new Date(2026, 8, 10)
const COMPLETED = [
  46, 44, 25, 27, 47, 50, 48, 51, 46, 26, 24, 49, 52, 50, 53, 50, 27, 29, 45,
  49, 44, 52, 51, 31, 27, 44, 51, 49, 49, 48,
]
const PREVIOUS = [
  41, 40, 22, 24, 42, 45, 43, 45, 41, 23, 21, 44, 46, 44, 47, 44, 24, 26, 40,
  44, 39, 46, 45, 28, 24, 39, 45, 44, 44, 43,
]
const DAYS = COMPLETED.map((completed, i) => ({
  day: formatMonthDay(addDays(START, i)),
  completed,
  previous: PREVIOUS[i],
}))

const chartConfig = {
  completed: { label: "Last 30 days", color: "var(--chart-1)" },
  previous: { label: "Previous 30 days", color: "var(--chart-2)" },
} satisfies ChartConfig

const PROJECTS: {
  name: string
  owner: string
  status: Status
  done: number
  total: number
  due: string
}[] = [
  {
    name: "Website relaunch",
    owner: "Priya Raman",
    status: "On track",
    done: 84,
    total: 120,
    due: "Nov 14",
  },
  {
    name: "Mobile app 2.0",
    owner: "Jordan Lee",
    status: "At risk",
    done: 61,
    total: 140,
    due: "Dec 2",
  },
  {
    name: "Q4 planning",
    owner: "Hana Kim",
    status: "On track",
    done: 18,
    total: 32,
    due: "Oct 30",
  },
  {
    name: "Customer portal",
    owner: "Daniel Brooks",
    status: "Off track",
    done: 37,
    total: 96,
    due: "Nov 20",
  },
  {
    name: "Onboarding redesign",
    owner: "Sofia Alvarez",
    status: "Completed",
    done: 58,
    total: 58,
    due: "Sep 26",
  },
  {
    name: "Brand refresh",
    owner: "Sofia Alvarez",
    status: "On track",
    done: 22,
    total: 45,
    due: "Dec 11",
  },
  {
    name: "Billing migration",
    owner: "Lucas Moreau",
    status: "At risk",
    done: 40,
    total: 72,
    due: "Nov 6",
  },
  {
    name: "Help center",
    owner: "Sam Okafor",
    status: "Paused",
    done: 12,
    total: 40,
    due: "Jan 15",
  },
]

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

/* -------------------------------------------------------------------------- */
/* The screen                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Acme's Reports screen: a slim rail, a top row with the workspace, search
 * and the signed-in user, then the KPIs, the tasks chart, an automations
 * panel and the projects table. Built only from components/ui and tokens,
 * so it takes whatever theme and mode it sits in. It measures its own width
 * (container queries): below 48rem the frame stacks, the rail becomes a
 * horizontal row of buttons and the table scrolls sideways inside its card.
 */
export function AcmeDashboard({ className }: { className?: string }) {
  return (
    <div
      data-slot="acme-dashboard"
      className={cn("@container min-w-0", className)}
    >
      <div className="grid min-w-0 font-sans text-body text-copy @3xl:grid-cols-[12rem_minmax(0,1fr)]">
        <Rail />
        <div className="grid min-w-0 content-start gap-6 p-4 @2xl:p-6 @5xl:p-8">
          <TopRow />
          <h2 className="text-h2 text-foreground">Reports</h2>
          <div className="grid grid-cols-2 gap-4 @4xl:grid-cols-4">
            {KPIS.map((kpi) => (
              <Kpi key={kpi.label} {...kpi} />
            ))}
          </div>
          <div className="grid gap-4 @4xl:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
            <TasksChart />
            <AutomationsPanel />
          </div>
          <ProjectsTable />
        </div>
      </div>
    </div>
  )
}

function Rail() {
  return (
    <Stack
      gap={1}
      render={<nav aria-label="Acme" />}
      className={cn(
        "[scrollbar-width:none] flex-row overflow-x-auto border-b px-3 py-2",
        "@3xl:flex-col @3xl:border-r @3xl:border-b-0 @3xl:px-3 @3xl:py-4"
      )}
    >
      <div className="hidden items-center gap-2.5 px-2 pb-4 @3xl:flex">
        <AcmeMark className="size-6" />
        <span className="font-heading text-base font-extrabold tracking-tight text-foreground">
          Acme
        </span>
      </div>
      {NAV.map(({ label, icon: Icon, current }) => (
        <Button
          key={label}
          variant="ghost"
          size="sm"
          aria-current={current ? "page" : undefined}
          className={cn(
            "shrink-0 justify-start",
            current ? "bg-accent text-foreground" : "text-muted-foreground"
          )}
        >
          <Icon aria-hidden="true" />
          {label}
        </Button>
      ))}
    </Stack>
  )
}

function TopRow() {
  return (
    <Inline gap={3} wrap={false} justify="between">
      <Inline gap={2} wrap={false} className="shrink-0">
        <AcmeMark className="size-6 @3xl:hidden" />
        <span className="text-label font-bold text-foreground">Acme Inc.</span>
      </Inline>
      <div className="relative min-w-0 flex-1 @2xl:max-w-xs">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          size="sm"
          type="search"
          aria-label="Search Acme"
          placeholder="Search"
          className="pl-9"
        />
      </div>
      <Avatar size="sm" title="Maya Patel">
        <AvatarFallback tone={initialsTone("MP")}>MP</AvatarFallback>
      </Avatar>
    </Inline>
  )
}

function Kpi({ label, value, delta, direction }: (typeof KPIS)[number]) {
  const Arrow = direction === "up" ? ArrowUpRightIcon : ArrowDownRightIcon
  return (
    <Card size="sm" className="gap-1.5">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-h3 text-foreground tabular-nums">{value}</p>
      <p className="inline-flex items-start gap-1 text-caption font-semibold text-success tabular-nums">
        <Arrow aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        {delta}
      </p>
    </Card>
  )
}

function TasksChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks completed per day</CardTitle>
        <CardDescription>
          The last 30 days against the 30 days before
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
        >
          <AreaChart data={DAYS} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend
              verticalAlign="top"
              align="right"
              itemSorter={null}
              content={<ChartLegendContent className="justify-end" />}
            />
            <Area
              {...chartMotion}
              dataKey="previous"
              type="monotone"
              stroke="var(--color-previous)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="none"
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
            <Area
              {...chartMotion}
              dataKey="completed"
              type="monotone"
              stroke="var(--color-completed)"
              strokeWidth={2}
              fill="var(--color-completed)"
              fillOpacity={0.12}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function AutomationsPanel() {
  return (
    <Card variant="panel" className="justify-between">
      <CardHeader>
        <CardTitle>Automations</CardTitle>
        <CardDescription>7,240 of 10,000 runs used this month</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <span className="block h-1.5 overflow-hidden rounded-full bg-panel-raised">
          <span className="block h-full w-[72.4%] rounded-full bg-panel-brand" />
        </span>
        <div className="grid gap-1 rounded-(--control-radius) border border-panel-border bg-panel-raised p-4">
          <p className="text-caption text-panel-muted">Most used rule</p>
          <p className="text-label text-panel-foreground">
            When a task moves to Done, notify the owner
          </p>
          <p className="text-caption text-panel-muted tabular-nums">
            2,910 runs this month
          </p>
        </div>
      </CardContent>
      <div>
        {/* A panel takes the inverse button: brand is ink in Mono and would vanish on it. */}
        <Button variant="inverse">Create Automation</Button>
      </div>
    </Card>
  )
}

function ProjectsTable() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>8 projects, 3 at risk or off track</CardDescription>
      </CardHeader>
      <CardContent>
        <Table size="sm" className="min-w-[40rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROJECTS.map((project) => {
              const initials = initialsOf(project.owner)
              const percent = Math.round((project.done / project.total) * 100)
              return (
                <TableRow key={project.name}>
                  <TableCell className="font-semibold text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell>
                    <Inline gap={2} wrap={false}>
                      <Avatar size="sm">
                        <AvatarFallback tone={initialsTone(initials)}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="whitespace-nowrap">{project.owner}</span>
                    </Inline>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <Inline gap={2} wrap={false}>
                      <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${percent}%` }}
                        />
                      </span>
                      <span className="text-caption text-muted-foreground tabular-nums">
                        {project.done}/{project.total}
                      </span>
                    </Inline>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap tabular-nums">
                    {project.due}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
