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
        description="The ink family on the first row handles everyday actions. Brand and destructive mark the one action that matters most on a view. They share a row here only for comparison: in a product, use one of them at a time and never next to primary. In the mono theme the accent is ink, so brand looks the same as primary."
        code={`<Button>Invite Members</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Import Tasks</Button>
<Button variant="ghost">Skip</Button>
<Button variant="link">Read the Docs</Button>

<Button variant="brand">Upgrade</Button>
<Button variant="destructive">Delete Project</Button>`}
      >
        <div className="grid justify-items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button>Invite Members</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="outline">Import Tasks</Button>
            <Button variant="ghost">Skip</Button>
            <Button variant="link">Read the Docs</Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="brand">Upgrade</Button>
            <Button variant="destructive">Delete Project</Button>
          </div>
        </div>
      </Example>

      <Example
        title="Hierarchy"
        thumbnail
        description="Give a view one primary action. An outline button carries the alternative and a ghost button the action people can skip."
        code={`<Button variant="ghost">Skip for Now</Button>
<Button variant="outline">Save Draft</Button>
<Button>Create Project</Button>`}
      >
        <Button variant="ghost">Skip for Now</Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Create Project</Button>
      </Example>

      <Example
        title="Sizes"
        description="Medium is the default. Large is for heroes and calls to action; small and extra small suit toolbars, table rows and input addons."
        code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>

<Button size="icon-xs" variant="outline" aria-label="Add task"><PlusIcon /></Button>
<Button size="icon-sm" variant="outline" aria-label="Add task"><PlusIcon /></Button>
<Button size="icon" variant="outline" aria-label="Add task"><PlusIcon /></Button>
<Button size="icon-lg" variant="outline" aria-label="Add task"><PlusIcon /></Button>`}
      >
        <div className="grid justify-items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="icon-xs" variant="outline" aria-label="Add task, extra small">
              <PlusIcon />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Add task, small">
              <PlusIcon />
            </Button>
            <Button size="icon" variant="outline" aria-label="Add task, medium">
              <PlusIcon />
            </Button>
            <Button size="icon-lg" variant="outline" aria-label="Add task, large">
              <PlusIcon />
            </Button>
          </div>
        </div>
      </Example>

      <Example
        title="With icons"
        description="Icons sit before the label for actions, after it for navigation. Mark them with data-icon so the padding on that side tightens."
        code={`<Button>
  <PlusIcon data-icon="inline-start" />
  New Project
</Button>
<Button variant="outline">
  <DownloadIcon data-icon="inline-start" />
  Export
</Button>
<Button>
  Start Free Trial
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button size="icon" variant="outline" aria-label="Delete">
  <Trash2Icon />
</Button>`}
      >
        <Button>
          <PlusIcon data-icon="inline-start" />
          New Project
        </Button>
        <Button variant="outline">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button>
          Start Free Trial
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Delete">
          <Trash2Icon />
        </Button>
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="Inverse variants keep contrast on dark panels, in light and dark."
        code={`<Button variant="inverse">
  Start Free Trial
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button variant="outline-inverse">Book a Demo</Button>`}
      >
        <Button variant="inverse">
          Start Free Trial
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline-inverse">Book a Demo</Button>
      </Example>

      <Example
        title="States"
        description="Disabled buttons fade to half strength. While an action runs, keep the button disabled, swap the label to say what is happening and show a spinner."
        code={`<Button disabled>Create Project</Button>
<Button variant="outline" disabled>Export</Button>
<Button disabled aria-busy="true">
  <Spinner data-icon="inline-start" />
  Creating Project
</Button>`}
      >
        <Button disabled>Create Project</Button>
        <Button variant="outline" disabled>
          Export
        </Button>
        <Button disabled aria-busy="true">
          <Spinner data-icon="inline-start" />
          Creating Project
        </Button>
      </Example>

      <Example
        title="As a link"
        description="Render a Next.js Link, or any other element, with the render prop. Set nativeButton to false when it is not a button. Any variant works, including link for a quieter text action."
        code={`<Button variant="outline" nativeButton={false} render={<Link href="/pricing" />}>
  See Pricing
</Button>
<Button variant="link" nativeButton={false} render={<Link href="/changelog" />}>
  Read the Changelog
  <ArrowRightIcon data-icon="inline-end" />
</Button>`}
      >
        <Button nativeButton={false} render={<a href="#pricing" />} variant="outline">
          See Pricing
        </Button>
        <Button nativeButton={false} render={<a href="#changelog" />} variant="link">
          Read the Changelog
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </Example>

      <Guidelines
        do={[
          "Use one primary button per view.",
          "Write labels as verbs that say what happens: “Create Project”, not “OK”.",
          "Write labels in Title Case, keeping short words like a, the, to and for lowercase: “Read the Docs”, “Skip for Now”.",
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
