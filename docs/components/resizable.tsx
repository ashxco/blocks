"use client"

import * as React from "react"
import { ChevronRightIcon, FileCodeIcon, FolderIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const files = [
  { name: "app", folder: true, depth: 0 },
  { name: "layout.tsx", folder: false, depth: 1 },
  { name: "page.tsx", folder: false, depth: 1, active: true },
  { name: "lib", folder: true, depth: 0 },
  { name: "deploy.ts", folder: false, depth: 1 },
  { name: "lumen.json", folder: false, depth: 0 },
  { name: "package.json", folder: false, depth: 0 },
]

const requests = [
  { time: "14:02:41", method: "GET", path: "/api/projects", status: 200, ms: 38 },
  { time: "14:02:39", method: "POST", path: "/api/deployments", status: 201, ms: 412 },
  { time: "14:02:36", method: "GET", path: "/api/deployments/dpl_8f2k", status: 200, ms: 22 },
  { time: "14:02:31", method: "GET", path: "/api/domains", status: 500, ms: 1204 },
  { time: "14:02:30", method: "GET", path: "/api/projects/lumen-web", status: 200, ms: 41 },
  { time: "14:02:24", method: "DELETE", path: "/api/env/REDIS_URL", status: 204, ms: 57 },
]

const pageSource = `export default async function Page() {
  const projects = await lumen.projects.list()
  return <ProjectGrid projects={projects} />
}`

const buildOutput = [
  "Compiled 184 routes in 17.6s",
  "Collecting page data",
  "Generating static pages (38/38)",
  "Deployment ready at lumen-web.lumen.app",
]

const variables = ["DATABASE_URL", "STRIPE_SECRET_KEY", "REDIS_URL", "SENTRY_DSN"]

const deploys = [
  { message: "Cache build output", status: "Ready" },
  { message: "Preview comments", status: "Building" },
  { message: "Bump Node to 22", status: "Failed" },
]

const logLines = ["GET /api/projects 200", "POST /api/deployments 201", "GET /api/domains 500", "GET /api/usage 200"]

/** The bar along the top of a pane: what it shows, and an optional readout on the right. */
function PaneHeader({ title, meta }: { title: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
      <p className="truncate text-label text-foreground">{title}</p>
      {meta !== undefined ? <p className="shrink-0 text-caption text-muted-foreground tabular-nums">{meta}</p> : null}
    </div>
  )
}

function FileTree() {
  return (
    // minmax(0, 1fr) lets the track shrink below the names, so they ellipsize instead of clipping.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-0.5 p-2">
      {files.map((f) => (
        <div
          key={f.name}
          style={{ paddingLeft: `${0.5 + f.depth * 1}rem` }}
          className={
            f.active
              ? "flex h-8 items-center gap-2 rounded-sm bg-sidebar-accent pr-2 text-sm font-semibold text-sidebar-accent-foreground"
              : "flex h-8 items-center gap-2 rounded-sm pr-2 text-sm text-copy"
          }
        >
          {f.folder ? (
            <FolderIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <FileCodeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{f.name}</span>
        </div>
      ))}
    </div>
  )
}

function Source() {
  return (
    <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-code text-copy">
      <code>{pageSource}</code>
    </pre>
  )
}

const statusDot: Record<string, string> = {
  Ready: "bg-success",
  Building: "bg-info",
  Failed: "bg-destructive",
}

function LiveSizes() {
  const [left, setLeft] = React.useState(35)
  const [right, setRight] = React.useState(65)
  return (
    // On a phone the group keeps a readable width and scrolls sideways.
    <div className="w-full max-w-2xl overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
      <div className="h-64 min-w-md">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="35%" minSize="20%" onResize={(size) => setLeft(size.asPercentage)} className="bg-sidebar">
            <div className="flex h-full flex-col">
              <PaneHeader title="Files" meta={`${Math.round(left)}%`} />
              <div className="min-h-0 flex-1 overflow-auto">
                <FileTree />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="65%" minSize="30%" onResize={(size) => setRight(size.asPercentage)}>
            <div className="flex h-full flex-col">
              <PaneHeader title="page.tsx" meta={`${Math.round(right)}%`} />
              <Source />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default function ResizableDocs() {
  return (
    <Examples>
      <Example
        title="Horizontal"
        description="Drag the grip, or focus it and press the arrow keys. Sizes are percentages of the group, given as strings; plain numbers are pixels."
        code={`<ResizablePanelGroup orientation="horizontal" className="rounded-(--card-radius) border">
  <ResizablePanel defaultSize="35%" minSize="20%">Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="65%" minSize="30%">Content</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <LiveSizes />
      </Example>

      <Example
        title="Vertical"
        description={`Stack panels with orientation="vertical". The handle lies flat and the grip turns with it.`}
        code={`<ResizablePanelGroup orientation="vertical">
  <ResizablePanel defaultSize="55%">Editor</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="45%">Output</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <div className="h-72 w-full max-w-md overflow-hidden rounded-(--card-radius) border border-border bg-card">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="55%" minSize="25%">
              <div className="flex h-full flex-col">
                <PaneHeader title="page.tsx" />
                <Source />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="45%" minSize="20%">
              <div className="flex h-full flex-col">
                <PaneHeader title="Output" meta="npm run build" />
                <ol className="min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-xs text-copy">
                  {buildOutput.map((line) => (
                    <li key={line} className="truncate py-0.5">
                      {line}
                    </li>
                  ))}
                </ol>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Example>

      <Example
        title="Hairline only"
        description="Leave out withHandle where the split is obvious. The line still darkens on hover and turns violet while you drag it."
        code={`<ResizableHandle />`}
      >
        {/* Three panes need about 36rem; a narrower stage scrolls sideways instead of squeezing them. */}
        <div className="w-full max-w-2xl overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
          <div className="h-56 min-w-xl">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize="33%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Variables" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {variables.map((key) => (
                      <li key={key} className="truncate py-1.5 font-mono text-xs text-foreground">
                        {key}
                      </li>
                    ))}
                  </ul>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="34%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Deployments" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {deploys.map((d) => (
                      <li key={d.message} className="flex items-center gap-2 py-1.5 text-sm text-copy">
                        <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${statusDot[d.status]}`} />
                        <span className="truncate">{d.message}</span>
                        <span className="sr-only">{d.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="33%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Logs" meta="Live" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {logLines.map((line) => (
                      <li
                        key={line}
                        className={`truncate py-1.5 font-mono text-xs ${line.endsWith("500") ? "text-destructive" : "text-copy"}`}
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </Example>

      <Example
        title="Workspace"
        layout="stack"
        description="Nest groups to build an app workspace: files on the left, the editor above the request log on the right. On a phone the workspace keeps its width and scrolls sideways rather than squeezing the panels."
      >
        <div className="w-full overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
          <div className="h-[28rem] min-w-(--container-prose)">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize="26%" minSize="18%" maxSize="40%" className="bg-sidebar">
                <div className="grid p-1">
                  <p className="px-3 pt-3 pb-1 text-caption font-semibold text-muted-foreground">lumen-web</p>
                  <FileTree />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="74%" minSize="40%">
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize="55%" minSize="25%">
                    <div className="flex h-full flex-col">
                      <div className="flex h-11 items-center gap-1.5 border-b border-border px-4 text-caption text-muted-foreground">
                        app
                        <ChevronRightIcon aria-hidden="true" className="size-3.5" />
                        <span className="font-semibold text-foreground">page.tsx</span>
                      </div>
                      <Source />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize="45%" minSize="20%">
                    <div className="flex h-full flex-col">
                      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
                        <p className="text-label text-foreground">Requests</p>
                        <p className="text-caption text-muted-foreground">Live</p>
                      </div>
                      <ul className="min-h-0 flex-1 divide-y divide-border overflow-auto">
                        {requests.map((r) => (
                          <li
                            key={r.time + r.path}
                            className="grid grid-cols-[4.5rem_3.5rem_1fr_auto] items-center gap-3 px-4 py-2 font-mono text-xs"
                          >
                            <span className="text-muted-foreground tabular-nums">{r.time}</span>
                            <span className="font-semibold text-foreground">{r.method}</span>
                            <span className="truncate text-copy">{r.path}</span>
                            <span className={r.status >= 500 ? "whitespace-nowrap text-destructive tabular-nums" : "whitespace-nowrap text-muted-foreground tabular-nums"}>
                              {r.status} · {r.ms}ms
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Set minSize on every panel so content never collapses to an unreadable sliver.",
          "Use withHandle where people may not expect a split to move.",
          "Give the group a height; panels fill it.",
        ]}
        dont={[
          "Don’t pass plain numbers for percentages; numbers are pixels, so write \"30%\".",
          "Don’t put resizable panels in layouts that reflow on small screens; stack them instead.",
          "Don’t thicken or colour the hairline to make it obvious; add the grip.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "ResizablePanelGroup: the direction panels are laid out and resized." },
          { prop: "defaultSize", type: "number | string", description: "ResizablePanel: starting size. \"30%\" is a percentage, 240 is pixels." },
          { prop: "minSize / maxSize", type: "number | string", description: "ResizablePanel: limits while resizing." },
          { prop: "collapsible", type: "boolean", default: "false", description: "ResizablePanel: collapse to collapsedSize when dragged below minSize." },
          { prop: "onResize", type: "(size: PanelSize) => void", description: "ResizablePanel: called with asPercentage and inPixels as it resizes." },
          { prop: "withHandle", type: "boolean", default: "false", description: "ResizableHandle: show the pill grip on the hairline." },
          { prop: "disabled", type: "boolean", default: "false", description: "ResizableHandle: stop this handle from resizing." },
        ]}
      />
    </Examples>
  )
}
