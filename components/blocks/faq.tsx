import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FaqItem {
  question: string
  answer: React.ReactNode
}

export interface FaqAction {
  label: string
  href: string
}

export interface FaqProps {
  title?: React.ReactNode
  description?: React.ReactNode
  items?: FaqItem[]
  /** Link under the heading for questions the list does not answer. Pass null to hide it. */
  action?: FaqAction | null
  /** Index of the item open on load. Pass null to start with all closed. */
  defaultOpen?: number | null
  /** Allow more than one answer open at a time. */
  multiple?: boolean
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const defaultItems: FaqItem[] = [
  {
    question: "Can I try Acme before I pay?",
    answer:
      "Yes. The Free plan costs nothing for up to 3 members and 5 projects, and needs no card. To try everything else, start a 14-day Pro trial and pick a plan when it ends.",
  },
  {
    question: "How does per-member pricing work?",
    answer:
      "Pro and Business are billed for each member in your workspace. Guests are people outside your team, such as clients, and they don’t take a member seat.",
  },
  {
    question: "Can I bring in work from other tools?",
    answer:
      "Import tasks from a CSV export or a spreadsheet, or start from a template such as Product roadmap or Sprint planning. Assignees, due dates and comments come across with the tasks.",
  },
  {
    question: "What counts as an automation run?",
    answer:
      "Each time a rule acts, such as notifying an owner when a task moves to Done, that is one run. Free includes 1,000 runs a month, Pro 10,000 and Business 50,000.",
  },
  {
    question: "Who can see my projects?",
    answer:
      "Only the people you invite. Owners and Admins set who can see each project, and guests see only the projects you share with them.",
  },
  {
    question: "How do you keep our data safe?",
    answer:
      "Acme has a SOC 2 Type II report and is GDPR compliant. Business adds SSO with SAML, advanced permissions and an audit log, and Enterprise adds data residency.",
  },
]

/**
 * Questions and answers beside a heading. The heading column stays in view
 * while the answers scroll on wide layouts.
 */
export function Faq({
  title = (
    <>
      Questions,
      <br />
      answered.
    </>
  ),
  description = "Can’t find what you need? Our team replies within one business day.",
  items = defaultItems,
  action = { label: "Contact us", href: "/live/contact" },
  defaultOpen = 0,
  multiple = false,
  contained = true,
  className,
}: FaqProps) {
  const value = (i: number) => `faq-${i}`
  return (
    <section data-slot="faq" className={cn(contained && "container-page py-section", className)}>
      <div className="@container/faq">
        <div className="grid gap-10 @narrow/faq:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @narrow/faq:gap-16">
          <div className="@narrow/faq:sticky @narrow/faq:top-[calc(var(--header-height)+2rem)] @narrow/faq:self-start">
            <SectionHeading align="left" title={title} description={description}>
              {action ? (
                <Button variant="outline" nativeButton={false} render={<Link href={action.href} />}>
                  {action.label}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              ) : null}
            </SectionHeading>
          </div>

          <Accordion
            multiple={multiple}
            defaultValue={defaultOpen === null ? [] : [value(defaultOpen)]}
            className="border-t"
          >
            {items.map((item, i) => (
              <AccordionItem key={item.question} value={value(i)} className="border-b">
                <AccordionTrigger className="items-center gap-6 py-6 hover:no-underline">
                  <span className="text-title text-pretty text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="max-w-prose pr-10 pb-6 text-body text-copy">{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
