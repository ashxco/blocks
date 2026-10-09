"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

/**
 * Blocks select. The trigger is a control (muted fill, input border, control
 * height and radius); the list is a flat overlay (popover surface, hairline
 * border, overlay radius) that fades in with a 4px slide. No shadows.
 *
 *   <Select items={regions} defaultValue="fra1">
 *     <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
 *     <SelectContent>
 *       {regions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
 *     </SelectContent>
 *   </Select>
 */
const Select = SelectPrimitive.Root

/**
 * Class recipes for the parts of the open list. The components below use
 * them, and they are exported for static pictures of an open list, such as
 * documentation that shows the groups without opening the popup.
 */
const selectStyles = {
  /** The list surface: popover colour, hairline border, overlay radius. */
  list: "rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding) text-popover-foreground outline-none",
  label: "flex h-8 items-end px-2.5 pb-1.5 text-caption font-semibold text-muted-foreground select-none",
  item: cn(
    "group/select-item relative flex min-h-(--overlay-item-height) w-full cursor-default items-center gap-2 rounded-(--overlay-item-radius) py-1.5 ps-2.5 pe-9 text-sm text-foreground outline-none select-none",
    "transition-colors duration-(--duration-instant) ease-standard",
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[selected]:font-semibold",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"
  ),
  itemText: "flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap",
  itemIndicator: "pointer-events-none absolute end-2.5 flex size-4 items-center justify-center",
  separator: "pointer-events-none -mx-(--overlay-padding) my-(--overlay-padding) h-px bg-border",
} as const

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-(--overlay-padding)", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "block min-w-0 flex-1 truncate text-start has-[svg]:flex has-[svg]:items-center has-[svg]:gap-2",
        className
      )}
      {...props}
    />
  )
}

/* Text sizes follow <Input>: 16px on phones in the default size (so iOS does
   not zoom on focus and the value matches inputs beside it), 14px from md. */
const triggerSize = {
  sm: "h-(--control-height-sm) ps-3 pe-2.5 text-sm",
  default: "h-(--control-height-md) ps-(--control-padding-x) pe-3 text-base md:text-sm",
  lg: "h-(--control-height-lg) ps-4 pe-3.5 text-base",
} as const

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group/select-trigger flex w-fit min-w-0 items-center justify-between gap-2 rounded-(--control-radius) border border-input bg-muted whitespace-nowrap text-foreground select-none",
        "transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
        "outline-none hover:border-foreground/25 focus-visible:border-ring focus-visible:focus-ring",
        "data-popup-open:border-foreground/30 data-popup-open:bg-background",
        "data-placeholder:text-muted-foreground",
        "aria-invalid:border-destructive data-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        triggerSize[size],
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        className="flex text-muted-foreground transition-transform duration-(--duration-base) ease-out group-data-popup-open/select-trigger:rotate-180"
      >
        <ChevronDownIcon className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  container,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    /** Element to portal into instead of <body>, e.g. a preview stage. */
    container?: SelectPrimitive.Portal.Props["container"]
  }) {
  return (
    <ScopedPortal portal={SelectPrimitive.Portal} container={container}>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-(--z-overlay) outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate max-h-[min(var(--available-height),--spacing(96))] w-max min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain",
            selectStyles.list,
            "duration-(--duration-base) ease-out data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=inline-start]:slide-in-from-right-1 data-[side=inline-end]:slide-in-from-left-1",
            "data-closed:data-[side=bottom]:slide-out-to-top-1 data-closed:data-[side=top]:slide-out-to-bottom-1",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot="select-list" className="outline-none">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </ScopedPortal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(selectStyles.label, className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectStyles.item, className)}
      {...props}
    >
      <SelectPrimitive.ItemText
        data-slot="select-item-text"
        className={selectStyles.itemText}
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        data-slot="select-item-indicator"
        render={
          <span className={selectStyles.itemIndicator} />
        }
      >
        <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(selectStyles.separator, className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex h-7 w-full cursor-default items-center justify-center bg-popover text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex h-7 w-full cursor-default items-center justify-center bg-popover text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectStyles,
}
