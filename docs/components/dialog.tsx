"use client"

import * as React from "react"
import { ArchiveIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, Trash2Icon, UserPlusIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/docs/sample/people"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const shortcuts = [
  { keys: ["⌘", "K"], label: "Search tasks, projects and docs" },
  { keys: ["C"], label: "Create a task" },
  { keys: ["G", "I"], label: "Go to your inbox" },
  { keys: ["G", "M"], label: "Go to my tasks" },
  { keys: ["⌘", "↵"], label: "Mark the open task as done" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
]

/** The history of one task, newest first: long enough to scroll inside the dialog. */
const taskHistory = [
  { initials: "PR", name: "Priya Raman", action: "moved the task to In review", time: "10:42" },
  { initials: "PR", name: "Priya Raman", action: "completed the subtask Draft the blog post", time: "10:40" },
  { initials: "SA", name: "Sofia Alvarez", action: "attached Hero image v3 from Figma", time: "09:58" },
  { initials: "JL", name: "Jordan Lee", action: "commented: the pricing section still says $10", time: "09:31" },
  { initials: "PR", name: "Priya Raman", action: "completed the subtask Outline the key messages", time: "Yesterday" },
  { initials: "MP", name: "Maya Patel", action: "changed the priority from Medium to High", time: "Yesterday" },
  { initials: "MP", name: "Maya Patel", action: "moved the due date to Oct 14", time: "Yesterday" },
  { initials: "HK", name: "Hana Kim", action: "asked to sign off before it goes out", time: "Oct 6" },
  { initials: "PR", name: "Priya Raman", action: "added 4 subtasks", time: "Oct 5" },
  { initials: "PR", name: "Priya Raman", action: "moved the task to In progress", time: "Oct 5" },
  { initials: "SO", name: "Sam Okafor", action: "linked the doc Support FAQ for launch day", time: "Oct 4" },
  { initials: "MP", name: "Maya Patel", action: "assigned the task to Priya Raman", time: "Oct 2" },
  { initials: "MP", name: "Maya Patel", action: "created the task in Website relaunch", time: "Oct 2" },
]

type Stage = HTMLDivElement | null

/**
 * Inside a stage, the dialog fits the stage rather than the viewport, and the
 * wheel carries on to the page once the dialog has nothing left to scroll.
 */
const inStage = "max-h-[calc(100%-2rem)] overscroll-auto"

/** Loose enough to catch typos such as a missing domain, without rejecting real addresses. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function InviteMembersDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)
  const [emails, setEmails] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setEmails("")
      setError(null)
      setPending(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const list = emails
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
    if (list.length === 0) {
      setError("Enter at least one email address, such as jordan@acme.com.")
      return
    }
    const invalid = list.find((value) => !emailPattern.test(value))
    if (invalid) {
      setError(`“${invalid}” is not a full email address. Check it has a name, an @ and a domain.`)
      return
    }
    setError(null)
    setPending(true)
    window.setTimeout(() => handleOpenChange(false), 1200)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false} disablePointerDismissal>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon data-icon="inline-start" />
        Invite Members
      </DialogTrigger>
      <DialogContent container={container} initialFocus={false} className={inStage}>
        <form onSubmit={handleSubmit} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>Invite members</DialogTitle>
            <DialogDescription>
              They join Acme Inc. as members and can see every project that isn’t private.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="dialog-invite-emails">Email addresses</FieldLabel>
            <Input
              id="dialog-invite-emails"
              type="text"
              inputMode="email"
              placeholder="name@company.com"
              autoComplete="off"
              value={emails}
              aria-invalid={error ? true : undefined}
              aria-describedby="dialog-invite-help"
              onChange={(event) => setEmails(event.target.value)}
            />
            <FieldDescription id="dialog-invite-help" className={error ? "text-destructive" : undefined}>
              {error ?? "Separate addresses with commas. Invites expire after 7 days."}
            </FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={pending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Sending Invites" : "Send Invites"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** A menu item that opens a dialog. The dialog starts open; close it and choose Archive to open it again. */
function ProjectMenuWithDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Project options" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" container={container}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
        <DialogContent container={container} initialFocus={false} className={inStage}>
          <DialogHeader>
            <DialogTitle>Archive Help center</DialogTitle>
            <DialogDescription>
              The project leaves the sidebar and project lists, and its docs become read-only. Restore it from Settings
              at any time.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="dialog-archive-tasks">The 21 open tasks</FieldLabel>
            <NativeSelect id="dialog-archive-tasks" defaultValue="keep" className="w-full">
              <NativeSelectOption value="keep">Leave them open</NativeSelectOption>
              <NativeSelectOption value="done">Mark them as done</NativeSelectOption>
              <NativeSelectOption value="move">Move them to Customer portal</NativeSelectOption>
            </NativeSelect>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Archive Project</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * A stage for an example that shows its dialog already open. The dialog
 * portals into the stage instead of <body>: contain-layout makes the stage the
 * containing block for the fixed overlay and popup, and isolate keeps them
 * under the site header. The dialog is non-modal there, so the page still
 * scrolls, and a click elsewhere leaves it open. Close it to reach the trigger.
 * The overlay tints and blurs the page behind it, as it does over a real page.
 */
function DialogStage({
  className,
  project = websiteRelaunch,
  children,
}: {
  className?: string
  project?: StageProject
  children: (container: Stage) => React.ReactNode
}) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className={cn("relative isolate h-full min-h-112 w-full overflow-hidden contain-layout", className)}>
      <StagePage project={project} action={children(container)} />
    </div>
  )
}

