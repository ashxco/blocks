"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { DataTable, defaultProjects } from "@/components/blocks/data-table"

export default function DataTableDocs() {
  return (
    <Examples>
      <Example
        title="Projects"
        description="Search by name, repository or region, filter by status, choose columns, sort by clicking a header, select rows for a bulk redeploy, and act on one row from its menu."
        layout="full"
        code={`<DataTable rows={projects} pageSize={8} />`}
      >
        <div className="p-6 md:p-10">
          <DataTable />
        </div>
      </Example>

      <Example
        title="Compact"
        description="Hide optional columns and shorten the page when the table shares a page with other content."
        layout="full"
        surface="subtle"
        code={`<DataTable pageSize={5} hiddenColumns={["framework", "region"]} />`}
      >
        <div className="p-6 md:p-10">
          <DataTable
            pageSize={5}
            hiddenColumns={["framework", "region"]}
            rows={defaultProjects.slice(0, 12)}
          />
        </div>
      </Example>

      <Example
        title="Empty"
        description="With no rows the table says what to do next. When filters hide every row, it offers to clear them."
        layout="full"
        code={`<DataTable rows={[]} />`}
      >
        <div className="p-6 md:p-10">
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
              "Rows to show. Defaults to the 18 Lumen projects of Acme Inc.",
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
              "Optional columns hidden on first render. People can show them from the Columns menu.",
          },
          {
            prop: "noun",
            type: "{ one: string; other: string }",
            default: '{ one: "project", other: "projects" }',
            description:
              "What a row is called in counts, placeholders and empty states.",
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
