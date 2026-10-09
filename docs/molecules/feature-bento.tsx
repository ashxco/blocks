"use client"

import { ArchiveRestoreIcon, CableIcon, DatabaseIcon, GaugeIcon, GitBranchIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  AvatarStack,
  FeatureBento,
  LiveMetrics,
  MaskedSecrets,
  PreviewUrls,
  RegionMap,
  Sparkline,
  TrafficShift,
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
  title="Data that lives next to your code."
  description="Managed Postgres in the same region as your app, with backups and branching built in."
  features={[
    { title: "Postgres in one command", description: "lumen db create gives you a database and a DATABASE_URL in every environment.", icon: <DatabaseIcon />, wide: true, visual: <MaskedSecrets names={["DATABASE_URL", "DATABASE_URL_UNPOOLED"]} /> },
    { title: "Query metrics", description: "Slow queries and connection counts, live.", icon: <GaugeIcon />, tone: "dark", visual: <LiveMetrics metrics={[...]} /> },
    { title: "Point-in-time restore", description: "Roll back to any second in the last 7 days.", icon: <ArchiveRestoreIcon /> },
    { title: "Branch databases", description: "Each preview gets a copy of the schema and seed data.", icon: <GitBranchIcon />, tone: "tint", wide: true, visual: <PreviewUrls urls={[...]} /> },
    { title: "Connection pooling", description: "A pooler sits in front of every database.", icon: <CableIcon />, wide: true, visual: <TrafficShift versions={[...]} /> },
  ]}
/>`}
      >
        <FeatureBento
          title="Data that lives next to your code."
          description="Managed Postgres in the same region as your app, with backups and branching built in."
          features={[
            {
              title: "Postgres in one command",
              description: "lumen db create gives you a database and a DATABASE_URL in every environment.",
              icon: <DatabaseIcon />,
              wide: true,
              visual: <MaskedSecrets names={["DATABASE_URL", "DATABASE_URL_UNPOOLED"]} />,
            },
            {
              title: "Query metrics",
              description: "Slow queries and connection counts, live.",
              icon: <GaugeIcon />,
              tone: "dark",
              visual: (
                <LiveMetrics
                  values={[22, 25, 21, 28, 24, 30, 27, 26, 33, 29, 31, 35]}
                  metrics={[
                    { label: "p95", value: "4.1 ms" },
                    { label: "Conns", value: "38" },
                    { label: "Slow", value: "2" },
                  ]}
                />
              ),
            },
            {
              title: "Point-in-time restore",
              description: "Roll back to any second in the last seven days, without a support ticket.",
              icon: <ArchiveRestoreIcon />,
            },
            {
              title: "Branch databases",
              description: "Each preview URL gets its own copy of the schema and seed data, removed when the branch merges.",
              icon: <GitBranchIcon />,
              tone: "tint",
              wide: true,
              visual: (
                <PreviewUrls
                  urls={[
                    { url: "db-feat-billing.acme.dev" },
                    { url: "db-fix-auth.acme.dev" },
                    { url: "db.acme.dev", production: true },
                  ]}
                />
              ),
            },
            {
              title: "Connection pooling",
              description: "A pooler sits in front of every database, so serverless functions and long-running servers share connections safely.",
              icon: <CableIcon />,
              wide: true,
              visual: <TrafficShift versions={[{ sha: "pooled", share: 92 }, { sha: "direct", share: 8 }]} />,
            },
          ]}
        />
      </Example>

      <Example
        title="Tile visuals"
        layout="stack"
        description="The small live visuals are exported on their own. They are decorative and hidden from assistive technology, so the tile text must carry the meaning."
        code={`<PreviewUrls />
<Sparkline className="text-brand" />
<TrafficShift />
<MaskedSecrets />
<RegionMap />
<AvatarStack />
<LiveMetrics /> // on a dark panel`}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">PreviewUrls</p>
            <PreviewUrls />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">Sparkline</p>
            <Sparkline className="text-brand" />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">TrafficShift</p>
            <TrafficShift />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">MaskedSecrets</p>
            <MaskedSecrets />
          </div>
          <div className="grid content-start gap-3 rounded-(--card-radius) bg-brand-subtle p-5">
            <p className="text-label text-foreground">RegionMap</p>
            <RegionMap />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-label text-foreground">AvatarStack</p>
            <AvatarStack />
          </div>
          <div className="grid content-start gap-3 rounded-(--card-radius) bg-panel p-5 md:col-span-2">
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
          { prop: "title", type: "ReactNode | null", default: '"Everything included. Nothing bolted on."', description: "Section heading. Pass null to render the grid alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text beside the heading." },
          { prop: "features", type: "BentoFeature[]", default: "Six Lumen features", description: "Tiles, in reading order." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="BentoFeature"
        rows={[
          { prop: "title", type: "string", description: "Tile title." },
          { prop: "description", type: "string", description: "One sentence." },
          { prop: "icon", type: "ReactNode", description: "A lucide icon element, such as <GitBranchIcon />." },
          { prop: "tone", type: '"default" | "dark" | "tint"', default: '"default"', description: "Card, dark panel or brand-subtle surface." },
          { prop: "wide", type: "boolean", default: "false", description: "Span two columns from the two-column layout up." },
          { prop: "visual", type: "ReactNode", description: "Small visual pinned to the bottom of the tile." },
        ]}
      />
    </Examples>
  )
}
