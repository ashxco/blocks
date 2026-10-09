"use client"

import {
  ActivityIcon,
  GitBranchIcon,
  GlobeIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  ListIcon,
  ScrollTextIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const deployments = [
  { sha: "a41c9e2", message: "Cache build output between deploys", branch: "main", status: "Ready", time: "2m ago" },
  { sha: "7f03b1d", message: "Add preview comments to pull requests", branch: "preview-comments", status: "Building", time: "9m ago" },
  { sha: "c88e410", message: "Move image resizing to the edge", branch: "main", status: "Ready", time: "1h ago" },
] as const

const logLines = [
  "12:04:31  GET  /api/projects        200   38ms",
  "12:04:33  POST /api/deployments     201  412ms",
  "12:04:34  GET  /dashboard           200   61ms",
  "12:04:39  GET  /api/logs?tail=100   200   22ms",
]

export default function TabsDocs() {
  return (
    <Examples>
      <Example
        title="Underline"
        description="The default. A 2px ink line slides to the active tab along a full-width hairline."
        layout="stack"
        code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="deployments">Deployments</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            Production is serving the build from commit a41c9e2. Traffic is up 18% on last week.
          </TabsContent>
          <TabsContent value="deployments">
            Three deployments today. The latest one went live 2 minutes ago.
          </TabsContent>
          <TabsContent value="logs">Streaming runtime logs from 2 regions.</TabsContent>
          <TabsContent value="settings">Build command, output directory and Node.js version.</TabsContent>
        </Tabs>
      </Example>

      <Example
        title="Segmented"
        description="A pill track for switching views of the same data, such as a time range or a layout. The active tab turns ink."
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
        description="Default height is --tabs-height. Use sm in toolbars and dense panels."
        layout="stack"
        code={`<TabsList size="sm">…</TabsList>
<TabsList variant="segmented" size="sm">…</TabsList>`}
      >
        <Tabs defaultValue="all">
          <TabsList size="sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="all">
          <TabsList variant="segmented" size="sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
          </TabsList>
        </Tabs>
      </Example>

      <Example
        title="On an existing hairline"
        description="Use variant line when the tabs sit on a border that is already there, such as the bottom of a page header."
        layout="stack"
        code={`<header className="border-b">
  <h1 className="text-h3">web-app</h1>
  <Tabs defaultValue="deployments">
    <TabsList variant="line">…</TabsList>
  </Tabs>
</header>`}
      >
        <header className="grid gap-5 border-b">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <h3 className="text-h3">web-app</h3>
              <p className="text-sm text-muted-foreground">lumen.app · Frankfurt, fra1</p>
            </div>
            <Button size="sm" variant="outline">
              Visit
            </Button>
          </div>
          <Tabs defaultValue="deployments">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>
      </Example>

      <Example
        title="With icons and counts"
        description="Icons sit before the label. Counts use a small badge after it."
        layout="stack"
      >
        <Tabs defaultValue="deployments">
          <TabsList>
            <TabsTrigger value="deployments">
              <GitBranchIcon />
              Deployments
            </TabsTrigger>
            <TabsTrigger value="logs">
              <ScrollTextIcon />
              Logs
            </TabsTrigger>
            <TabsTrigger value="incidents">
              <ActivityIcon />
              Incidents
              <Badge variant="destructive">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="members" disabled>
              <UsersIcon />
              Members
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Example>

      <Example
        title="Vertical"
        description="For settings pages with many sections. The indicator moves to the left edge."
        layout="stack"
        code={`<Tabs defaultValue="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="domains">Domains</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="domains" orientation="vertical" className="min-h-56">
          <TabsList className="w-48">
            <TabsTrigger value="general">
              <SettingsIcon />
              General
            </TabsTrigger>
            <TabsTrigger value="domains">
              <GlobeIcon />
              Domains
            </TabsTrigger>
            <TabsTrigger value="git">
              <GitBranchIcon />
              Git
            </TabsTrigger>
            <TabsTrigger value="env">
              <KeyRoundIcon />
              Environment variables
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="grid content-start gap-2">
            <h4 className="text-title">General</h4>
            <p className="text-sm">Project name, framework preset and the root directory to build from.</p>
          </TabsContent>
          <TabsContent value="domains" className="grid content-start gap-2">
            <h4 className="text-title">Domains</h4>
            <p className="text-sm">
              lumen.app and www.lumen.app point at production. Add a domain to serve this project from it.
            </p>
          </TabsContent>
          <TabsContent value="git" className="grid content-start gap-2">
            <h4 className="text-title">Git</h4>
            <p className="text-sm">Connected to acme/web-app. Pushes to main deploy to production.</p>
          </TabsContent>
          <TabsContent value="env" className="grid content-start gap-2">
            <h4 className="text-title">Environment variables</h4>
            <p className="text-sm">12 variables across production, preview and development.</p>
          </TabsContent>
        </Tabs>
      </Example>

      <Example
        title="In a project page"
        description="Tabs switch between views of one project. Each panel keeps its own layout."
        layout="stack"
      >
        <section className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4">api</h3>
            <p className="text-sm text-muted-foreground">Node.js 22 · 2 regions · Last deployed 2 minutes ago</p>
          </div>
          <Tabs defaultValue="deployments">
            <TabsList>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            <TabsContent value="deployments">
              <ul className="divide-y">
                {deployments.map((d) => (
                  <li
                    key={d.sha}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3.5 first:pt-0 last:pb-0"
                  >
                    <p className="truncate text-label text-foreground">{d.message}</p>
                    <Badge variant={d.status === "Ready" ? "success" : "warning"}>{d.status}</Badge>
                    <p className="flex min-w-0 items-center gap-2 text-caption text-muted-foreground">
                      <span className="font-mono">{d.sha}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{d.branch}</span>
                    </p>
                    <p className="text-right text-caption text-muted-foreground">{d.time}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="logs">
              <pre className="overflow-x-auto rounded-(--control-radius) bg-terminal p-4 font-mono text-code text-terminal-foreground">
                {logLines.join("\n")}
              </pre>
            </TabsContent>
            <TabsContent value="usage">
              <dl className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Requests", "2.4M"],
                  ["Bandwidth", "184 GB"],
                  ["Build minutes", "1,260"],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 rounded-(--control-radius) bg-subtle p-4">
                    <dt className="text-caption text-muted-foreground">{label}</dt>
                    <dd className="text-2xl font-extrabold text-foreground tabular">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </section>
      </Example>

      <Guidelines
        do={[
          "Use tabs to switch between views of the same object, such as a project’s deployments, logs and settings.",
          "Keep labels to one or two words and order tabs by how often people use them.",
          "Use the segmented variant for small, mutually exclusive view options like a time range.",
          "Use variant line when a hairline is already there, so the page never shows two lines.",
        ]}
        dont={[
          "Don’t use tabs for steps in a flow. People expect to move between tabs in any order.",
          "Don’t put more than about six tabs in a row. Move rarer views into a menu.",
          "Don’t colour the indicator with brand violet. Ink marks the active tab; violet is for focus.",
          "Don’t nest one set of tabs inside another.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "defaultValue", type: "any", default: "0", description: "Tabs: the tab that is active on first render, when uncontrolled." },
          { prop: "value / onValueChange", type: "any / (value) => void", description: "Tabs: control the active tab." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Tabs: lays the list out in a row or a column. The indicator follows." },
          { prop: "variant", type: '"default" | "line" | "segmented"', default: '"default"', description: "TabsList: underline on a hairline, underline without the hairline, or a pill track." },
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
