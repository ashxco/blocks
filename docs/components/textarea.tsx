"use client"

import * as React from "react"
import { GitCommitHorizontalIcon, RotateCcwIcon } from "lucide-react"

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

function ReleaseNotes() {
  const max = 280
  const [text, setText] = React.useState("Faster cold starts for functions in fra1 and a fix for preview URLs on branches with slashes.")
  const remaining = max - text.length
  return (
    <Field>
      <FieldLabel htmlFor="ta-notes">Release notes</FieldLabel>
      <Textarea
        id="ta-notes"
        value={text}
        maxLength={max}
        onChange={(e) => setText(e.target.value)}
        aria-describedby="ta-notes-count"
      />
      <FieldDescription id="ta-notes-count" className="flex justify-between gap-4">
        <span>Shown on the deployment page.</span>
        <span className={remaining < 20 ? "shrink-0 font-semibold text-foreground tabular" : "shrink-0 tabular"}>
          {remaining} left
        </span>
      </FieldDescription>
    </Field>
  )
}

function RollbackForm() {
  const id = React.useId()
  const [reason, setReason] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)
  const reasonRef = React.useRef<HTMLTextAreaElement>(null)

  if (done) {
    return (
      <Card role="status" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rolled back to 4e1a9c2</CardTitle>
          <CardDescription className="text-pretty">
            Production now serves the previous build. Your reason is in the deployment log for the team.
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
            Undo rollback
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
            setError("Add a short reason, at least 10 characters, so the team knows what went wrong.")
            reasonRef.current?.focus()
            return
          }
          setError(null)
          setDone(true)
        }}
        className="contents"
      >
        <CardHeader>
          <CardTitle>Roll back production</CardTitle>
          <CardDescription className="text-pretty">Lumen switches traffic to the previous build in a few seconds.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 rounded-(--control-radius) bg-muted px-4 py-3">
            <GitCommitHorizontalIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <div className="grid min-w-0 gap-0.5">
              <p className="truncate text-label text-foreground">Fix checkout redirect loop</p>
              <p className="text-caption text-muted-foreground">
                <span className="font-mono">4e1a9c2</span> on main, deployed 2 hours ago
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
              placeholder="Checkout returns 500 for logged-out visitors since the last deploy."
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
            <RotateCcwIcon data-icon="inline-start" />
            Roll back
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
  <Textarea id="description" placeholder="Storefront for Acme’s spring collection, built with Next.js." />
  <FieldDescription>Shown on the project card. Markdown is not rendered.</FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="ta-default">Description</FieldLabel>
            <Textarea id="ta-default" placeholder="Storefront for Acme’s spring collection, built with Next.js." />
            <FieldDescription>Shown on the project card. Markdown is not rendered.</FieldDescription>
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
  <FieldLabel htmlFor="notes">Release notes</FieldLabel>
  <Textarea
    id="notes"
    value={text}
    maxLength={max}
    onChange={(e) => setText(e.target.value)}
    aria-describedby="notes-count"
  />
  <FieldDescription id="notes-count" className="flex justify-between gap-4">
    <span>Shown on the deployment page.</span>
    <span className="shrink-0 tabular">{max - text.length} left</span>
  </FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <ReleaseNotes />
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Read-only drops the fill and the resize handle. Invalid takes a destructive border and an error below."
        code={`<Field>
  <FieldLabel htmlFor="output">Build command output</FieldLabel>
  <Textarea id="output" readOnly className="font-mono" defaultValue={"> next build\\n✓ Compiled in 18.4s\\n✓ 42 pages generated"} />
</Field>

<Field data-disabled>
  <FieldLabel htmlFor="install">Install command</FieldLabel>
  <Textarea id="install" disabled defaultValue="npm ci" className="font-mono" />
  <FieldDescription>Set by the framework preset.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="origins">Allowed origins</FieldLabel>
  <Textarea id="origins" aria-invalid aria-describedby="origins-error" defaultValue={"acme.dev\\nhttp//staging"} />
  <FieldError id="origins-error">Line 2 is missing a colon after http.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="ta-readonly">Build command output</FieldLabel>
            <Textarea
              id="ta-readonly"
              readOnly
              className="font-mono"
              defaultValue={"> next build\n✓ Compiled in 18.4s\n✓ 42 pages generated"}
            />
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ta-disabled">Install command</FieldLabel>
            <Textarea id="ta-disabled" disabled defaultValue="npm ci" className="font-mono" />
            <FieldDescription>Set by the framework preset.</FieldDescription>
          </Field>
          <Field data-invalid className="@xl:col-span-2">
            <FieldLabel htmlFor="ta-invalid">Allowed origins</FieldLabel>
            <Textarea id="ta-invalid" aria-invalid aria-describedby="ta-invalid-error" defaultValue={"acme.dev\nhttp//staging"} />
            <FieldError id="ta-invalid-error">Line 2 is missing a colon after http.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Roll back production"
        description="A required reason before a risky action. Submit an empty reason to see the error."
        surface="subtle"
        code={`const reasonRef = React.useRef<HTMLTextAreaElement>(null)

function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if (reason.trim().length < 10) {
    setError("Add a short reason, at least 10 characters, so the team knows what went wrong.")
    reasonRef.current?.focus()
    return
  }
  rollBack(reason)
}

<Card className="w-full max-w-md">
  <form noValidate onSubmit={onSubmit} className="contents">
    <CardHeader>
      <CardTitle>Roll back production</CardTitle>
      <CardDescription>Lumen switches traffic to the previous build in a few seconds.</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-6">
      <div className="flex items-center gap-3 rounded-(--control-radius) bg-muted px-4 py-3">
        <GitCommitHorizontalIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <div className="grid min-w-0 gap-0.5">
          <p className="truncate text-label text-foreground">Fix checkout redirect loop</p>
          <p className="text-caption text-muted-foreground">
            <span className="font-mono">4e1a9c2</span> on main, deployed 2 hours ago
          </p>
        </div>
      </div>
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="reason">Reason</FieldLabel>
        <Textarea
          ref={reasonRef}
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Checkout returns 500 for logged-out visitors since the last deploy."
          aria-invalid={!!error}
          aria-describedby={error ? "reason-error" : undefined}
        />
        <FieldError id="reason-error">{error}</FieldError>
      </Field>
    </CardContent>
    <CardFooter className="justify-end">
      <Button type="button" variant="ghost">Cancel</Button>
      <Button type="submit">
        <RotateCcwIcon data-icon="inline-start" />
        Roll back
      </Button>
    </CardFooter>
  </form>
</Card>`}
      >
        <RollbackForm />
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
          { prop: "aria-invalid", type: "boolean", description: "Destructive border and focus outline. Link the FieldError with aria-describedby." },
          { prop: "readOnly", type: "boolean", description: "Canvas colour, no fill and no resize handle." },
          { prop: "disabled", type: "boolean", description: "Dims the field and blocks interaction." },
          { prop: "maxLength", type: "number", description: "Hard limit on characters. Show the count nearby." },
          { prop: "placeholder", type: "string", description: "An example of a good answer. It disappears as soon as people type." },
          { prop: "…props", type: "TextareaHTMLAttributes", description: "Every native textarea attribute." },
        ]}
      />
    </Examples>
  )
}
