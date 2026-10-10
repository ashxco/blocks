"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ChartCard, type ChartPoint } from "@/components/blocks/chart-card"

/**
 * Ninety days to October 9, 2026, today in the sample data. `previous` is
 * the same day of the period before, as a ratio of this one. Weekdays carry
 * the work; weekends dip by `weekendDip`.
 */
function series({
  seed,
  base,
  spread,
  drift,
  weekendDip = 1,
  previous = 1,
  decimals = 0,
}: {
  seed: number
  base: number
  spread: number
  drift: number
  weekendDip?: number
  previous?: number
  decimals?: number
}): ChartPoint[] {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  const round = (value: number) => Math.max(0, Number(value.toFixed(decimals)))
  const end = Date.UTC(2026, 9, 9)
  const day = 24 * 60 * 60 * 1000
  return Array.from({ length: 90 }, (_, index) => {
    const time = end - (89 - index) * day
    const weekday = new Date(time).getUTCDay()
    const dip = weekday === 0 || weekday === 6 ? weekendDip : 1
    const trend = (base + index * drift) * dip
    return {
      date: new Date(time).toISOString().slice(0, 10),
      value: round(trend + (random() - 0.5) * spread * dip),
      previous: round(trend * previous + (random() - 0.5) * spread * dip),
    }
  })
}

/** New tasks per day: a little more than get done, so the backlog grows slowly. */
const created = series({ seed: 4242, base: 54, spread: 18, drift: 0.08, weekendDip: 0.25, previous: 0.92 })
/** Done tasks moved back to an open status. */
const reopened = series({ seed: 9001, base: 4, spread: 4, drift: -0.012, weekendDip: 0.3 })
/** From start to done, averaged per day: about 3.4 days lately, 4.0 a month earlier. */
const cycleTime = series({ seed: 777, base: 3.85, spread: 0.9, drift: -0.006, previous: 1.17, decimals: 1 })

export default function ChartCardDocs() {
  return (
    <Examples>
      <Example
        title="Area"
        description="For a measure that moves day to day, such as tasks completed. The dashed line is the previous period, so the change has a reference."
        layout="full"
        code={`<ChartCard
  title="Tasks completed"
  description="Tasks marked done each day, across every project."
  seriesLabel="Tasks"
  valueFormat="number"
  data={tasksCompleted}      // one point per day: { date, value, previous }
  defaultPeriod="30d"
/>`}
      >
        <div className="p-6 @prose:p-10">
          <ChartCard />
        </div>
      </Example>

      <Example
        title="Bars"
        description="For counts per day, such as tasks created. Bars cap at 24px wide and grow from one baseline. A single series next to the page’s main chart draws in neutral grey (color “ink”, the muted-foreground colour), so violet stays on the one chart that matters most."
        layout="full"
        surface="subtle"
        code={`<ChartCard
  type="bar"
  title="Tasks created"
  description="New tasks added each day, across every project."
  seriesLabel="Tasks"
  valueFormat="number"
  color="ink"
  data={created}
/>`}
      >
        <div className="p-6 @prose:p-10">
          <ChartCard
            type="bar"
            title="Tasks created"
            description="New tasks added each day, across every project."
            seriesLabel="Tasks"
            valueFormat="number"
            color="ink"
            defaultPeriod="30d"
            data={created}
          />
        </div>
      </Example>

      <Example
        title="When lower is better"
        description="Cycle time averages over the period instead of summing, and a drop reads as good news. The axis counts in round steps from zero, with the unit on each label."
        layout="full"
        code={`<ChartCard
  title="Average cycle time"
  seriesLabel="Cycle time"
  valueFormat="days"
  goodWhen="down"
  data={cycleTime}
/>
<ChartCard type="bar" title="Tasks reopened" seriesLabel="Reopened" valueFormat="number" color="ink" goodWhen="down" periods={["30d"]} data={reopened} />`}
      >
        <div className="@container">
          <div className="grid gap-4 p-6 @min-[48rem]:grid-cols-2 @min-[48rem]:p-10">
            <ChartCard
              title="Average cycle time"
              description="Days from a task’s start to done."
              seriesLabel="Cycle time"
              valueFormat="days"
              goodWhen="down"
              defaultPeriod="30d"
              data={cycleTime}
            />
            <ChartCard
              type="bar"
              title="Tasks reopened"
              description="Done tasks moved back to an open status."
              seriesLabel="Reopened"
              valueFormat="number"
              color="ink"
              goodWhen="down"
              periods={["30d"]}
              defaultPeriod="30d"
              data={reopened}
            />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Plot one measure per card. Two measures with different scales need two cards.",
          "Give every day a point, oldest first, and at least as many days as the longest period.",
          "Keep violet (chart-1) for the page’s main chart and draw other single series in neutral grey (color “ink”). Save chart-2 to chart-4 for charts with several series.",
        ]}
        dont={[
          "Don’t add a second y-axis.",
          "Don’t fill areas with gradients; the wash is a flat 6% of the series colour.",
          "Don’t colour the figures or labels with the series colour; text stays in text tokens.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "title",
            type: "string",
            default: '"Tasks completed"',
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
              "One point per day, oldest first. Defaults to 90 days of tasks completed in Acme Inc.",
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
            default: '"Tasks"',
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
            type: '"compact" | "number" | "days" | "percent"',
            default: '"number"',
            description:
              "Formatting for the summary, axis and tooltip. days and percent average over the period; the others sum.",
          },
          {
            prop: "color",
            type: '1 | 2 | 3 | 4 | "ink"',
            default: "1",
            description:
              "Chart token for the series, or ink: the neutral muted-foreground grey, for a quiet single series.",
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
