"use client"

import * as React from "react"
import {
  BellIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { PreviewStage, pinnedTo, usePinnedOpen, type Stage } from "@/docs/stage"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

function SharePopover({ container }: { container: Stage }) {
  const [copied, setCopied] = React.useState(false)
  const { open, onOpenChange } = usePinnedOpen(container)

  return (
    <Popover
      open={open}
      onOpenChange={(next, details) => {
        onOpenChange(next, details)
        if (!next) setCopied(false)
      }}
    >
      <PopoverTrigger render={<Button variant="outline" />}>
        <Link2Icon data-icon="inline-start" />
        Share Doc
      </PopoverTrigger>
      <PopoverContent
        className="w-(--popover-width-lg)"
        container={container}
        initialFocus={false}
        {...pinnedTo(container)}
      >
        <PopoverHeader>
          <PopoverTitle>Share this doc</PopoverTitle>
          <PopoverDescription>
            Anyone in Acme Inc. with the link can read the launch plan.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2">
          {/* dir="rtl" keeps the end of the link (the doc's name) in view when the field is too narrow for all of it. */}
          <Input
            readOnly
            dir="rtl"
            aria-label="Doc link"
            defaultValue="app.acme.com/acme/docs/launch-plan"
            className="min-w-0 flex-1 text-left text-ellipsis"
          />
          <Button
            variant="secondary"
            size="icon"
            aria-label={copied ? "Copied" : "Copy link"}
            onClick={() => setCopied(true)}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function UsageAlertPopover({ container }: { container: Stage }) {
  const { open, setOpen, onOpenChange } = usePinnedOpen(container)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button />}>
        <BellIcon data-icon="inline-start" />
        Set Usage Alert
      </PopoverTrigger>
      <PopoverContent
        align="start"
        container={container}
        initialFocus={false}
        {...pinnedTo(container)}
      >
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <PopoverHeader>
            <PopoverTitle>Automation usage alert</PopoverTitle>
            <PopoverDescription>
              We email workspace owners when runs pass this number in a month.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="popover-limit">Alert at (runs)</FieldLabel>
            <Input
              id="popover-limit"
              type="number"
              inputMode="numeric"
              defaultValue={9000}
              min={0}
              step={500}
            />
            <FieldDescription>
              7,240 of 10,000 runs used this month.
            </FieldDescription>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Alert
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Placement demo. Each trigger sits on the side its popover opens to, so none
 * overlap. Side popovers need room beside their trigger, so narrow previews
 * show top and bottom only.
 */
const placements = [
  {
    side: "top",
    cell: "col-start-2 row-start-1",
    priority: "Urgent",
    count: 2,
  },
  {
    side: "left",
    cell: "col-start-1 row-start-2 justify-self-end",
    priority: "High",
    count: 5,
  },
  {
    side: "right",
    cell: "col-start-3 row-start-2 justify-self-start",
    priority: "Medium",
    count: 4,
  },
  {
    side: "bottom",
    cell: "col-start-2 row-start-3",
    priority: "Low",
    count: 3,
  },
] as const

/** Wide enough for a --popover-width-sm popover on each side of the middle column. */
const PLACEMENT_WIDE = 760

function PlacementStage() {
  const [container, setContainer] = React.useState<Stage>(null)
  const [width, setWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!container) return
    // The first observation arrives before paint, so no synchronous read is needed.
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [container])

  const wide = width >= PLACEMENT_WIDE
  const shown = wide
    ? placements
    : placements.filter(
        (placement) => placement.side === "top" || placement.side === "bottom"
      )

  return (
    <div
      ref={setContainer}
      className={cn(
        "relative isolate grid w-full items-center gap-x-4 py-30",
        wide
          ? "grid-cols-[1fr_auto_1fr] gap-y-10"
          : "grid-cols-2 justify-items-center"
      )}
    >
      {shown.map((placement) => (
        <PriorityPopover
          key={placement.side}
          {...placement}
          cell={wide ? placement.cell : undefined}
          // Open once the layout is known, so each popover starts next to its trigger.
          container={width > 0 ? container : null}
        />
      ))}
    </div>
  )
}

function PriorityPopover({
  side,
  cell,
  priority,
  count,
  container,
}: Omit<(typeof placements)[number], "cell"> & {
  cell?: string
  container: Stage
}) {
  const { open, onOpenChange } = usePinnedOpen(container)
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={<Button variant="outline" className={cn("capitalize", cell)} />}
      >
        {side}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        className="w-(--popover-width-sm)"
        container={container}
        initialFocus={false}
        {...pinnedTo(container)}
      >
        <PopoverHeader>
          <PopoverTitle>{priority} priority</PopoverTitle>
          <PopoverDescription>
            {count} of the 14 open tasks in Website relaunch.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

function BoardViewPopover({ container }: { container: Stage }) {
  const { open, onOpenChange } = usePinnedOpen(container)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Board view options"
          />
        }
      >
        <SlidersHorizontalIcon />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-(--popover-width-sm) gap-0 p-0"
        container={container}
        initialFocus={false}
        {...pinnedTo(container)}
      >
        <PopoverHeader className="border-b px-4 py-3">
          <PopoverTitle>Board view</PopoverTitle>
        </PopoverHeader>
        <div className="grid gap-4 p-4">
          {[
            { label: "Show subtasks", on: true },
            { label: "Show assignees", on: false },
            { label: "Show due dates", on: true },
          ].map((option) => (
            <label
              key={option.label}
              className="flex items-center justify-between gap-4 text-sm font-medium text-foreground"
            >
              {option.label}
              <Switch defaultChecked={option.on} />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function PopoverDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="Rich content anchored to a trigger. It closes on Escape, an outside click or when focus moves away. The previews on this page open on load and stay open until you press their trigger or Escape."
        code={`<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Share Doc</PopoverTrigger>
  <PopoverContent className="w-(--popover-width-lg)">
    <PopoverHeader>
      <PopoverTitle>Share this doc</PopoverTitle>
      <PopoverDescription>Anyone in Acme Inc. with the link can read it.</PopoverDescription>
    </PopoverHeader>
    <Input readOnly defaultValue="app.acme.com/acme/docs/launch-plan" />
  </PopoverContent>
</Popover>`}
      >
        <PreviewStage className="min-h-56">
          {(container) => <SharePopover container={container} />}
        </PreviewStage>
      </Example>

      <Example
        title="Placement"
        description="Choose a side and an alignment. The popover flips when there isn’t room and grows from the trigger."
        code={`<PopoverContent side="top" align="start">…</PopoverContent>`}
      >
        <PlacementStage />
      </Example>

      <Example
        title="Small form"
        description="A popover suits one or two fields that edit something in place. Close it when the save succeeds."
        code={`const [open, setOpen] = React.useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button />}>Set Usage Alert</PopoverTrigger>
  <PopoverContent align="start">
    <form onSubmit={save} className="contents">…</form>
  </PopoverContent>
</Popover>`}
      >
        <PreviewStage className="min-h-84">
          {(container) => <UsageAlertPopover container={container} />}
        </PreviewStage>
      </Example>

      <Example
        title="Settings"
        description="Group a few related toggles behind one button to keep a toolbar quiet."
        code={`<Popover>
  <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Board view options" />}>
    <SlidersHorizontalIcon />
  </PopoverTrigger>
  <PopoverContent align="end" className="w-(--popover-width-sm) gap-0 p-0">
    <PopoverHeader className="border-b px-4 py-3">
      <PopoverTitle>Board view</PopoverTitle>
    </PopoverHeader>
    <div className="grid gap-4 p-4">
      <label className="flex items-center justify-between gap-4 text-sm font-medium">
        Show subtasks
        <Switch defaultChecked />
      </label>
      …
    </div>
  </PopoverContent>
</Popover>`}
      >
        <PreviewStage className="min-h-60">
          {(container) => <BoardViewPopover container={container} />}
        </PreviewStage>
      </Example>

      <Guidelines
        do={[
          "Use a popover for content tied to one control: sharing, a quick setting, a short form.",
          "Give it a title when it holds more than a single sentence.",
          "Keep it narrow. The default width is --popover-width; use --popover-width-sm for a few settings and --popover-width-lg only for a form row.",
        ]}
        dont={[
          "Don’t use a popover for a list of actions. Use a dropdown menu, which has keyboard navigation built in.",
          "Don’t use it for a label on an icon. Use a tooltip.",
          "Don’t put a long form in it. Use a dialog or sheet.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "side",
            type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"',
            default: '"bottom"',
            description: "On PopoverContent. Preferred side of the trigger.",
          },
          {
            prop: "align",
            type: '"start" | "center" | "end"',
            default: '"center"',
            description: "On PopoverContent. Alignment along that side.",
          },
          {
            prop: "sideOffset",
            type: "number",
            default: "8",
            description: "On PopoverContent. Gap from the trigger, in pixels.",
          },
          {
            prop: "className",
            type: "string",
            default: '"w-(--popover-width)"',
            description:
              "On PopoverContent. Change the width with w-(--popover-width-sm) or w-(--popover-width-lg).",
          },
          {
            prop: "open",
            type: "boolean",
            description:
              "On Popover. Controlled open state. Pair with onOpenChange.",
          },
          {
            prop: "modal",
            type: 'boolean | "trap-focus"',
            default: "false",
            description: "On Popover. Locks scroll and traps focus while open.",
          },
          {
            prop: "openOnHover",
            type: "boolean",
            default: "false",
            description: "On PopoverTrigger. Also open on hover, after delay.",
          },
          {
            prop: "render",
            type: "ReactElement",
            description:
              'On PopoverTrigger. Render as a Button: render={<Button variant="outline" />}.',
          },
        ]}
      />
    </Examples>
  )
}
