"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  ChartColumnIcon,
  ChartGanttIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  FlagIcon,
  FolderKanbanIcon,
  FunnelIcon,
  HouseIcon,
  InboxIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LinkIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  LockIcon,
  MenuIcon,
  MessageSquareIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SquareKanbanIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UploadIcon,
  UsersIcon,
  XIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { useCopy } from "./copy-button"

type IconEntry = [name: string, Icon: LucideIcon]

export const iconGroups: { name: string; icons: IconEntry[] }[] = [
  {
    name: "Navigation",
    icons: [
      ["HouseIcon", HouseIcon],
      ["LayoutDashboardIcon", LayoutDashboardIcon],
      ["LayoutGridIcon", LayoutGridIcon],
      ["MenuIcon", MenuIcon],
      ["SearchIcon", SearchIcon],
      ["SettingsIcon", SettingsIcon],
      ["ChevronDownIcon", ChevronDownIcon],
      ["ChevronRightIcon", ChevronRightIcon],
      ["ChevronsUpDownIcon", ChevronsUpDownIcon],
      ["ArrowRightIcon", ArrowRightIcon],
      ["ArrowUpRightIcon", ArrowUpRightIcon],
      ["ExternalLinkIcon", ExternalLinkIcon],
    ],
  },
  {
    name: "Actions",
    icons: [
      ["PlusIcon", PlusIcon],
      ["PencilIcon", PencilIcon],
      ["CopyIcon", CopyIcon],
      ["Trash2Icon", Trash2Icon],
      ["DownloadIcon", DownloadIcon],
      ["UploadIcon", UploadIcon],
      ["RefreshCwIcon", RefreshCwIcon],
      ["LinkIcon", LinkIcon],
      ["FunnelIcon", FunnelIcon],
      ["SlidersHorizontalIcon", SlidersHorizontalIcon],
      ["EllipsisIcon", EllipsisIcon],
      ["XIcon", XIcon],
    ],
  },
  {
    name: "Status and feedback",
    icons: [
      ["CheckIcon", CheckIcon],
      ["CircleCheckIcon", CircleCheckIcon],
      ["CircleAlertIcon", CircleAlertIcon],
      ["TriangleAlertIcon", TriangleAlertIcon],
      ["InfoIcon", InfoIcon],
      ["LoaderCircleIcon", LoaderCircleIcon],
      ["BellIcon", BellIcon],
      ["ClockIcon", ClockIcon],
      ["EyeIcon", EyeIcon],
      ["EyeOffIcon", EyeOffIcon],
      ["LockIcon", LockIcon],
      ["ShieldCheckIcon", ShieldCheckIcon],
    ],
  },
  {
    name: "Product",
    icons: [
      ["FolderKanbanIcon", FolderKanbanIcon],
      ["SquareKanbanIcon", SquareKanbanIcon],
      ["ChartGanttIcon", ChartGanttIcon],
      ["CalendarIcon", CalendarIcon],
      ["ListChecksIcon", ListChecksIcon],
      ["FlagIcon", FlagIcon],
      ["MessageSquareIcon", MessageSquareIcon],
      ["FileTextIcon", FileTextIcon],
      ["ZapIcon", ZapIcon],
      ["ChartColumnIcon", ChartColumnIcon],
      ["InboxIcon", InboxIcon],
      ["UsersIcon", UsersIcon],
    ],
  },
]

/** Hairline grid of icons. Clicking one copies its import name. */
export function IconGrid() {
  const { copied, copy } = useCopy()
  return (
    <div className="grid gap-12">
      {iconGroups.map((group) => (
        <div key={group.name} className="grid gap-5">
          <h3 className="text-h3 text-foreground">{group.name}</h3>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-(--card-radius) border bg-border @prose:grid-cols-4 @narrow:grid-cols-6">
            {group.icons.map(([name, Icon]) => {
              const done = copied === name
              const label = name.replace(/Icon$/, "")
              return (
                <li key={name} className="bg-background">
                  <button
                    type="button"
                    onClick={() => void copy(name)}
                    aria-label={`Copy ${name}`}
                    className="group/icon flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left text-foreground transition-colors duration-(--duration-fast) ease-standard hover:bg-subtle focus-visible:-outline-offset-(--focus-width) @prose:grid @prose:h-28 @prose:place-items-center @prose:content-center @prose:text-center"
                  >
                    {done ? (
                      <CheckIcon className="size-5 shrink-0 text-success @prose:size-6" />
                    ) : (
                      <Icon className="size-5 shrink-0 @prose:size-6" />
                    )}
                    <span className="min-w-0 text-xs break-words text-muted-foreground group-hover/icon:text-foreground @prose:max-w-full">
                      {done ? "Copied" : label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
