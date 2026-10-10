import * as React from "react"
import {
  CalendarClockIcon,
  CircleCheckIcon,
  FileTextIcon,
  FlagIcon,
  MessageSquareIcon,
  UserPlusIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { personTone, type PersonTone } from "@/components/blocks/members-list/people"
import { BrandMark } from "@/components/blocks/wordmark"

export type ActivityKind =
  "task" | "comment" | "status" | "due" | "automation" | "doc" | "member"

export interface ActivityActor {
  name: string
  /** Shown when there is no image. Defaults to the first letters of the name. */
  initials?: string
  image?: string
  /**
   * Flat tint behind the initials. Defaults to the person's tint from the
   * shared people list, so a name has one colour on every page.
   */
  tone?: PersonTone
  /** The product itself (automations, reminders): drawn as the Acme mark instead of initials. */
  system?: boolean
}

export interface ActivityItem {
  id: string
  actor: ActivityActor
  /** Verb phrase, e.g. "completed". */
  action: string
  /** The object of the action, shown in bold, e.g. "Homepage hero copy". */
  target?: string
  /** The rest of the sentence, e.g. "in Website relaunch". */
  context?: string
  /** A task key or other short code that ends the sentence, set in mono: "WEB-142". */
  code?: string
  /** A comment, status update or automation rule, quoted under the sentence. */
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
  task: { icon: CircleCheckIcon, className: "text-success", label: "Task completed" },
  comment: { icon: MessageSquareIcon, className: "text-info", label: "Comment" },
  status: { icon: FlagIcon, className: "text-warning", label: "Status change" },
  due: { icon: CalendarClockIcon, className: "text-muted-foreground", label: "Due date" },
  automation: { icon: ZapIcon, className: "text-brand", label: "Automation" },
  doc: { icon: FileTextIcon, className: "text-info", label: "Doc" },
  member: { icon: UserPlusIcon, className: "text-brand", label: "Team" },
}

/** What happened in Acme Inc. this week. The dashboard shows the first three. */
export const defaultActivity: ActivityItem[] = [
  {
    id: "a1",
    actor: { name: "Sofia Alvarez" },
    action: "completed",
    target: "Homepage hero copy",
    context: "in Website relaunch",
    time: "4 min ago",
    kind: "task",
  },
  {
    id: "a2",
    actor: { name: "Acme", system: true },
    action: "notified",
    target: "Priya Raman",
    context: "that Homepage hero copy is done",
    detail: "When a task moves to Done, notify the owner",
    time: "4 min ago",
    kind: "automation",
  },
  {
    id: "a3",
    actor: { name: "Jordan Lee" },
    action: "marked",
    target: "Mobile app 2.0",
    context: "as at risk",
    detail: "Push notifications slip a week while we wait for the app store review. Everything else is on plan.",
    time: "34 min ago",
    kind: "status",
  },
  {
    id: "a4",
    actor: { name: "Sam Okafor" },
    action: "commented on",
    target: "Export invoices as CSV",
    context: "in Customer portal",
    detail: "Northwind needs this before their Q4 close. Can we pull it into this sprint?",
    time: "2 hr ago",
    kind: "comment",
  },
  {
    id: "a5",
    actor: { name: "Hana Kim" },
    action: "invited",
    target: "elena@northwind.com",
    context: "as a guest on Customer portal",
    time: "3 hr ago",
    kind: "member",
  },
  {
    id: "a6",
    actor: { name: "Daniel Brooks" },
    action: "moved 6 tasks in",
    target: "Billing migration",
    context: "to the week of Oct 12",
    time: "Yesterday",
    kind: "due",
  },
  {
    id: "a7",
    actor: { name: "Maya Patel" },
    action: "created the doc",
    target: "Q4 planning: goals and owners",
    time: "2 days ago",
    kind: "doc",
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
              {item.actor.system ? (
                // The product's own events carry its mark, so they never read as a person called "A".
                <BrandMark className="size-(--avatar-size-md)" />
              ) : (
                <Avatar>
                  {item.actor.image ? (
                    <AvatarImage src={item.actor.image} alt="" />
                  ) : null}
                  <AvatarFallback
                    tone={item.actor.tone ?? personTone(item.actor.name)}
                    className="text-xs"
                  >
                    {item.actor.initials ?? initialsOf(item.actor.name)}
                  </AvatarFallback>
                </Avatar>
              )}
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
                {item.code ? (
                  <>
                    {" "}
                    {/* inline-block keeps a task key whole on one line; it only wraps when it is wider than the column. */}
                    <code className="inline-block max-w-full font-mono text-code font-normal break-words text-foreground">
                      {item.code}
                    </code>
                  </>
                ) : null}
                {kind ? <span className="sr-only"> ({kind.label})</span> : null}
              </p>
              {item.detail ? (
                // Wraps instead of truncating: a comment or a status update is only useful whole.
                <p className="w-fit max-w-full rounded-sm bg-muted px-3 py-2 text-sm break-words text-copy">
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
