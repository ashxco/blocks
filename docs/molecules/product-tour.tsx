"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  BoardScreen,
  ProductTour,
  ReportScreen,
  ScreenFrame,
  TaskScreen,
  TimelineScreen,
} from "@/components/blocks/product-tour"

export default function ProductTourDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Four steps beside an app window that shows the product screen for each one. It advances every 4.5 seconds while on screen, pauses on hover and stops once someone picks a step or presses pause. With reduced motion it never advances on its own."
        code={`<ProductTour />`}
      >
        <ProductTour />
      </Example>

      <Example
        title="Without auto-play"
        layout="full"
        description="Start on a chosen step and let people explore. Use this when the section sits next to other moving content."
        code={`<ProductTour autoPlay={false} defaultStep={2} />`}
      >
        <ProductTour autoPlay={false} defaultStep={2} />
      </Example>

      <Example
        title="Custom steps"
        layout="full"
        description="Any short sequence works. Each step takes a screen built from components: pass your own, or reuse the exported TimelineScreen, TaskScreen, BoardScreen and ReportScreen with your own data."
        code={`<ProductTour
  title="Run a sprint in Acme."
  description="Plan the sprint on Monday, work from the board all week and close it with a report on Friday."
  windowTitle="Sprint 42"
  steps={[
    { title: "Plan", description: "Pull the sprint’s tasks onto the board and size them.", meta: "Board", screen: <BoardScreen columns={[…]} /> },
    { title: "Review", description: "Check progress against the sprint timeline.", meta: "Timeline", screen: <TimelineScreen items={[…]} /> },
    { title: "Close", description: "See what finished, what slipped and why.", meta: "Report", screen: <ReportScreen scope="16 tasks planned" figures={[…]} bars={[…]} /> },
  ]}
/>`}
      >
        <ProductTour
          title="Run a sprint in Acme."
          description="Plan the sprint on Monday, work from the board all week and close it with a report on Friday."
          windowTitle="Sprint 42"
          autoPlay={false}
          steps={[
            {
              title: "Plan",
              description: "Pull the sprint’s tasks onto the board and size them.",
              meta: "Board",
              screen: (
                <BoardScreen
                  columns={[
                    {
                      title: "Backlog",
                      count: 14,
                      cards: [
                        { title: "Export reports to CSV", assignee: "Jordan Lee", priority: "medium" },
                        { title: "Dark mode for docs", assignee: "Sofia Alvarez", priority: "low" },
                      ],
                    },
                    {
                      title: "This sprint",
                      count: 13,
                      cards: [
                        { title: "Guest invite emails", assignee: "Jordan Lee", priority: "high", due: "Oct 16" },
                        { title: "Inbox grouping", assignee: "Sofia Alvarez", priority: "urgent", due: "Oct 14" },
                      ],
                    },
                    {
                      title: "In progress",
                      count: 3,
                      cards: [{ title: "Recurring task fixes", assignee: "Maya Patel", priority: "medium", due: "Oct 20" }],
                    },
                  ]}
                />
              ),
            },
            {
              title: "Review",
              description: "Check progress against the sprint timeline.",
              meta: "Timeline",
              screen: (
                <TimelineScreen
                  weeks={["Oct 12", "Oct 19"]}
                  today={0.6}
                  items={[
                    { title: "Inbox grouping", start: 0, end: 0.35, state: "done" },
                    { title: "Guest invite emails", start: 0, end: 0.65, state: "active" },
                    { title: "Recurring task fixes", start: 0, end: 1.15, state: "active" },
                    { title: "Calendar sync", start: 0.6, end: 1.45, state: "planned" },
                    { title: "Sprint review", start: 1.57, end: 1.57, state: "planned", milestone: true },
                  ]}
                />
              ),
            },
            {
              title: "Close",
              description: "See what finished, what slipped and why.",
              meta: "Report",
              screen: (
                <ReportScreen
                  scope="16 tasks planned"
                  period="Compared with Sprint 41"
                  figures={[
                    { label: "Done", value: "14", change: "+3", trend: "good" },
                    { label: "Slipped", value: "2", change: "−1", trend: "good" },
                    { label: "Cycle time", value: "2.8 days", change: "−0.4", trend: "good" },
                  ]}
                  bars={[
                    [1, 1], [1, 1], [2, 1], [1, 2], [2, 1],
                    [1, 1], [2, 1], [1, 2], [2, 0], [1, 1],
                  ]}
                  legend={["Sprint 42", "Sprint 41"]}
                  range={["Oct 12", "Oct 23"]}
                />
              ),
            },
          ]}
        />
      </Example>

      <Example
        title="Screens"
        layout="stack"
        surface="subtle"
        description="The four default screens are exported with ScreenFrame, the light app window around them. Each lays itself out from the frame’s width, so they also work in feature rows and changelog entries."
        code={`<ScreenFrame view="Timeline"><TimelineScreen /></ScreenFrame>
<ScreenFrame view="Task"><TaskScreen /></ScreenFrame>
<ScreenFrame view="Board"><BoardScreen /></ScreenFrame>
<ScreenFrame view="Report"><ReportScreen /></ScreenFrame>`}
      >
        <div className="grid gap-6 @4xl:grid-cols-2" inert>
          <TimelineScreenDemo />
          <TaskScreenDemo />
          <BoardScreenDemo />
          <ReportScreenDemo />
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep to three to five steps, each a single verb with one sentence.",
          "Show one product screen per step, built from components, with realistic data from one project.",
          "Put the view name in meta, so the step and the window bar agree.",
        ]}
        dont={[
          "Don’t number the steps; the vertical rail already shows the order.",
          "Don’t place two auto-playing sections on the same screen.",
          "Don’t put the tour on a dark page band; it brings its own panel.",
        ]}
      />

      <ApiTable
        title="ProductTour"
        rows={[
          { prop: "title", type: "ReactNode", default: '"From first plan to final report."', description: "Heading on the panel." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "steps", type: "ProductTourStep[]", default: "Plan, Assign, Track, Report", description: "The selectable steps and their screens." },
          { prop: "windowTitle", type: "string", default: '"Website relaunch"', description: "Page name in the window bar." },
          { prop: "autoPlay", type: "boolean", default: "true", description: "Advance on a timer until someone interacts. Off when reduced motion is on." },
          { prop: "interval", type: "number", default: "4500", description: "Milliseconds per step while playing." },
          { prop: "defaultStep", type: "number", default: "0", description: "Index of the step selected first." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the wide container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="ProductTourStep"
        rows={[
          { prop: "title", type: "string", description: "Step name, a single verb." },
          { prop: "description", type: "string", description: "Shown under the title when the step is selected, and used as the screen’s accessible name." },
          { prop: "meta", type: "string", description: "Short readout on the right of the step, such as the view. Also shown in the window bar." },
          { prop: "screen", type: "ReactNode", description: "The product screen, such as <BoardScreen />. It is inert and announced as one image." },
        ]}
      />

      <ApiTable
        title="Screens"
        rows={[
          { prop: "ScreenFrame", type: "{ title?, view?, children, className? }", description: "Light app window with the Acme mark, a page name and a view label. Screens read their layout from it." },
          { prop: "TimelineScreen", type: "{ weeks?, items?: TimelineItem[], today? }", description: "Bars across weeks, with milestones and a violet line for today. Rows share out spare height, so the chart fills a tall window." },
          { prop: "TaskScreen", type: "{ className? }", description: "One task with its owner, due date, priority, subtasks and latest comment." },
          { prop: "BoardScreen", type: "{ columns?: BoardColumn[] }", description: "A board. The first of three columns steps aside in a narrow frame." },
          { prop: "ReportScreen", type: "{ scope?, period?, figures?: ReportFigure[], chart?, bars?, legend?, range? }", description: "Three headline figures, then a bar per day with the previous period as a dashed line. Defaults to all projects in Acme Inc. over the last 30 days." },
        ]}
      />
    </Examples>
  )
}

function TimelineScreenDemo() {
  return (
    <ScreenFrame view="Timeline">
      <TimelineScreen />
    </ScreenFrame>
  )
}

function TaskScreenDemo() {
  return (
    <ScreenFrame view="Task">
      <TaskScreen />
    </ScreenFrame>
  )
}

function BoardScreenDemo() {
  return (
    <ScreenFrame view="Board">
      <BoardScreen />
    </ScreenFrame>
  )
}

function ReportScreenDemo() {
  return (
    <ScreenFrame view="Report">
      <ReportScreen />
    </ScreenFrame>
  )
}