interface StageProject {
  name: string
  meta: string
  details: { label: string; value: React.ReactNode }[]
}

const websiteRelaunch: StageProject = {
  name: "Website relaunch",
  meta: "Marketing · updated 4 minutes ago",
  details: [
    { label: "Status", value: <Badge variant="success">On track</Badge> },
    { label: "Owner", value: "Maya Patel" },
    { label: "Due date", value: "Nov 14, 2026" },
    { label: "Progress", value: "38 of 52 tasks done" },
    { label: "Default view", value: "Board" },
  ],
}

/** The paused project the archive example acts on. */
const helpCenter: StageProject = {
  name: "Help center",
  meta: "Customer Success · paused by Sam Okafor on Sep 30",
  details: [
    { label: "Status", value: <Badge variant="secondary">Paused</Badge> },
    { label: "Owner", value: "Sam Okafor" },
    { label: "Due date", value: "Dec 15, 2026" },
    { label: "Progress", value: "9 of 30 tasks done" },
    { label: "Default view", value: "List" },
  ],
}

/** The project page the open dialog sits on. */
function StagePage({ project, action }: { project: StageProject; action: React.ReactNode }) {
  return (
    <div className="grid content-start gap-8 p-6 sm:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-h3 text-foreground">{project.name}</p>
          <p className="text-caption text-muted-foreground">{project.meta}</p>
        </div>
        {action}
      </div>
      <dl className="grid divide-y border-y">
        {project.details.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6 py-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Open in place on the docs page: no focus move, no scroll lock, no dismissal on outside clicks. */
const inlineDialog = { defaultOpen: true, modal: false, disablePointerDismissal: true } as const

type DialogSize = "sm" | "default" | "lg"

const sizeOptions: { value: DialogSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "default", label: "Default" },
  { value: "lg", label: "Large" },
]

/** One dialog, open in a stage, whose size people switch from the bar above it. */
function SizesDemo() {
  const [size, setSize] = React.useState<DialogSize>("lg")
  const [open, setOpen] = React.useState(true)

  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
        <code className="font-mono text-code text-muted-foreground">size=&quot;{size}&quot;</code>
        <ToggleGroup
          size="sm"
          aria-label="Dialog size"
          value={[size]}
          onValueChange={(value) => {
            const next = value[0] as DialogSize | undefined
            if (!next) return
            setSize(next)
            setOpen(true)
          }}
        >
          {sizeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <DialogStage className="min-h-144">
        {(container) => (
          <Dialog open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
            <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
            <DialogContent size={size} container={container} initialFocus={false} className={inStage}>
              <SizeContent size={size} />
            </DialogContent>
          </Dialog>
        )}
      </DialogStage>
    </div>
  )
}

function SizeContent({ size }: { size: DialogSize }) {
  if (size === "sm") {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Copy invite link</DialogTitle>
          <DialogDescription>Anyone with this link can join Acme Inc. as a member.</DialogDescription>
        </DialogHeader>
        <Input readOnly aria-label="Invite link" defaultValue="app.acme.com/acme/join/7hq2xl" className="text-ellipsis" />
        <DialogFooter>
          <DialogClose render={<Button />}>Copy Link</DialogClose>
        </DialogFooter>
      </>
    )
  }
  if (size === "default") {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Add a task</DialogTitle>
          <DialogDescription>It goes to the top of To do in Website relaunch.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dialog-task-name">Task name</FieldLabel>
          <Input id="dialog-task-name" placeholder="Write the launch announcement" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="dialog-task-assignee">Assignee</FieldLabel>
            <NativeSelect id="dialog-task-assignee" defaultValue="priya" className="w-full">
              <NativeSelectOption value="maya">Maya Patel</NativeSelectOption>
              <NativeSelectOption value="priya">Priya Raman</NativeSelectOption>
              <NativeSelectOption value="sofia">Sofia Alvarez</NativeSelectOption>
              <NativeSelectOption value="jordan">Jordan Lee</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-task-priority">Priority</FieldLabel>
            <NativeSelect id="dialog-task-priority" defaultValue="medium" className="w-full">
              <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
              <NativeSelectOption value="high">High</NativeSelectOption>
              <NativeSelectOption value="medium">Medium</NativeSelectOption>
              <NativeSelectOption value="low">Low</NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Add Task</DialogClose>
        </DialogFooter>
      </>
    )
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription>Shortcuts work anywhere in Acme except inside text fields.</DialogDescription>
      </DialogHeader>
      <ul className="grid divide-y border-y">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.label} className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-copy">{shortcut.label}</span>
            <span className="flex gap-1">
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function DialogDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="A short, focused task on top of the page. The title says what happens; the footer ends with the action that does it."
        layout="full"
        code={`<Dialog>
  <DialogTrigger render={<Button />}>New Project</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create project</DialogTitle>
      <DialogDescription>
        A project holds the tasks, docs and timeline for one piece of work.
      </DialogDescription>
    </DialogHeader>
    <Field>
      <FieldLabel htmlFor="name">Project name</FieldLabel>
      <Input id="name" placeholder="Spring campaign" />
    </Field>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button type="submit">Create Project</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <DialogStage>
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button />}>
                <PlusIcon data-icon="inline-start" />
                New Project
              </DialogTrigger>
              <DialogContent container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Create project</DialogTitle>
                  <DialogDescription>
                    A project holds the tasks, docs and timeline for one piece of work. Invite people once it exists.
                  </DialogDescription>
                </DialogHeader>
                <Field>
                  <FieldLabel htmlFor="dialog-basic-name">Project name</FieldLabel>
                  <Input id="dialog-basic-name" placeholder="Spring campaign" />
                </Field>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <DialogClose render={<Button />}>Create Project</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Sizes"
        layout="full"
        description="Default width is --dialog-width. Use sm (--dialog-width-sm) for a single field or a short message, and lg (--dialog-width-lg) for reference content such as a list of shortcuts."
        code={`<DialogContent size="sm">…</DialogContent>
<DialogContent>…</DialogContent>
<DialogContent size="lg">…</DialogContent>`}
      >
        <SizesDemo />
      </Example>

      <Example
        title="Form with validation"
        description="Validate on submit and say how to fix the problem. While the request runs, disable both buttons and show a spinner in the action."
        layout="full"
        code={`<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger render={<Button />}>Invite Members</DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit} className="contents">
      <DialogHeader>…</DialogHeader>
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="emails">Email addresses</FieldLabel>
        <Input id="emails" aria-invalid={!!error} />
        <FieldDescription>{error ?? "Separate addresses with commas."}</FieldDescription>
      </Field>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />} disabled={pending}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={pending}>Send Invites</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`}
      >
        <DialogStage>{(container) => <InviteMembersDialog container={container} />}</DialogStage>
      </Example>

      <Example
        title="Close in the footer"
        description="Set showCloseButton={false} on the content and use <DialogFooter showCloseButton> when the dialog only informs, so the one way out is obvious."
        layout="full"
        code={`<DialogContent showCloseButton={false}>
  …
  <DialogFooter showCloseButton>
    <Button variant="ghost">Read the Changelog</Button>
  </DialogFooter>
