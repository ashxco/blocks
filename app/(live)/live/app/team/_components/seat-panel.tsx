"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface SeatPanelProps {
  /** Members and admins, including the owner: each takes a seat. */
  members: number
  guests: number
  /** Most guests the plan allows. */
  guestLimit: number
  /** Live invites for members, which add a seat each when accepted. */
  invites: number
  /** Seats paid for on the plan. */
  seats: number
  /** Price of a seat per month, billed annually. */
  seatPrice: number
  planName: string
  className?: string
}

/** Seat and guest use on a dark panel: the one point of emphasis on the team page. */
export function SeatPanel({
  members,
  guests,
  guestLimit,
  invites,
  seats,
  seatPrice,
  planName,
  className,
}: SeatPanelProps) {
  const id = React.useId()
  const pct = Math.min(100, Math.round((members / seats) * 100))
  const extra = Math.max(0, members + invites - seats)

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
        <p className="text-sm">
          {`One seat per member, $${seatPrice} a month each, billed annually. Guests are free.`}
        </p>
      </div>

      <div className="grid gap-4">
        <p className="flex items-baseline gap-2">
          <span className="text-h1 text-panel-foreground tabular-nums">{members}</span>
          <span className="text-sm">of {seats} seats used</span>
        </p>
        <Progress
          value={pct}
          aria-label={`${members} of ${seats} seats used`}
          className={cn(
            // Panel colours on the track and the bar, so they read the same in both themes.
            "gap-0 **:data-[slot=progress-track]:bg-panel-foreground/10 **:data-[slot=progress-indicator]:bg-panel-foreground"
          )}
        />
      </div>

      <dl className="grid grid-cols-3 gap-3 border-t border-panel-border pt-5">
        <div className="grid gap-1">
          <dt className="text-caption">Members</dt>
          <dd className="text-h4 text-panel-foreground tabular-nums">{members}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-caption">Guests</dt>
          <dd className="text-h4 text-panel-foreground tabular-nums">
            {guests}
            <span className="text-sm font-normal text-panel-muted"> of {guestLimit}</span>
          </dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-caption">Invites</dt>
          <dd className="text-h4 text-panel-foreground tabular-nums">{invites}</dd>
        </div>
      </dl>

      {extra ? (
        <p role="status" className="text-sm text-panel-foreground">
          {extra === 1
            ? `1 pending invite adds a seat, $${seatPrice} a month, when it’s accepted.`
            : `${extra} pending invites add ${extra} seats, $${extra * seatPrice} a month, when they’re accepted.`}
        </p>
      ) : null}

      <Button variant="inverse" nativeButton={false} render={<Link href="/live/app/billing" />} className="w-full">
        Manage seats and billing
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </section>
  )
}
