/**
 * Small date helpers for the docs examples, on Date and Intl, so the docs
 * need no date library. Dates are local calendar days; arithmetic keeps the
 * time of day, like the date-fns functions they replace.
 */

const DAY_MS = 86_400_000

/** The date `amount` calendar days later (earlier when negative). */
export function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

/** The date `amount` calendar days earlier. */
export function subDays(date: Date, amount: number) {
  return addDays(date, -amount)
}

/** Midnight on the first day of the date's month. */
export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/** Whether both dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Calendar days from `b` to `a`, ignoring the time of day and daylight-saving shifts. */
export function differenceInCalendarDays(a: Date, b: Date) {
  const dayA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const dayB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((dayA - dayB) / DAY_MS)
}

const weekdayMonthDay = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const monthDayYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

/** "Monday, October 12" */
export function formatWeekdayMonthDay(date: Date) {
  return weekdayMonthDay.format(date)
}

/** "Oct 12" */
export function formatMonthDay(date: Date) {
  return monthDay.format(date)
}

/** "Oct 12, 2026" */
export function formatMonthDayYear(date: Date) {
  return monthDayYear.format(date)
}