</DialogContent>`}
      >
        <DialogStage>
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button variant="outline" />}>What’s New</DialogTrigger>
              <DialogContent showCloseButton={false} container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Automations 2.0 is here</DialogTitle>
                  <DialogDescription>
                    Rules can now run several steps and check a condition between them. The automations you already
                    have keep working as they are.
                  </DialogDescription>
                </DialogHeader>
                <ul className="grid gap-3 text-sm text-copy">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    Add an If step to route tasks by priority or assignee.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    Start from one of 20 recipes.
                  </li>
                </ul>
                <DialogFooter showCloseButton>
                  <Button variant="ghost">Read the Changelog</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Long content"
        layout="full"
        description="The dialog never grows past the viewport. Put a long list in its own scrolling region so the title and actions stay in view."
        code={`<DialogContent size="lg">
  <DialogHeader>
    <DialogTitle>Task history</DialogTitle>
    <DialogDescription>Write the launch announcement · Website relaunch</DialogDescription>
  </DialogHeader>
  <ol
    tabIndex={0}
    aria-label="Task history"
    className="max-h-72 divide-y overflow-auto rounded-(--control-radius) border"
  >
    {history.map((entry) => <li key={entry.id}>…</li>)}
  </ol>
  <DialogFooter>
    <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
    <Button>Export as CSV</Button>
  </DialogFooter>
