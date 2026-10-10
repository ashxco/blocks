import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Separator } from "@/components/ui/separator"

export default function SeparatorDocs() {
  return (
    <Examples>
      <Example
        title="Horizontal"
        description="A hairline (--border-width-hairline) between groups of content. It is the only divider in Blocks: no shadows, no fades."
        layout="stack"
        code={`<div className="grid gap-1">
  <h3 className="text-title">Website relaunch</h3>
  <p className="text-sm text-muted-foreground">5 members · 52 tasks</p>
</div>
<Separator className="my-5" />
<p className="text-sm">Lead: Priya Raman</p>`}
      >
        <div className="mx-auto w-full max-w-96">
          <div className="grid gap-1">
            <h3 className="text-title text-foreground">Website relaunch</h3>
            <p className="text-sm text-muted-foreground">5 members · 52 tasks · Board view</p>
          </div>
          <Separator className="my-5" />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid gap-0.5">
              <dt className="text-muted-foreground">Lead</dt>
              <dd className="font-semibold text-foreground">Priya Raman</dd>
            </div>
            <div className="grid gap-0.5">
              <dt className="text-muted-foreground">Due date</dt>
              <dd className="font-semibold text-foreground">Nov 14, 2026</dd>
            </div>
          </dl>
        </div>
      </Example>

      <Example
        title="Vertical"
        description="Between inline items, such as metadata or toolbar groups. The separator stretches to the height of the row."
        code={`<div className="flex h-5 items-center gap-3 text-sm">
  <span>Urgent</span>
  <Separator orientation="vertical" />
  <span>Jordan Lee</span>
  <Separator orientation="vertical" />
  <span>Due today</span>
</div>`}
      >
        <div className="flex h-5 items-center gap-3 text-sm whitespace-nowrap text-muted-foreground">
          <span className="font-semibold text-foreground">Urgent</span>
          <Separator orientation="vertical" />
          <span>Jordan Lee</span>
          <Separator orientation="vertical" />
          <span>Due today</span>
        </div>
      </Example>

      <Example
        title="Strong"
        description="Use strong where a line needs more presence, such as the end of a group of settings. It takes the border-strong colour at --border-width-strong."
        layout="stack"
        code={`<Separator variant="strong" />`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-5">
          <p className="text-sm text-copy">Default hairline</p>
          <Separator />
          <p className="text-sm text-copy">Strong line</p>
          <Separator variant="strong" />
        </div>
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="On dark panels use the panel variant so the line keeps the same low contrast."
        layout="stack"
        code={`<div className="bg-panel text-panel-foreground">
  <Separator variant="panel" />
</div>`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-5">
          <div className="grid gap-1">
            <p className="text-h4">All your team’s work in one place</p>
            <p className="text-sm text-panel-muted">Projects, tasks and docs, side by side.</p>
          </div>
          <Separator variant="panel" />
          <div className="flex h-5 items-center gap-3 text-sm text-panel-muted">
            <span>12,000+ teams</span>
            <Separator variant="panel" orientation="vertical" />
            <span>GDPR</span>
            <Separator variant="panel" orientation="vertical" />
            <span>SOC 2 Type II</span>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a separator when spacing alone does not make the grouping clear.",
          "Use the panel variant on dark panels.",
          "Leave generous space on both sides of a horizontal separator.",
        ]}
        dont={[
          "Don’t separate every item in a list. Use divide-y on the list instead.",
          "Don’t make a separator thicker or coloured for emphasis.",
          "Don’t replace a separator with a shadow or a gradient fade.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Full width, or full height of the row." },
          { prop: "variant", type: '"default" | "strong" | "panel"', default: '"default"', description: "A border hairline, a border-strong line at --border-width-strong, or a panel-border hairline." },
          { prop: "render", type: "ReactElement", description: "Render as another element." },
        ]}
      />
    </Examples>
  )
}
