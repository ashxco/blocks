import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Blocks accordion. Hairline-separated rows with bold titles. The plus in a
 * round tile turns ink and rotates into a cross when its row is open; the
 * panel reveals with a height transition.
 *
 * - `variant="default"`: open rows between hairlines.
 * - `variant="contained"`: the same rows inside a bordered, rounded box.
 */
const accordionVariants = cva("group/accordion flex w-full flex-col", {
  variants: {
    variant: {
      default: "",
      contained:
        "overflow-hidden rounded-(--card-radius) border border-border bg-card px-(--card-padding)",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Accordion({
  className,
  variant = "default",
  ...props
}: AccordionPrimitive.Root.Props & VariantProps<typeof accordionVariants>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-border not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between gap-6 rounded-xs py-5 text-left text-title text-foreground outline-none select-none",
          "focus-visible:focus-ring data-disabled:pointer-events-none data-disabled:opacity-50",
          "[&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className={cn(
            "pointer-events-none ml-auto grid size-7 shrink-0 place-items-center rounded-(--button-radius-xs) border border-border-strong text-foreground",
            "transition-[background-color,border-color,color] duration-(--duration-base) ease-out",
            "group-hover/accordion-trigger:border-foreground",
            "group-data-panel-open/accordion-trigger:border-primary group-data-panel-open/accordion-trigger:bg-primary group-data-panel-open/accordion-trigger:text-primary-foreground"
          )}
        >
          {/* Only the plus turns into a cross, so the shape keeps its corners in every theme. */}
          <PlusIcon
            className="size-3.5 transition-[rotate] duration-(--duration-base) ease-out group-data-panel-open/accordion-trigger:rotate-45"
            strokeWidth={2.25}
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-body text-copy",
        "transition-[height,opacity] duration-(--duration-base) ease-out",
        "data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0"
      )}
      {...props}
    >
      <div
        className={cn(
          "pb-5 sm:pr-13",
          "[&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand [&>*:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
