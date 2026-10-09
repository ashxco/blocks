"use client"

import { ArrowRightIcon, DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function ButtonDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        description="Primary is ink. Use brand sparingly, for the one action you most want people to take."
        code={`<Button>Get started</Button>
<Button variant="brand">Upgrade</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Self-host</Button>
<Button variant="ghost">Skip</Button>
<Button variant="link">Read the docs</Button>
<Button variant="destructive">Delete</Button>`}
      >
        <Button>Get started</Button>
        <Button variant="brand">Upgrade</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="outline">Self-host</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="link">Read the docs</Button>
        <Button variant="destructive">Delete project</Button>
      </Example>

      <Example title="Sizes" description="Medium is the default. Large is for heroes and calls to action.">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Medium</Button>
        <Button size="lg">Large</Button>
      </Example>

      <Example title="With icons" description="Icons sit before the label for actions, after it for navigation.">
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

      <Example title="On a panel" surface="panel" description="Inverse variants keep contrast on dark panels.">
        <Button variant="inverse">
          Get started
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline-inverse">Book a demo</Button>
      </Example>

      <Example title="States">
        <Button disabled>Disabled</Button>
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Saving
        </Button>
      </Example>

      <Example
        title="As a link"
        description="Render any element with the render prop. Set nativeButton to false when it is not a button."
        code={`<Button nativeButton={false} render={<Link href="/pricing" />}>
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
