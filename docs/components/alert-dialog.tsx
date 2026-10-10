"use client"

import * as React from "react"
import { KeyRoundIcon, LogOutIcon, Trash2Icon, ZapIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Stage = HTMLDivElement | null

/**
 * Inside a stage, the dialog fits the stage rather than the viewport, and the
 * wheel carries on to the page once the dialog has nothing left to scroll.
 */
const inStage = "max-h-[calc(100%-2rem)] overscroll-auto"

/**
 * The previews show each alert dialog already open, in place on the page.
 * AlertDialog is always modal, which would lock this page's scroll and trap
 * focus, so the previews use the Dialog root that the alert dialog parts are
 * built on, without a modal state. Your code uses AlertDialog, as in the Code tab.
 */
function PreviewRoot({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
      {children}
    </Dialog>
  )
}

/**
 * The stage the dialog opens into. contain-layout makes it the containing
 * block for the fixed overlay and popup; isolate keeps them under the site header.
 * The overlay tints and blurs the page behind it, as it does over a real page.
 */
function DialogStage({
  title,
  meta,
  rows,
  children,
}: {
  title: string
  meta: string
  rows: { label: string; value: string; mono?: boolean }[]
  children: (container: Stage) => React.ReactNode
}) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className="relative isolate h-full min-h-128 w-full overflow-hidden contain-layout">
      <div className="grid content-start gap-8 p-6 sm:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-h3 text-foreground">{title}</p>
            <p className="text-caption text-muted-foreground">{meta}</p>
          </div>
          {children(container)}
        </div>
        <dl className="grid divide-y border-y">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-6 py-4">
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className={row.mono ? "font-mono text-code text-foreground" : "text-sm font-medium text-foreground"}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

const ruleRows = [
  { label: "When", value: "A task moves to Done" },
  { label: "Then", value: "Notify the task owner" },
  { label: "Runs this month", value: "7,240 of 10,000" },
  { label: "Last run", value: "4 minutes ago" },
]

const taskRows = [
  { label: "Assignee", value: "Priya Raman" },
  { label: "Due date", value: "Oct 14, 2026" },
  { label: "Priority", value: "High" },
  { label: "Subtasks", value: "2 of 4 done" },
]

const sessionRows = [
  { label: "MacBook Pro · Safari", value: "This device" },
  { label: "iPhone 16 · Acme app", value: "2 hours ago" },
  { label: "Windows · Chrome", value: "Yesterday" },
  { label: "iPad · Acme app", value: "3 days ago" },
]

const keyRows = [
  { label: "Name", value: "HubSpot sync" },
  { label: "Key", value: "acme_live_••••••••3f9a", mono: true },
  { label: "Access", value: "Read and write tasks" },
  { label: "Last used", value: "2 minutes ago" },
]

const projectRows = [
  { label: "Tasks", value: "30" },
  { label: "Docs", value: "12" },
  { label: "Automations", value: "3" },
  { label: "Owner", value: "Sam Okafor" },
]

function RunRuleDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)

  return (
    <PreviewRoot open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>
        <ZapIcon data-icon="inline-start" />
        Run on existing tasks
      </AlertDialogTrigger>
      <AlertDialogContent container={container} initialFocus={false} className={inStage}>
        <AlertDialogHeader>
          <AlertDialogTitle>Run this rule on 38 tasks?</AlertDialogTitle>
          <AlertDialogDescription>
            Each of the 38 tasks already in Done notifies its owner. This uses 38 of the 2,760 runs left this
            month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Run rule</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </PreviewRoot>
  )
}

function DeleteTaskDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)

  return (
    <PreviewRoot open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>Delete task</AlertDialogTrigger>
      <AlertDialogContent container={container} initialFocus={false} className={inStage}>
        <AlertDialogHeader>
          <AlertDialogMedia variant="destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>Write the launch announcement</strong>, its 4 subtasks and 3 comments are removed for everyone.
            Files linked from Google Drive stay where they are.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => setOpen(false)}>
            Delete task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </PreviewRoot>
  )
}

function SignOutDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)

  return (
    <PreviewRoot open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <LogOutIcon data-icon="inline-start" />
        Sign out everywhere
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" container={container} initialFocus={false} className={inStage}>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
          <AlertDialogDescription>You’ll need to sign in again on 4 devices, including this one.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </PreviewRoot>
  )
}

/**
 * The pending state, shown in place. The bar above the stage switches the
 * dialog between ready and pending; Rotate key runs the request for real.
 */
function PendingDemo() {
  const [open, setOpen] = React.useState(true)
  const [pending, setPending] = React.useState(true)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  function rotate() {
    setPending(true)
    timer.current = window.setTimeout(() => {
      setPending(false)
      setOpen(false)
    }, 1400)
  }

  function showState(next: string | undefined) {
    if (!next) return
    window.clearTimeout(timer.current)
    setPending(next === "pending")
    setOpen(true)
  }

  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
        <p className="text-caption text-muted-foreground">Dialog state</p>
        <ToggleGroup
          size="sm"
          aria-label="Dialog state"
          value={[pending ? "pending" : "ready"]}
          onValueChange={(value) => showState(value[0])}
        >
          <ToggleGroupItem value="ready">Ready</ToggleGroupItem>
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <DialogStage title="API keys" meta="Acme Inc. · Settings" rows={keyRows}>
        {(container) => (
          <PreviewRoot open={open} onOpenChange={(next) => !pending && setOpen(next)}>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              <KeyRoundIcon data-icon="inline-start" />
              Rotate API key
            </AlertDialogTrigger>
            <AlertDialogContent container={container} initialFocus={false} className={inStage}>
              <AlertDialogHeader>
                <AlertDialogTitle>Rotate the HubSpot sync key?</AlertDialogTitle>
                <AlertDialogDescription>
                  The current key stops working in 10 minutes. Paste the new key into the HubSpot integration before
                  then, or tasks stop syncing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={rotate} disabled={pending}>
                  {pending ? <Spinner data-icon="inline-start" /> : null}
                  {pending ? "Rotating key" : "Rotate key"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </PreviewRoot>
        )}
      </DialogStage>
    </div>
  )
}

