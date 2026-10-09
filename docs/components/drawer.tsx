"use client"

import * as React from "react"
import {
  CopyIcon,
  ExternalLinkIcon,
  QrCodeIcon,
  RotateCcwIcon,
  ScrollTextIcon,
  SendIcon,
  Undo2Icon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const logLines = [
  { time: "12:05:09", level: "info", text: "GET /api/projects 200 in 41ms" },
  { time: "12:05:11", level: "info", text: "GET /dashboard 200 in 88ms" },
  { time: "12:05:14", level: "warn", text: "Slow query on deployments (812ms)" },
  { time: "12:05:15", level: "info", text: "POST /api/deployments 201 in 230ms" },
  { time: "12:05:18", level: "error", text: "Webhook to hooks.slack.com timed out after 10s" },
  { time: "12:05:20", level: "info", text: "GET /api/usage 200 in 37ms" },
  { time: "12:05:22", level: "info", text: "GET /settings/domains 200 in 64ms" },
  { time: "12:05:25", level: "info", text: "Cache hit for /pricing in fra1" },
  { time: "12:05:27", level: "warn", text: "Function memory at 82% of 1024 MB" },
  { time: "12:05:30", level: "info", text: "GET /api/projects 200 in 39ms" },
]

const levelClass: Record<string, string> = {
  info: "text-muted-foreground",
  warn: "text-warning",
  error: "text-destructive",
}

type Stage = HTMLDivElement | null

/**
 * The stage an example's drawer opens into, so the page shows the drawer
 * itself. contain-layout makes the stage the containing block for the fixed
 * drawer, and isolate keeps it under the site header. The drawer is non-modal
 * there, so it has no overlay and the page still scrolls.
 */
function DrawerStage({ children }: { children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className="relative isolate h-full min-h-128 w-full overflow-hidden contain-layout">
      <div className="grid content-start gap-8 p-6 sm:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-h3 text-foreground">feat-billing</p>
            <p className="text-caption text-muted-foreground">Preview · lumen-web · ready 4 minutes ago</p>
          </div>
          {children(container)}
        </div>
        <dl className="grid divide-y border-y">
          {previewRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-6 py-4">
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className="text-sm font-medium text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

const previewRows = [
  { label: "Commit", value: "Add usage-based billing page" },
  { label: "Author", value: "Priya Raman" },
  { label: "Built in", value: "38s" },
  { label: "Comments", value: "3 open threads" },
]

/** Open in place on the docs page: no focus move, no scroll lock, no dismissal on outside clicks. */
const inlineDrawer = { defaultOpen: true, modal: false, disablePointerDismissal: true } as const

const snapPoints = ["168px", 1]

/**
 * In a stage, snap points resolve against the stage instead of the screen:
 * the drawer is as tall as the stage, less a strip at the top.
 */
const snapInStage =
  "data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100%-3rem)]"

function SnapPointsDrawer({ container }: { container: Stage }) {
  const [snapPoint, setSnapPoint] = React.useState<number | string | null>(snapPoints[0])

  return (
    <Drawer {...inlineDrawer} snapPoints={snapPoints} snapPoint={snapPoint} onSnapPointChange={setSnapPoint}>
      <DrawerTrigger render={<Button variant="outline" />}>
        <ScrollTextIcon data-icon="inline-start" />
        Live logs
      </DrawerTrigger>
      <DrawerContent container={container} initialFocus={false} className={snapInStage}>
        <DrawerHeader>
          <DrawerTitle>Live logs</DrawerTitle>
          <DrawerDescription>lumen-web · production · drag up for more</DrawerDescription>
        </DrawerHeader>
        <ol className="grid gap-2 px-(--dialog-padding) pb-(--dialog-padding) font-mono text-code">
          {logLines.map((line) => (
            <li key={line.time} className="flex gap-3">
              <span className="shrink-0 text-muted-foreground tabular">{line.time}</span>
              <span className={levelClass[line.level]}>{line.text}</span>
            </li>
          ))}
        </ol>
      </DrawerContent>
    </Drawer>
  )
}

type Direction = "left" | "right"

/** One side drawer, open in a stage, whose edge people switch from the bar above it. */
function SideDrawersDemo() {
  const [direction, setDirection] = React.useState<Direction>("right")

  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
        <code className="font-mono text-code text-muted-foreground">swipeDirection=&quot;{direction}&quot;</code>
        <ToggleGroup
          size="sm"
          aria-label="Drawer edge"
          value={[direction]}
          onValueChange={(value) => {
            const next = value[0] as Direction | undefined
            if (next) setDirection(next)
          }}
        >
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <DrawerStage>
        {(container) => (
          // A new drawer for each edge, so it opens from that edge.
          <Drawer key={direction} {...inlineDrawer} swipeDirection={direction}>
            <DrawerTrigger render={<Button variant="outline" />}>Filters</DrawerTrigger>
            <DrawerContent container={container} initialFocus={false}>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>Narrow the deployments list.</DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-1 px-(--dialog-padding)">
                {["Production", "Preview", "Failed builds", "Created by me"].map((label) => (
                  <Button key={label} variant="ghost" className="justify-start">
                    {label}
                  </Button>
                ))}
              </div>
              <DrawerFooter>
                <DrawerClose render={<Button />}>Show 48 deployments</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </DrawerStage>
    </div>
  )
}

export default function DrawerDocs() {
  return (
    <Examples>
      <Example
        title="Bottom drawer"
        layout="full"
        description="The default. It slides up from the bottom, shows a handle and closes when people swipe it down, tap the overlay or press Escape."
        code={`<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Share preview</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Share this preview</DrawerTitle>
      <DrawerDescription>Anyone with the link can view it.</DrawerDescription>
    </DrawerHeader>
    …
    <DrawerFooter>
      <Button>Copy link</Button>
      <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
      >
        <DrawerStage>
          {(container) => (
            <Drawer {...inlineDrawer}>
              <DrawerTrigger render={<Button variant="outline" />}>
                <SendIcon data-icon="inline-start" />
                Share preview
              </DrawerTrigger>
              <DrawerContent container={container} initialFocus={false}>
                <DrawerHeader>
                  <DrawerTitle>Share this preview</DrawerTitle>
                  <DrawerDescription>Anyone with the link can view feat-billing until the branch is merged.</DrawerDescription>
                </DrawerHeader>
                <div className="px-(--dialog-padding)">
                  <Field>
                    <FieldLabel htmlFor="drawer-link">Preview link</FieldLabel>
                    <Input id="drawer-link" readOnly defaultValue="feat-billing.lumen.app" />
                  </Field>
                </div>
                <DrawerFooter>
                  <Button>
                    <CopyIcon data-icon="inline-start" />
                    Copy link
                  </Button>
                  <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </DrawerStage>
      </Example>

      <Example
        title="Snap points"
        layout="full"
        description="Give a drawer resting heights with snapPoints. Numbers from 0 to 1 are a share of the viewport; strings take px or rem. This one rests at 168px; drag its handle up to open it fully."
        code={`const snapPoints = ["168px", 1]
const [snapPoint, setSnapPoint] = React.useState(snapPoints[0])

<Drawer snapPoints={snapPoints} snapPoint={snapPoint} onSnapPointChange={setSnapPoint}>
  …
</Drawer>`}
      >
        <DrawerStage>{(container) => <SnapPointsDrawer container={container} />}</DrawerStage>
      </Example>

      <Example
        title="Side drawers"
        layout="full"
        description="Set swipeDirection to left or right for a panel that people swipe back toward its edge. Side drawers hide the handle unless you pass showSwipeHandle."
        code={`<Drawer swipeDirection="right">…</Drawer>`}
      >
        <SideDrawersDemo />
      </Example>

      <Example
        title="Action sheet"
        layout="full"
        description="On phones, a drawer of full-width actions replaces a dropdown menu. Keep the most used action first and the destructive one last."
      >
        <DrawerStage>
          {(container) => (
            <Drawer {...inlineDrawer}>
              <DrawerTrigger render={<Button />}>Deployment actions</DrawerTrigger>
              <DrawerContent container={container} initialFocus={false}>
                <DrawerHeader>
                  <DrawerTitle>Deployment 8f2c1a9</DrawerTitle>
                  <DrawerDescription>main · Ready · 4 minutes ago</DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-1 px-(--dialog-padding)">
                  <Button variant="ghost" size="lg" className="justify-start">
                    <ExternalLinkIcon data-icon="inline-start" />
                    Visit deployment
                  </Button>
                  <Button variant="ghost" size="lg" className="justify-start">
                    <QrCodeIcon data-icon="inline-start" />
                    Open on another device
                  </Button>
                  <Button variant="ghost" size="lg" className="justify-start">
                    <RotateCcwIcon data-icon="inline-start" />
                    Redeploy
                  </Button>
                  <Button variant="ghost" size="lg" className="justify-start text-destructive hover:text-destructive">
                    <Undo2Icon data-icon="inline-start" />
                    Roll back production
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="outline" size="lg" />}>Cancel</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </DrawerStage>
      </Example>

      <Guidelines
        do={[
          "Use a drawer on touch screens, where swiping it away feels natural.",
          "Keep the handle visible on bottom drawers so people know they can drag it.",
          "Give long content snap points, so people can peek before they expand.",
        ]}
        dont={[
          "Don’t use a drawer on desktop layouts where a dialog or sheet fits. Switch by breakpoint if you need both.",
          "Don’t put horizontal scrollers inside a side drawer. The swipe fights them.",
          "Don’t hide the only close action behind the swipe. Keep a Cancel or Done button.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "swipeDirection", type: '"down" | "up" | "left" | "right"', default: '"down"', description: "The edge the drawer is attached to, and the direction that dismisses it." },
          { prop: "showSwipeHandle", type: "boolean", default: "true for up and down", description: "Shows the grab handle. Side drawers hide it unless you set it." },
          { prop: "snapPoints", type: "(number | string)[]", description: "Resting heights. 0 to 1 is a share of the viewport; strings take px or rem." },
          { prop: "snapPoint", type: "number | string | null", description: "Controlled active snap point. Pair with onSnapPointChange." },
          { prop: "open", type: "boolean", description: "Controlled open state. Pair with onOpenChange." },
          { prop: "modal", type: 'boolean | "trap-focus"', default: "true", description: "Shows the overlay, locks scroll and traps focus." },
          { prop: "render", type: "ReactElement", description: "On DrawerTrigger and DrawerClose. Render as a Button." },
        ]}
      />
    </Examples>
  )
}
