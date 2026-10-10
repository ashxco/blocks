import { PlayIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ratios = [
  { ratio: 16 / 9, label: "16 : 9", use: "Video, hero media" },
  { ratio: 4 / 3, label: "4 : 3", use: "Screenshots" },
  { ratio: 1, label: "1 : 1", use: "Avatars, logos" },
]

const projects = [
  { name: "Website relaunch", view: "Board · 52 tasks", members: 5, updated: "12m ago", tint: "bg-tint-violet", layout: "board" },
  { name: "Q4 planning", view: "Timeline · 20 tasks", members: 8, updated: "1h ago", tint: "bg-tint-sky", layout: "timeline" },
  { name: "Brand refresh", view: "Calendar · 40 tasks", members: 4, updated: "3h ago", tint: "bg-tint-mint", layout: "calendar" },
] as const

/* The board the tour opens on. */
const tourBoard = [
  { column: "To do", tasks: ["Choose the new icon set", "Book the launch review"] },
  { column: "In progress", tasks: ["Draft the Q4 hiring plan", "Fix sign-in on older Android phones"] },
  { column: "Done", tasks: ["Write the homepage hero copy"] },
]

/**
 * A miniature of the project view, drawn with flat ink shapes and hairlines
 * on the project's tint, so it reads the same in both themes: a header with
 * view tabs, then a board, a timeline or a calendar.
 */
function ViewPreview({ layout }: { layout: (typeof projects)[number]["layout"] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between border-b border-foreground/10 px-1 pb-2">
        <span className="h-1.5 w-10 rounded-full bg-foreground" />
        <span className="flex gap-1.5">
          {(["board", "timeline", "calendar"] as const).map((view) => (
            <span
              key={view}
              className={cn("h-1.5 rounded-full", view === layout ? "w-6 bg-foreground" : "w-4 bg-foreground/25")}
            />
          ))}
        </span>
      </div>
      {layout === "board" ? (
        <div className="grid flex-1 grid-cols-3 gap-2 px-1">
          {[3, 2, 1].map((cards, column) => (
            <span key={column} className="grid content-start gap-1.5">
              <span className="h-1 w-1/2 rounded-full bg-foreground/40" />
              {Array.from({ length: cards }, (_, i) => (
                <span key={i} className="grid gap-1 rounded-xs border border-foreground/15 p-1.5">
                  <span className="h-1 w-5/6 rounded-full bg-foreground" />
                  <span className="h-1 w-1/2 rounded-full bg-foreground/25" />
                </span>
              ))}
            </span>
          ))}
        </div>
      ) : null}
      {layout === "timeline" ? (
        <div className="grid flex-1 content-start gap-2 px-1">
          {[
            { start: 0, width: 45, done: true },
            { start: 20, width: 40, done: true },
            { start: 38, width: 34, done: false },
            { start: 55, width: 30, done: false },
            { start: 70, width: 26, done: false },
          ].map((bar, i) => (
            <span key={i} className="relative h-2.5 border-b border-foreground/10">
              <span
                className={cn("absolute inset-y-0 rounded-full", bar.done ? "bg-foreground" : "bg-foreground/25")}
                style={{ left: `${bar.start}%`, width: `${bar.width}%` }}
              />
            </span>
          ))}
        </div>
      ) : null}
      {layout === "calendar" ? (
        <div className="grid flex-1 grid-cols-7 gap-px px-1">
          {Array.from({ length: 21 }, (_, day) => (
            <span key={day} className="grid content-start gap-0.5 rounded-xs border border-foreground/10 p-0.5">
              <span className="h-0.5 w-1.5 rounded-full bg-foreground/25" />
              {[3, 8, 9, 12, 17].includes(day) ? <span className="h-1 rounded-full bg-foreground" /> : null}
              {[8, 15].includes(day) ? <span className="h-1 rounded-full bg-foreground/25" /> : null}
            </span>
          ))}
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
  <img src="/board.png" alt="Board view of the Website relaunch project" />
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
        description="A 16:9 frame on the panel surface holds the poster until the video loads. Direct img and video children fill the frame and crop to cover it."
        code={`<AspectRatio ratio={16 / 9} className="rounded-(--panel-radius) bg-panel">
  <video src="/acme-tour.mp4" poster="/acme-tour.jpg" controls />
</AspectRatio>`}
      >
        <AspectRatio
          ratio={16 / 9}
          className="mx-auto w-full max-w-3xl rounded-(--panel-radius) border border-panel-border bg-panel text-panel-foreground"
        >
          {/* The poster: the board the tour opens on. Hidden on narrow frames, where the button takes the corner. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden grid-cols-3 gap-3 p-8 @md:grid">
            {tourBoard.map((column) => (
              <div key={column.column} className="grid content-start gap-2">
                <p className="text-caption font-semibold text-panel-muted">{column.column}</p>
                {column.tasks.map((task) => (
                  <p
                    key={task}
                    className="truncate rounded-sm border border-panel-border bg-panel-raised px-3 py-2 text-xs text-panel-foreground"
                  >
                    {task}
                  </p>
                ))}
              </div>
            ))}
          </div>
          {/* On a narrow frame the button moves to the top corner, clear of the caption. */}
          <div className="absolute inset-0 grid place-items-start p-6 @md:place-items-center @md:p-0">
            <Button size="icon-lg" variant="inverse" aria-label="Play the two-minute tour of Acme">
              <PlayIcon className="translate-x-px fill-current" />
            </Button>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <div className="grid gap-1">
              <p className="text-h4 text-panel-foreground">Acme in two minutes</p>
              <p className="text-sm text-panel-muted">Plan a project, assign the work and watch it move</p>
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
                <ViewPreview layout={p.layout} />
              </AspectRatio>
              <div className="grid gap-1 px-1 pb-1">
                <p className="text-title text-foreground">{p.name}</p>
                <p className="truncate text-caption text-muted-foreground">{p.view}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-caption text-copy">
                  <UsersIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  {p.members} members
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{p.updated}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Reserve space for every image and video with a ratio, so nothing shifts as it loads.",
          "Give the frame a flat placeholder fill: bg-subtle, a tint or bg-panel for video.",
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
