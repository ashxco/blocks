"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Notifications } from "@/components/blocks/notifications"

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
      description: "a41c9e2 deployed to web.acme.dev in 31 s.",
      time: "4 min ago",
      kind: "success",
      unread: true,
      href: "/live/app/projects",
    },
  ]}
/>`}
      >
        <Notifications align="center" />
      </Example>

      <Example
        title="All read"
        description="Without unread items the count disappears and the button label says so."
        minHeight="min-h-64"
        surface="subtle"
        code={`<Notifications items={items.map((item) => ({ ...item, unread: false }))} />`}
      >
        <Notifications
          align="center"
          items={[
            {
              id: "r1",
              title: "Certificate issued for status.acme.dev",
              description: "HTTPS is on. The certificate renews automatically.",
              time: "Yesterday",
              kind: "domain",
            },
            {
              id: "r2",
              title: "Invoice for September is ready",
              description: "$240.00 was charged to the card ending 4242.",
              time: "Oct 1",
              kind: "billing",
              href: "/live/app/billing",
            },
          ]}
        />
      </Example>

      <Example
        title="Empty"
        description="A short message in place of the list."
        minHeight="min-h-64"
        code={`<Notifications items={[]} />`}
      >
        <Notifications align="center" items={[]} />
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
