"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface SeatPanelProps {
  members: number
  invites: number
  seats: number
  planName: string
  className?: string
}

/** Seat usage on a dark panel: the one point of emphasis on the team page. */
export function SeatPanel({ members, invites, seats, planName, className }: SeatPanelProps) {
  const id = React.useId()
  const used = members + invites
  const open = Math.max(0, seats - used)
  const over = Math.max(0, used - seats)
  const pct = Math.min(100, Math.round((used / seats) * 100))

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(
        "grid gap-6 rounded-(--panel-radius) border border-panel-border bg-panel p-(--panel-padding-sm) text-panel-muted",
        className
      )}
    >
      <div className="grid gap-1">
        <h2 id={`${id}-title`} className="text-title text-panel-foreground">
          Seats on {planName}
        </h2>
        <p className="text-sm">Pending invites hold a seat until they’re accepted or expire.</p>
      </div>

      <div className="grid gap-4">
        <p className="flex items-baseline gap-2">
          <span className="text-h1 text-panel-foreground tabular-nums">{used}</span>
          <span className="text-sm">of {seats} used</span>
        </p>
        <Progress
          value={pct}
          aria-label={`${used} of ${seats} seats used`}
          className={cn(
            // Panel colours on the track and the bar, so they read the same in both themes.
            "gap-0 **:data-[slot=progress-track]:bg-panel-foreground/10",
            over
              ? "**:data-[slot=progress-indicator]:bg-panel-warning"
              : "**:data-[slot=progress-indicator]:bg-panel-foreground"
          )}
        />
      </div>

      <dl className="grid grid-cols-3 gap-3 border-t border-panel-border pt-5">
        <div className="grid gap-1">
          <dt className="text-caption">Members</dt>
          <dd className="text-h4 text-panel-foreground tabular-nums">{members}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-caption">Invites</dt>
          <dd className="text-h4 text-panel-foreground tabular-nums">{invites}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-caption">{over ? "Over" : "Open"}</dt>
          <dd className={cn("text-h4 tabular-nums", over ? "text-panel-warning" : "text-panel-foreground")}>
            {over || open}
          </dd>
        </div>
      </dl>

      {over ? (
        <p role="status" className="text-sm text-panel-foreground">
          You’re {over} {over === 1 ? "seat" : "seats"} over {planName}. Revoke an invite or move to Scale before
          your next invoice.
        </p>
      ) : null}

      <Button variant="inverse" nativeButton={false} render={<Link href="/live/app/billing" />} className="w-full">
        Unlimited seats on Scale
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </section>
  )
}
