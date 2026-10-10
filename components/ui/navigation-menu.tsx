import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScopedPortal } from "@/lib/portal-container"

/**
 * Blocks navigation menu. Triggers in the button radius and the label role; dropdown panels
 * on bg-popover with a hairline border, no shadow. The panel resizes and
 * slides between items as the pointer moves along the bar.
 *
 * Top-level links use the trigger style:
 *   <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/pricing" />}>
 *     Pricing
 *   </NavigationMenuLink>
 *
 * This module is deliberately not "use client". It holds no hooks or state:
 * every part renders a Base UI client component or ScopedPortal, and those
 * travel from a server component as client references. So a server component
 * can render the menu and also call navigationMenuTriggerStyle(), which a
 * "use client" module would turn into a client reference it cannot call.
 */
function NavigationMenu({
  align = "start",
  collisionAvoidance,
  collisionBoundary,
  container,
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align" | "collisionAvoidance" | "collisionBoundary"> & {
    /** Element to portal the panel into instead of <body>, e.g. a preview stage. */
    container?: NavigationMenuPrimitive.Portal.Props["container"]
  }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner
        align={align}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        container={container}
      />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva([
  "group/navigation-menu-trigger inline-flex h-(--button-height-sm) w-max items-center justify-center gap-1 rounded-(--button-radius-sm) px-(--button-padding-x-sm)",
  "text-label text-copy outline-none select-none",
  "transition-[background-color,color] duration-(--duration-fast) ease-standard",
  "hover:bg-accent hover:text-foreground focus-visible:focus-ring",
  "data-popup-open:bg-accent data-popup-open:text-foreground",
  "data-active:text-foreground aria-[current=page]:text-foreground",
  "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg:not([class*='size-'])]:size-4",
])

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "pr-2.5", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="size-3.5 text-muted-foreground transition-transform duration-(--duration-base) ease-out group-hover/navigation-menu-trigger:text-foreground group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:text-foreground"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-(--overlay-padding)",
        "transition-[opacity,translate] duration-(--duration-base) ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "data-starting-style:data-[activation-direction=left]:-translate-x-4 data-starting-style:data-[activation-direction=right]:translate-x-4",
        "data-ending-style:data-[activation-direction=left]:translate-x-4 data-ending-style:data-[activation-direction=right]:-translate-x-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 10,
  align = "start",
  alignOffset = 0,
  container,
  ...props
}: NavigationMenuPrimitive.Positioner.Props & {
  container?: NavigationMenuPrimitive.Portal.Props["container"]
}) {
  return (
    <ScopedPortal portal={NavigationMenuPrimitive.Portal} container={container}>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-(--z-overlay) h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
          "transition-[top,left,right,bottom] duration-(--duration-base) ease-out data-instant:transition-none",
          // Bridge the gap so the pointer can travel from trigger to panel.
          "before:absolute before:inset-x-0 data-[side=bottom]:before:-top-2.5 data-[side=bottom]:before:h-2.5 data-[side=top]:before:-bottom-2.5 data-[side=top]:before:h-2.5",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-popup"
          className={cn(
            "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden",
            "rounded-(--overlay-radius) border border-popover-border bg-popover text-popover-foreground outline-none",
            "transition-[opacity,scale,width,height] duration-(--duration-base) ease-out",
            "data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0"
          )}
        >
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className="relative size-full overflow-hidden"
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </ScopedPortal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-3 rounded-(--overlay-item-radius) p-3 text-label text-foreground outline-none",
        "transition-colors duration-(--duration-fast) ease-standard",
        "hover:bg-accent focus-visible:bg-accent focus-visible:focus-ring data-active:bg-accent",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden transition-opacity duration-(--duration-base) ease-out",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-xs border-t border-l border-popover-border bg-popover" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
