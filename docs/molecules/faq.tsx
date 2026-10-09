"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Faq } from "@/components/blocks/faq"

const billingItems = [
  {
    question: "When am I charged?",
    answer: "On the first of each month, for your plan and any usage above it in the month before.",
  },
  {
    question: "Can I set a spending limit?",
    answer: "Yes. Set a monthly cap in Billing. Lumen emails the owners at 80% and pauses previews, never production, at 100%.",
  },
  {
    question: "Do you offer annual billing?",
    answer: "Yes. Pay yearly and save 20% on any plan. You can switch at your next renewal.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "Cards from Visa, Mastercard and American Express, and invoices with bank transfer on yearly Scale plans.",
  },
]

export default function FaqDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Heading and a contact link on the left, answers on the right. The heading stays in view while the answers scroll on wide layouts."
        code={`<Faq />`}
      >
        <Faq />
      </Example>

      <Example
        title="Custom questions"
        layout="full"
        surface="subtle"
        description="Group questions by topic. Start with every answer closed when none is more important than the others, and allow several open at once."
        code={`<Faq
  title="Billing questions."
  description="Plans, invoices and limits, in plain words."
  action={{ label: "Open billing settings", href: "/live/app/billing" }}
  defaultOpen={null}
  multiple
  items={[
    { question: "When am I charged?", answer: "On the first of each month, …" },
    { question: "Can I set a spending limit?", answer: "Yes. Set a monthly cap in Billing. …" },
  ]}
/>`}
      >
        <Faq
          title="Billing questions."
          description="Plans, invoices and limits, in plain words."
          action={{ label: "Open billing settings", href: "/live/app/billing" }}
          defaultOpen={null}
          multiple
          items={billingItems}
        />
      </Example>

      <Example
        title="In a narrow column"
        layout="full"
        description="Below the split width the heading stacks above the answers and stops being sticky."
        code={`<Faq contained={false} action={null} items={billingItems} />`}
      >
        <div className="max-w-prose p-6 @2xl:p-10">
          <Faq contained={false} action={null} items={billingItems} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Write questions the way customers ask them, and answer in the first sentence.",
          "Keep each answer to two or three sentences; link out for the rest.",
          "Offer a way to ask a question the list doesn’t cover.",
        ]}
        dont={[
          "Don’t hide pricing or limits that belong on the page itself.",
          "Don’t number the questions or add category badges.",
          "Don’t put more than eight questions in one list; split it by topic.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Questions, answered."', description: "Heading in the left column." },
          { prop: "description", type: "ReactNode", description: "Supporting text under the heading." },
          { prop: "items", type: "{ question: string; answer: ReactNode }[]", default: "Six Lumen questions", description: "Questions and answers, in order." },
          { prop: "action", type: "{ label: string; href: string } | null", default: '"Contact us" → /live/contact', description: "Outline button under the heading. Pass null to hide it." },
          { prop: "defaultOpen", type: "number | null", default: "0", description: "Index of the answer open on load. Pass null to start closed." },
          { prop: "multiple", type: "boolean", default: "false", description: "Allow more than one answer open at a time." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
