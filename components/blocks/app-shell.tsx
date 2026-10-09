"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { appNav, isNavActive } from "@/components/blocks/app-shell/nav"
import { AppShellDemo } from "@/components/blocks/app-shell/demo"
import {
  CommandMenu,
  CommandMenuButton,
} from "@/components/blocks/command-menu"
import { Notifications } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

export {
  appNav,
  isNavActive,
  type AppNavItem,
} from "@/components/blocks/app-shell/nav"

export interface AppShellProps {
  /** Page content. Rendered inside a wide container. Leave out to see a sample dashboard. */
  children?: React.ReactNode
  /** Title in the top bar. Defaults to the active navigation item. */
  title?: string
  /**
   * The navigation item to highlight, by href ("/live/app/projects").
   * Defaults to the item that matches the URL. In previews, where the URL is
   * the docs page, it falls back to the item named by `title`, then the first.
   */
  activeHref?: string
  /**
   * Contain the shell in its parent instead of the viewport, for docs and
   * previews. Give it a height through className (defaults to 44rem).
   */
  preview?: boolean
  /** Open search with Cmd+K or Ctrl+K. Turn off when the page already uses that shortcut. */
  hotkey?: boolean
  className?: string
}

const workspaces = [
  { id: "acme", name: "Acme Inc.", plan: "Pro plan", initial: "A" },
  { id: "northwind", name: "Northwind Labs", plan: "Team plan", initial: "N" },
  { id: "personal", name: "Maya Chen", plan: "Hobby plan", initial: "M" },
]

const recentProjects = [
  { name: "web", status: "Ready", dot: "bg-success" },
  { name: "api", status: "Failed", dot: "bg-destructive" },
  { name: "dashboard", status: "Building", dot: "bg-warning" },
]

/** Lumen wordmark: an ink tile with a violet point of light. */
export function LumenWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid size-6.5 shrink-0 place-items-center rounded-sm bg-primary"
      >
        <span className="size-2.5 rounded-full bg-brand" />
      </span>
      <span className="text-h4 font-extrabold text-foreground group-data-[collapsible=icon]:hidden">
        Lumen
      </span>
    </span>
  )
}

