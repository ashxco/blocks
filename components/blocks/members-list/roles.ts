export type MemberRole = "owner" | "admin" | "developer" | "viewer"

/** Roles that can be assigned from the UI. Ownership is transferred, not assigned. */
export const ASSIGNABLE_ROLES: { value: Exclude<MemberRole, "owner">; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Manage members, billing and every project." },
  { value: "developer", label: "Developer", description: "Deploy to preview and production, edit environment variables." },
  { value: "viewer", label: "Viewer", description: "Open deployments, logs and metrics. No changes." },
]

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  viewer: "Viewer",
}

export const ROLE_ITEMS = ASSIGNABLE_ROLES.map(({ value, label }) => ({ value, label }))

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
