"use client"

import * as React from "react"
import {
  CalendarIcon,
  ChartColumnIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  HomeIcon,
  InboxIcon,
  KanbanIcon,
  ListTodoIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ZapIcon,
} from "lucide-react"

import { MomentStatusBadge } from "@/components/blocks/hero/product-moment"
import { PriorityBadge, type TaskPriority } from "@/components/blocks/product-tour/screens"
import { personTone } from "@/components/blocks/members-list/people"
import { BrandMark } from "@/components/blocks/wordmark"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface AppMockupProps {
  /** Address shown in the browser bar. */
  url?: string
  /**
   * Let people click and type in the mockup. Off by default: the screen is
   * inert and announced as one image with `label`.
   */
  interactive?: boolean
  /** Accessible description of the screen when it is not interactive. */
  label?: string
  /** Set to false to drop the brand-subtle stage around the browser frame. */
  stage?: boolean
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const nav = [
  { label: "Home", icon: HomeIcon },
  { label: "My tasks", icon: ListTodoIcon },
  { label: "Inbox", icon: InboxIcon, count: 3 },
  { label: "Projects", icon: KanbanIcon, active: true },
  { label: "Docs", icon: FileTextIcon },
  { label: "Reports", icon: ChartColumnIcon },
  { label: "Automations", icon: ZapIcon },
  { label: "Settings", icon: SettingsIcon },
]

type TaskStatus = "todo" | "in-progress" | "done"
type GroupBy = "status" | "priority" | "assignee"

interface MockTask {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  due: string
}

const tasks: MockTask[] = [
  { id: "copy", title: "Write homepage copy", status: "in-progress", priority: "high", assignee: "Priya Raman", due: "Oct 24" },
  { id: "design", title: "Visual design for key pages", status: "in-progress", priority: "urgent", assignee: "Sofia Alvarez", due: "Oct 22" },
  { id: "pricing", title: "Pricing page copy", status: "todo", priority: "medium", assignee: "Priya Raman", due: "Oct 28" },
  { id: "redirects", title: "Redirect old blog links", status: "todo", priority: "low", assignee: "Jordan Lee", due: "Oct 30" },
  { id: "build", title: "Build page templates", status: "todo", priority: "high", assignee: "Jordan Lee", due: "Nov 4" },
  { id: "sitemap", title: "Sitemap", status: "done", priority: "high", assignee: "Maya Patel", due: "Oct 9" },
  { id: "interviews", title: "Customer interviews", status: "done", priority: "low", assignee: "Sam Okafor", due: "Oct 7" },
]

/**
 * The list shows the open tasks and the two finished most recently; the
 * footer counts the whole project, which has 52 tasks with 38 done (the same
 * numbers as the projects page, the board and the status visuals elsewhere).
 */
const projectTaskCount = 52
const earlierDoneCount = 38 - tasks.filter((task) => task.status === "done").length

const groupings: { value: GroupBy; label: string }[] = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
]

const statusOrder: { value: TaskStatus; label: string }[] = [
  { value: "in-progress", label: "In progress" },
  { value: "todo", label: "To do" },
  { value: "done", label: "Recently done" },
]

const priorityOrder: { value: TaskPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex h-11 items-center gap-3 border-b bg-subtle px-4">
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </span>
      <span className="mx-auto flex h-7 max-w-full min-w-0 items-center gap-1.5 rounded-full border bg-background px-3 font-mono text-caption text-muted-foreground">
        <LockIcon aria-hidden="true" className="size-3 shrink-0" />
        <span className="truncate">{url}</span>
      </span>
      <span aria-hidden="true" className="w-11 shrink-0" />
    </div>
  )
}

