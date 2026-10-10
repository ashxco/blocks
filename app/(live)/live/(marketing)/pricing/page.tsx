import type { Metadata } from "next"

import { CtaBand } from "@/components/blocks/cta-band"
import { Faq, type FaqItem } from "@/components/blocks/faq"
import { PlanMatrix } from "@/components/blocks/plan-matrix"

import { EnterpriseStrip } from "./_components/enterprise-strip"
import { PricingOverview } from "./_components/pricing-overview"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Acme is free for up to 3 members. Pro is $12 per member a month and Business $24, billed annually, with a 14-day free trial of Pro.",
}

const billingQuestions: FaqItem[] = [
  {
    question: "How does the Pro trial work?",
    answer:
      "You get every Pro feature for 14 days. When the trial ends, pick a plan to keep them. If you don’t, your workspace moves to Free and keeps every project and task.",
  },
  {
    question: "Who counts as a member?",
    answer:
      "Everyone in your workspace who isn’t a guest. Guests are people outside your team, such as clients and contractors, and they don’t take a member seat. Pro includes 10 guests.",
  },
  {
    question: "What happens if we run out of automation runs?",
    answer:
      "Your rules pause until the first of the next month, and nothing else changes. Owners get an email at 80% and 100%, and you can move up a plan at any time for more runs.",
  },
  {
    question: "Can we change plans or cancel at any time?",
    answer:
      "Yes. Upgrades and new members take effect straight away and are prorated to the day. Downgrades and cancellations apply at the end of your current billing period.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "Nonprofits and schools get 50% off Pro and Business. Write to sales@acme.com with a link to your organisation and we’ll apply it to your workspace.",
  },
  {
    question: "How can we pay?",
    answer:
      "We accept Visa, Mastercard and American Express on every plan. Annual Business and Enterprise contracts can also pay by invoice and bank transfer.",
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
          description="Every plan includes every view, docs and reports. Automation runs reset on the first of each month."
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
          description="Still not sure which plan fits? Tell us about your team and we’ll suggest one within a business day."
          items={billingQuestions}
          action={{ label: "Ask sales", href: "/live/contact" }}
        />
      </div>

      <CtaBand
        title="Try Pro free for 14 days."
        description="Bring your team, import your projects and set up your first automation. Pick a plan when the trial ends, or stay on Free."
        primaryAction={{ label: "Start free trial", href: "/live/sign-up" }}
        secondaryAction={{ label: "Talk to sales", href: "/live/contact" }}
        boxTitle="Every trial includes"
        points={[
          "Guests for clients and contractors",
          "Unlimited projects and integrations",
          "10,000 automation runs",
          "Your projects stay if you move to Free",
        ]}
      />
    </>
  )
}
