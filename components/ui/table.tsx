"use client"

import * as React from "react"
import { cn } from "cn"

/**
 * Blocks table. Hairline rows, quiet caption-sized headers and comfortable
 * rows from --table-row-height. Numbers use tabular figures so columns line up.
 *
 * - variant="plain" (default) sits directly on the page.
 * - variant="card" wraps the table in a bordered card with a tinted header.
 * - size="sm" tightens rows to the control height for dense app views.
 *
 * Right-align numeric columns with className="text-right" on both the head
 * and the cells.
 */
function Table({
  className,
  variant = "plain",
  size = "default",
  ...props
}: React.ComponentProps<"table"> & {
  variant?: "plain" | "card"
  size?: "default" | "sm"
}) {
  return (
    <div
      data-slot="table-container"
      data-variant={variant}
      className={cn(
        "relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-transparent",
        variant === "card" && "rounded-(--card-radius) border border-border bg-card"
      )}
    >
      <table
        data-slot="table"
        data-variant={variant}
        data-size={size}
        className={cn(
          "group/table w-full caption-bottom border-collapse text-left text-sm text-foreground tabular-nums",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-border",
        "group-data-[variant=card]/table:bg-subtle",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-subtle font-semibold text-foreground [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors duration-(--duration-fast) ease-standard",
        // Only body rows react to the pointer.
        "in-data-[slot=table-body]:hover:bg-subtle in-data-[slot=table-body]:has-aria-expanded:bg-subtle",
        "data-[state=selected]:bg-accent aria-selected:bg-accent",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      // The type role sits outside cn(): cn reads text-caption as a colour and
      // would drop it next to text-muted-foreground.
      className={`text-caption ${cn(
        "h-11 px-4 text-left align-middle font-semibold whitespace-nowrap text-muted-foreground",
        "group-data-[size=sm]/table:h-9 group-data-[size=sm]/table:px-3",
        "[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        "[&_svg:not([class*='size-'])]:size-3.5",
        className
      )}`}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-(--table-row-height) px-4 align-middle whitespace-nowrap",
        "group-data-[size=sm]/table:h-(--control-height-md) group-data-[size=sm]/table:px-3",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={`text-caption ${cn(
        "mt-4 text-left text-muted-foreground group-data-[variant=card]/table:mb-4 group-data-[variant=card]/table:px-4",
        className
      )}`}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
