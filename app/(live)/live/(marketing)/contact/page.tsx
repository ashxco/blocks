import type { Metadata } from "next"

import { ContactPanel } from "@/components/blocks/contact-panel"

import { HelpLinks } from "./_components/help-links"
import { Kern } from "@/components/ui/kern"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Acme sales about plans and rollouts, or ask support about your workspace. Every message gets a reply within one business day.",
}

const facts = [
  { value: "1 day", label: "Longest reply time" },
  { value: "2", label: "Offices, in San Francisco and London" },
  { value: "6", label: "Time zones on the team" },
]

export default function ContactPage() {
  return (
    <>
      <section className="container-page pt-section-sm pb-14 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h1 className="max-w-narrow text-display text-foreground">
            <Kern>Talk to the people who build Acme.</Kern>
          </h1>

          <div className="grid gap-10 lg:pb-2">
            <p className="max-w-prose text-lead text-copy">
              Questions about plans, a rollout across your company or a project that won’t behave? Send us a message
              and the right person replies within one business day.
            </p>
            <ul className="grid grid-cols-3 gap-4 border-t pt-6">
              {facts.map((fact) => (
                <li key={fact.label} className="grid content-start gap-1">
                  <span className="text-h4 tabular text-foreground">{fact.value}</span>
                  <span className="text-caption text-muted-foreground">{fact.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ContactPanel contained={false} className="container-page" />

      <HelpLinks className="pt-section pb-section" />
    </>
  )
}
