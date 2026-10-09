export type InviteRole = "admin" | "developer" | "viewer"
export type GitProvider = "github" | "gitlab" | "bitbucket"

export interface OnboardingInvite {
  id: string
  email: string
  role: InviteRole
}

export interface OnboardingRepository {
  /** Stable id, e.g. "halcyon/web". */
  id: string
  /** Full name shown in the list, e.g. "halcyon/web". */
  name: string
  /** Framework Lumen detected, e.g. "Next.js". */
  framework: string
  /** Relative time of the last push, e.g. "2 hours ago". */
  updated: string
  private?: boolean
}

export interface OnboardingValues {
  workspaceName: string
  workspaceSlug: string
  invites: OnboardingInvite[]
  provider: GitProvider
  repositoryId: string | null
}

export const PROVIDERS: { value: GitProvider; label: string }[] = [
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "bitbucket", label: "Bitbucket" },
]

export const INVITE_ROLES: { value: InviteRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "developer", label: "Developer" },
  { value: "viewer", label: "Viewer" },
]

export const RESERVED_SLUGS = ["admin", "api", "app", "docs", "help", "lumen", "status", "www"]

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
}

export interface StepErrors {
  workspaceName?: string
  workspaceSlug?: string
  invites?: Record<string, string>
  repositoryId?: string
}

export function validateStep(step: number, values: OnboardingValues, domain: string): StepErrors {
  const errors: StepErrors = {}
  if (step === 0) {
    const slug = values.workspaceSlug
    if (!values.workspaceName.trim()) errors.workspaceName = "Enter a name for your workspace."
    if (!slug) errors.workspaceSlug = "Choose a URL for your workspace."
    else if (!SLUG_PATTERN.test(slug))
      errors.workspaceSlug = "Use lowercase letters, numbers and single hyphens."
    else if (slug.length < 3) errors.workspaceSlug = "Use at least 3 characters."
    else if (RESERVED_SLUGS.includes(slug)) errors.workspaceSlug = `${domain}/${slug} is taken. Try another URL.`
  }
  if (step === 1) {
    const seen = new Set<string>()
    const invites: Record<string, string> = {}
    for (const invite of values.invites) {
      const email = invite.email.trim().toLowerCase()
      if (!email) continue
      if (!EMAIL_PATTERN.test(email)) invites[invite.id] = "Enter a full address, like sam@halcyon.dev."
      else if (seen.has(email)) invites[invite.id] = "This address is already on the list."
      seen.add(email)
    }
    if (Object.keys(invites).length) errors.invites = invites
  }
  if (step === 2 && !values.repositoryId) errors.repositoryId = "Choose a repository to deploy."
  return errors
}

export const hasErrors = (errors: StepErrors) => Object.keys(errors).length > 0
