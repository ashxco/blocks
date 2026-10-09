import type { BillingPlan, PaymentMethod, UsageMeter } from "@/components/blocks/billing-summary"

/** A plan as the billing page shows it: the BillingSummary plan plus what it includes. */
export interface LumenPlan extends BillingPlan {
  highlights: string[]
}

/** Prices and limits match the Lumen pricing page. */
export const LUMEN_PLANS: LumenPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    price: 5,
    description: "Side projects and experiments.",
    seats: 1,
    highlights: ["3 projects", "100 GB bandwidth", "1 GB Postgres, weekly backups", "Community support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 20,
    description: "Your first app in production.",
    seats: 3,
    highlights: ["Unlimited projects", "500 GB bandwidth", "5 custom domains", "Daily backups, email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    description: "Production apps that need room to grow.",
    seats: 10,
    highlights: ["1 TB bandwidth", "Unlimited custom domains", "Hourly backups, 30-day logs", "Priority support"],
  },
  {
    id: "scale",
    name: "Scale",
    price: 99,
    description: "Teams running serious traffic.",
    highlights: ["5 TB bandwidth", "SAML single sign-on and audit log", "Dedicated build machines", "99.99% uptime SLA"],
  },
]

export const CURRENT_PLAN_ID = "pro"

/** The current period runs October 1 to 31, 2026. Today is October 9. */
export const RENEWS_ON = "November 1, 2026"
export const PERIOD_LABEL = "October 1 to 31, 2026. Resets in 23 days."
export const DAYS_IN_PERIOD = 31
export const DAYS_LEFT = 23

/** People in Acme Inc. plus pending invites, which hold a seat. Matches the team page. */
export const SEATS_IN_USE = 8

/** Build minutes match the usage panel in the app sidebar. */
export const USAGE: UsageMeter[] = [
  { id: "build-minutes", label: "Build minutes", used: 2400, limit: 3000, unit: "min" },
  { id: "bandwidth", label: "Bandwidth", used: 412, limit: 1000, unit: "GB" },
  { id: "invocations", label: "Function invocations", used: 3_180_000, limit: 5_000_000 },
  { id: "storage", label: "Database storage", used: 18.6, limit: 50, unit: "GB" },
]

export const PAYMENT_METHOD: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/2028",
  email: "billing@acme.dev",
  billedTo: "Acme Inc.",
}

/** What switching now costs for the rest of the period, rounded to cents. */
export function proratedCharge(from: BillingPlan, to: BillingPlan) {
  const difference = Math.max(0, to.price - from.price)
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
