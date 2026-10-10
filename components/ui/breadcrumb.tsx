import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { MoreHorizontalIcon, SlashIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Blocks breadcrumb. Muted links in the label role, the current page in full
 * ink, and a quiet slash between them. The trail stays on one line: when it
 * runs out of room, the links before the current page shorten with an
 * ellipsis, so a separator never dangles at the end of a line.
 *
 * Render links with your router:
 *   <BreadcrumbLink render={<Link href="/projects" />}>Projects</BreadcrumbLink>
 */
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex min-w-0 flex-nowrap items-center gap-x-1 text-label whitespace-nowrap text-muted-foreground sm:gap-x-2",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        // The current page keeps its full name unless it alone is wider than the trail.
        "has-data-[slot=breadcrumb-page]:max-w-full has-data-[slot=breadcrumb-page]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

/** Wraps text in a span that can shorten with an ellipsis; icons stay whole. */
function truncatable(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span className="min-w-0 truncate">{child}</span>
    ) : (
      child
    )
  )
}

function BreadcrumbLink({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        children: truncatable(children),
        className: cn(
          "inline-flex min-w-0 items-center gap-1.5 rounded-xs text-muted-foreground underline-offset-4 outline-none",
          "transition-colors duration-(--duration-fast) ease-standard",
          "hover:text-foreground focus-visible:focus-ring",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {truncatable(children)}
    </span>
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center text-border-strong [&>svg]:size-3.5 [&>svg]:-rotate-12",
        className
      )}
      {...props}
    >
      {children ?? <SlashIcon strokeWidth={2} />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-(--button-height-xs) items-center justify-center rounded-(--button-radius-xs) text-muted-foreground [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
