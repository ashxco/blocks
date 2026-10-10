import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { ReleaseShot } from "@/components/blocks/changelog-entry"
import { CodeWindow } from "@/components/blocks/code-window"
import { PostGrid } from "@/components/blocks/post-card"
import { PostCover } from "@/components/blocks/post-card/post-cover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NewsletterBand } from "../_components/newsletter-band"
import { featuredPost, relatedPosts } from "../_data/posts"
import { AuthorCard } from "./_components/author-card"
import { CopyLinkButton } from "./_components/copy-link-button"
import { Prose } from "./_components/prose"
import { PullQuote } from "./_components/pull-quote"
import { TableOfContents, type TocItem } from "./_components/table-of-contents"
import { Kern } from "@/components/ui/kern"

export const metadata: Metadata = {
  title: "Introducing Automations 2.0",
  description:
    "Rules with several steps, conditions and actions in the apps your team already uses: what changed in Automations 2.0, why we rebuilt it and how to set up your first rule.",
}

const sections: TocItem[] = [
  { id: "why-we-rebuilt", title: "Why we rebuilt automations" },
  { id: "several-steps", title: "Rules with more than one step" },
  { id: "conditions", title: "Conditions between steps", level: 3 },
  { id: "recipes", title: "Start from a recipe" },
  { id: "api", title: "Run rules from your own tools" },
  { id: "runs", title: "How runs are counted" },
  { id: "whats-next", title: "What comes next" },
]

const heading = Object.fromEntries(sections.map((s) => [s.id, s.title])) as Record<string, string>

const plans = [
  { plan: "Free", runs: "1,000", price: "$0" },
  { plan: "Pro", runs: "10,000", price: "$12" },
  { plan: "Business", runs: "50,000", price: "$24" },
  { plan: "Enterprise", runs: "Custom", price: "Custom" },
]

const author = {
  name: "Maya Patel",
  role: "Head of Product",
  initials: "MP",
  bio: "Maya leads product at Acme and runs the weekly planning meeting the rest of the company copies. Before Acme she ran operations at a design agency, where she built her first automation in a spreadsheet.",
}

