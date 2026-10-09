import * as React from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface PlanMatrixColumn {
  name: string
  /** Short price line under the name, e.g. "$39 / month". */
  price?: string
  /** Tints the whole column. Use for the plan you recommend. */
  featured?: boolean
  /** Button in the last row. */
  cta?: { label: string; href: string }
}

/** true shows a check, false a dash, anything else is printed as text. */
export type PlanMatrixValue = boolean | string | number

export interface PlanMatrixRow {
  feature: string
  /** One value per column, in column order. */
  values: PlanMatrixValue[]
}

export interface PlanMatrixGroup {
  title: string
  rows: PlanMatrixRow[]
}

export interface PlanMatrixProps {
  columns?: PlanMatrixColumn[]
  groups?: PlanMatrixGroup[]
  /** Section title. Pass null to render the table alone. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Accessible name for the table. */
  caption?: string
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const defaultMatrixColumns: PlanMatrixColumn[] = [
  { name: "Hobby", price: "$5 / month", cta: { label: "Choose Hobby", href: "/live/sign-up" } },
  { name: "Starter", price: "$20 / month", cta: { label: "Choose Starter", href: "/live/sign-up" } },
  { name: "Pro", price: "$39 / month", featured: true, cta: { label: "Start free trial", href: "/live/sign-up" } },
  { name: "Scale", price: "$99 / month", cta: { label: "Choose Scale", href: "/live/sign-up" } },
]

export const defaultMatrixGroups: PlanMatrixGroup[] = [
  {
    title: "Deploy",
    rows: [
      { feature: "Projects", values: [3, "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Preview URL for every branch", values: [true, true, true, true] },
      { feature: "Concurrent builds", values: [1, 2, 5, 20] },
      { feature: "Build minutes", values: ["500", "3,000", "10,000", "Unlimited"] },
      { feature: "Instant rollbacks", values: [false, true, true, true] },
    ],
  },
  {
    title: "Run",
    rows: [
      { feature: "Bandwidth", values: ["100 GB", "500 GB", "1 TB", "5 TB"] },
      { feature: "Custom domains", values: [1, 5, "Unlimited", "Unlimited"] },
      { feature: "Managed Postgres", values: ["1 GB", "10 GB", "50 GB", "250 GB"] },
      { feature: "Database backups", values: ["Weekly", "Daily", "Hourly", "Hourly"] },
      { feature: "Log retention", values: ["1 day", "7 days", "30 days", "90 days"] },
    ],
  },
  {
    title: "Team and security",
    rows: [
      { feature: "Team members", values: [1, 3, 10, "Unlimited"] },
      { feature: "Roles and permissions", values: [false, false, true, true] },
      { feature: "Audit log", values: [false, false, true, true] },
      { feature: "SAML single sign-on", values: [false, false, false, true] },
    ],
  },
  {
    title: "Support",
    rows: [
      { feature: "Support channel", values: ["Community", "Email", "Priority email", "Shared Slack"] },
      { feature: "Uptime SLA", values: [false, false, "99.9%", "99.99%"] },
    ],
  },
]

function Value({ value }: { value: PlanMatrixValue | undefined }) {
  if (value === true) {
    return (
      <>
        <CheckIcon aria-hidden="true" className="mx-auto size-4.5 text-foreground" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false || value === undefined) {
    return (
      <>
        <MinusIcon aria-hidden="true" className="mx-auto size-4 text-muted-foreground/60" />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>
}

/* Shared cell styles. Borders live on cells so the sticky column keeps its hairline. */
const stickyCell =
  "sticky left-0 z-10 border-r border-b bg-background px-5 text-left whitespace-normal group-hover/row:bg-subtle"
const valueCell = "border-b px-3 text-center whitespace-normal"
const featuredCell = "bg-subtle group-hover/row:bg-accent"

/**
 * A feature-by-plan comparison table. Checks and dashes for yes and no,
 * plain text for limits. The feature column stays put while the plans
 * scroll sideways on small screens.
 */
export function PlanMatrix({
  columns = defaultMatrixColumns,
  groups = defaultMatrixGroups,
  title = "Compare every plan",
  description = "Every plan includes automatic HTTPS, DDoS protection and unlimited deployments. Limits reset on the first of each month.",
  caption = "Features included in each plan",
  contained = true,
  className,
}: PlanMatrixProps) {
  const hasCtas = columns.some((c) => c.cta)

  return (
    <section data-slot="plan-matrix" className={cn(contained && "container-page py-section", className)}>
      <div className="@container grid gap-12">
        {title != null ? <SectionHeading title={title} description={description} /> : null}

        <div className="overflow-hidden rounded-(--card-radius) border">
          <Table
            className={cn(
              "min-w-152 table-fixed border-separate border-spacing-0 text-sm",
              !hasCtas && "[&_tbody:last-of-type_tr:last-child>*]:border-b-0"
            )}
          >
            <caption className="sr-only">{caption}</caption>
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead scope="col" className={cn(stickyCell, "h-auto w-40 py-6 align-bottom @narrow:w-1/3")}>
                  <span className="text-caption font-semibold text-muted-foreground">Plans</span>
                </TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col.name}
                    scope="col"
                    className={cn(
                      valueCell,
                      "h-auto py-6 align-bottom",
                      col.featured && "border-panel bg-panel"
                    )}
                  >
                    <span className={`block text-title ${col.featured ? "text-panel-foreground" : "text-foreground"}`}>
                      {col.name}
                    </span>
                    {col.price ? (
                      <span
                        className={`mt-0.5 block text-caption font-normal ${
                          col.featured ? "text-panel-muted" : "text-muted-foreground"
                        }`}
                      >
                        {col.price}
                      </span>
                    ) : null}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {groups.map((group) => (
              <TableBody key={group.title}>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead
                    scope="rowgroup"
                    className={cn(stickyCell, "h-auto pt-8 pb-3")}
                  >
                    <span className="text-label text-foreground">{group.title}</span>
                  </TableHead>
                  {columns.map((col) => (
                    <TableCell
                      key={col.name}
                      aria-hidden="true"
                      className={cn(valueCell, "pt-8 pb-3", col.featured && "bg-subtle")}
                    />
                  ))}
                </TableRow>
                {group.rows.map((row) => (
                  <TableRow key={row.feature} className="group/row border-0 hover:bg-transparent">
                    <TableHead
                      scope="row"
                      className={cn(stickyCell, "h-auto py-4 font-normal text-copy transition-colors")}
                    >
                      {row.feature}
                    </TableHead>
                    {columns.map((col, i) => (
                      <TableCell
                        key={col.name}
                        className={cn(
                          valueCell,
                          "py-4 transition-colors group-hover/row:bg-subtle",
                          col.featured && featuredCell
                        )}
                      >
                        <Value value={row.values[i]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))}

            {hasCtas ? (
              <TableFooter className="border-0 bg-transparent font-normal">
                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell className={cn(stickyCell, "border-b-0 py-6")}>
                    <span className="sr-only">Choose a plan</span>
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col.name}
                      className={cn(valueCell, "border-b-0 py-6", col.featured && "bg-subtle")}
                    >
                      {col.cta ? (
                        <Button
                          size="sm"
                          variant={col.featured ? "default" : "secondary"}
                          nativeButton={false}
                          render={<Link href={col.cta.href} />}
                        >
                          {col.cta.label}
                        </Button>
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            ) : null}
          </Table>
        </div>
      </div>
    </section>
  )
}
