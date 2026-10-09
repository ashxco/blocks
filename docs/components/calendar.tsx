"use client"

import * as React from "react"
import { addDays, differenceInCalendarDays, format, isSameDay, startOfMonth, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * Every example counts from one fixed day instead of the visitor's clock, so
 * the server and the browser render the same month and the canvases are
 * never empty while the page hydrates.
 */
const today = new Date(2026, 10, 4)

const frame = "rounded-(--card-radius) border"

function SingleDate() {
  const [date, setDate] = React.useState<Date | undefined>(today)
  return <Calendar mode="single" today={today} selected={date} onSelect={setDate} className={frame} />
}

function UsageRange() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: subDays(today, 16), to: subDays(today, 2) })
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      today={today}
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      className={frame}
    />
  )
}

function BillingStart() {
  const [date, setDate] = React.useState<Date | undefined>(startOfMonth(today))
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      today={today}
      selected={date}
      onSelect={setDate}
      defaultMonth={date}
      startMonth={new Date(2020, 0)}
      endMonth={new Date(today.getFullYear() + 1, 11)}
      className={frame}
    />
  )
}

function MaintenanceWindow() {
  const [date, setDate] = React.useState<Date | undefined>()
  return (
    <div className="grid justify-items-center gap-3">
      <Calendar
        mode="single"
        today={today}
        selected={date}
        onSelect={setDate}
        disabled={[{ before: addDays(today, 1) }, { dayOfWeek: [0, 6] }]}
        className={frame}
      />
      <p className="text-caption text-muted-foreground" aria-live="polite">
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

/**
 * How the range panel is laid out: presets beside two months, presets beside
 * one month, or presets in a block above one month.
 */
type PanelLayout = "two-months" | "one-month" | "stacked"

/**
 * The panel layout that fits the room the example has. The room is measured,
 * not the window, because the docs sidebar takes part of the window. The
 * widths add up the panel's parts: the 10rem presets column, the calendar's
 * 0.75rem padding on each side, 7 --calendar-cell-size cells per month and
 * the 2rem gap between months, plus the inset that lines the panel up with
 * the trigger (--card-padding-sm and the card's hairline) and four hairlines.
 */
function usePanelLayout(ref: React.RefObject<HTMLElement | null>): PanelLayout {
  const [layout, setLayout] = React.useState<PanelLayout>("two-months")

  React.useEffect(() => {
    const room = ref.current?.parentElement
    if (!room) return
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const cell = (tokenPx("--calendar-cell-size") || 40) / 16
    const inset = (tokenPx("--card-padding-sm") || 16) / 16
    const hairlines = 4
    const twoMonths = (10 + 1.5 + 14 * cell + 2 + inset) * rem + hairlines
    const oneMonth = (10 + 1.5 + 7 * cell + inset) * rem + hairlines
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setLayout(width >= twoMonths ? "two-months" : width >= oneMonth ? "one-month" : "stacked")
    })
    observer.observe(room)
    return () => observer.disconnect()
  }, [ref])

  return layout
}

/** Classes for the element that holds a RangePanel. */
const panelDirection = (layout: PanelLayout) => (layout === "stacked" ? "flex-col" : "flex-row")

/**
 * The body of the range popover: presets beside one or two months, or above
 * one month when the room is narrow. One month opens on the end of the range,
 * so the latest days and today stay in view.
 */
function RangePanel({
  range,
  onRangeChange,
  layout,
}: {
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  layout: PanelLayout
}) {
  const twoMonths = layout === "two-months"
  return (
    <>
      <div
        className={cn(
          "shrink-0 gap-0.5 p-2",
          layout === "stacked" ? "grid grid-cols-2 border-b" : "flex w-40 flex-col border-e"
        )}
      >
        {presets.map((preset) => {
          const from = subDays(today, preset.days - 1)
          const active = Boolean(range?.from && range.to && isSameDay(range.from, from) && isSameDay(range.to, today))
          return (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              aria-pressed={active}
              className={cn(
                "justify-start rounded-(--overlay-item-radius) px-2.5 font-medium",
                active && "bg-accent font-semibold text-accent-foreground"
              )}
              onClick={() => onRangeChange({ from, to: today })}
            >
              {preset.label}
            </Button>
          )
        })}
      </div>
      <Calendar
        // A new month count opens on its own default month.
        key={twoMonths ? "two-months" : "one-month"}
        mode="range"
        numberOfMonths={twoMonths ? 2 : 1}
        today={today}
        selected={range}
        onSelect={onRangeChange}
        defaultMonth={twoMonths ? subDays(startOfMonth(today), 1) : (range?.to ?? range?.from ?? today)}
        disabled={{ after: today }}
        endMonth={today}
        className="bg-transparent"
      />
    </>
  )
}

