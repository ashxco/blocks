"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, Building2Icon, CheckIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type BillingPeriod = "monthly" | "yearly"

export interface PricingPlan {
  name: string
  description: string
  /** Price per month, before and after the yearly discount. */
  price: { monthly: number; yearly: number }
  features: string[]
  cta: { label: string; href: string }
  /** Sets the plan on a raised dark panel. Use for one plan at most. */
  featured?: boolean
  /** Short note beside the name of the featured plan, e.g. "Most popular". */
  note?: string
}

export interface PricingPlansProps {
  plans?: PricingPlan[]
  /** Section title. Pass null when the page already has a heading. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Controlled billing period. */
  billing?: BillingPeriod
  /** Initial billing period when uncontrolled. */
  defaultBilling?: BillingPeriod
  onBillingChange?: (billing: BillingPeriod) => void
  /** Text beside "Yearly" in the switch. */
  yearlyNote?: string
  /** Hide the monthly / yearly switch. */
  hideToggle?: boolean
  /** Row under the plans for custom contracts. Pass null to hide it. */
  enterprise?: { title: string; description: string; cta: { label: string; href: string } } | null
  /** Currency symbol printed before prices. */
  currency?: string
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const defaultPlans: PricingPlan[] = [
  {
    name: "Hobby",
    description: "Side projects, prototypes and things you build at the weekend.",
    price: { monthly: 5, yearly: 4 },
    features: ["3 projects", "Preview URL for every push", "100 GB bandwidth", "Community support"],
    cta: { label: "Choose Hobby", href: "/live/sign-up" },
  },
  {
    name: "Starter",
    description: "Your first app in production, with a domain and backups.",
    price: { monthly: 20, yearly: 16 },
    features: ["Unlimited projects", "5 custom domains", "Daily database backups", "Email support"],
    cta: { label: "Choose Starter", href: "/live/sign-up" },
  },
  {
    name: "Pro",
    description: "Production apps and small teams that need room to grow.",
    price: { monthly: 39, yearly: 31 },
    features: [
      "Everything in Starter",
      "Up to 10 members, with roles and audit log",
      "Hourly backups with point-in-time restore",
      "Logs kept for 30 days",
      "Priority support",
    ],
    cta: { label: "Start free trial", href: "/live/sign-up" },
    featured: true,
    note: "Most popular",
  },
  {
    name: "Scale",
    description: "Teams running serious traffic across regions.",
    price: { monthly: 99, yearly: 79 },
    features: [
      "Unlimited team members",
      "SAML single sign-on",
      "Dedicated build machines",
      "99.99% uptime SLA",
      "Shared Slack channel",
    ],
    cta: { label: "Choose Scale", href: "/live/sign-up" },
  },
]

/* Column layouts by plan count. Full class names so Tailwind can see them. */
const layouts = {
  four: {
    grid: "@prose:grid-cols-2 @min-[60rem]:grid-cols-4 @min-[60rem]:gap-3",
    card: "@min-[60rem]:p-7",
    raised: "@min-[60rem]:-my-5 @min-[60rem]:py-12",
  },
  three: {
    grid: "@narrow:grid-cols-3 @narrow:gap-3",
    card: "@narrow:p-7",
    raised: "@narrow:-my-5 @narrow:py-12",
  },
  two: {
    grid: "mx-auto w-full max-w-narrow @prose:grid-cols-2",
    card: "@prose:p-7",
    raised: "@prose:-my-5 @prose:py-12",
  },
} as const

type Layout = (typeof layouts)[keyof typeof layouts]

const defaultEnterprise = {
  title: "Enterprise and self-hosted",
  description:
    "Custom contracts, single-tenant regions, on-premise installs and a named engineer for your migration.",
  cta: { label: "Talk to sales", href: "/live/contact" },
}

/**
 * Plan cards with a monthly or yearly switch. The featured plan sits on a
 * raised dark panel with an inverse button. Four plans sit in four columns
 * on wide screens, two in mid-sized slots and one on phones; three plans
 * sit in three columns from 52rem.
 */
export function PricingPlans({
  plans = defaultPlans,
  title = "Simple pricing that scales with you.",
  description = "Every plan includes unlimited deployments, automatic HTTPS and preview URLs. No per-seat fees, ever.",
  billing,
  defaultBilling = "monthly",
  onBillingChange,
  yearlyNote = "Save 20%",
  hideToggle = false,
  enterprise = defaultEnterprise,
  currency = "$",
  contained = true,
  className,
}: PricingPlansProps) {
  const [uncontrolled, setUncontrolled] = React.useState<BillingPeriod>(defaultBilling)
  const period = billing ?? uncontrolled
  const layout = plans.length >= 4 ? layouts.four : plans.length === 3 ? layouts.three : layouts.two

  const setPeriod = (next: BillingPeriod) => {
    if (billing === undefined) setUncontrolled(next)
    onBillingChange?.(next)
  }

  const toggle = hideToggle ? null : (
    <ToggleGroup
      aria-label="Billing period"
      value={[period]}
      onValueChange={(value) => {
        const next = value[0]
        if (next === "monthly" || next === "yearly") setPeriod(next)
      }}
    >
      <ToggleGroupItem value="monthly" className="px-5">
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem value="yearly" className="group/yearly gap-2 px-5">
        Yearly
        {yearlyNote ? (
          <span className="text-caption font-semibold text-muted-foreground group-data-pressed/yearly:text-primary-foreground/70">
            {yearlyNote}
          </span>
        ) : null}
      </ToggleGroupItem>
    </ToggleGroup>
  )

  return (
    <section data-slot="pricing-plans" className={cn(contained && "container-page py-section", className)}>
      <div className="@container grid gap-12">
        {title != null ? (
          <SectionHeading title={title} description={description} align="center">
            {toggle}
          </SectionHeading>
        ) : toggle ? (
          <div className="flex justify-center">{toggle}</div>
        ) : null}

        <div className={cn("grid gap-4", layout.grid)}>
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} period={period} currency={currency} layout={layout} />
          ))}
        </div>

        {enterprise ? (
          <div className="flex flex-col gap-6 rounded-(--card-radius) border bg-subtle p-(--card-padding) @prose:flex-row @prose:items-center @prose:justify-between @prose:px-8">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-background text-foreground">
                <Building2Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="grid gap-1">
                <h3 className="text-title text-foreground">{enterprise.title}</h3>
                <p className="max-w-prose text-sm text-copy">{enterprise.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="self-start @prose:self-auto"
              nativeButton={false}
              render={<Link href={enterprise.cta.href} />}
            >
              {enterprise.cta.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function PlanCard({
  plan,
  period,
  currency,
  layout,
}: {
  plan: PricingPlan
  period: BillingPeriod
  currency: string
  layout: Layout
}) {
  const featured = Boolean(plan.featured)
  const amount = plan.price[period]
  const billedLine =
    period === "yearly" ? `${currency}${(amount * 12).toLocaleString("en-US")} billed yearly` : "Billed monthly"

  return (
    <article
      data-slot="pricing-plan"
      data-featured={featured || undefined}
      className={cn(
        // Four rows on the parent grid (name, price, button, features), so the
        // same row lines up across every card in a row of plans.
        "row-span-4 grid grid-rows-subgrid gap-6 rounded-(--card-radius) border p-(--card-padding)",
        layout.card,
        featured
          ? [
              // The emphasis panel, raised above the cards in both themes.
              "border-panel bg-panel text-panel-foreground",
              layout.raised,
            ]
          : "bg-card text-card-foreground"
      )}
    >
      <div className="grid content-start gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={cn("text-h4", featured ? "text-panel-foreground" : "text-foreground")}>{plan.name}</h3>
          {featured && plan.note ? (
            <span className="text-caption font-semibold text-panel-muted">{plan.note}</span>
          ) : null}
        </div>
        <p className={cn("text-sm", featured ? "text-panel-muted" : "text-copy")}>
          {plan.description}
        </p>
      </div>

      <div className="grid content-start gap-1">
        <p className="flex items-baseline gap-1.5">
          <span
            key={period}
            className={cn(
              "text-h2 tabular animate-in duration-(--duration-base) ease-out fade-in-0 slide-in-from-bottom-1",
              featured ? "text-panel-foreground" : "text-foreground"
            )}
          >
            {currency}
            {amount}
          </span>
          <span className={cn("text-label", featured ? "text-panel-muted" : "text-muted-foreground")}>/ month</span>
        </p>
        <p className={cn("text-caption", featured ? "text-panel-muted" : "text-muted-foreground")}>{billedLine}</p>
      </div>

      <Button
        variant={featured ? "inverse" : "secondary"}
        className="w-full"
        nativeButton={false}
        render={<Link href={plan.cta.href} />}
      >
        {plan.cta.label}
      </Button>

      <ul
        className={cn(
          "grid content-start gap-3 border-t pt-6 text-sm",
          featured ? "border-panel-border text-panel-foreground" : "border-border text-foreground"
        )}
      >
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <CheckIcon
              aria-hidden="true"
              className={cn("mt-0.5 size-4 shrink-0", featured ? "text-panel-foreground" : "text-foreground")}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
