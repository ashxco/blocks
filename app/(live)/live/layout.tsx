import type { Metadata } from "next"

/**
 * Every Lumen template (marketing, auth and app) titles its tab with the
 * product name, so "Pricing" reads "Pricing · Lumen". The groups below set
 * their own frames; this layout only sets metadata.
 */
export const metadata: Metadata = {
  title: {
    default: "Lumen",
    template: "%s · Lumen",
  },
  description:
    "Lumen builds, ships and runs your apps on our cloud or on servers you own. Every branch gets a preview URL and every deploy can roll back.",
}

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
