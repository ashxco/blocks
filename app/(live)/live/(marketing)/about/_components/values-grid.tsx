import * as React from "react"
import {
  CoffeeIcon,
  HeartHandshakeIcon,
  MessageSquareIcon,
  NotebookPenIcon,
  RepeatIcon,
  TargetIcon,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { cn } from "@/lib/utils"

export interface Value {
  icon: LucideIcon
  title: string
  description: string
}

const defaultValues: Value[] = [
  {
    icon: NotebookPenIcon,
    title: "Write it down",
    description:
      "Plans, decisions and meeting notes live in docs anyone can read. It keeps a remote team in sync without more meetings.",
  },
  {
    icon: MessageSquareIcon,
    title: "Default to async",
    description:
      "We ask in a comment before we book a call. Across six time zones, the work should never wait for someone to wake up.",
  },
  {
    icon: RepeatIcon,
    title: "Small changes, often",
    description:
      "Small changes are easier to review, explain and undo. Something new reaches customers every two weeks, and the changelog says what.",
  },
  {
    icon: CoffeeIcon,
    title: "Calm over urgent",
    description:
      "Very little is truly urgent. We plan ahead so that Urgent still means something when we use it, in Acme and in our week.",
  },
  {
    icon: TargetIcon,
    title: "Own the outcome",
    description:
      "Whoever builds a feature follows it after launch. Engineers answer support questions, talk to customers and read every reply.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Customers in the room",
    description:
      "Every planning meeting starts with what customers told us that week. Sam reads the best and worst of it out loud.",
  },
]

export interface ValuesGridProps {
  values?: Value[]
  className?: string
}

/**
 * How the team works: a heading, then values in a hairline grid with the
 * shared hairline icon tile, a bold title and a short explanation. No numbering.
 */
export function ValuesGrid({ values = defaultValues, className }: ValuesGridProps) {
  return (
    <section aria-labelledby="values-heading" className={cn("bg-subtle py-section", className)}>
      <div className="container-page grid gap-14">
        <SectionHeading
          title={<span id="values-heading">How we work.</span>}
          description="The habits that shape how we build Acme, and how we treat each other while we do it."
        />

        <ul className="grid gap-px overflow-hidden rounded-(--card-radius) border bg-border md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <li key={title} className="grid content-start gap-8 bg-background p-(--card-padding) sm:p-8 lg:p-10">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-md border bg-background text-foreground"
              >
                <Icon className="size-5" />
              </span>
              <div className="grid gap-2.5">
                <h3 className="text-h4 text-foreground">{title}</h3>
                <p className="text-body text-copy">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
