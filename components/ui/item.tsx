import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * Blocks item: a row with media, content and actions.
 *
 * ItemGroup lays rows out three ways:
 * - `variant="default"`: a stack with a small gap, for outline or muted items.
 * - `variant="divided"`: hairline rows that line up with the text around them.
 * - `variant="contained"`: hairline rows inside a bordered, rounded list.
 *
 * Render an item as a link to make the whole row interactive:
 *   <Item render={<Link href="/projects/web" />}>…</Item>
 */
/* Rows in divided and contained groups: no box, one hairline between them.
   Set from the group so it wins over each item's own transparent border. */
const groupRows = [
  "*:data-[slot=item]:rounded-none *:data-[slot=item]:border-0",
  "[&>[data-slot=item]:not(:last-child)]:border-b [&>[data-slot=item]:not(:last-child)]:border-border",
]

const itemGroupVariants = cva("group/item-group flex w-full flex-col", {
  variants: {
    variant: {
      default: "gap-2",
      divided: [
        ...groupRows,
        "*:data-[slot=item]:px-0",
        // Rows touch the text edge, so links underline their title instead of filling.
        "*:data-[slot=item]:[a]:hover:bg-transparent [&>a[data-slot=item]:hover_[data-slot=item-title]]:underline",
      ],
      contained: [
        ...groupRows,
        "overflow-hidden rounded-(--card-radius) border border-border bg-card",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function ItemGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemGroupVariants>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      data-variant={variant}
      className={cn(itemGroupVariants({ variant }), className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-1", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  [
    "group/item flex w-full flex-wrap items-center rounded-(--control-radius) border text-left text-body",
    "transition-colors duration-(--duration-fast) ease-standard outline-none focus-visible:focus-ring",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 [a]:hover:bg-accent [button]:hover:bg-accent",
    "aria-[current=page]:bg-accent data-selected:bg-accent",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline:
          "border-border bg-card [a]:hover:border-border-strong [button]:hover:border-border-strong",
        muted:
          "border-transparent bg-subtle [a]:hover:bg-muted [button]:hover:bg-muted",
      },
      size: {
        default: "gap-4 px-4 py-3.5",
        sm: "gap-3 px-3 py-2.5",
        xs: "gap-2.5 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
        icon: [
          "size-10 rounded-(--control-radius) border border-border bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4.5",
          "group-data-[size=sm]/item:size-9 group-data-[size=sm]/item:[&_svg:not([class*='size-'])]:size-4",
          "group-data-[size=xs]/item:size-7 group-data-[size=xs]/item:rounded-xs group-data-[size=xs]/item:[&_svg:not([class*='size-'])]:size-3.5",
        ],
        image: [
          "size-12 overflow-hidden rounded-(--control-radius) bg-muted [&_img]:size-full [&_img]:object-cover",
          "group-data-[size=sm]/item:size-10 group-data-[size=xs]/item:size-8 group-data-[size=xs]/item:rounded-sm",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit max-w-full items-center gap-2 text-title text-foreground underline-offset-4",
        "group-data-[size=sm]/item:text-label group-data-[size=xs]/item:text-label",
        // The label role sets no font, so the smaller titles return to the body face.
        "group-data-[size=sm]/item:font-sans group-data-[size=xs]/item:font-sans",
        "[&>span:not([data-slot])]:truncate",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-sm text-muted-foreground group-data-[size=xs]/item:text-caption",
        "[&>a]:font-semibold [&>a]:text-foreground [&>a]:underline-offset-4 [&>a:hover]:underline",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2 text-caption text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
