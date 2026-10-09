export type ProjectStatus = "ready" | "building" | "failed" | "paused"

export interface ProjectRow {
  id: string
  /** Project name, e.g. "web". */
  name: string
  /** Connected repository, e.g. "acme/web". */
  repo: string
  framework: string
  status: ProjectStatus
  /** Branch of the latest deployment. */
  branch: string
  region: string
  /**
   * Requests in the last 24 hours. Across every project they add up to about
   * 331K a day, matching the dashboard's Edge requests chart (~270K to 340K a day).
   */
  requests: number
  /** Relative label for the latest deployment, e.g. "2 min ago". */
  updated: string
  /** Minutes since the latest deployment. Used for sorting. */
  updatedMinutes: number
}

export const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: "ready", label: "Ready" },
  { value: "building", label: "Building" },
  { value: "failed", label: "Failed" },
  { value: "paused", label: "Paused" },
]

/**
 * The twelve projects in the Acme Inc. workspace. The app templates use the
 * same list, so names, counts and statuses agree across the dashboard, the
 * projects page and these defaults. Every project runs in one of the three
 * regions the dashboard reports on: Frankfurt, Virginia and Singapore.
 */
export const defaultProjects: ProjectRow[] = [
  {
    id: "web",
    name: "web",
    repo: "acme/web",
    framework: "Next.js",
    status: "ready",
    branch: "main",
    region: "Frankfurt",
    requests: 64_216,
    updated: "2 min ago",
    updatedMinutes: 2,
  },
  {
    id: "api",
    name: "api",
    repo: "acme/api",
    framework: "Node.js",
    status: "failed",
    branch: "feat/rate-limits",
    region: "Frankfurt",
    requests: 45_602,
    updated: "18 min ago",
    updatedMinutes: 18,
  },
  {
    id: "dashboard",
    name: "dashboard",
    repo: "acme/dashboard",
    framework: "Next.js",
    status: "building",
    branch: "feat/usage-page",
    region: "Frankfurt",
    requests: 4_311,
    updated: "Just now",
    updatedMinutes: 0,
  },
  {
    id: "docs",
    name: "docs",
    repo: "acme/docs",
    framework: "Astro",
    status: "ready",
    branch: "main",
    region: "Virginia",
    requests: 7_445,
    updated: "1 hr ago",
    updatedMinutes: 60,
  },
  {
    id: "checkout",
    name: "checkout",
    repo: "acme/checkout",
    framework: "Remix",
    status: "ready",
    branch: "main",
    region: "Frankfurt",
    requests: 20_106,
    updated: "3 hr ago",
    updatedMinutes: 180,
  },
  {
    id: "auth",
    name: "auth",
    repo: "acme/auth",
    framework: "Rust",
    status: "ready",
    branch: "main",
    region: "Frankfurt",
    requests: 32_786,
    updated: "5 hr ago",
    updatedMinutes: 300,
  },
  {
    id: "image-proxy",
    name: "image-proxy",
    repo: "acme/image-proxy",
    framework: "Go",
    status: "ready",
    branch: "main",
    region: "Singapore",
    requests: 100_922,
    updated: "6 hr ago",
    updatedMinutes: 360,
  },
  {
    id: "mobile-api",
    name: "mobile-api",
    repo: "acme/mobile-api",
    framework: "Node.js",
    status: "failed",
    branch: "fix/push-tokens",
    region: "Virginia",
    requests: 15_928,
    updated: "7 hr ago",
    updatedMinutes: 420,
  },
  {
    id: "search",
    name: "search",
    repo: "acme/search",
    framework: "Python",
    status: "ready",
    branch: "main",
    region: "Virginia",
    requests: 11_684,
    updated: "Yesterday",
    updatedMinutes: 1_440,
  },
  {
    id: "realtime",
    name: "realtime",
    repo: "acme/realtime",
    framework: "Elixir",
    status: "ready",
    branch: "main",
    region: "Frankfurt",
    requests: 27_050,
    updated: "Yesterday",
    updatedMinutes: 1_560,
  },
  {
    id: "status",
    name: "status",
    repo: "acme/status",
    framework: "SvelteKit",
    status: "ready",
    branch: "main",
    region: "Singapore",
    requests: 620,
    updated: "4 days ago",
    updatedMinutes: 5_760,
  },
  {
    id: "marketing",
    name: "marketing",
    repo: "acme/marketing",
    framework: "Astro",
    status: "paused",
    branch: "main",
    region: "Virginia",
    requests: 0,
    updated: "2 weeks ago",
    updatedMinutes: 20_160,
  },
]

