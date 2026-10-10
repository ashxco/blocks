"use client"

import * as React from "react"
import Link from "next/link"
import {
  AtSignIcon,
  BellIcon,
  CalendarClockIcon,
  CheckCheckIcon,
  FlagIcon,
  GaugeIcon,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type NotificationKind = "mention" | "due" | "status" | "invite" | "usage"

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
  /**
   * Start with the popover open, for previews of the open state. Focus stays
   * where it is until people use the bell.
   */
  defaultOpen?: boolean
  /**
   * Element to portal the popover into instead of <body>, e.g. a preview
   * stage. The popover then keeps to its side of the bell inside it.
   */
  container?: HTMLElement | null
  className?: string
}

const kinds: Record<NotificationKind, { icon: LucideIcon; className: string }> =
  {
    mention: { icon: AtSignIcon, className: "bg-brand-subtle text-brand" },
    due: { icon: CalendarClockIcon, className: "bg-info-subtle text-info" },
    status: {
      icon: FlagIcon,
      className: "bg-destructive-subtle text-destructive",
    },
    invite: { icon: UserPlusIcon, className: "bg-success-subtle text-success" },
    usage: { icon: GaugeIcon, className: "bg-warning-subtle text-warning" },
  }

/** Maya Patel’s notifications in Acme Inc.: three unread. */
export const defaultNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Jordan Lee mentioned you in Mobile app 2.0",
    description: "“Can you confirm the scope for push notifications by Monday?”",
    time: "5 min ago",
    kind: "mention",
    unread: true,
    href: "/live/app/projects",
  },
  {
    id: "n2",
    title: "3 of your tasks are due Monday",
    description: "Approve Q4 budget, Review pricing page copy and 1 more.",
    time: "1 hr ago",
    kind: "due",
    unread: true,
    href: "/live/app/projects",
  },
  {
    id: "n3",
    title: "Customer portal is off track",
    description: "Sam Okafor changed the status and posted an update.",
    time: "2 hr ago",
    kind: "status",
    unread: true,
    href: "/live/app/projects",
  },
  {
    id: "n4",
    title: "Elena Ruiz joined as a guest",
    description: "She can open Customer portal. Hana Kim sent the invite.",
    time: "3 hr ago",
    kind: "invite",
    href: "/live/app/team",
  },
  {
    id: "n5",
    title: "Weekly usage: 72% of automation runs used",
    description:
      "7,240 of 10,000 runs this cycle. Owners get an email at 80% and 100%. The count resets on Nov 1.",
    time: "6 hr ago",
    kind: "usage",
    href: "/live/app/billing",
  },
]

/** The list and its read state, shared by the popover and the inline panel. */
function useNotificationList(
  items: NotificationItem[],
  onMarkRead?: (ids: string[]) => void
) {
  const [list, setList] = React.useState(items)
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

  return { list, unread, markRead }
}

/**
 * A bell with an unread count that opens a popover of recent notifications.
 * Selecting a notification marks it as read; "Mark all as read" clears the count.
 */
export function Notifications({
  items = defaultNotifications,
  onMarkRead,
  align = "end",
  settingsHref = "/live/app/settings",
  defaultOpen = false,
  container,
  className,
}: NotificationsProps) {
  const { list, unread, markRead } = useNotificationList(items, onMarkRead)
  const [open, setOpen] = React.useState(defaultOpen)
  // Opened on load rather than by people: leave focus on the page.
  const [shownOnLoad, setShownOnLoad] = React.useState(defaultOpen)

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setShownOnLoad(false)
        setOpen(next)
      }}
    >
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
            // Ink, like other counts in the app: the accent stays for the unread dots inside.
            className="absolute top-1 right-1 grid h-4.5 min-w-4.5 place-items-center rounded-(--badge-radius) border-2 border-background bg-primary px-1 text-xs leading-none font-bold text-primary-foreground tabular"
          >
            {unread}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        container={container}
        initialFocus={shownOnLoad ? false : undefined}
        // In a preview stage the popup keeps below its trigger and within the stage.
        collisionAvoidance={container ? { side: "none" } : undefined}
        collisionBoundary={container ?? undefined}
        // As tall as the list, up to the room below a top bar; only then does the list scroll. Capping it
        // there keeps it below the bell on short screens instead of flipping beside it. In a preview stage
        // it shows every item.
        className={cn(
          "@container/notifications w-(--popover-width-lg) gap-0 overflow-hidden p-0",
          container ? "max-h-none" : "max-h-[min(var(--available-height),calc(100dvh-var(--header-height)-1rem))]"
        )}
      >
        <NotificationsContent
          list={list}
          unread={unread}
          markRead={markRead}
          settingsHref={settingsHref}
          onNavigate={() => setOpen(false)}
          inPopover
        />
      </PopoverContent>
    </Popover>
  )
}