function TypeToConfirmDialog({ container }: { container: Stage }) {
  const project = "Help center"
  const [open, setOpen] = React.useState(true)
  const [value, setValue] = React.useState("")
  const matches = value.trim() === project

  return (
    <PreviewRoot
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setValue("")
      }}
    >
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete project</AlertDialogTrigger>
      <AlertDialogContent container={container} initialFocus={false} className={inStage}>
        <AlertDialogHeader>
          <AlertDialogMedia variant="destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {project}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project, its 30 tasks, 12 docs and 3 automations for everyone in Acme Inc. You can’t
            undo this. Archive the project instead to keep its history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="alert-confirm">
            <span>
              Type <span className="font-semibold text-foreground">{project}</span> to confirm
            </span>
          </FieldLabel>
          <Input
            id="alert-confirm"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={!matches} onClick={() => setOpen(false)}>
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </PreviewRoot>
  )
}

export default function AlertDialogDocs() {
  return (
    <Examples>
      <Example
        title="Confirm an action"
        layout="full"
        description="Ask one clear question. The description says what will change; the action repeats the verb from the title. AlertDialogAction does not close the dialog on its own, so close it when the work is done."
        code={`const [open, setOpen] = React.useState(false)

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger render={<Button />}>Run on existing tasks</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Run this rule on 38 tasks?</AlertDialogTitle>
      <AlertDialogDescription>
        Each of the 38 tasks already in Done notifies its owner.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => runRule().then(() => setOpen(false))}>
        Run rule
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <DialogStage title="Notify owner on Done" meta="Automation · Website relaunch" rows={ruleRows}>
          {(container) => <RunRuleDialog container={container} />}
        </DialogStage>
      </Example>

      <Example
        title="Destructive"
        layout="full"
        description="Add a destructive media tile and use the destructive button for actions that delete data or can’t be undone."
        code={`<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogMedia variant="destructive">
      <Trash2Icon />
    </AlertDialogMedia>
    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
    <AlertDialogDescription>…</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive">Delete task</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`}
      >
        <DialogStage title="Write the launch announcement" meta="Task · Website relaunch" rows={taskRows}>
          {(container) => <DeleteTaskDialog container={container} />}
        </DialogStage>
      </Example>

      <Example
        title="Small"
        layout="full"
        description={`size="sm" narrows the dialog to --dialog-width-sm, centres a short question and gives both answers equal width. Good for sign-out and leave prompts.`}
        code={`<AlertDialogContent size="sm">…</AlertDialogContent>`}
      >
        <DialogStage title="Sessions" meta="4 devices signed in" rows={sessionRows}>
          {(container) => <SignOutDialog container={container} />}
        </DialogStage>
      </Example>

      <Example
        title="Pending state"
        layout="full"
        description="Keep the dialog open while the request runs. Disable both buttons and say what is happening in the action label."
        code={`<AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
  …
  <AlertDialogFooter>
    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={rotate} disabled={pending}>
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? "Rotating key" : "Rotate key"}
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>`}
      >
        <PendingDemo />
      </Example>

      <Example
        title="Type to confirm"
        layout="full"
        description="For the most destructive actions, ask people to type the name of what they are deleting. The action stays disabled until it matches."
      >
        <DialogStage title="Help center" meta="Paused · Settings · Danger zone" rows={projectRows}>
          {(container) => <TypeToConfirmDialog container={container} />}
        </DialogStage>
      </Example>

      <Guidelines
        do={[
          "Use an alert dialog only when the action is destructive, expensive or hard to undo.",
          "Write the title as a question that names the thing: “Delete Help center?”.",
          "Say exactly what will be lost or changed, with numbers when you have them.",
          "Label the action with the verb from the title, never “OK” or “Yes”.",
        ]}
        dont={[
          "Don’t use an alert dialog for routine confirmations. Make the action undoable and show a toast.",
          "Don’t add a close button or let a click on the overlay dismiss it. People answer it.",
          "Don’t put a form with several fields in it. Use a dialog.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "open", type: "boolean", description: "Controlled open state. Pair with onOpenChange." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog opens or closes. Ignore it while a request is pending." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "On AlertDialogContent. Maximum width: --dialog-width, or --dialog-width-sm for sm, which also centres the content and puts both buttons side by side." },
          { prop: "variant", type: "Button variant", default: '"default"', description: "On AlertDialogAction, a Button that does not close the dialog by itself. Use \"destructive\" for actions that delete data." },
          { prop: "variant (cancel)", type: "Button variant", default: '"outline"', description: "On AlertDialogCancel, which always closes the dialog." },
          { prop: "variant (media)", type: '"default" | "destructive"', default: '"default"', description: "On AlertDialogMedia. The default tile is bg-muted with a hairline border; destructive tints it with bg-destructive-subtle and drops the border." },
          { prop: "render", type: "ReactElement", description: "On AlertDialogTrigger. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
