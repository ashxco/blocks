import * as React from "react"

import { cn } from "@/lib/utils"

export interface TeamZone {
  city: string
  /** Display offset, e.g. "UTC+2". */
  offset: string
  /** Start and end of the local working day, in UTC hours (0–24). */
  start: number
  end: number
}

export interface TimeZonesPanelProps {
  zones?: TeamZone[]
  className?: string
}

const defaultZones: TeamZone[] = [
  { city: "Tokyo", offset: "UTC+9", start: 0, end: 8 },
  { city: "Bengaluru", offset: "UTC+5:30", start: 3.5, end: 11.5 },
  { city: "Lisbon", offset: "UTC+1", start: 7.5, end: 15.5 },
  { city: "London", offset: "UTC+1", start: 8, end: 16 },
  { city: "New York", offset: "UTC−4", start: 13, end: 21 },
  { city: "San Francisco", offset: "UTC−7", start: 16, end: 24 },
]

const axis = ["00:00", "06:00", "12:00", "18:00", "24:00"]

function utc(hours: number) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/**
 * A dark panel that charts the team's working day in each city on one UTC
 * axis, showing how the hours hand over around the clock.
 */
export function TimeZonesPanel({ zones = defaultZones, className }: TimeZonesPanelProps) {
  return (
    <figure
      className={cn(
        "@container relative isolate m-0 overflow-hidden rounded-(--panel-radius) bg-panel p-6 text-panel-foreground sm:p-10",
        className
      )}
    >
      <figcaption className="grid gap-2">
        <span className="text-h4 text-panel-foreground">One team, six time zones</span>
        <span className="max-w-prose text-body text-panel-muted">
          Our working hours on one UTC clock. Someone on the team is online whenever yours is.
        </span>
      </figcaption>

      <ul className="mt-10 grid gap-4">
        {zones.map((zone) => (
          <li
            key={zone.city}
            className="grid grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-4 @prose:grid-cols-[8.5rem_minmax(0,1fr)]"
          >
            <span className="grid">
              <span className="truncate text-label text-panel-foreground">{zone.city}</span>
              <span className="text-caption text-panel-muted tabular">{zone.offset}</span>
            </span>
            <span className="sr-only">
              , works {utc(zone.start)} to {utc(zone.end)} UTC
            </span>
            <span aria-hidden="true" className="relative block h-9 rounded-full bg-panel-raised">
              <span className="absolute inset-y-0 left-1/4 w-px bg-panel-border" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-panel-border" />
              <span className="absolute inset-y-0 left-3/4 w-px bg-panel-border" />
              <span
                className="absolute inset-y-1.5 rounded-full bg-panel-foreground"
                style={{
                  left: `calc(${(zone.start / 24) * 100}% + 0.375rem)`,
                  width: `calc(${((zone.end - zone.start) / 24) * 100}% - 0.75rem)`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="mt-4 grid grid-cols-[6.75rem_minmax(0,1fr)] gap-4 @prose:grid-cols-[8.5rem_minmax(0,1fr)]"
      >
        <span className="text-xs text-panel-muted">UTC</span>
        <span className="flex justify-between text-xs text-panel-muted tabular">
          {axis.map((label, i) => (
            <span key={label} className={i === 1 || i === 3 ? "hidden @prose:inline" : undefined}>
              {label}
            </span>
          ))}
        </span>
      </div>
    </figure>
  )
}
