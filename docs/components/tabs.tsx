"use client"

import {
  BellIcon,
  ClockAlertIcon,
  FileTextIcon,
  LayoutGridIcon,
  ListIcon,
  ListTodoIcon,
  PlugIcon,
  SettingsIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/docs/sample/people"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* Default and sm side by side, per variant, so the heights compare directly. */
const sizeRows = [
  { variant: "default", size: "default", caption: 'size="default"' },
  { variant: "default", size: "sm", caption: 'size="sm"' },
  { variant: "segmented", size: "default", caption: 'variant="segmented" size="default"' },
  { variant: "segmented", size: "sm", caption: 'variant="segmented" size="sm"' },
] as const

const statusVariant = { Overdue: "destructive", "In progress": "info", Done: "success" } as const

const tasks = [
  { title: "Fix crash when uploading photos", assignee: "Jordan Lee", priority: "Urgent", status: "Overdue", due: "Oct 7" },
  { title: "Ship the new onboarding screens", assignee: "Sofia Alvarez", priority: "High", status: "In progress", due: "Oct 12" },
  { title: "Write the release notes for 2.0", assignee: "Priya Raman", priority: "Medium", status: "Done", due: "Oct 8" },
] as const

const activity = [
  { initials: "JL", name: "Jordan Lee", text: "commented on Fix crash when uploading photos", time: "12m ago" },
  { initials: "SA", name: "Sofia Alvarez", text: "moved Ship the new onboarding screens to In progress", time: "1h ago" },
  { initials: "PR", name: "Priya Raman", text: "completed Write the release notes for 2.0", time: "Yesterday" },
]

export default function TabsDocs() {
  return (
    <Examples>
      <Example
        title="Underline"
        description="The default. An ink line, --border-width-strong thick, slides to the active tab along a full-width hairline."
        layout="stack"
        code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="tasks">Tasks</TabsTrigger>
    <TabsTrigger value="docs">Docs</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            Website relaunch is on track: 38 of 52 tasks are done, and launch day is Nov 14.
          </TabsContent>
          <TabsContent value="tasks">14 open tasks, 3 of them due this week.</TabsContent>
          <TabsContent value="docs">6 docs, including the launch plan and the homepage copy.</TabsContent>
          <TabsContent value="settings">Owner, members, default view and notifications.</TabsContent>
        </Tabs>
      </Example>

      <Example
        title="Segmented"
        description="A segmented track for switching views of the same data, such as a time range or a layout. The active tab turns ink."
        code={`<Tabs defaultValue="7d">
  <TabsList variant="segmented">
    <TabsTrigger value="24h">24 hours</TabsTrigger>
    <TabsTrigger value="7d">7 days</TabsTrigger>
    <TabsTrigger value="30d">30 days</TabsTrigger>
  </TabsList>
</Tabs>`}
      >
        <Tabs defaultValue="7d">
          <TabsList variant="segmented" aria-label="Time range">
            <TabsTrigger value="24h">24 hours</TabsTrigger>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="grid">
          <TabsList variant="segmented" size="sm" aria-label="Layout">
            <TabsTrigger value="grid" aria-label="Grid">
              <LayoutGridIcon />
            </TabsTrigger>
            <TabsTrigger value="list" aria-label="List">
              <ListIcon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Example>

      <Example
        title="Sizes"
        description="Default height is --tabs-height; sm drops to --control-height-sm. Use sm in toolbars and dense panels."
        layout="stack"
        code={`<TabsList size="sm">…</TabsList>
<TabsList variant="segmented" size="sm">…</TabsList>`}
      >
        <div className="grid w-full gap-6 @lg:grid-cols-2 @lg:gap-x-10">
          {sizeRows.map((row) => (
            <div key={row.caption} className="grid content-end justify-items-start gap-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList variant={row.variant} size={row.size}>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="done">Done</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="font-mono text-xs text-muted-foreground">{row.caption}</p>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="On an existing hairline"
        description="Use variant line when the tabs sit on a border that is already there, such as the bottom of a page header."
        layout="stack"
        code={`<header className="border-b">
  <h1 className="text-h3">Website relaunch</h1>
  <Tabs defaultValue="board">
    <TabsList variant="line">…</TabsList>
  </Tabs>
</header>`}
      >
        <header className="grid gap-5 border-b">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <h3 className="text-h3">Website relaunch</h3>
              <p className="text-sm text-muted-foreground">Marketing · led by Priya Raman · due Nov 14</p>
            </div>
            <Button size="sm" variant="outline">
              Share
            </Button>
          </div>
          <Tabs defaultValue="board" className="min-w-0">
            {/* The row scrolls rather than overflow the page, and on a phone the least used tab
                drops out so every tab left in the row shows whole. */}
            <div className="no-scrollbar -mx-6 scroll-px-6 overflow-x-auto px-6 sm:-mx-10 sm:scroll-px-10 sm:px-10">
              <TabsList variant="line" className="w-max">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="calendar" className="@max-md:hidden">
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </header>
      </Example>

      <Example
        title="With icons and counts"
        description="Icons sit before the label. Counts use a small badge after it. When the row can run wider than a phone, put the list in an overflow-x-auto wrapper so it scrolls."
        layout="stack"
        code={`<Tabs defaultValue="tasks">
  <div className="no-scrollbar overflow-x-auto">
    <TabsList className="min-w-full gap-6 data-horizontal:w-max">
      <TabsTrigger value="tasks">
        <ListTodoIcon />
        Tasks
      </TabsTrigger>
      <TabsTrigger value="overdue">
        <ClockAlertIcon />
        Overdue
        <Badge variant="destructive">2</Badge>
      </TabsTrigger>
      <TabsTrigger value="automations" disabled>…</TabsTrigger>
    </TabsList>
  </div>
</Tabs>`}
      >
        <Tabs defaultValue="tasks" className="min-w-0">
          {/* The row scrolls rather than overflow the page. On a phone the disabled tab drops
              out, so every tab left in the row, and its count, shows whole. */}
          <div className="no-scrollbar -mx-6 scroll-px-6 overflow-x-auto px-6 sm:-mx-10 sm:scroll-px-10 sm:px-10">
            <TabsList className="min-w-full gap-4 data-horizontal:w-max @md:gap-6">
              <TabsTrigger value="tasks">
                <ListTodoIcon />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="docs">
                <FileTextIcon />
                Docs
              </TabsTrigger>
              <TabsTrigger value="overdue">
                <ClockAlertIcon />
                Overdue
                <Badge variant="destructive">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="automations" disabled className="@max-md:hidden">
                <ZapIcon />
                Automations
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </Example>

      <Example
        title="Vertical"
        description="For settings pages with many sections. The indicator moves to the left edge."
        layout="stack"
        code={`<Tabs defaultValue="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="members">Members</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="members" orientation="vertical" className="min-h-56 max-sm:data-vertical:flex-col">
          <TabsList className="sm:w-48">
            <TabsTrigger value="general">
              <SettingsIcon />
              General
            </TabsTrigger>
            <TabsTrigger value="members">
              <UsersIcon />
              Members
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellIcon />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <PlugIcon />
              Integrations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="grid content-start gap-2">
            <h4 className="text-title">General</h4>
            <p className="text-sm">Workspace name, its URL at app.acme.com/acme and the default view for new projects.</p>
          </TabsContent>
          <TabsContent value="members" className="grid content-start gap-2">
            <h4 className="text-title">Members</h4>
            <p className="text-sm">
              18 members and 6 guests in Acme Inc. Invite people, change their role or remove them.
            </p>
          </TabsContent>
          <TabsContent value="notifications" className="grid content-start gap-2">
            <h4 className="text-title">Notifications</h4>
            <p className="text-sm">Choose what Acme emails you about, and when your weekly summary arrives.</p>
          </TabsContent>
          <TabsContent value="integrations" className="grid content-start gap-2">
            <h4 className="text-title">Integrations</h4>
            <p className="text-sm">Slack, Google Drive and GitHub are connected. Connect Figma, Zoom or HubSpot.</p>
          </TabsContent>
        </Tabs>
      </Example>

      <Example
        title="In a project page"
        description="Tabs switch between views of one project. Each panel keeps its own layout."
        layout="stack"
        code={`<section className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
  <div className="grid gap-1">
    <h3 className="text-h4">Mobile app 2.0</h3>
    <p className="text-sm text-muted-foreground">At risk · 2 tasks overdue · due Nov 20</p>
  </div>
  <Tabs defaultValue="tasks">
    <TabsList>
      <TabsTrigger value="tasks">Tasks</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="progress">Progress</TabsTrigger>
    </TabsList>
    <TabsContent value="tasks">…</TabsContent>
    <TabsContent value="activity">…</TabsContent>
    <TabsContent value="progress">…</TabsContent>
  </Tabs>
</section>`}
      >
        <section className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4">Mobile app 2.0</h3>
            <p className="text-sm text-muted-foreground">At risk · 2 tasks overdue · due Nov 20</p>
          </div>
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <ul className="divide-y">
                {tasks.map((task) => (
                  <li
                    key={task.title}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3.5 first:pt-0 last:pb-0"
                  >
                    <p className="truncate text-label text-foreground">{task.title}</p>
                    <Badge variant={statusVariant[task.status]}>
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                      {task.status}
                    </Badge>
                    <p className="flex min-w-0 items-center gap-2 text-caption text-muted-foreground">
                      <span className="truncate">{task.assignee}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.priority}</span>
                    </p>
                    <p className="text-right text-caption text-muted-foreground">{task.due}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="activity">
              <ul className="divide-y">
                {activity.map((entry) => (
                  <li key={entry.text} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Avatar size="sm">
                      <AvatarFallback tone={initialsTone(entry.initials)}>{entry.initials}</AvatarFallback>
                    </Avatar>
                    <p className="min-w-0 flex-1 text-sm text-copy">
                      <span className="font-semibold text-foreground">{entry.name}</span> {entry.text}
                    </p>
                    <span className="shrink-0 text-caption text-muted-foreground">{entry.time}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="progress">
              <dl className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Open tasks", "57"],
                  ["Overdue", "2"],
                  ["Done this week", "17"],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 rounded-(--control-radius) bg-subtle p-4">
                    <dt className="text-caption text-muted-foreground">{label}</dt>
                    <dd className="font-heading text-2xl font-extrabold text-foreground tabular">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </section>
      </Example>

      <Guidelines
        do={[
          "Use tabs to switch between views of the same object, such as a project’s tasks, activity and settings.",
          "Keep labels to one or two words and order tabs by how often people use them.",
          "Use the segmented variant for small, mutually exclusive view options like a time range.",
          "Use variant line when a hairline is already there, so the page never shows two lines.",
        ]}
        dont={[
          "Don’t use tabs for steps in a flow. People expect to move between tabs in any order.",
          "Don’t put more than about six tabs in a row. Move rarer views into a menu.",
          "Don’t colour the indicator in the accent. Ink marks the active tab; the accent is for focus.",
          "Don’t nest one set of tabs inside another.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "defaultValue", type: "any", default: "0", description: "Tabs: the tab that is active on first render, when uncontrolled." },
          { prop: "value / onValueChange", type: "any / (value) => void", description: "Tabs: control the active tab." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Tabs: lays the list out in a row or a column. The indicator follows." },
          { prop: "variant", type: '"default" | "line" | "segmented"', default: '"default"', description: "TabsList: underline on a hairline, underline without the hairline, or a segmented track." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "TabsList: height from --tabs-height or --control-height-sm." },
          { prop: "activateOnFocus", type: "boolean", default: "false", description: "TabsList: switch tabs as arrow keys move focus, not only on Enter or Space." },
          { prop: "value", type: "any", description: "TabsTrigger and TabsContent: pairs a tab with its panel." },
          { prop: "disabled", type: "boolean", default: "false", description: "TabsTrigger: shows the tab at reduced opacity and skips it." },
          { prop: "keepMounted", type: "boolean", default: "false", description: "TabsContent: keep a hidden panel in the DOM, for example to preserve form state." },
        ]}
      />
    </Examples>
  )
}
