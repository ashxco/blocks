"use client"

import { GitCommitHorizontalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const releases = [
  { tag: "v4.12.0", note: "Postgres branching for preview deploys", date: "Oct 8" },
  { tag: "v4.11.2", note: "Fix redirect loop on apex domains", date: "Oct 6" },
  { tag: "v4.11.1", note: "Faster cold starts in Frankfurt", date: "Oct 3" },
  { tag: "v4.11.0", note: "Build cache shared across branches", date: "Sep 30" },
  { tag: "v4.10.4", note: "Log search by request ID", date: "Sep 26" },
  { tag: "v4.10.3", note: "Team audit log export to CSV", date: "Sep 23" },
  { tag: "v4.10.2", note: "Deploy hooks accept a branch name", date: "Sep 19" },
  { tag: "v4.10.1", note: "Show build minutes per project", date: "Sep 16" },
  { tag: "v4.10.0", note: "Regions in São Paulo and Mumbai", date: "Sep 12" },
  { tag: "v4.9.6", note: "Rotate deploy tokens from the CLI", date: "Sep 9" },
  { tag: "v4.9.5", note: "Preview URLs for monorepo packages", date: "Sep 5" },
]

const environments = [
  { name: "Production", url: "lumen.app", status: "Ready" },
  { name: "Staging", url: "staging.lumen.app", status: "Ready" },
  { name: "feat/preview-comments", url: "preview-comments.lumen.app", status: "Building" },
  { name: "chore/node-22", url: "node-22.lumen.app", status: "Failed" },
  { name: "content/regions", url: "regions.lumen.app", status: "Ready" },
  { name: "fix/apex-redirect", url: "apex-redirect.lumen.app", status: "Ready" },
]

const statusDot: Record<string, string> = {
  Ready: "bg-success",
  Building: "bg-info",
  Failed: "bg-destructive",
}

const log = [
  ["00:00.12", "Cloning github.com/lumen/lumen-web (branch main, commit a41c9e2)"],
  ["00:01.48", "Restored build cache from deployment dpl_7d1q (412 MB)"],
  ["00:01.90", "Installing dependencies with pnpm 9.12"],
  ["00:08.33", "Packages: +1,284 resolved, 0 downloaded, 1,284 reused"],
  ["00:08.71", "Running build command: pnpm build"],
  ["00:09.02", "▲ Next.js 16.3.6"],
  ["00:09.40", "Creating an optimized production build"],
  ["00:21.66", "Compiled successfully in 12.3s"],
  ["00:22.04", "Collecting page data"],
  ["00:24.91", "Generating static pages (48/48)"],
  ["00:27.15", "Finalizing page optimization"],
  ["00:27.80", "Uploading build output (36.2 MB)"],
  ["00:31.07", "Deploying to 3 regions"],
  ["00:46.52", "Assigned lumen-web.lumen.app"],
  ["00:47.95", "Deployment ready in 48s"],
]

export default function ScrollAreaDocs() {
  return (
    <Examples>
      <Example
        title="Vertical"
        description="Give the area a height and let the content scroll. The scrollbar stays out of the way until you hover or scroll."
        code={`<ScrollArea className="h-80 w-full max-w-sm rounded-(--card-radius) border">
  <ul className="divide-y px-5">
    {releases.map((r) => (
      <li key={r.tag} className="py-3">…</li>
    ))}
  </ul>
</ScrollArea>`}
      >
        <ScrollArea className="h-80 w-full max-w-sm rounded-(--card-radius) border border-border bg-card">
          <div className="sticky top-0 z-10 border-b border-border bg-card px-5 py-3.5">
            <p className="text-title text-foreground">Releases</p>
          </div>
          <ul className="divide-y divide-border px-5">
            {releases.map((r) => (
              <li key={r.tag} className="flex items-start gap-3 py-3">
                <GitCommitHorizontalIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="text-sm font-semibold text-foreground">{r.note}</p>
                  <p className="font-mono text-xs text-muted-foreground">{r.tag}</p>
                </div>
                <span className="shrink-0 text-caption text-muted-foreground tabular-nums">{r.date}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Example>

      <Example
        title="Horizontal"
        layout="stack"
        description="Add a horizontal ScrollBar for content that runs sideways, such as a row of cards."
        code={`<ScrollArea className="w-full whitespace-nowrap">
  <div className="flex w-max gap-3 pb-4">…</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>`}
      >
        <ScrollArea className="w-full">
          <div className="flex w-max gap-3 pb-4">
            {environments.map((env) => (
              <div
                key={env.name}
                className="grid w-64 grid-cols-1 gap-3 rounded-(--card-radius) border border-border bg-card p-4"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-semibold text-foreground">{env.name}</p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-caption text-copy">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${statusDot[env.status]}`} />
                    {env.status}
                  </span>
                </div>
                <p className="truncate font-mono text-xs text-muted-foreground">{env.url}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Example>

      <Example
        title="Build log"
        layout="stack"
        description="In a terminal window the same quiet scrollbars keep long output readable: lines stay whole and scroll sideways, with a second ScrollBar for that axis. The viewport takes keyboard focus, so arrow keys scroll it."
      >
        <div className="overflow-hidden rounded-(--card-radius) border border-border bg-terminal">
          <div className="flex items-center justify-between gap-4 border-b border-panel-border px-5 py-3">
            <p className="text-label text-panel-foreground">Build log</p>
            <p className="font-mono text-xs text-panel-muted">dpl_8f2k · 48s</p>
          </div>
          <ScrollArea className="h-64" aria-label="Build log for deployment dpl_8f2k">
            {/* Lines never wrap, as in a terminal: long ones scroll sideways. */}
            <ol className="grid min-w-max gap-1 px-5 py-4 font-mono text-code text-terminal-foreground">
              {log.map(([time, line]) => (
                <li key={time} className="grid grid-cols-[5.5rem_auto] gap-4 whitespace-pre">
                  <span className="text-panel-muted tabular-nums">{time}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Example>

      <Guidelines
        do={[
          "Give the scroll area a fixed height or max height; it does not size itself.",
          "Keep headers outside the scroll area, or make them sticky inside it.",
          "Label scrolling regions that hold meaningful content with aria-label.",
        ]}
        dont={[
          "Don’t nest scroll areas that scroll in the same direction.",
          "Don’t fade the edges of a scroll area with gradients; use a hairline header or footer instead.",
          "Don’t put a whole page in a scroll area; let the page scroll.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "className", type: "string", description: "ScrollArea: size, radius and border. Set a height such as h-80." },
          { prop: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "ScrollBar: add a horizontal one for sideways content. A vertical bar is included." },
          { prop: "children", type: "ReactNode", description: "Content to scroll. It renders inside the viewport." },
        ]}
      />
    </Examples>
  )
}
