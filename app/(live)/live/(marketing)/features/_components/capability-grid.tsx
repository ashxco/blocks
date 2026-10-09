import * as React from "react"
import {
  ActivityIcon,
  BoxesIcon,
  CalendarClockIcon,
  DatabaseIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  KeyRoundIcon,
  RefreshCwIcon,
  ScalingIcon,
  ShieldCheckIcon,
  TerminalIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"

interface Capability {
  title: string
  description: string
  icon: LucideIcon
}

const capabilities: Capability[] = [
  { title: "Push to deploy", description: "Every push to a connected branch builds and ships.", icon: GitBranchIcon },
  { title: "Preview URLs", description: "A shareable URL for every pull request, removed on merge.", icon: GitPullRequestIcon },
  { title: "CLI and API", description: "Deploy, tail logs and roll back from your terminal or scripts.", icon: TerminalIcon },
  { title: "Detected stacks", description: "Next.js, Rails, Django, Go, Rust and 30 more, with no config.", icon: BoxesIcon },
  { title: "Live metrics", description: "CPU, memory, latency and errors from the first request.", icon: ActivityIcon },
  { title: "Scheduled jobs", description: "Cron jobs and one-off tasks, with logs and retries.", icon: CalendarClockIcon },
  { title: "Zero-downtime deploys", description: "New versions take traffic only once they are healthy.", icon: RefreshCwIcon },
  { title: "Autoscaling", description: "Add replicas on CPU or request load, and scale down at night.", icon: ScalingIcon },
  { title: "Managed Postgres", description: "Nightly backups, point-in-time restore and read replicas.", icon: DatabaseIcon },
  { title: "Edge protection", description: "TLS, rate limits and DDoS filtering in 38 regions.", icon: ShieldCheckIcon },
  { title: "Secrets vault", description: "Encrypted at rest and scoped to each environment.", icon: KeyRoundIcon },
  { title: "Roles and audit log", description: "Four roles, single sign-on and a record of every change.", icon: UsersIcon },
]

/**
 * Every capability on one hairline grid, on a tinted band. Twelve cells fill
 * two, three and four columns evenly.
 */
export function CapabilityGrid() {
  return (
    <section className="border-y bg-subtle">
      <div className="container-page py-section">
        <SectionHeading
          title={
            <>
              Twelve capabilities.
              <br />
              One price.
            </>
          }
          description="Every plan includes everything on this list. Limits grow with your plan; features never sit behind an upgrade."
          className="mb-12 md:mb-16"
        />
        <ul className="grid gap-px overflow-hidden rounded-(--card-radius) border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {capabilities.map(({ title, description, icon: Icon }) => (
            <li key={title} className="flex flex-col gap-2 bg-background p-6 lg:p-7">
              <Icon aria-hidden="true" className="mb-5 size-5 text-foreground" strokeWidth={1.75} />
              <h3 className="text-title text-foreground">{title}</h3>
              <p className="text-sm text-copy">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
