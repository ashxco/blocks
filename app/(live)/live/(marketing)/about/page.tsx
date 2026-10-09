import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, CompassIcon, FlameIcon, MountainIcon, WavesIcon } from "lucide-react"

import { CtaBand } from "@/components/blocks/cta-band"
import { LogoCloud } from "@/components/blocks/logo-cloud"
import { Stats } from "@/components/blocks/stats"
import { TeamGrid, defaultTeam } from "@/components/blocks/team-grid"
import { Button } from "@/components/ui/button"

import { FoundersStory } from "./_components/founders-story"
import { TimeZonesPanel } from "./_components/time-zones-panel"
import { ValuesGrid } from "./_components/values-grid"

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

const backers = [
  { name: "Fieldstone", icon: MountainIcon },
  { name: "Northlight", icon: CompassIcon },
  { name: "Kiln", icon: FlameIcon },
  { name: "Tidewater", icon: WavesIcon },
]

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className="container-page pt-section-sm pb-section">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="grid gap-8 lg:col-span-7">
            <h1 id="about-heading" className="text-display text-foreground">
              Deploys should be <span className="text-brand">boring</span>.
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
        members={defaultTeam.slice(0, 7)}
        title="The people behind Lumen"
        description="Fourteen of us across six time zones, building Lumen in the open and shipping something every week."
        hiring={{
          title: "Join the team",
          description: "Six open roles in engineering, design and support.",
          href: "#careers",
        }}
      />

      <LogoCloud title="Backed by investors who have run infrastructure at scale" items={backers} />

      <div id="careers" className="scroll-mt-(--header-height)">
        <CtaBand
          title="We’re hiring."
          description="We have six open roles in engineering, design and support. Work from anywhere between UTC−7 and UTC+9, with a team week in Lisbon every spring."
          primaryAction={{ label: "See open roles", href: "/live/contact" }}
          secondaryAction={{ label: "Ask us a question", href: "/live/contact" }}
          installLabel="Try what you would be building"
          points={["Fully remote, six time zones", "Equity for everyone on the team", "Five weeks of paid leave"]}
        />
      </div>
    </>
  )
}
