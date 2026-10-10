import {
  CreditCardIcon,
  FolderKanbanIcon,
  LayoutGridIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export interface AppNavItem {
  title: string
  href: string
  icon: LucideIcon
  /** Only active on an exact pathname match. */
  exact?: boolean
}

/** Primary navigation of the Acme app templates. Shared by AppShell and CommandMenu. */
export const appNav: AppNavItem[] = [
  { title: "Overview", href: "/live/app", icon: LayoutGridIcon, exact: true },
  { title: "Projects", href: "/live/app/projects", icon: FolderKanbanIcon },
  { title: "Team", href: "/live/app/team", icon: UsersIcon },
  { title: "Billing", href: "/live/app/billing", icon: CreditCardIcon },
  { title: "Settings", href: "/live/app/settings", icon: SettingsIcon },
]

export function isNavActive(
  pathname: string | null,
  item: Pick<AppNavItem, "href" | "exact">
) {
  if (!pathname) return false
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
