"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { PricingPlans, type BillingPeriod } from "@/components/blocks/pricing-plans"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * The top of the pricing page: a split hero with the page title on the left
 * and the lead, billing switch and a jump link on the right, then the plan
 * cards. The switch lives in the hero, so PricingPlans is controlled and its
 * own switch is hidden.
 */
export function PricingOverview() {
  const [billing, setBilling] = React.useState<BillingPeriod>("monthly")

  return (
    <>
      <section className="container-page pt-section-sm">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h1 className="max-w-narrow text-display text-foreground">
            Pay for traffic, not <span className="text-brand">teammates.</span>
          </h1>

          <div className="grid justify-items-start gap-8 lg:pb-2">
            <p className="max-w-prose text-lead text-copy">
              Every plan includes unlimited deploys, automatic HTTPS and a preview URL for every branch. Start on Hobby
              for $5 a month, or try Pro free for 14 days.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ToggleGroup
                aria-label="Billing period"
                value={[billing]}
                onValueChange={(value) => {
                  const next = value[0]
                  if (next === "monthly" || next === "yearly") setBilling(next)
                }}
              >
                <ToggleGroupItem value="monthly" className="px-5">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="yearly" className="group/yearly gap-2 px-5">
                  Yearly
                  <span className="text-caption font-semibold text-brand group-data-pressed/yearly:text-primary-foreground/70">
                    Save 20%
                  </span>
                </ToggleGroupItem>
              </ToggleGroup>

              <a
                href="#compare"
                className="inline-flex items-center gap-1.5 rounded-xs text-label text-foreground underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
              >
                Compare every feature
                <ArrowDownIcon aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PricingPlans
        title={null}
        hideToggle
        billing={billing}
        enterprise={null}
        contained={false}
        className="container-page pt-14 lg:pt-20"
      />

      <p className="container-page pt-8 pb-section-sm text-center text-caption text-muted-foreground">
        Prices in US dollars, before tax. Usage above your plan is billed at the end of the month, and you can set a
        spending cap in billing settings.
      </p>
    </>
  )
}
