import { GitBranchIcon, PlayIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

const ratios = [
  { ratio: 16 / 9, label: "16 : 9", use: "Video, hero media" },
  { ratio: 4 / 3, label: "4 : 3", use: "Screenshots" },
  { ratio: 1, label: "1 : 1", use: "Avatars, logos" },
]

const projects = [
  { name: "lumen-web", url: "lumen-web.lumen.app", branch: "main", updated: "4m ago", tint: "bg-tint-violet", layout: "landing" },
  { name: "lumen-api", url: "api.lumen.app", branch: "main", updated: "1h ago", tint: "bg-tint-sky", layout: "dashboard" },
  { name: "docs", url: "docs.lumen.app", branch: "content/regions", updated: "Yesterday", tint: "bg-tint-mint", layout: "docs" },
] as const

const deployLines = [
  { text: "$ git push origin main", tone: "text-terminal-foreground" },
  { text: "Building lumen-web from 8f2c1a9", tone: "text-panel-muted" },
  { text: "Compiled 184 routes in 17.6s", tone: "text-panel-muted" },
  { text: "Ready at lumen-web.lumen.app", tone: "text-panel-success" },
]

/**
 * A miniature of the deployed site, drawn with flat ink shapes and hairlines
 * on the project's tint, so it reads the same in both themes: a nav bar, then
 * a landing hero, an app dashboard or a docs page.
 */
function SitePreview({ layout }: { layout: (typeof projects)[number]["layout"] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between border-b border-foreground/10 px-1 pb-2">
        <span className="h-1.5 w-8 rounded-full bg-foreground" />
        <span className="flex gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-foreground/25" />
          <span className="h-1.5 w-4 rounded-full bg-foreground/25" />
          <span className="h-1.5 w-6 rounded-full bg-foreground" />
        </span>
      </div>
      {layout === "landing" ? (
        <div className="grid flex-1 grid-cols-[1.2fr_1fr] items-center gap-3 px-1">
          <div className="grid gap-1.5">
            <span className="h-2.5 w-full rounded-full bg-foreground" />
            <span className="h-2.5 w-2/3 rounded-full bg-foreground" />
            <span className="mt-1 h-1.5 w-5/6 rounded-full bg-foreground/25" />
            <span className="mt-2 h-3.5 w-12 rounded-full bg-foreground" />
          </div>
          <span className="h-full max-h-16 rounded-sm bg-panel" />
        </div>
      ) : null}
      {layout === "dashboard" ? (
        <div className="grid flex-1 grid-cols-3 grid-rows-[auto_1fr] gap-2 px-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="grid gap-1 rounded-xs border border-foreground/15 p-1.5">
              <span className="h-1 w-2/3 rounded-full bg-foreground/25" />
              <span className="h-2 w-1/2 rounded-full bg-foreground" />
            </span>
          ))}
          <span className="col-span-3 flex items-end gap-1 rounded-xs border border-foreground/15 p-1.5">
            {[40, 65, 50, 80, 60, 90, 75].map((height, i) => (
              <span key={i} className="flex-1 rounded-t-xs bg-foreground/25" style={{ height: `${height}%` }} />
            ))}
          </span>
        </div>
      ) : null}
      {layout === "docs" ? (
        <div className="grid flex-1 grid-cols-[1fr_3fr] gap-3 px-1">
          <span className="grid content-start gap-1.5 border-r border-foreground/10 pr-2">
            <span className="h-1 w-full rounded-full bg-foreground" />
            <span className="h-1 w-3/4 rounded-full bg-foreground/25" />
            <span className="h-1 w-5/6 rounded-full bg-foreground/25" />
            <span className="h-1 w-2/3 rounded-full bg-foreground/25" />
          </span>
          <span className="grid content-start gap-1.5">
            <span className="h-2.5 w-1/2 rounded-full bg-foreground" />
            <span className="h-1.5 w-full rounded-full bg-foreground/25" />
            <span className="h-1.5 w-5/6 rounded-full bg-foreground/25" />
            <span className="mt-1 h-5 w-full rounded-xs bg-terminal" />
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default function AspectRatioDocs() {
  return (
    <Examples>
      <Example
        title="Ratios"
        description="Pass the ratio as width divided by height. The frame keeps its shape at any width, so the layout never jumps while media loads."
        code={`<AspectRatio ratio={16 / 9} className="rounded-(--card-radius) bg-subtle">
  <img src="/preview.png" alt="Dashboard of the lumen-web project" />
</AspectRatio>`}
      >
        <div className="grid w-full items-end gap-4 sm:grid-cols-3">
          {ratios.map((r) => (
            <div key={r.label} className="grid gap-3">
              <AspectRatio
                ratio={r.ratio}
                className="grid place-items-center rounded-(--card-radius) border border-border bg-subtle"
              >
                <span className="text-h4 text-foreground tabular-nums">{r.label}</span>
              </AspectRatio>
              <p className="text-caption text-muted-foreground">{r.use}</p>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Video"
        layout="stack"
        description="A 16:9 frame on the terminal surface holds the poster until the video loads. Direct img and video children fill the frame and crop to cover it."
        code={`<AspectRatio ratio={16 / 9} className="rounded-(--panel-radius) bg-terminal">
  <video src="/lumen-tour.mp4" poster="/lumen-tour.jpg" controls />
</AspectRatio>`}
      >
        <AspectRatio ratio={16 / 9} className="rounded-(--panel-radius) border border-border bg-terminal text-terminal-foreground">
          {/* The poster: the deploy the tour walks through. Hidden on narrow frames, where the button takes the corner. */}
          <ol aria-hidden="true" className="absolute top-0 left-0 hidden gap-1.5 p-8 font-mono text-code @md:grid">
            {deployLines.map((line) => (
              <li key={line.text} className={line.tone}>
                {line.text}
              </li>
            ))}
          </ol>
          {/* On a narrow frame the button moves to the top corner, clear of the caption. */}
          <div className="absolute inset-0 grid place-items-start p-6 @md:place-items-center @md:p-0">
            <Button size="icon-lg" variant="inverse" aria-label="Play the two-minute tour of Lumen">
              <PlayIcon className="translate-x-px fill-current" />
            </Button>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <div className="grid gap-1">
              <p className="text-h4 text-panel-foreground">Lumen in two minutes</p>
              <p className="text-sm text-panel-muted">From git push to a production URL</p>
            </div>
            <span className="font-mono text-xs text-panel-muted tabular-nums">2:04</span>
          </div>
        </AspectRatio>
      </Example>

      <Example
        title="Previews in cards"
        layout="stack"
        surface="subtle"
        description="Use the same ratio for every preview in a grid so the rows line up, and round the media one step tighter than its card."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.name}
              href="#projects"
              className="grid gap-4 rounded-(--card-radius) border border-border bg-card p-3 outline-none transition-colors duration-(--duration-fast) ease-standard hover:border-border-strong focus-visible:focus-ring"
            >
              <AspectRatio ratio={16 / 10} className={`rounded-md ${p.tint}`}>
                <SitePreview layout={p.layout} />
              </AspectRatio>
              <div className="grid gap-1 px-1 pb-1">
                <p className="text-title text-foreground">{p.name}</p>
                <p className="truncate text-caption text-muted-foreground">{p.url}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-caption text-copy">
                  <GitBranchIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  {p.branch}
                  <span className="text-muted-foreground">· {p.updated}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Reserve space for every image and video with a ratio, so nothing shifts as it loads.",
          "Give the frame a flat placeholder fill: bg-subtle, a tint or bg-terminal for video.",
          "Write alt text that says what the image shows, or alt=\"\" when it is decorative.",
        ]}
        dont={[
          "Don’t stretch media with object-fill; let it crop with object-cover.",
          "Don’t mix ratios in one grid of cards.",
          "Don’t add shadows or gradient overlays to make text readable; use a panel or put text below.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "ratio", type: "number", description: "Width divided by height, such as 16 / 9 or 1." },
          { prop: "className", type: "string", description: "Radius and placeholder fill, such as rounded-(--card-radius) bg-subtle." },
          { prop: "children", type: "ReactNode", description: "Direct img and video children fill the frame and are cropped to cover it." },
        ]}
      />
    </Examples>
  )
}
