"use client"

import * as React from "react"
import Link from "next/link"
import { CircleAlertIcon, CreditCardIcon, DownloadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Spinner } from "@/components/ui/spinner"
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
  /** The active plan. When it changes, the summary follows it. */
  currentPlanId?: string
  /** Display date of the next renewal. */
  renewsOn?: string
  /** Billing period shown above the usage meters. */
  periodLabel?: string
  usage?: UsageMeter[]
  /** The card on file. When it changes, the summary follows it. */
  paymentMethod?: PaymentMethod
  invoices?: Invoice[]
  /** ISO 4217 currency code. */
  currency?: string
  /** Pricing page for the “Compare plans” link. */
  pricingHref?: string
  /**
   * Turns “Change plan” into a link, for pages that already show the plans,
   * such as "#change-plan". Without it the button opens the change-plan dialog.
   */
  changePlanHref?: string
  /** Amount of the next charge on renewsOn. Defaults to the current plan’s price; pass a scheduled plan’s price instead. */
  nextCharge?: number
  /**
   * Called when a new plan is confirmed. Throw to keep the dialog open.
   * Upgrades show straight away; downgrades start at renewal, so the summary
   * keeps the current plan and leaves scheduling to you.
   */
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

/** Pro plan limits from the Lumen pricing page. */
const defaultUsage: UsageMeter[] = [
  { id: "build-minutes", label: "Build minutes", used: 7240, limit: 10_000, unit: "min" },
  { id: "bandwidth", label: "Bandwidth", used: 412, limit: 1000, unit: "GB" },
  { id: "invocations", label: "Function invocations", used: 3_180_000, limit: 5_000_000 },
  { id: "storage", label: "Database storage", used: 18.6, limit: 50, unit: "GB" },
]

const defaultInvoices: Invoice[] = [
  { id: "INV-2026-010", date: "Oct 1, 2026", description: "Pro plan, October", amount: 39, status: "paid" },
  { id: "INV-2026-009", date: "Sep 1, 2026", description: "Pro plan, September", amount: 39, status: "paid" },
  { id: "INV-2026-008", date: "Aug 1, 2026", description: "Pro plan, August, plus 120 GB bandwidth", amount: 45, status: "paid" },
  { id: "INV-2026-007", date: "Jul 14, 2026", description: "Upgrade from Starter to Pro, prorated", amount: 12.58, status: "paid" },
  { id: "INV-2026-006", date: "Jul 1, 2026", description: "Starter plan, July", amount: 20, status: "paid" },
]

const defaultPaymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/2028",
  email: "billing@acme.dev",
  billedTo: "Acme Inc.",
}

