"use client"

import * as React from "react"
import Link from "next/link"
import { DownloadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"

import { ChangePlanDialog, type BillingPlan } from "./billing-summary/change-plan-dialog"
import { formatAmount, formatMoney, formatQuantity } from "./billing-summary/format"
import { PaymentMethodDialog, type PaymentMethod } from "./billing-summary/payment-method-dialog"

export type { BillingPlan } from "./billing-summary/change-plan-dialog"
export type { PaymentMethod } from "./billing-summary/payment-method-dialog"

export interface UsageMeter {
  id: string
  label: string
  used: number
  limit: number
  /** Unit after the numbers, e.g. "GB" or "min". */
  unit?: string
}

export interface Invoice {
  /** Invoice number, e.g. "INV-2026-010". */
  id: string
  /** Display date, e.g. "Oct 1, 2026". */
  date: string
  description: string
  amount: number
  status: "paid" | "open" | "failed"
  /** PDF link. Without it, the download button shows a confirmation instead. */
  href?: string
}

export interface BillingSummaryProps {
  /** Plans offered in the change-plan dialog. */
  plans?: BillingPlan[]
  currentPlanId?: string
  /** Display date of the next renewal. */
  renewsOn?: string
  /** Billing period shown above the usage meters. */
  periodLabel?: string
  usage?: UsageMeter[]
  paymentMethod?: PaymentMethod
  invoices?: Invoice[]
  /** ISO 4217 currency code. */
  currency?: string
  /** Pricing page for the “Compare plans” link. */
  pricingHref?: string
  /** Called when a new plan is confirmed. Throw to keep the dialog open. */
  onPlanChange?: (plan: BillingPlan) => void | Promise<void>
  /** Called with the new card’s brand, last four digits and expiry. The full number never leaves the dialog. */
  onPaymentMethodChange?: (method: Pick<PaymentMethod, "brand" | "last4" | "expires">) => void
  className?: string
}

const defaultPlans: BillingPlan[] = [
  { id: "hobby", name: "Hobby", price: 5, description: "Side projects and experiments.", seats: 1 },
  { id: "starter", name: "Starter", price: 20, description: "Your first real app in production.", seats: 3 },
  { id: "pro", name: "Pro", price: 39, description: "Production apps that need room to grow.", seats: 10 },
  { id: "scale", name: "Scale", price: 99, description: "Teams running serious traffic." },
]

const defaultUsage: UsageMeter[] = [
  { id: "build-minutes", label: "Build minutes", used: 3412, limit: 6000, unit: "min" },
  { id: "bandwidth", label: "Bandwidth", used: 412, limit: 1000, unit: "GB" },
  { id: "invocations", label: "Function invocations", used: 4_120_000, limit: 5_000_000 },
  { id: "storage", label: "Database storage", used: 2.4, limit: 10, unit: "GB" },
]

const defaultInvoices: Invoice[] = [
  { id: "INV-2026-010", date: "Oct 1, 2026", description: "Pro plan, October", amount: 39, status: "open" },
  { id: "INV-2026-009", date: "Sep 1, 2026", description: "Pro plan, September", amount: 39, status: "paid" },
  { id: "INV-2026-008", date: "Aug 1, 2026", description: "Pro plan, August, plus 120 GB bandwidth", amount: 45, status: "paid" },
  { id: "INV-2026-007", date: "Jul 14, 2026", description: "Upgrade from Starter to Pro, prorated", amount: 12.58, status: "paid" },
  { id: "INV-2026-006", date: "Jul 1, 2026", description: "Starter plan, July", amount: 20, status: "paid" },
]

const defaultPaymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/2028",
  email: "billing@halcyon.dev",
  billedTo: "Halcyon Labs GmbH",
}

