"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { PricingPlans, type BillingPeriod, type PricingPlan } from "@/components/blocks/pricing-plans"

const upgradePlans: PricingPlan[] = [
  {
    name: "Pro",
    description: "Unlimited projects, guests and integrations.",
    price: { monthly: 15, yearly: 12 },
    unit: "per member / month",
    features: ["Unlimited projects", "10,000 automation runs a month", "100 GB storage", "Guests and integrations"],
    cta: { label: "Upgrade to Pro", href: "/live/app/billing" },
    featured: true,
    note: "Your trial",
  },
  {
    name: "Business",
    description: "Control and security for the whole company.",
    price: { monthly: 29, yearly: 24 },
    unit: "per member / month",
    features: ["SSO with SAML", "Advanced permissions and audit log", "50,000 automation runs a month", "99.9% uptime SLA"],
    cta: { label: "Upgrade to Business", href: "/live/app/billing" },
  },
]

function ControlledExample() {
  const [billing, setBilling] = React.useState<BillingPeriod>("yearly")
  // Extra room under the plans: the featured card is raised past their bottom.
  return (
    <div className="grid gap-12 p-6 @2xl:p-10">
      <PricingPlans
        contained={false}
        title={null}
        plans={upgradePlans}
        enterprise={null}
        billing={billing}
        onBillingChange={setBilling}
      />
      {/* Copy elsewhere on the page follows the same state. */}
      <p className="text-center text-caption text-muted-foreground">
        {billing === "yearly"
          ? "Prices per member a month on annual billing, invoiced on the 1st of each month, before tax."
          : "Prices per member, billed each month before tax. Switch to yearly to save up to 20%."}
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
        description="Three plans with a monthly or yearly switch, starting on yearly. The recommended plan sits on a raised dark panel with an inverse button, and an enterprise row closes the section. Per-seat plans set unit to “per member / month”."
        code={`<PricingPlans />`}
      >
        <PricingPlans />
      </Example>

      <Example
        title="On a tinted band, without a heading"
        layout="full"
        surface="subtle"
        description="Pass title={null} when the page already has a hero. The switch stays, centred above the plans."
        code={`<PricingPlans title={null} defaultBilling="monthly" enterprise={null} />`}
      >
        <PricingPlans title={null} defaultBilling="monthly" enterprise={null} />
      </Example>

      <Example
        title="Two plans, controlled"
        layout="full"
        description="Control the billing period from the parent to keep other prices on the page in sync, such as an upgrade screen at the end of a trial. Two plans sit side by side from 42rem."
        code={`const [billing, setBilling] = useState<BillingPeriod>("yearly")

<PricingPlans
  contained={false}
  title={null}
  plans={plans}
  enterprise={null}
  billing={billing}
  onBillingChange={setBilling}
/>
<p>{billing === "yearly" ? "Prices per member a month on annual billing, invoiced monthly…" : "Prices per member, billed each month…"}</p>`}
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
          "Don’t use brand (accent) buttons on the cards; ink and inverse are enough.",
          "Don’t list more than six features per plan. Move the rest to the comparison table.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "plans", type: "PricingPlan[]", default: "Free, Pro, Business", description: "Plans in display order. One column each on wide screens, up to four." },
          { prop: "title", type: "ReactNode | null", default: '"Start free. Pay as your team grows."', description: "Section heading. Pass null to hide the heading and keep the switch." },
          { prop: "description", type: "ReactNode", description: "Supporting line under the heading." },
          { prop: "billing", type: '"monthly" | "yearly"', description: "Controlled billing period." },
          { prop: "defaultBilling", type: '"monthly" | "yearly"', default: '"yearly"', description: "Initial period when uncontrolled." },
          { prop: "onBillingChange", type: "(billing) => void", description: "Called when the switch changes." },
          { prop: "yearlyNote", type: "string", default: '"Save up to 20%"', description: "Text beside Yearly in the switch." },
          { prop: "hideToggle", type: "boolean", default: "false", description: "Hide the monthly / yearly switch." },
          { prop: "enterprise", type: "{ title; description; cta } | null", default: "Enterprise", description: "Row under the plans for custom contracts. Pass null to hide it." },
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
          { prop: "unit", type: "string", default: '"/ month"', description: "Printed after the price. Per-seat plans use “per member / month”, and the yearly line then reads per member." },
          { prop: "billingNote", type: "string", description: "Replaces the billing line under the price, e.g. “Free forever, no card required”." },
          { prop: "features", type: "string[]", description: "Checked list under the button." },
          { prop: "cta", type: "{ label: string; href: string }", description: "The plan’s button." },
          { prop: "featured", type: "boolean", default: "false", description: "Raised dark panel with an inverse button." },
          { prop: "note", type: "string", description: "Short note beside the featured plan’s name." },
        ]}
      />
    </Examples>
  )
}
