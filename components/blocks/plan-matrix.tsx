import * as React from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  /** Short price line under the name, e.g. "From $12 per member / month". */
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

// "From" because these are the annual prices. The non-breaking spaces make a
// narrow column wrap after the amount, not in the middle of "per member / month".
export const defaultMatrixColumns: PlanMatrixColumn[] = [
  { name: "Free", price: "$0", cta: { label: "Start for free", href: "/live/sign-up" } },
  { name: "Pro", price: "From\u00a0$12 per\u00a0member\u00a0/\u00a0month", featured: true, cta: { label: "Start free trial", href: "/live/sign-up" } },
  { name: "Business", price: "From\u00a0$24 per\u00a0member\u00a0/\u00a0month", cta: { label: "Choose Business", href: "/live/sign-up" } },
  { name: "Enterprise", price: "Custom", cta: { label: "Talk to sales", href: "/live/contact" } },
]

export const defaultMatrixGroups: PlanMatrixGroup[] = [
  {
    title: "Projects and tasks",
    rows: [
      { feature: "Members", values: ["Up to 3", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Projects", values: [5, "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "List, board, timeline and calendar views", values: [true, true, true, true] },
      { feature: "Subtasks, priorities and comments", values: [true, true, true, true] },
      { feature: "Docs", values: [true, true, true, true] },
      { feature: "Guests", values: [false, "10", "50", "Custom"] },
    ],
  },
  {
    title: "Automations and reports",
    rows: [
      { feature: "Automation runs a month", values: ["1,000", "10,000", "50,000", "Custom"] },
      { feature: "Reports and dashboards", values: [true, true, true, true] },
      { feature: "Integrations", values: [false, true, true, true] },
      { feature: "Storage", values: ["2 GB", "100 GB", "1 TB", "Custom"] },
    ],
  },
  {
    title: "Admin and security",
    rows: [
      { feature: "Two-factor authentication", values: [true, true, true, true] },
      { feature: "SSO with SAML", values: [false, false, true, true] },
      { feature: "Advanced permissions", values: [false, false, true, true] },
      { feature: "Audit log", values: [false, false, true, true] },
      { feature: "Data residency", values: [false, false, false, true] },
    ],
  },
  {
    title: "Support",
    rows: [
      { feature: "Uptime SLA", values: [false, false, "99.9%", "99.9%"] },
      { feature: "Support", values: ["Help center", "Email", "Priority email", "Success manager"] },
      { feature: "Custom contracts", values: [false, false, false, true] },
    ],
  },
]

function Value({ value, align = "center" }: { value: PlanMatrixValue | undefined; align?: "center" | "end" }) {
  const icon = align === "center" ? "mx-auto" : "ml-auto"
  if (value === true) {
    return (
      <>
        <CheckIcon aria-hidden="true" className={cn(icon, "size-4.5 text-foreground")} />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false || value === undefined) {
    return (
      <>
        <MinusIcon aria-hidden="true" className={cn(icon, "size-4 text-muted-foreground/60")} />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>
}

/**
 * Below 42rem a four-column table only shows a plan and a half, so the
 * matrix shows one plan at a time: a segmented switch, then that plan's
 * values beside the feature names at full width.
 */
function PlanMatrixStacked({
  columns,
  groups,
  className,
}: {
  columns: PlanMatrixColumn[]
  groups: PlanMatrixGroup[]
  className?: string
}) {
  const initial = (columns.find((c) => c.featured) ?? columns[0])?.name

  return (
    <Tabs defaultValue={initial} className={cn("gap-6", className)}>
      <TabsList variant="segmented" aria-label="Plan to show" className="w-full">
        {columns.map((col) => (
          <TabsTrigger key={col.name} value={col.name} className="min-w-0 px-2">
            {col.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {columns.map((col, index) => (
        <TabsContent key={col.name} value={col.name} className="text-foreground">
          <div className="overflow-hidden rounded-(--card-radius) border">
            <div
              className={cn(
                "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-5",
                col.featured ? "bg-panel text-panel-foreground" : "border-b bg-subtle"
              )}
            >
              <h3 className={cn("text-title", col.featured ? "text-panel-foreground" : "text-foreground")}>
                {col.name}
              </h3>
              {col.price ? (
                <p className={cn("text-caption", col.featured ? "text-panel-muted" : "text-muted-foreground")}>
                  {col.price}
                </p>
              ) : null}
            </div>

            {groups.map((group) => (
              <div key={group.title} className="px-5 pt-6 last:pb-2">
                <h4 className="text-label text-foreground">{group.title}</h4>
                <dl className="mt-2 divide-y">
                  {group.rows.map((row) => (
                    <div key={row.feature} className="flex items-center justify-between gap-6 py-3.5">
                      <dt className="text-sm text-copy">{row.feature}</dt>
                      <dd className="shrink-0 text-right">
                        <Value value={row.values[index]} align="end" />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            {col.cta ? (
              <div className="border-t p-5">
                <Button
                  variant={col.featured ? "default" : "secondary"}
                  className="w-full"
                  nativeButton={false}
                  render={<Link href={col.cta.href} />}
                >
                  {col.cta.label}
                </Button>
              </div>
            ) : null}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

/* Shared cell styles. Borders live on cells so the sticky column keeps its hairline. */
const stickyCell =
  "sticky left-0 z-10 border-r border-b bg-card px-5 text-left whitespace-normal group-hover/row:bg-subtle"
const valueCell = "border-b px-2 text-center whitespace-normal @prose:px-3"
/* bg-muted, not bg-subtle: muted keeps the column visibly tinted on the card in both themes. */
const featuredCell = "bg-muted group-hover/row:bg-accent"
/* Group titles run as one clean line: no column divider, only the featured column's tint carries through. */
const groupCell = "sticky left-0 z-10 border-b bg-card px-5 text-left whitespace-normal"

/**
 * A feature-by-plan comparison table. Checks and dashes for yes and no,
 * plain text for limits. With three or more plans, narrow slots show one
 * plan at a time behind a segmented switch; from 42rem the full table
 * shows, and its feature column stays put if the plans still need to scroll.
 */
export function PlanMatrix({
  columns = defaultMatrixColumns,
  groups = defaultMatrixGroups,
  title = "Compare every plan.",
  description = "Every plan includes every view, docs and reports. Automation runs reset on the first of each month.",
  caption = "Features included in each plan",
  contained = true,
  className,
}: PlanMatrixProps) {
  const hasCtas = columns.some((c) => c.cta)
  // Two plans fit side by side on a phone; three or more switch to one at a time.
  const stacked = columns.length > 2

  return (
    <section data-slot="plan-matrix" className={cn(contained && "container-page py-section", className)}>
      <div className="@container grid gap-12">
        {title != null ? <SectionHeading title={title} description={description} /> : null}

        {stacked ? <PlanMatrixStacked columns={columns} groups={groups} className="@prose:hidden" /> : null}

        {/* The card table draws its own border and clips the featured column to its radius. */}
        <div className={cn(stacked && "hidden @prose:block")}>
          <Table
            variant="card"
            className={cn(
              // Wide enough for four plans; a two-plan table fits a phone as it is.
              stacked ? "min-w-184" : "min-w-0",
              "table-fixed border-separate border-spacing-0 text-sm",
              !hasCtas && "[&_tbody:last-of-type_tr:last-child>*]:border-b-0"
            )}
          >
            <caption className="sr-only">{caption}</caption>
            <TableHeader className="group-data-[variant=card]/table:bg-transparent [&_tr]:border-0">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead scope="col" className={cn(stickyCell, "h-auto w-28 py-6 align-bottom @prose:w-40 @narrow:w-1/3")}>
                  <span className="text-caption font-semibold text-muted-foreground">Plans</span>
                </TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col.name}
                    scope="col"
                    className={cn(
                      valueCell,
                      "h-auto py-6 align-bottom",
                      // The emphasis panel, which stays dark in both themes.
                      col.featured && "border-panel bg-panel"
                    )}
                  >
                    <span className={cn("block text-title", col.featured ? "text-panel-foreground" : "text-foreground")}>
                      {col.name}
                    </span>
                    {col.price ? (
                      <span
                        className={cn(
                          "mt-0.5 block text-caption font-normal",
                          col.featured ? "text-panel-muted" : "text-muted-foreground"
                        )}
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
                  <TableHead scope="rowgroup" className={cn(groupCell, "h-auto pt-8 pb-3")}>
                    <span className="text-label text-foreground">{group.title}</span>
                  </TableHead>
                  {columns.map((col) => (
                    <TableCell
                      key={col.name}
                      aria-hidden="true"
                      className={cn("border-b pt-8 pb-3", col.featured && "bg-muted")}
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
                      className={cn(valueCell, "border-b-0 py-6", col.featured && "bg-muted")}
                    >
                      {col.cta ? (
                        <Button
                          size="sm"
                          variant={col.featured ? "default" : "secondary"}
                          className="px-3"
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
