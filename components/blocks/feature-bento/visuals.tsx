import * as React from "react"
import { GitBranchIcon, GlobeIcon, LockIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

/* Small live visuals for feature tiles. Each one is decorative: the tile's
   title and description carry the meaning, so visuals are hidden from
   assistive technology. */

/* -------------------------------------------------------------------------- */
/* Preview URL chips                                                          */
/* -------------------------------------------------------------------------- */

export interface PreviewUrl {
  url: string
  production?: boolean
}

const defaultUrls: PreviewUrl[] = [
  { url: "feat-billing.acme.dev" },
  { url: "fix-auth.acme.dev" },
  { url: "web.acme.dev", production: true },
]

export function PreviewUrls({ urls = defaultUrls, className }: { urls?: PreviewUrl[]; className?: string }) {
  return (
    <ul aria-hidden="true" className={cn("flex flex-wrap gap-2", className)}>
      {urls.map((u) => (
        <li
          key={u.url}
          className="inline-flex h-8 items-center gap-2 rounded-full border bg-background px-3 font-mono text-caption text-foreground"
        >
          {u.production ? (
            <GlobeIcon className="size-3.5 text-success" />
          ) : (
            <GitBranchIcon className="size-3.5 text-muted-foreground" />
          )}
          {u.url}
        </li>
      ))}
    </ul>
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

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("block h-16 w-full overflow-visible", className)}
    >
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
      <circle cx={lastX} cy={lastY} r={3.5} fill="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
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
  { label: "p95", value: "112 ms" },
  { label: "CPU", value: "38%" },
  { label: "Memory", value: "612 MB" },
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
          <div key={m.label} className="grid gap-0.5">
            <dt className="text-caption text-panel-muted">{m.label}</dt>
            <dd className="font-mono text-caption font-medium text-panel-foreground tabular">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Traffic shift                                                              */
/* -------------------------------------------------------------------------- */

export interface TrafficVersion {
  sha: string
  share: number
}

const defaultVersions: TrafficVersion[] = [
  { sha: "a41c9e2", share: 100 },
  { sha: "7f02b1d", share: 0 },
]

/** Two versions side by side and the share of traffic each one takes. */
export function TrafficShift({ versions = defaultVersions, className }: { versions?: TrafficVersion[]; className?: string }) {
  return (
    <ul aria-hidden="true" className={cn("grid gap-2.5", className)}>
      {versions.map((v, i) => (
        <li key={v.sha} className="grid grid-cols-[4.5rem_1fr_2.75rem] items-center gap-3 font-mono text-caption">
          <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{v.sha}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full rounded-full bg-foreground" style={{ width: `${v.share}%` }} />
          </span>
          <span className={i === 0 ? "text-right text-foreground tabular" : "text-right text-muted-foreground tabular"}>
            {v.share}%
          </span>
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/* Masked secrets                                                             */
/* -------------------------------------------------------------------------- */

const defaultSecrets = ["DATABASE_URL", "STRIPE_SECRET_KEY", "RESEND_API_KEY"]

export function MaskedSecrets({
  names = defaultSecrets,
  environment = "production",
  className,
}: {
  names?: string[]
  environment?: string
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn("rounded-md border bg-subtle", className)}>
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <LockIcon className="size-3.5" />
          Encrypted
        </span>
        <span className="font-mono">{environment}</span>
      </div>
      <ul className="grid gap-1.5 px-3 py-2.5 font-mono text-caption">
        {names.map((n) => (
          <li key={n} className="flex items-center justify-between gap-3">
            <span className="truncate text-foreground">{n}</span>
            <span className="shrink-0 text-muted-foreground">••••••</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Region map                                                                 */
/* -------------------------------------------------------------------------- */

export interface Region {
  code: string
  /** Horizontal position, 0 to 100. */
  x: number
  /** Vertical position, 0 to 100. */
  y: number
  /** Busiest regions get a ring and a label. */
  hot?: boolean
}

const defaultRegions: Region[] = [
  { code: "sea", x: 11, y: 30 },
  { code: "sfo", x: 12, y: 42 },
  { code: "dfw", x: 20, y: 48 },
  { code: "ord", x: 23, y: 36 },
  { code: "iad", x: 27, y: 40, hot: true },
  { code: "bog", x: 27, y: 66 },
  { code: "gru", x: 34, y: 80 },
  { code: "lhr", x: 46, y: 26 },
  { code: "cdg", x: 48, y: 33 },
  { code: "fra", x: 51, y: 28, hot: true },
  { code: "arn", x: 53, y: 16 },
  { code: "mad", x: 45, y: 42 },
  { code: "jnb", x: 55, y: 84 },
  { code: "dxb", x: 62, y: 50 },
  { code: "bom", x: 67, y: 56 },
  { code: "sin", x: 76, y: 68, hot: true },
  { code: "hkg", x: 79, y: 50 },
  { code: "icn", x: 82, y: 38 },
  { code: "hnd", x: 86, y: 41 },
  { code: "syd", x: 89, y: 86 },
]

/**
 * Edge regions as positioned dots over hairline latitude lines. No background
 * pattern: structure comes from borders.
 */
export function RegionMap({ regions = defaultRegions, className }: { regions?: Region[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-36 w-full", className)}>
      <div className="absolute inset-x-0 top-1/4 border-t border-brand/15" />
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-brand/25" />
      <div className="absolute inset-x-0 top-3/4 border-t border-brand/15" />
      {regions.map((r) => (
        <span
          key={r.code}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        >
          {r.hot ? (
            <span className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/40" />
          ) : null}
          <span className={r.hot ? "block size-2 rounded-full bg-brand" : "block size-1.5 rounded-full bg-brand/60"} />
          {r.hot ? (
            <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xs font-medium whitespace-nowrap text-brand-subtle-foreground">
              {r.code}
            </span>
          ) : null}
        </span>
      ))}
    </div>
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

const defaultPeople: StackPerson[] = [
  { initials: "AR", name: "Ana Ruiz", tint: "violet" },
  { initials: "SK", name: "Sam Kim", tint: "mint" },
  { initials: "JO", name: "Jo Okafor", tint: "sand" },
  { initials: "ML", name: "Mia Laine", tint: "sky" },
]

export function AvatarStack({
  people = defaultPeople,
  more = 4,
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
