"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { DataTable } from "@/components/blocks/data-table"

export default function DataTableDocs() {
  return (
    <Examples>
      <Example
        title="Projects"
        description="Search by project, team or lead, filter by status, choose columns, sort by clicking a header (most recently updated first to start), select rows to archive them together, and act on one row from its menu. In narrow slots the detail columns step out and long project names wrap, so project, status and the row menu always fit."
        layout="full"
        code={`<DataTable rows={projects} pageSize={8} />`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable />
        </div>
      </Example>

      <Example
        title="Compact"
        description="When the table shares a page with other content: one line per row at the small row height, fewer columns and a shorter page. The team line under each name drops out; the row menu still has everything."
        layout="full"
        surface="subtle"
        code={`<DataTable density="compact" pageSize={5} hiddenColumns={["lead", "updated"]} />`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable
            density="compact"
            pageSize={5}
            hiddenColumns={["lead", "updated"]}
          />
        </div>
      </Example>

      <Example
        title="Empty"
        description="With no rows at all, the toolbar, header and paging step aside and the card says what to do next, with one primary action. When filters hide every row, it offers to clear them instead."
        layout="full"
        code={`<DataTable
  rows={[]}
  emptyTitle="No projects yet"
  emptyDescription="Start from a template such as Product roadmap, or create a blank project and add tasks as you go."
  emptyAction={{ label: "Create project", href: "/live/onboarding?step=template", icon: PlusIcon }}
/>`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable rows={[]} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep the first column the thing people scan for, with one quiet detail under it, such as the team.",
          "Pair every status colour with a label.",
          "Put destructive row actions last, after a separator.",
        ]}
        dont={[
          "Don’t put more than one primary button in the toolbar.",
          "Don’t sort by default on a column people rarely use; recent first is a safe start.",
          "Don’t hide the row menu behind hover; touch screens can’t hover.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "rows",
            type: "ProjectRow[]",
            description:
              "Rows to show. Defaults to the 26 projects of the Acme Inc. workspace, 24 of them active: the same list the app templates use.",
          },
          {
            prop: "pageSize",
            type: "number",
            default: "8",
            description: "Rows per page.",
          },
          {
            prop: "hiddenColumns",
            type: '("progress" | "lead" | "due" | "updated")[]',
            default: "[]",
            description:
              "Optional columns hidden on first render. People can show them from the Columns menu. Below 34, 44, 52 and 60rem of table width, Due date, Progress, Lead and Updated step out on their own; the due date then sits under the status.",
          },
          {
            prop: "noun",
            type: "{ one: string; other: string }",
            default: '{ one: "project", other: "projects" }',
            description:
              "What a row is called in counts, placeholders and empty states.",
          },
          {
            prop: "density",
            type: '"default" | "compact"',
            default: '"default"',
            description:
              "Compact sets one-line rows at --table-row-height-sm, without the team line under each name.",
          },
          {
            prop: "emptyTitle / emptyDescription",
            type: "string",
            description:
              "Empty-state copy when there are no rows at all. Defaults follow the noun.",
          },
          {
            prop: "emptyAction",
            type: "{ label; href?; onClick?; icon? } | null",
            default: "Create project",
            description:
              "The empty state’s primary action, a small primary button. The default only applies to projects; null leaves it out.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the wrapper.",
          },
        ]}
      />
      <ApiTable
        title="ProjectRow"
        rows={[
          { prop: "id", type: "string", description: "Stable key." },
          {
            prop: "name",
            type: "string",
            description: "Project name, shown first.",
          },
          {
            prop: "team",
            type: "string",
            description: "Team that owns the project, shown under the name.",
          },
          {
            prop: "status",
            type: '"on-track" | "at-risk" | "off-track" | "completed" | "paused"',
            description:
              "Shown as a badge: success, warning, destructive, and neutral for completed and paused.",
          },
          {
            prop: "lead",
            type: "string",
            description:
              "Project lead by full name. The avatar tint comes from the shared people list.",
          },
          {
            prop: "done / total",
            type: "number",
            description: "Tasks done and tasks in the project, for the progress column.",
          },
          {
            prop: "due",
            type: "string",
            description: "Due date in ISO format, such as 2026-11-14.",
          },
          {
            prop: "updated / updatedMinutes",
            type: "string / number",
            description:
              "Relative label for the latest change and the minutes behind it, used for sorting.",
          },
        ]}
      />
    </Examples>
  )
}
