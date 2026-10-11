"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Blocks menubar. Desktop-style application menus in a hairline bar with
 * --control-radius corners. Triggers are quiet until hovered or open; menus
 * share every style with DropdownMenu and open flush with the trigger label.
 * Moving between open menus is instant.
 */

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-(--control-height-md) w-fit items-center gap-0.5 rounded-(--control-radius) border bg-background p-1",
        "data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup(props: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal(props: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "flex h-full min-h-(--control-height-xs) items-center gap-1.5 rounded-(--overlay-item-radius) px-3 text-label text-foreground outline-none select-none",
        "transition-colors duration-(--duration-fast) ease-standard",
        "hover:bg-accent focus-visible:bg-accent focus-visible:focus-ring data-popup-open:bg-accent",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -5,
  sideOffset = 9,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn("min-w-(--menu-min-width-lg)", className)}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      className={cn("group/menubar-item", className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem(
  props: React.ComponentProps<typeof DropdownMenuCheckboxItem>
) {
  return (
    <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
  )
}

function MenubarRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuRadioGroup>
) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem(
  props: React.ComponentProps<typeof DropdownMenuRadioItem>
) {
  return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />
}

function MenubarLabel(props: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />
}

function MenubarSeparator(
  props: React.ComponentProps<typeof DropdownMenuSeparator>
) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />
}

function MenubarShortcut(
  props: React.ComponentProps<typeof DropdownMenuShortcut>
) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}

function MenubarSub(props: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger(
  props: React.ComponentProps<typeof DropdownMenuSubTrigger>
) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />
}

function MenubarSubContent(
  props: React.ComponentProps<typeof DropdownMenuSubContent>
) {
  return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
