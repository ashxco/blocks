"use client"

import * as React from "react"
import {
  CheckIcon,
  CircleCheckIcon,
  CircleIcon,
  LinkIcon,
  PanelRightIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  PreviewStage,
  PropValue,
  StagePage,
  StageSwitcher,
  openInPlace,
  type Stage,
} from "@/docs/stage"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const sides = ["top", "right", "bottom", "left"] as const

const details = [
  { label: "Status", value: <Badge variant="brand">In review</Badge> },
  {
    label: "Assignee",
    value: (
      <span className="inline-flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback tone="sky">PR</AvatarFallback>
        </Avatar>
        Priya Raman
      </span>
    ),
  },
  { label: "Due date", value: "Oct 14, 2026" },
  { label: "Priority", value: "High" },
  { label: "Project", value: "Website relaunch" },
]

const subtasks = [
  { name: "Outline the key messages", done: true },
  { name: "Draft the blog post", done: true },
  { name: "Get sign-off from Hana", done: false },
  { name: "Schedule the launch email", done: false },
]

/** The stage an example's sheet opens into, on the task list it sits on. */
function SheetStage({
  className,
  children,
}: {
  className?: string
  children: (container: Stage) => React.ReactNode
}) {
  return (
    <PreviewStage kind="overlay" className={cn("min-h-176", className)}>
      {(container) => (
        <StagePage
          title="Website relaunch"
          meta="14 open tasks · 38 done"
          action={children(container)}
        >
          <TaskList />
        </StagePage>
      )}
    </PreviewStage>
  )
}

/** SheetBody in place on the page: the wheel carries on to the page once the body has nothing left to scroll. */
const inlineBody = "overscroll-auto"

const tasks = [
  {
    title: "Write the launch announcement",
    assignee: "Priya Raman",
    due: "Oct 14",
    priority: "High",
  },
  {
    title: "Fix the pricing table on mobile",
    assignee: "Jordan Lee",
    due: "Oct 15",
    priority: "Urgent",
  },
  {
    title: "Final homepage illustrations",
    assignee: "Sofia Alvarez",
    due: "Oct 16",
    priority: "Medium",
  },
  {
    title: "Review page titles and descriptions",
    assignee: "Priya Raman",
    due: "Oct 21",
    priority: "Medium",
  },
  {
    title: "Plan the launch-day schedule",
    assignee: "Maya Patel",
    due: "Oct 22",
    priority: "High",
  },
  {
    title: "Brief the support team",
    assignee: "Sam Okafor",
    due: "Oct 23",
    priority: "Low",
  },
  {
    title: "Update the help articles that link to old pages",
    assignee: "Sam Okafor",
    due: "Oct 28",
    priority: "Low",
  },
]

/** The task list an open sheet sits on. */
function TaskList() {
  return (
    <ul className="grid divide-y border-y">
      {tasks.map((row) => (
        <li
          key={row.title}
          className="flex items-center justify-between gap-6 py-4"
        >
          <span className="grid min-w-0 gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">
              {row.title}
            </span>
            <span className="truncate text-caption text-muted-foreground">
              {row.assignee} · Due {row.due}
            </span>
          </span>
          <span className="shrink-0 text-caption text-muted-foreground">
            {row.priority}
          </span>
        </li>
      ))}
    </ul>
  )
}

