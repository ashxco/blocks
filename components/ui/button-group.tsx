import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/separator"

/**
 * Blocks button group. Joins related buttons into one pill.
 *
 * Only the inner corners are squared, so the ends keep each child's own
 * radius (pill for buttons, control radius for inputs). Neighbours overlap
 * by one pixel so outline buttons share a single hairline, and the hovered
 * or focused child is lifted above its neighbours so its full border shows.
 * Separators sit between filled buttons without overlapping them.
 */
const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch",
    "*:hover:z-10 *:focus-visible:z-20",
    "has-[>[data-slot=button-group]]:gap-2",
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>[data-slot=input]]:flex-1 [&>input]:flex-1",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "[&>[data-slot]:has(~[data-slot])]:rounded-r-none [&>[data-slot]~[data-slot]]:rounded-l-none",
          "[&>[data-slot]~[data-slot]:not([data-slot=button-group-separator])]:-ml-px [&>[data-slot=button-group-separator]+[data-slot]]:ml-0!",
        ],
        vertical: [
          "flex-col",
          "[&>[data-slot]:has(~[data-slot])]:rounded-b-none [&>[data-slot]~[data-slot]]:rounded-t-none",
          "[&>[data-slot]~[data-slot]:not([data-slot=button-group-separator])]:-mt-px [&>[data-slot=button-group-separator]+[data-slot]]:mt-0!",
        ],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

/** Static text or an icon attached to the group, such as a prefix or a unit. */
function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-(--button-radius) border border-input bg-muted px-4 text-label whitespace-nowrap text-muted-foreground",
          "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

/** A hairline between filled buttons, as in a split button. */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
