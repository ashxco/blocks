import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDownIcon, HistoryIcon } from "lucide-react"

import { FeaturedPost } from "@/components/blocks/post-card"
import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"

import { BlogIndex } from "./_components/blog-index"
import { LatestList } from "./_components/latest-list"
import { NewsletterBand } from "./_components/newsletter-band"
import { LATEST_COUNT, categories, featuredPost, posts } from "./_data/posts"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product news, practical guides, customer stories and company updates from the team building Acme.",
}

export default function BlogPage() {
  return (
    <>
      <header className="container-page pt-section-sm pb-14 md:pb-20">
        <SectionHeading
          as="h1"
          title={
            <>
              Notes from the team building <span className="text-brand">Acme</span>.
            </>
          }
          description="Product updates, guides for planning and running projects, and stories from teams who work in Acme. A new post most weeks."
        >
          <Button nativeButton={false} render={<Link href="#newsletter" />}>
            Get posts by email
            <ArrowDownIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/live/changelog" />}>
            <HistoryIcon data-icon="inline-start" />
            Read the changelog
          </Button>
        </SectionHeading>
      </header>

      <div className="container-page pb-section-sm">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <FeaturedPost {...featuredPost} tone="panel" as="h2" className="min-w-0 lg:col-span-8" />
          <LatestList posts={posts.slice(0, LATEST_COUNT)} className="lg:col-span-4" />
        </div>
      </div>

      <BlogIndex posts={posts} categories={categories} skip={LATEST_COUNT} />

      <NewsletterBand />
    </>
  )
}
