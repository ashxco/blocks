import Link from "next/link"
import { ArrowRightIcon, HeadsetIcon, KeyRoundIcon, ServerIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

interface EnterprisePoint {
  icon: LucideIcon
  title: string
  description: string
}

const points: EnterprisePoint[] = [
  {
    icon: ServerIcon,
    title: "Single-tenant or self-hosted",
    description: "Run Lumen in a dedicated region, inside your own cloud account or on servers in your data centre.",
  },
  {
    icon: KeyRoundIcon,
    title: "SAML, SCIM and audit export",
    description: "Provision teams from your identity provider and stream every audit event to your SIEM.",
  },
  {
    icon: ShieldCheckIcon,
    title: "99.99% uptime, in the contract",
    description: "A financially backed SLA with service credits, and a written incident report within 48 hours.",
  },
  {
    icon: HeadsetIcon,
    title: "A named migration engineer",
    description: "We plan the move with your team and stay on call from the first import to launch day.",
  },
]

/**
 * Custom contracts, between the plan cards and the comparison table. Copy
 * and actions on a tinted half, capabilities in a hairline grid beside it.
 */
export function EnterpriseStrip({ className }: { className?: string }) {
  return (
    <section aria-labelledby="enterprise-title" className={cn("container-page", className)}>
      <div className="grid overflow-hidden rounded-(--panel-radius) border lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col justify-between gap-10 bg-subtle p-8 sm:p-12">
          <div className="grid gap-5">
            <h2 id="enterprise-title" className="text-h2 text-foreground">
              <Kern>Lumen for enterprise.</Kern>
            </h2>
            <p className="max-w-prose text-lead text-copy">
              Volume pricing and custom terms for teams with strict compliance needs, more than 50 engineers or their
              own hardware.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/live/contact" />}>
              Talk to sales
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/live/features" />}>
              Security features
            </Button>
          </div>
        </div>

        <ul className="grid gap-px border-t bg-border sm:grid-cols-2 lg:border-t-0 lg:border-l">
          {points.map((point) => {
            const Icon = point.icon
            return (
              <li key={point.title} className="grid content-start gap-5 bg-background p-8 sm:p-10">
                <span className="grid size-10 place-items-center rounded-md border bg-background text-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="grid gap-2">
                  <h3 className="text-title text-foreground">{point.title}</h3>
                  <p className="text-body text-copy">{point.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
