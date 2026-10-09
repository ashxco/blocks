import type { AssignableRole, Member } from "@/components/blocks/members-list"
import { ASSIGNABLE_ROLES } from "@/components/blocks/members-list/roles"

export const WORKSPACE = "Acme Inc."
export const PLAN = "Pro"
/** Seats included in Pro. Pending invites hold a seat until they expire. */
export const SEATS = 10
export const INVITE_LINK = "https://lumen.app/join/acme-7hq2xl"

/** People in Acme Inc. Names match the deploy history on the overview page. */
export const MEMBERS: Member[] = [
  { id: "maya", name: "Maya Chen", email: "maya@acme.dev", role: "owner", meta: "Active now", you: true },
  { id: "daniel", name: "Daniel Okafor", email: "daniel@acme.dev", role: "admin", meta: "Active 20\u00a0minutes ago" },
  { id: "priya", name: "Priya Shah", email: "priya@acme.dev", role: "developer", meta: "Active 2\u00a0hours ago" },
  { id: "leo", name: "Leo Martins", email: "leo@acme.dev", role: "developer", meta: "Active yesterday" },
  { id: "sam", name: "Sam Rivera", email: "sam@acme.dev", role: "developer", meta: "Joined 2\u00a0hours ago" },
  { id: "nina", name: "Nina Petrova", email: "nina@acme.dev", role: "viewer", meta: "Active last week" },
]

export interface Invitation {
  id: string
  email: string
  role: AssignableRole
  invitedBy: string
  /** When the invite was sent, e.g. "2 days ago". Join the number and unit with a no-break space so they never split. */
  sent: string
  /** Days until the link stops working. 0 or less means it has expired. */
  daysLeft: number
}

export const INVITATIONS: Invitation[] = [
  { id: "inv-tomas", email: "tomas@acme.dev", role: "developer", invitedBy: "Maya Chen", sent: "2\u00a0days ago", daysLeft: 5 },
  { id: "inv-ines", email: "ines@acme.dev", role: "viewer", invitedBy: "Daniel Okafor", sent: "6\u00a0days ago", daysLeft: 1 },
  {
    id: "inv-alex",
    email: "alex@northwind.dev",
    role: "developer",
    invitedBy: "Daniel Okafor",
    sent: "10\u00a0days ago",
    daysLeft: 0,
  },
]

/** What each role can do, owner first. Assignable roles come from MembersList, so the copy stays in sync. */
export const ROLE_GUIDE: { role: string; description: string }[] = [
  { role: "Owner", description: "Everything an admin can do, plus billing ownership and deleting the workspace." },
  ...ASSIGNABLE_ROLES.map((r) => ({ role: r.label, description: r.description })),
]
