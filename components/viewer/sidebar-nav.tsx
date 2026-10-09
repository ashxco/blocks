"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { navSections, sectionForPath, type NavGroup, type NavSection } from "@/components/viewer/nav"

function matches(query: string, ...fields: (string | undefined)[]) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((f) => f?.toLowerCase().includes(q))
}

function filterSection(section: NavSection, query: string): NavSection | null {
  if (!query.trim()) return section
  const groups: NavGroup[] = section.groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => matches(query, i.title, g.title, section.title)),
    }))
    .filter((g) => g.items.length > 0)
  return groups.length ? { ...section, groups } : null
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

/**
 * The viewer's navigation tree: a filter, then Foundations, Components,
 * Molecules and Templates with collapsible groups. Used by the desktop
 * sidebar and the mobile menu.
 */
export function SidebarNav({
  onNavigate,
  autoFocusFilter = false,
  className,
}: {
  onNavigate?: () => void
  autoFocusFilter?: boolean
  className?: string
}) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  // Explicit open/closed choices. Sections default to open only when they
  // hold the current page; groups inside a section default to open.
  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({})
  const filterRef = React.useRef<HTMLInputElement>(null)
  const filtering = query.trim().length > 0

  const sections = React.useMemo(
    () => navSections.map((s) => filterSection(s, query)).filter((s): s is NavSection => s !== null),
    [query]
  )

  // "/" focuses the filter, like most docs sites.
  React.useEffect(() => {
    if (autoFocusFilter) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      const input = filterRef.current
      if (!input || input.offsetParent === null) return
      event.preventDefault()
      input.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [autoFocusFilter])

  const activeSection = sectionForPath(pathname)
  const sectionIds = React.useMemo(() => new Set<string>(navSections.map((s) => s.id)), [])

  // Moving into another section opens it, even if it was closed by hand.
  const [lastActive, setLastActive] = React.useState(activeSection)
  if (activeSection !== lastActive) {
    setLastActive(activeSection)
    if (activeSection) setOverrides((o) => ({ ...o, [activeSection]: true }))
  }

  const isOpen = (key: string) => {
    if (filtering) return true
    if (key in overrides) return overrides[key]
    return sectionIds.has(key) ? key === activeSection : true
  }
  const setOpen = (key: string, open: boolean) => setOverrides((o) => ({ ...o, [key]: open }))

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={filterRef}
          type="search"
          value={query}
          autoFocus={autoFocusFilter}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && query) {
              e.preventDefault()
              setQuery("")
            }
          }}
          placeholder="Filter"
          aria-label="Filter navigation"
          className={cn(
            "h-(--control-height-sm) w-full rounded-(--control-radius) border border-transparent bg-muted pr-9 pl-9 text-label font-medium text-foreground",
            "transition-colors duration-(--duration-fast) outline-none placeholder:text-muted-foreground",
            "hover:border-input focus-visible:border-ring focus-visible:focus-ring [&::-webkit-search-cancel-button]:appearance-none"
          )}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              filterRef.current?.focus()
            }}
            aria-label="Clear filter"
            className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-xs text-muted-foreground outline-none hover:text-foreground focus-visible:focus-ring"
          >
            <XIcon className="size-3.5" />
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 grid h-5 min-w-5 -translate-y-1/2 place-items-center rounded-xs border bg-background px-1 font-mono text-xs text-muted-foreground"
          >
            /
          </kbd>
        )}
      </div>

      {sections.length === 0 ? (
        <p className="px-3 text-caption text-muted-foreground">
          Nothing matches “{query.trim()}”. Try a component name such as “dialog”.
        </p>
      ) : (
        <nav aria-label="Blocks" className="grid gap-2">
          {sections.map((section) => {
            const key = section.id
            const open = isOpen(key)
            return (
              <Collapsible.Root
                key={key}
                open={open}
                onOpenChange={(next) => setOpen(key, next)}
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
                <Collapsible.Panel
                  className={cn(
                    "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--duration-base) ease-out",
                    "data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0"
                  )}
                >
                  <div className="grid gap-3 pt-1 pb-4">
                    {section.groups.map((group, index) => (
                      <SidebarGroup
                        key={group.title ?? `${key}-${index}`}
                        group={group}
                        pathname={pathname}
                        open={isOpen(`${key}:${group.title ?? index}`)}
                        onOpenChange={(next) => setOpen(`${key}:${group.title ?? index}`, next)}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </Collapsible.Panel>
              </Collapsible.Root>
            )
          })}
        </nav>
      )}
    </div>
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
    <Collapsible.Root open={open} onOpenChange={onOpenChange} className="grid gap-1">
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
      <Collapsible.Panel
        className={cn(
          "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--duration-base) ease-out",
          "data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0"
        )}
      >
        {links}
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}
