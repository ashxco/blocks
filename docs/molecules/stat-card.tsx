"use client"

import {
  ActivityIcon,
  GaugeIcon,
  RocketIcon,
  TriangleAlertIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { StatCard } from "@/components/blocks/stat-card"

export default function StatCardDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A label, the headline figure, the change against the previous period and a twelve-point trend in quiet ink. The change carries the colour, so the trend line never contradicts it."
        code={`<StatCard
  label="Edge requests"
  value="2.41M"
  change={18.2}
  changeLabel="vs previous 7 days"
  trend={[42, 46, 44, 51, 49, 58, 55, 61, 64, 60, 71, 76]}
/>`}
      >
        <StatCard className="w-full max-w-80" icon={ActivityIcon} />
      </Example>

      <Example
        title="A row of metrics"
        description="Four cards across on wide screens, two on tablets and one on phones, from a container query on the row. Each card reads its own width, so the sparkline drops out when it gets too narrow."
        layout="full"
        surface="subtle"
        code={`<div className="@container">
  <div className="grid gap-4 @min-[36rem]:grid-cols-2 @min-[68rem]:grid-cols-4">
    <StatCard label="Edge requests" value="2.41M" change={18.2} />
    <StatCard label="Deployments" value="148" change={12} />
    <StatCard label="p95 latency" value="112" unit="ms" change={-8.4} goodWhen="down" />
    <StatCard label="Error rate" value="0.04" unit="%" change={21.5} goodWhen="down" />
  </div>
</div>`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[36rem]:grid-cols-2 @min-[48rem]:p-10 @min-[68rem]:grid-cols-4">
            <StatCard icon={ActivityIcon} />
            <StatCard
              label="Deployments"
              value="148"
              change={12}
              icon={RocketIcon}
              trend={[9, 14, 11, 18, 16, 21, 19, 24, 22, 20, 27, 25]}
            />
            <StatCard
              label="p95 latency"
              value="112"
              unit="ms"
              change={-8.4}
              goodWhen="down"
              icon={GaugeIcon}
              trend={[
                138, 131, 134, 128, 126, 129, 121, 118, 120, 116, 114, 112,
              ]}
            />
            <StatCard
              label="Error rate"
              value="0.04"
              unit="%"
              change={21.5}
              goodWhen="down"
              icon={TriangleAlertIcon}
              trend={[3, 3, 2, 4, 3, 3, 5, 4, 4, 5, 4, 5]}
            />
          </div>
        </div>
      </Example>

      <Example
        title="Emphasis"
        description="The panel tone turns one card dark to anchor a row. Use it for the figure the page is about, and only once."
        layout="full"
        code={`<StatCard tone="panel" label="Deployments" value="148" change={12} />`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[40rem]:grid-cols-3 @min-[48rem]:p-10">
            <StatCard
              tone="panel"
              label="Deployments"
              value="148"
              change={12}
              icon={RocketIcon}
              trend={[9, 14, 11, 18, 16, 21, 19, 24, 22, 20, 27, 25]}
            />
            <StatCard
              label="Cache hit rate"
              value="94.2"
              unit="%"
              change={1.8}
              changeLabel="vs previous 7 days"
              icon={ZapIcon}
              trend={[88, 89, 89, 90, 91, 90, 92, 92, 93, 93, 94, 94]}
            />
            <StatCard
              label="Failed builds"
              value="3"
              change={-50}
              goodWhen="down"
              icon={TriangleAlertIcon}
              trend={[]}
            />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Format the number before passing it (“2.41M”, “$1,284”) and pass units through unit: value=\"112\" unit=\"ms\".",
          "Name the comparison period in changeLabel so the percentage means something.",
          'Set goodWhen="down" for latency, errors and cost, so a drop shows in green.',
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
            default: '"Edge requests"',
            description: "What is measured, in sentence case.",
          },
          {
            prop: "value",
            type: "ReactNode",
            default: '"2.41M"',
            description:
              "The formatted headline figure, set in the text-h2 role with tabular figures.",
          },
          {
            prop: "unit",
            type: "string",
            description: "Small unit after the value, such as “ms” or “%”.",
          },
          {
            prop: "change",
            type: "number",
            default: "18.2",
            description:
              "Change against the previous period in percent. Negative for a drop.",
          },
          {
            prop: "changeLabel",
            type: "string",
            default: '"vs previous 7 days"',
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
