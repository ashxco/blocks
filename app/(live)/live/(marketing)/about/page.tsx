import type { Metadata } from "next"
import Link from "next/link"
import { AnchorIcon, ArrowRightIcon, CompassIcon, FlameIcon, MountainIcon } from "lucide-react"

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
    "Lumen is built by fourteen engineers and designers across six time zones. Meet the team, how we work and who backs us.",
}

const stats = [
  { value: "2023", label: "Founded in Berlin", detail: "By two engineers tired of deploy day" },
  { value: "14", label: "People on the team", detail: "Fully remote, six time zones" },
  { value: "38,000", label: "Teams deploying", detail: "From side projects to public companies" },
  { value: "$8M", label: "Seed funding", detail: "Led by Fieldstone Capital" },
]

const openRoles = [
  { title: "Senior platform engineer", detail: "Engineering · UTC−5 to UTC+3" },
  { title: "Product designer", detail: "Design · UTC−3 to UTC+3" },
  { title: "Support engineer", detail: "Support · UTC+5 to UTC+9" },
]

const backers = [
  { name: "Fieldstone", icon: MountainIcon },
  { name: "Northlight", icon: CompassIcon },
  { name: "Kiln", icon: FlameIcon },
  { name: "Harbor", icon: AnchorIcon },
]

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className="container-page pt-section-sm pb-section">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="grid gap-8 lg:col-span-7">
            <h1 id="about-heading" className="text-display text-foreground">
              <Kern>
                Deploys should be <span className="text-brand">boring</span>.
              </Kern>
            </h1>
            <p className="max-w-prose text-lead text-copy">
              Lumen is a deployment platform built by fourteen engineers and designers who spent a decade on call. We
              build the tools we wished we had: push to deploy, a preview for every branch, and rollbacks in one
              click.
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
        title="The people behind Lumen."
        description="Fourteen of us across six time zones, building Lumen in the open and shipping a release every two weeks."
      />

      <LogoCloud layout="center" title="Backed by investors who have run infrastructure at scale" items={backers} />

      <div id="careers" className="scroll-mt-(--header-height)">
        <CtaBand
          title="We’re hiring."
          description="We have six open roles in engineering, design and support. Work from anywhere between UTC−7 and UTC+9, with equity for everyone, five weeks of paid leave and a team week in Lisbon every spring."
          primaryAction={{ label: "See all six roles", href: "/live/contact" }}
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
