import { EllipsisIcon } from "lucide-react"

import { Code } from "./layout"

/* The Shape page's depth without shadows: a scene, then the four tools it is made of. */

const layers: { name: string; body: string; tokens: string[] }[] = [
  {
    name: "Hairlines",
    body: "A 1px border defines every edge: cards, inputs, tables and menus.",
    tokens: ["border", "border-border"],
  },
  {
    name: "Surfaces",
    body: "Tinted bands and fills separate regions without lifting them off the page.",
    tokens: ["bg-subtle", "bg-muted", "bg-card"],
  },
  {
    name: "Panels",
    body: "Dark panels carry emphasis. Inside them, raised tiles step one shade lighter.",
    tokens: ["bg-panel", "bg-panel-raised"],
  },
  {
    name: "Overlays",
    body: "Menus and popovers sit on bg-popover with the popover edge; dialogs keep the plain hairline. Backdrops dim with the overlay colour and blur the page behind.",
    tokens: [
      "bg-popover",
      "border-popover-border",
      "bg-overlay",
      "backdrop-blur-glass",
    ],
  },
]

const tasks: { title: string; owner: string; status: string }[] = [
  { title: "Review homepage copy", owner: "Maya Patel", status: "In review" },
  { title: "Final hero images", owner: "Sofia Alvarez", status: "In progress" },
  { title: "Redirect old blog links", owner: "Jordan Lee", status: "To do" },
  { title: "Write launch email", owner: "Priya Raman", status: "To do" },
]

/*
 * The open menu. Phones get a compact two-item menu that covers the first
 * row; from @prose the full menu covers two.
 */
const menuItems: { label: string; wide?: boolean }[] = [
  { label: "Edit task" },
  { label: "Move to another project", wide: true },
  { label: "Archive" },
]

/* Status labels the open menu sits over: hidden, so they do not peek past its corner. */
const coveredStatus = ["invisible", "@prose:invisible"]

/* Tasks completed per day, Monday to Sunday. Today is highlighted. */
const week = [62, 78, 54, 91, 70, 38, 84]

function DepthScene() {
  return (
    /* Muted, so the card on it stands clear in both modes. */
    <div
      aria-hidden
      className="grid gap-6 rounded-(--panel-radius) border bg-muted p-(--panel-padding-sm) @narrow:grid-cols-2"
    >
      {/* Card with an open menu on top of it */}
      <div className="relative grid content-start gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-title text-foreground">Website relaunch</p>
            <p className="text-caption text-muted-foreground">
              4 tasks due this week
            </p>
          </div>
          <span className="grid size-(--button-height-sm) shrink-0 place-items-center rounded-(--button-radius) bg-accent text-foreground">
            <EllipsisIcon className="size-4" />
          </span>
        </div>
        <ul className="grid border-t">
          {tasks.map((task, i) => (
            <li
              key={task.title}
              className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0 last:pb-0"
            >
              <span className="grid min-w-0">
                <span className="truncate text-label text-foreground">
                  {task.title}
                </span>
                <span className="text-caption text-muted-foreground">
                  {task.owner}
                </span>
              </span>
              <span
                className={`shrink-0 text-caption text-muted-foreground ${coveredStatus[i] ?? ""}`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="absolute top-[calc(var(--card-padding)+var(--button-height-sm)+--spacing(2))] right-(--card-padding) grid w-max rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding) @prose:min-w-(--menu-min-width)">
          {menuItems.map((item, i) => (
            <span
              key={item.label}
              className={
                (item.wide ? "hidden @prose:flex " : "flex ") +
                (i === 0
                  ? "h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) bg-accent px-3 text-label whitespace-nowrap text-accent-foreground"
                  : "h-(--overlay-item-height) items-center rounded-(--overlay-item-radius) px-3 text-label whitespace-nowrap text-popover-foreground")
              }
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Dark panel with raised tiles */}
      <div className="grid content-start gap-6 rounded-(--card-radius) bg-panel p-(--card-padding) text-panel-foreground">
        <div className="grid gap-1">
          <p className="text-title text-panel-foreground">
            Tasks completed this week
          </p>
          <p className="text-caption text-panel-muted">
            Across 24 active projects
          </p>
        </div>
        <div className="grid h-24 grid-cols-7 items-end gap-2">
          {week.map((value, i) => (
            <span
              key={i}
              className={
                i === week.length - 1
                  ? "rounded-xs bg-panel-brand"
                  : "rounded-xs bg-panel-raised"
              }
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">286</span>
            <span className="text-caption text-panel-muted">Completed</span>
          </div>
          <div className="grid gap-1 rounded-lg border border-panel-border bg-panel-raised p-4">
            <span className="text-h3 text-panel-foreground tabular">92%</span>
            <span className="text-caption text-panel-muted">On time</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Depth() {
  return (
    <div className="grid gap-10">
      <DepthScene />
      <ul className="grid gap-x-8 gap-y-8 @prose:grid-cols-2 @narrow:grid-cols-4">
        {layers.map((layer) => (
          <li
            key={layer.name}
            className="grid content-start gap-2 border-t pt-5"
          >
            <h3 className="text-title text-foreground">{layer.name}</h3>
            <p className="text-caption text-copy">{layer.body}</p>
            <p className="flex flex-wrap gap-x-3 gap-y-1">
              {layer.tokens.map((t) => (
                <Code key={t} className="text-muted-foreground">
                  {t}
                </Code>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
