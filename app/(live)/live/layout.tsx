import type { Metadata } from "next"

/**
 * Every Acme template (marketing, auth and app) titles its tab with the
 * product name, so "Pricing" reads "Pricing · Acme". The groups below set
 * their own frames; this layout only sets metadata.
 */
export const metadata: Metadata = {
  title: {
    default: "Acme",
    template: "%s · Acme",
  },
  description:
    "Acme is the work-management workspace where teams plan projects, track tasks, write docs, automate busywork and report on progress. Plan, track and ship your team’s work in one place.",
}

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
