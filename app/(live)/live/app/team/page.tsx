import type { Metadata } from "next"

import { TeamView } from "./_components/team-view"

export const metadata: Metadata = {
  title: "Team",
  description:
    "Members, guests, roles and pending invitations for Acme Inc., with seat use on the Pro plan.",
}

export default function TeamPage() {
  return <TeamView />
}
