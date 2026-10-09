import * as React from "react"
import {
  BookOpenIcon,
  GitCommitHorizontalIcon,
  MoonIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
  TargetIcon,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"

export interface Value {
  icon: LucideIcon
  title: string
  description: string
}

const defaultValues: Value[] = [
  {
    icon: GitCommitHorizontalIcon,
    title: "Ship small, ship often",
    description:
      "We merge to main many times a day and put new work behind flags. Small changes are easier to review, test and undo.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Boring is a feature",
    description:
      "Your deploy should be the least exciting part of your week. We pick proven tools and add new ones only when they earn it.",
  },
  {
    icon: NotebookPenIcon,
    title: "Write it down",
    description:
      "Decisions, incidents and plans live in documents anyone can read. It keeps a remote team in sync without more meetings.",
  },
  {
    icon: BookOpenIcon,
    title: "Open by default",
    description:
      "The Lumen runtime is open source under Apache 2.0. Our roadmap, pricing and status history are public too.",
  },
  {
    icon: TargetIcon,
    title: "Own the outcome",
    description:
      "Whoever ships a change watches it land. Engineers answer support tickets, talk to customers and join incident reviews.",
  },
  {
    icon: MoonIcon,
    title: "Nobody gets paged at night",
    description:
      "On-call follows the sun across our time zones, so every alert lands with someone in the middle of their working day.",
  },
]

export interface ValuesGridProps {
  values?: Value[]
  className?: string
}

/**
 * How the team works: a heading, then values in a hairline grid with an ink
 * icon disc, a bold title and a short explanation. No numbering.
 */
export function ValuesGrid({ values = defaultValues, className }: ValuesGridProps) {
  return (
    <section aria-labelledby="values-heading" className={`bg-subtle py-section ${className ?? ""}`}>
      <div className="container-page grid gap-14">
        <SectionHeading
          title={<span id="values-heading">How we work</span>}
          description="The habits that shape how we build Lumen, and how we treat each other while we do it."
        />

        <ul className="grid gap-px overflow-hidden rounded-(--card-radius) border bg-border md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <li key={title} className="grid content-start gap-8 bg-background p-(--card-padding) sm:p-8 lg:p-10">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <Icon className="size-5" strokeWidth={1.75} />
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
