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
  { name: "lumen-web", url: "lumen-web.lumen.app", branch: "main", updated: "4m ago", tint: "bg-tint-violet" },
  { name: "lumen-api", url: "api.lumen.app", branch: "main", updated: "1h ago", tint: "bg-tint-sky" },
  { name: "docs", url: "docs.lumen.app", branch: "content/regions", updated: "Yesterday", tint: "bg-tint-mint" },
]

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
                className="grid place-items-center rounded-(--card-radius) border border-dashed border-border-strong bg-subtle"
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
                <div className="absolute inset-x-4 top-4 grid gap-2">
                  <span className="h-2 w-1/3 rounded-full bg-foreground/15" />
                  <span className="h-2 w-2/3 rounded-full bg-foreground/10" />
                </div>
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
