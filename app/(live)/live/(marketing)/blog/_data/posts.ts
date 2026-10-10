import type { Post } from "@/components/blocks/post-card"

/**
 * Acme blog content shared by the blog index and the article template.
 * Dates and features line up with the changelog template: Automations 2.0
 * shipped on Oct 1, the timeline view on Sep 17, guest access on Sep 3,
 * shared dashboards on Aug 20 and recurring tasks on Aug 6. No two posts
 * within a dozen of each other share a cover pattern, and the tints rotate
 * so neighbouring cards always differ.
 */

export const POST_HREF = "/live/blog/post"

export const featuredPost: Post = {
  title: "Introducing Automations 2.0",
  excerpt:
    "Rules with several steps, conditions and actions in the apps your team already uses. Here is what changed, why we rebuilt it and how to set up your first rule.",
  category: "Product",
  date: "Oct 1, 2026",
  dateTime: "2026-10-01",
  readTime: "6 min read",
  href: POST_HREF,
  cover: { pattern: "flow", tint: "violet" },
  author: { name: "Maya Patel", role: "Head of Product" },
}

/** Every post except the featured one, newest first. */
export const posts: Post[] = [
  {
    title: "How we run weekly planning in 30 minutes",
    excerpt:
      "One board, one agenda and a rule that the meeting ends when the board is right. The template we use every Monday, step by step.",
    category: "Guides",
    date: "Sep 29, 2026",
    dateTime: "2026-09-29",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "board", tint: "mint" },
  },
  {
    title: "Designing a calmer inbox",
    excerpt:
      "Fewer pings, smarter grouping and a single place for everything that needs you. How we redesigned the Acme inbox around what people act on.",
    category: "Product",
    date: "Sep 22, 2026",
    dateTime: "2026-09-22",
    readTime: "7 min read",
    href: POST_HREF,
    cover: { pattern: "inbox", tint: "sand" },
  },
  {
    title: "Plan in weeks with the new timeline view",
    excerpt:
      "Drag bars to change dates, link tasks that depend on each other and see clashes before they happen. A tour of timeline view.",
    category: "Product",
    date: "Sep 17, 2026",
    dateTime: "2026-09-17",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "timeline", tint: "sky" },
  },
  {
    title: "How Northwind cut status meetings in half",
    excerpt:
      "Northwind’s operations team replaced three tools and their weekly planning meeting with Acme. Their COO told us what changed.",
    category: "Customers",
    date: "Sep 10, 2026",
    dateTime: "2026-09-10",
    readTime: "6 min read",
    href: POST_HREF,
    cover: {
      pattern: "compare",
      tint: "rose",
      figures: [
        { label: "Status meetings a week, before", value: "4", share: 1 },
        { label: "With Acme", value: "2", share: 0.5 },
      ],
    },
  },
  {
    title: "Guest access for clients and contractors",
    excerpt:
      "Invite the people outside your team to the projects they work on. They see only what you share, and they never take a member seat.",
    category: "Product",
    date: "Sep 3, 2026",
    dateTime: "2026-09-03",
    readTime: "3 min read",
    href: POST_HREF,
    cover: { pattern: "window", tint: "violet" },
  },
  {
    title: "Write a project brief people finish reading",
    excerpt:
      "Five headings, one page and a doc that sits next to the work it describes. Our template for briefs that answer questions before they come up.",
    category: "Guides",
    date: "Aug 27, 2026",
    dateTime: "2026-08-27",
    readTime: "6 min read",
    href: POST_HREF,
    cover: { pattern: "stack", tint: "panel" },
  },
  {
    title: "Shared dashboards for every team",
    excerpt:
      "Share a report with your whole workspace or one team, and send a weekly summary to Slack. The numbers update as tasks move.",
    category: "Product",
    date: "Aug 20, 2026",
    dateTime: "2026-08-20",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "bars", tint: "mint" },
  },
  {
    title: "Fieldstone runs 40 client projects in one workspace",
    excerpt:
      "An agency of 25 people, a guest login for every client and no more status spreadsheets. How Fieldstone set up Acme in a week.",
    category: "Customers",
    date: "Aug 13, 2026",
    dateTime: "2026-08-13",
    readTime: "5 min read",
    href: POST_HREF,
    cover: { pattern: "grid", tint: "sand" },
  },
  {
    title: "Recurring tasks for the work that comes back",
    excerpt:
      "Weekly reports, monthly invoices and the last-Friday budget review. Set them once and the next one appears when you finish the last.",
    category: "Product",
    date: "Aug 6, 2026",
    dateTime: "2026-08-06",
    readTime: "3 min read",
    href: POST_HREF,
    cover: { pattern: "calendar", tint: "sky" },
  },
  {
    title: "Acme now has a SOC 2 Type II report",
    excerpt:
      "What the audit covered, what we changed to pass it and how to request the report for your own security review.",
    category: "Company",
    date: "Jul 23, 2026",
    dateTime: "2026-07-23",
    readTime: "4 min read",
    href: POST_HREF,
    cover: { pattern: "orbit", tint: "rose" },
  },
  {
    title: "Five automations every team should set up",
    excerpt:
      "Notify owners when work is done, chase overdue tasks, hand off to review and two more rules that save our own team hours every week.",
    category: "Guides",
    date: "Jul 9, 2026",
    dateTime: "2026-07-09",
    readTime: "6 min read",
    href: POST_HREF,
    cover: { pattern: "checklist", tint: "violet" },
  },
  {
    title: "Acme for Mac and Windows",
    excerpt:
      "Your tasks and inbox from the menu bar, with notifications you can act on without opening a browser tab.",
    category: "Product",
    date: "Jun 25, 2026",
    dateTime: "2026-06-25",
    readTime: "3 min read",
    href: POST_HREF,
    cover: { pattern: "menubar", tint: "panel" },
  },
  {
    title: "How Meridian Health plans across twelve clinics",
    excerpt:
      "One workspace, a project per clinic and automations that route requests to the right team. Their operations lead walked us through it.",
    category: "Customers",
    date: "Jun 11, 2026",
    dateTime: "2026-06-11",
    readTime: "7 min read",
    href: POST_HREF,
    cover: { pattern: "flow", tint: "mint" },
  },
]

/** Categories in the order the filter shows them. */
export const categories = ["Product", "Guides", "Company", "Customers"] as const

/** How many of the newest posts the "Latest" rail beside the featured post shows. */
export const LATEST_COUNT = 5

function byTitle(title: string): Post {
  const post = posts.find((p) => p.title === title)
  if (!post) throw new Error(`No post titled "${title}"`)
  return post
}

/** Posts shown under the article as further reading. */
export const relatedPosts: Post[] = [
  byTitle("Five automations every team should set up"),
  byTitle("How we run weekly planning in 30 minutes"),
  byTitle("How Northwind cut status meetings in half"),
]
