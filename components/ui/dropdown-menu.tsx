"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

/**
 * Blocks dropdown menu. bg-popover with a crisp 1px border, --overlay-radius
 * and --overlay-padding, no shadow. Items are --overlay-item-height tall with
 * --overlay-item-radius; icons are muted until the item is highlighted.
 * Destructive items use text-destructive. Shortcuts are quiet, widely
 * tracked sans text, like Kbd.
 *
 * Context menu and menubar share these styles through `menuStyles`.
 *
 *   <DropdownMenu>
 *     <DropdownMenuTrigger render={<Button variant="outline" />}>Options</DropdownMenuTrigger>
 *     <DropdownMenuContent>…</DropdownMenuContent>
 *   </DropdownMenu>
 */

const itemBase = [
  "relative flex min-h-(--overlay-item-height) cursor-default items-center gap-2.5 rounded-(--overlay-item-radius) px-2.5 py-1.5",
  "text-sm font-medium text-popover-foreground outline-none select-none",
  "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "data-inset:pl-9",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "[&_svg:not([class*='text-'])]:text-muted-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground",
]

/** Class names shared by DropdownMenu, ContextMenu and Menubar. */
const menuStyles = {
  positioner: "isolate z-(--z-overlay) outline-none",
  popup: cn(
    "max-h-(--available-height) min-w-[max(var(--anchor-width),var(--menu-min-width))] origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain",
    "rounded-(--overlay-radius) border border-popover-border bg-popover p-(--overlay-padding) text-popover-foreground outline-none",
    "transition-[opacity,scale] duration-(--duration-base) ease-out",
    "data-starting-style:scale-98 data-starting-style:opacity-0",
    "data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast) data-ending-style:ease-in",
    "data-instant:transition-none"
  ),
  label:
    "flex items-center px-2.5 pt-2 pb-1 text-caption font-semibold text-muted-foreground data-inset:pl-9",
  item: cn(
    itemBase,
    "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive-subtle data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:[&_svg]:text-destructive!"
  ),
  subTrigger: cn(
    itemBase,
    "data-popup-open:bg-accent data-popup-open:text-accent-foreground"
  ),
  subTriggerIcon: "ml-auto size-4",
  checkableItem: cn(itemBase, "pr-9"),
  indicator:
    "pointer-events-none absolute right-2.5 flex size-4 items-center justify-center",
  separator: "-mx-(--overlay-padding) my-(--overlay-padding) h-px bg-border",
  // Sans like Kbd, so ⌘ and ⇧ draw at full size; the wide tracking spaces the keys apart.
  shortcut:
    "ml-auto pl-6 font-sans text-xs font-medium tracking-widest text-muted-foreground",
} as const

/**
 * Submenus open beside their trigger with a small gap. The offsets account for
 * --overlay-padding (6px) and the 1px border so the first item lines up with
 * the trigger.
 */
const submenuOffsets = { sideOffset: 10, alignOffset: -7 } as const

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <ScopedPortal portal={MenuPrimitive.Portal} data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  className,
  collisionAvoidance,
  collisionBoundary,
  container,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "collisionAvoidance" | "collisionBoundary"
  > & {
    /** Element to portal into instead of <body>, e.g. a preview stage. */
    container?: MenuPrimitive.Portal.Props["container"]
  }) {
  return (
    <ScopedPortal portal={MenuPrimitive.Portal} container={container}>
      <MenuPrimitive.Positioner
        className={menuStyles.positioner}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(menuStyles.popup, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </ScopedPortal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(menuStyles.label, className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn("group/dropdown-menu-item", menuStyles.item, className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(menuStyles.subTrigger, className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className={menuStyles.subTriggerIcon} />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = submenuOffsets.alignOffset,
  side = "inline-end",
  sideOffset = submenuOffsets.sideOffset,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("min-w-(--menu-min-width)", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset || undefined}
      className={cn(menuStyles.checkableItem, className)}
      checked={checked}
      {...props}
    >
      <span
        className={menuStyles.indicator}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="text-foreground" strokeWidth={2.5} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset || undefined}
      className={cn(menuStyles.checkableItem, className)}
      {...props}
    >
      <span
        className={menuStyles.indicator}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <span className="block size-2 rounded-full bg-foreground" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(menuStyles.separator, className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(menuStyles.shortcut, className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  menuStyles,
  submenuOffsets,
}
