"use client"

import * as React from "react"
import { ChevronRightIcon, FileTextIcon, FolderIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/docs/sample/people"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const docs = [
  { name: "Website relaunch", folder: true, depth: 0 },
  { name: "Homepage brief", folder: false, depth: 1, active: true },
  { name: "Launch checklist", folder: false, depth: 1 },
  { name: "Q4 planning", folder: true, depth: 0 },
  { name: "Hiring plan", folder: false, depth: 1 },
  { name: "Weekly planning notes", folder: false, depth: 0 },
  { name: "Team handbook", folder: false, depth: 0 },
]

const linkedTasks = [
  {
    title: "Write the homepage hero copy",
    owner: "PR",
    due: "Oct 6",
    status: "Done",
  },
  { title: "Choose the hero image", owner: "SA", due: "Oct 8", status: "Done" },
  {
    title: "Get Hana’s sign-off on the copy",
    owner: "PR",
    due: "Oct 12",
    status: "In progress",
  },
  {
    title: "Write the launch announcement",
    owner: "PR",
    due: "Oct 14",
    status: "In review",
  },
  {
    title: "Fix the pricing table on mobile",
    owner: "JL",
    due: "Oct 15",
    status: "Blocked",
  },
  {
    title: "Set up the pricing page",
    owner: "JL",
    due: "Oct 20",
    status: "In progress",
  },
]

const comments = [
  {
    who: "Hana Kim",
    text: "Can the headline name the three things teams replace?",
  },
  {
    who: "Priya Raman",
    text: "Trying a version with planning, tasks and docs.",
  },
  {
    who: "Sofia Alvarez",
    text: "The hero image is final. Shared it in Figma.",
  },
]

const projectNames = [
  "Website relaunch",
  "Mobile app 2.0",
  "Q4 planning",
  "Brand refresh",
]

const tasks = [
  { title: "Write the hero copy", status: "Done" },
  { title: "Set up the pricing page", status: "In progress" },
  { title: "Fix the pricing table", status: "Blocked" },
]

const activity = [
  "Sofia completed a task",
  "Priya left a comment",
  "Jordan took a task",
  "Hana commented on the copy",
]

/** The bar along the top of a pane: what it shows, and an optional readout on the right. */
function PaneHeader({
  title,
  meta,
}: {
  title: React.ReactNode
  meta?: React.ReactNode
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
      <p className="truncate text-label text-foreground">{title}</p>
      {meta !== undefined ? (
        <p className="shrink-0 text-caption text-muted-foreground tabular-nums">
          {meta}
        </p>
      ) : null}
    </div>
  )
}

function DocTree() {
  return (
    // minmax(0, 1fr) lets the track shrink below the names, so they ellipsize instead of clipping.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-0.5 p-2">
      {docs.map((f) => (
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
            <FolderIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          ) : (
            <FileTextIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          )}
          <span className="truncate">{f.name}</span>
        </div>
      ))}
    </div>
  )
}

/** The open doc: a short brief, scrolling inside its pane. */
function DocBody() {
  return (
    <div className="grid min-h-0 flex-1 content-start gap-3 overflow-auto p-4 text-sm text-copy">
      <p className="text-title text-foreground">Homepage brief</p>
      <p>
        Say what Acme does in one sentence, then show the product. Every section
        leads to one action: start a free trial.
      </p>
      <ul className="grid list-disc gap-1 pl-5">
        <li>Headline: plan, track and ship your team’s work in one place</li>
        <li>Proof: 12,000+ teams and 4.8M tasks completed every month</li>
        <li>Launch: Nov 14, with the new pricing page</li>
      </ul>
    </div>
  )
}

const statusDot: Record<string, string> = {
  Done: "bg-success",
  "In progress": "bg-info",
  "In review": "bg-info",
  Blocked: "bg-destructive",
  "To do": "bg-muted-foreground",
}

