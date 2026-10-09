import { CheckIcon, GitBranchIcon, GlobeIcon, LockIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

const deployments = [
  {
    commit: "Cache image transforms at the edge",
    branch: "main",
    env: "Production",
    status: { label: "Ready", variant: "success" as const },
    time: "4m ago",
  },
  {
    commit: "Add retry to webhook delivery",
    branch: "fix/webhooks",
    env: "Preview",
    status: { label: "Building", variant: "info" as const, building: true },
    time: "Just now",
  },
  {
    commit: "Upgrade Postgres client to 3.4",
    branch: "deps/pg",
    env: "Preview",
    status: { label: "Failed", variant: "destructive" as const },
    time: "26m ago",
  },
  {
    commit: "Move billing page behind a flag",
    branch: "billing-v2",
    env: "Preview",
    status: { label: "Queued", variant: "secondary" as const },
    time: "31m ago",
  },
]

function Dot() {
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
}

export default function BadgeDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        description="Ink for neutral emphasis, tinted fills for status. Brand is for features that belong to a paid plan or are new."
        code={`<Badge>Owner</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="outline">Archived</Badge>
<Badge variant="success">Ready</Badge>
<Badge variant="warning">Degraded</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="info">Building</Badge>
<Badge variant="brand">Pro</Badge>`}
      >
        <Badge>Owner</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">Archived</Badge>
        <Badge variant="success">Ready</Badge>
        <Badge variant="warning">Degraded</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="info">Building</Badge>
        <Badge variant="brand">Pro</Badge>
      </Example>

      <Example
        title="Status"
        description="Pair the colour with a dot, an icon or a spinner, so status never depends on colour alone."
        code={`<Badge variant="success">
  <span className="size-1.5 rounded-full bg-current" />
  Ready
</Badge>
<Badge variant="info">
  <Spinner className="size-3" />
  Building
</Badge>`}
      >
        <Badge variant="success">
          <Dot />
          Ready
        </Badge>
        <Badge variant="info">
          <Spinner className="size-3" />
          Building
        </Badge>
        <Badge variant="warning">
          <Dot />
          Degraded
        </Badge>
        <Badge variant="destructive">
          <Dot />
          Failed
        </Badge>
        <Badge variant="outline">
          <Dot />
          Canceled
        </Badge>
      </Example>

      <Example
        title="Counts"
        description="Single digits render as a circle. Cap large numbers, such as 99+."
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Deployments <Badge variant="secondary">3</Badge>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Alerts <Badge variant="destructive">12</Badge>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Inbox <Badge>99+</Badge>
        </span>
      </Example>

      <Example
        title="With icons"
        description="Icons sit before the label at 12px."
        code={`<Badge variant="outline">
  <GitBranchIcon data-icon="inline-start" />
  main
</Badge>`}
      >
        <Badge variant="outline">
          <GitBranchIcon data-icon="inline-start" />
          main
        </Badge>
        <Badge variant="secondary">
          <LockIcon data-icon="inline-start" />
          Private
        </Badge>
        <Badge variant="info">
          <GlobeIcon data-icon="inline-start" />
          3 regions
        </Badge>
        <Badge variant="success">
          <CheckIcon data-icon="inline-start" />
          Verified
        </Badge>
      </Example>

      <Example
        title="As a link"
        description="Render a badge as a link with the render prop when it leads somewhere, such as a filtered list."
        code={`<Badge variant="outline" render={<a href="/deployments?status=failed" />}>
  2 failed
</Badge>`}
      >
        <Badge variant="outline" render={<a href="#failed" />}>
          2 failed
        </Badge>
        <Badge variant="brand" render={<a href="#pricing" />}>
          Pro
        </Badge>
      </Example>

      <Example
        title="Deployments list"
        description="Badges carry status inside rows of app UI."
        layout="stack"
      >
        <ul className="divide-y overflow-hidden rounded-(--card-radius) border bg-card">
          {deployments.map((d) => (
            <li
              key={d.commit}
              className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="grid min-w-0 gap-1.5">
                <p className="truncate text-title text-foreground">{d.commit}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    <GitBranchIcon data-icon="inline-start" />
                    {d.branch}
                  </Badge>
                  <span>{d.env}</span>
                  <span aria-hidden="true">·</span>
                  <span>{d.time}</span>
                </div>
              </div>
              <Badge variant={d.status.variant}>
                {d.status.building ? <Spinner className="size-3" /> : <Dot />}
                {d.status.label}
              </Badge>
            </li>
          ))}
        </ul>
      </Example>

      <Guidelines
        do={[
          "Use badges for status and counts in app UI: Ready, Failed, 3 new.",
          "Keep the label to one or two words.",
          "Pair status colour with a dot, icon or spinner.",
          "Use the same variant for the same status everywhere.",
        ]}
        dont={[
          "Don’t use a badge as a section label or an eyebrow above a heading. Badges are never section labels.",
          "Don’t use a badge as a button. If it does something, use a button.",
          "Don’t put more than one or two badges on a row.",
          "Don’t use brand for status. It is for plan and feature markers.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "info" | "brand" | "ghost" | "link"', default: '"default"', description: "Visual style. Status variants use the -subtle fills." },
          { prop: "render", type: "ReactElement", description: "Render as another element, such as a link." },
          { prop: "badgeVariants", type: "cva", description: "The class recipe, for elements that should look like a badge." },
        ]}
      />
    </Examples>
  )
}
