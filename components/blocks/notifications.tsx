"use client"

import * as React from "react"
import Link from "next/link"
import {
  BellIcon,
  CheckCheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  CreditCardIcon,
  GlobeIcon,
  SettingsIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type NotificationKind =
  "success" | "failed" | "domain" | "invite" | "billing"

export interface NotificationItem {
  id: string
  title: string
  description?: string
  /** Relative time label, e.g. "4 min ago". */
  time: string
  kind?: NotificationKind
  unread?: boolean
  /** Where the notification leads. */
  href?: string
}

export interface NotificationsProps {
  items?: NotificationItem[]
  /** Called with the ids that were marked as read. */
  onMarkRead?: (ids: string[]) => void
  /** Popover alignment against the bell. */
  align?: "start" | "center" | "end"
  /** Link in the footer to the notification settings. */
  settingsHref?: string
  className?: string
}

const kinds: Record<NotificationKind, { icon: LucideIcon; className: string }> =
  {
    success: {
      icon: CircleCheckIcon,
      className: "bg-success-subtle text-success",
    },
    failed: {
      icon: CircleXIcon,
      className: "bg-destructive-subtle text-destructive",
    },
    domain: { icon: GlobeIcon, className: "bg-info-subtle text-info" },
    invite: { icon: UserPlusIcon, className: "bg-brand-subtle text-brand" },
    billing: {
      icon: CreditCardIcon,
      className: "bg-warning-subtle text-warning",
    },
  }

export const defaultNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "web is live in production",
    description: "a41c9e2 deployed to web.acme.dev in 31 s.",
    time: "4 min ago",
    kind: "success",
    unread: true,
    href: "/live/app/projects",
  },
  {
    id: "n2",
    title: "Build failed on api",
    description: "feat/rate-limits: npm run build exited with code 1.",
    time: "18 min ago",
    kind: "failed",
    unread: true,
    href: "/live/app/projects",
  },
  {
    id: "n3",
    title: "Sam Rivera joined Acme Inc.",
    description: "They accepted your invite and can now deploy.",
    time: "2 hr ago",
    kind: "invite",
    unread: true,
    href: "/live/app/team",
  },
  {
    id: "n4",
    title: "Certificate issued for status.acme.dev",
    description: "HTTPS is on. The certificate renews automatically.",
    time: "Yesterday",
    kind: "domain",
    href: "/live/app/projects",
  },
  {
    id: "n5",
    title: "You have used 80% of your build minutes",
    description:
      "2,400 of 3,000 minutes this cycle. The cycle resets on Nov 1.",
    time: "2 days ago",
    kind: "billing",
    href: "/live/app/billing",
  },
]

/**
 * A bell with an unread count that opens a popover of recent notifications.
 * Selecting a notification marks it as read; "Mark all as read" clears the count.
 */
export function Notifications({
  items = defaultNotifications,
  onMarkRead,
  align = "end",
  settingsHref = "/live/app/settings",
  className,
}: NotificationsProps) {
  const [list, setList] = React.useState(items)
  const [open, setOpen] = React.useState(false)

  const unread = list.filter((item) => item.unread).length

  function markRead(ids: string[]) {
    if (ids.length === 0) return
    setList((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, unread: false } : item
      )
    )
    onMarkRead?.(ids)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative", className)}
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
          />
        }
      >
        <BellIcon />
        {unread > 0 ? (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full border-2 border-background bg-brand px-1 text-xs leading-none font-bold text-brand-foreground tabular"
          >
            {unread}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        className="w-96 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <PopoverTitle render={<h2 />} className="flex items-center gap-2">
            <span className="text-title text-foreground">Notifications</span>
            {unread > 0 ? <Badge variant="brand">{unread} new</Badge> : null}
          </PopoverTitle>
          <Button
            variant="ghost"
            size="xs"
            disabled={unread === 0}
            onClick={() =>
              markRead(
                list.filter((item) => item.unread).map((item) => item.id)
              )
            }
          >
            <CheckCheckIcon data-icon="inline-start" />
            Mark all as read
          </Button>
        </div>

        {list.length === 0 ? (
          <div className="grid place-items-center gap-2 px-6 py-12 text-center">
            <BellIcon
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
            <p className="text-label text-foreground">You are all caught up</p>
            <p className="text-caption text-muted-foreground">
              Deployments, invites and billing alerts show up here.
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto overscroll-contain">
            <ul className="grid p-(--overlay-padding)">
              {list.map((item) => {
                const kind = kinds[item.kind ?? "success"]
                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm",
                        kind.className
                      )}
                    >
                      <kind.icon className="size-4" />
                    </span>
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="text-label text-foreground">
                        {item.title}
                      </span>
                      {item.description ? (
                        <span className="text-caption text-copy">
                          {item.description}
                        </span>
                      ) : null}
                      <span className="text-caption text-muted-foreground">
                        {item.time}
                      </span>
                    </span>
                    {item.unread ? (
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-brand">
                        <span className="sr-only">Unread</span>
                      </span>
                    ) : (
                      <span aria-hidden="true" className="size-2 shrink-0" />
                    )}
                  </>
                )
                const itemClass = cn(
                  "flex w-full items-start gap-3 rounded-(--overlay-item-radius) p-3 text-left outline-none",
                  "transition-colors duration-(--duration-fast) ease-standard hover:bg-accent focus-visible:focus-ring",
                  item.unread && "bg-muted"
                )
                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={itemClass}
                        onClick={() => {
                          markRead([item.id])
                          setOpen(false)
                        }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={itemClass}
                        onClick={() => markRead([item.id])}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5">
          <p className="text-caption text-muted-foreground">
            Showing the last 30 days
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notification settings"
            nativeButton={false}
            render={<Link href={settingsHref} onClick={() => setOpen(false)} />}
          >
            <SettingsIcon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
