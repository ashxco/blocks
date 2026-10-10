"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

import {
  DAYS_LEFT,
  RENEWS_ON,
  SEATS,
  formatUsd,
  monthlyTotal,
  proratedCharge,
  type PlanOption,
} from "./billing-data"

export interface PlanPickerProps {
  plans: PlanOption[]
  currentPlanId: string
  /** A downgrade that starts at renewal. */
  scheduledPlanId: string | null
  /** Shown in the upgrade summary, e.g. "Visa ending in 4242". */
  paymentLabel: string
  onUpgrade: (plan: PlanOption) => void | Promise<void>
  onSchedule: (plan: PlanOption) => void | Promise<void>
  onCancelScheduled: () => void
  /** Anchor for links that jump to the picker, e.g. "change-plan". */
  anchorId?: string
  className?: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The self-serve plans side by side, with the current one outlined in ink.
 * Prices are per member per month, billed annually. Upgrades start today at a
 * prorated price for every seat; downgrades are scheduled for the next
 * invoice and can be cancelled until then.
 */
export function PlanPicker({
  plans,
  currentPlanId,
  scheduledPlanId,
  paymentLabel,
  onUpgrade,
  onSchedule,
  onCancelScheduled,
  anchorId,
  className,
}: PlanPickerProps) {
  const id = React.useId()
  const current = plans.find((p) => p.id === currentPlanId) ?? plans[0]
  const scheduled = plans.find((p) => p.id === scheduledPlanId) ?? null

  const [open, setOpen] = React.useState(false)
  // The plan pair is captured when the dialog opens, so its copy stays put while the plan changes underneath.
  const [change, setChange] = React.useState<{ from: PlanOption; to: PlanOption } | null>(null)
  const [pending, setPending] = React.useState(false)

  function choose(plan: PlanOption) {
    setChange({ from: current, to: plan })
    setOpen(true)
  }

  async function confirm() {
    if (!change || pending) return
    const { from, to } = change
    const upgrade = to.price > from.price
    setPending(true)
    try {
      await Promise.all([upgrade ? onUpgrade(to) : onSchedule(to), wait(700)])
      setOpen(false)
      toast.add(
        upgrade
          ? {
              title: `You’re on ${to.name} now`,
              description: `We charged ${formatUsd(proratedCharge(from, to))} for ${SEATS} seats to your ${paymentLabel}.`,
            }
          : {
              title: `${to.name} starts on ${RENEWS_ON}`,
              description: `You keep ${from.name} until then. You can cancel the switch before it starts.`,
            }
      )
    } catch {
      toast.add({
        type: "error",
        title: "Your plan didn’t change",
        description: "Nothing was charged. Try again in a moment.",
      })
    } finally {
      setPending(false)
    }
  }

  function cancelScheduled() {
    onCancelScheduled()
    toast.add({ title: `You’re staying on ${current.name}`, description: "Nothing changes at renewal." })
  }

  return (
    <section
      id={anchorId}
      aria-labelledby={`${id}-title`}
      className={cn("@container/plans grid scroll-mt-24 gap-8", className)}
    >
      <div className="flex flex-col gap-4 @min-[48rem]/plans:flex-row @min-[48rem]/plans:items-end @min-[48rem]/plans:justify-between @min-[48rem]/plans:gap-10">
        <div className="grid gap-2">
          <h2 id={`${id}-title`} className="text-h3 text-foreground">
            Change plan
          </h2>
          <p className="max-w-prose text-body text-copy">
            Prices are per member per month, billed annually. Upgrades start today and you pay the difference for the
            rest of the month. Downgrades start on {RENEWS_ON}, so you keep what you’ve paid for.
          </p>
        </div>
        <Button variant="link" nativeButton={false} render={<Link href="/live/pricing" />} className="self-start @min-[48rem]/plans:self-end">
          Compare every feature
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      {scheduled ? (
        <Alert>
          <AlertTitle>
            {scheduled.name} starts on {RENEWS_ON}
          </AlertTitle>
          <AlertDescription>
            You keep everything in {current.name} until then. Your next invoice is {formatUsd(monthlyTotal(scheduled))}.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={cancelScheduled}>
              Keep {current.name}
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <ul className="grid gap-4 @min-[48rem]/plans:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === current.id
          const isScheduled = plan.id === scheduled?.id
          const upgrade = plan.price > current.price

          return (
            <li
              key={plan.id}
              aria-current={isCurrent || undefined}
              className={cn(
                "flex min-w-0 flex-col rounded-(--card-radius) border bg-card p-6",
                isCurrent && "border-foreground"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-title text-foreground">{plan.name}</h3>
                {isCurrent ? <Badge variant="secondary">Current</Badge> : null}
                {isScheduled ? <Badge variant="brand">From Nov 1</Badge> : null}
              </div>
              {/* Two lines tall in the three-column row, so prices line up across plans. */}
              <p className="mt-1 text-sm text-copy @min-[48rem]/plans:min-h-[2lh]">{plan.description}</p>

              <div className="mt-6 grid gap-1">
                <p className="flex items-baseline gap-1.5">
                  <span className="text-h2 text-foreground tabular-nums">{formatUsd(plan.price)}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.price > 0 ? "per member / month" : "forever"}
                  </span>
                </p>
                <p className="text-caption text-muted-foreground tabular-nums">
                  {plan.price > 0
                    ? `Billed annually, or ${formatUsd(plan.monthlyPrice)} monthly`
                    : "No card needed"}
                </p>
              </div>

              <ul className="mt-6 grid gap-3 border-t pt-6 text-sm text-copy">
                {plan.highlights.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                {isCurrent ? (
                  <p className="flex h-(--button-height-md) items-center justify-center gap-2 rounded-(--button-radius) bg-subtle text-label text-foreground">
                    <CheckIcon aria-hidden="true" className="size-4" />
                    {scheduled ? "Yours until Nov 1" : "Your plan"}
                  </p>
                ) : isScheduled ? (
                  <Button variant="outline" className="w-full" onClick={cancelScheduled}>
                    Cancel switch
                  </Button>
                ) : (
                  <Button variant={upgrade ? "default" : "outline"} className="w-full" onClick={() => choose(plan)}>
                    {upgrade ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent>
          {change ? (
            <ConfirmBody
              from={change.from}
              to={change.to}
              paymentLabel={paymentLabel}
              pending={pending}
              onConfirm={confirm}
            />
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

function ConfirmBody({
  from: current,
  to: target,
  paymentLabel,
  pending,
  onConfirm,
}: {
  from: PlanOption
  to: PlanOption
  paymentLabel: string
  pending: boolean
  onConfirm: () => void
}) {
  const upgrade = target.price > current.price
  const charge = proratedCharge(current, target)
  const short = target.seats !== undefined && target.seats < SEATS

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {upgrade ? `Upgrade to ${target.name}?` : `Switch to ${target.name} on November 1?`}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {upgrade
            ? `${target.name} starts right away. You pay the difference for ${SEATS} seats for the ${DAYS_LEFT} days left in October, then the full price from ${RENEWS_ON}.`
            : `You keep everything in ${current.name} until then. After that you pay ${formatUsd(monthlyTotal(target))} a month.`}
        </AlertDialogDescription>
      </AlertDialogHeader>

      {upgrade ? (
        <dl className="grid gap-3 rounded-(--control-radius) border bg-subtle p-4 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Due today</dt>
            <dd className="font-semibold text-foreground tabular-nums">{formatUsd(charge)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">From {RENEWS_ON}</dt>
            <dd className="text-foreground tabular-nums">
              {formatUsd(monthlyTotal(target))} per month, {SEATS} seats
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t pt-3">
            <dt className="text-muted-foreground">Charged to</dt>
            <dd className="min-w-0 truncate text-foreground">{paymentLabel}</dd>
          </div>
        </dl>
      ) : null}

      {!upgrade && short ? (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden="true" />
          <AlertTitle>
            {target.name} allows up to {target.seats} members
          </AlertTitle>
          <AlertDescription>
            Acme Inc. has {SEATS}. Remove members before {RENEWS_ON} or the switch won’t go through.{" "}
            <Link href="/live/app/team">Manage team</Link>
          </AlertDescription>
        </Alert>
      ) : null}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <Button onClick={onConfirm} disabled={pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {upgrade ? `Upgrade to ${target.name}` : "Schedule switch"}
        </Button>
      </AlertDialogFooter>
    </>
  )
}
