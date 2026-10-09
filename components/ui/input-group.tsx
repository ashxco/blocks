"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

/**
 * Blocks input group. One filled control (the same surface as <Input>) that
 * holds an input or textarea plus addons: icons, text, keys or small
 * buttons. The whole group takes the focus border and outline when its
 * control is focused.
 *
 *   <InputGroup>
 *     <InputGroupAddon><SearchIcon /></InputGroupAddon>
 *     <InputGroupInput placeholder="Search deployments" />
 *   </InputGroup>
 */
const inputGroupVariants = cva(
  [
    "group/input-group relative flex w-full min-w-0 items-center rounded-(--control-radius) border border-input bg-muted text-foreground",
    "outline-none transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
    "hover:border-foreground/25",
    // Focus: the group carries the focus state of its control.
    "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:bg-background has-[[data-slot=input-group-control]:focus-visible]:focus-ring",
    // Invalid
    "has-[[data-slot][aria-invalid=true]]:border-destructive! has-[[data-slot][aria-invalid=true]]:outline-destructive!",
    "group-data-[invalid=true]/field:border-destructive! group-data-[invalid=true]/field:outline-destructive!",
    // Disabled (only when the control itself is disabled, not an addon button)
    "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50",
    // Read-only values sit on the canvas, like a read-only <Input>.
    "has-[[data-slot=input-group-control][readonly]]:bg-background",
    // Inside a combobox popup the popup already frames the search field.
    "in-data-[slot=combobox-content]:outline-none! in-data-[slot=combobox-content]:focus-within:border-inherit",
    // Block addons and textareas stack vertically and grow.
    "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col",
    "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
    "has-[>textarea]:h-auto",
    // Inline addons tighten the control's padding on their side.
    "has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2",
    // Text prefixes and suffixes read as part of the value, so they sit closer.
    "has-[>[data-align=inline-start]>[data-slot=input-group-text]]:[&>input]:pl-1 has-[>[data-align=inline-end]>[data-slot=input-group-text]]:[&>input]:pr-1",
    "has-[>[data-align^=block]]:[&>input]:h-(--control-height-sm)",
  ],
  {
    variants: {
      size: {
        sm: "h-(--control-height-sm) [&>input]:px-3 [&>input]:text-sm",
        default: "h-(--control-height-md)",
        lg: "h-(--control-height-lg) [&>input]:text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function InputGroup({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      data-size={size}
      role="group"
      className={cn(inputGroupVariants({ size }), className)}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto cursor-text items-center justify-center gap-2 text-sm font-medium text-muted-foreground select-none",
    "group-has-[[data-slot=input-group-control]:disabled]/input-group:pointer-events-none",
    "[&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
    "[&>kbd]:rounded-xs",
  ],
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-(--control-padding-x) has-[>button]:pl-2 has-[>kbd]:pl-2 has-[>[data-size=icon-sm]]:pl-1 has-[>[data-size=sm]]:pl-1",
        "inline-end":
          "order-last pr-(--control-padding-x) has-[>button]:pr-2 has-[>kbd]:pr-2 has-[>[data-size=icon-sm]]:pr-1 has-[>[data-size=sm]]:pr-1",
        "block-start":
          "order-first w-full justify-start px-(--control-padding-x) pt-3 [.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-(--control-padding-x) pb-3 has-[>button]:pr-2 has-[>button]:pb-2 [.border-t]:pt-3 has-[>button]:[.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus()
      }}
      {...props}
    />
  )
}

/**
 * A small button inside an addon. Sizes map to the button tokens: `xs` and
 * `icon-xs` (28px) fit every group size; `sm` and `icon-sm` (36px) suit
 * medium and large groups.
 */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> & {
  size?: "xs" | "sm" | "icon-xs" | "icon-sm"
  type?: "button" | "submit" | "reset"
}) {
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex items-center gap-2 text-sm font-medium whitespace-nowrap text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input-group-control"
      className={cn(
        "w-full min-w-0 flex-1 self-stretch rounded-none border-0 bg-transparent px-(--control-padding-x)",
        "text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm",
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        "flex field-sizing-content min-h-24 w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent",
        "px-(--control-padding-x) py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground md:text-sm md:leading-relaxed",
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
