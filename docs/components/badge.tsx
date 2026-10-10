import { CalendarIcon, CheckIcon, LockIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

const projects = [
  {
    name: "Website relaunch",
    date: "Due Nov 14",
    lead: "Priya Raman",
    status: { label: "On track", variant: "success" as const },
  },
  {
    name: "Mobile app 2.0",
    date: "Due Nov 20",
    lead: "Jordan Lee",
    status: { label: "At risk", variant: "warning" as const },
  },
  {
    name: "Customer portal",
    date: "Due Oct 23",
    lead: "Sam Okafor",
    status: { label: "Off track", variant: "destructive" as const },
  },
  {
    name: "Onboarding redesign",
    date: "Done Sep 30",
    lead: "Maya Patel",
    status: { label: "Completed", variant: "secondary" as const },
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
<Badge variant="success">On track</Badge>
<Badge variant="warning">At risk</Badge>
<Badge variant="destructive">Off track</Badge>
<Badge variant="info">In progress</Badge>
<Badge variant="brand">Pro</Badge>`}
      >
        <Badge>Owner</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">Archived</Badge>
        <Badge variant="success">On track</Badge>
        <Badge variant="warning">At risk</Badge>
        <Badge variant="destructive">Off track</Badge>
        <Badge variant="info">In progress</Badge>
        <Badge variant="brand">Pro</Badge>
      </Example>

      <Example
        title="Status"
        description="Pair the colour with a dot, an icon or a spinner, so status never depends on colour alone."
        code={`<Badge variant="success">
  <span className="size-1.5 rounded-full bg-current" />
  On track
</Badge>
<Badge variant="info">
  <Spinner className="size-3" />
  Importing
</Badge>`}
      >
        <Badge variant="success">
          <Dot />
          On track
        </Badge>
        <Badge variant="info">
          <Spinner className="size-3" />
          Importing
        </Badge>
        <Badge variant="warning">
          <Dot />
          At risk
        </Badge>
        <Badge variant="destructive">
          <Dot />
          Off track
        </Badge>
        <Badge variant="secondary">
          <Dot />
          Paused
        </Badge>
      </Example>

      <Example
        title="Counts"
        description="Single digits render as a circle. Cap large numbers, such as 99+."
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          My tasks <Badge variant="secondary">3</Badge>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Overdue <Badge variant="destructive">12</Badge>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Inbox <Badge>99+</Badge>
        </span>
      </Example>

      <Example
        title="With icons"
        description="Icons sit before the label at 12px."
        code={`<Badge variant="outline">
  <CalendarIcon data-icon="inline-start" />
  Due Oct 14
</Badge>`}
      >
        {/* Two pairs that wrap together, so no badge is left alone on a line. */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <span className="flex gap-2">
            <Badge variant="outline">
              <CalendarIcon data-icon="inline-start" />
              Due Oct 14
            </Badge>
            <Badge variant="secondary">
              <LockIcon data-icon="inline-start" />
              Private
            </Badge>
          </span>
          <span className="flex gap-2">
            <Badge variant="info">
              <UsersIcon data-icon="inline-start" />
              3 assignees
            </Badge>
            <Badge variant="success">
              <CheckIcon data-icon="inline-start" />
              Approved
            </Badge>
          </span>
        </div>
      </Example>

      <Example
        title="As a link"
        description="Render a badge as a link with the render prop when it leads somewhere, such as a filtered list."
        code={`<Badge variant="outline" render={<a href="/tasks?status=overdue" />}>
  2 overdue
</Badge>`}
      >
        <Badge variant="outline" render={<a href="#overdue" />}>
          2 overdue
        </Badge>
        <Badge variant="brand" render={<a href="#pricing" />}>
          Pro
        </Badge>
      </Example>

      <Example
        title="Project list"
        description="Badges carry status inside rows of app UI."
        layout="stack"
      >
        <ul className="divide-y overflow-hidden rounded-(--card-radius) border bg-card">
          {projects.map((d) => (
            <li
              key={d.name}
              className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="grid min-w-0 gap-1.5">
                <p className="truncate text-title text-foreground">{d.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    <CalendarIcon data-icon="inline-start" />
                    {d.date}
                  </Badge>
                  <span>{d.lead}</span>
                </div>
              </div>
              <Badge variant={d.status.variant}>
                <Dot />
                {d.status.label}
              </Badge>
            </li>
          ))}
        </ul>
      </Example>

      <Guidelines
        do={[
          "Use badges for status and counts in app UI: On track, At risk, 3 new.",
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
