"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import {
  PostCover,
  type CoverFigure,
  type CoverPattern,
  type CoverTint,
} from "@/components/blocks/post-card/post-cover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export {
  PostCover,
  coverPatterns,
  coverTints,
  tintClass,
  tintInkClass,
} from "@/components/blocks/post-card/post-cover"
export type { CoverFigure, CoverPattern, CoverTint, PostCoverProps } from "@/components/blocks/post-card/post-cover"

export interface PostAuthor {
  name: string
  role?: string
  /** Defaults to the first letters of the first and last name. */
  initials?: string
}

export interface Post {
  title: string
  excerpt?: string
  /** Shown first in the meta line under the title. */
  category?: string
  /** Display date, e.g. "Sep 22, 2026". */
  date?: string
  /** Machine-readable date for the <time> element, e.g. "2026-09-22". */
  dateTime?: string
  readTime?: string
  href?: string
  /** Cover shapes and fill. figures feeds the "compare" pattern. */
  cover?: { pattern?: CoverPattern; tint?: CoverTint; figures?: CoverFigure[] }
  author?: PostAuthor
}

export interface PostCardProps extends Partial<Post> {
  /** Heading level of the title. Use h2 when the card sits directly under the page h1. */
  as?: "h2" | "h3"
  className?: string
}

const defaultPost: Post = {
  title: "A database branch for every pull request",
  excerpt:
    "Preview environments now get a copy-on-write branch of your Postgres database, ready in under two seconds and deleted when the pull request closes.",
  category: "Product",
  date: "Oct 7, 2026",
  dateTime: "2026-10-07",
  readTime: "5 min read",
  href: "/live/blog/post",
  cover: { pattern: "branch", tint: "mint" },
}

/** The six newest posts from the Lumen blog template, so docs and pages agree. */
export const defaultPosts: Post[] = [
  defaultPost,
  {
    title: "Live logs from every replica at once",
    excerpt:
      "One command now streams every replica and follows your app through a deploy. Here is how to filter it down to the requests that matter.",
    category: "Product",
    date: "Sep 24, 2026",
    dateTime: "2026-09-24",
    readTime: "4 min read",
    href: "/live/blog/post",
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
    href: "/live/blog/post",
    cover: { pattern: "grid", tint: "sky" },
  },
  {
    title: "Deploy a Next.js app in five minutes",
    excerpt: "Connect a repository, push to main and get a production URL with HTTPS. No config file needed.",
    category: "Guides",
    date: "Sep 12, 2026",
    dateTime: "2026-09-12",
    readTime: "6 min read",
    href: "/live/blog/post",
    cover: { pattern: "window", tint: "rose" },
  },
  {
    title: "Our seed round, and what comes next",
    excerpt: "We raised $8M to keep Lumen open source and build the self-hosted edition teams keep asking for.",
    category: "Company",
    date: "Aug 28, 2026",
    dateTime: "2026-08-28",
    readTime: "3 min read",
    href: "/live/blog/post",
    cover: { pattern: "orbit", tint: "violet" },
  },
  {
    title: "Zero-downtime deploys, explained",
    excerpt: "Health checks, connection draining and the order we swap containers in, step by step.",
    category: "Engineering",
    date: "Aug 14, 2026",
    dateTime: "2026-08-14",
    readTime: "10 min read",
    href: "/live/blog/post",
    cover: { pattern: "uptime", tint: "panel" },
  },
]

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

function PostMeta({
  category,
  date,
  dateTime,
  readTime,
  tone = "default",
  className,
}: Pick<Post, "category" | "date" | "dateTime" | "readTime"> & { tone?: "default" | "panel"; className?: string }) {
  const parts = [
    category ? <span key="category">{category}</span> : null,
    date ? (
      <time key="date" dateTime={dateTime}>
        {date}
      </time>
    ) : null,
    readTime ? <span key="read">{readTime}</span> : null,
  ].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 text-caption",
        tone === "panel" ? "text-panel-muted" : "text-muted-foreground",
        className
      )}
    >
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span aria-hidden="true">·</span> : null}
          {part}
        </React.Fragment>
      ))}
    </p>
  )
}

/**
 * A blog post card: flat tinted cover, title, excerpt, then category, date
 * and reading time in one meta line. The whole card is one link.
 */
export function PostCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  category = defaultPost.category,
  date = defaultPost.date,
  dateTime = defaultPost.dateTime,
  readTime = defaultPost.readTime,
  href = defaultPost.href,
  cover = defaultPost.cover,
  as: Heading = "h3",
  className,
}: PostCardProps) {
  return (
    <article data-slot="post-card" className={cn("min-w-0", className)}>
      <Link
        href={href ?? "#"}
        className="group grid content-start gap-5 rounded-(--card-radius) outline-none focus-visible:focus-ring"
      >
        <PostCover pattern={cover?.pattern} tint={cover?.tint} figures={cover?.figures} />
        <div className="grid gap-2">
          <Heading className="text-h4 text-foreground decoration-foreground/25 decoration-2 underline-offset-4 group-hover:underline">
            {title}
          </Heading>
          {excerpt ? <p className="line-clamp-2 text-body text-copy">{excerpt}</p> : null}
          <PostMeta category={category} date={date} dateTime={dateTime} readTime={readTime} className="mt-1" />
        </div>
      </Link>
    </article>
  )
}

export interface FeaturedPostProps extends Partial<Post> {
  /** "panel" sets the post on a dark emphasis panel. */
  tone?: "default" | "panel"
  as?: "h2" | "h3"
  className?: string
}

