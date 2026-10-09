"use client"

import * as React from "react"
import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ClockIcon,
  CloudIcon,
  CopyIcon,
  DatabaseIcon,
  DownloadIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FunnelIcon,
  GaugeIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GitPullRequestIcon,
  GlobeIcon,
  HouseIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LinkIcon,
  LoaderCircleIcon,
  LockIcon,
  MenuIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  RocketIcon,
  SearchIcon,
  ServerIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TerminalIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UploadIcon,
  UsersIcon,
  XIcon,
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
      ["RocketIcon", RocketIcon],
      ["GitBranchIcon", GitBranchIcon],
      ["GitCommitHorizontalIcon", GitCommitHorizontalIcon],
      ["GitPullRequestIcon", GitPullRequestIcon],
      ["TerminalIcon", TerminalIcon],
      ["ServerIcon", ServerIcon],
      ["DatabaseIcon", DatabaseIcon],
      ["GlobeIcon", GlobeIcon],
      ["CloudIcon", CloudIcon],
      ["ActivityIcon", ActivityIcon],
      ["GaugeIcon", GaugeIcon],
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
          <h3 className="text-h4">{group.name}</h3>
          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-(--card-radius) border bg-border @prose:grid-cols-4 @narrow:grid-cols-6">
            {group.icons.map(([name, Icon]) => {
              const done = copied === name
              const label = name.replace(/Icon$/, "")
              return (
                <li key={name} className="bg-background">
                  <button
                    type="button"
                    onClick={() => void copy(name)}
                    aria-label={`Copy ${name}`}
                    className="group/icon grid h-32 w-full place-items-center content-center gap-3 p-3 text-foreground transition-colors duration-(--duration-fast) ease-standard hover:bg-subtle focus-visible:-outline-offset-(--focus-width)"
                  >
                    {done ? <CheckIcon className="size-6 text-success" /> : <Icon className="size-6" />}
                    <span className="max-w-full truncate text-caption text-muted-foreground group-hover/icon:text-foreground">
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
