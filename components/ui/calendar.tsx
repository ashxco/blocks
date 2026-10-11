"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

/**
 * Blocks calendar, on react-day-picker.
 *
 * A clean grid of day cells in the button radius (round in the default
 * theme). The month title is bold and sits on the left, the arrows on the
 * right. Selected days fill with ink, ranges run as an accent band between
 * two ink ends, and today carries a small brand dot.
 * Cell size comes from the --calendar-cell-size token. Set it on the
 * calendar or an ancestor to change it: "[--calendar-cell-size:--spacing(9)]".
 *
 * Every label is formatted with the `locale` prop (English by default), never
 * the environment's locale, so the server and the browser render the same
 * markup. Pass a fixed `today` as well when the calendar renders on the server.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  // With several months, days from a neighbouring month appear twice. Keep
  // those outside days plain so a range reads once, in its own month.
  const multiMonth = (props.numberOfMonths ?? 1) > 1

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-3 text-foreground [--cell-size:var(--calendar-cell-size)]",
        "in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code ?? "en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-6 md:flex-row md:gap-8",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-(--cell-size) w-full items-center justify-end gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "select-none aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "select-none aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center ps-1.5 pe-20",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) items-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative flex h-(--control-height-xs) items-center rounded-(--control-radius) border border-input bg-muted ps-3 pe-2",
          "transition-[border-color] duration-(--duration-fast) ease-standard hover:border-foreground/25",
          "has-focus-visible:focus-ring-inset",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-popover opacity-0 dark:scheme-dark",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none",
          captionLayout === "label"
            ? "text-title"
            : "flex items-center gap-1 text-label [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex h-8 flex-1 items-center justify-center text-caption font-semibold text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-xs font-medium text-muted-foreground tabular select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]]:rounded-s-(--button-radius)"
            : "[&:first-child[data-selected=true]]:rounded-s-(--button-radius)",
          "[&:last-child[data-selected=true]]:rounded-e-(--button-radius)",
          // Outside days stay plain with several months, so close the band
          // on the last and first in-month days next to them.
          multiMonth &&
            "data-[outside=true]:bg-transparent [&:has(+[data-outside=true])]:rounded-e-(--button-radius) [[data-outside=true]+&]:rounded-s-(--button-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-s-(--button-radius) bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-accent",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-e-(--button-radius) bg-accent",
          defaultClassNames.range_end
        ),
        today: cn(defaultClassNames.today),
        outside: cn(defaultClassNames.outside),
        disabled: cn(defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        footer: cn(
          "pt-3 text-sm text-muted-foreground",
          defaultClassNames.footer
        ),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ day, modifiers, ...props }) => (
          <CalendarDayButton
            locale={locale}
            day={day}
            modifiers={
              multiMonth && day.outside
                ? {
                    ...modifiers,
                    selected: false,
                    range_start: false,
                    range_end: false,
                    range_middle: false,
                  }
                : modifiers
            }
            {...props}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day-button"
      data-day={day.date.toLocaleDateString(locale?.code ?? "en-US")}
      data-today={modifiers.today || undefined}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-0.5 rounded-(--button-radius) border-0 text-sm leading-none font-medium text-foreground tabular outline-none select-none",
        "transition-[background-color,color] duration-(--duration-fast) ease-standard",
        "hover:bg-accent focus-visible:z-20 focus-visible:focus-ring",
        "group-data-[outside=true]/day:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent",
        // Today: bold figure and a brand dot under it. On an ink fill the dot
        // flips to the fill's foreground, so it still shows where brand is ink.
        "data-[today=true]:font-bold",
        "after:pointer-events-none after:absolute after:bottom-1.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-brand after:opacity-0 data-[today=true]:after:opacity-100",
        "data-[range-end=true]:after:bg-primary-foreground data-[range-start=true]:after:bg-primary-foreground data-[selected-single=true]:after:bg-primary-foreground",
        // Selection: ink fill for single days and range ends.
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary/85",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-primary/85",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-primary/85",
        "data-[range-middle=true]:hover:bg-foreground/8",
        "[&>span]:text-xs [&>span]:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
