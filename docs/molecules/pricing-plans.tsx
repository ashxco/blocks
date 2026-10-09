"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { PricingPlans, type BillingPeriod, type PricingPlan } from "@/components/blocks/pricing-plans"

const threePlans: PricingPlan[] = [
  {
    name: "Hobby",
    description: "Side projects and prototypes.",
    price: { monthly: 5, yearly: 4 },
    features: ["3 projects", "Preview URL for every push", "Community support"],
    cta: { label: "Choose Hobby", href: "/live/sign-up" },
  },
  {
    name: "Pro",
    description: "Production apps and small teams.",
    price: { monthly: 39, yearly: 31 },
    features: ["Unlimited projects", "Up to 10 team members", "Hourly backups", "Priority support"],
    cta: { label: "Start free trial", href: "/live/sign-up" },
    featured: true,
    note: "Most popular",
  },
  {
    name: "Scale",
    description: "Teams running serious traffic.",
    price: { monthly: 99, yearly: 79 },
    features: ["Unlimited team members", "SAML single sign-on", "99.99% uptime SLA", "Shared Slack channel"],
    cta: { label: "Choose Scale", href: "/live/sign-up" },
  },
]

function ControlledExample() {
  const [billing, setBilling] = React.useState<BillingPeriod>("yearly")
  // Extra room under the plans: the featured card is raised past their bottom edge.
  return (
    <div className="grid gap-12 p-6 @2xl:p-10">
      <PricingPlans
        contained={false}
        title={null}
        plans={threePlans}
        enterprise={null}
        billing={billing}
        onBillingChange={setBilling}
      />
      {/* Copy elsewhere on the page follows the same state. */}
      <p className="text-center text-caption text-muted-foreground">
        {billing === "yearly"
          ? "Yearly prices include the 20% discount and are billed once a year, before tax."
          : "Monthly prices, billed each month before tax. Switch to yearly to save 20%."}
      </p>
    </div>
  )
}

export default function PricingPlansDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Four plans with a monthly or yearly switch. The recommended plan sits on a raised dark panel with an inverse button, and an enterprise row closes the section."
        code={`<PricingPlans />`}
      >
        <PricingPlans />
      </Example>

      <Example
        title="On a tinted band, without a heading"
        layout="full"
        surface="subtle"
        description="Pass title={null} when the page already has a hero. The switch stays, centred above the plans."
        code={`<PricingPlans title={null} defaultBilling="yearly" enterprise={null} />`}
      >
        <PricingPlans title={null} defaultBilling="yearly" enterprise={null} />
      </Example>

      <Example
        title="Three plans, controlled"
        layout="full"
        description="Control the billing period from the parent to keep other prices on the page in sync. Three plans sit in three columns on wide screens."
        code={`const [billing, setBilling] = useState<BillingPeriod>("yearly")

<PricingPlans
  contained={false}
  title={null}
  plans={plans}
  enterprise={null}
  billing={billing}
  onBillingChange={setBilling}
/>
<p>{billing === "yearly" ? "Yearly prices include the 20% discount…" : "Monthly prices…"}</p>`}
      >
        <ControlledExample />
      </Example>

      <Guidelines
        do={[
          "Feature one plan at most: the one you want most people to pick.",
          "Lead each feature list with what is different from the plan before it.",
          "Keep prices whole numbers and say how they are billed under the price.",
        ]}
        dont={[
          "Don’t put a badge or label above the section heading.",
          "Don’t use brand violet buttons on the cards; ink and inverse are enough.",
          "Don’t list more than six features per plan. Move the rest to the comparison table.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "plans", type: "PricingPlan[]", default: "Hobby, Starter, Pro, Scale", description: "Plans in display order. One column each on wide screens, up to four." },
          { prop: "title", type: "ReactNode | null", default: '"Simple pricing that scales with you."', description: "Section heading. Pass null to hide the heading and keep the switch." },
          { prop: "description", type: "ReactNode", description: "Supporting line under the heading." },
          { prop: "billing", type: '"monthly" | "yearly"', description: "Controlled billing period." },
          { prop: "defaultBilling", type: '"monthly" | "yearly"', default: '"monthly"', description: "Initial period when uncontrolled." },
          { prop: "onBillingChange", type: "(billing) => void", description: "Called when the switch changes." },
          { prop: "yearlyNote", type: "string", default: '"Save 20%"', description: "Text beside Yearly in the switch." },
          { prop: "hideToggle", type: "boolean", default: "false", description: "Hide the monthly / yearly switch." },
          { prop: "enterprise", type: "{ title; description; cta } | null", default: "Enterprise and self-hosted", description: "Row under the plans for custom contracts. Pass null to hide it." },
          { prop: "currency", type: "string", default: '"$"', description: "Symbol printed before prices." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="PricingPlan"
        rows={[
          { prop: "name", type: "string", description: "Plan name, shown as the card title." },
          { prop: "description", type: "string", description: "Who the plan is for, in one line." },
          { prop: "price", type: "{ monthly: number; yearly: number }", description: "Price per month for each billing period." },
          { prop: "features", type: "string[]", description: "Checked list under the button." },
          { prop: "cta", type: "{ label: string; href: string }", description: "The plan’s button." },
          { prop: "featured", type: "boolean", default: "false", description: "Raised dark panel with an inverse button." },
          { prop: "note", type: "string", description: "Short note beside the featured plan’s name." },
        ]}
      />
    </Examples>
  )
}
