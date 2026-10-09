"use client"

import { ArrowRightIcon, CopyIcon, DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function ButtonDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        description="Every variant in two rows. The ink family handles everyday actions. Brand and destructive are for the one action that matters most on a view, so use one of them at a time, never next to primary."
        code={`<Button>Get started</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Self-host</Button>
<Button variant="ghost">Skip</Button>
<Button variant="link">Read the docs</Button>

<Button variant="brand">Upgrade</Button>
<Button variant="destructive">Delete project</Button>`}
      >
        <div className="grid justify-items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button>Get started</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="outline">Self-host</Button>
            <Button variant="ghost">Skip</Button>
            <Button variant="link">Read the docs</Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="brand">Upgrade</Button>
            <Button variant="destructive">Delete project</Button>
          </div>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Medium is the default. Large is for heroes and calls to action; small and extra small suit toolbars, table rows and input addons."
        code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>

<Button size="icon-xs" variant="outline" aria-label="Copy"><CopyIcon /></Button>
<Button size="icon-sm" variant="outline" aria-label="Copy"><CopyIcon /></Button>
<Button size="icon" variant="outline" aria-label="Copy"><CopyIcon /></Button>
<Button size="icon-lg" variant="outline" aria-label="Copy"><CopyIcon /></Button>`}
      >
        <div className="grid justify-items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="icon-xs" variant="outline" aria-label="Copy, extra small">
              <CopyIcon />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Copy, small">
              <CopyIcon />
            </Button>
            <Button size="icon" variant="outline" aria-label="Copy, medium">
              <CopyIcon />
            </Button>
            <Button size="icon-lg" variant="outline" aria-label="Copy, large">
              <CopyIcon />
            </Button>
          </div>
        </div>
      </Example>

      <Example
        title="With icons"
        description="Icons sit before the label for actions, after it for navigation. Mark them with data-icon so the padding on that side tightens."
        code={`<Button>
  <PlusIcon data-icon="inline-start" />
  New project
</Button>
<Button variant="outline">
  <DownloadIcon data-icon="inline-start" />
  Export
</Button>
<Button>
  Start for free
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button size="icon" variant="outline" aria-label="Delete">
  <Trash2Icon />
</Button>`}
      >
        <Button>
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
        <Button variant="outline">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button>
          Start for free
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Delete">
          <Trash2Icon />
        </Button>
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="Inverse variants keep contrast on dark panels, in both themes."
        code={`<Button variant="inverse">
  Get started
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button variant="outline-inverse">Book a demo</Button>`}
      >
        <Button variant="inverse">
          Get started
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline-inverse">Book a demo</Button>
      </Example>

      <Example
        title="States"
        description="Disabled buttons fade to half strength. While an action runs, keep the button disabled, swap the label to say what is happening and show a spinner."
        code={`<Button disabled>Deploy</Button>
<Button variant="outline" disabled>Export</Button>
<Button disabled aria-busy="true">
  <Spinner data-icon="inline-start" />
  Deploying
</Button>`}
      >
        <Button disabled>Deploy</Button>
        <Button variant="outline" disabled>
          Export
        </Button>
        <Button disabled aria-busy="true">
          <Spinner data-icon="inline-start" />
          Deploying
        </Button>
      </Example>

      <Example
        title="As a link"
        description="Render any element with the render prop. Set nativeButton to false when it is not a button."
        code={`<Button variant="outline" nativeButton={false} render={<Link href="/pricing" />}>
  See pricing
</Button>`}
      >
        <Button nativeButton={false} render={<a href="#pricing" />} variant="outline">
          See pricing
        </Button>
      </Example>

      <Guidelines
        do={[
          "Use one primary button per view.",
          "Write labels as verbs that say what happens: “Create project”, not “OK”.",
          "Use the inverse variants on dark panels.",
        ]}
        dont={[
          "Don’t use brand and primary side by side.",
          "Don’t add shadows or gradients to buttons.",
          "Don’t use a button for navigation that should be a link in text.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "brand" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "inverse" | "outline-inverse"', default: '"default"', description: "Visual style." },
          { prop: "size", type: '"xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "Height and padding, from --button-* tokens." },
          { prop: "render", type: "ReactElement", description: "Render as another element, such as a link." },
          { prop: "nativeButton", type: "boolean", default: "true", description: "Set to false when render is not a <button>." },
        ]}
      />
    </Examples>
  )
}
