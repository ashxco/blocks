import { CalendarIcon, PlusIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Inline } from "@/components/ui/inline"
import { Stack } from "@/components/ui/stack"

export default function InlineDocs() {
  return (
    <Examples>
      <Example
        title="Title and actions"
        thumbnail
        layout="stack"
        description='justify="between" puts the title at the start and the actions at the end. When the row runs out of room, the actions wrap under the title instead of squeezing it.'
        code={`<Inline justify="between" gap={4}>
  <Stack gap={1}>
    <h3 className="text-h4">Website relaunch</h3>
    <p className="text-caption text-muted-foreground">52 tasks · Due Nov 14, 2026</p>
  </Stack>
  <Inline>
    <Button variant="outline">Share</Button>
    <Button>
      <PlusIcon />
      New Task
    </Button>
  </Inline>
</Inline>`}
      >
        <Inline justify="between" gap={4}>
          <Stack gap={1}>
            <h3 className="text-h4">Website relaunch</h3>
            <p className="text-caption text-muted-foreground">52 tasks · Due Nov 14, 2026</p>
          </Stack>
          <Inline>
            <Button variant="outline">Share</Button>
            <Button>
              <PlusIcon />
              New Task
            </Button>
          </Inline>
        </Inline>
      </Example>

      <Example
        title="Metadata"
        layout="stack"
        description="A cluster of small items with a wider gap, such as a task’s status, priority, people and due date. Align to the baseline when the items are all text."
        code={`<Inline gap={3}>
  <Badge variant="warning">At risk</Badge>
  <Badge variant="outline">High</Badge>
  <AvatarGroup>
    <Avatar size="sm"><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>
    <Avatar size="sm"><AvatarFallback tone="mint">JL</AvatarFallback></Avatar>
  </AvatarGroup>
  <Inline gap={1.5} className="text-caption text-muted-foreground">
    <CalendarIcon aria-hidden className="size-3.5" />
    Due Nov 14
  </Inline>
</Inline>`}
      >
        <Inline gap={3}>
          <Badge variant="warning">At risk</Badge>
          <Badge variant="outline">High</Badge>
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarFallback tone="violet">MP</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback tone="mint">JL</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <Inline gap={1.5} className="text-caption text-muted-foreground">
            <CalendarIcon aria-hidden className="size-3.5" />
            Due Nov 14
          </Inline>
        </Inline>
      </Example>

      <Example
        title="Without wrapping"
        layout="stack"
        description="Set wrap={false} where a row must stay on one line, such as badges in a narrow table cell. Children then shrink, so give the long one min-w-0 and truncate."
        code={`<Inline gap={2} wrap={false} className="max-w-64">
  <span className="min-w-0 truncate text-label">Billing migration for enterprise workspaces</span>
  <Badge variant="warning">At risk</Badge>
</Inline>`}
      >
        <Inline gap={2} wrap={false} className="max-w-64">
          <span className="min-w-0 truncate text-label">Billing migration for enterprise workspaces</span>
          <Badge variant="warning">At risk</Badge>
        </Inline>
      </Example>

      <Guidelines
        do={[
          "Use Inline for clusters that can wrap: buttons, badges, avatars and metadata.",
          "Use justify=\"between\" for a title with its actions.",
          "Keep the default 8px gap for controls, and a wider one for loose metadata.",
        ]}
        dont={[
          "Don’t use Inline for columns that must line up from row to row. Use Grid.",
          "Don’t switch off wrapping unless the content can truncate.",
          "Don’t add margins between items. The gap is the only space between them.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "gap", type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | "stack"', default: "2", description: "Space between items, in steps of --spacing, or --spacing-stack. Wrapped lines take the same gap." },
          { prop: "align", type: '"start" | "center" | "end" | "baseline" | "stretch"', default: '"center"', description: "Where items sit across the row." },
          { prop: "justify", type: '"start" | "center" | "end" | "between"', default: '"start"', description: "Where items sit along the row." },
          { prop: "wrap", type: "boolean", default: "true", description: "Wrap onto more lines when the row is full." },
          { prop: "render", type: "ReactElement", description: "Render as another element, such as a ul or nav." },
        ]}
      />
    </Examples>
  )
}
