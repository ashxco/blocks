"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  navSections,
  sectionForPath,
  type NavGroup,
} from "@/components/viewer/nav"

/* A collapsible panel's height and fade, shared by sections and groups. */
const panelClass = cn(
  "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--duration-base) ease-out",
  "data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0"
)

/**
 * The viewer's navigation tree: Foundations and Components with collapsible
 * groups. Search lives above it, in the sidebar panel.
 */
export function SidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  // Explicit open/closed choices. Inside a section only the one holding the
  // current page starts open (on the overview, both do); groups start open.
  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({})
  const activeSection = sectionForPath(pathname)
  const sectionIds = React.useMemo(
    () => new Set<string>(navSections.map((s) => s.id)),
    []
  )

  // Moving into another section opens it, even if it was closed by hand.
  const [lastActive, setLastActive] = React.useState(activeSection)
  if (activeSection !== lastActive) {
    setLastActive(activeSection)
    if (activeSection) setOverrides((o) => ({ ...o, [activeSection]: true }))
  }

  const isOpen = (key: string) => {
    if (key in overrides) return overrides[key]
    return sectionIds.has(key) ? !activeSection || key === activeSection : true
  }
  const setOpen = (key: string, open: boolean) =>
    setOverrides((o) => ({ ...o, [key]: open }))

  return (
    <nav aria-label="Blocks" className={cn("grid gap-2", className)}>
      {navSections.map((section) => {
        const key = section.id
        const open = isOpen(key)
        return (
          <Collapsible.Root
            key={key}
            open={open}
            onOpenChange={(next) => setOpen(key, next)}
            data-nav-section=""
            className="grid"
          >
            <Collapsible.Trigger
              className={cn(
                "group/section flex h-9 w-full items-center justify-between rounded-(--overlay-item-radius) px-3 text-left text-label font-bold text-foreground outline-none",
                "transition-colors duration-(--duration-fast) hover:bg-accent focus-visible:focus-ring"
              )}
            >
              {section.title}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-4 -rotate-90 text-muted-foreground transition-transform duration-(--duration-base) ease-out group-data-[panel-open]/section:rotate-0"
              />
            </Collapsible.Trigger>
            <Collapsible.Panel className={panelClass}>
              <div className="grid gap-3 pt-1 pb-4">
                {section.groups.map((group, index) => (
                  <SidebarGroup
                    key={group.title ?? `${key}-${index}`}
                    group={group}
                    pathname={pathname}
                    open={isOpen(`${key}:${group.title ?? index}`)}
                    onOpenChange={(next) =>
                      setOpen(`${key}:${group.title ?? index}`, next)
                    }
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </Collapsible.Panel>
          </Collapsible.Root>
        )
      })}
    </nav>
  )
}

function SidebarGroup({
  group,
  pathname,
  open,
  onOpenChange,
  onNavigate,
}: {
  group: NavGroup
  pathname: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate?: () => void
}) {
  const links = (
    <ul className="ml-3 grid border-l">
      {group.items.map((item) => {
        const active = pathname === item.href
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              data-active={active || undefined}
              className={cn(
                "-ml-px flex min-h-8 items-center border-l py-1 pr-3 pl-5 text-label font-medium outline-none",
                "transition-colors duration-(--duration-fast) focus-visible:focus-ring",
                active
                  ? "border-brand font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (!group.title) return links

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      data-nav-group=""
      className="grid gap-1"
    >
      <Collapsible.Trigger
        className={cn(
          "group/group ml-3 flex h-7 items-center gap-1.5 rounded-xs pr-3 text-left text-caption font-semibold text-muted-foreground outline-none",
          "transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
        )}
      >
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5 -rotate-90 transition-transform duration-(--duration-base) ease-out group-data-[panel-open]/group:rotate-0"
        />
        {group.title}
      </Collapsible.Trigger>
      <Collapsible.Panel className={panelClass}>{links}</Collapsible.Panel>
    </Collapsible.Root>
  )
}