export function BillingSummary({
  plans = defaultPlans,
  currentPlanId = "pro",
  renewsOn = "November 1, 2026",
  periodLabel = "October 1 to 31, 2026. Resets in 23 days.",
  usage = defaultUsage,
  paymentMethod: initialPayment = defaultPaymentMethod,
  invoices = defaultInvoices,
  currency = "USD",
  pricingHref = "/live/pricing",
  onPlanChange,
  onPaymentMethodChange,
  className,
}: BillingSummaryProps) {
  const id = React.useId()
  const [planId, setPlanId] = React.useState(currentPlanId)
  const [payment, setPayment] = React.useState(initialPayment)
  const plan = plans.find((p) => p.id === planId) ?? plans[0]

  return (
    <div data-slot="billing-summary" className={cn("@container grid gap-6", className)}>
      <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Current plan: the one dark panel on the page */}
        <section
          aria-labelledby={`${id}-plan`}
          className="@container/plan flex flex-col rounded-(--panel-radius) border border-panel-border bg-panel p-8 text-panel-muted @prose:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <h2 id={`${id}-plan`} className="text-h3 text-panel-foreground">
                {plan.name} plan
              </h2>
              <p className="text-sm">{plan.description}</p>
            </div>
            <Badge variant="outline" className="gap-1.5 border-panel-border text-panel-foreground">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Active
            </Badge>
          </div>

          <p className="mt-10 flex items-baseline gap-2">
            <span className="text-h1 text-panel-foreground tabular-nums">{formatMoney(plan.price, currency)}</span>
            <span className="text-sm">per month</span>
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-panel-border pt-6 @min-[28rem]/plan:grid-cols-3">
            <div className="grid gap-1">
              <dt className="text-caption">Renews on</dt>
              <dd className="text-label text-panel-foreground">{renewsOn}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption">Billed</dt>
              <dd className="text-label text-panel-foreground">Monthly, in {currency}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption">Team seats</dt>
              <dd className="text-label text-panel-foreground">{plan.seats ? `${plan.seats} included` : "Unlimited"}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap gap-3 pt-10">
            <ChangePlanDialog
              plans={plans}
              currentPlanId={planId}
              renewsOn={renewsOn}
              currency={currency}
              onChange={async (next) => {
                await onPlanChange?.(next)
                setPlanId(next.id)
                toast.add({
                  title: `You’re on ${next.name} now`,
                  description: "The prorated difference appears on your next invoice.",
                })
              }}
            />
            <Button variant="outline-inverse" nativeButton={false} render={<Link href={pricingHref} />}>
              Compare plans
            </Button>
          </div>
        </section>

        {/* Payment method */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Payment method</h2>
            </CardTitle>
            <CardDescription>Charged on the 1st of each month.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex items-center gap-4 rounded-(--control-radius) border bg-subtle p-4">
              <span
                className="grid h-9 w-13 shrink-0 place-items-center rounded-xs bg-panel font-mono text-xs font-bold text-panel-foreground uppercase"
                aria-hidden="true"
              >
                {payment.brand.slice(0, 4)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-label text-foreground">
                  {payment.brand} ending in <span className="tabular-nums">{payment.last4}</span>
                </p>
                <p className="text-caption text-muted-foreground tabular-nums">Expires {payment.expires}</p>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted-foreground">Receipts to</dt>
                <dd className="min-w-0 truncate text-foreground">{payment.email}</dd>
              </div>
              {payment.billedTo ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Billed to</dt>
                  <dd className="min-w-0 truncate text-foreground">{payment.billedTo}</dd>
                </div>
              ) : null}
            </dl>
          </CardContent>
          <CardFooter className="mt-auto">
            <PaymentMethodDialog
              onSave={(next) => {
                onPaymentMethodChange?.(next)
                setPayment((p) => ({ ...p, ...next }))
                toast.add({ title: "Payment method updated", description: `${next.brand} ending in ${next.last4} is now your default.` })
              }}
            />
          </CardFooter>
        </Card>
      </div>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Usage this period</h2>
          </CardTitle>
          <CardDescription>{periodLabel}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-x-12 gap-y-7 @prose:grid-cols-2">
          {usage.map((meter) => (
            <UsageRow key={meter.id} meter={meter} />
          ))}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Usage over a limit is billed at the end of the period. Admins get an email at 80% and 100%.
          </p>
        </CardFooter>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Invoices</h2>
          </CardTitle>
          <CardDescription>Receipts are also emailed to {payment.email}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead className="hidden @prose:table-cell">Date</TableHead>
                <TableHead className="hidden @narrow:table-cell">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <span className="block font-mono text-xs text-foreground">{invoice.id}</span>
                    <span className="block text-caption text-muted-foreground @prose:hidden">{invoice.date}</span>
                  </TableCell>
                  <TableCell className="hidden text-copy tabular-nums @prose:table-cell">{invoice.date}</TableCell>
                  <TableCell className="hidden max-w-80 truncate text-copy @narrow:table-cell">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground tabular-nums">
                    {formatAmount(invoice.amount, currency)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatus status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceDownload invoice={invoice} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function UsageRow({ meter }: { meter: UsageMeter }) {
  const pct = meter.limit > 0 ? Math.min(100, Math.round((meter.used / meter.limit) * 100)) : 0
  const high = pct >= 80
  const unit = meter.unit ? ` ${meter.unit}` : ""
  const used = formatQuantity(meter.used)
  const limit = formatQuantity(meter.limit)

  return (
    <Progress
      value={pct}
      getAriaValueText={() => `${used} of ${limit}${unit} used`}
      className={cn("gap-x-3 gap-y-2.5", high && "[&_[data-slot=progress-indicator]]:bg-warning")}
    >
      <ProgressLabel>{meter.label}</ProgressLabel>
      <span className="ml-auto text-sm text-muted-foreground tabular-nums">
        <span className={cn("font-semibold", high ? "text-warning" : "text-foreground")}>{used}</span> / {limit}
        {unit}
      </span>
    </Progress>
  )
}

function InvoiceStatus({ status }: { status: Invoice["status"] }) {
  if (status === "paid") return <Badge variant="success">Paid</Badge>
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>
  return <Badge variant="outline">Due</Badge>
}

function InvoiceDownload({ invoice }: { invoice: Invoice }) {
  const label = `Download ${invoice.id} as PDF`
  if (invoice.href) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        nativeButton={false}
        render={<a href={invoice.href} download />}
      >
        <DownloadIcon />
      </Button>
    )
  }
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={() =>
        toast.add({ title: `Preparing ${invoice.id}.pdf`, description: "Your download starts in a moment." })
      }
    >
      <DownloadIcon />
    </Button>
  )
}
