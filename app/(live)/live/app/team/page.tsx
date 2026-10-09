import type { Metadata } from "next"

import { TeamView } from "./_components/team-view"

export const metadata: Metadata = {
  title: "Team",
  description:
    "Members, roles and pending invitations for Acme Inc. on Lumen, with seat usage on the Pro plan.",
}

export default function TeamPage() {
  return <TeamView />
}
