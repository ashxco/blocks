import type { BillingPlan, PaymentMethod, UsageMeter } from "@/components/blocks/billing-summary"

/** A plan as the billing page shows it: the BillingSummary plan plus its monthly price and what it includes. */
export interface PlanOption extends BillingPlan {
  /** Price per member per month when billed monthly instead of annually. */
  monthlyPrice: number
  highlights: string[]
}

/** Prices and limits match the pricing page. Enterprise is sold through sales, below the picker. */
export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    monthlyPrice: 0,
    description: "5 projects and 1,000 automation runs a month.",
    seats: 3,
    highlights: ["Up to 3 members", "5 projects", "1,000 automation runs a month", "2 GB storage"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 12,
    monthlyPrice: 15,
    description: "Unlimited projects, guests and integrations.",
    highlights: ["Unlimited projects", "10,000 automation runs a month", "100 GB storage", "Guests and integrations"],
  },
  {
    id: "business",
    name: "Business",
    price: 24,
    monthlyPrice: 29,
    description: "SSO, audit log and 50,000 automation runs.",
    highlights: [
      "Everything in Pro",
      "SSO/SAML and advanced permissions",
      "Audit log",
      "50,000 automation runs and 1 TB storage",
      "99.9% uptime SLA",
    ],
  },
]

export const CURRENT_PLAN_ID = "pro"

/** The current period runs October 1 to 31, 2026. Today is October 9. */
export const RENEWS_ON = "November 1, 2026"
export const PERIOD_LABEL = "October 1 to 31, 2026. Resets in 23 days."
export const DAYS_IN_PERIOD = 31
export const DAYS_LEFT = 23

/** Seats on the plan: one for each of the 18 members on the team page. Guests are free. */
export const SEATS = 18

/** Limits match Pro on the pricing page; automation runs match the usage panel in the app sidebar. */
export const USAGE: UsageMeter[] = [
  { id: "automation-runs", label: "Automation runs", used: 7240, limit: 10_000, unit: "runs" },
  { id: "storage", label: "Storage", used: 42, limit: 100, unit: "GB" },
  { id: "guests", label: "Guests", used: 6, limit: 10 },
]

export const PAYMENT_METHOD: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/2028",
  email: "lucas@acme.com",
  billedTo: "Acme Inc.",
}

/** The monthly charge for a plan at today’s seats. */
export const monthlyTotal = (plan: BillingPlan) => plan.price * SEATS

/** What switching now costs for the rest of the period, for every seat, rounded to cents. */
export function proratedCharge(from: BillingPlan, to: BillingPlan) {
  const difference = Math.max(0, to.price - from.price) * SEATS
  return Math.round(((difference * DAYS_LEFT) / DAYS_IN_PERIOD) * 100) / 100
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
