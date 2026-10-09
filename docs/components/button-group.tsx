"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCcwIcon,
  UndoIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"

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
      <ButtonGroupText className="min-w-32 justify-center text-foreground tabular-nums">
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

export default function ButtonGroupDocs() {
  return (
    <Examples>
      <Example
        title="Outline group"
        description="Join actions that act on the same object. Neighbours share one hairline, and the hovered button lifts its full border."
        code={`<ButtonGroup aria-label="Deployment actions">
  <Button variant="outline">Redeploy</Button>
  <Button variant="outline">Promote</Button>
  <Button variant="outline" size="icon" aria-label="More actions">
    <MoreHorizontalIcon />
  </Button>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label="Deployment actions">
          <Button variant="outline">Redeploy</Button>
          <Button variant="outline">Promote</Button>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontalIcon />
          </Button>
        </ButtonGroup>
      </Example>

      <Example
        title="Split button"
        description="A primary action with a menu of related ones. Put a separator between filled buttons so the split stays visible."
        code={`<ButtonGroup>
  <Button>Deploy to production</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More deploy options">
    <ChevronDownIcon />
  </Button>
</ButtonGroup>`}
      >
        <ButtonGroup>
          <Button>Deploy to production</Button>
          <ButtonGroupSeparator />
          <Button size="icon" aria-label="More deploy options">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="secondary">Save draft</Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="icon" aria-label="More save options">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
      </Example>

      <Example
        title="Sizes"
        description="Every button in a group shares one size. Small groups suit dense toolbars and table rows."
      >
        <ButtonGroup aria-label="Small">
          <Button variant="outline" size="sm">
            Day
          </Button>
          <Button variant="outline" size="sm">
            Week
          </Button>
          <Button variant="outline" size="sm">
            Month
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Medium">
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Large">
          <Button variant="outline" size="lg">
            Day
          </Button>
          <Button variant="outline" size="lg">
            Week
          </Button>
          <Button variant="outline" size="lg">
            Month
          </Button>
        </ButtonGroup>
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
        layout="stack"
        code={`<ButtonGroup aria-label="Deployment toolbar">
  <ButtonGroup>
    <Button variant="outline" size="sm" nativeButton={false} render={<a href="https://lumen-web.lumen.app" />}>
      <ExternalLinkIcon data-icon="inline-start" />
      Visit
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="sm">Redeploy</Button>
    <Button variant="outline" size="sm">Roll back</Button>
  </ButtonGroup>
</ButtonGroup>`}
      >
        <div className="flex flex-col gap-5 rounded-(--card-radius) border bg-card p-(--card-padding) sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <p className="text-title text-foreground">lumen-web</p>
            <p className="text-sm text-muted-foreground">
              Production · main · deployed 4 minutes ago
            </p>
          </div>
          <ButtonGroup aria-label="Deployment toolbar">
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href="#visit" />}
              >
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
              <Button variant="outline" size="icon-sm" aria-label="More actions">
                <MoreHorizontalIcon />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </div>
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
