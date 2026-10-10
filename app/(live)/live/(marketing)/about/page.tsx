import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { CtaBand } from "@/components/blocks/cta-band"
import { LogoCloud } from "@/components/blocks/logo-cloud"
import { Stats } from "@/components/blocks/stats"
import { TeamGrid, defaultTeam } from "@/components/blocks/team-grid"
import { Button } from "@/components/ui/button"

import { FoundersStory } from "./_components/founders-story"
import { TimeZonesPanel } from "./_components/time-zones-panel"
import { ValuesGrid } from "./_components/values-grid"
import { Kern } from "@/components/ui/kern"

export const metadata: Metadata = {
  title: "About",
  description:
    "Acme Inc. builds the workspace where 12,000+ teams plan and track their work. Eighteen people, remote-first since 2019, with offices in San Francisco and London.",
}

const stats = [
  { value: "2019", label: "Founded", detail: "Remote-first from day one" },
  { value: "18", label: "People on the team", detail: "Across six time zones" },
  { value: "12,000+", label: "Teams on Acme", detail: "From agencies to hospitals" },
  { value: "4.8M", label: "Tasks completed", detail: "Every month" },
]

const openRoles = [
  { title: "Senior product engineer", detail: "Engineering · San Francisco to London hours" },
  { title: "Product designer", detail: "Design · New York to Lisbon hours" },
  { title: "Customer success manager", detail: "Customer success · San Francisco or London" },
]

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className="container-page pt-section-sm pb-section">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="grid gap-8 lg:col-span-7">
            <h1 id="about-heading" className="text-display text-foreground">
              <Kern>
                Work should feel <span className="text-brand">calm</span>.
              </Kern>
            </h1>
            <p className="max-w-prose text-lead text-copy">
              Acme Inc. builds the workspace where teams plan projects, track tasks and see how the work is going,
              without a status meeting. We are eighteen people, remote-first since 2019, with offices in San Francisco
              and London.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" nativeButton={false} render={<Link href="#careers" />}>
                See open roles
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/live/blog" />}>
                Read the blog
              </Button>
            </div>
          </div>

          <TimeZonesPanel className="lg:col-span-5" />
        </div>
      </section>

      <Stats stats={stats} className="pt-0" />

      <FoundersStory />

      <ValuesGrid />

      <TeamGrid
        members={defaultTeam}
        title="The people behind Acme."
        description="Eighteen of us across six time zones. We plan every project in Acme, including the next version of Acme."
      />

      <LogoCloud layout="center" title="Used by 12,000+ teams, including" />

      <div id="careers" className="scroll-mt-(--header-height)">
        <CtaBand
          title="We’re hiring."
          description="We have three open roles in engineering, design and customer success. Work from home or from our San Francisco and London offices, with equity for everyone, five weeks of paid leave and a team week in Lisbon every spring."
          primaryAction={{ label: "See all three roles", href: "/live/contact" }}
          secondaryAction={{ label: "Ask us a question", href: "/live/contact" }}
          aside={
            <>
              <p className="text-label text-panel-foreground">Open now</p>
              <ul className="-my-1 grid divide-y divide-panel-border">
                {openRoles.map((role) => (
                  <li key={role.title}>
                    <Link
                      href="/live/contact"
                      className="group/role -mx-3 flex items-center justify-between gap-4 rounded-md px-3 py-3.5 outline-none transition-colors duration-(--duration-fast) ease-standard hover:bg-panel focus-visible:focus-ring"
                    >
                      <span className="grid gap-0.5">
                        <span className="text-title text-panel-foreground">{role.title}</span>
                        <span className="text-caption text-panel-muted">{role.detail}</span>
                      </span>
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-panel-muted transition-[color,translate] duration-(--duration-fast) ease-standard group-hover/role:translate-x-0.5 group-hover/role:text-panel-foreground"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          }
        />
      </div>
    </>
  )
}