</DialogContent>`}
      >
        <DialogStage className="min-h-144">
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button variant="outline" />}>View Task History</DialogTrigger>
              <DialogContent size="lg" container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Task history</DialogTitle>
                  <DialogDescription>
                    Write the launch announcement · Website relaunch · {taskHistory.length} changes
                  </DialogDescription>
                </DialogHeader>
                <ol
                  tabIndex={0}
                  aria-label="Task history"
                  className="grid max-h-72 divide-y overflow-auto rounded-(--control-radius) border outline-none focus-visible:focus-ring"
                >
                  {taskHistory.map((entry) => (
                    <li key={`${entry.time}-${entry.action}`} className="flex items-center gap-3 px-4 py-3">
                      <Avatar size="sm">
                        <AvatarFallback tone={initialsTone(entry.initials)}>{entry.initials}</AvatarFallback>
                      </Avatar>
                      <p className="min-w-0 flex-1 text-sm text-copy">
                        <span className="font-semibold text-foreground">{entry.name}</span> {entry.action}
                      </p>
                      <span className="shrink-0 text-caption text-muted-foreground tabular">{entry.time}</span>
                    </li>
                  ))}
                </ol>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                  <Button>Export as CSV</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Open from a menu"
        layout="full"
        description="Control the dialog with open and onOpenChange when something other than a trigger opens it, such as a menu item. Close this one, then choose Archive in the project menu."
        code={`const [open, setOpen] = React.useState(false)

<DropdownMenuItem onClick={() => setOpen(true)}>Archive</DropdownMenuItem>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>…</DialogContent>
</Dialog>`}
      >
        <DialogStage project={helpCenter}>{(container) => <ProjectMenuWithDialog container={container} />}</DialogStage>
      </Example>

      <Guidelines
        do={[
          "Use a dialog for a short task that needs an answer before people carry on.",
          "Match the title and the action: “Archive Help center” and “Archive project”.",
          "Put Cancel first and the action last, so the action sits on the right.",
          "Return focus to the trigger on close. The dialog does this for you when it has a trigger.",
        ]}
        dont={[
          "Don’t open a dialog from another dialog. Change the content in place or use a sheet.",
          "Don’t use a dialog for content people need to compare with the page behind it. Use a sheet.",
          "Don’t ask for confirmation of a destructive action here. Use an alert dialog.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "open", type: "boolean", description: "Controlled open state. Pair with onOpenChange." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog opens or closes." },
          { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
          { prop: "modal", type: 'boolean | "trap-focus"', default: "true", description: "Locks scroll and traps focus while open." },
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "On DialogContent. Maximum width: --dialog-width-sm, --dialog-width or --dialog-width-lg." },
          { prop: "showCloseButton", type: "boolean", default: "true", description: "On DialogContent. Shows the close button in the top-right corner." },
          { prop: "initialFocus", type: "RefObject | boolean", description: "On DialogContent. The element to focus when the dialog opens." },
          { prop: "showCloseButton (footer)", type: "boolean", default: "false", description: "On DialogFooter. Adds an outline Close button after the other actions." },
          { prop: "render", type: "ReactElement", description: "On DialogTrigger and DialogClose. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
