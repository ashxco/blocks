import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"
import { personTone } from "@/components/blocks/members-list/people"

const founders = [
  { name: "Hana Kim", role: "Co-founder and CEO", initials: "HK", tone: personTone("Hana Kim") },
  { name: "Daniel Brooks", role: "Co-founder and CTO", initials: "DB", tone: personTone("Daniel Brooks") },
]

/**
 * Why the company exists: a bold statement on the left, the short story and
 * the founders on the right.
 */
export function FoundersStory({ className }: { className?: string }) {
  return (
    <section aria-labelledby="story-heading" className={cn("container-page py-section", className)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <h2 id="story-heading" className="text-h2 text-foreground lg:col-span-5">
          <Kern>Built by people who sat through too many status meetings.</Kern>
        </h2>

        <div className="grid gap-6 lg:col-span-6 lg:col-start-7 lg:pt-2">
          <p className="text-lead text-copy">
            Hana and Daniel met running product and engineering at a design agency, where every project lived in a
            different spreadsheet and every Monday started with an hour of status updates. Every team they spoke to
            had the same setup, held together by reminders nobody wanted to send.
          </p>
          <p className="text-lead text-copy">
            They started Acme in 2019 with one rule: the plan and the work should live in the same place. Status
            should come from the work itself, not from someone writing it up on a Friday afternoon.
          </p>
          <p className="text-lead text-copy">
            Today more than 12,000 teams plan their work in Acme, from five-person agencies to hospital groups, and
            they complete 4.8 million tasks every month.
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-5 border-t pt-8">
            {founders.map((founder) => (
              <li key={founder.name} className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback tone={founder.tone}>{founder.initials}</AvatarFallback>
                </Avatar>
                <span className="grid gap-0.5">
                  <span className="text-label text-foreground">{founder.name}</span>
                  <span className="text-caption text-muted-foreground">{founder.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
