"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

import { formatMoney } from "./format"

export interface BillingPlan {
  id: string
  name: string
  /** Monthly price. */
  price: number
  description: string
  /** Seats included. Omit for unlimited. */
  seats?: number
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function ChangePlanDialog({
  plans,
  currentPlanId,
  renewsOn,
  currency = "USD",
  onChange,
}: {
  plans: BillingPlan[]
  currentPlanId: string
  renewsOn: string
  currency?: string
  onChange: (plan: BillingPlan) => void | Promise<void>
}) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(currentPlanId)
  const [pending, setPending] = React.useState(false)

  const current = plans.find((p) => p.id === currentPlanId)
  const next = plans.find((p) => p.id === selected)
  const upgrade = Boolean(current && next && next.price > current.price)

  function handleOpenChange(value: boolean) {
    if (pending) return
    setOpen(value)
    if (value) setSelected(currentPlanId)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!next || next.id === currentPlanId || pending) return
    setPending(true)
    try {
      await Promise.all([onChange(next), wait(600)])
      setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="inverse" />}>Change plan</DialogTrigger>
      <DialogContent className="sm:max-w-(--dialog-width)">
        <form onSubmit={handleSubmit} className="contents">
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
            <DialogDescription>
              Upgrades start right away and are prorated. Downgrades take effect on {renewsOn}.
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={selected}
            onValueChange={(value) => setSelected(String(value))}
            aria-labelledby={`${id}-legend`}
            className="gap-2"
          >
            <span id={`${id}-legend`} className="sr-only">
              Plans
            </span>
            {plans.map((plan) => (
              <label
                key={plan.id}
                className="flex cursor-pointer items-center gap-4 rounded-(--control-radius) border p-4 transition-colors duration-(--duration-fast) hover:bg-accent has-data-checked:border-foreground"
              >
                <RadioGroupItem value={plan.id} />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className="text-label text-foreground">{plan.name}</span>
                    {plan.id === currentPlanId ? <Badge variant="secondary">Current</Badge> : null}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {plan.description} {plan.seats ? `${plan.seats} seats.` : "Unlimited seats."}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-label text-foreground tabular-nums">
                    {formatMoney(plan.price, currency)}
                  </span>
                  <span className="block text-caption text-muted-foreground">per month</span>
                </span>
              </label>
            ))}
          </RadioGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={pending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!next || next.id === currentPlanId || pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {next && next.id !== currentPlanId
                ? `${upgrade ? "Upgrade" : "Switch"} to ${next.name}`
                : "Choose a plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
