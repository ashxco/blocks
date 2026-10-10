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
        description="Flat tinted cover, title and a two-line excerpt, then category, date and reading time in one meta line. The whole card is one link."
        code={`<PostCard
  category="Guides"
  title="How we run weekly planning in 30 minutes"
  excerpt="One board, one agenda and a rule that the meeting ends when the board is right…"
  date="Sep 29, 2026"
  readTime="5 min read"
  href="/live/blog/post"
  cover={{ pattern: "board", tint: "mint" }}
/>`}
      >
        <div className="grid w-full max-w-narrow gap-8 @xl:grid-cols-2">
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
        <div className="p-6 @2xl:p-10">
          <FeaturedPost />
        </div>
      </Example>

      <Example
        title="Featured post on a panel"
        layout="full"
        description="Set tone to panel to give the lead story a dark emphasis surface. Use it once per page."
        code={`<FeaturedPost tone="panel" cover={{ pattern: "inbox", tint: "sky" }} />`}
      >
        <div className="p-6 @2xl:p-10">
          <FeaturedPost
            tone="panel"
            title="Designing a calmer inbox"
            excerpt="Fewer pings, smarter grouping and a single place for everything that needs you. How we redesigned the Acme inbox around what people act on."
            category="Product"
            date="Sep 22, 2026"
            dateTime="2026-09-22"
            readTime="7 min read"
            author={{ name: "Sofia Alvarez", role: "Design Lead" }}
            cover={{ pattern: "inbox", tint: "sky" }}
          />
        </div>
      </Example>

      <Example
        title="Post grid with filters"
        layout="full"
        description="A grid of cards with category filters built from the posts. One column on phones, two from 42rem, three from 52rem."
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
        description="Thirteen shape patterns and six fills, so a dozen posts in a row never repeat a cover. The panel fill is the dark emphasis surface; the others are flat tints that follow the theme. The compare pattern draws real figures as bars."
        code={`<PostCover pattern="orbit" tint="sand" />
<PostCover
  pattern="compare"
  figures={[
    { label: "Status meetings a week, before", value: "4", share: 1 },
    { label: "With Acme", value: "2", share: 0.5 },
  ]}
/>`}
      >
        <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
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

      <Example
        title="Cover thumbnails"
        layout="stack"
        description={`For lists of posts, size="sm" draws the whole cover at card size and scales it to a 6rem thumbnail, so each pattern stays recognisable.`}
        code={`<PostCover size="sm" pattern="checklist" tint="panel" />`}
      >
        <div className="flex flex-wrap gap-4">
          {coverPatterns.map((pattern, i) => (
            <PostCover key={pattern} size="sm" pattern={pattern} tint={coverTints[i % coverTints.length]} />
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Write titles that say what the reader will learn or get.",
          "Keep excerpts to two lines; the card clamps anything longer.",
          "Vary cover tints and patterns so neighbouring cards look different; don’t reuse a pattern within twelve posts.",
          "Pick a pattern that matches the story: compare for before and after numbers, flow for automations, calendar for anything scheduled.",
        ]}
        dont={[
          "Don’t use photos with text on them as covers.",
          "Don’t add a second link inside the card; the whole card is the link.",
          "Don’t put more than one featured post on a page.",
          "Don’t add a category label or badge above the title; the meta line carries it.",
        ]}
      />

      <ApiTable
        title="PostCard"
        rows={[
          { prop: "title", type: "string", description: "Post title, in the text-h4 role." },
          { prop: "excerpt", type: "string", description: "Summary, clamped to two lines." },
          { prop: "category", type: "string", description: "First item of the meta line under the title. Also drives the grid filter." },
          { prop: "date", type: "string", description: "Display date." },
          { prop: "dateTime", type: "string", description: "Machine-readable date for the time element." },
          { prop: "readTime", type: "string", description: "e.g. “4 min read”." },
          { prop: "href", type: "string", default: '"/live/blog/post"', description: "Where the card links." },
          { prop: "cover", type: "{ pattern?: CoverPattern; tint?: CoverTint; figures?: CoverFigure[] }", default: '{ pattern: "board", tint: "mint" }', description: "Cover shapes and fill. figures feeds the compare pattern." },
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
          { prop: "posts", type: "Post[]", default: "Six Acme posts", description: "Posts in display order." },
          { prop: "title", type: "ReactNode", description: "Optional heading above the grid." },
          { prop: "viewAll", type: "{ label: string; href: string } | null", description: "Link beside the heading." },
          { prop: "filter", type: "boolean", default: "true", description: "Category filters built from the posts’ categories." },
          { prop: "allLabel", type: "string", default: '"All"', description: "Label of the filter that shows every post." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
        ]}
      />

      <ApiTable
        title="PostCover"
        rows={[
          { prop: "pattern", type: '"window" | "checklist" | "orbit" | "bars" | "grid" | "board" | "compare" | "calendar" | "timeline" | "stack" | "menubar" | "flow" | "inbox"', default: '"window"', description: "Shape composition." },
          { prop: "figures", type: "{ label: string; value: string; share: number }[]", default: "Before 4, after 2", description: "Bars for the compare pattern, longest first. share runs from 0 to 1; the last bar is drawn in ink." },
          { prop: "tint", type: '"violet" | "mint" | "sand" | "sky" | "rose" | "panel"', default: '"violet"', description: "Fill behind the shapes." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "sm is a 6rem × 4.5rem thumbnail with the whole composition scaled down." },
          { prop: "className", type: "string", description: "Override the 16:10 ratio or radius." },
        ]}
      />
    </Examples>
  )
}