export function BillingSummary({
  plans = defaultPlans,
  currentPlanId = "pro",
  renewsOn = "November 1, 2026",
  periodLabel = "October 1 to 31, 2026. Resets in 23 days.",
  usage = defaultUsage,
  paymentMethod = defaultPaymentMethod,
  invoices = defaultInvoices,
  currency = "USD",
  pricingHref = "/live/pricing",
  changePlanHref,
  nextCharge,
  onPlanChange,
  onPaymentMethodChange,
  className,
}: BillingSummaryProps) {
  const id = React.useId()
  const [planId, setPlanId] = React.useState(currentPlanId)
  const [payment, setPayment] = React.useState(paymentMethod)

  // Follow the props when the page changes them (a plan picker elsewhere on
  // the page, a card saved in another form), without remounting the summary.
  const [syncedPlanId, setSyncedPlanId] = React.useState(currentPlanId)
  if (currentPlanId !== syncedPlanId) {
    setSyncedPlanId(currentPlanId)
    setPlanId(currentPlanId)
  }
  // Compared by value, so an inline object from the parent doesn’t reset a card saved here.
  const paymentKey = [
    paymentMethod.brand,
    paymentMethod.last4,
    paymentMethod.expires,
    paymentMethod.email,
    paymentMethod.billedTo,
  ].join("|")
  const [syncedPaymentKey, setSyncedPaymentKey] = React.useState(paymentKey)
  if (paymentKey !== syncedPaymentKey) {
    setSyncedPaymentKey(paymentKey)
    setPayment(paymentMethod)
  }

  const plan = plans.find((p) => p.id === planId) ?? plans[0]

  // A failed charge is the one thing that needs action on this page: it leads
  // the summary, turns the plan badge to Past due and offers to pay now.
  const [settled, setSettled] = React.useState<string[]>([])
  const [paying, setPaying] = React.useState(false)
  const shownInvoices = invoices.map((invoice) =>
    settled.includes(invoice.id) ? { ...invoice, status: "paid" as const } : invoice
  )
  const failed = shownInvoices.find((invoice) => invoice.status === "failed")

  async function payNow(invoice: Invoice) {
    setPaying(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setPaying(false)
    setSettled((ids) => [...ids, invoice.id])
    toast.add({
      type: "success",
      title: `${invoice.id} is paid`,
      description: `${formatAmount(invoice.amount, currency)} was charged to the ${payment.brand} ending in ${payment.last4}.`,
    })
  }

  return (
    <div data-slot="billing-summary" className={cn("@container grid gap-6", className)}>
      {failed ? (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden="true" />
          <AlertTitle>
            The {failed.date} payment of {formatAmount(failed.amount, currency)} failed
          </AlertTitle>
          <AlertDescription>
            We couldn’t charge the {payment.brand} ending in {payment.last4}. Pay now, or update the card and we
            retry within a day.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" disabled={paying} onClick={() => void payNow(failed)}>
              {paying ? <Spinner data-icon="inline-start" /> : null}
              {paying ? "Paying" : "Pay now"}
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <div className="grid gap-6 @narrow:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Current plan: the one dark panel on the page */}
        <section
          aria-labelledby={`${id}-plan`}
          className="@container/plan flex flex-col rounded-(--panel-radius) border border-panel-border bg-panel p-(--panel-padding-sm) text-panel-muted"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <h2 id={`${id}-plan`} className="text-h3 text-panel-foreground">
                {plan.name} plan
              </h2>
              <p className="text-sm">{plan.description}</p>
            </div>
            <Badge variant="outline" className="gap-1.5 border-panel-border text-panel-foreground">
              {/* A dark scope gives the dot the dark theme's colours, which read on the panel in both themes. */}
              <span
                className={cn("dark size-1.5 rounded-full", failed ? "bg-warning" : "bg-success")}
                aria-hidden="true"
              />
              {failed ? "Past due" : "Active"}
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
            {changePlanHref ? (
              <Button variant="inverse" nativeButton={false} render={<Link href={changePlanHref} />}>
                Change plan
              </Button>
            ) : (
              <ChangePlanDialog
                plans={plans}
                currentPlanId={planId}
                renewsOn={renewsOn}
                currency={currency}
                onChange={async (next) => {
                  await onPlanChange?.(next)
                  if (next.price > plan.price) {
                    setPlanId(next.id)
                    toast.add({
                      title: `You’re on ${next.name} now`,
                      description: "The prorated difference appears on your next invoice.",
                    })
                  } else {
                    toast.add({
                      title: `${next.name} starts on ${renewsOn}`,
                      description: `You keep ${plan.name} until then.`,
                    })
                  }
                }}
              />
            )}
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
          <CardContent className="flex flex-1 flex-col gap-5">
            <div className="flex items-center gap-4 rounded-(--control-radius) border bg-subtle p-4">
              <CardMark brand={payment.brand} />
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
            {/* The next charge closes the card, so next to the taller plan panel the card has no empty stretch. */}
            <div className="mt-auto grid gap-1 border-t pt-5">
              <p className="text-caption text-muted-foreground">Next charge</p>
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-h4 text-foreground tabular-nums">{formatAmount(nextCharge ?? plan.price, currency)}</span>
                <span className="text-sm text-copy">on {renewsOn}</span>
              </p>
            </div>
          </CardContent>
          <CardFooter>
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
            Usage over a limit is billed at the end of the period. Owners get an email at 50%, 80% and 100% of each
            limit.
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
          {/* Below the prose width the date and status sit under the number, so three columns fit a
              phone. The outer cells line up with the card text. */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-0">Invoice</TableHead>
                <TableHead className="hidden @prose:table-cell">Date</TableHead>
                <TableHead className="hidden @narrow:table-cell">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden @prose:table-cell">Status</TableHead>
                <TableHead className="w-0 pr-0">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shownInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="in-data-[slot=table-body]:hover:bg-transparent">
                  <TableCell className="py-3 pl-0 @prose:py-0">
                    <span className="block font-mono text-xs text-foreground">{invoice.id}</span>
                    <span className="mt-1 flex items-center gap-2 @prose:hidden">
                      <span className="text-caption text-muted-foreground">{invoice.date}</span>
                      <InvoiceStatus status={invoice.status} />
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-copy tabular-nums @prose:table-cell">{invoice.date}</TableCell>
                  <TableCell className="hidden max-w-80 truncate text-copy @narrow:table-cell">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground tabular-nums">
                    {formatAmount(invoice.amount, currency)}
                  </TableCell>
                  <TableCell className="hidden @prose:table-cell">
                    <InvoiceStatus status={invoice.status} />
                  </TableCell>
                  <TableCell className="pr-0 text-right">
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

/** Short marks for the card chip. Unknown brands get a card icon instead of a cut-off name. */
const BRAND_MARKS: Record<string, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  "american express": "AMEX",
  discover: "DISC",
}

function CardMark({ brand }: { brand: string }) {
  const mark = BRAND_MARKS[brand.trim().toLowerCase()]
  return (
    <span
      className="grid aspect-3/2 h-(--control-height-sm) shrink-0 place-items-center rounded-xs bg-panel font-mono text-xs font-bold text-panel-foreground"
      aria-hidden="true"
    >
      {mark ?? <CreditCardIcon className="size-4" />}
    </span>
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
