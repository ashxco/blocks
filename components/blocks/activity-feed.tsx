import * as React from "react"
import {
  CircleXIcon,
  DatabaseIcon,
  GlobeIcon,
  KeyRoundIcon,
  RocketIcon,
  Undo2Icon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type ActivityKind =
  "deploy" | "failed" | "rollback" | "domain" | "member" | "env" | "database"

export interface ActivityActor {
  name: string
  /** Shown when there is no image. Defaults to the first letters of the name. */
  initials?: string
  image?: string
  /** Flat tint behind the initials. */
  tint?: "violet" | "mint" | "sand" | "sky" | "rose"
}

export interface ActivityItem {
  id: string
  actor: ActivityActor
  /** Verb phrase, e.g. "deployed". */
  action: string
  /** The object of the action, shown in bold, e.g. "web". */
  target?: string
  /** The rest of the sentence, e.g. "to production". */
  context?: string
  /** A commit message, command or other supporting line, set in mono. */
  detail?: string
  /** Relative time label, e.g. "2 min ago". */
  time: string
  /** Machine-readable time for the <time> element. */
  dateTime?: string
  kind?: ActivityKind
}

export interface ActivityFeedProps {
  items?: ActivityItem[]
  title?: string
  description?: string
  /** Content on the right of the header, such as a "View all" link. */
  action?: React.ReactNode
  /** Show at most this many items. */
  limit?: number
  /** "card" frames the feed; "plain" renders the list only, for columns and sheets. */
  variant?: "card" | "plain"
  className?: string
}

const kinds: Record<
  ActivityKind,
  { icon: LucideIcon; className: string; label: string }
> = {
  deploy: { icon: RocketIcon, className: "text-success", label: "Deployment" },
  failed: {
    icon: CircleXIcon,
    className: "text-destructive",
    label: "Failed build",
  },
  rollback: { icon: Undo2Icon, className: "text-warning", label: "Rollback" },
  domain: { icon: GlobeIcon, className: "text-info", label: "Domain" },
  member: { icon: UserPlusIcon, className: "text-brand", label: "Team" },
  env: {
    icon: KeyRoundIcon,
    className: "text-muted-foreground",
    label: "Environment",
  },
  database: { icon: DatabaseIcon, className: "text-info", label: "Database" },
}

export const defaultActivity: ActivityItem[] = [
  {
    id: "a1",
    actor: { name: "Maya Chen", tint: "violet" },
    action: "deployed",
    target: "web",
    context: "to production",
    detail: "a41c9e2  Fix redirect loop on checkout",
    time: "2 min ago",
    kind: "deploy",
  },
  {
    id: "a2",
    actor: { name: "Lumen", initials: "L", tint: "rose" },
    action: "failed to build",
    target: "api",
    context: "on feat/rate-limits",
    detail: "npm run build exited with code 1",
    time: "18 min ago",
    kind: "failed",
  },
  {
    id: "a3",
    actor: { name: "Daniel Okafor", tint: "sky" },
    action: "added the domain",
    target: "status.acme.dev",
    context: "to docs",
    time: "1 hr ago",
    kind: "domain",
  },
  {
    id: "a4",
    actor: { name: "Priya Shah", tint: "mint" },
    action: "invited",
    target: "sam@acme.dev",
    context: "as a developer",
    time: "3 hr ago",
    kind: "member",
  },
  {
    id: "a5",
    actor: { name: "Leo Martins", tint: "sand" },
    action: "rolled back",
    target: "api",
    context: "to 7f02b1d",
    time: "Yesterday",
    kind: "rollback",
  },
  {
    id: "a6",
    actor: { name: "Maya Chen", tint: "violet" },
    action: "updated 3 environment variables in",
    target: "web",
    context: "for production",
    time: "Yesterday",
    kind: "env",
  },
  {
    id: "a7",
    actor: { name: "Daniel Okafor", tint: "sky" },
    action: "created the database",
    target: "orders-db",
    context: "in Frankfurt",
    time: "2 days ago",
    kind: "database",
  },
]

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/** A list of recent events with the person, what they did and when. */
export function ActivityFeed({
  items = defaultActivity,
  title = "Activity",
  description = "What changed across Acme Inc. in the last few days.",
  action,
  limit,
  variant = "card",
  className,
}: ActivityFeedProps) {
  const shown = typeof limit === "number" ? items.slice(0, limit) : items

  const list = (
    <ol data-slot="activity-feed-list" className="grid">
      {shown.map((item, index) => {
        const kind = item.kind ? kinds[item.kind] : null
        const last = index === shown.length - 1
        return (
          <li
            key={item.id}
            className={cn("relative flex gap-4", !last && "pb-6")}
          >
            {!last ? (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-2 left-[calc(var(--avatar-size-md)/2)] w-px bg-border"
              />
            ) : null}
            <div className="relative shrink-0 self-start">
              <Avatar>
                {item.actor.image ? (
                  <AvatarImage src={item.actor.image} alt="" />
                ) : null}
                <AvatarFallback
                  tone={item.actor.tint ?? "violet"}
                  className="text-xs"
                >
                  {item.actor.initials ?? initialsOf(item.actor.name)}
                </AvatarFallback>
              </Avatar>
              {kind ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-background bg-background"
                >
                  <kind.icon className={cn("size-3", kind.className)} />
                </span>
              ) : null}
            </div>
            <div className="grid min-w-0 flex-1 gap-1.5 pt-1.5">
              <p className="text-label text-copy">
                <span className="text-foreground">{item.actor.name}</span>{" "}
                <span className="font-normal">{item.action}</span>
                {item.target ? (
                  <>
                    {" "}
                    <span className="text-foreground">{item.target}</span>
                  </>
                ) : null}
                {item.context ? (
                  <span className="font-normal"> {item.context}</span>
                ) : null}
                {kind ? <span className="sr-only"> ({kind.label})</span> : null}
              </p>
              {item.detail ? (
                <p className="w-fit max-w-full truncate rounded-xs bg-muted px-2 py-0.5 font-mono text-code text-copy">
                  {item.detail}
                </p>
              ) : null}
              <time
                dateTime={item.dateTime}
                className="text-caption text-muted-foreground"
              >
                {item.time}
              </time>
            </div>
          </li>
        )
      })}
    </ol>
  )

  if (variant === "plain") {
    return (
      <div data-slot="activity-feed" className={className}>
        {list}
      </div>
    )
  }

  return (
    <Card data-slot="activity-feed" className={cn("gap-0 p-0", className)}>
      <div className="flex items-start justify-between gap-4 border-b border-border p-(--card-padding)">
        <div className="grid min-w-0 gap-1">
          <h3 className="text-title text-foreground">{title}</h3>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-(--card-padding)">{list}</div>
    </Card>
  )
}