export default function BlogPostPage() {
  return (
    <>
      <article id="article" className="scroll-mt-(--header-height)">
        <header className="container-page pt-section-sm">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-3 lg:pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                nativeButton={false}
                render={<Link href="/live/blog" />}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                All posts
              </Button>
            </div>

            <div className="min-w-0 lg:col-span-9 xl:col-span-8">
              <h1 className="text-h1 text-foreground">
                <Kern>{featuredPost.title}</Kern>
              </h1>
              <p className="mt-6 max-w-prose text-lead text-copy">{featuredPost.excerpt}</p>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback tone="violet">{author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <p className="text-label text-foreground">{author.name}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-caption text-muted-foreground">
                      <time dateTime={featuredPost.dateTime}>{featuredPost.date}</time>
                      <span aria-hidden="true">·</span>
                      <span>{featuredPost.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <Link
                        href="/live/blog"
                        className="rounded-xs font-semibold text-foreground underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
                      >
                        {featuredPost.category}
                      </Link>
                    </p>
                  </div>
                </div>
                <CopyLinkButton />
              </div>
            </div>
          </div>
        </header>

        {/* A short, wide cover so the article starts high. */}
        <div className="container-wide mt-12 md:mt-16">
          <PostCover
            pattern={featuredPost.cover?.pattern}
            tint={featuredPost.cover?.tint}
            figures={featuredPost.cover?.figures}
            className="aspect-16/10 rounded-(--panel-radius) sm:aspect-21/9 lg:aspect-auto lg:h-96"
          />
        </div>

        <div className="container-page py-section-sm">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
                <TableOfContents items={sections} topId="article" />
              </div>
            </div>

            <div className="min-w-0 lg:col-span-8 xl:col-span-7">
              <Prose>
                <p>
                  Teams use automations to move tasks along, remind owners and keep Slack up to date without anyone
                  doing it by hand. Today we are replacing them with Automations 2.0: rules with several steps,
                  conditions between them and actions in the apps your team already uses. Every workspace has it now,
                  and your existing rules keep working.
                </p>

                <h2 id="why-we-rebuilt">{heading["why-we-rebuilt"]}</h2>
                <p>
                  The first version of automations did one thing per rule: when something happened, do one thing. That
                  covered the simple cases, and teams worked around the rest by stacking rules on top of each other.
                  When we asked why, we heard the same three problems.
                </p>
                <ul>
                  <li>
                    <strong>Chains of rules were hard to follow.</strong> One team we spoke to needed 14 rules to
                    handle a single review handoff, and nobody remembered how they fit together.
                  </li>
                  <li>
                    <strong>Every rule ran every time</strong>, even when it only mattered for urgent work, so people
                    muted notifications they actually needed.
                  </li>
                  <li>
                    <strong>Nobody could see what a rule had done</strong> without opening each task it touched.
                  </li>
                </ul>
                <p>We rebuilt the rule engine and the editor around those three problems.</p>

                <h2 id="several-steps">{heading["several-steps"]}</h2>
                <p>
                  A rule now starts with one trigger and runs up to ten steps in order. A step can update the task,
                  notify someone, add a subtask, wait for a set time or post to Slack. Here is the rule our own
                  website team uses:
                </p>
                <figure className="@container overflow-hidden rounded-(--card-radius) border bg-tint-violet">
                  <ReleaseShot />
                </figure>

                <h3 id="conditions">{heading["conditions"]}</h3>
                <p>
                  Add a condition between any two steps, and the rest of the rule runs only when it holds. Conditions
                  can check a task’s priority, assignee, project or due date. The rule above only notifies the owner
                  when the task is High or Urgent; everything else moves to Done quietly.
                </p>
                <PullQuote cite="Hana Kim, co-founder and CEO">
                  The best automation is one you set up once and never think about again.
                </PullQuote>

                <h2 id="recipes">{heading["recipes"]}</h2>
                <p>
                  Most teams want the same handful of rules, so the rule editor now opens with 20 recipes. Pick one,
                  change what you need and turn it on. These are the five our beta teams turned on most:
                </p>
                <ul>
                  <li>Notify the owner when a task moves to Done</li>
                  <li>Remind the assignee a day before a task is due</li>
                  <li>Move a task to In review when every subtask is complete</li>
                  <li>Post new Urgent tasks to a Slack channel</li>
                  <li>Create the next task when a recurring task is completed</li>
                </ul>

                <h2 id="api">{heading["api"]}</h2>
                <p>
                  Rules also run on work that starts outside Acme. A task created through the API triggers the same
                  rules as one created in the app, so a form on your website or a ticket in your help desk can start
                  the whole process:
                </p>
                <CodeWindow />
                <p>
                  Install the SDK with <code>npm install @acme/sdk</code>, then create an API key in Settings. Each key
                  works in one workspace, and read-only keys can never change a task.
                </p>

                <h2 id="runs">{heading["runs"]}</h2>
                <p>
                  Each time a rule acts on a task, that counts as one run, however many steps it has. Runs reset on the
                  first of each month:
                </p>
                <figure className="@container">
                  <Table variant="card" className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-3 @md:px-4">Plan</TableHead>
                        <TableHead className="px-3 text-right @md:px-4">Runs a month</TableHead>
                        <TableHead className="px-3 text-right @md:px-4">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map((row) => (
                        <TableRow key={row.plan}>
                          <TableCell className="px-3 py-3 font-semibold @md:px-4">{row.plan}</TableCell>
                          <TableCell className="px-3 py-3 text-right tabular @md:px-4">{row.runs}</TableCell>
                          <TableCell className="px-3 py-3 text-right tabular @md:px-4">{row.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>Prices per member a month, billed annually.</TableCaption>
                  </Table>
                </figure>
                <p>
                  A rule that would go over your plan’s limit pauses until the first of the next month, and owners get
                  an email at 80% and 100%. Nothing else in your workspace changes.
                </p>

                <h2 id="whats-next">{heading["whats-next"]}</h2>
                <p>Automations 2.0 is the start. Next, we are working on:</p>
                <ul>
                  <li>
                    <strong>Scheduled rules</strong> that run every Monday morning or at the end of each month, not
                    only when something changes.
                  </li>
                  <li>
                    <strong>Rules across projects</strong>, so one rule can watch every project a team owns.
                  </li>
                  <li>
                    <strong>Run reports</strong> on your dashboards, showing which rules run most and what they
                    changed.
                  </li>
                </ul>
                <p>
                  If a rule you need isn’t possible yet, <Link href="/live/contact">tell us about it</Link>. We read
                  every message.
                </p>
              </Prose>

              <AuthorCard {...author} href="/live/blog" className="mt-16" />
            </div>
          </div>
        </div>
      </article>

      <section aria-label="Related posts" className="border-t bg-subtle">
        <PostGrid
          posts={relatedPosts}
          title="Keep reading"
          viewAll={{ label: "All posts", href: "/live/blog" }}
          filter={false}
        />
      </section>

      <NewsletterBand className="container-page py-section" />
    </>
  )
}
