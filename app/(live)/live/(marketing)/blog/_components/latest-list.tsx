import Link from "next/link"
import { ArrowDownIcon } from "lucide-react"

import type { Post } from "@/components/blocks/post-card"
import { PostCover } from "@/components/blocks/post-card/post-cover"

export interface LatestListProps {
  posts: Post[]
  /** Anchor of the full archive on the same page. */
  archiveHref?: string
  className?: string
}

/**
 * A compact, hairline-separated list of recent posts that sits beside the
 * featured story. On large screens the rows stretch to match its height.
 */
export function LatestList({ posts, archiveHref = "#all-posts", className }: LatestListProps) {
  return (
    <section
      aria-labelledby="latest-heading"
      className={`flex min-w-0 flex-col ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <h2 id="latest-heading" className="text-h4 text-foreground">
          Latest
        </h2>
        <Link
          href={archiveHref}
          className="inline-flex items-center gap-1.5 rounded-xs text-label text-muted-foreground outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
        >
          Browse all
          <ArrowDownIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      <ul className="grid lg:flex-1 lg:auto-rows-fr">
        {posts.map((post) => (
          <li key={post.title} className="border-b last:border-b-0">
            <Link
              href={post.href ?? "#"}
              className="group grid h-full grid-cols-[minmax(0,1fr)_6rem] items-center gap-5 rounded-sm py-5 outline-none focus-visible:focus-ring"
            >
              <div className="grid gap-2">
                <h3 className="text-title text-foreground decoration-foreground/25 decoration-2 underline-offset-4 group-hover:underline">
                  {post.title}
                </h3>
                <p className="flex flex-wrap items-center gap-x-2 text-caption text-muted-foreground">
                  {post.category ? <span>{post.category}</span> : null}
                  {post.category && post.date ? <span aria-hidden="true">·</span> : null}
                  {post.date ? <time dateTime={post.dateTime}>{post.date}</time> : null}
                </p>
              </div>
              <PostCover
                pattern={post.cover?.pattern}
                tint={post.cover?.tint}
                className="aspect-4/3 rounded-md"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
