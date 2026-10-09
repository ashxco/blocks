"use client"

import * as React from "react"
import { GitCommitHorizontalIcon, RotateCcwIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
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
        <span>Shown on the deployment page and in the changelog.</span>
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

  if (done) {
    return (
      <div role="status" className="grid w-full max-w-128 gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <h3 className="text-h4">Rolled back to 4e1a9c2</h3>
        <p className="text-body text-copy">
          Production now serves the previous build. Your reason is in the deployment log for the team.
        </p>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setDone(false)
              setReason("")
            }}
          >
            Undo rollback
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (reason.trim().length < 10) {
          setError("Add a short reason, at least 10 characters, so the team knows what went wrong.")
          return
        }
        setError(null)
        setDone(true)
      }}
      className="grid w-full max-w-128 gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)"
    >
      <div className="grid gap-1">
        <h3 className="text-h4">Roll back production</h3>
        <p className="text-body text-copy">Lumen switches traffic to the previous build in a few seconds.</p>
      </div>
      <div className="flex items-center gap-3 rounded-(--control-radius) bg-subtle px-4 py-3">
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
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => setReason("")}>
          Cancel
        </Button>
        <Button type="submit">
          <RotateCcwIcon data-icon="inline-start" />
          Roll back
        </Button>
      </div>
    </form>
  )
}

export default function TextareaDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="The same filled surface as Input. It starts with room for about four lines, grows with its content and resizes vertically."
        code={`<Field>
  <FieldLabel htmlFor="description">Description</FieldLabel>
  <Textarea id="description" placeholder="What does this project do?" />
</Field>`}
      >
        <div className="w-full max-w-112">
          <Field>
            <FieldLabel htmlFor="ta-default">Description</FieldLabel>
            <Textarea id="ta-default" placeholder="What does this project do?" />
            <FieldDescription>Shown on the project card. Markdown is not rendered.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Character count"
        layout="stack"
        description="When there is a limit, show what is left in the description and set maxLength so the limit is enforced."
        code={`<Textarea maxLength={280} value={text} onChange={…} aria-describedby="count" />
<FieldDescription id="count">{280 - text.length} left</FieldDescription>`}
      >
        <div className="w-full max-w-112">
          <ReleaseNotes />
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Read-only drops the fill and the resize handle. Invalid takes a destructive border and an error below."
        code={`<Textarea readOnly defaultValue={log} />
<Textarea disabled />
<Textarea aria-invalid aria-describedby="error" />`}
      >
        <div className="grid w-full max-w-168 gap-6 md:grid-cols-3">
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
          <Field data-invalid>
            <FieldLabel htmlFor="ta-invalid">Allowed origins</FieldLabel>
            <Textarea id="ta-invalid" aria-invalid aria-describedby="ta-invalid-error" defaultValue={"halcyon.dev\nhttp//staging"} />
            <FieldError id="ta-invalid-error">Line 2 is missing a colon after http.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Roll back production"
        description="A required reason before a risky action. Submit an empty reason to see the error."
        code={`<Field data-invalid={!!error}>
  <FieldLabel htmlFor="reason">Reason</FieldLabel>
  <Textarea id="reason" aria-invalid={!!error} aria-describedby="reason-error" />
  <FieldError id="reason-error">{error}</FieldError>
</Field>`}
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
