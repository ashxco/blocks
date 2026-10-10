"use client"

import {
  CalendarCheckIcon,
  FolderKanbanIcon,
  ListChecksIcon,
  TimerIcon,
  TriangleAlertIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { StatCard } from "@/components/blocks/stat-card"

/** The Acme Inc. dashboard metrics: the same figures as the Dashboard template. */
const activeProjects = [18, 19, 19, 20, 21, 21, 22, 21, 22, 23, 23, 24]
const onTime = [84, 85, 87, 86, 88, 87, 89, 88, 90, 89, 91, 92]
const cycleTime = [4.6, 4.4, 4.5, 4.2, 4.1, 4.2, 3.9, 4, 3.8, 3.7, 3.6, 3.4]

export default function StatCardDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A label, the headline figure, the change against the previous period and a twelve-point trend in quiet ink. The change carries the colour, so the trend line never contradicts it."
        code={`<StatCard
  label="Tasks completed"
  value="1,284"
  change={12}
  changeLabel="vs last month"
  trend={[236, 251, 244, 262, 258, 271, 266, 280, 277, 291, 286, 302]}
/>`}
      >
        <StatCard className="w-full max-w-80" icon={ListChecksIcon} />
      </Example>

      <Example
        title="A row of metrics"
        description="Four cards across on wide screens, two on tablets and one on phones, from a container query on the row. Each card reads its own width, so the sparkline drops out when it gets too narrow. A change can be relative (12%) or absolute: points for a rate that moved, days for a duration, a plain number for a count."
        layout="full"
        surface="subtle"
        code={`<div className="@container">
  <div className="grid gap-4 @min-[36rem]:grid-cols-2 @min-[68rem]:grid-cols-4">
    <StatCard label="Active projects" value="24" change={3} changeUnit="" changeLabel="this month" />
    <StatCard label="Tasks completed" value="1,284" change={12} changeLabel="vs last month" />
    <StatCard label="On-time delivery" value="92" unit="%" change={4} changeUnit="pts" />
    <StatCard label="Average cycle time" value="3.4" unit="days" change={-0.6} changeUnit="days" goodWhen="down" />
  </div>
</div>`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[36rem]:grid-cols-2 @min-[48rem]:p-10 @min-[68rem]:grid-cols-4">
            <StatCard
              label="Active projects"
              value="24"
              change={3}
              changeUnit=""
              changeLabel="this month"
              icon={FolderKanbanIcon}
              trend={activeProjects}
            />
            <StatCard icon={ListChecksIcon} />
            <StatCard
              label="On-time delivery"
              value="92"
              unit="%"
              change={4}
              changeUnit="pts"
              changeLabel="vs last month"
              icon={CalendarCheckIcon}
              trend={onTime}
            />
            <StatCard
              label="Average cycle time"
              value="3.4"
              unit="days"
              change={-0.6}
              changeUnit="days"
              changeLabel="vs last month"
              goodWhen="down"
              icon={TimerIcon}
              trend={cycleTime}
            />
          </div>
        </div>
      </Example>

      <Example
        title="Emphasis"
        description="The panel tone turns one card dark to anchor a row. Use it for the figure the page is about, and only once."
        layout="full"
        code={`<StatCard tone="panel" label="On-time delivery" value="92" unit="%" change={4} changeUnit="pts" />`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[40rem]:grid-cols-3 @min-[48rem]:p-10">
            <StatCard
              tone="panel"
              label="On-time delivery"
              value="92"
              unit="%"
              change={4}
              changeUnit="pts"
              changeLabel="vs last month"
              icon={CalendarCheckIcon}
              trend={onTime}
            />
            <StatCard
              label="Automation runs"
              value="7,240"
              change={18}
              changeLabel="vs September"
              icon={ZapIcon}
              trend={[410, 460, 455, 520, 540, 610, 590, 640, 700, 690, 760, 810]}
            />
            <StatCard
              label="Overdue tasks"
              value="7"
              change={-3}
              changeUnit=""
              changeLabel="since Monday"
              goodWhen="down"
              icon={TriangleAlertIcon}
              trend={[]}
            />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Format the number before passing it (“1,284”, “$216”) and pass units through unit: value=\"3.4\" unit=\"days\".",
          "Name the comparison period in changeLabel so the change means something.",
          "Use changeUnit for absolute changes: “pts” for a rate that moved, “days” for a duration, \"\" for a count.",
          'Set goodWhen="down" for cycle time, overdue tasks and cost, so a drop shows in green.',
        ]}
        dont={[
          "Don’t put more than one panel-tone card in a row.",
          "Don’t use colour alone for the change: the arrow and its screen-reader label carry it too.",
          "Don’t show a sparkline with fewer than six points; pass [] to hide it.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "label",
            type: "string",
            default: '"Tasks completed"',
            description: "What is measured, in sentence case.",
          },
          {
            prop: "value",
            type: "ReactNode",
            default: '"1,284"',
            description:
              "The formatted headline figure, set in the text-h2 role with tabular figures.",
          },
          {
            prop: "unit",
            type: "string",
            description: "Small unit after the value, such as “%” or “days”.",
          },
          {
            prop: "change",
            type: "number",
            default: "12",
            description: "Change against the previous period. Negative for a drop.",
          },
          {
            prop: "changeUnit",
            type: "string",
            default: '"%"',
            description:
              "“%” for a relative change; a word such as “pts” or “days” for an absolute one; \"\" for a count.",
          },
          {
            prop: "changeLabel",
            type: "string",
            default: '"vs last month"',
            description: "The period the change compares against.",
          },
          {
            prop: "goodWhen",
            type: '"up" | "down"',
            default: '"up"',
            description:
              "Which direction shows in success; the other shows in destructive.",
          },
          {
            prop: "trend",
            type: "number[]",
            description:
              "Values for the sparkline, oldest first. An empty array hides it.",
          },
          {
            prop: "icon",
            type: "LucideIcon",
            description: "Icon beside the label.",
          },
          {
            prop: "tone",
            type: '"default" | "panel"',
            default: '"default"',
            description: "Panel renders a dark emphasis card.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the card.",
          },
        ]}
      />
    </Examples>
  )
}
