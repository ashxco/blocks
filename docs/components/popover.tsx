"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, GaugeIcon, Link2Icon, SlidersHorizontalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
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

type Stage = HTMLDivElement | null

/**
 * A stage the example's popover opens into, so the page shows the popover
 * itself. It opens on load and stays open while people use the rest of the
 * page; its trigger and Escape still close it.
 */
function PopoverStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className={cn("relative flex w-full items-start justify-center", className)}>
      {children(container)}
    </div>
  )
}

/**
 * Open on load, and kept open when people click or tab elsewhere. It only
 * opens once the stage exists, so the popover is placed inside the stage from
 * its first frame instead of against <body>.
 */
function usePinnedOpen(container: Stage) {
  const [open, setOpen] = React.useState(true)
  const onOpenChange = React.useCallback((next: boolean, details: { reason: string }) => {
    if (!next && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setOpen(next)
  }, [])
  return { open: open && container !== null, setOpen, onOpenChange }
}

/**
 * Pinned previews keep their side, so they never flip over the example's own
 * text as the page scrolls, and they stay inside their stage.
 */
function pinnedTo(container: Stage) {
  return { collisionAvoidance: { side: "none" }, collisionBoundary: container ?? undefined } as const
}

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
        Share preview
      </PopoverTrigger>
      <PopoverContent className="w-80" container={container} initialFocus={false} {...pinnedTo(container)}>
        <PopoverHeader>
          <PopoverTitle>Share preview</PopoverTitle>
          <PopoverDescription>Anyone with the link can view this deployment.</PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2">
          <Input readOnly aria-label="Preview URL" defaultValue="feat-billing.lumen.app" className="min-w-0 flex-1" />
          <Button
            variant="secondary"
            size="icon"
            aria-label={copied ? "Copied" : "Copy URL"}
            onClick={() => setCopied(true)}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SpendLimitPopover({ container }: { container: Stage }) {
  const { open, setOpen, onOpenChange } = usePinnedOpen(container)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button />}>
        <GaugeIcon data-icon="inline-start" />
        Set spend limit
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80" container={container} initialFocus={false} {...pinnedTo(container)}>
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <PopoverHeader>
            <PopoverTitle>Monthly spend limit</PopoverTitle>
            <PopoverDescription>We pause new deployments when the team reaches it.</PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="popover-limit">Limit in USD</FieldLabel>
            <Input id="popover-limit" type="number" inputMode="numeric" defaultValue={200} min={0} />
            <FieldDescription>You spent $142 this month.</FieldDescription>
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save limit
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
  { side: "top", cell: "col-start-2 row-start-1", region: "Frankfurt", code: "fra1", share: "41%" },
  { side: "left", cell: "col-start-1 row-start-2 justify-self-end", region: "Virginia", code: "iad1", share: "33%" },
  { side: "right", cell: "col-start-3 row-start-2 justify-self-start", region: "Singapore", code: "sin1", share: "19%" },
  { side: "bottom", cell: "col-start-2 row-start-3", region: "São Paulo", code: "gru1", share: "7%" },
] as const

/** Wide enough for a w-56 popover on each side of the middle column. */
const PLACEMENT_WIDE = 760

function PlacementStage() {
  const [container, setContainer] = React.useState<Stage>(null)
  const [width, setWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!container) return
    // The first observation arrives before paint, so no synchronous read is needed.
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(container)
    return () => observer.disconnect()
  }, [container])

  const wide = width >= PLACEMENT_WIDE
  const shown = wide ? placements : placements.filter((placement) => placement.side === "top" || placement.side === "bottom")

  return (
    <div
      ref={setContainer}
      className={cn(
        "relative grid w-full items-center gap-x-4 py-30",
        wide ? "grid-cols-[1fr_auto_1fr] gap-y-10" : "grid-cols-2 justify-items-center"
      )}
    >
      {shown.map((placement) => (
        <RegionPopover
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

function RegionPopover({
  side,
  cell,
  region,
  code,
  share,
  container,
}: Omit<(typeof placements)[number], "cell"> & { cell?: string; container: Stage }) {
  const { open, onOpenChange } = usePinnedOpen(container)
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button variant="outline" className={cn("capitalize", cell)} />}>{side}</PopoverTrigger>
      <PopoverContent side={side} className="w-56" container={container} initialFocus={false} {...pinnedTo(container)}>
        <PopoverHeader>
          <PopoverTitle>Region: {region}</PopoverTitle>
          <PopoverDescription>
            {code} serves {share} of traffic for lumen-web this week.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

function LogViewPopover({ container }: { container: Stage }) {
  const { open, onOpenChange } = usePinnedOpen(container)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Log view options" />}>
        <SlidersHorizontalIcon />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-0 p-0" container={container} initialFocus={false} {...pinnedTo(container)}>
        <PopoverHeader className="border-b px-4 py-3">
          <PopoverTitle>Log view</PopoverTitle>
        </PopoverHeader>
        <div className="grid gap-4 p-4">
          {[
            { label: "Show timestamps", on: true },
            { label: "Wrap long lines", on: false },
            { label: "Follow new lines", on: true },
          ].map((option) => (
            <label key={option.label} className="flex items-center justify-between gap-4 text-sm font-medium text-foreground">
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
  <PopoverTrigger render={<Button variant="outline" />}>Share preview</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Share preview</PopoverTitle>
      <PopoverDescription>Anyone with the link can view this deployment.</PopoverDescription>
    </PopoverHeader>
    <Input readOnly defaultValue="feat-billing.lumen.app" />
  </PopoverContent>
</Popover>`}
      >
        <PopoverStage className="min-h-56">{(container) => <SharePopover container={container} />}</PopoverStage>
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
  <PopoverTrigger render={<Button />}>Set spend limit</PopoverTrigger>
  <PopoverContent align="start">
    <form onSubmit={save} className="contents">…</form>
  </PopoverContent>
</Popover>`}
      >
        <PopoverStage className="min-h-84">{(container) => <SpendLimitPopover container={container} />}</PopoverStage>
      </Example>

      <Example
        title="Settings"
        description="Group a few related toggles behind one button to keep a toolbar quiet."
      >
        <PopoverStage className="min-h-60">
          {(container) => <LogViewPopover container={container} />}
        </PopoverStage>
      </Example>

      <Guidelines
        do={[
          "Use a popover for content tied to one control: sharing, a quick setting, a short form.",
          "Give it a title when it holds more than a single sentence.",
          "Keep it narrow. The default width is 18rem; go wider only for a form row.",
        ]}
        dont={[
          "Don’t use a popover for a list of actions. Use a dropdown menu, which has keyboard navigation built in.",
          "Don’t use it for a label on an icon. Use a tooltip.",
          "Don’t put a long form in it. Use a dialog or sheet.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "side", type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"', default: '"bottom"', description: "On PopoverContent. Preferred side of the trigger." },
          { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "On PopoverContent. Alignment along that side." },
          { prop: "sideOffset", type: "number", default: "8", description: "On PopoverContent. Gap from the trigger, in pixels." },
          { prop: "open", type: "boolean", description: "On Popover. Controlled open state. Pair with onOpenChange." },
          { prop: "modal", type: 'boolean | "trap-focus"', default: "false", description: "On Popover. Locks scroll and traps focus while open." },
          { prop: "openOnHover", type: "boolean", default: "false", description: "On PopoverTrigger. Also open on hover, after delay." },
          { prop: "render", type: "ReactElement", description: "On PopoverTrigger. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