const defaultFeatured: Post = {
  title: "How we cut build times by 70%",
  excerpt:
    "Layer caching, a smarter dependency graph and one very slow Docker step. A tour of the build changes we shipped in September, with the numbers.",
  category: "Engineering",
  date: "Sep 30, 2026",
  dateTime: "2026-09-30",
  readTime: "8 min read",
  href: "/live/blog/post",
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

/**
 * The lead story: a large cover beside the title, excerpt and author.
 * Stacks in narrow slots.
 */
export function FeaturedPost({
  title = defaultFeatured.title,
  excerpt = defaultFeatured.excerpt,
  category = defaultFeatured.category,
  date = defaultFeatured.date,
  dateTime = defaultFeatured.dateTime,
  readTime = defaultFeatured.readTime,
  href = defaultFeatured.href,
  cover = defaultFeatured.cover,
  author = defaultFeatured.author,
  tone = "default",
  as: Heading = "h2",
  className,
}: FeaturedPostProps) {
  const panel = tone === "panel"

  return (
    <article
      data-slot="featured-post"
      data-tone={tone}
      className={cn(
        "@container",
        panel && "rounded-(--panel-radius) bg-panel p-3 text-panel-foreground",
        className
      )}
    >
      <Link
        href={href ?? "#"}
        className={cn(
          "group grid items-center gap-8 rounded-(--card-radius) outline-none focus-visible:focus-ring @narrow:grid-cols-12 @narrow:gap-12",
          panel && "@narrow:pr-9"
        )}
      >
        <PostCover
          pattern={cover?.pattern}
          tint={cover?.tint}
          figures={cover?.figures}
          className={cn("@narrow:col-span-7", panel && "rounded-(--card-radius)")}
        />
        <div className={cn("grid gap-4 @narrow:col-span-5", panel && "px-4 pb-6 @narrow:p-0")}>
          <Heading
            className={cn(
              "text-h2 decoration-2 underline-offset-4 group-hover:underline",
              panel ? "text-panel-foreground decoration-panel-foreground/30" : "text-foreground decoration-foreground/25"
            )}
          >
            <Kern>{title}</Kern>
          </Heading>
          {excerpt ? <p className={cn("text-lead", panel ? "text-panel-muted" : "text-copy")}>{excerpt}</p> : null}
          <div className="mt-3 flex items-center gap-3">
            {author ? (
              <Avatar size="lg" className={cn(panel && "after:border-panel-border")}>
                <AvatarFallback
                  tone="violet"
                  className={cn(panel && "bg-panel-raised text-panel-foreground")}
                >
                  {author.initials ?? initialsOf(author.name)}
                </AvatarFallback>
              </Avatar>
            ) : null}
            <div className="grid gap-0.5">
              {author ? (
                <p className={cn("text-label", panel ? "text-panel-foreground" : "text-foreground")}>
                  {author.name}
                  {author.role ? (
                    <span className={cn("font-normal", panel ? "text-panel-muted" : "text-muted-foreground")}>
                      {" "}
                      · {author.role}
                    </span>
                  ) : null}
                </p>
              ) : null}
              <PostMeta category={category} date={date} dateTime={dateTime} readTime={readTime} tone={tone} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export interface PostGridProps {
  posts?: Post[]
  /** Optional heading above the grid, e.g. "Keep reading". */
  title?: React.ReactNode
  /** Link shown beside the heading. */
  viewAll?: { label: string; href: string } | null
  /** Show category filter pills built from the posts' categories. */
  filter?: boolean
  /** Label for the pill that shows every post. */
  allLabel?: string
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

/**
 * A responsive grid of post cards with optional category filters. One
 * column in narrow slots, two from 42rem, three from 52rem.
 */
export function PostGrid({
  posts = defaultPosts,
  title,
  viewAll = null,
  filter = true,
  allLabel = "All",
  contained = true,
  className,
}: PostGridProps) {
  const categories = React.useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [posts]
  )
  const [active, setActive] = React.useState(allLabel)
  const visible = filter && active !== allLabel ? posts.filter((p) => p.category === active) : posts
  const showFilter = filter && categories.length > 1

  return (
    <section
      data-slot="post-grid"
      className={cn(contained && "container-page py-section", className)}
    >
      <div className="@container grid gap-10">
        {title || viewAll ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {title ? <h2 className="text-h3 text-foreground">{title}</h2> : null}
            {viewAll ? (
              <Button variant="ghost" className="-mr-4" nativeButton={false} render={<Link href={viewAll.href} />}>
                {viewAll.label}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ) : null}
          </div>
        ) : null}

        {showFilter ? (
          <ToggleGroup
            aria-label="Filter posts by category"
            variant="outline"
            size="sm"
            value={[active]}
            onValueChange={(value) => {
              if (value[0]) setActive(value[0])
            }}
            className="flex-wrap"
          >
            {[allLabel, ...categories].map((c) => (
              <ToggleGroupItem
                key={c}
                value={c}
                className="px-(--button-padding-x-sm) text-sm"
              >
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : null}

        {visible.length > 0 ? (
          <div className="grid gap-x-6 gap-y-14 @prose:grid-cols-2 @narrow:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post.title} {...post} />
            ))}
          </div>
        ) : (
          <p className="rounded-(--card-radius) border border-dashed p-10 text-center text-body text-muted-foreground">
            No posts in {active} yet.
          </p>
        )}
      </div>
    </section>
  )
}
