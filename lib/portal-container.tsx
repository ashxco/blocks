"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import type { ThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"

/**
 * Where overlays portal to.
 *
 * Menus, popovers, selects, tooltips, dialogs, sheets and drawers render
 * through a Base UI Portal, by default into <body>. That keeps them clear of
 * overflow and transforms, but it also takes them out of any mode or theme
 * scope (`.dark` / `.light`, `data-theme`) around their trigger. Every overlay wrapper in
 * components/ui resolves its portal container with usePortalContainer, so:
 *
 *   1. a `container` prop on the overlay wins (e.g. a preview stage);
 *   2. otherwise the nearest <PortalScope> or <PortalContainerProvider>;
 *   3. otherwise Base UI's default: the parent overlay's portal node, then <body>.
 *
 * Overlays nested inside an overlay (a submenu, a select in a dialog) always
 * follow their parent, so focus trapping and outside-press detection keep
 * working; they inherit the parent's scope that way.
 *
 *   <PortalScope className="dark">
 *     <DropdownMenu>…</DropdownMenu>   // the menu opens dark on a light page
 *   </PortalScope>
 *
 *   <PortalScope theme="mono" className="dark">…</PortalScope>   // and in the mono theme
 */
export type PortalContainer =
  | HTMLElement
  | ShadowRoot
  | null
  | React.RefObject<HTMLElement | ShadowRoot | null>

const PortalContainerContext = React.createContext<PortalContainer | undefined>(undefined)

/**
 * Overlays rendered inside portal into `container`. `null` makes them wait
 * until a container is set; `undefined` restores the default.
 */
export function PortalContainerProvider({
  container,
  children,
}: {
  container: PortalContainer | undefined
  children: React.ReactNode
}) {
  return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>
}

/**
 * For overlay wrappers: the container to pass to a Base UI Portal. Returns the
 * explicit container when there is one, else the nearest provider's.
 */
export function usePortalContainer(container?: PortalContainer): PortalContainer | undefined {
  const fromContext = React.useContext(PortalContainerContext)
  return container !== undefined ? container : fromContext
}

/**
 * For overlay wrappers: wrap the children of a Base UI Portal in this, so
 * overlays nested inside fall back to Base UI's default (the parent's portal
 * node) instead of the outer container.
 */
export function PortalContainerReset({ children }: { children?: React.ReactNode }) {
  return <PortalContainerContext.Provider value={undefined}>{children}</PortalContainerContext.Provider>
}

type PortalProps = { container?: PortalContainer; children?: React.ReactNode }

/**
 * For overlay wrappers: renders a Base UI Portal (`portal`) with its
 * container resolved by usePortalContainer, and resets the context inside so
 * nested overlays follow their parent. Other props go to the Portal.
 *
 *   <ScopedPortal portal={PopoverPrimitive.Portal} container={container}>…</ScopedPortal>
 */
export function ScopedPortal<P extends PortalProps>({
  portal: Portal,
  container,
  children,
  ...props
}: P & { portal: React.ComponentType<P> }) {
  const resolved = usePortalContainer(container)
  const portalProps = { ...props, container: resolved } as unknown as P
  return (
    <Portal {...portalProps}>
      <PortalContainerReset>{children}</PortalContainerReset>
    </Portal>
  )
}

const subscribe = () => () => {}

/**
 * Gives every overlay opened inside it a body-level portal container that
 * carries `className`, typically a mode scope ("dark" or "light"), and
 * `theme` as its data-theme. Without either it changes nothing. Use it around
 * any region whose mode or theme differs from the page, such as a `.dark`
 * preview on a light page or a ThemeScope showing another theme.
 */
export function PortalScope({
  className,
  theme,
  children,
}: {
  className?: string
  /** A theme preset id for the overlays (data-theme on the container). */
  theme?: ThemeId
  children: React.ReactNode
}) {
  const outer = React.useContext(PortalContainerContext)
  const [node, setNode] = React.useState<HTMLDivElement | null>(null)
  const scoped = Boolean(className || theme)
  const hydrated = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  return (
    // Until the scope element exists, overlays wait (null) rather than open in
    // <body>. Without a className or theme the outer container passes through;
    // the provider stays either way, so toggling the scope never remounts children.
    <PortalContainerProvider container={scoped ? node : outer}>
      {children}
      {hydrated && scoped
        ? createPortal(
            <div ref={setNode} data-slot="portal-scope" data-theme={theme} className={cn(className, "text-copy")} />,
            document.body
          )
        : null}
    </PortalContainerProvider>
  )
}
