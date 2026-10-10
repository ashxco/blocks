"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { BillingSummary } from "@/components/blocks/billing-summary"

export default function BillingSummaryDocs() {
  return (
    <Examples>
      <Example
        title="Billing overview"
        description="The current plan sits on the one dark panel. Usage, payment method and invoices follow on flat cards. Change plan and Update payment method open dialogs."
        layout="full"
        code={`<BillingSummary />`}
      >
        <div className="p-(--card-padding) @prose:p-10">
          <BillingSummary />
        </div>
      </Example>

      <Example
        title="Near the limits"
        description="Meters at 80% or more turn amber. A failed charge leads the page with a way to pay now, and the plan shows Past due until it is settled. Pass your own plan, usage and invoices."
        layout="full"
        surface="subtle"
        code={`<BillingSummary
  seats={9}
  usage={[
    { id: "automation-runs", label: "Automation runs", used: 9320, limit: 10000, unit: "runs" },
    { id: "storage", label: "Storage", used: 88, limit: 100, unit: "GB" },
    { id: "guests", label: "Guests", used: 9, limit: 10 },
  ]}
  invoices={[…]}
/>`}
      >
        <div className="p-(--card-padding) @prose:p-10">
          <BillingSummary
            seats={9}
            paymentMethod={{
              brand: "Mastercard",
              last4: "8210",
              expires: "02/2027",
              email: "finance@copperleaf.com",
              billedTo: "Copperleaf Ltd",
            }}
            usage={[
              { id: "automation-runs", label: "Automation runs", used: 9320, limit: 10_000, unit: "runs" },
              { id: "storage", label: "Storage", used: 88, limit: 100, unit: "GB" },
              { id: "guests", label: "Guests", used: 9, limit: 10 },
            ]}
            invoices={[
              { id: "INV-2026-031", date: "Oct 1, 2026", description: "Pro, 9 seats, October", amount: 108, status: "failed" },
              { id: "INV-2026-024", date: "Sep 1, 2026", description: "Pro, 9 seats, September", amount: 108, status: "paid" },
              { id: "INV-2026-017", date: "Aug 1, 2026", description: "Pro, 8 seats, August", amount: 96, status: "paid" },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Lead with the plan and the next renewal date. That is what people come to check.",
          "Show usage as used of limit, with tabular numbers so the columns line up.",
          "Use status badges for invoices: Paid, Due, Failed. A failed charge also leads the page with Pay now.",
          "Format every meter the same way: plain below 100,000, compact from there (610K / 1M).",
          "Show the price per member next to the monthly total, so the seat math is visible.",
          "Explain proration and when a downgrade takes effect inside the change-plan dialog.",
        ]}
        dont={[
          "Don’t use more than one dark panel on a billing page.",
          "Don’t show full card numbers. Brand, last four digits and expiry are enough.",
          "Don’t colour usage red before the limit is reached. Amber means close, not broken.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "plans", type: "BillingPlan[]", default: "Free, Pro, Business", description: "Plans in the change-plan dialog: id, name, price per member per month, description and seats, the most members a plan allows." },
          { prop: "currentPlanId", type: "string", default: '"pro"', description: "Id of the active plan. The summary follows changes, so a plan picker elsewhere on the page can share it." },
          { prop: "seats", type: "number", default: "18", description: "Seats paid for, one per member. The monthly total is the plan price times the seats, and plans that allow fewer members can’t be chosen." },
          { prop: "renewsOn", type: "string", default: '"November 1, 2026"', description: "Display date of the next invoice." },
          { prop: "periodLabel", type: "string", description: "Billing period shown above the meters." },
          { prop: "usage", type: "UsageMeter[]", description: "Meters: id, label, used, limit, unit. 80% or more shows amber." },
          { prop: "paymentMethod", type: "PaymentMethod", description: "brand, last4, expires, email and an optional billedTo. The summary follows changes." },
          { prop: "invoices", type: "Invoice[]", description: "id, date, description, amount, status and an optional PDF href." },
          { prop: "currency", type: "string", default: '"USD"', description: "ISO 4217 code for prices and amounts." },
          { prop: "pricingHref", type: "string | null", default: '"/live/pricing"', description: "Target of “Compare plans”. Pass null to leave the link out when the page already compares plans." },
          { prop: "changePlanHref", type: "string", description: "Makes “Change plan” a link, such as \"#change-plan\", for pages that already list the plans. Without it the button opens the change-plan dialog." },
          { prop: "nextCharge", type: "number", description: "Amount shown as the next charge on renewsOn. Defaults to the current plan’s price times the seats." },
          { prop: "onPlanChange", type: "(plan) => void | Promise<void>", description: "Called when a new plan is confirmed. Throw to keep the dialog open. Upgrades show at once; downgrades start at renewal, so the panel keeps the current plan." },
          { prop: "onPaymentMethodChange", type: "({ brand, last4, expires }) => void", description: "Called after a card is saved. The full number never leaves the dialog." },
          { prop: "className", type: "string", description: "Classes for the root grid." },
        ]}
      />
    </Examples>
  )
}
