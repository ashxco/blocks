import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerDocs() {
  return (
    <Examples>
      <Example
        title="Sizes"
        description="16px by default. Size it with size-* to match the text next to it."
        code={`<Spinner className="size-3" />
<Spinner />
<Spinner className="size-5" />
<Spinner className="size-6" />`}
      >
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-5" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </Example>

      <Example
        title="Colour"
        description="The spinner draws in currentColor, so it takes the colour of its text."
        code={`<Spinner className="text-muted-foreground" />
<Spinner className="text-brand" />`}
      >
        <Spinner className="size-5 text-foreground" />
        <Spinner className="size-5 text-muted-foreground" />
        <Spinner className="size-5 text-brand" />
      </Example>

      <Example title="On a panel" surface="panel" description="On dark panels it inherits the panel text colour.">
        <span className="inline-flex items-center gap-3 text-sm font-semibold text-panel-foreground">
          <Spinner />
          Provisioning lumen-prod-db
        </span>
      </Example>

      <Example
        title="In buttons and badges"
        description="Replace the leading icon with a spinner while the action runs, and disable the button."
        code={`<Button disabled>
  <Spinner data-icon="inline-start" />
  Deploying
</Button>`}
      >
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Deploying
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          Saving
        </Button>
        <Badge variant="info">
          <Spinner className="size-3" />
          Building
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
              <p className="text-title text-foreground">api.lumen.app</p>
              <p className="text-sm text-muted-foreground">Issuing certificate</p>
            </div>
            <Spinner className="text-muted-foreground" aria-label="Issuing certificate" />
          </li>
          <li className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="grid gap-0.5">
              <p className="text-title text-foreground">docs.lumen.app</p>
              <p className="text-sm text-muted-foreground">Waiting for DNS to propagate</p>
            </div>
            <Spinner className="text-muted-foreground" aria-label="Waiting for DNS" />
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
          { prop: "className", type: "string", default: '"size-4"', description: "Size with size-*, colour with text-*." },
          { prop: "aria-label", type: "string", default: '"Loading"', description: "What is loading. The spinner has role=\"status\"." },
          { prop: "...props", type: "SVGProps", description: "Any SVG attribute." },
        ]}
      />
    </Examples>
  )
}
