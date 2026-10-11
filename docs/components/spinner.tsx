import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const sizes = ["size-3", "size-4", "size-5", "size-6", "size-8"]

const colours = [
  { className: "text-foreground", label: "text-foreground" },
  { className: "text-muted-foreground", label: "text-muted-foreground" },
  { className: "text-brand", label: "text-brand" },
]

/** One spinner with the class that draws it, so each specimen says what it is. */
function Specimen({
  caption,
  children,
}: {
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className="grid min-w-20 justify-items-center gap-3">
      <span className="grid h-8 place-items-center">{children}</span>
      <figcaption className="font-mono text-code text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function SpinnerDocs() {
  return (
    <Examples>
      <Example
        title="Sizes"
        description="16px by default. Size it with size-* to match the text next to it."
        code={`<Spinner className="size-3" />
<Spinner />
<Spinner className="size-5" />
<Spinner className="size-6" />
<Spinner className="size-8" />`}
      >
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-8">
          {sizes.map((size) => (
            <Specimen key={size} caption={size}>
              <Spinner className={size} />
            </Specimen>
          ))}
        </div>
      </Example>

      <Example
        title="Colour"
        description="The spinner draws in currentColor, so it takes the colour of its text."
        code={`<Spinner className="text-muted-foreground" />
<Spinner className="text-brand" />`}
      >
        <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-8">
          {colours.map((colour) => (
            <Specimen key={colour.label} caption={colour.label}>
              <Spinner className={`size-5 ${colour.className}`} />
            </Specimen>
          ))}
        </div>
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="On dark panels it inherits the panel text colour."
      >
        <span className="inline-flex items-center gap-3 text-sm font-semibold text-panel-foreground">
          <Spinner />
          Importing 284 tasks
        </span>
      </Example>

      <Example
        title="In buttons and badges"
        description="Replace the leading icon with a spinner while the action runs, and disable the button."
        code={`<Button disabled>
  <Spinner data-icon="inline-start" />
  Sending Invites
</Button>`}
      >
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Sending Invites
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          Saving
        </Button>
        <Badge variant="info">
          <Spinner className="size-3" />
          Importing
        </Badge>
      </Example>

      <Example
        title="Inline status"
        description="Pair the spinner with text that says what is happening."
        layout="stack"
      >
        <ul className="divide-y overflow-hidden rounded-(--card-radius) border bg-card">
          <li className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="grid gap-0.5">
              <p className="text-title text-foreground">Google Drive</p>
              <p className="text-sm text-muted-foreground">
                Syncing 2 shared folders
              </p>
            </div>
            <Spinner
              className="text-muted-foreground"
              aria-label="Syncing Google Drive"
            />
          </li>
          <li className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="grid gap-0.5">
              <p className="text-title text-foreground">Slack</p>
              <p className="text-sm text-muted-foreground">
                Waiting for a Slack admin to approve the app
              </p>
            </div>
            <Spinner
              className="text-muted-foreground"
              aria-label="Waiting for Slack approval"
            />
          </li>
        </ul>
      </Example>

      <Guidelines
        do={[
          "Use a spinner for short waits of unknown length.",
          "Say what is loading, next to the spinner or in its aria-label.",
          "Keep the layout stable: reserve the space the result will take.",
        ]}
        dont={[
          "Don’t show a spinner for the whole page. Use skeletons that match the layout.",
          "Don’t use a spinner when you know the progress. Use a progress bar.",
          "Don’t show several spinners for one task.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "className",
            type: "string",
            default: '"size-4"',
            description: "Size with size-*, colour with text-*.",
          },
          {
            prop: "aria-label",
            type: "string",
            default: '"Loading"',
            description: 'What is loading. The spinner has role="status".',
          },
          {
            prop: "...props",
            type: "SVGProps",
            description: "Any SVG attribute.",
          },
        ]}
      />
    </Examples>
  )
}
