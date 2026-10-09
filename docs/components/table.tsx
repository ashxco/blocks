"use client"

import * as React from "react"
import { GitBranchIcon, MoreHorizontalIcon, RocketIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Status = "Ready" | "Building" | "Failed" | "Canceled"

/* The same status reads the same everywhere: in progress is info, with a spinner. */
const statusVariant: Record<Status, "success" | "info" | "destructive" | "secondary"> = {
  Ready: "success",
  Building: "info",
  Failed: "destructive",
  Canceled: "secondary",
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status === "Building" ? (
        <Spinner className="size-3" />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {status}
    </Badge>
  )
}

const deployments: {
  id: string
  commit: string
  message: string
  branch: string
  status: Status
  duration: string
  age: string
}[] = [
  { id: "dpl_8f2k", commit: "a41c9e2", message: "Cache build output between deploys", branch: "main", status: "Ready", duration: "48s", age: "4m ago" },
  { id: "dpl_7d1q", commit: "e09b311", message: "Add preview comments to pull requests", branch: "feat/preview-comments", status: "Building", duration: "1m 12s", age: "9m ago" },
  { id: "dpl_6c0w", commit: "77fd0a4", message: "Bump Node to 22 in build image", branch: "chore/node-22", status: "Failed", duration: "31s", age: "1h ago" },
  { id: "dpl_5b9z", commit: "3c2e8f0", message: "Fix redirect loop on custom domains", branch: "main", status: "Ready", duration: "52s", age: "3h ago" },
  { id: "dpl_4a8y", commit: "b8a1d57", message: "Draft pricing page copy", branch: "marketing/pricing", status: "Canceled", duration: "6s", age: "Yesterday" },
]

const usage = [
  { project: "lumen-web", builds: 412, minutes: 1284, bandwidth: 182.4 },
  { project: "lumen-api", builds: 268, minutes: 941, bandwidth: 96.1 },
  { project: "docs", builds: 133, minutes: 212, bandwidth: 41.7 },
  { project: "status-page", builds: 27, minutes: 38, bandwidth: 3.2 },
]

const variables = [
  { key: "DATABASE_URL", env: "Production, Preview", updated: "2 days ago" },
  { key: "STRIPE_SECRET_KEY", env: "Production", updated: "Sep 28" },
  { key: "NEXT_PUBLIC_POSTHOG_KEY", env: "All environments", updated: "Sep 14" },
  { key: "REDIS_URL", env: "Production, Preview", updated: "Aug 30" },
  { key: "SENTRY_AUTH_TOKEN", env: "Production", updated: "Aug 2" },
]

const members = [
  { id: "m1", name: "Priya Raman", email: "priya@lumen.app", role: "Owner", lastActive: "Now" },
  { id: "m2", name: "Mateo Ortiz", email: "mateo@lumen.app", role: "Admin", lastActive: "12m ago" },
  { id: "m3", name: "Aiko Kato", email: "aiko@lumen.app", role: "Developer", lastActive: "2h ago" },
  { id: "m4", name: "Jonas Berg", email: "jonas@lumen.app", role: "Developer", lastActive: "3 days ago" },
]

const numberFormat = new Intl.NumberFormat("en-US")

function SelectableMembers() {
  const [selected, setSelected] = React.useState<string[]>(["m3"])
  const allSelected = selected.length === members.length
  const someSelected = selected.length > 0 && !allSelected

  return (
    <div className="grid w-full gap-3">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <p className="text-label text-foreground tabular-nums">
          {selected.length === 0 ? "4 members" : `${selected.length} selected`}
        </p>
        <Button size="sm" variant="outline" disabled={selected.length === 0}>
          Remove from team
        </Button>
      </div>
      <Table variant="card">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all members"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => setSelected(checked ? members.map((m) => m.id) : [])}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden text-right @md:table-cell">Last active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isSelected = selected.includes(member.id)
            return (
              <TableRow key={member.id} data-state={isSelected ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${member.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      setSelected((current) =>
                        checked ? [...current, member.id] : current.filter((id) => id !== member.id)
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="grid">
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-caption text-muted-foreground">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-copy">{member.role}</TableCell>
                <TableCell className="hidden text-right text-muted-foreground @md:table-cell">{member.lastActive}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default function TableDocs() {
  return (
    <Examples>
      <Example
        title="Deployments"
        layout="stack"
        description="The plain table sits straight on the page. Lead with the column people scan first, keep secondary details muted and right-align numbers. In narrow containers, hide the secondary columns with container queries and move status under the commit, so the message keeps the width it needs."
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Commit</TableHead>
      <TableHead className="hidden @md:table-cell">Status</TableHead>
      <TableHead className="hidden text-right @xl:table-cell">Duration</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {deployments.map((d) => (
      <TableRow key={d.id}>
        <TableCell className="whitespace-normal">
          <p className="font-semibold @max-md:line-clamp-2 @md:truncate">{d.message}</p>
          <Badge variant="success" className="@md:hidden">{d.status}</Badge>
        </TableCell>
        <TableCell className="hidden @md:table-cell">
          <Badge variant="success">{d.status}</Badge>
        </TableCell>
        <TableCell className="hidden text-right @xl:table-cell">{d.duration}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
      >
        {/* Its own container, so the queries below measure the table, not the padded stage around it. */}
        <div className="@container w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commit</TableHead>
                <TableHead className="hidden @3xl:table-cell">Branch</TableHead>
                <TableHead className="hidden @md:table-cell">Status</TableHead>
                <TableHead className="hidden text-right @xl:table-cell">Duration</TableHead>
                <TableHead className="hidden text-right @md:table-cell">Created</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="py-3 whitespace-normal">
                    <div className="grid max-w-72 gap-1 @md:gap-0 @3xl:min-w-48">
                      {/* Narrow: the message wraps to two lines and status moves under it. */}
                      <span className="font-semibold @max-md:line-clamp-2 @md:truncate">{d.message}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{d.commit}</span>
                        <span className="@md:hidden">
                          <StatusBadge status={d.status} />
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden @3xl:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-copy">
                      <GitBranchIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                      {d.branch}
                    </span>
                  </TableCell>
                  <TableCell className="hidden @md:table-cell">
                    <StatusBadge status={d.status} />
                  </TableCell>
                  <TableCell className="hidden text-right text-copy @xl:table-cell">{d.duration}</TableCell>
                  <TableCell className="hidden text-right text-muted-foreground @md:table-cell">{d.age}</TableCell>
                  <TableCell className="pr-2">
                    <Button size="icon-sm" variant="ghost" aria-label={`Actions for ${d.commit}`}>
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Example>

      <Example
        title="In a card, with totals"
        layout="stack"
        surface="subtle"
        description={`variant="card" wraps the table in a bordered card with a tinted header. A footer row carries totals.`}
        code={`<Table variant="card">
  <TableHeader>…</TableHeader>
  <TableBody>…</TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell className="text-right">840</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
      >
        <Table variant="card">
          <TableCaption>Usage for October 1 to October 8. Totals reset on the first of each month.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="hidden text-right @md:table-cell">Builds</TableHead>
              <TableHead className="hidden text-right @sm:table-cell">Build minutes</TableHead>
              <TableHead className="text-right">Bandwidth</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage.map((row) => (
              <TableRow key={row.project}>
                <TableCell className="font-semibold">{row.project}</TableCell>
                <TableCell className="hidden text-right text-copy @md:table-cell">{numberFormat.format(row.builds)}</TableCell>
                <TableCell className="hidden text-right text-copy @sm:table-cell">{numberFormat.format(row.minutes)}</TableCell>
                <TableCell className="text-right text-copy">{row.bandwidth.toFixed(1)} GB</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="hidden text-right @md:table-cell">840</TableCell>
              <TableCell className="hidden text-right @sm:table-cell">2,475</TableCell>
              <TableCell className="text-right">323.4 GB</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Example>

      <Example
        title="Dense"
        layout="stack"
        description={`size="sm" drops rows to --table-row-height-sm for settings and long lists people scan quickly.`}
        code={`<Table size="sm">…</Table>`}
      >
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead className="hidden @lg:table-cell">Environments</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.map((v) => (
              <TableRow key={v.key}>
                <TableCell>
                  <div className="grid">
                    <span className="font-mono text-xs font-medium">{v.key}</span>
                    {/* In a narrow container the environments sit under the key. */}
                    <span className="text-caption text-muted-foreground @lg:hidden">{v.env}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-copy @lg:table-cell">{v.env}</TableCell>
                <TableCell className="text-right text-muted-foreground">{v.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>

      <Example
        title="Selectable rows"
        layout="stack"
        description={`Put a checkbox in the first column and mark chosen rows with data-state="selected". The header checkbox selects every row and shows a dash when only some are selected.`}
        code={`<TableRow data-state={isSelected ? "selected" : undefined}>
  <TableCell>
    <Checkbox
      aria-label={\`Select \${member.name}\`}
      checked={isSelected}
      onCheckedChange={toggle}
    />
  </TableCell>
  …
</TableRow>`}
      >
        <SelectableMembers />
      </Example>

      <Example
        title="Empty"
        layout="stack"
        description="Keep the header so people see what will appear, and say what to do next in a single full-width row."
      >
        <Table variant="card">
          <TableHeader>
            <TableRow>
              <TableHead>Commit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="in-data-[slot=table-body]:hover:bg-transparent">
              <TableCell colSpan={3} className="h-auto py-14 whitespace-normal">
                <div className="mx-auto grid max-w-sm justify-items-center gap-3 text-center">
                  <span className="grid size-10 place-items-center rounded-full bg-secondary">
                    <RocketIcon aria-hidden="true" className="size-4.5 text-foreground" />
                  </span>
                  <p className="text-title text-foreground">No deployments yet</p>
                  <p className="text-sm text-copy">
                    Push to a connected branch and Lumen builds and deploys it here.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Example>

      <Guidelines
        do={[
          "Right-align numbers, durations and money in both the header and the cells.",
          "Make the first column the one people scan for, in semibold ink; keep the rest in copy or muted text.",
          "Use badges for status and keep their words short: Ready, Building, Failed.",
          "Use variant=\"card\" when the table sits on a tinted band or next to other cards.",
        ]}
        dont={[
          "Don’t stripe rows or add vertical rules; hairline rows are enough.",
          "Don’t uppercase header labels or make them bold ink.",
          "Don’t wrap a plain table in your own bordered box; use variant=\"card\".",
          "Don’t hide important actions behind row hover only; keep a visible menu button.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"plain" | "card"', default: '"plain"', description: "Table: plain sits on the page; card adds a border, card radius and a tinted header." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "Table: row height. default uses --table-row-height, sm uses --table-row-height-sm." },
          { prop: "data-state", type: '"selected"', description: "TableRow: marks a selected row with the accent fill. aria-selected works too." },
          { prop: "colSpan", type: "number", description: "TableCell: span columns, for empty states and grouped rows." },
          { prop: "className", type: "string", description: "Every part. Use text-right for numeric columns and font-semibold for the lead column." },
        ]}
      />
    </Examples>
  )
}
