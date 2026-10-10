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
    { name: "Pro", price: "From $12 per member / month", featured: true },
    { name: "Business", price: "From $24 per member / month" },
  ]}
  groups={[
    {
      title: "Security",
      rows: [
        { feature: "Two-factor authentication", values: [true, true] },
        { feature: "SSO with SAML", values: [false, true] },
        { feature: "Audit log", values: [false, true] },
      ],
    },
  ]}
/>`}
      >
        <div className="p-6 @2xl:p-10">
          <PlanMatrix
            contained={false}
            title={null}
            columns={[
              { name: "Pro", price: "From $12 per member / month", featured: true },
              { name: "Business", price: "From $24 per member / month" },
            ]}
            groups={[
              {
                title: "Usage",
                rows: [
                  { feature: "Automation runs a month", values: ["10,000", "50,000"] },
                  { feature: "Storage", values: ["100 GB", "1 TB"] },
                  { feature: "Guests", values: ["10", "50"] },
                  { feature: "Support", values: ["Email", "Priority email"] },
                ],
              },
              {
                title: "Security",
                rows: [
                  { feature: "Two-factor authentication", values: [true, true] },
                  { feature: "SSO with SAML", values: [false, true] },
                  { feature: "Audit log", values: [false, true] },
                ],
              },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use the same plan names and order as the plan cards above it.",
          "Group rows by the job they help with: projects, automations, security, support.",
          "Write limits as plain numbers and units: “100 GB”, “10,000”.",
        ]}
        dont={[
          "Don’t repeat every row of the plan cards; this table is for the detail.",
          "Don’t colour checks green or dashes red; ink and muted are enough.",
          "Don’t feature more than one column.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "columns", type: "PlanMatrixColumn[]", default: "Free, Pro, Business, Enterprise", description: "Plans as columns: name, price line, featured and an optional cta button." },
          { prop: "groups", type: "PlanMatrixGroup[]", default: "Projects and tasks, Automations and reports, Admin and security, Support", description: "Titled groups of rows. Each row has a feature name and one value per column." },
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