function LiveSizes() {
  const [left, setLeft] = React.useState(35)
  const [right, setRight] = React.useState(65)
  return (
    // On a phone the group keeps a readable width and scrolls sideways.
    <div className="relative w-full max-w-2xl overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
      <div className="h-80 min-w-md">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            defaultSize="35%"
            minSize="20%"
            onResize={(size) => setLeft(size.asPercentage)}
            className="bg-sidebar"
          >
            <div className="flex h-full flex-col">
              <PaneHeader title="Docs" meta={`${Math.round(left)}%`} />
              <div className="min-h-0 flex-1 overflow-auto">
                <DocTree />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize="65%"
            minSize="30%"
            onResize={(size) => setRight(size.asPercentage)}
          >
            <div className="flex h-full flex-col">
              <PaneHeader
                title="Website relaunch"
                meta={`${Math.round(right)}%`}
              />
              <DocBody />
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
  <ResizablePanel defaultSize="60%">Doc</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="40%">Comments</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <div className="h-[28rem] w-full max-w-lg overflow-hidden rounded-(--card-radius) border border-border bg-card">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="60%" minSize="25%">
              <div className="flex h-full flex-col">
                <PaneHeader title="Website relaunch" />
                <DocBody />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="40%" minSize="20%">
              <div className="flex h-full flex-col">
                <PaneHeader title="Comments" meta={comments.length} />
                <ol className="min-h-0 flex-1 overflow-auto px-4 py-2 text-sm">
                  {comments.map((c) => (
                    <li key={c.who} className="truncate py-1 text-copy">
                      <span className="font-semibold text-foreground">
                        {c.who}
                      </span>{" "}
                      {c.text}
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
        description="Leave out withHandle where the split is obvious. The line still darkens on hover and turns to the accent while you drag it."
        code={`<ResizableHandle />`}
      >
        {/* Three panes need about 36rem; a narrower stage scrolls sideways instead of squeezing them. */}
        <div className="relative w-full max-w-2xl overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
          <div className="h-56 min-w-xl">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize="33%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Projects" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {projectNames.map((name) => (
                      <li
                        key={name}
                        className="truncate py-1.5 text-sm text-foreground"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="34%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Tasks" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {tasks.map((t) => (
                      <li
                        key={t.title}
                        className="flex items-center gap-2 py-1.5 text-sm text-copy"
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 shrink-0 rounded-full ${statusDot[t.status]}`}
                        />
                        <span className="truncate">{t.title}</span>
                        <span className="sr-only">{t.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="33%" minSize="20%">
                <div className="flex h-full flex-col">
                  <PaneHeader title="Activity" meta="Today" />
                  <ul className="min-h-0 flex-1 overflow-auto px-4 py-2">
                    {activity.map((line) => (
                      <li
                        key={line}
                        className="truncate py-1.5 text-sm text-copy"
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
        description="Nest groups to build an app workspace: docs on the left, the open doc above its linked tasks on the right. On a phone the workspace keeps its width and scrolls sideways rather than squeezing the panels."
      >
        {/* relative makes the scroller the containing block for the sr-only status text, so it can't widen the page. */}
        <div className="relative w-full overflow-x-auto overscroll-x-contain rounded-(--card-radius) border border-border bg-card">
          <div className="h-[36rem] min-w-(--container-prose)">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel
                defaultSize="26%"
                minSize="18%"
                maxSize="40%"
                className="bg-sidebar"
              >
                <div className="grid p-1">
                  <p className="px-3 pt-3 pb-1 text-caption font-semibold text-muted-foreground">
                    Acme Inc.
                  </p>
                  <DocTree />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="74%" minSize="40%">
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize="42%" minSize="25%">
                    <div className="flex h-full flex-col">
                      <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-border px-4 text-caption text-muted-foreground">
                        Website relaunch
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="size-3.5"
                        />
                        <span className="font-semibold text-foreground">
                          Homepage brief
                        </span>
                      </div>
                      <DocBody />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize="58%" minSize="20%">
                    <div className="flex h-full flex-col">
                      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
                        <p className="text-label text-foreground">
                          Linked tasks
                        </p>
                        <p className="text-caption text-muted-foreground tabular-nums">
                          2 of {linkedTasks.length} done
                        </p>
                      </div>
                      <ul className="min-h-0 flex-1 divide-y divide-border overflow-auto">
                        {linkedTasks.map((t) => (
                          <li
                            key={t.title}
                            className="grid grid-cols-[auto_1fr_2rem_3.5rem] items-center gap-3 px-4 py-2 text-sm"
                          >
                            <span
                              aria-hidden="true"
                              className={`size-1.5 rounded-full ${statusDot[t.status]}`}
                            />
                            <span
                              className={
                                t.status === "Done"
                                  ? "truncate text-muted-foreground"
                                  : "truncate text-foreground"
                              }
                            >
                              {t.title}
                              <span className="sr-only">, {t.status}</span>
                            </span>
                            <Avatar size="sm">
                              <AvatarFallback tone={initialsTone(t.owner)}>
                                {t.owner}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={
                                t.status === "Blocked"
                                  ? "text-right text-caption text-destructive tabular-nums"
                                  : "text-right text-caption text-muted-foreground tabular-nums"
                              }
                            >
                              {t.due}
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
          'Don’t pass plain numbers for percentages; numbers are pixels, so write "30%".',
          "Don’t put resizable panels in layouts that reflow on small screens; stack them instead.",
          "Don’t thicken or colour the hairline to make it obvious; add the grip.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description:
              "ResizablePanelGroup: the direction panels are laid out and resized.",
          },
          {
            prop: "defaultSize",
            type: "number | string",
            description:
              'ResizablePanel: starting size. "30%" is a percentage, 240 is pixels.',
          },
          {
            prop: "minSize / maxSize",
            type: "number | string",
            description: "ResizablePanel: limits while resizing.",
          },
          {
            prop: "collapsible",
            type: "boolean",
            default: "false",
            description:
              "ResizablePanel: collapse to collapsedSize when dragged below minSize.",
          },
          {
            prop: "onResize",
            type: "(size: PanelSize) => void",
            description:
              "ResizablePanel: called with asPercentage and inPixels as it resizes.",
          },
          {
            prop: "withHandle",
            type: "boolean",
            default: "false",
            description:
              "ResizableHandle: show the small grip on the hairline.",
          },
          {
            prop: "disabled",
            type: "boolean",
            default: "false",
            description: "ResizableHandle: stop this handle from resizing.",
          },
        ]}
      />
    </Examples>
  )
}
