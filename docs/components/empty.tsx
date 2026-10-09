"use client"

import { ArrowUpRightIcon, GitBranchIcon, GlobeIcon, SearchXIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A dashed outline marks where content will appear. Say what is missing and give the one action that fixes it."
        layout="stack"
        code={`<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <GitBranchIcon />
    </EmptyMedia>
    <EmptyTitle>No deployments yet</EmptyTitle>
    <EmptyDescription>
      Push to any branch of lumen-labs/lumen-web and Lumen builds it here.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Deploy main</Button>
    <Button variant="ghost">Read the guide</Button>
  </EmptyContent>
</Empty>`}
      >
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GitBranchIcon />
            </EmptyMedia>
            <EmptyTitle>No deployments yet</EmptyTitle>
            <EmptyDescription>
              Push to any branch of lumen-labs/lumen-web and Lumen builds it here, with its own preview URL.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Deploy main</Button>
            <Button variant="ghost">
              Read the guide
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </EmptyContent>
        </Empty>
      </Example>

      <Example
        title="Variants"
        description="Subtle sits on a tinted band. Plain drops the outline for space that is already framed."
        layout="stack"
        code={`<Empty variant="subtle">…</Empty>
<Empty variant="plain">…</Empty>`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Empty variant="subtle">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GlobeIcon />
              </EmptyMedia>
              <EmptyTitle>No custom domains</EmptyTitle>
              <EmptyDescription>lumen-web is live at lumen-web.lumen.app.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Add domain</Button>
            </EmptyContent>
          </Empty>
          <div className="rounded-(--card-radius) border">
            <Empty variant="plain">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <GlobeIcon />
                </EmptyMedia>
                <EmptyTitle>No custom domains</EmptyTitle>
                <EmptyDescription>lumen-web is live at lumen-web.lumen.app.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" variant="outline">
                  Add domain
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </div>
      </Example>

      <Example
        title="No results"
        description="When a filter hides everything, repeat the query and offer to clear it."
        layout="stack"
        code={`<Empty variant="plain">
  <EmptyHeader>
    <EmptyMedia variant="icon"><SearchXIcon /></EmptyMedia>
    <EmptyTitle>No logs match “timeout”</EmptyTitle>
    <EmptyDescription>Try a shorter query or a longer time range.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="outline" size="sm">Clear filters</Button>
  </EmptyContent>
</Empty>`}
      >
        <Empty variant="plain">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>No logs match “timeout”</EmptyTitle>
            <EmptyDescription>Nothing in the last 24 hours. Try a shorter query or a longer time range.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Clear filters
            </Button>
            <Button variant="ghost" size="sm">
              Search 7 days
            </Button>
          </EmptyContent>
        </Empty>
      </Example>

      <Example
        title="Inside a card"
        description="Use the plain variant inside a card. The card border already frames the space."
        layout="stack"
        surface="subtle"
      >
        <Card className="max-w-prose">
          <CardHeader className="border-b">
            <CardTitle>Members</CardTitle>
            <CardDescription>People who can deploy to Lumen Labs</CardDescription>
            <CardAction>
              <Button size="sm">Invite</Button>
            </CardAction>
          </CardHeader>
          <Empty variant="plain" className="py-6 sm:py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle>You are the only member</EmptyTitle>
              <EmptyDescription>
                Invite your team to review previews and deploy. <a href="#roles">Compare roles</a>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Say what is missing in the title, in plain words: “No deployments yet”.",
          "Explain in one sentence how the space fills up.",
          "Offer the single action that fixes it, plus at most one secondary link.",
        ]}
        dont={[
          "Don’t use illustrations or emoji to fill the space. The icon tile is enough.",
          "Don’t use an empty state for errors. Use an alert that says what went wrong.",
          "Don’t write jokes or exclamation marks. People see this when they are stuck.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "Empty variant", type: '"default" | "subtle" | "plain"', default: '"default"', description: "Dashed outline, dashed outline on a tint, or no frame." },
          { prop: "EmptyMedia variant", type: '"default" | "icon"', default: '"default"', description: "A bare icon or image, or an icon in a muted tile." },
          { prop: "children", type: "ReactNode", description: "EmptyContent: actions, laid out in a centred, wrapping row." },
        ]}
      />
    </Examples>
  )
}