function NavLinks({ currentPath }: { currentPath: string | null }) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenu className="gap-0.5">
      {appNav.map((item) => {
        const active = isNavActive(currentPath, item)
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              tooltip={item.title}
              aria-current={active ? "page" : undefined}
              render={
                <Link
                  href={item.href}
                  onClick={() => isMobile && setOpenMobile(false)}
                />
              }
              className="h-(--control-height-sm) gap-3 px-2.5 text-muted-foreground hover:text-foreground data-active:bg-sidebar-accent data-active:text-foreground data-active:[&>svg]:text-brand"
            >
              <item.icon />
              <span className="text-label">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function RecentProjects() {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <span className="text-caption font-semibold text-muted-foreground">
          Recent projects
        </span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {recentProjects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton
                render={
                  <Link
                    href="/live/app/projects"
                    onClick={() => isMobile && setOpenMobile(false)}
                  />
                }
                className="h-(--control-height-xs) gap-3 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="grid size-4 place-items-center"
                >
                  <span className={cn("size-1.5 rounded-full", project.dot)} />
                </span>
                <span className="font-mono text-xs">{project.name}</span>
                <span className="sr-only">, {project.status}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

/** Build minutes this cycle. Matches the billing page and Pro on the pricing page. */
const buildMinutes = { used: 7240, limit: 10_000 }

function UsagePanel() {
  const format = (value: number) => value.toLocaleString("en-US")
  return (
    <div className="grid gap-3 rounded-lg bg-panel p-(--card-padding-sm) text-panel-foreground group-data-[collapsible=icon]:hidden">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-caption font-semibold text-panel-foreground">
          Build minutes
        </p>
        <p className="text-caption text-panel-muted tabular">
          {format(buildMinutes.used)} / {format(buildMinutes.limit)}
        </p>
      </div>
      <Progress
        value={Math.round((buildMinutes.used / buildMinutes.limit) * 100)}
        aria-label="Build minutes used this cycle"
        getAriaValueText={() =>
          `${format(buildMinutes.used)} of ${format(buildMinutes.limit)} minutes`
        }
        className="gap-0 **:data-[slot=progress-indicator]:bg-panel-foreground **:data-[slot=progress-track]:bg-panel-raised"
      />
      <p className="text-caption text-panel-muted">
        Resets Nov 1.{" "}
        <Link
          href="/live/app/billing"
          className="rounded-xs font-semibold text-panel-foreground underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
        >
          Upgrade
        </Link>
      </p>
    </div>
  )
}

function WorkspaceSwitcher() {
  const [current, setCurrent] = React.useState(workspaces[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label={`Workspace: ${current.name}`}
                className="gap-3 px-2 data-popup-open:bg-sidebar-accent"
              />
            }
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-sm bg-tint-violet text-xs font-extrabold text-foreground"
            >
              {current.initial}
            </span>
            <span className="grid min-w-0 flex-1">
              <span className="truncate text-label text-foreground">
                {current.name}
              </span>
              <span className="truncate text-caption text-muted-foreground">
                {current.plan}
              </span>
            </span>
            <ChevronsUpDownIcon
              aria-hidden="true"
              className="ml-auto text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-3xs"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setCurrent(workspace)}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-6 shrink-0 place-items-center rounded-xs bg-tint-violet text-xs font-extrabold text-foreground"
                  >
                    {workspace.initial}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {workspace.name}
                  </span>
                  {workspace.id === current.id ? (
                    <CheckIcon className="ml-auto" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/live/onboarding" />}>
              <PlusIcon />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function TopBar({
  title,
  currentPath,
  hotkey,
}: {
  title?: string
  currentPath: string | null
  hotkey: boolean
}) {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const current = appNav.find((item) => isNavActive(currentPath, item))
  const heading = title ?? current?.title ?? "Overview"

  return (
    <header
      data-slot="app-shell-topbar"
      className="@container/topbar sticky top-0 z-(--z-header) flex h-(--header-height) shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-glass @min-[48rem]/shell:px-6"
    >
      <SidebarTrigger className="-ml-1.5" />
      <Separator
        orientation="vertical"
        className="h-5 data-vertical:self-center"
      />
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <span className="hidden truncate text-label text-muted-foreground @min-[36rem]/topbar:inline">
          Acme Inc.
        </span>
        <span
          aria-hidden="true"
          className="hidden text-label text-muted-foreground @min-[36rem]/topbar:inline"
        >
          /
        </span>
        <span
          aria-current="page"
          className="truncate text-label text-foreground"
        >
          {heading}
        </span>
      </nav>
      <div className="flex shrink-0 items-center gap-1 @min-[36rem]/topbar:gap-2">
        <CommandMenuButton
          onClick={() => setSearchOpen(true)}
          className="hidden w-3xs @min-[44rem]/topbar:inline-flex @min-[60rem]/topbar:w-2xs"
        />
        <CommandMenuButton
          variant="icon"
          onClick={() => setSearchOpen(true)}
          className="@min-[44rem]/topbar:hidden"
        />
        <CommandMenu
          trigger="none"
          hotkey={hotkey}
          open={searchOpen}
          onOpenChange={setSearchOpen}
        />
        <Notifications />
        <UserMenu />
      </div>
    </header>
  )
}

/**
 * The frame for every app page: a collapsible sidebar with the Lumen
 * navigation, recent projects, usage and a workspace switcher; a top bar
 * with search (Cmd+K), notifications and the user menu; and the content area.
 * Below the md breakpoint the sidebar opens as a sheet.
 */
/**
 * The path the navigation highlights: activeHref when given, else the URL.
 * A preview sits on a docs URL that matches nothing, so it falls back to the
 * item named by the title, then to the first item.
 */
function useCurrentPath(activeHref: string | undefined, title: string | undefined, preview: boolean) {
  const pathname = usePathname()
  if (activeHref) return activeHref
  if (!preview || appNav.some((item) => isNavActive(pathname, item))) return pathname
  return (appNav.find((item) => item.title === title) ?? appNav[0]).href
}

export function AppShell({
  children,
  title,
  activeHref,
  preview = false,
  hotkey = true,
  className,
}: AppShellProps) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(true)
  const currentPath = useCurrentPath(activeHref, title, preview)

  // In previews the shell follows its own width, not the viewport: collapse
  // the sidebar to icons when the frame is narrower than the md breakpoint.
  React.useEffect(() => {
    const frame = frameRef.current
    if (!preview || !frame || typeof ResizeObserver === "undefined") return
    let narrow: boolean | null = null
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width < 768
      if (next !== narrow) {
        narrow = next
        setOpen(!next)
      }
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [preview])

  return (
    <SidebarProvider
      ref={frameRef}
      open={open}
      onOpenChange={setOpen}
      data-preview={preview || undefined}
      className={cn(
        "@container/shell",
        preview &&
          "relative h-176 min-h-0 overflow-hidden **:data-[slot=sidebar-container]:absolute **:data-[slot=sidebar-container]:h-full",
        className
      )}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-(--header-height) shrink-0 flex-row items-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-2.75">
          <Link
            href="/live/app"
            aria-label="Lumen, go to overview"
            className="rounded-sm outline-none focus-visible:focus-ring"
          >
            <LumenWordmark />
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-2 py-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <NavLinks currentPath={currentPath} />
            </SidebarGroupContent>
          </SidebarGroup>
          <RecentProjects />
        </SidebarContent>
        <SidebarFooter className="gap-3 p-3 group-data-[collapsible=icon]:p-2">
          <UsagePanel />
          <WorkspaceSwitcher />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset
        className={cn("min-w-0", preview && "h-full min-h-0 overflow-y-auto")}
      >
        <TopBar title={title} currentPath={currentPath} hotkey={hotkey} />
        <div
          data-slot="app-shell-content"
          className="container-wide flex-1 py-8 @min-[48rem]/shell:py-10"
        >
          {children ?? <AppShellDemo />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
