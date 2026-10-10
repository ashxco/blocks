import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Inline } from "@/components/ui/inline"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Stack } from "@/components/ui/stack"

export default function StackDocs() {
  return (
    <Examples>
      <Example
        title="Settings page"
        thumbnail
        layout="stack"
        description="Stacks nest: the page uses the stack gap between its blocks, the header a tight gap between title and text, and the form a medium gap between fields. Inline lines the actions up at the end."
        code={`<Stack className="max-w-lg">
  <Stack gap={1}>
    <h3 className="text-h4">Workspace</h3>
    <p className="text-body text-copy">How Acme Inc. appears to members and guests.</p>
  </Stack>
  <Separator />
  <Stack gap={5}>
    <Stack gap={2}>
      <Label htmlFor="workspace-name">Workspace name</Label>
      <Input id="workspace-name" defaultValue="Acme Inc." />
    </Stack>
    <Stack gap={2}>
      <Label htmlFor="workspace-url">Workspace URL</Label>
      <Input id="workspace-url" defaultValue="app.acme.com/acme" />
    </Stack>
  </Stack>
  <Inline justify="end">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </Inline>
</Stack>`}
      >
        <Stack className="max-w-lg">
          <Stack gap={1}>
            <h3 className="text-h4">Workspace</h3>
            <p className="text-body text-copy">How Acme Inc. appears to members and guests.</p>
          </Stack>
          <Separator />
          <Stack gap={5}>
            <Stack gap={2}>
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Acme Inc." />
            </Stack>
            <Stack gap={2}>
              <Label htmlFor="workspace-url">Workspace URL</Label>
              <Input id="workspace-url" defaultValue="app.acme.com/acme" />
            </Stack>
          </Stack>
          <Inline justify="end">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </Inline>
        </Stack>
      </Example>

      <Example
        title="Gaps"
        description="Gaps are steps of the 4px spacing unit, from 0 to 16, plus stack (--spacing-stack, 24px), the default. Small gaps tie a title to its text; the stack gap separates blocks."
        code={`<Stack gap={2}>…</Stack>
<Stack gap={4}>…</Stack>
<Stack>…</Stack>`}
      >
        <div className="grid w-full max-w-xl grid-cols-3 gap-6">
          {([2, 4, "stack"] as const).map((gap) => (
            <Stack key={gap} gap={3}>
              <Stack gap={gap} className="rounded-md bg-muted p-3">
                <span className="h-8 rounded-sm border border-border-strong bg-background" />
                <span className="h-8 rounded-sm border border-border-strong bg-background" />
                <span className="h-8 rounded-sm border border-border-strong bg-background" />
              </Stack>
              <code className="text-center font-mono text-code text-muted-foreground">gap={typeof gap === "number" ? `{${gap}}` : '"stack"'}</code>
            </Stack>
          ))}
        </div>
      </Example>

      <Example
        title="Alignment"
        layout="stack"
        description="Children stretch to the stack’s width by default, which suits fields and cards. Align them to the start to keep buttons and badges at their own width."
        code={`<Stack gap={3} align="start">
  <p className="text-body text-copy">Your Pro trial ends in 5 days.</p>
  <Button>Upgrade to Pro</Button>
</Stack>`}
      >
        <Stack gap={3} align="start" className="max-w-lg">
          <p className="text-body text-copy">Your Pro trial ends in 5 days.</p>
          <Button>Upgrade to Pro</Button>
        </Stack>
      </Example>

      <Guidelines
        do={[
          "Space a group of blocks with one Stack instead of margins on each child.",
          "Nest stacks: a large gap between groups, a small one inside each group.",
          "Use the stack gap between blocks in a section, so every page has the same rhythm.",
        ]}
        dont={[
          "Don’t add margins to the children of a stack. The gap is the only space between them.",
          "Don’t use a stack for a row of buttons or badges. Use Inline.",
          "Don’t reach for in-between values. If no step fits, the grouping needs another level.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "gap", type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | "stack"', default: '"stack"', description: "Space between children, in steps of --spacing, or --spacing-stack." },
          { prop: "align", type: '"stretch" | "start" | "center" | "end"', default: '"stretch"', description: "Where children sit across the stack." },
          { prop: "render", type: "ReactElement", description: "Render as another element, such as a form, section or ul." },
        ]}
      />
    </Examples>
  )
}
