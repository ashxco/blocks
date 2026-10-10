import { ACME_MEMBERS, type AssignableRole, type Member } from "@/components/blocks/members-list"
import { ASSIGNABLE_ROLES } from "@/components/blocks/members-list/roles"

export const WORKSPACE = "Acme Inc."
export const PLAN = "Pro"
/** Seats on Pro: one per member, at $12 a month each, billed annually. Matches the billing page. */
export const SEATS = 18
export const SEAT_PRICE = 12
/** Guests are free on Pro, up to 10. */
export const GUEST_LIMIT = 10
export const INVITE_LINK = "https://app.acme.com/acme/join/7hq2xl"

/** The Acme team: 18 members and 6 guests, the MembersList defaults. Names match the activity on the overview page. */
export const MEMBERS: Member[] = ACME_MEMBERS

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
  { id: "inv-nina", email: "nina@acme.com", role: "member", invitedBy: "Maya Patel", sent: "2 days ago", daysLeft: 5 },
  { id: "inv-leo", email: "leo@acme.com", role: "member", invitedBy: "Daniel Brooks", sent: "6 days ago", daysLeft: 1 },
  {
    id: "inv-dana",
    email: "dana@meridianhealth.com",
    role: "guest",
    invitedBy: "Sam Okafor",
    sent: "10 days ago",
    daysLeft: 0,
  },
]

/** What each role can do, owner first. Assignable roles come from MembersList, so the copy stays in sync. */
export const ROLE_GUIDE: { role: string; description: string }[] = [
  { role: "Owner", description: "Everything an admin can do, plus the plan, billing ownership and deleting the workspace." },
  ...ASSIGNABLE_ROLES.map((r) => ({ role: r.label, description: r.description })),
]
