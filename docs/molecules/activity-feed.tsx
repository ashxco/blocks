"use client"

import Link from "next/link"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  ActivityFeed,
  type ActivityItem,
} from "@/components/blocks/activity-feed"

/** The history of one project, for the plain example. */
const portalHistory: ActivityItem[] = [
  {
    id: "p1",
    actor: { name: "Sam Okafor" },
    action: "marked",
    target: "Customer portal",
    context: "as off track",
    detail: "SSO for portal users needs a security review we can’t finish before Oct 23. Proposing Nov 6.",
    time: "2 hr ago",
    kind: "status",
  },
  {
    id: "p2",
    actor: { name: "Jordan Lee" },
    action: "completed",
    target: "Invoice list with filters",
    code: "CP-118",
    time: "Yesterday",
    kind: "task",
  },
  {
    id: "p3",
    actor: { name: "Acme", system: true },
    action: "reminded",
    target: "Sam Okafor",
    context: "that 4 tasks are due this week",
    time: "Monday",
    kind: "due",
  },
]

export default function ActivityFeedDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Who did what, to which task or project, and when. A small icon on the avatar says what kind of event it was. Acme’s own events, such as automations and reminders, carry the product mark. Comments and status updates are quoted under the sentence. Without items, it shows seven sample events from the Acme Inc. workspace."
        layout="full"
        code={`<ActivityFeed />`}
      >
        <div className="mx-auto max-w-narrow p-6 @prose:p-10">
          <ActivityFeed />
        </div>
      </Example>

      <Example
        title="With a link to more"
        description="Limit the list on a dashboard and link to the full history from the header."
        layout="full"
        surface="subtle"
        code={`<ActivityFeed
  limit={4}
  description="Latest changes across your projects."
  action={
    // The negative margin cancels the ghost padding, so the label lines up with the times below.
    <Button variant="ghost" size="sm" className="-mr-(--button-padding-x-sm)" nativeButton={false} render={<Link href="/live/app/projects" />}>
      View all
    </Button>
  }
/>`}
      >
        <div className="mx-auto max-w-prose p-6 @prose:p-10">
          <ActivityFeed
            limit={4}
            description="Latest changes across your projects."
            action={
              <Button
                variant="ghost"
                size="sm"
                className="-mr-(--button-padding-x-sm)"
                nativeButton={false}
                render={<Link href="/live/app/projects" />}
              >
                View all
              </Button>
            }
          />
        </div>
      </Example>

      <Example
        title="Plain"
        description="Without the card, for a side column or a sheet that already has a frame."
        layout="full"
        code={`<ActivityFeed variant="plain" items={items} />`}
      >
        <div className="@container">
          <div className="grid gap-6 p-6 @min-[44rem]:grid-cols-[1fr_20rem] @min-[44rem]:p-10">
            <div className="grid content-start gap-2">
              <h3 className="text-h4 text-foreground">Customer portal</h3>
              <p className="max-w-prose text-body text-copy">
                A self-serve portal where customers see invoices, open support requests and manage their seats. 22
                of 64 tasks are done, and the beta is due on October 23.
              </p>
            </div>
            <aside className="grid content-start gap-4 border-border @min-[44rem]:border-l @min-[44rem]:pl-6">
              <h4 className="text-title text-foreground">History</h4>
              <ActivityFeed variant="plain" items={portalHistory} />
            </aside>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Write the action as a verb phrase that reads naturally after the name: “completed”, “commented on”.",
          "Bold only the person and the object of the action.",
          "Use relative times for the last week and dates after that.",
          "Pass task keys as code, so they read in mono like everywhere else in the app.",
        ]}
        dont={[
          "Don’t show more than about ten items without a way to see more.",
          "Don’t rely on the event icon alone; the sentence must say what happened.",
          "Don’t truncate the sentence or the detail; let them wrap.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "items",
            type: "ActivityItem[]",
            description:
              "Events, newest first. Defaults to seven events from the Acme Inc. workspace.",
          },
          {
            prop: "title",
            type: "string",
            default: '"Activity"',
            description: "Card title.",
          },
          {
            prop: "description",
            type: "string",
            description: "Line under the title.",
          },
          {
            prop: "action",
            type: "ReactNode",
            description:
              "Content on the right of the header, such as a View all link.",
          },
          {
            prop: "limit",
            type: "number",
            description: "Show at most this many items.",
          },
          {
            prop: "variant",
            type: '"card" | "plain"',
            default: '"card"',
            description: "Plain renders the list without a frame.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the root element.",
          },
        ]}
      />
      <ApiTable
        title="ActivityItem"
        rows={[
          {
            prop: "actor",
            type: "{ name; initials?; image?; tone?; system? }",
            description:
              "Who did it. The avatar fill comes from the shared people list, so a name keeps one colour on every page; tone overrides it. system draws the Acme mark for the product’s own events.",
          },
          {
            prop: "action",
            type: "string",
            description: "Verb phrase, such as “completed”.",
          },
          {
            prop: "target",
            type: "string",
            description: "Object of the action, shown in bold.",
          },
          {
            prop: "context",
            type: "string",
            description: "The rest of the sentence.",
          },
          {
            prop: "code",
            type: "string",
            description:
              "A task key or other short code that ends the sentence, set in mono.",
          },
          {
            prop: "detail",
            type: "string",
            description: "A comment, status update or automation rule, quoted under the sentence.",
          },
          {
            prop: "time / dateTime",
            type: "string",
            description:
              "Relative label and an optional ISO time for the time element.",
          },
          {
            prop: "kind",
            type: '"task" | "comment" | "status" | "due" | "automation" | "doc" | "member"',
            description: "Picks the icon on the avatar.",
          },
        ]}
      />
    </Examples>
  )
}
