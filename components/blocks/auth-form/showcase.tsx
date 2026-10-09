import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

import { DeployLog } from "./deploy-log"

export type AuthShowcaseVariant = "sign-in" | "sign-up" | "reset"

const copy: Record<AuthShowcaseVariant, { title: string; body: string }> = {
  "sign-in": {
    title: "Push to main. Live in under a minute.",
    body: "Every pull request gets its own preview URL. Every merge rolls out to 38 edge regions, with logs, metrics and instant rollbacks in one place.",
  },
  "sign-up": {
    title: "Connect a repo. Lumen does the rest.",
    body: "Lumen detects your framework, builds on every push and gives each pull request a preview URL. No Dockerfile or YAML to write first.",
  },
  reset: {
    title: "Your deploys keep running.",
    body: "Production stays live while you reset your password. Nothing ships, and nothing is rolled back, until you sign in again.",
  },
}

/**
 * The dark side of the account screens: what Lumen does, a deploy streaming
 * in, and a customer who ships with it. It fills the sticky aside of the auth
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
        "flex flex-1 flex-col gap-10 overflow-hidden rounded-(--panel-radius) bg-panel p-(--panel-padding-sm) text-panel-muted",
        quote ? "justify-between" : "justify-start gap-12",
        className
      )}
    >
      {/* text-h3: the form's own h1 leads the screen; this panel supports it. */}
      <div className="grid max-w-prose gap-4">
        <h2 className="text-h3 text-panel-foreground">
          <Kern>{title}</Kern>
        </h2>
        <p className="max-w-104 text-body">{body}</p>
      </div>

      <DeployLog />

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
          “Release day is gone from our calendar. Main is live 40 seconds after we merge.”
        </p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar className="after:hidden">
          <AvatarFallback tone="sand">HO</AvatarFallback>
        </Avatar>
        <span className="grid">
          <span className="text-label text-panel-foreground">Hannah Okoye</span>
          <span className="text-caption">CTO, Fernhill</span>
        </span>
      </figcaption>
    </figure>
  )
}
