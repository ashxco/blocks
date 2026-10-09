import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDownIcon, HistoryIcon } from "lucide-react"

import { FeaturedPost } from "@/components/blocks/post-card"
import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"

import { BlogIndex } from "./_components/blog-index"
import { LatestList } from "./_components/latest-list"
import { NewsletterBand } from "./_components/newsletter-band"
import { categories, featuredPost, posts, withoutCategoryLabel } from "./_data/posts"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product news, engineering deep dives and practical guides from the team building Lumen, the deployment platform.",
}

export default function BlogPage() {
  return (
    <>
      <header className="container-page pt-section-sm pb-14 md:pb-20">
        <SectionHeading
          as="h1"
          title={
            <>
              Notes from the team building <span className="text-brand">Lumen</span>.
            </>
          }
          description="Product updates, engineering deep dives and practical guides for shipping on Lumen. A new post every other Tuesday."
        >
          <Button nativeButton={false} render={<Link href="#newsletter" />}>
            Get posts by email
            <ArrowDownIcon data-icon="inline-end" />
          </Button>
          <Button variant="ghost" nativeButton={false} render={<Link href="/live/changelog" />}>
            <HistoryIcon data-icon="inline-start" />
            Read the changelog
          </Button>
        </SectionHeading>
      </header>

      <div className="container-page pb-section-sm">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <FeaturedPost {...withoutCategoryLabel(featuredPost)} tone="panel" as="h2" className="min-w-0 lg:col-span-8" />
          <LatestList posts={posts.slice(0, 5)} className="lg:col-span-4" />
        </div>
      </div>

      <BlogIndex posts={posts} categories={categories} />

      <NewsletterBand />
    </>
  )
}
