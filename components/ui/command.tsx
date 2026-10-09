"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/components/viewer/cn"
import { CheckIcon, SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Blocks command menu, on cmdk.
 *
 * A large search row with a hairline under it, grouped results in flat rows,
 * keyboard hints on the right and an optional footer of key hints. The
 * highlighted row fills with accent; nothing glows or casts a shadow.
 * Use it inline (add a border), in a popover, or in CommandDialog for ⌘K.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-(--overlay-radius) bg-popover text-popover-foreground outline-none",
        "in-data-[slot=dialog-content]:rounded-none in-data-[slot=popover-content]:rounded-none",
        className
      )}
      {...props}
    />
  )
}

/** True when the children already include a <Command> root. */
function hasCommandRoot(children: React.ReactNode) {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === Command || child.type === CommandPrimitive)
  )
}

/**
 * A command menu in a dialog, placed in the upper third of the screen.
 * Children may be wrapped in <Command> (to pass props such as `loop`) or be
 * the parts directly; a <Command> root is added when it is missing.
 */
function CommandDialog({
  title = "Command menu",
  description = "Search for a command, then press Enter to run it.",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        data-variant="command"
        className={cn(
          "top-[min(14vh,8rem)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-144",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {hasCommandRoot(children) ? children : <Command>{children}</Command>}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        "group/command-input flex h-14 shrink-0 items-center gap-3 border-b border-border px-4",
        "in-data-[slot=popover-content]:h-(--control-height-md) in-data-[slot=popover-content]:gap-2.5 in-data-[slot=popover-content]:px-3.5"
      )}
    >
      <SearchIcon
        aria-hidden="true"
        className={cn(
          "size-5 shrink-0 text-muted-foreground transition-colors duration-(--duration-fast) ease-standard",
          "group-focus-within/command-input:text-foreground in-data-[slot=popover-content]:size-4"
        )}
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground",
          "in-data-[slot=popover-content]:text-sm",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-80 scroll-py-(--overlay-padding) overflow-x-hidden overflow-y-auto overscroll-contain p-(--overlay-padding) outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "px-4 py-10 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground",
        "**:[[cmdk-group-heading]]:flex **:[[cmdk-group-heading]]:h-8 **:[[cmdk-group-heading]]:items-end **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:pb-1.5 **:[[cmdk-group-heading]]:text-caption **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:select-none",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        "-mx-(--overlay-padding) my-(--overlay-padding) h-px bg-border",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex min-h-(--overlay-item-height) cursor-default items-center gap-3 rounded-(--overlay-item-radius) px-2.5 py-1.5 text-sm text-foreground outline-none select-none",
        "in-data-[slot=dialog-content]:min-h-10 in-data-[slot=dialog-content]:px-3",
        "transition-colors duration-(--duration-instant) ease-standard",
        "data-selected:bg-accent data-selected:text-accent-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        "data-selected:[&_svg:not([class*='text-'])]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon
        aria-hidden="true"
        data-slot="command-item-check"
        strokeWidth={2.5}
        className="ms-auto hidden text-foreground group-data-[checked=true]/command-item:block"
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto flex shrink-0 items-center gap-1 font-mono text-xs tracking-wide text-muted-foreground",
        "group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** A strip under the list for key hints: <Kbd>↵</Kbd> Open, <Kbd>Esc</Kbd> Close. */
function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex h-11 shrink-0 items-center gap-4 border-t border-border px-4 text-caption text-muted-foreground",
        "[&>span]:flex [&>span]:items-center [&>span]:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandFooter,
}
