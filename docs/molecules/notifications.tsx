"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { cn } from "@/lib/utils"
import { AppTopBarSlice } from "@/components/blocks/app-shell/top-bar"
import { Notifications, NotificationsPanel, type NotificationItem } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

const readItems: NotificationItem[] = [
  {
    id: "r1",
    title: "Elena Ruiz joined as a guest",
    description: "She can open Customer portal. Hana Kim sent the invite.",
    time: "3 hr ago",
    kind: "invite",
    href: "/live/app/team",
  },
  {
    id: "r2",
    title: "Weekly usage: 72% of automation runs used",
    description:
      "7,240 of 10,000 runs this cycle. Owners get an email at 80% and 100%. The count resets on Nov 1.",
    time: "6 hr ago",
    kind: "usage",
    href: "/live/app/billing",
  },
]

/**
 * A top bar with the notifications popover already open under the bell. The
 * popover portals into this stage, so it follows the example's theme and
 * width and stays in place as the page scrolls; clicking elsewhere closes it.
 * The popover is positioned, not in flow, so each stage is as tall as its
 * open popover, which grows in narrow canvases where the text wraps.
 */
function OpenStage({ items, className }: { items?: NotificationItem[]; className: string }) {
  const [stage, setStage] = React.useState<HTMLDivElement | null>(null)
  return (
    <div ref={setStage} className={cn("relative w-full max-w-3xl", className)}>
      <AppTopBarSlice>
        <Notifications items={items} defaultOpen container={stage} />
        <UserMenu />
      </AppTopBarSlice>
    </div>
  )
}

export default function NotificationsDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="The bell shows how many notifications are unread, and each unread one has a violet dot. Opening one marks it as read; Mark all as read clears the count. Shown open; click the bell to close it."
        code={`<Notifications
  items={[
    {
      id: "n1",
      title: "Jordan Lee mentioned you in Mobile app 2.0",
      description: "“Can you confirm the scope for push notifications by Monday?”",
      time: "5 min ago",
      kind: "mention",
      unread: true,
      href: "/live/app/projects",
    },
  ]}
/>`}
      >
        <OpenStage className="min-h-200 @prose:min-h-190" />
      </Example>

      <Example
        title="All read"
        description="Without unread items the count disappears from the bell, the header drops its badge and Mark all as read turns off."
        surface="subtle"
        code={`<Notifications items={items.map((item) => ({ ...item, unread: false }))} />`}
      >
        <OpenStage items={readItems} className="min-h-112 @prose:min-h-107" />
      </Example>

      <Example
        title="Empty"
        description="With nothing in the last 30 days, a short message takes the place of the list."
        code={`<Notifications items={[]} />`}
      >
        <OpenStage items={[]} className="min-h-92 @prose:min-h-84" />
      </Example>

      <Example
        title="On a page"
        description="NotificationsPanel is the popover’s content on its own bordered surface, without the bell, for a notifications page or a mobile sheet. It shows every item; cap its height in a sheet."
        surface="subtle"
        code={`<NotificationsPanel />`}
      >
        <NotificationsPanel />
      </Example>

      <Guidelines
        do={[
          "Write the title as what happened, with the person or project first: “Customer portal is off track”.",
          "Link each notification to the place where people can act on it.",
          "Use the status kind, in red, only for projects that need attention.",
        ]}
        dont={[
          "Don’t notify about actions the person just took themselves.",
          "Don’t let the count grow without bound; show the last 30 days.",
          "Don’t rely on the coloured icon alone; the title must say what happened.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "items",
            type: "NotificationItem[]",
            description:
              "Notifications, newest first. Defaults to five of Maya Patel’s notifications in Acme Inc., three unread.",
          },
          {
            prop: "onMarkRead",
            type: "(ids: string[]) => void",
            description:
              "Called with the ids marked as read, to sync with your backend.",
          },
          {
            prop: "align",
            type: '"start" | "center" | "end"',
            default: '"end"',
            description: "Popover alignment against the bell.",
          },
          {
            prop: "settingsHref",
            type: "string",
            default: '"/live/app/settings"',
            description: "Link to notification settings in the footer.",
          },
          {
            prop: "defaultOpen",
            type: "boolean",
            default: "false",
            description: "Start with the popover open, for a preview of the open state. Focus stays where it is until people use the bell.",
          },
          {
            prop: "container",
            type: "HTMLElement | null",
            description:
              "Portal the popover into this element instead of <body>, e.g. a preview stage. It then stays below the bell and inside the element. null waits until the element exists.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the bell button.",
          },
        ]}
      />
      <ApiTable
        title="NotificationsPanel"
        rows={[
          {
            prop: "items, onMarkRead, settingsHref",
            type: "As Notifications",
            description:
              "The popover's content on its own bordered surface, without the bell. Use it for a notifications page or a mobile sheet.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the panel. It is --popover-width-lg wide by default, like the popover, and shows every item; cap its height in a sheet.",
          },
        ]}
      />
      <ApiTable
        title="NotificationItem"
        rows={[
          { prop: "id", type: "string", description: "Stable key." },
          { prop: "title", type: "string", description: "What happened." },
          {
            prop: "description",
            type: "string",
            description: "One line of detail.",
          },
          { prop: "time", type: "string", description: "Relative time label." },
          {
            prop: "kind",
            type: '"mention" | "due" | "status" | "invite" | "usage"',
            default: '"mention"',
            description: "Picks the icon and its tint.",
          },
          {
            prop: "unread",
            type: "boolean",
            description: "Counts towards the badge and shows a dot.",
          },
          {
            prop: "href",
            type: "string",
            description: "Where the notification leads.",
          },
        ]}
      />
    </Examples>
  )
}
