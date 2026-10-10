import * as React from "react"
import { ZapIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { personTone } from "@/components/blocks/members-list/people"

/* Small live visuals for feature tiles. Each one is decorative: the tile's
   title and description carry the meaning, so visuals are hidden from
   assistive technology. */

/* -------------------------------------------------------------------------- */
/* Board preview                                                              */
/* -------------------------------------------------------------------------- */

export interface BoardPreviewColumn {
  title: string
  /** Card titles, with the person who owns each one. */
  cards: { title: string; owner: string }[]
}

const defaultBoard: BoardPreviewColumn[] = [
  {
    title: "To do",
    cards: [
      { title: "Pricing page copy", owner: "Priya Raman" },
      { title: "Footer links", owner: "Jordan Lee" },
    ],
  },
  {
    title: "In progress",
    cards: [
      { title: "Homepage copy", owner: "Priya Raman" },
      { title: "Visual design", owner: "Sofia Alvarez" },
    ],
  },
  {
    title: "Done",
    cards: [
      { title: "Sitemap", owner: "Maya Patel" },
      { title: "Interviews", owner: "Sam Okafor" },
    ],
  },
]

const ownerTints = ["bg-tint-violet", "bg-tint-mint", "bg-tint-sand", "bg-tint-sky", "bg-tint-rose"]

function ownerTint(name: string) {
  let sum = 0
  for (const char of name) sum += char.charCodeAt(0)
  return ownerTints[sum % ownerTints.length]
}

/**
 * A miniature board: three columns of task cards, each with its owner as a
 * tinted dot. In a narrow slot the dots step aside and titles wrap.
 */
export function BoardPreview({ columns = defaultBoard, className }: { columns?: BoardPreviewColumn[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("@container/board", className)}>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))` }}>
        {columns.map((column) => (
          <div key={column.title} className="grid content-start gap-1.5 rounded-md bg-subtle p-1.5">
            <p className="truncate px-1.5 pt-0.5 pb-1 text-caption font-semibold text-muted-foreground">{column.title}</p>
            {column.cards.map((card) => (
              <div
                key={card.title}
                className="flex min-w-0 items-center justify-between gap-2 rounded-sm border bg-background py-2 pr-2 pl-2.5"
              >
                <span className="min-w-0 text-caption font-semibold text-foreground @min-[32rem]/board:truncate">
                  {card.title}
                </span>
                {/* The owner as a small tinted dot: the same person keeps the same tint. */}
                <span className={cn("hidden size-4 shrink-0 rounded-full @min-[32rem]/board:block", ownerTint(card.owner))} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sparkline                                                                  */
/* -------------------------------------------------------------------------- */

const defaultSeries = [38, 42, 40, 47, 44, 52, 49, 46, 55, 51, 58, 54, 61, 57, 64, 60, 68, 63, 71, 74]

/**
 * Inline SVG sparkline drawn in currentColor, so it follows the text colour of
 * its surface. The area under the line uses the same colour at low opacity.
 */
export function Sparkline({
  values = defaultSeries,
  className,
}: {
  values?: number[]
  className?: string
}) {
  const w = 200
  const h = 60
  const pad = 4
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return [x, y] as const
  })
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
  const area = `${line} L${w} ${h} L0 ${h} Z`
  const [lastX, lastY] = points[points.length - 1]

  // The line stretches to any width, so the end point is a positioned dot
  // rather than an SVG circle, which would stretch into an ellipse.
  return (
    <div aria-hidden="true" className={cn("relative h-16 w-full", className)}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block size-full overflow-visible">
        <path d={area} fill="currentColor" fillOpacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        style={{ left: `${(lastX / w) * 100}%`, top: `${(lastY / h) * 100}%` }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Live metrics (for a dark tile)                                             */
/* -------------------------------------------------------------------------- */

export interface LiveMetric {
  label: string
  value: string
}

const defaultMetrics: LiveMetric[] = [
  { label: "On time", value: "92%" },
  { label: "Cycle time", value: "3.4 days" },
  { label: "Done", value: "1,284" },
]

/** Sparkline with three readouts. Designed for a dark panel tile. */
export function LiveMetrics({
  values,
  metrics = defaultMetrics,
  className,
}: {
  values?: number[]
  metrics?: LiveMetric[]
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn("grid gap-4", className)}>
      <Sparkline values={values} className="text-panel-foreground" />
      <dl className="grid grid-cols-3 gap-3 border-t border-panel-border pt-3">
        {metrics.map((m) => (
          <div key={m.label} className="grid min-w-0 gap-0.5">
            <dt className="truncate text-caption text-panel-muted">{m.label}</dt>
            <dd className="text-caption font-semibold text-panel-foreground tabular">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Rule card                                                                  */
/* -------------------------------------------------------------------------- */

/** One automation rule: what starts it, what it does and how often it ran. */
export function RuleCard({
  label = "Automation",
  icon = <ZapIcon />,
  when = "A task moves to Done",
  then = ["Notify the owner", "Post in #website-relaunch"],
  runs = "12 runs in Website relaunch",
  className,
}: {
  /** Name in the header, such as "Automation" or "Recurring task". */
  label?: string
  /** A lucide icon element beside the label. */
  icon?: React.ReactNode
  /** The trigger. */
  when?: string
  /** The actions, in order. */
  then?: string[]
  /** Footer line. Pass an empty string to hide it. */
  runs?: string
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn("rounded-md border bg-subtle", className)}>
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground [&_svg]:size-3.5">
          {icon}
          {label}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" />
          On
        </span>
      </div>
      <dl className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 px-3 py-2.5 text-caption">
        <dt className="text-muted-foreground">When</dt>
        <dd className="font-semibold text-foreground">{when}</dd>
        {then.map((action, i) => (
          <React.Fragment key={action}>
            <dt className="text-muted-foreground">{i === 0 ? "Then" : "And"}</dt>
            <dd className="font-semibold text-foreground">{action}</dd>
          </React.Fragment>
        ))}
      </dl>
      {runs ? <p className="border-t px-3 py-2 text-caption text-muted-foreground tabular">{runs}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Share bars                                                                 */
/* -------------------------------------------------------------------------- */

export interface ShareBar {
  label: string
  /** Share from 0 to 100. */
  share: number
}

const defaultShares: ShareBar[] = [
  { label: "Urgent", share: 6 },
  { label: "High", share: 21 },
  { label: "Medium", share: 48 },
  { label: "Low", share: 25 },
]

/** Labelled bars with the share each one takes, such as open tasks by priority. */
export function ShareBars({ items = defaultShares, className }: { items?: ShareBar[]; className?: string }) {
  return (
    <ul aria-hidden="true" className={cn("grid gap-2.5", className)}>
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[4rem_1fr_2.75rem] items-center gap-3 text-caption">
          <span className="truncate font-semibold text-foreground">{item.label}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full rounded-full bg-foreground" style={{ width: `${item.share}%` }} />
          </span>
          <span className="text-right text-muted-foreground tabular">{item.share}%</span>
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/* Bar list                                                                   */
/* -------------------------------------------------------------------------- */

export interface BarListItem {
  label: string
  /** Second column, shown when the list is wide enough, such as a team. */
  detail?: string
  value: number
  /** Printed after the value, e.g. "tasks". */
  unit?: string
}

const defaultWorkload: BarListItem[] = [
  { label: "Jordan Lee", detail: "Engineering", value: 18, unit: "tasks" },
  { label: "Priya Raman", detail: "Marketing", value: 14, unit: "tasks" },
  { label: "Maya Patel", detail: "Product", value: 12, unit: "tasks" },
  { label: "Sofia Alvarez", detail: "Design", value: 9, unit: "tasks" },
]

/**
 * A short ranked list, each value as a thin ink bar, such as open tasks per
 * person. Same rhythm as ShareBars.
 */
export function BarList({ items = defaultWorkload, className }: { items?: BarListItem[]; className?: string }) {
  const largest = Math.max(1, ...items.map((item) => item.value))
  return (
    <div aria-hidden="true" className={cn("@container/bars", className)}>
      <ul className="grid gap-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="grid grid-cols-[6.5rem_1fr_3.75rem] items-center gap-3 text-caption @min-[26rem]/bars:grid-cols-[7rem_5.5rem_1fr_3.75rem]"
          >
            <span className="truncate font-semibold text-foreground">{item.label}</span>
            <span className="hidden truncate text-muted-foreground @min-[26rem]/bars:block">{item.detail}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <span className="block h-full rounded-full bg-foreground" style={{ width: `${(item.value / largest) * 100}%` }} />
            </span>
            <span className="text-right text-muted-foreground tabular">
              {item.value}
              {item.unit ? ` ${item.unit}` : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Link chips                                                                 */
/* -------------------------------------------------------------------------- */

export interface LinkChip {
  label: string
  /** Marks the chip as switched on, with a green dot. */
  active?: boolean
}

const defaultChips: LinkChip[] = [
  { label: "Slack", active: true },
  { label: "Google Drive", active: true },
  { label: "GitHub", active: true },
  { label: "Figma" },
  { label: "Zoom" },
  { label: "HubSpot" },
]

/** A wrapping row of pill chips, such as connected apps. Active chips get a green dot. */
export function LinkChips({ items = defaultChips, className }: { items?: LinkChip[]; className?: string }) {
  return (
    <ul aria-hidden="true" className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item.label}
          className="inline-flex h-8 items-center gap-2 rounded-full border bg-background px-3 text-caption font-semibold text-foreground"
        >
          <span
            className={cn(
              "size-2 rounded-full",
              item.active ? "bg-success" : "border border-muted-foreground/50"
            )}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/* Avatar stack                                                               */
/* -------------------------------------------------------------------------- */

export interface StackPerson {
  initials: string
  name: string
  tint?: "violet" | "mint" | "sand" | "sky" | "rose"
}

const tintClass: Record<NonNullable<StackPerson["tint"]>, string> = {
  violet: "bg-tint-violet",
  mint: "bg-tint-mint",
  sand: "bg-tint-sand",
  sky: "bg-tint-sky",
  rose: "bg-tint-rose",
}

/** Each teammate keeps the tint the app templates give them. */
const defaultPeople: StackPerson[] = [
  { initials: "HK", name: "Hana Kim", tint: personTone("Hana Kim") },
  { initials: "DB", name: "Daniel Brooks", tint: personTone("Daniel Brooks") },
  { initials: "MP", name: "Maya Patel", tint: personTone("Maya Patel") },
  { initials: "JL", name: "Jordan Lee", tint: personTone("Jordan Lee") },
]

export function AvatarStack({
  people = defaultPeople,
  more = 14,
  className,
}: {
  people?: StackPerson[]
  /** Count shown after the faces. 0 hides it. */
  more?: number
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn("flex items-center", className)}>
      {people.map((p, i) => (
        <span key={p.name} className={i === 0 ? "rounded-full border-2 border-card" : "-ml-2.5 rounded-full border-2 border-card"}>
          <Avatar className="size-(--avatar-size-md) after:hidden">
            <AvatarFallback className={cn("font-bold text-foreground", tintClass[p.tint ?? "violet"])}>
              {p.initials}
            </AvatarFallback>
          </Avatar>
        </span>
      ))}
      {more > 0 ? (
        <span className="-ml-2.5 rounded-full border-2 border-card">
          <span className="grid size-(--avatar-size-md) place-items-center rounded-full bg-secondary text-caption font-semibold text-secondary-foreground tabular">
            +{more}
          </span>
        </span>
      ) : null}
    </div>
  )
}
