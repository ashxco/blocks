"use client"

import * as React from "react"
import { addDays, differenceInCalendarDays, format, startOfMonth, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const subscribe = () => () => {}

/**
 * Calendars depend on the viewer's clock and time zone, which the server
 * cannot know. Render them after hydration, with a same-size placeholder.
 */
function ClientOnly({
  children,
  className = "h-90 w-76",
}: {
  children: React.ReactNode
  className?: string
}) {
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  if (!mounted) return <div aria-hidden="true" className={className} />
  return <>{children}</>
}

const frame = "rounded-(--card-radius) border"

function SingleDate() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className={frame}
    />
  )
}

function UsageRange() {
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const today = new Date()
    return { from: subDays(today, 9), to: subDays(today, 2) }
  })
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      className={frame}
    />
  )
}

function BillingStart() {
  const [date, setDate] = React.useState<Date | undefined>(() => startOfMonth(new Date()))
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      selected={date}
      onSelect={setDate}
      defaultMonth={date}
      startMonth={new Date(2020, 0)}
      endMonth={new Date(new Date().getFullYear() + 1, 11)}
      className={frame}
    />
  )
}

function MaintenanceWindow() {
  const [date, setDate] = React.useState<Date | undefined>()
  const today = React.useMemo(() => new Date(), [])
  return (
    <div className="grid justify-items-center gap-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={[{ before: addDays(today, 1) }, { dayOfWeek: [0, 6] }]}
        className={frame}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {date
          ? `Maintenance starts ${format(date, "EEEE, MMMM d")} at 02:00 UTC.`
          : "Pick a weekday from tomorrow on."}
      </p>
    </div>
  )
}

const presets = [
  { label: "Last 24 hours", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
]

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return "Pick a date range"
  if (!range.to || differenceInCalendarDays(range.to, range.from) === 0) {
    return format(range.from, "MMM d, yyyy")
  }
  return `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
}

function LogRangePicker() {
  const today = React.useMemo(() => new Date(), [])
  const [range, setRange] = React.useState<DateRange | undefined>(() => ({
    from: subDays(today, 6),
    to: today,
  }))

  return (
    <div className="flex w-full max-w-prose flex-wrap items-center justify-between gap-3 rounded-(--card-radius) border bg-card px-4 py-3">
      <div className="grid gap-0.5">
        <p className="text-title text-foreground">Function logs</p>
        <p className="text-caption text-muted-foreground">acme-storefront · Production</p>
      </div>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" className="ps-4" />}>
          <CalendarIcon data-icon="inline-start" />
          <span className="tabular">{formatRange(range)}</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto max-w-[calc(100vw-2rem)] flex-row gap-0 overflow-hidden p-0">
          <div className="hidden w-40 shrink-0 flex-col gap-0.5 border-e p-2 sm:flex">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start rounded-(--overlay-item-radius) px-2.5 font-medium"
                onClick={() => setRange({ from: subDays(today, preset.days - 1), to: today })}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            defaultMonth={range?.from}
            disabled={{ after: today }}
            endMonth={today}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function CalendarDocs() {
  return (
    <Examples>
      <Example
        title="Single date"
        description="Today carries a brand dot. The selected day fills with ink."
        code={`const [date, setDate] = React.useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-(--card-radius) border"
/>`}
      >
        <ClientOnly>
          <SingleDate />
        </ClientOnly>
      </Example>

      <Example
        title="Range"
        description="The two ends fill with ink and the days between sit on an accent band. Show two months for ranges that cross a month."
        code={`const [range, setRange] = React.useState<DateRange | undefined>()

<Calendar
  mode="range"
  numberOfMonths={2}
  selected={range}
  onSelect={setRange}
/>`}
      >
        <ClientOnly className="h-90 w-76 md:w-160">
          <UsageRange />
        </ClientOnly>
      </Example>

      <Example
        title="Month and year menus"
        description='Use captionLayout="dropdown" when the date can be months or years away, such as a contract start date.'
        code={`<Calendar
  mode="single"
  captionLayout="dropdown"
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2027, 11)}
  selected={date}
  onSelect={setDate}
/>`}
      >
        <ClientOnly>
          <BillingStart />
        </ClientOnly>
      </Example>

      <Example
        title="Disabled days"
        description="Disable days that can’t be picked, and say why next to the calendar. Here: weekdays from tomorrow on."
        code={`<Calendar
  mode="single"
  disabled={[{ before: addDays(new Date(), 1) }, { dayOfWeek: [0, 6] }]}
  selected={date}
  onSelect={setDate}
/>`}
      >
        <ClientOnly className="h-96 w-76">
          <MaintenanceWindow />
        </ClientOnly>
      </Example>

      <Example
        title="Date range picker"
        description="A calendar in a popover, with presets for the ranges people pick most. The button shows the range in plain words."
        layout="stack"
        surface="subtle"
        minHeight="min-h-[30rem]"
        code={`<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    <CalendarIcon data-icon="inline-start" />
    {formatRange(range)}
  </PopoverTrigger>
  <PopoverContent align="end" className="w-auto p-0">
    <Calendar mode="range" selected={range} onSelect={setRange} />
  </PopoverContent>
</Popover>`}
      >
        <ClientOnly className="h-17 w-full max-w-prose">
          <LogRangePicker />
        </ClientOnly>
      </Example>

      <Guidelines
        do={[
          "Use a calendar when the day of the week or the distance between dates matters.",
          "Disable days that can’t be picked and say why in text nearby.",
          "Show two months when ranges often cross a month boundary.",
          "Offer presets such as “Last 7 days” next to a range calendar.",
        ]}
        dont={[
          "Don’t use a calendar for dates far in the past, such as a birth date. Use inputs or the dropdown caption.",
          "Don’t fill selected days with brand colour. Selection is ink; brand only marks today.",
          "Don’t add a shadow to the calendar or to the popover around it.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "mode", type: '"single" | "multiple" | "range"', description: "What the calendar selects." },
          { prop: "selected / onSelect", type: "Date | Date[] | DateRange", description: "Controlled selection and its change handler. The type follows mode." },
          { prop: "numberOfMonths", type: "number", default: "1", description: "Months shown side by side from md up, stacked below." },
          { prop: "captionLayout", type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"', default: '"label"', description: "A bold month title, or menus to jump between months and years." },
          { prop: "disabled", type: "Matcher | Matcher[]", description: "Days that can’t be picked, such as { before: date } or { dayOfWeek: [0, 6] }." },
          { prop: "startMonth / endMonth", type: "Date", description: "The first and last month people can navigate to." },
          { prop: "showOutsideDays", type: "boolean", default: "true", description: "Show muted days from the previous and next month." },
          { prop: "buttonVariant", type: "Button variant", default: '"ghost"', description: "Variant of the previous and next month buttons." },
          { prop: "className", type: "string", description: "Root classes. Override the cell size with [--cell-size:--spacing(9)]." },
        ]}
      />
    </Examples>
  )
}
