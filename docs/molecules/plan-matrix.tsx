"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { PlanMatrix } from "@/components/blocks/plan-matrix"

export default function PlanMatrixDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Every limit and feature across four plans, grouped by job. The recommended plan sits under a dark header and is tinted top to bottom. Below 42rem a segmented switch shows one plan at a time, starting with the recommended one, so every value stays readable on a phone."
        code={`<PlanMatrix />`}
      >
        <PlanMatrix />
      </Example>

      <Example
        title="Two plans, without a heading"
        layout="full"
        surface="subtle"
        description="Pass your own columns and groups. Values can be true (check), false (dash) or text. Leave out cta to drop the button row. Two plans fit a phone side by side, so they always show as a table."
        code={`<PlanMatrix
  contained={false}
  title={null}
  columns={[
    { name: "Cloud", price: "From $5 / month", featured: true },
    { name: "Self-hosted", price: "Free" },
  ]}
  groups={[
    {
      title: "Operations",
      rows: [
        { feature: "Managed upgrades", values: [true, false] },
        { feature: "Regions", values: ["14", "Any"] },
        { feature: "Backups", values: ["Hourly", "You run them"] },
      ],
    },
  ]}
/>`}
      >
        <div className="p-6 sm:p-10">
          <PlanMatrix
            contained={false}
            title={null}
            columns={[
              { name: "Cloud", price: "From $5 / month", featured: true },
              { name: "Self-hosted", price: "Free" },
            ]}
            groups={[
              {
                title: "Operations",
                rows: [
                  { feature: "Managed upgrades", values: [true, false] },
                  { feature: "Regions", values: ["14", "Any"] },
                  { feature: "Backups", values: ["Hourly", "You run them"] },
                  { feature: "Support", values: ["Email and chat", "Community"] },
                ],
              },
              {
                title: "Security",
                rows: [
                  { feature: "SAML single sign-on", values: [true, true] },
                  { feature: "SOC 2 report", values: [true, false] },
                ],
              },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use the same plan names and order as the plan cards above it.",
          "Group rows by the job they help with: deploy, run, team, support.",
          "Write limits as plain numbers and units: “10 GB”, “30 days”.",
        ]}
        dont={[
          "Don’t repeat every row of the plan cards; this table is for the detail.",
          "Don’t colour checks green or dashes red; ink and muted are enough.",
          "Don’t feature more than one column.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "columns", type: "PlanMatrixColumn[]", default: "Hobby, Starter, Pro, Scale", description: "Plans as columns: name, price line, featured and an optional cta button." },
          { prop: "groups", type: "PlanMatrixGroup[]", default: "Deploy, Run, Team and security, Support", description: "Titled groups of rows. Each row has a feature name and one value per column." },
          { prop: "title", type: "ReactNode | null", default: '"Compare every plan."', description: "Section heading. Pass null to render the table alone." },
          { prop: "description", type: "ReactNode", description: "Supporting line beside the heading." },
          { prop: "caption", type: "string", default: '"Features included in each plan"', description: "Accessible name for the table." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="Values"
        rows={[
          { prop: "true", type: "boolean", description: "Check, read as “Included”." },
          { prop: "false", type: "boolean", description: "Muted dash, read as “Not included”." },
          { prop: "string | number", type: "string | number", description: "Printed as is, e.g. “Unlimited” or 10." },
        ]}
      />
    </Examples>
  )
}
