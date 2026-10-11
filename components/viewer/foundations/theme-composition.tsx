import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/* The Themes page's stage composition: a project page of real components on the theme's tokens. */

const projects = [
  { name: "Website relaunch", open: 42 },
  { name: "Mobile app 2.0", open: 31 },
  { name: "Brand refresh", open: 24 },
  { name: "Help center", open: 16 },
  { name: "Q4 planning", open: 9 },
]

/* Literal class names so Tailwind generates every series. */
const seriesFill = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
]
const people = [
  { initials: "MP", fill: "bg-tint-violet" },
  { initials: "SA", fill: "bg-tint-mint" },
  { initials: "JL", fill: "bg-tint-sand" },
]

const priorities = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const tasks: {
  title: string
  owner: string
  status: string
  tone: "success" | "info" | "warning"
}[] = [
  {
    title: "Write the homepage hero copy",
    owner: "Priya Raman",
    status: "Done",
    tone: "success",
  },
  {
    title: "Review the pricing page",
    owner: "Maya Patel",
    status: "In progress",
    tone: "info",
  },
  {
    title: "Choose the new icon set",
    owner: "Sofia Alvarez",
    status: "At risk",
    tone: "warning",
  },
]

/** The bar chart card: open tasks per project in the chart series. */
function ChartCard() {
  const max = Math.max(...projects.map((p) => p.open))
  return (
    <figure className="grid gap-4 rounded-(--card-radius) border bg-card p-(--card-padding) text-card-foreground">
      <figcaption className="flex items-start justify-between gap-3">
        <span className="grid gap-0.5">
          <span className="text-h4 text-foreground">Open tasks by project</span>
          <span className="text-caption text-muted-foreground">
            122 open across 5 projects
          </span>
        </span>
        <Badge variant="brand">3 new</Badge>
      </figcaption>
      <ul className="grid gap-2">
        {projects.map((p, i) => (
          <li
            key={p.name}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)_1.75rem] items-center gap-3"
          >
            <span className="truncate text-caption text-copy">{p.name}</span>
            <span
              aria-hidden
              className="block h-2.5 overflow-hidden rounded-xs bg-muted"
            >
              <span
                className={cn("block h-full rounded-xs", seriesFill[i])}
                style={{ width: `${(p.open / max) * 100}%` }}
              />
            </span>
            <span className="text-right font-mono text-xs text-foreground tabular">
              {p.open}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <span className="flex -space-x-1.5">
          {people.map((p) => (
            <span
              key={p.initials}
              aria-hidden
              className={cn(
                "grid size-(--avatar-size-sm) place-items-center rounded-full border-2 border-card text-xs font-semibold text-foreground",
                p.fill
              )}
            >
              {p.initials}
            </span>
          ))}
        </span>
        <Button type="button" variant="link">
          View All Tasks
        </Button>
      </div>
    </figure>
  )
}

/**
 * Real components on the theme's tokens, as a project page: tabs over a
 * card with a chart, an input and a select, a table, every button variant,
 * the badges and a dark panel. `label` names the copy ("Ember, dark") so
 * every control on the page has its own accessible name.
 */
export function Composition({ label }: { label: string }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <p className="text-h3 text-foreground">Website relaunch</p>
          <p className="text-caption text-muted-foreground">
            Marketing · 12 of 18 tasks done · Due Nov 14
          </p>
        </div>
        <Badge variant="success">On track</Badge>
      </div>

      <Tabs defaultValue="overview" className="gap-5">
        <TabsList aria-label={`Project views (${label})`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ChartCard />
        </TabsContent>
        <TabsContent value="board" className="text-caption">
          18 tasks in four columns: To do, In progress, In review and Done.
        </TabsContent>
        <TabsContent value="timeline" className="text-caption">
          Six milestones from Sep 1 to the launch on Nov 14.
        </TabsContent>
      </Tabs>

      <div className="grid gap-2 @md:grid-cols-[minmax(0,1fr)_8.5rem_auto]">
        <Input aria-label={`New task (${label})`} placeholder="Add a task" />
        <Select items={priorities} defaultValue="high">
          <SelectTrigger aria-label={`Priority (${label})`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button">Add Task</Button>
      </div>

      {/* On a phone the owner moves under the task and a long title wraps, so Status stays in view. */}
      <Table variant="card" size="sm" aria-label={`Tasks (${label})`}>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden @md:table-cell">Owner</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.title}>
              <TableCell className="py-2.5 font-semibold text-pretty whitespace-normal">
                {task.title}
                <span className="block text-caption font-normal text-muted-foreground @md:hidden">
                  {task.owner}
                </span>
              </TableCell>
              <TableCell className="hidden text-copy @md:table-cell">
                {task.owner}
              </TableCell>
              <TableCell>
                <Badge variant={task.tone}>{task.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button">Create Project</Button>
        <Button type="button" variant="brand">
          Start Free Trial
        </Button>
        <Button type="button" variant="secondary">
          Duplicate
        </Button>
        <Button type="button" variant="outline">
          Share
        </Button>
        <Button type="button" variant="ghost">
          Archive
        </Button>
        <Button type="button" variant="destructive">
          Delete
        </Button>
        <Button type="button" variant="link">
          View Report
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="success">On track</Badge>
        <Badge variant="warning">At risk</Badge>
        <Badge variant="destructive">Off track</Badge>
        <Badge variant="brand">3 new</Badge>
        <Badge variant="secondary">Paused</Badge>
        <Badge variant="outline">Guest</Badge>
        <Badge>Owner</Badge>
      </div>

      <div className="grid gap-4 rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-foreground">
        <p className="text-h4 text-panel-foreground">
          Ship the relaunch on time
        </p>
        <p className="text-body text-panel-muted">
          <span className="font-semibold text-panel-brand">92%</span> of tasks
          closed on schedule this month.
        </p>
        <ul className="grid gap-1.5 text-caption text-panel-muted">
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full bg-panel-success"
            />
            Homepage copy approved
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full bg-panel-warning"
            />
            Pricing review due Friday
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="inverse" size="sm">
            Invite Team
          </Button>
          <Button type="button" variant="outline-inverse" size="sm">
            View Report
          </Button>
        </div>
      </div>
    </>
  )
}
