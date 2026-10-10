import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

import { ActivityPreview } from "./activity-preview"
import { TemplatePreview } from "./template-preview"

export type AuthShowcaseVariant = "sign-in" | "sign-up" | "reset"

/**
 * Each headline is a list of sentences. A sentence renders as one unit, so the
 * heading wraps between sentences ("Plan the work. / See it get done.")
 * and never mid-clause. A sentence wider than the panel still wraps inside.
 */
const copy: Record<AuthShowcaseVariant, { title: string[]; body: string }> = {
  "sign-in": {
    title: ["Plan the work.", "See it get done."],
    body: "Projects, tasks and docs live in one workspace, with boards, timelines and reports that update as your team works.",
  },
  "sign-up": {
    title: ["Start from a template.", "Bring your team."],
    body: "Pick Product roadmap, Sprint planning or another starter project and invite your team in a minute. Every Pro feature is free for 14 days.",
  },
  reset: {
    title: ["Your work is where you left it."],
    body: "Tasks, docs and automations keep running while you reset your password. Nothing changes until you sign in again.",
  },
}

/**
 * The dark side of the account screens: what Acme does, a product preview
 * that matches the headline, and a customer who runs on it. Sign-in and reset
 * show a project's tasks getting done; sign-up shows a project made from a
 * template filling in and a teammate joining. It fills the sticky aside of the auth
 * templates, at least one viewport tall, so the parts spread out and stay in
 * view. Give it a height (or a flex parent) to fill other slots.
 *
 * Each account screen gets its own headline. The reset screen drops the
 * customer quote: a testimonial is off-key for someone locked out.
 */
export function AuthShowcase({
  variant = "sign-in",
  quote = variant !== "reset",
  className,
}: {
  variant?: AuthShowcaseVariant
  /** Show the customer quote. Off by default on the reset screen. */
  quote?: boolean
  className?: string
}) {
  const { title, body } = copy[variant]
  return (
    <div
      data-variant={variant}
      className={cn(
        // justify-between on every screen: the headline sits at the top and the last part
        // (the quote, or the project preview on the reset screen) at the bottom.
        "flex flex-1 flex-col justify-between gap-10 overflow-hidden rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-muted",
        className
      )}
    >
      {/* text-h3: the form's own h1 leads the screen; this panel supports it. */}
      <div className="grid max-w-prose gap-4">
        <h2 className="text-h3 text-panel-foreground">
          {title.map((sentence, index) => (
            <React.Fragment key={sentence}>
              {index > 0 ? " " : null}
              <span className="inline-block">
                <Kern>{sentence}</Kern>
              </span>
            </React.Fragment>
          ))}
        </h2>
        <p className="max-w-104 text-body">{body}</p>
      </div>

      {variant === "sign-up" ? <TemplatePreview /> : <ActivityPreview />}

      {quote ? <CustomerQuote className="border-t border-panel-border pt-8" /> : null}
    </div>
  )
}

/**
 * The account screens below lg, where the aside is hidden: the customer quote
 * on a small dark panel under the form.
 */
export function AuthShowcaseCompact({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-muted", className)}>
      <CustomerQuote />
    </div>
  )
}

function CustomerQuote({ className }: { className?: string }) {
  return (
    <figure className={cn("m-0 grid gap-6", className)}>
      <blockquote>
        <p className="text-title text-panel-foreground">
          “We replaced three tools and our weekly planning meeting with Acme.”
        </p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {/* Panel colours, not a theme tint, so the avatar looks the same on the panel in both themes. */}
        <Avatar className="after:hidden">
          <AvatarFallback className="bg-panel-raised text-panel-foreground">ER</AvatarFallback>
        </Avatar>
        <span className="grid">
          <span className="text-label text-panel-foreground">Elena Ruiz</span>
          <span className="text-caption">COO, Northwind</span>
        </span>
      </figcaption>
    </figure>
  )
}