/**
 * The notifications popover's content on its own surface, without the bell:
 * for a notifications page, a mobile sheet or a preview of the open state.
 */
export function NotificationsPanel({
  items = defaultNotifications,
  onMarkRead,
  settingsHref = "/live/app/settings",
  className,
}: Omit<NotificationsProps, "align">) {
  const { list, unread, markRead } = useNotificationList(items, onMarkRead)

  return (
    <div
      data-slot="notifications-panel"
      className={cn(
        "@container/notifications flex w-(--popover-width-lg) max-w-full flex-col overflow-hidden rounded-(--overlay-radius) border border-popover-border bg-popover text-sm text-popover-foreground",
        className
      )}
    >
      <NotificationsContent
        list={list}
        unread={unread}
        markRead={markRead}
        settingsHref={settingsHref}
      />
    </div>
  )
}

function NotificationsContent({
  list,
  unread,
  markRead,
  settingsHref,
  onNavigate,
  inPopover = false,
}: {
  list: NotificationItem[]
  unread: number
  markRead: (ids: string[]) => void
  settingsHref: string
  onNavigate?: () => void
  inPopover?: boolean
}) {
  const headerRef = React.useRef<HTMLDivElement>(null)
  const narrow = useNarrowPanel(headerRef)
  const heading = (
    <>
      <span className="text-title text-foreground">Notifications</span>
      {unread > 0 ? <Badge variant="secondary">{unread} new</Badge> : null}
    </>
  )

  return (
    <>
      <div ref={headerRef} className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3">
        {inPopover ? (
          <PopoverTitle render={<h2 />} className="flex items-center gap-2">
            {heading}
          </PopoverTitle>
        ) : (
          <h2 className="flex items-center gap-2">{heading}</h2>
        )}
        {/* In a narrow panel the action keeps only its icon: its name stays for screen readers and
            shows as a tooltip on hover and keyboard focus. Wide, the tooltip is off; the label is visible. */}
        <Tooltip disabled={!narrow}>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="xs"
                disabled={unread === 0}
                onClick={() =>
                  markRead(list.filter((item) => item.unread).map((item) => item.id))
                }
                className="shrink-0 @max-[22rem]/notifications:w-(--button-height-xs) @max-[22rem]/notifications:px-0"
              />
            }
          >
            <CheckCheckIcon data-icon="inline-start" />
            <span className="@max-[22rem]/notifications:sr-only">Mark all as read</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Mark all as read</TooltipContent>
        </Tooltip>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center gap-2 px-6 py-12 text-center">
          <BellIcon
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
          <p className="text-label text-foreground">You are all caught up</p>
          <p className="text-caption text-muted-foreground">
            Mentions, due dates and status changes show up here.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ul className="grid p-(--overlay-padding)">
            {list.map((item) => {
              const kind = kinds[item.kind ?? "mention"]
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
                // accent/60 sits apart from bg-popover in both themes; bg-muted
                // matches the popover in dark.
                item.unread && "bg-accent/60"
              )
              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={itemClass}
                      onClick={() => {
                        markRead([item.id])
                        onNavigate?.()
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

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-4 py-2.5">
        <p className="text-caption text-muted-foreground">
          Showing the last 30 days
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notification settings"
          nativeButton={false}
          render={<Link href={settingsHref} onClick={onNavigate} />}
        >
          <SettingsIcon />
        </Button>
      </div>
    </>
  )
}

/** The width below which the header's "Mark all as read" keeps only its icon (the @max-[22rem] queries). */
const NARROW_PANEL_REM = 22

/**
 * Whether the panel is narrower than 22rem, measured on its full-width header,
 * so the icon-only action can show its name as a tooltip. The CSS container
 * queries do the visual collapse; this only switches the tooltip on.
 */
function useNarrowPanel(ref: React.RefObject<HTMLElement | null>) {
  const [narrow, setNarrow] = React.useState(false)
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      setNarrow(width < NARROW_PANEL_REM * rem)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return narrow
}
