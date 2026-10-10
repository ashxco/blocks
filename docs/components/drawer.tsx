"use client"

import * as React from "react"
import {
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  FolderInputIcon,
  HistoryIcon,
  Share2Icon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/components/blocks/members-list/people"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

/** Today’s activity in the project, newest first. */
const activity = [
  { time: "10:42", initials: "PR", name: "Priya Raman", text: "moved Write the launch announcement to In review" },
  { time: "10:31", initials: "JL", name: "Jordan Lee", text: "commented on Fix the pricing table on mobile" },
  { time: "10:05", initials: "SA", name: "Sofia Alvarez", text: "attached Hero image v3 to Final homepage illustrations" },
  { time: "09:58", initials: "MP", name: "Maya Patel", text: "moved the launch date to Nov 14" },
  { time: "09:40", initials: "SO", name: "Sam Okafor", text: "commented on Brief the support team" },
  { time: "09:22", initials: "PR", name: "Priya Raman", text: "added 4 subtasks to Write the launch announcement" },
  { time: "09:15", initials: "HK", name: "Hana Kim", text: "joined the project" },
  { time: "09:02", initials: "JL", name: "Jordan Lee", text: "assigned Review page titles and descriptions to Priya Raman" },
  { time: "08:47", initials: "MP", name: "Maya Patel", text: "created Plan the launch-day schedule" },
  { time: "08:30", initials: "SA", name: "Sofia Alvarez", text: "completed Pick the homepage typeface" },
]

type Stage = HTMLDivElement | null

/**
 * The stage an example's drawer opens into, so the page shows the drawer
 * itself. contain-layout makes the stage the containing block for the fixed
 * drawer and its overlay, and isolate keeps them under the site header. The
 * drawer is non-modal there, so the docs page still scrolls; showOverlay draws
 * the overlay a modal drawer would have, tint and blur included.
 */
function DrawerStage({ children }: { children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className="relative isolate h-full min-h-128 w-full overflow-hidden contain-layout">
      <div className="grid content-start gap-8 p-6 sm:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-h3 text-foreground">Website relaunch</p>
            <p className="text-caption text-muted-foreground">Marketing · 14 open tasks · updated 4 minutes ago</p>
          </div>
          {children(container)}
        </div>
        <dl className="grid divide-y border-y">
          {projectRows.map((row) => (
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

const projectRows = [
  { label: "Owner", value: "Maya Patel" },
  { label: "Due date", value: "Nov 14, 2026" },
  { label: "Progress", value: "38 of 52 tasks done" },
  { label: "Members", value: "7" },
]

/** Open in place on the docs page: no focus move, no scroll lock, no dismissal on outside clicks. */
const inlineDrawer = { defaultOpen: true, modal: false, disablePointerDismissal: true } as const

/**
 * The content half of an in-place drawer: it draws the overlay a modal drawer
 * would have, and lets the wheel carry on to the page once the drawer has
 * nothing left to scroll.
 */
const inlineContent = {
  initialFocus: false,
  showOverlay: true,
  className: "[&_[data-slot=drawer-content]]:overscroll-auto",
} as const

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
        <HistoryIcon data-icon="inline-start" />
        Activity
      </DrawerTrigger>
      <DrawerContent container={container} {...inlineContent} className={cn(inlineContent.className, snapInStage)}>
        <DrawerHeader>
          <DrawerTitle>Activity</DrawerTitle>
          <DrawerDescription>Today · drag up for more</DrawerDescription>
        </DrawerHeader>
        <ol className="grid gap-3 px-(--dialog-padding) pb-(--dialog-padding)">
          {activity.map((entry) => (
            <li key={entry.time} className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback tone={initialsTone(entry.initials)}>{entry.initials}</AvatarFallback>
              </Avatar>
              <p className="min-w-0 flex-1 text-sm text-copy">
                <span className="font-semibold text-foreground">{entry.name}</span> {entry.text}
              </p>
              <span className="shrink-0 text-caption text-muted-foreground tabular">{entry.time}</span>
            </li>
          ))}
        </ol>
      </DrawerContent>
    </Drawer>
  )
}

const taskFilters = [
  { id: "mine", label: "Assigned to me", checked: true },
  { id: "week", label: "Due this week", checked: true },
  { id: "priority", label: "Urgent and high priority", checked: false },
  { id: "done", label: "Include completed tasks", checked: false },
]

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
            <DrawerContent container={container} {...inlineContent}>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>Narrow the task list.</DrawerDescription>
              </DrawerHeader>
              <div role="group" aria-label="Task filters" className="grid gap-4 px-(--dialog-padding) pt-2">
                {taskFilters.map((filter) => (
                  <Field key={filter.id} orientation="horizontal">
                    <Checkbox id={`drawer-filter-${filter.id}`} defaultChecked={filter.checked} />
                    <FieldLabel htmlFor={`drawer-filter-${filter.id}`}>{filter.label}</FieldLabel>
                  </Field>
                ))}
              </div>
              <DrawerFooter>
                <DrawerClose render={<Button />}>Show 6 tasks</DrawerClose>
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
  <DrawerTrigger render={<Button variant="outline" />}>Share project</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Share Website relaunch</DrawerTitle>
      <DrawerDescription>Anyone in Acme Inc. with the link can open it.</DrawerDescription>
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
                <Share2Icon data-icon="inline-start" />
                Share project
              </DrawerTrigger>
              <DrawerContent container={container} {...inlineContent}>
                <DrawerHeader>
                  <DrawerTitle>Share Website relaunch</DrawerTitle>
                  <DrawerDescription>
                    Anyone in Acme Inc. with the link can open the board. Guests need an invite first.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-(--dialog-padding)">
                  <Field>
                    <FieldLabel htmlFor="drawer-link">Project link</FieldLabel>
                    <Input id="drawer-link" readOnly defaultValue="app.acme.com/acme/projects/website-relaunch" />
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
              <DrawerTrigger render={<Button />}>Task actions</DrawerTrigger>
              <DrawerContent container={container} {...inlineContent}>
                <DrawerHeader>
                  <DrawerTitle>Write the launch announcement</DrawerTitle>
                  <DrawerDescription>Priya Raman · Due Oct 14 · High priority</DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-2 px-(--dialog-padding)">
                  <Button variant="outline" size="lg" className="w-full justify-start bg-transparent">
                    <CheckIcon data-icon="inline-start" />
                    Mark as done
                  </Button>
                  <Button variant="outline" size="lg" className="w-full justify-start bg-transparent">
                    <UserPlusIcon data-icon="inline-start" />
                    Assign to someone else
                  </Button>
                  <Button variant="outline" size="lg" className="w-full justify-start bg-transparent">
                    <CalendarIcon data-icon="inline-start" />
                    Change due date
                  </Button>
                  <Button variant="outline" size="lg" className="w-full justify-start bg-transparent">
                    <FolderInputIcon data-icon="inline-start" />
                    Move to another project
                  </Button>
                  <Button variant="outline" size="lg" className="w-full justify-start bg-transparent text-destructive hover:border-destructive">
                    <Trash2Icon data-icon="inline-start" />
                    Delete task
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="ghost" size="lg" className="w-full" />}>Cancel</DrawerClose>
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
          { prop: "showOverlay", type: "boolean", default: "true when modal", description: "On DrawerContent. Draws the blurred overlay behind the drawer, also for a non-modal drawer." },
          { prop: "render", type: "ReactElement", description: "On DrawerTrigger and DrawerClose. Render as a Button." },
        ]}
      />
    </Examples>
  )
}
