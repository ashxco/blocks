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
        <div className="p-(--card-padding) sm:p-10">
          <BillingSummary />
        </div>
      </Example>

      <Example
        title="Near the limits"
        description="Meters at 80% or more turn amber, and a failed invoice shows its status. Pass your own plan, usage and invoices."
        layout="full"
        surface="subtle"
        code={`<BillingSummary
  currentPlanId="starter"
  renewsOn="November 14, 2026"
  usage={[
    { id: "build-minutes", label: "Build minutes", used: 2860, limit: 3000, unit: "min" },
    { id: "bandwidth", label: "Bandwidth", used: 94, limit: 100, unit: "GB" },
  ]}
  invoices={[…]}
/>`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <BillingSummary
            currentPlanId="starter"
            renewsOn="November 14, 2026"
            periodLabel="October 14 to November 13, 2026. Resets in 6 days."
            paymentMethod={{
              brand: "Mastercard",
              last4: "8210",
              expires: "02/2027",
              email: "finance@fieldnotes.app",
              billedTo: "Fieldnotes Ltd",
            }}
            usage={[
              { id: "build-minutes", label: "Build minutes", used: 2860, limit: 3000, unit: "min" },
              { id: "bandwidth", label: "Bandwidth", used: 94, limit: 100, unit: "GB" },
              { id: "invocations", label: "Function invocations", used: 610_000, limit: 1_000_000 },
              { id: "storage", label: "Database storage", used: 0.8, limit: 2, unit: "GB" },
            ]}
            invoices={[
              { id: "INV-2026-031", date: "Oct 14, 2026", description: "Starter plan, October", amount: 20, status: "failed" },
              { id: "INV-2026-024", date: "Sep 14, 2026", description: "Starter plan, September", amount: 20, status: "paid" },
              { id: "INV-2026-017", date: "Aug 14, 2026", description: "Starter plan, August", amount: 20, status: "paid" },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Lead with the plan and the next renewal date. That is what people come to check.",
          "Show usage as used of limit, with tabular numbers so the columns line up.",
          "Use status badges for invoices: Paid, Due, Failed.",
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
          { prop: "plans", type: "BillingPlan[]", default: "Hobby, Starter, Pro, Scale", description: "Plans in the change-plan dialog: id, name, price, description, seats." },
          { prop: "currentPlanId", type: "string", default: '"pro"', description: "Id of the active plan." },
          { prop: "renewsOn", type: "string", default: '"November 1, 2026"', description: "Display date of the next renewal." },
          { prop: "periodLabel", type: "string", description: "Billing period shown above the meters." },
          { prop: "usage", type: "UsageMeter[]", description: "Meters: id, label, used, limit, unit. 80% or more shows amber." },
          { prop: "paymentMethod", type: "PaymentMethod", description: "brand, last4, expires, email and an optional billedTo." },
          { prop: "invoices", type: "Invoice[]", description: "id, date, description, amount, status and an optional PDF href." },
          { prop: "currency", type: "string", default: '"USD"', description: "ISO 4217 code for prices and amounts." },
          { prop: "pricingHref", type: "string", default: '"/live/pricing"', description: "Target of “Compare plans”." },
          { prop: "onPlanChange", type: "(plan) => void | Promise<void>", description: "Called when a new plan is confirmed. Throw to keep the dialog open." },
          { prop: "onPaymentMethodChange", type: "({ brand, last4, expires }) => void", description: "Called after a card is saved. The full number never leaves the dialog." },
          { prop: "className", type: "string", description: "Classes for the root grid." },
        ]}
      />
    </Examples>
  )
}
