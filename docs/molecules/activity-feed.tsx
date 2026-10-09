"use client"

import Link from "next/link"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  ActivityFeed,
  defaultActivity,
} from "@/components/blocks/activity-feed"

export default function ActivityFeedDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Who did what, to which project, and when. A small icon on the avatar says what kind of event it was."
        layout="full"
        code={`<ActivityFeed
  items={[
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
  ]}
/>`}
      >
        <div className="mx-auto max-w-narrow p-6 md:p-10">
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
  action={<Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/live/app/projects" />}>View all</Button>}
/>`}
      >
        <div className="mx-auto max-w-prose p-6 md:p-10">
          <ActivityFeed
            limit={4}
            description="Latest changes across your projects."
            action={
              <Button
                variant="ghost"
                size="sm"
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
              <h3 className="text-h4 text-foreground">api</h3>
              <p className="max-w-prose text-body text-copy">
                The latest build on feat/rate-limits failed. Production still
                serves 7f02b1d, the last deployment that passed its health
                checks.
              </p>
            </div>
            <aside className="grid content-start gap-4 border-border @min-[44rem]:border-l @min-[44rem]:pl-6">
              <h4 className="text-title text-foreground">History</h4>
              <ActivityFeed
                variant="plain"
                items={defaultActivity.filter((item) => item.target === "api")}
              />
            </aside>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Write the action as a verb phrase that reads naturally after the name: “rolled back”, “added the domain”.",
          "Bold only the person and the object of the action.",
          "Use relative times for the last week and dates after that.",
        ]}
        dont={[
          "Don’t show more than about ten items without a way to see more.",
          "Don’t rely on the event icon alone; the sentence must say what happened.",
          "Don’t truncate the sentence; let it wrap.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "items",
            type: "ActivityItem[]",
            description:
              "Events, newest first. Defaults to seven Lumen events.",
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
            type: "{ name; initials?; image?; tint? }",
            description:
              "Who did it. Tint is a flat avatar fill: violet, mint, sand, sky or rose.",
          },
          {
            prop: "action",
            type: "string",
            description: "Verb phrase, such as “deployed”.",
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
            prop: "detail",
            type: "string",
            description: "Commit message or command, set in mono.",
          },
          {
            prop: "time / dateTime",
            type: "string",
            description:
              "Relative label and an optional ISO time for the time element.",
          },
          {
            prop: "kind",
            type: '"deploy" | "failed" | "rollback" | "domain" | "member" | "env" | "database"',
            description: "Picks the icon on the avatar.",
          },
        ]}
      />
    </Examples>
  )
}