function TaskSheet({ container }: { container: Stage }) {
  const done = subtasks.filter((subtask) => subtask.done).length
  return (
    <Sheet {...openInPlace}>
      <SheetTrigger render={<Button />}>
        <PanelRightIcon data-icon="inline-start" />
        Task Details
      </SheetTrigger>
      <SheetContent container={container} initialFocus={false}>
        <SheetHeader>
          <SheetTitle>Write the launch announcement</SheetTitle>
          <SheetDescription>
            Created by Maya Patel on Oct 2 in Website relaunch.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className={inlineBody}>
          <dl className="grid divide-y rounded-(--card-radius) border">
            {details.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <section className="grid gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-title">Subtasks</h3>
              <p className="text-caption text-muted-foreground tabular">
                {done} of {subtasks.length} done
              </p>
            </div>
            <ul className="grid gap-2.5">
              {subtasks.map((subtask) => (
                <li
                  key={subtask.name}
                  className="flex items-center gap-2.5 text-sm"
                >
                  {subtask.done ? (
                    <CircleCheckIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-success"
                    />
                  ) : (
                    <CircleIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  )}
                  <span
                    className={
                      subtask.done
                        ? "text-muted-foreground line-through"
                        : "text-copy"
                    }
                  >
                    {subtask.name}
                  </span>
                  <span className="sr-only">
                    {subtask.done ? "(done)" : "(open)"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </SheetBody>
        <SheetFooter>
          <Button variant="outline">
            <LinkIcon data-icon="inline-start" />
            Copy Link
          </Button>
          <Button>
            <CheckIcon data-icon="inline-start" />
            Mark as Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type Side = (typeof sides)[number]

const notificationOptions = [
  {
    label: "Tasks assigned to me",
    hint: "As soon as someone assigns you a task.",
    on: true,
  },
  {
    label: "Mentions and replies",
    hint: "When someone mentions you in a comment or doc.",
    on: true,
  },
  {
    label: "Weekly progress report",
    hint: "Every Monday, for the projects you follow.",
    on: false,
  },
]

/** One sheet, open in a stage, whose side people switch from the bar above it. */
function SidesDemo() {
  const [side, setSide] = React.useState<Side>("left")
  const [open, setOpen] = React.useState(true)

  return (
    <div className="grid">
      <StageSwitcher
        label={<PropValue name="side" value={side} />}
        aria-label="Sheet side"
        value={side}
        options={sides.map((option) => ({ value: option, label: option }))}
        itemClassName="capitalize"
        onValueChange={(next) => {
          setSide(next)
          setOpen(true)
        }}
      />
      <SheetStage className="min-h-160">
        {(container) => (
          <Sheet
            open={open}
            onOpenChange={setOpen}
            modal={false}
            disablePointerDismissal
          >
            <SheetTrigger render={<Button variant="outline" />}>
              Notification Settings
            </SheetTrigger>
            <SheetContent
              side={side}
              container={container}
              initialFocus={false}
            >
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Choose what Acme emails you about.
                </SheetDescription>
              </SheetHeader>
              <SheetBody className={inlineBody}>
                <div className="grid divide-y">
                  {notificationOptions.map((option) => (
                    <label
                      key={option.label}
                      className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0"
                    >
                      <span className="grid gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        <span className="text-caption text-muted-foreground">
                          {option.hint}
                        </span>
                      </span>
                      <Switch defaultChecked={option.on} />
                    </label>
                  ))}
                </div>
              </SheetBody>
              <SheetFooter>
                <SheetClose render={<Button />}>Done</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </SheetStage>
    </div>
  )
}

function ProjectSettingsSheet({ container }: { container: Stage }) {
  return (
    <Sheet {...openInPlace}>
      <SheetTrigger render={<Button variant="outline" />}>
        Edit Project
      </SheetTrigger>
      <SheetContent container={container} initialFocus={false}>
        <form className="contents" onSubmit={(event) => event.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Project settings</SheetTitle>
            <SheetDescription>
              Changes apply for everyone in Website relaunch.
            </SheetDescription>
          </SheetHeader>
          <SheetBody className={inlineBody}>
            <Field>
              <FieldLabel htmlFor="sheet-name">Project name</FieldLabel>
              <Input id="sheet-name" defaultValue="Website relaunch" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-description">Description</FieldLabel>
              <Textarea
                id="sheet-description"
                rows={3}
                defaultValue="New site, pricing page and blog, live by Nov 14."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-owner">Owner</FieldLabel>
              <NativeSelect
                id="sheet-owner"
                defaultValue="maya"
                className="w-full"
              >
                <NativeSelectOption value="maya">Maya Patel</NativeSelectOption>
                <NativeSelectOption value="priya">
                  Priya Raman
                </NativeSelectOption>
                <NativeSelectOption value="sofia">
                  Sofia Alvarez
                </NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-view">Default view</FieldLabel>
              <NativeSelect
                id="sheet-view"
                defaultValue="board"
                className="w-full"
              >
                <NativeSelectOption value="list">List</NativeSelectOption>
                <NativeSelectOption value="board">Board</NativeSelectOption>
                <NativeSelectOption value="timeline">
                  Timeline
                </NativeSelectOption>
                <NativeSelectOption value="calendar">
                  Calendar
                </NativeSelectOption>
              </NativeSelect>
              <FieldDescription>
                Everyone sees this view first and can switch at any time.
              </FieldDescription>
            </Field>
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" />}>
              Cancel
            </SheetClose>
            <SheetClose render={<Button type="submit" />}>
              Save Changes
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function SheetDocs() {
  return (
    <Examples>
      <Example
        title="Details panel"
        layout="full"
        description="A sheet opens at the edge rather than over the middle of the page, so people keep their place in the list behind it. Use SheetBody for the scrolling middle and SheetFooter for actions pinned to the bottom edge."
        code={`<SheetContent>
  <SheetHeader>
    <SheetTitle>Write the launch announcement</SheetTitle>
    <SheetDescription>…</SheetDescription>
  </SheetHeader>
  <SheetBody>…</SheetBody>
  <SheetFooter>
    <Button variant="outline">Copy Link</Button>
    <Button>Mark as Done</Button>
  </SheetFooter>
</SheetContent>`}
      >
        <SheetStage>
          {(container) => <TaskSheet container={container} />}
        </SheetStage>
      </Example>

      <Example
        title="Sides"
        layout="full"
        description="Right is the default and suits details and edit forms. Use left for navigation, bottom for short actions on small screens. Switch the side above the preview."
        code={`<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
      <SheetDescription>Choose what Acme emails you about.</SheetDescription>
    </SheetHeader>
    <SheetBody>…</SheetBody>
  </SheetContent>
</Sheet>`}
      >
        <SidesDemo />
      </Example>

      <Example
        title="Floating"
        layout="full"
        description={`variant="floating" insets the sheet from the viewport and rounds it with --dialog-radius. It reads as a layer over the app rather than part of its frame.`}
        code={`<SheetContent variant="floating">
  <SheetHeader>…</SheetHeader>
  <SheetBody>…</SheetBody>
  <SheetFooter>
    <Textarea aria-label="Add a comment" placeholder="Add a comment" />
    <Button>Post Comment</Button>
  </SheetFooter>
</SheetContent>`}
      >
        <SheetStage>
          {(container) => (
            <Sheet {...openInPlace}>
              <SheetTrigger render={<Button variant="outline" />}>
                Show Comments
              </SheetTrigger>
              <SheetContent
                variant="floating"
                container={container}
                initialFocus={false}
              >
                <SheetHeader>
                  <SheetTitle>Comments</SheetTitle>
                  <SheetDescription>
                    3 comments on Write the launch announcement
                  </SheetDescription>
                </SheetHeader>
                <SheetBody className={inlineBody}>
                  {[
                    {
                      name: "Jordan Lee",
                      initials: "JL",
                      time: "9:31",
                      text: "The pricing section still says $10. Pro is $12 per member, billed annually.",
                    },
                    {
                      name: "Sofia Alvarez",
                      initials: "SA",
                      time: "9:58",
                      text: "The hero image is final. It’s linked from the Figma file in the doc.",
                    },
                    {
                      name: "Hana Kim",
                      initials: "HK",
                      time: "10:12",
                      text: "Reads well. I’ll sign off once the pricing is fixed.",
                    },
                  ].map((comment) => (
                    <article
                      key={comment.name}
                      className="flex gap-3 border-b pb-5 last:border-b-0 last:pb-0"
                    >
                      <Avatar size="sm">
                        <AvatarFallback>{comment.initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 gap-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-title">{comment.name}</span>
                          <span className="text-caption text-muted-foreground">
                            {comment.time}
                          </span>
                        </p>
                        <p className="text-sm text-copy">{comment.text}</p>
                      </div>
                    </article>
                  ))}
                </SheetBody>
                <SheetFooter className="flex-col items-stretch sm:flex-col sm:items-stretch">
                  <Textarea
                    aria-label="Add a comment"
                    placeholder="Add a comment"
                    rows={2}
                  />
                  <div className="flex justify-end">
                    <Button>Post Comment</Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </SheetStage>
      </Example>

      <Example
        title="Edit form"
        layout="full"
        description="Longer forms fit a sheet better than a dialog. Close it with SheetClose once the save succeeds."
        code={`<SheetContent>
  <form className="contents" onSubmit={save}>
    <SheetHeader>
      <SheetTitle>Project settings</SheetTitle>
      <SheetDescription>Changes apply for everyone in Website relaunch.</SheetDescription>
    </SheetHeader>
    <SheetBody>
      <Field>
        <FieldLabel htmlFor="name">Project name</FieldLabel>
        <Input id="name" defaultValue="Website relaunch" />
      </Field>
      …
    </SheetBody>
    <SheetFooter>
      <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
      <Button type="submit">Save Changes</Button>
    </SheetFooter>
  </form>
</SheetContent>`}
      >
        <SheetStage>
          {(container) => <ProjectSettingsSheet container={container} />}
        </SheetStage>
      </Example>

      <Guidelines
        do={[
          "Use a sheet for details and edits that relate to the page behind it.",
          "Keep the title short and put context, such as the project or author, in the description.",
          "Pin the actions in SheetFooter so they stay in view while the body scrolls.",
        ]}
        dont={[
          "Don’t stack a sheet on another sheet.",
          "Don’t use a sheet for a quick yes or no. Use an alert dialog.",
          "Don’t make a side sheet wider than --sheet-width. Give big content its own page.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "side",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"right"',
            description: "On SheetContent. The edge the sheet slides in from.",
          },
          {
            prop: "variant",
            type: '"edge" | "floating"',
            default: '"edge"',
            description:
              "On SheetContent. Flush against the viewport, or inset with rounded corners.",
          },
          {
            prop: "showCloseButton",
            type: "boolean",
            default: "true",
            description:
              "On SheetContent. Shows the close button in the top-right corner.",
          },
          {
            prop: "open",
            type: "boolean",
            description:
              "On Sheet. Controlled open state. Pair with onOpenChange.",
          },
          {
            prop: "onOpenChange",
            type: "(open: boolean) => void",
            description: "On Sheet. Called when the sheet opens or closes.",
          },
          {
            prop: "SheetBody",
            type: "component",
            description:
              "The scrolling middle between header and footer, with --dialog-padding on the sides.",
          },
          {
            prop: "render",
            type: "ReactElement",
            description:
              'On SheetTrigger and SheetClose. Render as a Button: render={<Button variant="outline" />}.',
          },
        ]}
      />
    </Examples>
  )
}
