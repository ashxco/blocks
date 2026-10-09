import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The top bar's breadcrumb: the workspace, then the page. It sits in a
 * `@container/topbar` and drops the workspace when the bar is narrower than
 * 36rem, so the page title never wraps.
 */
export function AppBreadcrumb({
  workspace = "Acme Inc.",
  title,
}: {
  workspace?: string
  title: React.ReactNode
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap">
      <span className="hidden min-w-0 truncate text-label text-muted-foreground @min-[36rem]/topbar:inline">
        {workspace}
      </span>
      <span aria-hidden="true" className="hidden text-label text-muted-foreground @min-[36rem]/topbar:inline">
        /
      </span>
      <span aria-current="page" className="min-w-0 truncate text-label text-foreground">
        {title}
      </span>
    </nav>
  )
}

/**
 * A slice of the AppShell top bar on its own: the breadcrumb and a row of
 * actions on a bordered strip. Use it to preview the top-bar molecules
 * (CommandMenu, Notifications, UserMenu) where they live, without the shell.
 * It is a container, so those molecules respond to its width.
 */
export function AppTopBarSlice({
  title = "Overview",
  children,
  className,
}: {
  title?: React.ReactNode
  /** The actions on the right. */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="app-top-bar-slice"
      className={cn(
        "@container/topbar flex h-(--header-height-sm) w-full min-w-0 items-center gap-3 rounded-(--card-radius) border bg-background pr-2 pl-5",
        className
      )}
    >
      <AppBreadcrumb title={title} />
      <div className="flex shrink-0 items-center gap-1">{children}</div>
    </div>
  )
}
