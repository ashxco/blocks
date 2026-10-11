"use client"

import * as React from "react"
import {
  ArchiveIcon,
  ChevronDownIcon,
  CopyIcon,
  HistoryIcon,
  LayoutTemplateIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RepeatIcon,
  RotateCcwIcon,
  SendIcon,
  SquareKanbanIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

function SeatStepper() {
  const [seats, setSeats] = React.useState(18)
  return (
    <ButtonGroup aria-label="Seats">
      <Button
        variant="outline"
        size="icon"
        aria-label="Remove a seat"
        disabled={seats <= 1}
        onClick={() => setSeats((n) => Math.max(1, n - 1))}
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText className="min-w-32 justify-center text-foreground tabular">
        {seats} {seats === 1 ? "seat" : "seats"}
      </ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="Add a seat"
        disabled={seats >= 50}
        onClick={() => setSeats((n) => Math.min(50, n + 1))}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}

/**
 * The "…" button at the end of a group: a menu of the less common actions.
 * Leave Archive out where the group already shows it as a button.
 */
function MoreActionsMenu({
  size = "icon",
  archive = true,
}: {
  size?: "icon" | "icon-sm"
  archive?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size={size} aria-label="More actions" />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <CopyIcon />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HistoryIcon />
          View activity
        </DropdownMenuItem>
        {archive ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
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
        code={`<ButtonGroup aria-label="Task actions">
  <Button variant="outline">Assign</Button>
  <Button variant="outline">Move</Button>
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
      <MoreHorizontalIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><CopyIcon />Copy link</DropdownMenuItem>
      <DropdownMenuItem><HistoryIcon />View activity</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem><ArchiveIcon />Archive</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label="Task actions">
          <Button variant="outline">Assign</Button>
          <Button variant="outline">Move</Button>
          <MoreActionsMenu />
        </ButtonGroup>
      </Example>

      <Example
        title="Split button"
        description="A primary action with a menu of related ones. Put a separator between filled buttons so the split stays visible."
        code={`<ButtonGroup aria-label="Create task">
  <Button>Create Task</Button>
  <ButtonGroupSeparator />
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button size="icon" aria-label="More ways to create a task" />}>
      <ChevronDownIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><LayoutTemplateIcon />Create from a template</DropdownMenuItem>
      <DropdownMenuItem><RepeatIcon />Create a recurring task</DropdownMenuItem>
      <DropdownMenuItem><UploadIcon />Import from CSV</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>

<ButtonGroup aria-label="Draft">
  <Button variant="secondary">Save Draft</Button>
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
        <ButtonGroup aria-label="Create task">
          <Button>Create Task</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="icon" aria-label="More ways to create a task" />
              }
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LayoutTemplateIcon />
                Create from a template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RepeatIcon />
                Create a recurring task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UploadIcon />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup aria-label="Draft">
          <Button variant="secondary">Save Draft</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="More save options"
                />
              }
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
        code={`<ButtonGroup aria-label="Invite actions">
  <Button variant="outline" size="sm">Edit</Button>
  <Button variant="outline" size="sm">Resend</Button>
  <Button variant="outline" size="sm">Revoke</Button>
</ButtonGroup>

<ButtonGroup aria-label="Invite actions">
  <Button variant="outline">Edit</Button>
  <Button variant="outline">Resend</Button>
  <Button variant="outline">Revoke</Button>
</ButtonGroup>

<ButtonGroup aria-label="Invite actions">
  <Button variant="outline" size="lg">Edit</Button>
  <Button variant="outline" size="lg">Resend</Button>
  <Button variant="outline" size="lg">Revoke</Button>
</ButtonGroup>`}
      >
        {(["sm", "default", "lg"] as const).map((size) => (
          <ButtonGroup
            key={size}
            aria-label={`Invite actions, ${size === "default" ? "medium" : size === "sm" ? "small" : "large"}`}
          >
            <Button variant="outline" size={size}>
              Edit
            </Button>
            <Button variant="outline" size={size}>
              Resend
            </Button>
            <Button variant="outline" size={size}>
              Revoke
            </Button>
          </ButtonGroup>
        ))}
      </Example>

      <Example
        title="With text"
        description="ButtonGroupText attaches a value or unit between controls. Here it makes a stepper for the number of seats on a plan."
        code={`<ButtonGroup aria-label="Seats">
  <Button variant="outline" size="icon" aria-label="Remove a seat">
    <MinusIcon />
  </Button>
  <ButtonGroupText>18 seats</ButtonGroupText>
  <Button variant="outline" size="icon" aria-label="Add a seat">
    <PlusIcon />
  </Button>
</ButtonGroup>`}
      >
        <SeatStepper />
      </Example>

      <Example
        title="Vertical"
        description="Stack a group for zoom controls that sit beside a timeline or chart."
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
        title="Project toolbar"
        description="Nest groups to keep related actions together while separating them from the rest of the toolbar."
        surface="subtle"
        code={`<Card size="sm" className="flex-row flex-wrap items-center justify-between gap-x-6 gap-y-4">
  <CardHeader className="min-w-48 flex-1 gap-1">
    <CardTitle>Website relaunch</CardTitle>
    <CardDescription>On track · 32 open tasks</CardDescription>
  </CardHeader>
  <ButtonGroup aria-label="Project toolbar" className="flex-wrap">
    <ButtonGroup>
      <Button variant="outline" size="sm" nativeButton={false} render={<a href="#board" />}>
        <SquareKanbanIcon data-icon="inline-start" />
        Open Board
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="sm">Share</Button>
      <Button variant="outline" size="sm">
        <ArchiveIcon data-icon="inline-start" />
        Archive
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" aria-label="More actions" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><CopyIcon />Copy link</DropdownMenuItem>
          <DropdownMenuItem><HistoryIcon />View activity</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
</Card>`}
      >
        <Card
          size="sm"
          className="w-full max-w-2xl flex-row flex-wrap items-center justify-between gap-x-6 gap-y-4"
        >
          <CardHeader className="min-w-48 flex-1 gap-1">
            <CardTitle>Website relaunch</CardTitle>
            <CardDescription>On track · 32 open tasks</CardDescription>
          </CardHeader>
          <ButtonGroup aria-label="Project toolbar" className="flex-wrap">
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href="#board" />}
              >
                <SquareKanbanIcon data-icon="inline-start" />
                Open Board
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="sm">
                Share
              </Button>
              <Button variant="outline" size="sm">
                <ArchiveIcon data-icon="inline-start" />
                Archive
              </Button>
              <MoreActionsMenu size="icon-sm" archive={false} />
            </ButtonGroup>
          </ButtonGroup>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Group only actions that apply to the same thing, such as one project.",
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
          {
            prop: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description: "Joins children side by side or stacked.",
          },
          {
            prop: "ButtonGroupText",
            type: "component",
            description:
              "Static text or an icon inside the group. Accepts render to change the element.",
          },
          {
            prop: "ButtonGroupSeparator",
            type: "component",
            description:
              "A hairline between filled buttons. Vertical by default.",
          },
          {
            prop: "buttonGroupVariants",
            type: "cva",
            description: "The group’s class recipe, for custom wrappers.",
          },
        ]}
      />
    </Examples>
  )
}
