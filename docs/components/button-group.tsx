"use client"

import * as React from "react"
import {
  CalendarClockIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  HistoryIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCcwIcon,
  ScrollTextIcon,
  SendIcon,
  Trash2Icon,
  UndoIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ReplicaStepper() {
  const [replicas, setReplicas] = React.useState(3)
  return (
    <ButtonGroup aria-label="Replicas">
      <Button
        variant="outline"
        size="icon"
        aria-label="Remove a replica"
        disabled={replicas <= 1}
        onClick={() => setReplicas((n) => Math.max(1, n - 1))}
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText className="min-w-32 justify-center text-foreground tabular">
        {replicas} {replicas === 1 ? "replica" : "replicas"}
      </ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="Add a replica"
        disabled={replicas >= 10}
        onClick={() => setReplicas((n) => Math.min(10, n + 1))}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}

/**
 * The "…" button at the end of a group: a menu of the less common actions.
 * Leave Roll back out where the group already shows it as a button.
 */
function MoreActionsMenu({
  size = "icon",
  rollBack = true,
}: {
  size?: "icon" | "icon-sm"
  rollBack?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size={size} aria-label="More actions" />}>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <CopyIcon />
          Copy deployment URL
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ScrollTextIcon />
          View build logs
        </DropdownMenuItem>
        {rollBack ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UndoIcon />
              Roll back
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ButtonGroupDocs() {
  return (
    <Examples>
      <Example
        title="Outline group"
        description="Join actions that act on the same object. Neighbours share one hairline, and the hovered button lifts its full border."
        code={`<ButtonGroup aria-label="Deployment actions">
  <Button variant="outline">Redeploy</Button>
  <Button variant="outline">Promote</Button>
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
      <MoreHorizontalIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><CopyIcon />Copy deployment URL</DropdownMenuItem>
      <DropdownMenuItem><ScrollTextIcon />View build logs</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem><UndoIcon />Roll back</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label="Deployment actions">
          <Button variant="outline">Redeploy</Button>
          <Button variant="outline">Promote</Button>
          <MoreActionsMenu />
        </ButtonGroup>
      </Example>

      <Example
        title="Split button"
        description="A primary action with a menu of related ones. Put a separator between filled buttons so the split stays visible."
        code={`<ButtonGroup aria-label="Deploy">
  <Button>Deploy to production</Button>
  <ButtonGroupSeparator />
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button size="icon" aria-label="More deploy options" />}>
      <ChevronDownIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><EyeIcon />Deploy to preview</DropdownMenuItem>
      <DropdownMenuItem><HistoryIcon />Promote a previous build</DropdownMenuItem>
      <DropdownMenuItem><CalendarClockIcon />Schedule a deploy</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>

<ButtonGroup aria-label="Draft">
  <Button variant="secondary">Save draft</Button>
  <ButtonGroupSeparator />
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="More save options" />}>
      <ChevronDownIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><SendIcon />Save and request review</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive"><Trash2Icon />Discard draft</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label="Deploy">
          <Button>Deploy to production</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="icon" aria-label="More deploy options" />}>
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <EyeIcon />
                Deploy to preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HistoryIcon />
                Promote a previous build
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarClockIcon />
                Schedule a deploy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup aria-label="Draft">
          <Button variant="secondary">Save draft</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="secondary" size="icon" aria-label="More save options" />}
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <SendIcon />
                Save and request review
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Discard draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </Example>

      <Example
        title="Sizes"
        description="Every button in a group shares one size. Small groups suit dense toolbars and table rows."
        code={`<ButtonGroup aria-label="Domain actions">
  <Button variant="outline" size="sm">Edit</Button>
  <Button variant="outline" size="sm">Verify</Button>
  <Button variant="outline" size="sm">Remove</Button>
</ButtonGroup>

<ButtonGroup aria-label="Domain actions">
  <Button variant="outline">Edit</Button>
  <Button variant="outline">Verify</Button>
  <Button variant="outline">Remove</Button>
</ButtonGroup>

<ButtonGroup aria-label="Domain actions">
  <Button variant="outline" size="lg">Edit</Button>
  <Button variant="outline" size="lg">Verify</Button>
  <Button variant="outline" size="lg">Remove</Button>
</ButtonGroup>`}
      >
        {(["sm", "default", "lg"] as const).map((size) => (
          <ButtonGroup key={size} aria-label={`Domain actions, ${size === "default" ? "medium" : size === "sm" ? "small" : "large"}`}>
            <Button variant="outline" size={size}>
              Edit
            </Button>
            <Button variant="outline" size={size}>
              Verify
            </Button>
            <Button variant="outline" size={size}>
              Remove
            </Button>
          </ButtonGroup>
        ))}
      </Example>

      <Example
        title="With text"
        description="ButtonGroupText attaches a value or unit between controls. Here it makes a stepper for the number of replicas."
        code={`<ButtonGroup aria-label="Replicas">
  <Button variant="outline" size="icon" aria-label="Remove a replica">
    <MinusIcon />
  </Button>
  <ButtonGroupText>3 replicas</ButtonGroupText>
  <Button variant="outline" size="icon" aria-label="Add a replica">
    <PlusIcon />
  </Button>
</ButtonGroup>`}
      >
        <ReplicaStepper />
      </Example>

      <Example
        title="Vertical"
        description="Stack a group for map or chart controls that sit at the edge of a canvas."
        code={`<ButtonGroup orientation="vertical" aria-label="Zoom">
  <Button variant="outline" size="icon-sm" aria-label="Zoom in"><PlusIcon /></Button>
  <Button variant="outline" size="icon-sm" aria-label="Zoom out"><MinusIcon /></Button>
  <Button variant="outline" size="icon-sm" aria-label="Reset zoom"><RotateCcwIcon /></Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="vertical" aria-label="Zoom">
          <Button variant="outline" size="icon-sm" aria-label="Zoom in">
            <PlusIcon />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Zoom out">
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Reset zoom">
            <RotateCcwIcon />
          </Button>
        </ButtonGroup>
      </Example>

      <Example
        title="Deployment toolbar"
        description="Nest groups to keep related actions together while separating them from the rest of the toolbar."
        surface="subtle"
        code={`<Card size="sm" className="flex-row flex-wrap items-center justify-between gap-x-6 gap-y-4">
  <CardHeader className="min-w-48 flex-1 gap-1">
    <CardTitle>acme-web</CardTitle>
    <CardDescription>Production · main · deployed 4 minutes ago</CardDescription>
  </CardHeader>
  <ButtonGroup aria-label="Deployment toolbar" className="flex-wrap">
    <ButtonGroup>
      <Button variant="outline" size="sm" nativeButton={false} render={<a href="#visit" />}>
        <ExternalLinkIcon data-icon="inline-start" />
        Visit
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="sm">Redeploy</Button>
      <Button variant="outline" size="sm">
        <UndoIcon data-icon="inline-start" />
        Roll back
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" aria-label="More actions" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><CopyIcon />Copy deployment URL</DropdownMenuItem>
          <DropdownMenuItem><ScrollTextIcon />View build logs</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
</Card>`}
      >
        <Card size="sm" className="w-full max-w-2xl flex-row flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <CardHeader className="min-w-48 flex-1 gap-1">
            <CardTitle>acme-web</CardTitle>
            <CardDescription>Production · main · deployed 4 minutes ago</CardDescription>
          </CardHeader>
          <ButtonGroup aria-label="Deployment toolbar" className="flex-wrap">
            <ButtonGroup>
              <Button variant="outline" size="sm" nativeButton={false} render={<a href="#visit" />}>
                <ExternalLinkIcon data-icon="inline-start" />
                Visit
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="sm">
                Redeploy
              </Button>
              <Button variant="outline" size="sm">
                <UndoIcon data-icon="inline-start" />
                Roll back
              </Button>
              <MoreActionsMenu size="icon-sm" rollBack={false} />
            </ButtonGroup>
          </ButtonGroup>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Group only actions that apply to the same thing, such as one deployment.",
          "Use the same variant and size for every button in a group.",
          "Give the group an aria-label, and every icon-only button its own label.",
          "Add a ButtonGroupSeparator between filled buttons in a split button.",
        ]}
        dont={[
          "Don’t use a button group to switch views or filter. Use a toggle group or tabs.",
          "Don’t mix primary and outline buttons in one group.",
          "Don’t put more than four or five actions in a group. Move the rest into a menu.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Joins children side by side or stacked." },
          { prop: "ButtonGroupText", type: "component", description: "Static text or an icon inside the group. Accepts render to change the element." },
          { prop: "ButtonGroupSeparator", type: "component", description: "A hairline between filled buttons. Vertical by default." },
          { prop: "buttonGroupVariants", type: "cva", description: "The group’s class recipe, for custom wrappers." },
        ]}
      />
    </Examples>
  )
}
