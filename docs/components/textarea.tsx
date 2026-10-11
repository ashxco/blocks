"use client"

import * as React from "react"
import { FolderIcon, PauseIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

function WeeklyUpdate() {
  const max = 280
  const [text, setText] = React.useState(
    "Hero copy is approved and the pricing page is in review. Launch is still on track for November 3."
  )
  const remaining = max - text.length
  return (
    <Field>
      <FieldLabel htmlFor="ta-update">Weekly update</FieldLabel>
      <Textarea
        id="ta-update"
        value={text}
        maxLength={max}
        onChange={(e) => setText(e.target.value)}
        aria-describedby="ta-update-count"
      />
      <FieldDescription
        id="ta-update-count"
        className="flex justify-between gap-4"
      >
        <span>Sent to everyone following the project.</span>
        <span
          className={
            remaining < 20
              ? "shrink-0 font-semibold text-foreground tabular"
              : "shrink-0 tabular"
          }
        >
          {remaining} left
        </span>
      </FieldDescription>
    </Field>
  )
}

function PauseProjectForm() {
  const id = React.useId()
  const [reason, setReason] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)
  const reasonRef = React.useRef<HTMLTextAreaElement>(null)

  if (done) {
    return (
      <Card role="status" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Help center is paused</CardTitle>
          <CardDescription className="text-pretty">
            Automations have stopped. Your reason is in the project activity for
            the team.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDone(false)
              setReason("")
            }}
          >
            Resume Project
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (reason.trim().length < 10) {
            setError(
              "Add a short reason, at least 10 characters, so the team knows why."
            )
            reasonRef.current?.focus()
            return
          }
          setError(null)
          setDone(true)
        }}
        className="contents"
      >
        <CardHeader>
          <CardTitle>Pause project</CardTitle>
          <CardDescription className="text-pretty">
            Open tasks stay where they are, but automations stop and due date
            reminders go quiet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 rounded-(--control-radius) bg-muted px-4 py-3">
            <FolderIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <div className="grid min-w-0 gap-0.5">
              <p className="truncate text-label text-foreground">Help center</p>
              <p className="text-caption text-muted-foreground">
                14 open tasks, owned by Sam Okafor
              </p>
            </div>
          </div>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`${id}-reason`}>Reason</FieldLabel>
            <Textarea
              ref={reasonRef}
              id={`${id}-reason`}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError(null)
              }}
              placeholder="Waiting on the new support tool contract before we write more articles."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <FieldError id={`${id}-error`}>{error}</FieldError>
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="button" variant="ghost" onClick={() => setReason("")}>
            Cancel
          </Button>
          <Button type="submit">
            <PauseIcon data-icon="inline-start" />
            Pause Project
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function TextareaDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="The same filled surface as Input. It starts with room for about four lines and grows with its content, so most answers need no resizing; the quiet corner grip still resizes it vertically."
        code={`<Field>
  <FieldLabel htmlFor="description">Description</FieldLabel>
  <Textarea id="description" placeholder="New homepage, pricing page and help center links, live before the November launch." />
  <FieldDescription>Shown on the project card. Markdown is not rendered.</FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="ta-default">Description</FieldLabel>
            <Textarea
              id="ta-default"
              placeholder="New homepage, pricing page and help center links, live before the November launch."
            />
            <FieldDescription>
              Shown on the project card. Markdown is not rendered.
            </FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Character count"
        layout="stack"
        description="When there is a limit, show what is left in the description and set maxLength so the limit is enforced."
        code={`const max = 280
const [text, setText] = React.useState("")

<Field>
  <FieldLabel htmlFor="update">Weekly update</FieldLabel>
  <Textarea
    id="update"
    value={text}
    maxLength={max}
    onChange={(e) => setText(e.target.value)}
    aria-describedby="update-count"
  />
  <FieldDescription id="update-count" className="flex justify-between gap-4">
    <span>Sent to everyone following the project.</span>
    <span className="shrink-0 tabular">{max - text.length} left</span>
  </FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <WeeklyUpdate />
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Read-only drops the fill and the resize handle. Invalid takes a destructive border and an error below."
        code={`<Field>
  <FieldLabel htmlFor="rule">Automation rule</FieldLabel>
  <Textarea id="rule" readOnly defaultValue={"When a task moves to Done\\nNotify the task owner\\nPost in #website-relaunch"} />
</Field>

<Field data-disabled>
  <FieldLabel htmlFor="template">Task description</FieldLabel>
  <Textarea id="template" disabled defaultValue={"Goal:\\nAcceptance criteria:\\nLinks:"} />
  <FieldDescription>Set by the Sprint planning template.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="guests">Guest emails</FieldLabel>
  <Textarea id="guests" aria-invalid aria-describedby="guests-error" defaultValue={"elena@northwind.com\\nmarcus@globex"} />
  <FieldError id="guests-error">Line 2 is missing the end of the address, like marcus@globex.com.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="ta-readonly">Automation rule</FieldLabel>
            <Textarea
              id="ta-readonly"
              readOnly
              defaultValue={
                "When a task moves to Done\nNotify the task owner\nPost in #website-relaunch"
              }
            />
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ta-disabled">Task description</FieldLabel>
            <Textarea
              id="ta-disabled"
              disabled
              defaultValue={"Goal:\nAcceptance criteria:\nLinks:"}
            />
            <FieldDescription>
              Set by the Sprint planning template.
            </FieldDescription>
          </Field>
          <Field data-invalid className="@xl:col-span-2">
            <FieldLabel htmlFor="ta-invalid">Guest emails</FieldLabel>
            <Textarea
              id="ta-invalid"
              aria-invalid
              aria-describedby="ta-invalid-error"
              defaultValue={"elena@northwind.com\nmarcus@globex"}
            />
            <FieldError id="ta-invalid-error">
              Line 2 is missing the end of the address, like marcus@globex.com.
            </FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Pause a project"
        description="A required reason before an action that affects the whole team. Submit an empty reason to see the error."
        surface="subtle"
        code={`const reasonRef = React.useRef<HTMLTextAreaElement>(null)

function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if (reason.trim().length < 10) {
    setError("Add a short reason, at least 10 characters, so the team knows why.")
    reasonRef.current?.focus()
    return
  }
  pauseProject(reason)
}

<Card className="w-full max-w-md">
  <form noValidate onSubmit={onSubmit} className="contents">
    <CardHeader>
      <CardTitle>Pause project</CardTitle>
      <CardDescription>
        Open tasks stay where they are, but automations stop and due date reminders go quiet.
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-6">
      <div className="flex items-center gap-3 rounded-(--control-radius) bg-muted px-4 py-3">
        <FolderIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <div className="grid min-w-0 gap-0.5">
          <p className="truncate text-label text-foreground">Help center</p>
          <p className="text-caption text-muted-foreground">14 open tasks, owned by Sam Okafor</p>
        </div>
      </div>
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="reason">Reason</FieldLabel>
        <Textarea
          ref={reasonRef}
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Waiting on the new support tool contract before we write more articles."
          aria-invalid={!!error}
          aria-describedby={error ? "reason-error" : undefined}
        />
        <FieldError id="reason-error">{error}</FieldError>
      </Field>
    </CardContent>
    <CardFooter className="justify-end">
      <Button type="button" variant="ghost">Cancel</Button>
      <Button type="submit">
        <PauseIcon data-icon="inline-start" />
        Pause Project
      </Button>
    </CardFooter>
  </form>
</Card>`}
      >
        <PauseProjectForm />
      </Example>

      <Guidelines
        do={[
          "Use a textarea when the answer can run to more than one sentence.",
          "Show the limit as it approaches, and enforce it with maxLength.",
          "Write a placeholder that shows a good answer, not an instruction.",
        ]}
        dont={[
          "Don’t use a textarea for values that must be one line, such as names or URLs.",
          "Don’t turn off vertical resizing on editable fields.",
          "Don’t make the minimum height smaller than three lines.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "aria-invalid",
            type: "boolean",
            description:
              "Destructive border and focus outline. Link the FieldError with aria-describedby.",
          },
          {
            prop: "readOnly",
            type: "boolean",
            description: "Canvas colour, no fill and no resize handle.",
          },
          {
            prop: "disabled",
            type: "boolean",
            description: "Dims the field and blocks interaction.",
          },
          {
            prop: "maxLength",
            type: "number",
            description: "Hard limit on characters. Show the count nearby.",
          },
          {
            prop: "placeholder",
            type: "string",
            description:
              "An example of a good answer. It disappears as soon as people type.",
          },
          {
            prop: "…props",
            type: "TextareaHTMLAttributes",
            description: "Every native textarea attribute.",
          },
        ]}
      />
    </Examples>
  )
}
