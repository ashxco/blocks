"use client"

import { BellIcon, ChartColumnIcon, GaugeIcon, RepeatIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  AvatarStack,
  BarList,
  BoardPreview,
  FeatureBento,
  LinkChips,
  LiveMetrics,
  RuleCard,
  ShareBars,
  Sparkline,
} from "@/components/blocks/feature-bento"

export default function FeatureBentoDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Six tiles on a four-column grid: two wide tiles, one dark tile for emphasis and one tinted tile. Two columns in narrow slots, one on phones."
        code={`<FeatureBento />`}
      >
        <FeatureBento />
      </Example>

      <Example
        title="Custom tiles"
        layout="full"
        surface="subtle"
        description="Pass your own features. Icons are elements, visuals are any small component. Keep one dark tile at most."
        code={`<FeatureBento
  title="Reports that write themselves."
  description="Dashboards for workload, on-time delivery and cycle time, built from the work your team already tracks."
  features={[
    { title: "Workload at a glance", description: "See who has too much on before it slips.", icon: <UsersIcon />, wide: true, visual: <BarList /> },
    { title: "Delivery trends", description: "On-time delivery and cycle time, week by week.", icon: <GaugeIcon />, tone: "dark", visual: <LiveMetrics metrics={[...]} /> },
    { title: "Weekly summaries", description: "A digest to Slack every Monday morning.", icon: <BellIcon /> },
    { title: "Every chart, shareable", description: "Share a dashboard with the workspace or one team.", icon: <ChartColumnIcon />, tone: "tint", wide: true, visual: <LinkChips items={[...]} /> },
    { title: "Recurring reviews", description: "The next review appears when you finish the last.", icon: <RepeatIcon />, wide: true, visual: <RuleCard label="Recurring task" icon={<RepeatIcon />} when="Monthly review is done" then={["Create next month’s review", "Copy the checklist"]} runs="Next review due Nov 2" /> },
  ]}
/>`}
      >
        <FeatureBento
          title="Reports that write themselves."
          description="Dashboards for workload, on-time delivery and cycle time, built from the work your team already tracks."
          features={[
            {
              title: "Workload at a glance",
              description: "See who has too much on their plate before deadlines slip, and move tasks in one drag.",
              icon: <UsersIcon />,
              wide: true,
              visual: <BarList />,
            },
            {
              title: "Delivery trends",
              description: "On-time delivery and cycle time, week by week.",
              icon: <GaugeIcon />,
              tone: "dark",
              visual: (
                <LiveMetrics
                  values={[71, 74, 72, 78, 80, 79, 84, 86, 85, 88, 90, 92]}
                  metrics={[
                    { label: "On time", value: "92%" },
                    { label: "Cycle", value: "3.4 days" },
                    { label: "Late", value: "8%" },
                  ]}
                />
              ),
            },
            {
              title: "Weekly summaries",
              description: "A digest of what finished and what slipped lands in Slack every Monday morning.",
              icon: <BellIcon />,
            },
            {
              title: "Every chart, shareable",
              description: "Share a dashboard with the whole workspace or with one team. It updates as tasks move.",
              icon: <ChartColumnIcon />,
              tone: "tint",
              wide: true,
              visual: (
                <LinkChips
                  items={[
                    { label: "Workspace", active: true },
                    { label: "Design team", active: true },
                    { label: "Leadership" },
                  ]}
                />
              ),
            },
            {
              title: "Recurring reviews",
              description: "Set a monthly review task once. The next one appears when you finish the last, with the same checklist.",
              icon: <RepeatIcon />,
              wide: true,
              visual: (
                <RuleCard
                  label="Recurring task"
                  icon={<RepeatIcon />}
                  when="Monthly review is done"
                  then={["Create next month’s review", "Copy the checklist"]}
                  runs="Next review due Nov 2"
                />
              ),
            },
          ]}
        />
      </Example>

      <Example
        title="Tile visuals"
        layout="stack"
        description="The small live visuals are exported on their own. They are decorative and hidden from assistive technology, so the tile text must carry the meaning."
        code={`<BoardPreview />
<RuleCard />
<ShareBars />
<LinkChips />
<BarList />
<AvatarStack />
<Sparkline className="text-brand" />
<LiveMetrics /> // on a dark panel`}
      >
        <div className="grid gap-8 @3xl:grid-cols-2">
          <div className="grid content-start gap-3 @3xl:col-span-2">
            <p className="text-label text-foreground">BoardPreview</p>
            <BoardPreview />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">RuleCard</p>
            <RuleCard />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">ShareBars</p>
            <ShareBars />
          </div>
          <div className="grid content-start gap-3 rounded-(--card-radius) bg-tint-sky p-5">
            <p className="text-label text-foreground">LinkChips</p>
            <LinkChips />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">BarList</p>
            <BarList />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">AvatarStack</p>
            <AvatarStack />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">Sparkline</p>
            <Sparkline className="text-brand" />
          </div>
          <div className="grid content-start gap-3 rounded-(--card-radius) bg-panel p-5 @3xl:col-span-2">
            <p className="text-label text-panel-foreground">LiveMetrics</p>
            <LiveMetrics />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Give every tile a short title and one sentence; the visual only supports it.",
          "Use one dark tile and one tinted tile per grid to create rhythm.",
          "Order tiles so wide tiles alternate sides from row to row.",
        ]}
        dont={[
          "Don’t add dot grids, gradients or glows behind tiles; structure comes from hairlines.",
          "Don’t put a label or number above the section heading.",
          "Don’t use more than one dark tile, or the emphasis is lost.",
        ]}
      />

      <ApiTable
        title="FeatureBento"
        rows={[
          { prop: "title", type: "ReactNode | null", default: '"Everything in one place. Nothing to stitch together."', description: "Section heading. Pass null to render the grid alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "features", type: "BentoFeature[]", default: "Six Acme features", description: "Tiles, in reading order." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="BentoFeature"
        rows={[
          { prop: "title", type: "string", description: "Tile title." },
          { prop: "description", type: "string", description: "One sentence." },
          { prop: "icon", type: "ReactNode", description: "A lucide icon element, such as <KanbanIcon />." },
          { prop: "tone", type: '"default" | "dark" | "tint"', default: '"default"', description: "Card, dark panel or a flat sky tint." },
          { prop: "wide", type: "boolean", default: "false", description: "Span two columns from the two-column layout up." },
          { prop: "visual", type: "ReactNode", description: "Small visual pinned to the bottom of the tile." },
        ]}
      />
    </Examples>
  )
}
