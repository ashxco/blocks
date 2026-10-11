"use client"

import * as React from "react"
import {
  FolderKanbanIcon,
  ListTodoIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { StatusBadge, type Status } from "@/docs/sample/status"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

const tasks: {
  id: string
  title: string
  project: string
  status: Status
  priority: "Urgent" | "High" | "Medium" | "Low"
  due: string
}[] = [
  {
    id: "MOB-88",
    title: "Fix sign-in on older Android phones",
    project: "Mobile app 2.0",
    status: "In progress",
    priority: "Urgent",
    due: "Today",
  },
  {
    id: "POR-31",
    title: "Map invoice fields from the old portal",
    project: "Customer portal",
    status: "Blocked",
    priority: "High",
    due: "Oct 8",
  },
  {
    id: "WEB-142",
    title: "Write the homepage hero copy",
    project: "Website relaunch",
    status: "Done",
    priority: "High",
    due: "Oct 6",
  },
  {
    id: "Q4-12",
    title: "Draft the Q4 hiring plan",
    project: "Q4 planning",
    status: "In progress",
    priority: "Medium",
    due: "Oct 14",
  },
  {
    id: "BRD-7",
    title: "Choose the new icon set",
    project: "Brand refresh",
    status: "To do",
    priority: "Low",
    due: "Oct 23",
  },
]

const invoices = [
  { number: "INV-2026-010", date: "Oct 1, 2026", seats: 18, amount: 216 },
  { number: "INV-2026-009", date: "Sep 1, 2026", seats: 18, amount: 216 },
  { number: "INV-2026-008", date: "Aug 1, 2026", seats: 17, amount: 204 },
  { number: "INV-2026-007", date: "Jul 1, 2026", seats: 16, amount: 192 },
]

const files = [
  {
    name: "homepage-wireframes.fig",
    project: "Website relaunch",
    updated: "2 days ago",
  },
  { name: "q4-hiring-plan.pdf", project: "Q4 planning", updated: "Oct 5" },
  {
    name: "android-crash-report.csv",
    project: "Mobile app 2.0",
    updated: "Oct 2",
  },
  {
    name: "portal-invoice-fields.xlsx",
    project: "Customer portal",
    updated: "Sep 28",
  },
  {
    name: "brand-guidelines-v2.pdf",
    project: "Brand refresh",
    updated: "Sep 14",
  },
]

const members = [
  {
    id: "m1",
    name: "Maya Patel",
    email: "maya@acme.com",
    role: "Owner",
    lastActive: "Now",
  },
  {
    id: "m2",
    name: "Hana Kim",
    email: "hana@acme.com",
    role: "Admin",
    lastActive: "20m ago",
  },
  {
    id: "m3",
    name: "Jordan Lee",
    email: "jordan@acme.com",
    role: "Member",
    lastActive: "Now",
  },
  {
    id: "m4",
    name: "Sam Okafor",
    email: "sam@acme.com",
    role: "Member",
    lastActive: "2h ago",
  },
]

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function SelectableMembers() {
  const [selected, setSelected] = React.useState<string[]>(["m3"])
  const allSelected = selected.length === members.length
  const someSelected = selected.length > 0 && !allSelected

  return (
    <div className="grid w-full gap-3">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <p className="text-label text-foreground tabular-nums">
          {selected.length === 0
            ? "4 of 18 members"
            : `${selected.length} selected`}
        </p>
        <Button size="sm" variant="outline" disabled={selected.length === 0}>
          Remove from Workspace
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
                onCheckedChange={(checked) =>
                  setSelected(checked ? members.map((m) => m.id) : [])
                }
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden text-right @md:table-cell">
              Last active
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isSelected = selected.includes(member.id)
            return (
              <TableRow
                key={member.id}
                data-state={isSelected ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${member.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      setSelected((current) =>
                        checked
                          ? [...current, member.id]
                          : current.filter((id) => id !== member.id)
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="grid">
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-caption text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-copy">{member.role}</TableCell>
                <TableCell className="hidden text-right text-muted-foreground @md:table-cell">
                  {member.lastActive}
                </TableCell>
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
        title="Tasks"
        layout="stack"
        description="The plain table sits straight on the page. Lead with the column people scan first, keep secondary details muted and right-align dates and numbers. In narrow containers, hide the secondary columns with container queries and move status under the task, so the title keeps the width it needs."
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Task</TableHead>
      <TableHead className="hidden @md:table-cell">Status</TableHead>
      <TableHead className="hidden @xl:table-cell">Priority</TableHead>
      <TableHead className="hidden text-right @md:table-cell">Due</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {tasks.map((task) => (
      <TableRow key={task.id}>
        <TableCell className="whitespace-normal">
          <p className="font-semibold @max-md:line-clamp-2 @md:truncate">{task.title}</p>
          <Badge variant="info" className="@md:hidden">{task.status}</Badge>
        </TableCell>
        <TableCell className="hidden @md:table-cell">
          <Badge variant="info">{task.status}</Badge>
        </TableCell>
        <TableCell className="hidden @xl:table-cell">{task.priority}</TableCell>
        <TableCell className="hidden text-right @md:table-cell">{task.due}</TableCell>
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
                <TableHead>Task</TableHead>
                <TableHead className="hidden @3xl:table-cell">
                  Project
                </TableHead>
                <TableHead className="hidden @md:table-cell">Status</TableHead>
                <TableHead className="hidden @xl:table-cell">
                  Priority
                </TableHead>
                <TableHead className="hidden text-right @md:table-cell">
                  Due
                </TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="py-3 whitespace-normal">
                    <div className="grid max-w-72 gap-1 @md:gap-0 @3xl:min-w-48">
                      {/* Narrow: the title wraps to two lines and status moves under it. */}
                      <span className="font-semibold @max-md:line-clamp-2 @md:truncate">
                        {task.title}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {task.id}
                        </span>
                        <span className="@md:hidden">
                          <StatusBadge status={task.status} />
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden @3xl:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-copy">
                      <FolderKanbanIcon
                        aria-hidden="true"
                        className="size-3.5 text-muted-foreground"
                      />
                      {task.project}
                    </span>
                  </TableCell>
                  <TableCell className="hidden @md:table-cell">
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="hidden text-copy @xl:table-cell">
                    {task.priority}
                  </TableCell>
                  <TableCell className="hidden text-right text-muted-foreground @md:table-cell">
                    {task.due}
                  </TableCell>
                  <TableCell className="pr-2">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Actions for ${task.title}`}
                    >
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
      <TableCell className="text-right">$828.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
      >
        <Table variant="card">
          <TableCaption>
            Pro plan, billed to the Visa ending 4242. Invoices are issued on the
            1st of each month.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="hidden @md:table-cell">Invoice</TableHead>
              <TableHead className="hidden text-right @sm:table-cell">
                Seats
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((row) => (
              <TableRow key={row.number}>
                <TableCell className="font-semibold">{row.date}</TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground @md:table-cell">
                  {row.number}
                </TableCell>
                <TableCell className="hidden text-right text-copy @sm:table-cell">
                  {row.seats}
                </TableCell>
                <TableCell className="text-right text-copy">
                  {moneyFormat.format(row.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="hidden @md:table-cell" />
              <TableCell className="hidden @sm:table-cell" />
              <TableCell className="text-right">
                {moneyFormat.format(
                  invoices.reduce((sum, row) => sum + row.amount, 0)
                )}
              </TableCell>
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
              <TableHead>File</TableHead>
              <TableHead className="hidden @lg:table-cell">Project</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell>
                  <div className="grid">
                    <span className="font-medium">{file.name}</span>
                    {/* In a narrow container the project sits under the file name. */}
                    <span className="text-caption text-muted-foreground @lg:hidden">
                      {file.project}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-copy @lg:table-cell">
                  {file.project}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {file.updated}
                </TableCell>
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
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="in-data-[slot=table-body]:hover:bg-transparent">
              <TableCell colSpan={3} className="h-auto py-14 whitespace-normal">
                <div className="mx-auto grid max-w-sm justify-items-center gap-3 text-center">
                  <span className="grid size-10 place-items-center rounded-full bg-secondary">
                    <ListTodoIcon
                      aria-hidden="true"
                      className="size-4.5 text-foreground"
                    />
                  </span>
                  <p className="text-title text-foreground">No tasks yet</p>
                  <p className="text-sm text-copy">
                    Create a task or import a CSV file, and the project’s tasks
                    show up here.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Example>

      <Guidelines
        do={[
          "Right-align numbers, dates and money in both the header and the cells.",
          "Make the first column the one people scan for, in semibold ink; keep the rest in copy or muted text.",
          "Use badges for status and keep their words short: To do, In progress, Done.",
          'Use variant="card" when the table sits on a tinted band or next to other cards.',
        ]}
        dont={[
          "Don’t stripe rows or add vertical rules; hairline rows are enough.",
          "Don’t uppercase header labels or make them bold ink.",
          'Don’t wrap a plain table in your own bordered box; use variant="card".',
          "Don’t hide important actions behind row hover only; keep a visible menu button.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "variant",
            type: '"plain" | "card"',
            default: '"plain"',
            description:
              "Table: plain sits on the page; card adds a border, card radius and a tinted header.",
          },
          {
            prop: "size",
            type: '"default" | "sm"',
            default: '"default"',
            description:
              "Table: row height. default uses --table-row-height, sm uses --table-row-height-sm.",
          },
          {
            prop: "data-state",
            type: '"selected"',
            description:
              "TableRow: marks a selected row with the accent fill. aria-selected works too.",
          },
          {
            prop: "colSpan",
            type: "number",
            description:
              "TableCell: span columns, for empty states and grouped rows.",
          },
          {
            prop: "className",
            type: "string",
            description:
              "Every part. Use text-right for numeric columns and font-semibold for the lead column.",
          },
        ]}
      />
    </Examples>
  )
}
