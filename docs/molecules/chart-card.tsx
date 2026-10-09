"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ChartCard, type ChartPoint } from "@/components/blocks/chart-card"

function series(
  seed: number,
  base: number,
  spread: number,
  drift: number,
  weekendDip = 1
): ChartPoint[] {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  const end = Date.UTC(2026, 9, 6)
  const day = 24 * 60 * 60 * 1000
  return Array.from({ length: 90 }, (_, index) => {
    const time = end - (89 - index) * day
    const weekday = new Date(time).getUTCDay()
    const dip = weekday === 0 || weekday === 6 ? weekendDip : 1
    const value = Math.max(
      0,
      Math.round((base + index * drift) * dip + (random() - 0.5) * spread)
    )
    const previous = Math.max(
      0,
      Math.round(
        (base + index * drift * 0.6) * dip * 1.06 + (random() - 0.5) * spread
      )
    )
    return { date: new Date(time).toISOString().slice(0, 10), value, previous }
  })
}

const deployments = series(4242, 14, 10, 0.08, 0.35)
const latency = series(777, 132, 22, -0.18)

export default function ChartCardDocs() {
  return (
    <Examples>
      <Example
        title="Area"
        description="For continuous measures such as requests or bandwidth. The dashed line is the previous period, so the change has a reference."
        layout="full"
        code={`<ChartCard
  title="Edge requests"
  description="Requests served across every project and region."
  data={requests}      // one point per day: { date, value, previous }
  defaultPeriod="30d"
/>`}
      >
        <div className="p-6 md:p-10">
          <ChartCard />
        </div>
      </Example>

      <Example
        title="Bars"
        description="For counts per day, such as deployments. Bars cap at 24px wide and grow from one baseline."
        layout="full"
        surface="subtle"
        code={`<ChartCard
  type="bar"
  title="Deployments"
  description="Production and preview deployments per day."
  seriesLabel="Deployments"
  valueFormat="number"
  color={2}
  data={deployments}
/>`}
      >
        <div className="p-6 md:p-10">
          <ChartCard
            type="bar"
            title="Deployments"
            description="Production and preview deployments per day."
            seriesLabel="Deployments"
            valueFormat="number"
            color={2}
            defaultPeriod="30d"
            data={deployments}
          />
        </div>
      </Example>

      <Example
        title="When lower is better"
        description="Latency averages over the period instead of summing, and a drop reads as good news."
        layout="full"
        code={`<ChartCard
  title="p95 latency"
  seriesLabel="p95"
  valueFormat="ms"
  goodWhen="down"
  color={3}
  data={latency}
/>`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[48rem]:grid-cols-2 @min-[48rem]:p-10">
            <ChartCard
              title="p95 latency"
              description="Time to first byte at the edge."
              seriesLabel="p95"
              valueFormat="ms"
              goodWhen="down"
              color={3}
              defaultPeriod="7d"
              data={latency}
            />
            <ChartCard
              type="bar"
              title="Builds"
              description="Builds started per day."
              seriesLabel="Builds"
              valueFormat="number"
              color={4}
              periods={["30d"]}
              defaultPeriod="30d"
              data={deployments}
            />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Plot one measure per card. Two measures with different scales need two cards.",
          "Give every day a point, oldest first, and at least as many days as the longest period.",
          "Pick the series colour by meaning and keep it the same wherever that measure appears.",
        ]}
        dont={[
          "Don’t add a second y-axis.",
          "Don’t fill areas with gradients; the wash is a flat 10% of the series colour.",
          "Don’t colour the figures or labels with the series colour; text stays in text tokens.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "title",
            type: "string",
            default: '"Edge requests"',
            description: "Card title.",
          },
          {
            prop: "description",
            type: "string",
            description: "One line under the title.",
          },
          {
            prop: "type",
            type: '"area" | "bar"',
            default: '"area"',
            description: "Area for continuous measures, bar for counts.",
          },
          {
            prop: "data",
            type: "{ date: string; value: number; previous?: number }[]",
            description:
              "One point per day, oldest first. Defaults to 90 days of sample requests.",
          },
          {
            prop: "defaultPeriod",
            type: '"7d" | "30d" | "90d"',
            default: '"30d"',
            description: "Period selected on first render.",
          },
          {
            prop: "periods",
            type: "ChartPeriod[]",
            default: '["7d", "30d", "90d"]',
            description: "Periods in the switch. Pass one to hide it.",
          },
          {
            prop: "seriesLabel",
            type: "string",
            default: '"Requests"',
            description: "Series name in the tooltip and legend.",
          },
          {
            prop: "showComparison",
            type: "boolean",
            default: "true",
            description:
              "Draw the previous period as a dashed line. Area charts only.",
          },
          {
            prop: "valueFormat",
            type: '"compact" | "number" | "ms" | "percent"',
            default: '"compact"',
            description:
              "Formatting for the summary, axis and tooltip. ms and percent average over the period; the others sum.",
          },
          {
            prop: "color",
            type: "1 | 2 | 3 | 4",
            default: "1",
            description: "Chart token for the series.",
          },
          {
            prop: "goodWhen",
            type: '"up" | "down"',
            default: '"up"',
            description: "Which direction of change shows in success.",
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
