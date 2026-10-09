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

function Pane({ label, size }: { label: string; size?: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-6">
      <span className="text-title text-foreground">{label}</span>
      {size !== undefined ? (
        <span className="text-caption text-muted-foreground tabular-nums">{Math.round(size)}%</span>
      ) : null}
    </div>
  )
}

function LiveSizes() {
  const [left, setLeft] = React.useState(35)
  const [right, setRight] = React.useState(65)
  return (
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-(--card-radius) border border-border bg-card">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="35%" minSize="20%" onResize={(size) => setLeft(size.asPercentage)}>
          <Pane label="Sidebar" size={left} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="65%" minSize="30%" onResize={(size) => setRight(size.asPercentage)}>
          <Pane label="Content" size={right} />
        </ResizablePanel>
      </ResizablePanelGroup>
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
  <ResizablePanel defaultSize="60%">Editor</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="40%">Output</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <div className="h-72 w-full max-w-md overflow-hidden rounded-(--card-radius) border border-border bg-card">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="60%" minSize="25%">
              <Pane label="Editor" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="40%" minSize="20%">
              <Pane label="Output" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Example>

      <Example
        title="Hairline only"
        description="Leave out withHandle where the split is obvious. The line still darkens on hover and turns violet while you drag it."
        code={`<ResizableHandle />`}
      >
        <div className="h-48 w-full max-w-2xl overflow-hidden rounded-(--card-radius) border border-border bg-card">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="33%" minSize="15%">
              <Pane label="One" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="34%" minSize="15%">
              <Pane label="Two" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="33%" minSize="15%">
              <Pane label="Three" />
            </ResizablePanel>
          </ResizablePanelGroup>
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
                <div className="grid gap-0.5 p-3">
                  <p className="px-2 pt-1 pb-2 text-caption font-semibold text-muted-foreground">lumen-web</p>
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
                      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-code text-copy">
                        <code>{`export default async function Page() {
  const projects = await lumen.projects.list()
  return <ProjectGrid projects={projects} />
}`}</code>
                      </pre>
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
