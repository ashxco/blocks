import type { Post } from "@/components/blocks/post-card"

/** Lumen blog content shared by the blog index and the article template. */

export const POST_HREF = "/live/blog/post"

export const featuredPost: Post = {
  title: "How we cut build times by 70%",
  excerpt:
    "Layer caching, a smarter dependency graph and one very slow Docker step. A tour of the changes behind Lumen 2.3, with the numbers.",
  category: "Engineering",
  date: "Sep 30, 2026",
  dateTime: "2026-09-30",
  readTime: "8 min read",
  href: POST_HREF,
  cover: { pattern: "bars", tint: "violet" },
  author: { name: "Priya Natarajan", role: "Staff engineer" },
}

/** Every post except the featured one, newest first. */
export const posts: Post[] = [
  {
    title: "Introducing preview environments",
    excerpt:
      "Every branch now gets its own URL, variables and a copy of your database. Here is how it works and how to turn it on.",
    category: "Product",
    date: "Sep 22, 2026",
    dateTime: "2026-09-22",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "window", tint: "sky" },
  },
  {
    title: "Fernhill moved 40 services to Lumen in a weekend",
    excerpt:
      "Their platform team replaced a hand-rolled Kubernetes setup and gave every engineer a preview URL. They told us how it went.",
    category: "Customers",
    date: "Sep 17, 2026",
    dateTime: "2026-09-17",
    readTime: "6 min read",
    href: POST_HREF,
    cover: { pattern: "grid", tint: "mint" },
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
    cover: { pattern: "terminal", tint: "sand" },
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
    cover: { pattern: "branch", tint: "sky" },
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
    cover: { pattern: "grid", tint: "rose" },
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
    cover: { pattern: "bars", tint: "panel" },
  },
  {
    title: "A database branch for every pull request",
    excerpt:
      "Preview environments now copy your Postgres schema and a sample of data, then throw it away when the branch merges.",
    category: "Product",
    date: "Jul 8, 2026",
    dateTime: "2026-07-08",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "branch", tint: "mint" },
  },
  {
    title: "What we learned running 38 regions",
    excerpt:
      "Routing, cold starts and the surprising cost of DNS. Notes from two years of running Lumen on six continents.",
    category: "Engineering",
    date: "Jun 24, 2026",
    dateTime: "2026-06-24",
    readTime: "9 min read",
    href: POST_HREF,
    cover: { pattern: "orbit", tint: "panel" },
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
    cover: { pattern: "window", tint: "sand" },
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
    cover: { pattern: "grid", tint: "violet" },
  },
]

/** Categories in the order the filter shows them. */
export const categories = ["Product", "Engineering", "Guides", "Customers", "Company"] as const

/**
 * Post cards and the featured post print the category as a label above the
 * title. Blocks marketing pages carry no labels above headings, so pages pass
 * cards through this to drop it; the category still drives the filter and
 * shows in the meta line of the latest list and the article byline.
 */
export function withoutCategoryLabel(post: Post): Post {
  // An empty string, not undefined: undefined would fall back to the card's default category.
  return { ...post, category: "" }
}

/** Posts shown under the article as further reading. */
export const relatedPosts: Post[] = [posts[4], posts[8], posts[0]]
