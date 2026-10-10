export type MemberRole = "owner" | "admin" | "member" | "guest"

/** Roles that can be assigned from the UI. Ownership is transferred, not assigned. */
export const ASSIGNABLE_ROLES: { value: Exclude<MemberRole, "owner">; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Manage members, billing, integrations and every project." },
  { value: "member", label: "Member", description: "Create projects, tasks, docs and automations. Takes a seat." },
  { value: "guest", label: "Guest", description: "Open and comment on the projects they’re invited to. Free, no seat." },
]

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  guest: "Guest",
}

export const ROLE_ITEMS = ASSIGNABLE_ROLES.map(({ value, label }) => ({ value, label }))

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
