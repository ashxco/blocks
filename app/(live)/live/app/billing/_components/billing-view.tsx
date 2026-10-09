"use client"

import * as React from "react"

import { BillingSummary, type PaymentMethod } from "@/components/blocks/billing-summary"

import {
  CURRENT_PLAN_ID,
  LUMEN_PLANS,
  PAYMENT_METHOD,
  PERIOD_LABEL,
  RENEWS_ON,
  USAGE,
} from "./billing-data"
import { PlanPicker } from "./plan-picker"

/**
 * BillingSummary and the plan picker share one plan. BillingSummary keeps its
 * own copy of the plan after mount, so a change made in the picker remounts it
 * (the revision key) with the new plan and the latest payment method.
 */
export function BillingView() {
  const [planId, setPlanId] = React.useState(CURRENT_PLAN_ID)
  const [scheduledId, setScheduledId] = React.useState<string | null>(null)
  const [payment, setPayment] = React.useState<PaymentMethod>(PAYMENT_METHOD)
  const [revision, setRevision] = React.useState(0)

  return (
    <div className="grid gap-16">
      <BillingSummary
        key={revision}
        plans={LUMEN_PLANS}
        currentPlanId={planId}
        renewsOn={RENEWS_ON}
        periodLabel={PERIOD_LABEL}
        usage={USAGE}
        paymentMethod={payment}
        onPlanChange={(plan) => {
          setPlanId(plan.id)
          setScheduledId(null)
        }}
        onPaymentMethodChange={(method) => setPayment((current) => ({ ...current, ...method }))}
      />

      <PlanPicker
        plans={LUMEN_PLANS}
        currentPlanId={planId}
        scheduledPlanId={scheduledId}
        paymentLabel={`${payment.brand} ending in ${payment.last4}`}
        onUpgrade={(plan) => {
          setPlanId(plan.id)
          setScheduledId(null)
          setRevision((r) => r + 1)
        }}
        onSchedule={(plan) => setScheduledId(plan.id)}
        onCancelScheduled={() => setScheduledId(null)}
        className="border-t pt-12"
      />
    </div>
  )
}
