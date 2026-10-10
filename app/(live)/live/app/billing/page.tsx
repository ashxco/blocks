import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/blocks/page-header"
import { Button } from "@/components/ui/button"

import { BillingView } from "./_components/billing-view"

export const metadata: Metadata = {
  title: "Billing",
  description:
    "The Pro plan for Acme Inc.: seats, usage this period, the payment method, invoices and every plan you can switch to.",
}

export default function BillingPage() {
  return (
    <div className="grid gap-10 @min-[48rem]/shell:gap-12">
      <PageHeader
        title="Billing"
        description="Your plan, seats, usage and invoices for Acme Inc. Invoices are dated the 1st of each month and emailed to lucas@acme.com."
      />

      <BillingView />

      <section aria-labelledby="billing-sales-title" className="@container/sales">
        <div className="flex flex-col items-start gap-6 rounded-(--card-radius) border bg-subtle p-(--card-padding) @min-[40rem]/sales:flex-row @min-[40rem]/sales:items-center @min-[40rem]/sales:justify-between @min-[40rem]/sales:p-8">
          <div className="grid max-w-prose gap-2">
            <h2 id="billing-sales-title" className="text-h4 text-foreground">
              Need more than Business?
            </h2>
            <p className="text-body text-copy">
              Enterprise adds a dedicated success manager, custom contracts and data residency, on top of everything in
              Business.
            </p>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/live/contact" />} className="shrink-0">
            Talk to sales
          </Button>
        </div>
      </section>
    </div>
  )
}
