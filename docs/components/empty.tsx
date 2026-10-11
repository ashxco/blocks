"use client"

import {
  ArrowRightIcon,
  FolderKanbanIcon,
  SearchXIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

/** The same empty state in each variant, so only the frame differs. */
function NoAutomations({ variant }: { variant: "subtle" | "plain" }) {
  return (
    <Empty variant={variant}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ZapIcon />
        </EmptyMedia>
        <EmptyTitle>No automations yet</EmptyTitle>
        <EmptyDescription>
          Let Acme move tasks and notify owners for you.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create Rule</Button>
      </EmptyContent>
    </Empty>
  )
}

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
      <FolderKanbanIcon />
    </EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>
      Create a project to plan work, assign tasks and track progress with your team.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create Project</Button>
    <Button variant="ghost">Browse Templates</Button>
  </EmptyContent>
</Empty>`}
      >
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanbanIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create a project to plan work, assign tasks and track progress
              with your team, or start from a template.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Create Project</Button>
            <Button variant="ghost">
              Browse Templates
              <ArrowRightIcon data-icon="inline-end" />
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
        {/* Equal cells and the same action, so only the frame differs. */}
        <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
          <figure className="grid grid-rows-[1fr_auto] gap-3">
            <NoAutomations variant="subtle" />
            <figcaption className="font-mono text-code text-muted-foreground">
              variant=&quot;subtle&quot;
            </figcaption>
          </figure>
          <figure className="grid grid-rows-[1fr_auto] gap-3">
            <div className="flex rounded-(--card-radius) border bg-card">
              <NoAutomations variant="plain" />
            </div>
            <figcaption className="font-mono text-code text-muted-foreground">
              variant=&quot;plain&quot;
            </figcaption>
          </figure>
        </div>
      </Example>

      <Example
        title="No results"
        description="When a filter hides everything, repeat the query and offer to clear it."
        layout="stack"
        code={`<Empty variant="plain">
  <EmptyHeader>
    <EmptyMedia variant="icon"><SearchXIcon /></EmptyMedia>
    <EmptyTitle>No tasks match “invoice”</EmptyTitle>
    <EmptyDescription>Try a shorter query or include completed tasks.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="outline" size="sm">Clear Filters</Button>
  </EmptyContent>
</Empty>`}
      >
        <Empty variant="plain">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>No tasks match “invoice”</EmptyTitle>
            <EmptyDescription>
              Nothing in open tasks. Try a shorter query or include completed
              tasks.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
            <Button variant="ghost" size="sm">
              Include Completed
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
            <CardDescription>
              People who can see and edit Website relaunch
            </CardDescription>
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
                Invite your team to assign tasks and share updates.{" "}
                <a href="#roles">Compare roles</a>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Say what is missing in the title, in plain words: “No projects yet”.",
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
          {
            prop: "Empty variant",
            type: '"default" | "subtle" | "plain"',
            default: '"default"',
            description:
              "Dashed outline, dashed outline on a tint, or no frame.",
          },
          {
            prop: "EmptyMedia variant",
            type: '"default" | "icon"',
            default: '"default"',
            description: "A bare icon or image, or an icon in a muted tile.",
          },
          {
            prop: "children",
            type: "ReactNode",
            description:
              "EmptyContent: actions, laid out in a centred, wrapping row.",
          },
        ]}
      />
    </Examples>
  )
}
