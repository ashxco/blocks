"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { DataTable } from "@/components/blocks/data-table"

export default function DataTableDocs() {
  return (
    <Examples>
      <Example
        title="Projects"
        description="Search by name, repository or region, filter by status, choose columns, sort by clicking a header (newest deploy first to start), select rows for a bulk redeploy, and act on one row from its menu. In narrow slots the detail columns step out, so project, status and the row menu always fit."
        layout="full"
        code={`<DataTable rows={projects} pageSize={8} />`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable />
        </div>
      </Example>

      <Example
        title="Compact"
        description="When the table shares a page with other content: one line per row at the small row height, fewer columns and a shorter page. The repository and branch lines drop out; the row menu still has everything."
        layout="full"
        surface="subtle"
        code={`<DataTable density="compact" pageSize={5} hiddenColumns={["framework", "region"]} />`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable
            density="compact"
            pageSize={5}
            hiddenColumns={["framework", "region"]}
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
  emptyDescription="Import a repository and Lumen builds and deploys it as your first project."
  emptyAction={{ label: "Import repository", href: "/live/onboarding", icon: FolderGit2Icon }}
/>`}
      >
        <div className="p-6 @prose:p-10">
          <DataTable rows={[]} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Keep the first column the thing people scan for, with the secondary detail under it in mono.",
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
              "Rows to show. Defaults to the 12 Lumen projects of Acme Inc., the same list the app templates use.",
          },
          {
            prop: "pageSize",
            type: "number",
            default: "8",
            description: "Rows per page.",
          },
          {
            prop: "hiddenColumns",
            type: '("framework" | "region" | "requests" | "updated")[]',
            default: "[]",
            description:
              "Optional columns hidden on first render. People can show them from the Columns menu. Below 34, 44, 52 and 60rem of table width, Last deploy, Requests, Framework and Region step out on their own; the deploy time then sits under the status.",
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
              "Compact sets one-line rows at --table-row-height-sm, without the repository and branch lines.",
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
            default: "Import repository",
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
            prop: "repo",
            type: "string",
            description: "Connected repository, shown under the name in mono.",
          },
          {
            prop: "status",
            type: '"ready" | "building" | "failed" | "paused"',
            description: "Latest deployment status.",
          },
          {
            prop: "framework / region / branch",
            type: "string",
            description: "Detail columns.",
          },
          {
            prop: "requests",
            type: "number",
            description: "Requests in the last 24 hours.",
          },
          {
            prop: "updated / updatedMinutes",
            type: "string / number",
            description:
              "Relative label and the minutes behind it, used for sorting.",
          },
        ]}
      />
    </Examples>
  )
}
