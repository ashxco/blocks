import type { Metadata } from "next"

import { CtaBand } from "@/components/blocks/cta-band"
import { Faq, type FaqItem } from "@/components/blocks/faq"
import { PlanMatrix } from "@/components/blocks/plan-matrix"

import { EnterpriseStrip } from "./_components/enterprise-strip"
import { PricingOverview } from "./_components/pricing-overview"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Lumen plans from $5 a month. Unlimited deploys, automatic HTTPS and preview URLs on every plan, with no per-seat fees.",
}

const billingQuestions: FaqItem[] = [
  {
    question: "How does the Pro trial work?",
    answer:
      "You get every Pro feature for 14 days, without adding a card. When the trial ends, pick a plan to keep your projects running. If you don’t, we pause them and keep your data for 30 days.",
  },
  {
    question: "Do you charge per seat?",
    answer:
      "No. Each plan includes a set number of team members: 3 on Starter, 10 on Pro and unlimited on Scale. Inviting someone never changes your bill.",
  },
  {
    question: "What happens if I go over my plan’s limits?",
    answer:
      "Your apps keep running. Extra bandwidth costs $0.10 per GB and extra build minutes cost $0.005 each. Owners get an email at 50%, 80% and 100% of every limit, and you can set a hard spending cap in billing settings.",
  },
  {
    question: "Can I change plans or cancel at any time?",
    answer:
      "Yes. Upgrades take effect straight away and are prorated to the day. Downgrades and cancellations apply at the end of your current billing period.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "Open-source projects with an OSI-approved licence get Pro for free. Startups less than two years old get 50% off Scale for their first year. Write to us with a link to your project or company.",
  },
  {
    question: "How can I pay?",
    answer:
      "We accept Visa, Mastercard and American Express on every plan. Yearly Scale and enterprise contracts can also pay by invoice and bank transfer, with 30-day terms.",
  },
]

export default function PricingPage() {
  return (
    <>
      <PricingOverview />

      <EnterpriseStrip />

      <div id="compare" className="scroll-mt-(--header-height)">
        <PlanMatrix
          title="Compare every plan."
          description="Limits reset on the first of each month. Every plan includes automatic HTTPS, DDoS protection and unlimited deploys."
        />
      </div>

      <div className="bg-subtle">
        <Faq
          title={
            <>
              Billing,
              <br />
              explained.
            </>
          }
          description="Still not sure which plan fits? Tell us what you run and we’ll suggest one within a business day."
          items={billingQuestions}
          action={{ label: "Ask sales", href: "/live/contact" }}
        />
      </div>

      <CtaBand
        title="Try Pro free for 14 days."
        description="Connect a repository and get a live URL in under a minute. No card needed to start, and you can switch plans whenever you like."
        primaryAction={{ label: "Start free trial", href: "/live/sign-up" }}
        secondaryAction={{ label: "Talk to sales", href: "/live/contact" }}
        installLabel="Every trial includes"
        command={null}
        points={[
          "Every Pro feature for 14 days",
          "10 team members and unlimited projects",
          "No card until you pick a plan",
          "Your projects and data carry over",
        ]}
      />
    </>
  )
}
