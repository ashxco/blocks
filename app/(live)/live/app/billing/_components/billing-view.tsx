"use client"

import * as React from "react"

import { BillingSummary, type PaymentMethod } from "@/components/blocks/billing-summary"

import {
  CURRENT_PLAN_ID,
  PAYMENT_METHOD,
  PERIOD_LABEL,
  PLAN_OPTIONS,
  RENEWS_ON,
  SEATS,
  USAGE,
  monthlyTotal,
} from "./billing-data"
import { PlanPicker } from "./plan-picker"

/**
 * BillingSummary and the plan picker share one plan and one card. Both read
 * them from this view, and BillingSummary follows its currentPlanId and
 * paymentMethod props, so a change made in either place shows in both.
 * Upgrades apply now; downgrades are scheduled for renewal.
 *
 * The plan picker is the one way to change plans on this page: the panel's
 * “Change plan” button links down to it instead of opening a dialog.
 */
export function BillingView() {
  const [planId, setPlanId] = React.useState(CURRENT_PLAN_ID)
  const [scheduledId, setScheduledId] = React.useState<string | null>(null)
  const [payment, setPayment] = React.useState<PaymentMethod>(PAYMENT_METHOD)

  return (
    <div className="grid gap-16">
      <BillingSummary
        plans={PLAN_OPTIONS}
        currentPlanId={planId}
        seats={SEATS}
        renewsOn={RENEWS_ON}
        periodLabel={PERIOD_LABEL}
        usage={USAGE}
        paymentMethod={payment}
        changePlanHref="#change-plan"
        // The plan picker below already links to the full comparison.
        pricingHref={null}
        nextCharge={monthlyTotal(PLAN_OPTIONS.find((p) => p.id === (scheduledId ?? planId)) ?? PLAN_OPTIONS[1])}
        onPaymentMethodChange={(method) => setPayment((current) => ({ ...current, ...method }))}
      />

      <PlanPicker
        plans={PLAN_OPTIONS}
        currentPlanId={planId}
        scheduledPlanId={scheduledId}
        paymentLabel={`${payment.brand} ending in ${payment.last4}`}
        onUpgrade={(plan) => {
          setPlanId(plan.id)
          setScheduledId(null)
        }}
        onSchedule={(plan) => setScheduledId(plan.id)}
        onCancelScheduled={() => setScheduledId(null)}
        anchorId="change-plan"
        className="border-t pt-12"
      />
    </div>
  )
}
