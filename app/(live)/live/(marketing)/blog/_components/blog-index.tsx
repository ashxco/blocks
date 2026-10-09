"use client"

import * as React from "react"

import { PostGrid, type Post } from "@/components/blocks/post-card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { withoutCategoryLabel } from "../_data/posts"

const ALL = "All"
const PAGE_SIZE = 9

export interface BlogIndexProps {
  posts: Post[]
  /** Filter chips, in display order. "All" is added in front. */
  categories: readonly string[]
}

/**
 * The archive: a heading with category filter chips, the post grid and a
 * "Show more" button that reveals the next page in place.
 */
export function BlogIndex({ posts, categories }: BlogIndexProps) {
  const [category, setCategory] = React.useState<string>(ALL)
  const [limit, setLimit] = React.useState(PAGE_SIZE)

  const filtered = category === ALL ? posts : posts.filter((post) => post.category === category)
  const visible = filtered.slice(0, limit)
  const remaining = filtered.length - visible.length

  return (
    <section
      id="all-posts"
      aria-labelledby="all-posts-heading"
      className="container-page scroll-mt-(--header-height) pb-section"
    >
      <div className="grid gap-8 border-t pt-section-sm lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-12">
        <h2 id="all-posts-heading" className="text-h2 text-foreground">
          All posts
        </h2>

        {/* Chips scroll sideways on phones instead of wrapping into a ragged block. */}
        <div className="-mx-gutter overflow-x-auto px-gutter [scrollbar-width:none] lg:mx-0 lg:justify-self-end lg:px-0">
          <ToggleGroup
            aria-label="Filter posts by category"
            variant="outline"
            size="sm"
            value={[category]}
            onValueChange={(value) => {
              const next = value[0]
              if (!next) return
              setCategory(next)
              setLimit(PAGE_SIZE)
            }}
            className="w-max"
          >
            {[ALL, ...categories].map((item) => (
              <ToggleGroupItem key={item} value={item} className="px-(--button-padding-x-sm) text-sm">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <PostGrid posts={visible.map(withoutCategoryLabel)} filter={false} contained={false} className="mt-12" />

      <p role="status" className="sr-only">
        {category === ALL
          ? `Showing ${visible.length} of ${filtered.length} posts`
          : `Showing ${visible.length} of ${filtered.length} posts in ${category}`}
      </p>

      {remaining > 0 ? (
        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setLimit((current) => current + PAGE_SIZE)}>
            Show more posts
          </Button>
        </div>
      ) : null}
    </section>
  )
}