function MockSidebar() {
  return (
    <aside className="hidden flex-col border-r bg-sidebar p-3 @min-[46rem]/mock:flex">
      <div className="flex items-center gap-2.5 rounded-sm px-2 py-2">
        <BrandMark />
        <span className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate text-label text-sidebar-foreground">Acme Inc.</span>
          <span className="truncate text-caption text-muted-foreground">Pro plan</span>
        </span>
        <ChevronsUpDownIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <nav aria-label="Workspace" className="mt-4 grid gap-0.5">
        {nav.map(({ label, icon: Icon, active, count }) => (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex h-9 items-center gap-2.5 rounded-sm bg-sidebar-accent px-2.5 text-left text-label text-sidebar-accent-foreground outline-none focus-visible:focus-ring [&_svg]:size-4"
                : "flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-left text-label text-muted-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:focus-ring [&_svg]:size-4"
            }
          >
            <Icon aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {count ? <span className="text-caption font-semibold text-foreground tabular">{count}</span> : null}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2.5 border-t border-sidebar-border px-2 pt-3">
        <Avatar size="sm">
          <AvatarFallback tone={personTone("Maya Patel")}>MP</AvatarFallback>
        </Avatar>
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-label text-sidebar-foreground">Maya Patel</span>
          <span className="truncate text-caption text-muted-foreground">Head of Product</span>
        </span>
      </div>
    </aside>
  )
}

function groupTasks(list: MockTask[], by: GroupBy) {
  if (by === "status") {
    return statusOrder.map((s) => ({ key: s.value, label: s.label, items: list.filter((t) => t.status === s.value) }))
  }
  if (by === "priority") {
    return priorityOrder.map((p) => ({ key: p.value, label: p.label, items: list.filter((t) => t.priority === p.value) }))
  }
  const people = Array.from(new Set(list.map((t) => t.assignee)))
  return people.map((person) => ({ key: person, label: person, items: list.filter((t) => t.assignee === person) }))
}

function ProjectTasks({ idPrefix }: { idPrefix: string }) {
  const id = (name: string) => `${idPrefix}-${name}`
  const [groupBy, setGroupBy] = React.useState<GroupBy>("status")
  const [query, setQuery] = React.useState("")
  // Ticking a box moves the task to Done; unticking sends a finished task back to To do.
  const [done, setDone] = React.useState<Record<string, boolean>>({})

  const current = tasks.map((task) => {
    const override = done[task.id]
    if (override === undefined) return task
    return { ...task, status: override ? "done" : task.status === "done" ? "todo" : task.status } as MockTask
  })
  const visible = current.filter((task) => task.title.toLowerCase().includes(query.trim().toLowerCase()))
  const groups = groupTasks(visible, groupBy).filter((group) => group.items.length > 0)
  const finished = earlierDoneCount + current.filter((task) => task.status === "done").length

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-5 pt-5 @min-[34rem]/mock:px-8 @min-[34rem]/mock:pt-6">
        <div className="grid gap-1">
          <p className="text-h4 text-foreground">Website relaunch</p>
          <p className="text-caption text-muted-foreground">Led by Priya Raman · Launches Nov 14</p>
        </div>
        <MomentStatusBadge status="on-track" />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 py-4 @min-[34rem]/mock:px-8">
        <div className="relative min-w-40 flex-1">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={id("search")}
            aria-label="Search tasks"
            placeholder="Search tasks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          items={groupings}
          value={groupBy}
          onValueChange={(value) => {
            if (value === "status" || value === "priority" || value === "assignee") setGroupBy(value)
          }}
        >
          <SelectTrigger id={id("group")} aria-label="Group tasks by" className="hidden w-40 @min-[34rem]/mock:flex">
            <span className="text-muted-foreground">Group:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {groupings.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Add task
        </Button>
      </div>

      <div className="grid flex-1 content-start border-t">
        {groups.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground @min-[34rem]/mock:px-8">
            No tasks match “{query.trim()}”.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <p className="flex items-center gap-2 border-b bg-subtle px-5 py-2 text-caption font-semibold text-muted-foreground @min-[34rem]/mock:px-8">
                <span className="text-foreground">{group.label}</span>
                <span className="tabular">{group.items.length}</span>
              </p>
              <ul className="divide-y border-b">
                {group.items.map((task) => {
                  const isDone = task.status === "done"
                  return (
                    <li
                      key={task.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-2.5 @min-[34rem]/mock:grid-cols-[auto_minmax(0,1fr)_4.5rem_4.25rem_auto] @min-[34rem]/mock:px-8"
                    >
                      <Checkbox
                        id={id(`task-${task.id}`)}
                        checked={isDone}
                        onCheckedChange={(checked) => setDone((prev) => ({ ...prev, [task.id]: checked === true }))}
                      />
                      <label
                        htmlFor={id(`task-${task.id}`)}
                        className={cn(
                          "truncate text-sm",
                          isDone ? "text-muted-foreground line-through decoration-foreground/30" : "font-medium text-foreground"
                        )}
                      >
                        {task.title}
                      </label>
                      <span className="hidden @min-[34rem]/mock:block">
                        <PriorityBadge priority={task.priority} />
                      </span>
                      <span className="hidden items-center gap-1.5 text-caption whitespace-nowrap text-muted-foreground tabular @min-[34rem]/mock:flex">
                        <CalendarIcon aria-hidden="true" className="size-3.5 shrink-0" />
                        {task.due}
                      </span>
                      <Avatar size="sm">
                        <AvatarFallback tone={personTone(task.assignee)}>{initialsOf(task.assignee)}</AvatarFallback>
                      </Avatar>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 bg-subtle px-5 py-3.5 @min-[34rem]/mock:px-8">
        <p className="text-caption text-muted-foreground tabular">
          {finished} of {projectTaskCount} tasks done
        </p>
        <span aria-hidden="true" className="h-1 w-32 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full bg-foreground transition-[width] duration-(--duration-slow) ease-out"
            style={{ width: `${(finished / projectTaskCount) * 100}%` }}
          />
        </span>
      </div>
    </div>
  )
}

/**
 * A product screen inside a browser frame, built from real components: the
 * workspace sidebar and a project's task list, grouped by status, on a
 * brand-subtle stage. When interactive, the search filters, the menu
 * regroups the list and the checkboxes complete tasks.
 */
export function AppMockup({
  url = "app.acme.com/acme/projects/website-relaunch",
  interactive = false,
  label = "The Acme workspace: the Website relaunch project as a task list grouped by status, with owners, priorities and due dates.",
  stage = true,
  contained = true,
  className,
}: AppMockupProps) {
  const idPrefix = React.useId()

  const frame = (
    <div
      className="@container/mock overflow-hidden rounded-(--card-radius) border bg-background text-left"
      inert={!interactive}
    >
      <BrowserBar url={url} />
      <div className="grid min-h-96 @min-[46rem]/mock:grid-cols-[14rem_minmax(0,1fr)]">
        <MockSidebar />
        <ProjectTasks idPrefix={idPrefix} />
      </div>
    </div>
  )

  return (
    <section
      data-slot="app-mockup"
      className={cn("@container/app-mockup", contained && "container-page py-section-sm", className)}
    >
      <div
        role={interactive ? undefined : "img"}
        aria-label={interactive ? undefined : label}
        className={
          stage
            ? "rounded-(--panel-radius) bg-brand-subtle p-3 @min-[36rem]/app-mockup:p-6 @narrow/app-mockup:p-12"
            : undefined
        }
      >
        {frame}
      </div>
    </section>
  )
}
