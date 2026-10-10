export type InviteRole = "admin" | "member" | "guest"

/** The view a project opens in. Every project can switch between them later. */
export type TemplateView = "list" | "board" | "timeline" | "calendar"

export interface OnboardingInvite {
  id: string
  email: string
  role: InviteRole
}

export interface OnboardingTemplate {
  /** Stable id, e.g. "product-roadmap". */
  id: string
  /** Name of the template and of the project it creates, e.g. "Product roadmap". */
  name: string
  /** One line on what the template sets up. */
  description: string
  /** The view the project opens in. */
  view: TemplateView
  /** Starter tasks the template creates. */
  tasks: number
  /**
   * Sections the project starts with. `count` is how many starter tasks the
   * section holds (the counts add up to `tasks`); `tasks` names a few of them.
   */
  sections: { name: string; count: number; tasks: string[] }[]
}

export interface OnboardingValues {
  workspaceName: string
  workspaceSlug: string
  invites: OnboardingInvite[]
  templateId: string | null
}

export const VIEW_LABELS: Record<TemplateView, string> = {
  list: "List",
  board: "Board",
  timeline: "Timeline",
  calendar: "Calendar",
}

/** The four templates Acme offers in onboarding. */
export const DEFAULT_TEMPLATES: OnboardingTemplate[] = [
  {
    id: "product-roadmap",
    name: "Product roadmap",
    description: "Plan features by quarter and share one timeline with the whole company.",
    view: "timeline",
    tasks: 18,
    sections: [
      { name: "Now", count: 7, tasks: ["Define Q1 themes", "Customer research plan"] },
      { name: "Next", count: 6, tasks: ["Offline mode", "Reports v2"] },
      { name: "Later", count: 5, tasks: ["Public API"] },
    ],
  },
  {
    id: "marketing-calendar",
    name: "Marketing calendar",
    description: "Campaigns, posts and launches on one calendar, each with an owner and a date.",
    view: "calendar",
    tasks: 24,
    sections: [
      { name: "Campaigns", count: 10, tasks: ["Spring launch", "Webinar series"] },
      { name: "Content", count: 9, tasks: ["Weekly planning guide", "November newsletter"] },
      { name: "Events", count: 5, tasks: ["Customer meetup"] },
    ],
  },
  {
    id: "client-projects",
    name: "Client projects",
    description: "One project per client, with milestones, files and guest access for the client.",
    view: "list",
    tasks: 15,
    sections: [
      { name: "Kickoff", count: 5, tasks: ["Kickoff call", "Share the project brief"] },
      { name: "Delivery", count: 7, tasks: ["First draft", "Client review"] },
      { name: "Handoff", count: 3, tasks: ["Final files"] },
    ],
  },
  {
    id: "sprint-planning",
    name: "Sprint planning",
    description: "Two-week sprints on a board, with priorities, estimates and a shared backlog.",
    view: "board",
    tasks: 21,
    sections: [
      { name: "Backlog", count: 12, tasks: ["Bulk edit tasks", "Faster search"] },
      { name: "In progress", count: 6, tasks: ["Recurring tasks", "Guest invites"] },
      { name: "Done", count: 3, tasks: ["Sprint 41 retro"] },
    ],
  },
]

export const INVITE_ROLES: { value: InviteRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "guest", label: "Guest" },
]

export const RESERVED_SLUGS = ["admin", "api", "app", "docs", "help", "status", "www"]

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
  templateId?: string
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
      if (!EMAIL_PATTERN.test(email)) invites[invite.id] = "Enter a full address, like sam@acme.com."
      else if (seen.has(email)) invites[invite.id] = "This address is already on the list."
      seen.add(email)
    }
    if (Object.keys(invites).length) errors.invites = invites
  }
  if (step === 2 && !values.templateId) errors.templateId = "Choose a template to start with."
  return errors
}

export const hasErrors = (errors: StepErrors) => Object.keys(errors).length > 0
