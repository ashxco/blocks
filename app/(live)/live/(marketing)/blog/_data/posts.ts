import type { Post } from "@/components/blocks/post-card"

/**
 * Lumen blog content shared by the blog index and the article template.
 * Dates and features line up with the changelog template: database branches
 * shipped in v2.12.0 on Oct 6, live logs in v2.11.0 on Sep 24. No two posts
 * within a dozen of each other share a cover pattern, and the tints rotate so
 * neighbouring cards always differ.
 */

export const POST_HREF = "/live/blog/post"

export const featuredPost: Post = {
  title: "How we cut build times by 70%",
  excerpt:
    "Layer caching, a smarter dependency graph and one very slow Docker step. A tour of the build changes we shipped in September, with the numbers.",
  category: "Engineering",
  date: "Sep 30, 2026",
  dateTime: "2026-09-30",
  readTime: "8 min read",
  href: POST_HREF,
  cover: {
    pattern: "compare",
    tint: "violet",
    figures: [
      { label: "Median build, June", value: "61s", share: 1 },
      { label: "Median build, today", value: "18s", share: 0.29 },
    ],
  },
  author: { name: "Priya Natarajan", role: "Staff engineer" },
}

/** Every post except the featured one, newest first. */
export const posts: Post[] = [
  {
    title: "A database branch for every pull request",
    excerpt:
      "Preview environments now get a copy-on-write branch of your Postgres database, ready in under two seconds and deleted when the pull request closes.",
    category: "Product",
    date: "Oct 7, 2026",
    dateTime: "2026-10-07",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "branch", tint: "mint" },
  },
  {
    title: "Live logs from every replica at once",
    excerpt:
      "One command now streams every replica and follows your app through a deploy. Here is how to filter it down to the requests that matter.",
    category: "Product",
    date: "Sep 24, 2026",
    dateTime: "2026-09-24",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "fields", tint: "sand" },
  },
  {
    title: "Fernhill moved twelve services to Lumen in a week",
    excerpt:
      "Their platform team replaced a hand-rolled Kubernetes setup and gave every engineer a preview URL. They told us how it went.",
    category: "Customers",
    date: "Sep 17, 2026",
    dateTime: "2026-09-17",
    readTime: "6 min read",
    href: POST_HREF,
    cover: { pattern: "grid", tint: "sky" },
  },
  {
    title: "Deploy a Next.js app in five minutes",
    excerpt:
      "Connect a repository, push to main and get a production URL with HTTPS. No config file needed.",
    category: "Guides",
    date: "Sep 12, 2026",
    dateTime: "2026-09-12",
    readTime: "6 min read",
    href: POST_HREF,
    cover: { pattern: "window", tint: "rose" },
  },
  {
    title: "Our seed round, and what comes next",
    excerpt:
      "We raised $8M to keep Lumen open source and build the self-hosted edition teams keep asking for.",
    category: "Company",
    date: "Aug 28, 2026",
    dateTime: "2026-08-28",
    readTime: "3 min read",
    href: POST_HREF,
    cover: { pattern: "orbit", tint: "violet" },
  },
  {
    title: "Zero-downtime deploys, explained",
    excerpt:
      "Health checks, connection draining and the order we swap containers in, step by step.",
    category: "Engineering",
    date: "Aug 14, 2026",
    dateTime: "2026-08-14",
    readTime: "10 min read",
    href: POST_HREF,
    cover: { pattern: "uptime", tint: "panel" },
  },
  {
    title: "Migrating a Rails app to Lumen",
    excerpt:
      "Move your web, worker and Postgres database across in an afternoon, with a rollback plan.",
    category: "Guides",
    date: "Aug 2, 2026",
    dateTime: "2026-08-02",
    readTime: "7 min read",
    href: POST_HREF,
    cover: { pattern: "stack", tint: "mint" },
  },
  {
    title: "The new Lumen desktop app",
    excerpt:
      "Watch builds, tail logs and roll back from your menu bar, on macOS and Windows.",
    category: "Product",
    date: "Jul 20, 2026",
    dateTime: "2026-07-20",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "menubar", tint: "sand" },
  },
  {
    title: "What we learned running 38 edge regions",
    excerpt:
      "Routing, cold starts and the surprising cost of DNS. Notes from two years of running Lumen on six continents.",
    category: "Engineering",
    date: "Jun 24, 2026",
    dateTime: "2026-06-24",
    readTime: "9 min read",
    href: POST_HREF,
    cover: { pattern: "regions", tint: "sky" },
  },
  {
    title: "Structured logs without the setup",
    excerpt:
      "Print JSON from any language and Lumen indexes every field. Search, filter and alert on them from the dashboard.",
    category: "Guides",
    date: "Jun 10, 2026",
    dateTime: "2026-06-10",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "terminal", tint: "rose" },
  },
  {
    title: "Custom domains with automatic HTTPS",
    excerpt:
      "Point a CNAME at Lumen and we issue and renew the certificate. Apex domains and wildcards work too.",
    category: "Guides",
    date: "May 27, 2026",
    dateTime: "2026-05-27",
    readTime: "3 min read",
    href: POST_HREF,
    cover: { pattern: "address", tint: "violet" },
  },
  {
    title: "How Tandem ships 60 previews a day",
    excerpt:
      "A twelve-person team, one monorepo and a preview URL on every pull request. Their release checklist is now one line long.",
    category: "Customers",
    date: "May 14, 2026",
    dateTime: "2026-05-14",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "bars", tint: "panel" },
  },
  {
    title: "Branching strategies for teams past fifty engineers",
    excerpt:
      "Trunk-based, release branches or something in between: how teams on Lumen map branches to environments, and the one we use.",
    category: "Guides",
    date: "Apr 29, 2026",
    dateTime: "2026-04-29",
    readTime: "7 min read",
    href: POST_HREF,
    cover: { pattern: "branch", tint: "sand" },
  },
  {
    title: "Tracing a slow request across five services",
    excerpt:
      "Request IDs, structured logs and one dashboard query. How we found a 900 ms stall in our own API.",
    category: "Engineering",
    date: "Apr 15, 2026",
    dateTime: "2026-04-15",
    readTime: "8 min read",
    href: POST_HREF,
    cover: { pattern: "fields", tint: "mint" },
  },
]

/** Categories in the order the filter shows them. */
export const categories = ["Product", "Engineering", "Guides", "Customers", "Company"] as const

/** How many of the newest posts the "Latest" rail beside the featured post shows. */
export const LATEST_COUNT = 5

function byTitle(title: string): Post {
  const post = posts.find((p) => p.title === title)
  if (!post) throw new Error(`No post titled "${title}"`)
  return post
}

/** Posts shown under the article as further reading. */
export const relatedPosts: Post[] = [
  byTitle("Zero-downtime deploys, explained"),
  byTitle("Structured logs without the setup"),
  byTitle("A database branch for every pull request"),
]
