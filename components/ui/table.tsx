"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Blocks table. Hairline rows, quiet caption-sized headers and comfortable
 * rows from --table-row-height. Numbers use tabular figures so columns line up.
 *
 * - variant="plain" (default) sits directly on the page.
 * - variant="card" wraps the table in a bordered card with a tinted header.
 * - size="sm" tightens rows to --table-row-height-sm for dense app views.
 *
 * Right-align numeric columns with className="text-right" on both the head
 * and the cells.
 *
 * A table wider than its slot scrolls sideways. While there is more to see,
 * a plain table shows a hairline on that edge, so a column cut at the edge
 * reads as the start of more content rather than a clipped layout. The
 * caption stays put and wraps to the visible width.
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
  const containerRef = React.useRef<HTMLDivElement>(null)
  const overflow = useScrollEdges(containerRef)

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      data-variant={variant}
      data-overflow-start={overflow.start || undefined}
      data-overflow-end={overflow.end || undefined}
      style={
        overflow.width
          ? ({
              "--table-visible-width": `${overflow.width}px`,
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "relative w-full [scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent] overflow-x-auto overscroll-x-contain",
        variant === "card"
          ? "rounded-(--card-radius) border border-border bg-card"
          : "border-border data-overflow-end:border-r data-overflow-start:border-l"
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

/** Whether a horizontal scroller has more content before or after what it shows, and how wide it is. */
function useScrollEdges(ref: React.RefObject<HTMLElement | null>) {
  const [edges, setEdges] = React.useState({
    start: false,
    end: false,
    width: 0,
  })

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const scrolled = Math.abs(element.scrollLeft)
      const start = scrolled > 1
      const end = element.scrollWidth - element.clientWidth - scrolled > 1
      const width = element.clientWidth
      setEdges((prev) =>
        prev.start === start && prev.end === end && prev.width === width
          ? prev
          : { start, end, width }
      )
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    element.addEventListener("scroll", update, { passive: true })
    return () => {
      observer.disconnect()
      element.removeEventListener("scroll", update)
    }
  }, [ref])

  return edges
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
        "aria-selected:bg-accent data-[state=selected]:bg-accent",
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
      className={cn(
        "h-(--control-height-md) px-4 text-left align-middle text-caption font-semibold whitespace-nowrap text-muted-foreground",
        "group-data-[size=sm]/table:h-(--control-height-sm) group-data-[size=sm]/table:px-3",
        "[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        "[&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
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
        "group-data-[size=sm]/table:h-(--table-row-height-sm) group-data-[size=sm]/table:px-3",
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
      className={cn(
        // Sticky and as wide as the visible part of the table, so it wraps
        // instead of scrolling away with a wide table.
        "sticky left-0 mt-4 max-w-(--table-visible-width) text-left text-caption whitespace-normal text-muted-foreground",
        "group-data-[variant=card]/table:mb-4 group-data-[variant=card]/table:px-4",
        className
      )}
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
