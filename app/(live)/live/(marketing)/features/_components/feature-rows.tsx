import * as React from "react"
import { CheckIcon } from "lucide-react"

import { CodeWindow } from "@/components/blocks/code-window"

import { AuditCard, DatabaseCard, LatencyCard, PreviewCard } from "./row-visuals"
import { Kern } from "@/components/ui/kern"

interface Feature {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  points: string[]
  windowTitle: string
  lines: string[]
  /** A small product card laid over the bottom of the terminal. */
  card: React.ReactNode
}

const features: Feature[] = [
  {
    id: "deploy",
    title: "Ship on every push.",
    description:
      "Every commit builds in isolation into a versioned image. Every branch gets its own preview URL, and any deploy rolls back in one click.",
    points: [
      "A preview URL for every pull request",
      "One-click rollback to any earlier deploy",
      "Monorepo aware: only changed apps rebuild",
    ],
    windowTitle: "lumen — acme/web",
    lines: [
      "$ git push origin feat/billing",
      "→ Received push to feat/billing (7f02b1d)",
      "→ Restoring build cache (92% hit)",
      "✓ Built image in 12.8s",
      "✓ Preview ready at feat-billing.acme.dev",
      "→ Linked the preview on pull request #482",
    ],
    card: <PreviewCard />,
  },
  {
    id: "observe",
    title: "See problems before users do.",
    description:
      "Logs, metrics and alerts stream from the first request, with nothing to install on your servers. Search a week of logs across every replica in one place.",
    points: [
      "Live tail across every replica and region",
      "CPU, memory, latency and error charts",
      "Alerts to email, Slack or a webhook",
    ],
    windowTitle: "lumen logs — acme/api",
    lines: [
      "$ lumen logs --tail --service api",
      "12:04:01 GET  /v1/projects 200 23ms",
      "12:04:01 POST /v1/deploys  201 88ms",
      "12:04:02 GET  /v1/health   200  3ms",
      "12:04:03 POST /v1/sessions 401 12ms",
      "12:04:03 GET  /v1/usage    200 41ms",
      "→ Streaming from 4 replicas in fra1 and iad1",
    ],
    card: <LatencyCard />,
  },
  {
    id: "secure",
    title: "Safe by default.",
    description:
      "TLS, encrypted secrets and edge protection are on from the first deploy. There is nothing to switch on and no security upgrade to buy.",
    points: [
      "Automatic TLS for every domain",
      "Secrets encrypted and scoped per environment",
      "Roles and audit log from Pro, SAML on Scale",
    ],
    windowTitle: "lumen — acme/api",
    lines: [
      "$ lumen secrets set STRIPE_SECRET_KEY --env production",
      "→ Encrypting with the project key",
      "→ Scoped to production only",
      "✓ Saved STRIPE_SECRET_KEY (version 4)",
      "✓ Redeployed api and worker with the new value",
    ],
    card: <AuditCard />,
  },
  {
    id: "data",
    title: "Databases next to your app.",
    description:
      "Create Postgres and Redis in the same region as your services. Lumen wires up the connection string, takes backups on a schedule and gives each preview its own copy of the data.",
    points: [
      "Managed Postgres 17 and Redis 7",
      "Point-in-time restore from Pro",
      "A database branch for every preview deploy",
    ],
    windowTitle: "lumen — acme",
    lines: [
      "$ lumen db create orders --engine postgres@17",
      "→ Provisioning 2 vCPU, 4 GB RAM and 50 GB in fra1",
      "→ Creating a read replica in iad1",
      "✓ orders is ready (38s)",
      "✓ Added DATABASE_URL to acme/web and acme/worker",
    ],
    card: <DatabaseCard />,
  },
]

function FeatureRow({ feature, reverse }: { feature: Feature; reverse: boolean }) {
  const headingId = `feature-${feature.id}`
  return (
    <section
      aria-labelledby={headingId}
      className="grid items-center gap-10 py-section-sm first:pt-0 lg:grid-cols-2 lg:gap-20"
    >
      <div className={reverse ? "min-w-0 lg:order-last" : "min-w-0"}>
        <h2 id={headingId} className="max-w-prose text-h2 text-foreground">
          <Kern>{feature.title}</Kern>
        </h2>
        <p className="mt-6 max-w-prose text-lead text-copy">{feature.description}</p>
        <ul className="mt-8 max-w-prose border-t">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-3 border-b py-3.5 text-label text-foreground">
              <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 rounded-(--panel-radius) bg-subtle p-3 sm:p-8 xl:p-10">
        <CodeWindow wrap title={feature.windowTitle} lines={feature.lines} className="pb-14" />
        <div aria-hidden="true" className="relative -mt-12 flex justify-end pr-3 pl-8 sm:pr-6 sm:pl-16">
          {feature.card}
        </div>
      </div>
    </section>
  )
}

/**
 * Four product areas in alternating rows: copy with a short checklist on one
 * side, a terminal with a product card laid over it on the other. Rows are
 * separated by hairlines.
 */
export function FeatureRows() {
  return (
    <div className="container-page divide-y pt-section">
      {features.map((feature, i) => (
        <FeatureRow key={feature.id} feature={feature} reverse={i % 2 === 1} />
      ))}
    </div>
  )
}