/**
 * A log card with a range button. A picture of the open popover sits under
 * the button, drawn with the same parts, so readers see the presets and the
 * months without opening it. It is hidden from assistive technology and
 * steps aside while the real popover, which opens in the same place, shows.
 */
function LogRangePicker() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const layout = usePanelLayout(rootRef)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  // The real popover opens clear of the card, exactly where the picture sits:
  // under the trigger's end edge, or from the card's start edge when stacked.
  const [offset, setOffset] = React.useState({ side: 8, align: 0 })
  const [range, setRange] = React.useState<DateRange | undefined>({ from: subDays(today, 6), to: today })

  function handleOpenChange(next: boolean) {
    const card = cardRef.current?.getBoundingClientRect()
    const trigger = triggerRef.current?.getBoundingClientRect()
    if (next && card && trigger) setOffset({ side: card.bottom - trigger.bottom + 8, align: card.left - trigger.left })
    setOpen(next)
  }

  return (
    <div ref={rootRef} className="grid w-fit max-w-full gap-2">
      <Card ref={cardRef} size="sm" className="w-full flex-row flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <CardHeader className="min-w-48 flex-1 gap-1">
          <CardTitle>Function logs</CardTitle>
          <CardDescription>acme-web · Production</CardDescription>
        </CardHeader>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger ref={triggerRef} render={<Button variant="outline" className="ps-4" />}>
            <CalendarIcon data-icon="inline-start" />
            <span className="tabular">{formatRange(range)}</span>
          </PopoverTrigger>
          <PopoverContent
            align={layout === "stacked" ? "start" : "end"}
            alignOffset={layout === "stacked" ? offset.align : 0}
            sideOffset={offset.side}
            className={cn("w-auto max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0", panelDirection(layout))}
          >
            <RangePanel range={range} onRangeChange={setRange} layout={layout} />
          </PopoverContent>
        </Popover>
      </Card>
      <div
        aria-hidden="true"
        inert
        className={cn(
          "flex max-w-full overflow-hidden rounded-(--overlay-radius) border border-popover-border bg-popover text-sm text-popover-foreground",
          panelDirection(layout),
          // Beside the trigger's end edge, as the popover opens; full width when stacked.
          layout === "stacked"
            ? "justify-self-stretch"
            : "justify-self-end me-[calc(var(--card-padding-sm)+var(--border-width-hairline))]",
          open && "invisible"
        )}
      >
        <RangePanel range={range} onRangeChange={setRange} layout={layout} />
      </div>
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
        <SingleDate />
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
        <UsageRange />
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
        <BillingStart />
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
        <MaintenanceWindow />
      </Example>

      <Example
        title="Date range picker"
        description="A calendar in a popover, with presets for the ranges people pick most and the current one marked. Two months show when the popover has room, one when it doesn’t, and in narrow spaces the presets move above the month. The button shows the range in plain words; the open popover is drawn under the card."
        surface="subtle"
        code={`<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    <CalendarIcon data-icon="inline-start" />
    {formatRange(range)}
  </PopoverTrigger>
  <PopoverContent align="end" className="w-auto flex-row gap-0 p-0">
    <div className="flex w-40 flex-col gap-0.5 border-e p-2">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="ghost"
          size="sm"
          aria-pressed={isActive(preset)}
          className={cn("justify-start", isActive(preset) && "bg-accent font-semibold")}
          onClick={() => setRange(rangeFor(preset))}
        >
          {preset.label}
        </Button>
      ))}
    </div>
    <Calendar
      mode="range"
      numberOfMonths={roomForTwo ? 2 : 1}
      selected={range}
      onSelect={setRange}
      disabled={{ after: today }}
    />
  </PopoverContent>
</Popover>`}
      >
        <LogRangePicker />
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
          { prop: "today", type: "Date", default: "new Date()", description: "The day that carries the brand dot. Pass a fixed date when the calendar renders on the server." },
          { prop: "className", type: "string", description: "Root classes. Set --calendar-cell-size to change the cell size." },
        ]}
      />
    </Examples>
  )
}
