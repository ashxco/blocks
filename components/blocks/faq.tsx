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
    question: "Can I try Lumen before I pay?",
    answer:
      "Yes. Every new workspace gets 14 days of Pro, with no card needed. When the trial ends, pick a plan to keep your projects running. Hobby starts at $5 a month.",
  },
  {
    question: "Can I run Lumen on my own servers?",
    answer:
      "Yes. Connect any Linux server over SSH and Lumen manages builds, deploys and TLS on it. Your apps keep running even if you stop using Lumen.",
  },
  {
    question: "Do you charge per seat?",
    answer:
      "No. Each plan includes a set number of team members, and Scale includes unlimited. Inviting someone never changes your bill.",
  },
  {
    question: "How do preview URLs work?",
    answer:
      "Every branch and pull request gets its own URL with a copy of your preview environment variables. Lumen removes the preview when the branch is merged or deleted.",
  },
  {
    question: "Can I move from another platform?",
    answer:
      "Most apps move without code changes. Import the repository, copy your environment variables, then point your domain at Lumen when the first deploy is live.",
  },
  {
    question: "What happens when a deploy fails?",
    answer:
      "The running version keeps serving traffic. Lumen shows the step that failed with its logs, and you can roll back to any earlier deploy in one click.",
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
