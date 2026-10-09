"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  FeaturedPost,
  PostCard,
  PostCover,
  PostGrid,
  coverPatterns,
  coverTints,
  defaultPosts,
} from "@/components/blocks/post-card"

export default function PostCardDocs() {
  return (
    <Examples>
      <Example
        title="Post card"
        description="Flat tinted cover, category, title, a two-line excerpt and meta. The whole card is one link."
        code={`<PostCard
  category="Product"
  title="Introducing preview environments"
  excerpt="Every branch now gets its own URL…"
  date="Sep 22, 2026"
  readTime="4 min read"
  href="/live/blog/post"
  cover={{ pattern: "window", tint: "violet" }}
/>`}
      >
        <div className="grid w-full max-w-narrow gap-8 sm:grid-cols-2">
          <PostCard />
          <PostCard {...defaultPosts[3]} />
        </div>
      </Example>

      <Example
        title="Featured post"
        layout="full"
        description="The lead story at the top of the blog: a large cover beside the title, excerpt and author. Stacks in narrow slots."
        code={`<FeaturedPost />`}
      >
        <div className="p-6 sm:p-10">
          <FeaturedPost />
        </div>
      </Example>

      <Example
        title="Featured post on a panel"
        layout="full"
        description="Set tone to panel to give the lead story a dark emphasis surface. Use it once per page."
        code={`<FeaturedPost tone="panel" cover={{ pattern: "branch", tint: "mint" }} />`}
      >
        <div className="p-6 sm:p-10">
          <FeaturedPost
            tone="panel"
            title="Zero-downtime deploys, explained"
            excerpt="Health checks, connection draining and the order we swap containers in, step by step. Everything that happens between git push and live."
            category="Engineering"
            date="Aug 14, 2026"
            dateTime="2026-08-14"
            readTime="10 min read"
            author={{ name: "Tom Lindqvist", role: "Infrastructure" }}
            cover={{ pattern: "branch", tint: "mint" }}
          />
        </div>
      </Example>

      <Example
        title="Post grid with filters"
        layout="full"
        description="A grid of cards with category pills built from the posts. One column on phones, two from 42rem, three from 52rem."
        code={`<PostGrid />`}
      >
        <PostGrid />
      </Example>

      <Example
        title="Related posts"
        layout="full"
        surface="subtle"
        description="Turn the filters off and add a heading and a link for the end of an article."
        code={`<PostGrid
  title="Keep reading"
  viewAll={{ label: "All posts", href: "/live/blog" }}
  filter={false}
  posts={posts.slice(0, 3)}
/>`}
      >
        <PostGrid
          title="Keep reading"
          viewAll={{ label: "All posts", href: "/live/blog" }}
          filter={false}
          posts={defaultPosts.slice(0, 3)}
        />
      </Example>

      <Example
        title="Covers"
        layout="stack"
        description="Six shape patterns and six fills. The panel fill is the dark emphasis surface; the others are flat tints that follow the theme."
        code={`<PostCover pattern="orbit" tint="sand" />`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverPatterns.map((pattern, i) => (
            <figure key={pattern} className="grid gap-2">
              <PostCover pattern={pattern} tint={coverTints[i % coverTints.length]} />
              <figcaption className="font-mono text-caption text-muted-foreground">
                {pattern} · {coverTints[i % coverTints.length]}
              </figcaption>
            </figure>
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Write titles that say what the reader will learn or get.",
          "Keep excerpts to two lines; the card clamps anything longer.",
          "Vary cover tints and patterns so neighbouring cards look different.",
        ]}
        dont={[
          "Don’t use photos with text on them as covers.",
          "Don’t add a second link inside the card; the whole card is the link.",
          "Don’t put more than one featured post on a page.",
        ]}
      />

      <ApiTable
        title="PostCard"
        rows={[
          { prop: "title", type: "string", description: "Post title, in the text-h4 role." },
          { prop: "excerpt", type: "string", description: "Summary, clamped to two lines." },
          { prop: "category", type: "string", description: "Shown in brand violet above the title." },
          { prop: "date", type: "string", description: "Display date." },
          { prop: "dateTime", type: "string", description: "Machine-readable date for the time element." },
          { prop: "readTime", type: "string", description: "e.g. “4 min read”." },
          { prop: "href", type: "string", default: '"/live/blog/post"', description: "Where the card links." },
          { prop: "cover", type: "{ pattern?: CoverPattern; tint?: CoverTint }", default: '{ pattern: "window", tint: "violet" }', description: "Cover shapes and fill." },
          { prop: "as", type: '"h2" | "h3"', default: '"h3"', description: "Heading level of the title." },
        ]}
      />

      <ApiTable
        title="FeaturedPost"
        rows={[
          { prop: "…Post", type: "Post", description: "Same content props as PostCard." },
          { prop: "author", type: "{ name: string; role?: string; initials?: string }", description: "Byline with an initials avatar." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Set the post on a dark panel." },
          { prop: "as", type: '"h2" | "h3"', default: '"h2"', description: "Heading level of the title." },
        ]}
      />

      <ApiTable
        title="PostGrid"
        rows={[
          { prop: "posts", type: "Post[]", default: "Six Lumen posts", description: "Posts in display order." },
          { prop: "title", type: "ReactNode", description: "Optional heading above the grid." },
          { prop: "viewAll", type: "{ label: string; href: string } | null", description: "Link beside the heading." },
          { prop: "filter", type: "boolean", default: "true", description: "Category pills built from the posts’ categories." },
          { prop: "allLabel", type: "string", default: '"All"', description: "Label of the pill that shows every post." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
        ]}
      />

      <ApiTable
        title="PostCover"
        rows={[
          { prop: "pattern", type: '"window" | "terminal" | "orbit" | "bars" | "grid" | "branch"', default: '"window"', description: "Shape composition." },
          { prop: "tint", type: '"violet" | "mint" | "sand" | "sky" | "rose" | "panel"', default: '"violet"', description: "Fill behind the shapes." },
          { prop: "className", type: "string", description: "Override the 16:10 ratio or radius." },
        ]}
      />
    </Examples>
  )
}
