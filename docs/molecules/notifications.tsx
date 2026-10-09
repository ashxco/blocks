"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Notifications, NotificationsPanel, type NotificationItem } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

/** A slice of the app top bar, so the trigger reads in the place it lives. */
function TopBarSlice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-(--header-height-sm) w-full max-w-xl items-center gap-3 rounded-(--card-radius) border bg-background pr-2 pl-5">
      <span className="text-label text-muted-foreground">Acme Inc.</span>
      <span aria-hidden="true" className="text-label text-muted-foreground">
        /
      </span>
      <span className="text-label text-foreground">Overview</span>
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  )
}

const readItems: NotificationItem[] = [
  {
    id: "r1",
    title: "Certificate issued for status.acme.dev",
    description: "HTTPS is on. The certificate renews automatically.",
    time: "1 hr ago",
    kind: "domain",
  },
  {
    id: "r2",
    title: "Invoice for October is ready",
    description: "$39.00 was charged to the Visa ending in 4242.",
    time: "Oct 1",
    kind: "billing",
    href: "/live/app/billing",
  },
]

/** The top bar with the popover's content shown open beneath the bell, so the state is visible without a click. */
function OpenState({ items }: { items: NotificationItem[] }) {
  return (
    <div className="grid w-full max-w-xl justify-items-end gap-2">
      <TopBarSlice>
        <Notifications items={items} />
        <UserMenu />
      </TopBarSlice>
      <NotificationsPanel items={items} className="mr-2" />
    </div>
  )
}

export default function NotificationsDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="The bell shows how many notifications are unread. Opening one marks it as read; Mark all as read clears the count."
        minHeight="min-h-64"
        code={`<Notifications
  items={[
    {
      id: "n1",
      title: "web is live in production",
      description: "a41c9e2 deployed to acme.dev in 28s.",
      time: "2 min ago",
      kind: "success",
      unread: true,
      href: "/live/app/projects",
    },
  ]}
/>`}
      >
        <TopBarSlice>
          <Notifications />
          <UserMenu />
        </TopBarSlice>
      </Example>

      <Example
        title="All read"
        description="Without unread items the count disappears from the bell, the header drops its badge and Mark all as read turns off. Shown open below the bell."
        minHeight="min-h-64"
        surface="subtle"
        code={`<Notifications items={items.map((item) => ({ ...item, unread: false }))} />

// The open state on its own surface, for a notifications page or a sheet
<NotificationsPanel items={items} />`}
      >
        <OpenState items={readItems} />
      </Example>

      <Example
        title="Empty"
        description="With nothing in the last 30 days, a short message takes the place of the list. Shown open below the bell."
        minHeight="min-h-64"
        code={`<Notifications items={[]} />`}
      >
        <OpenState items={[]} />
      </Example>

      <Guidelines
        do={[
          "Write the title as what happened, with the project name first: “Build failed on api”.",
          "Link each notification to the place where people can act on it.",
          "Use the failed kind only for things that need attention.",
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
              "Notifications, newest first. Defaults to five Lumen notifications, three unread.",
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
            description: "Classes for the panel. It is w-sm (24rem) by default and shows every item; cap its height in a sheet.",
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
            type: '"success" | "failed" | "domain" | "invite" | "billing"',
            default: '"success"',
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
