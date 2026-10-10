export type ProjectStatus = "on-track" | "at-risk" | "off-track" | "completed" | "paused"

export interface ProjectRow {
  id: string
  /** Project name, e.g. "Website relaunch". */
  name: string
  /** Team that owns the project, shown under the name, e.g. "Marketing". */
  team: string
  status: ProjectStatus
  /** Project lead, by full name. Their avatar tint comes from the shared people list. */
  lead: string
  /** Tasks marked done. */
  done: number
  /** Tasks in the project, done or not. */
  total: number
  /** Due date in ISO format, e.g. "2026-11-14". */
  due: string
  /** Relative label for the latest change, e.g. "12 min ago". */
  updated: string
  /** Minutes since the latest change. Used for sorting. */
  updatedMinutes: number
}

export const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: "on-track", label: "On track" },
  { value: "at-risk", label: "At risk" },
  { value: "off-track", label: "Off track" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
]

/**
 * The 26 projects in the Acme Inc. workspace: 24 active (on track, at risk or
 * off track), one completed and one paused. The app templates use the same
 * list, so names, counts and statuses agree across the dashboard, the
 * projects page and these defaults. Today in the sample data is October 9,
 * 2026.
 */
export const defaultProjects: ProjectRow[] = [
  { id: "website-relaunch", name: "Website relaunch", team: "Marketing", status: "on-track", lead: "Priya Raman", done: 38, total: 52, due: "2026-11-14", updated: "12 min ago", updatedMinutes: 12 },
  { id: "mobile-app", name: "Mobile app 2.0", team: "Engineering", status: "at-risk", lead: "Jordan Lee", done: 61, total: 118, due: "2026-11-20", updated: "34 min ago", updatedMinutes: 34 },
  { id: "q4-planning", name: "Q4 planning", team: "Operations", status: "on-track", lead: "Lucas Moreau", done: 14, total: 20, due: "2026-10-16", updated: "1 hr ago", updatedMinutes: 60 },
  { id: "customer-portal", name: "Customer portal", team: "Customer Success", status: "off-track", lead: "Sam Okafor", done: 22, total: 64, due: "2026-10-23", updated: "2 hr ago", updatedMinutes: 120 },
  { id: "brand-refresh", name: "Brand refresh", team: "Design", status: "on-track", lead: "Sofia Alvarez", done: 27, total: 40, due: "2026-11-06", updated: "3 hr ago", updatedMinutes: 180 },
  { id: "billing-migration", name: "Billing migration", team: "Engineering", status: "at-risk", lead: "Daniel Brooks", done: 18, total: 45, due: "2026-11-13", updated: "5 hr ago", updatedMinutes: 300 },
  { id: "onboarding-redesign", name: "Onboarding redesign", team: "Product", status: "completed", lead: "Maya Patel", done: 46, total: 46, due: "2026-09-30", updated: "Yesterday", updatedMinutes: 1_440 },
  { id: "pricing-page", name: "Pricing page update", team: "Marketing", status: "on-track", lead: "Priya Raman", done: 9, total: 14, due: "2026-10-21", updated: "Yesterday", updatedMinutes: 1_500 },
  { id: "design-system", name: "Design system v3", team: "Design", status: "on-track", lead: "Sofia Alvarez", done: 52, total: 80, due: "2026-12-04", updated: "Yesterday", updatedMinutes: 1_620 },
  { id: "soc2-evidence", name: "SOC 2 evidence review", team: "Operations", status: "on-track", lead: "Lucas Moreau", done: 31, total: 36, due: "2026-10-28", updated: "2 days ago", updatedMinutes: 2_880 },
  { id: "integrations", name: "Integrations directory", team: "Product", status: "on-track", lead: "Maya Patel", done: 12, total: 26, due: "2026-11-18", updated: "2 days ago", updatedMinutes: 2_950 },
  { id: "android-widgets", name: "Android widgets", team: "Engineering", status: "on-track", lead: "Kenji Watanabe", done: 8, total: 22, due: "2026-12-11", updated: "2 days ago", updatedMinutes: 3_100 },
  { id: "customer-interviews", name: "Q4 customer interviews", team: "Product", status: "on-track", lead: "Leila Haddad", done: 6, total: 15, due: "2026-11-27", updated: "3 days ago", updatedMinutes: 4_320 },
  { id: "support-macros", name: "Support macros", team: "Customer Success", status: "on-track", lead: "Aisha Bello", done: 17, total: 21, due: "2026-10-19", updated: "3 days ago", updatedMinutes: 4_400 },
  { id: "webinar-series", name: "Webinar series", team: "Marketing", status: "on-track", lead: "Chloe Martin", done: 5, total: 18, due: "2026-10-29", updated: "4 days ago", updatedMinutes: 5_760 },
  { id: "data-export", name: "Data export API", team: "Engineering", status: "on-track", lead: "Noah Fischer", done: 20, total: 34, due: "2026-11-25", updated: "4 days ago", updatedMinutes: 5_900 },
  { id: "accessibility-audit", name: "Accessibility audit", team: "Design", status: "on-track", lead: "Rui Costa", done: 11, total: 24, due: "2026-11-10", updated: "5 days ago", updatedMinutes: 7_200 },
  { id: "engineering-hiring", name: "Engineering hiring", team: "Operations", status: "on-track", lead: "Daniel Brooks", done: 4, total: 12, due: "2026-12-18", updated: "5 days ago", updatedMinutes: 7_300 },
  { id: "japanese-localization", name: "Japanese localization", team: "Product", status: "on-track", lead: "Kenji Watanabe", done: 15, total: 40, due: "2027-01-22", updated: "6 days ago", updatedMinutes: 8_640 },
  { id: "sales-playbook", name: "Sales playbook", team: "Sales", status: "on-track", lead: "Tom Walsh", done: 10, total: 16, due: "2026-10-26", updated: "1 week ago", updatedMinutes: 10_080 },
  { id: "partner-program", name: "Partner program", team: "Marketing", status: "on-track", lead: "Ben Carter", done: 7, total: 19, due: "2026-12-01", updated: "1 week ago", updatedMinutes: 10_200 },
  { id: "team-offsite", name: "Team offsite", team: "Operations", status: "on-track", lead: "Lucas Moreau", done: 13, total: 22, due: "2026-11-05", updated: "1 week ago", updatedMinutes: 10_300 },
  { id: "help-center", name: "Help center", team: "Customer Success", status: "paused", lead: "Sam Okafor", done: 9, total: 30, due: "2026-12-15", updated: "9 days ago", updatedMinutes: 12_960 },
  { id: "customer-stories", name: "Customer stories", team: "Marketing", status: "on-track", lead: "Priya Raman", done: 3, total: 10, due: "2026-11-30", updated: "2 weeks ago", updatedMinutes: 20_160 },
  { id: "security-review", name: "Security review", team: "Engineering", status: "on-track", lead: "Arjun Mehta", done: 9, total: 18, due: "2026-11-16", updated: "2 weeks ago", updatedMinutes: 20_200 },
  { id: "workload-reports", name: "Workload reports", team: "Product", status: "on-track", lead: "Ava Thompson", done: 16, total: 28, due: "2026-11-12", updated: "2 weeks ago", updatedMinutes: 20_400 },
]

/** Active projects: everything that is not completed or paused. 24 in the sample workspace. */
export const isActiveProject = (project: Pick<ProjectRow, "status">) =>
  project.status !== "completed" && project.status !== "paused"

/** "Nov 14" for dates in 2026, the sample year; "Jan 22, 2027" otherwise. */
export function formatDue(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getUTCFullYear() === 2026 ? undefined : "numeric",
    timeZone: "UTC",
  })
}
