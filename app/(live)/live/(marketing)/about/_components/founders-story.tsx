import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

const founders = [
  { name: "Maya Okafor", role: "Co-founder, CEO", initials: "MO", tone: "violet" as const },
  { name: "Daniel Reyes", role: "Co-founder, CTO", initials: "DR", tone: "mint" as const },
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
          <Kern>Built by people who carried the pager.</Kern>
        </h2>

        <div className="grid gap-6 lg:col-span-6 lg:col-start-7 lg:pt-2">
          <p className="text-lead text-copy">
            Maya and Daniel met running infrastructure at a payments company, where a release meant a checklist, a
            change window and someone watching graphs until midnight. Every team they spoke to had the same setup,
            held together by scripts nobody wanted to touch.
          </p>
          <p className="text-lead text-copy">
            They started Lumen in 2023 with one rule: pushing code should be the whole deploy. Builds should be fast,
            every branch should get its own URL, and rolling back should take one click, not one meeting.
          </p>
          <p className="text-lead text-copy">
            Today Lumen runs 4.2 million deploys a month. The runtime is open source, and teams who need to can run
            all of it on their own servers.
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
