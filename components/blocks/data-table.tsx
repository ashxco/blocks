"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChartGanttIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  Columns3Icon,
  ExternalLinkIcon,
  LinkIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  defaultProjects,
  formatDue,
  isActiveProject,
  projectStatuses,
  type ProjectRow,
  type ProjectStatus,
} from "@/components/blocks/data-table/data"
import { StatusBadge } from "@/components/blocks/data-table/status-badge"
import { personTone } from "@/components/blocks/members-list/people"

export { defaultProjects, formatDue, isActiveProject, projectStatuses, type ProjectRow, type ProjectStatus }
export { StatusBadge } from "@/components/blocks/data-table/status-badge"

type SortKey = "name" | "status" | "progress" | "due" | "updated"
type OptionalColumn = "lead" | "progress" | "due" | "updated"

export interface DataTableProps {
  /** Rows to show. Defaults to the 26 projects of the Acme Inc. workspace. */
  rows?: ProjectRow[]
  /** Rows per page. */
  pageSize?: number
  /** Optional columns hidden on first render. */
  hiddenColumns?: OptionalColumn[]
  /** What one row is called, for counts and messages. */
  noun?: { one: string; other: string }
  /**
   * "compact" sets rows at --table-row-height-sm on one line each (no team
   * line under the name), for tables that share a page.
   */
  density?: "default" | "compact"
  /** Heading of the empty state when there are no rows at all. Defaults to "No projects yet". */
  emptyTitle?: string
  /** What to do next, under the empty heading. */
  emptyDescription?: string
  /**
   * The empty state's primary action. Defaults to Create project for
   * projects; pass null to leave it out.
   */
  emptyAction?: DataTableEmptyAction | null
  className?: string
}

export interface DataTableEmptyAction {
  label: string
  /** A link target. Without it the action is a button that calls onClick. */
  href?: string
  onClick?: () => void
  icon?: LucideIcon
}

const defaultNoun = { one: "project", other: "projects" }

const defaultEmptyAction: DataTableEmptyAction = {
  label: "Create project",
  href: "/live/onboarding?step=template",
  icon: PlusIcon,
}

const columnLabels: Record<OptionalColumn, string> = {
  due: "Due date",
  progress: "Progress",
  lead: "Lead",
  updated: "Updated",
}

/** Status sorts by urgency: the projects that need attention come first. */
const statusOrder: Record<ProjectStatus, number> = {
  "off-track": 0,
  "at-risk": 1,
  "on-track": 2,
  paused: 3,
  completed: 4,
}

const progressOf = (row: ProjectRow) => (row.total > 0 ? row.done / row.total : 0)

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/** Header cells share the small row height token. */
const headCell = "h-(--table-row-height-sm)"

function SortHeader({
  label,
  column,
  sort,
  onSort,
  align = "start",
}: {
  label: string
  column: SortKey
  sort: { key: SortKey; direction: "asc" | "desc" } | null
  onSort: (key: SortKey) => void
  align?: "start" | "end"
}) {
  const active = sort?.key === column
  const Icon = !active
    ? ArrowUpDownIcon
    : sort.direction === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={cn(
        "-mx-1.5 inline-flex items-center gap-1.5 rounded-xs px-1.5 py-1 outline-none",
        "transition-colors duration-(--duration-fast) ease-standard hover:text-foreground focus-visible:focus-ring",
        active ? "text-foreground" : "text-muted-foreground",
        align === "end" && "flex-row-reverse"
      )}
    >
      <span className="text-caption font-semibold">{label}</span>
      <Icon
        aria-hidden="true"
        className={cn("size-3.5", !active && "opacity-60")}
      />
    </button>
  )
}

/**
 * Optional columns step in as the table gets room, so on a phone the row is
 * project, status and its menu with nothing scrolled out of view. The
 * Columns menu still decides which of them show once there is room.
 */
const columnFrom: Record<OptionalColumn, string> = {
  due: "hidden @min-[34rem]/table:table-cell",
  progress: "hidden @min-[44rem]/table:table-cell",
  lead: "hidden @min-[52rem]/table:table-cell",
  updated: "hidden @min-[60rem]/table:table-cell",
}

/*
 * Below 28rem of table width the cells tighten, the project name wraps and
 * the team name truncates, so the status badge keeps its full width. Below
 * 20rem the checkbox column steps out too, leaving project, status and the
 * row menu in a narrow phone slot.
 */
const selectColumn = "hidden @min-[20rem]/table:table-cell"

/**
 * The row menu stays pinned to the right edge if the table ever scrolls, with
 * the row's own fill so content passes under it cleanly.
 */
const stickyEnd =
  "sticky right-0 bg-card group-hover/row:bg-subtle group-data-[state=selected]/row:bg-accent"

function ariaSort(
  sort: { key: SortKey; direction: "asc" | "desc" } | null,
  key: SortKey
) {
  if (sort?.key !== key) return undefined
  return sort.direction === "asc" ? "ascending" : "descending"
}

/**
 * Projects table with search, a status filter, column visibility, sortable
 * headers, row selection with a bulk archive, row menus and pagination.
 * Plain React state, no table library.
 */
export function DataTable({
  rows = defaultProjects,
  pageSize = 8,
  hiddenColumns = [],
  noun = defaultNoun,
  density = "default",
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
}: DataTableProps) {
  const dense = density === "compact"
  const projects =
    noun.one === defaultNoun.one && noun.other === defaultNoun.other
  const empty = {
    title: emptyTitle ?? `No ${noun.other} yet`,
    description:
      emptyDescription ??
      (projects
        ? "Start from a template such as Product roadmap, or create a blank project and add tasks as you go."
        : `Add your first ${noun.one} and it shows up here.`),
    action:
      emptyAction === undefined
        ? projects
          ? defaultEmptyAction
          : null
        : emptyAction,
  }
  const [data, setData] = React.useState(rows)
  const [query, setQuery] = React.useState("")
  const [statuses, setStatuses] = React.useState<ProjectStatus[]>([])
  const [sort, setSort] = React.useState<{
    key: SortKey
    direction: "asc" | "desc"
  } | null>({
    key: "updated",
    direction: "desc",
  })
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())
  const [columns, setColumns] = React.useState<Record<OptionalColumn, boolean>>(
    () => ({
      due: !hiddenColumns.includes("due"),
      progress: !hiddenColumns.includes("progress"),
      lead: !hiddenColumns.includes("lead"),
      updated: !hiddenColumns.includes("updated"),
    })
  )

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    return data.filter((row) => {
      if (statuses.length > 0 && !statuses.includes(row.status)) return false
      if (!needle) return true
      return [row.name, row.team, row.lead].some(
        (value) => value.toLowerCase().includes(needle)
      )
    })
  }, [data, query, statuses])

  const sorted = React.useMemo(() => {
    if (!sort) return filtered
    const factor = sort.direction === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case "name":
          return a.name.localeCompare(b.name) * factor
        case "status":
          return (statusOrder[a.status] - statusOrder[b.status]) * factor
        case "progress":
          return (progressOf(a) - progressOf(b)) * factor
        case "due":
          return a.due.localeCompare(b.due) * factor
        case "updated":
          // Ascending is oldest first, like a timestamp; fewer minutes ago is newer.
          return (b.updatedMinutes - a.updatedMinutes) * factor
      }
    })
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const pageRows = sorted.slice(start, start + pageSize)

  const pageIds = pageRows.map((row) => row.id)
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length
  const allOnPage = pageIds.length > 0 && selectedOnPage === pageIds.length
  const someOnPage = selectedOnPage > 0 && !allOnPage
  const filtering = query.trim() !== "" || statuses.length > 0

  const label = (count: number) => (count === 1 ? noun.one : noun.other)

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (!current || current.key !== key)
        return {
          key,
          direction: key === "progress" || key === "updated" ? "desc" : "asc",
        }
      if (current.direction === "asc") return { key, direction: "desc" }
      return { key, direction: "asc" }
    })
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function togglePage(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      for (const id of pageIds) {
        if (checked) next.add(id)
        else next.delete(id)
      }
      return next
    })
  }

  function clearFilters() {
    setQuery("")
    setStatuses([])
    setPage(1)
  }

  function archive(ids: string[]) {
    const archived = data.filter((row) => ids.includes(row.id))
    if (archived.length === 0) return
    setData((current) => current.filter((row) => !ids.includes(row.id)))
    setSelected(new Set())
    toast.add({
      title:
        archived.length === 1
          ? `Archived ${archived[0].name}`
          : `Archived ${archived.length} ${label(archived.length)}`,
      description: "Their tasks, docs and comments are kept. Restore them from the archive at any time.",
      actionProps: {
        children: "Undo",
        onClick: () =>
          setData((current) => [
            ...current,
            ...archived.filter((row) => !current.some((item) => item.id === row.id)),
          ]),
      },
    })
  }

  function update(id: string, patch: Partial<ProjectRow>) {
    setData((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, ...patch, updated: "Just now", updatedMinutes: 0 }
          : row
      )
    )
  }

  function complete(row: ProjectRow) {
    update(row.id, { status: "completed", done: row.total })
    toast.add({
      title: `${row.name} is complete`,
      description: "Open tasks were marked done and its automations stopped.",
      type: "success",
    })
  }

  function setPaused(row: ProjectRow, paused: boolean) {
    update(row.id, { status: paused ? "paused" : "on-track" })
  }

  function remove(row: ProjectRow) {
    setData((current) => current.filter((item) => item.id !== row.id))
    setSelected((current) => {
      const next = new Set(current)
      next.delete(row.id)
      return next
    })
    toast.add({
      title: `Deleted ${row.name}`,
      description: `Its ${row.total} tasks, docs and automations were removed.`,
    })
  }

  function copyLink(row: ProjectRow) {
    const url = `https://app.acme.com/acme/projects/${row.id}`
    void navigator.clipboard?.writeText(url).catch(() => undefined)
    toast.add({
      title: "Copied the project link",
      description: url,
      type: "success",
    })
  }

  // With no rows at all there is nothing to search, filter, select or page
  // through: the card holds only the empty state and its action.
  const hasData = data.length > 0

  return (
    <div
      data-slot="data-table"
      data-density={density}
      className={cn("@container/table grid gap-4", className)}
    >
      {hasData ? (
        <div className="flex flex-col gap-3 @min-[44rem]/table:flex-row @min-[44rem]/table:items-center @min-[44rem]/table:justify-between">
          <InputGroup className="h-(--control-height-sm) w-full @min-[44rem]/table:w-72">
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              aria-label={`Search ${noun.other}`}
              placeholder={`Search ${noun.other}`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>

          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 ? (
              <div className="mr-auto flex items-center gap-2 @min-[44rem]/table:mr-2">
                <span className="text-label text-foreground tabular">
                  {selected.size} selected
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => archive([...selected])}
                >
                  <ArchiveIcon data-icon="inline-start" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelected(new Set())}
                >
                  Clear
                </Button>
              </div>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <ListFilterIcon data-icon="inline-start" />
                Status
                {statuses.length > 0 ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-(--badge-radius) bg-primary px-1 text-xs font-bold text-primary-foreground tabular">
                    {statuses.length}
                  </span>
                ) : null}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  {projectStatuses.map((status) => {
                    const count = data.filter(
                      (row) => row.status === status.value
                    ).length
                    return (
                      <DropdownMenuCheckboxItem
                        key={status.value}
                        checked={statuses.includes(status.value)}
                        onCheckedChange={(checked) => {
                          setStatuses((current) =>
                            checked
                              ? [...current, status.value]
                              : current.filter(
                                  (value) => value !== status.value
                                )
                          )
                          setPage(1)
                        }}
                      >
                        <StatusBadge status={status.value} />
                        <span className="ml-auto text-muted-foreground tabular">
                          {count}
                        </span>
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>
                {statuses.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setStatuses([])
                        setPage(1)
                      }}
                    >
                      <XIcon />
                      Clear filter
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              {/* Below 34rem no optional column has room, so the menu would change nothing. */}
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
                className="hidden @min-[34rem]/table:inline-flex"
              >
                <Columns3Icon data-icon="inline-start" />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                  {(Object.keys(columnLabels) as OptionalColumn[]).map(
                    (column) => (
                      <DropdownMenuCheckboxItem
                        key={column}
                        checked={columns[column]}
                        onCheckedChange={(checked) =>
                          setColumns((current) => ({
                            ...current,
                            [column]: checked,
                          }))
                        }
                      >
                        {columnLabels[column]}
                      </DropdownMenuCheckboxItem>
                    )
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-(--card-radius) border border-border bg-card">
        {hasData ? (
          <Table size={dense ? "sm" : "default"}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className={cn(
                    headCell,
                    "w-10 pl-3",
                    "@min-[28rem]/table:w-12 @min-[28rem]/table:pl-4",
                    selectColumn
                  )}
                >
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allOnPage}
                    indeterminate={someOnPage}
                    disabled={pageRows.length === 0}
                    onCheckedChange={(checked) => togglePage(checked)}
                  />
                </TableHead>
                <TableHead
                  className={cn(
                    headCell,
                    "pr-2 pl-4 font-semibold text-muted-foreground",
                    "@min-[20rem]/table:pl-3 @min-[28rem]/table:px-3"
                  )}
                  aria-sort={ariaSort(sort, "name")}
                >
                  <SortHeader
                    label="Project"
                    column="name"
                    sort={sort}
                    onSort={toggleSort}
                  />
                </TableHead>
                <TableHead
                  className={cn(
                    headCell,
                    "w-px px-2 font-semibold text-muted-foreground",
                    "@min-[28rem]/table:px-3"
                  )}
                  aria-sort={ariaSort(sort, "status")}
                >
                  <SortHeader
                    label="Status"
                    column="status"
                    sort={sort}
                    onSort={toggleSort}
                  />
                </TableHead>
                {columns.progress ? (
                  <TableHead
                    className={cn(
                      headCell,
                      "px-3 font-semibold text-muted-foreground",
                      columnFrom.progress
                    )}
                    aria-sort={ariaSort(sort, "progress")}
                  >
                    <SortHeader
                      label="Progress"
                      column="progress"
                      sort={sort}
                      onSort={toggleSort}
                    />
                  </TableHead>
                ) : null}
                {columns.lead ? (
                  <TableHead
                    className={cn(
                      headCell,
                      "px-3 font-semibold text-muted-foreground",
                      columnFrom.lead
                    )}
                  >
                    <span className="text-caption font-semibold">Lead</span>
                  </TableHead>
                ) : null}
                {columns.due ? (
                  <TableHead
                    className={cn(
                      headCell,
                      "px-3 font-semibold text-muted-foreground",
                      columnFrom.due
                    )}
                    aria-sort={ariaSort(sort, "due")}
                  >
                    <SortHeader
                      label="Due date"
                      column="due"
                      sort={sort}
                      onSort={toggleSort}
                    />
                  </TableHead>
                ) : null}
                {columns.updated ? (
                  <TableHead
                    className={cn(
                      headCell,
                      "px-3 font-semibold text-muted-foreground",
                      columnFrom.updated
                    )}
                    aria-sort={ariaSort(sort, "updated")}
                  >
                    <SortHeader
                      label="Updated"
                      column="updated"
                      sort={sort}
                      onSort={toggleSort}
                    />
                  </TableHead>
                ) : null}
                <TableHead
                  className={cn(
                    headCell,
                    "w-12 pr-2 pl-0",
                    "@min-[28rem]/table:w-14 @min-[28rem]/table:pr-4 @min-[28rem]/table:pl-4",
                    stickyEnd
                  )}
                >
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => {
                const isSelected = selected.has(row.id)
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={cn(
                      "group/row hover:bg-subtle data-[state=selected]:bg-accent",
                      dense
                        ? "h-(--table-row-height-sm)"
                        : "h-(--table-row-height)"
                    )}
                  >
                    <TableCell
                      className={cn("pl-3 @min-[28rem]/table:pl-4", selectColumn)}
                    >
                      <Checkbox
                        aria-label={`Select ${row.name}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          toggleRow(row.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell
                      className={cn(
                        dense ? "py-1.5" : "py-2.5",
                        "min-w-0 pr-2 pl-4 break-words whitespace-normal",
                        "@min-[20rem]/table:pl-3",
                        "@min-[28rem]/table:px-3 @min-[28rem]/table:whitespace-nowrap"
                      )}
                    >
                      <div className="grid gap-0.5">
                        <Link
                          href="/live/app/projects"
                          className="w-fit rounded-xs outline-none hover:underline hover:underline-offset-4 focus-visible:focus-ring"
                        >
                          <span className="text-label text-foreground">
                            {row.name}
                          </span>
                        </Link>
                        {dense ? null : (
                          <span
                            className={cn(
                              "block max-w-24 truncate text-caption text-muted-foreground",
                              "@min-[22rem]/table:max-w-32 @min-[28rem]/table:max-w-none"
                            )}
                          >
                            {row.team}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        dense ? "py-1.5" : "py-2.5",
                        "w-px px-2 whitespace-nowrap @min-[28rem]/table:px-3"
                      )}
                    >
                      {/* Flex, not grid: a grid lets the badge (overflow-hidden) shrink below its label. */}
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={row.status} />
                        {/* Until the Due date column fits, the date sits under the status. */}
                        {columns.due && !dense ? (
                          <span className="text-caption whitespace-nowrap text-muted-foreground @min-[34rem]/table:hidden">
                            Due {formatDue(row.due)}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    {columns.progress ? (
                      <TableCell className={cn("px-3", columnFrom.progress)}>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={Math.round(progressOf(row) * 100)}
                            aria-label={`${row.name}: ${row.done} of ${row.total} tasks done`}
                            className="w-20 gap-0"
                          />
                          <span className="text-caption whitespace-nowrap text-muted-foreground tabular">
                            {row.done}/{row.total}
                          </span>
                        </div>
                      </TableCell>
                    ) : null}
                    {columns.lead ? (
                      <TableCell className={cn("px-3", columnFrom.lead)}>
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarFallback tone={personTone(row.lead)}>
                              {initialsOf(row.lead)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-copy whitespace-nowrap">{row.lead}</span>
                        </div>
                      </TableCell>
                    ) : null}
                    {columns.due ? (
                      <TableCell
                        className={cn("px-3 whitespace-nowrap text-copy tabular", columnFrom.due)}
                      >
                        <time dateTime={row.due}>{formatDue(row.due)}</time>
                      </TableCell>
                    ) : null}
                    {columns.updated ? (
                      <TableCell
                        className={cn("px-3 whitespace-nowrap text-copy", columnFrom.updated)}
                      >
                        {row.updated}
                      </TableCell>
                    ) : null}
                    <TableCell
                      className={cn(
                        "pr-2 pl-0 text-right",
                        "@min-[28rem]/table:pr-4 @min-[28rem]/table:pl-4",
                        stickyEnd
                      )}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${row.name}`}
                            />
                          }
                        >
                          <MoreHorizontalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              render={<Link href="/live/app/projects" />}
                            >
                              <ExternalLinkIcon />
                              Open project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              render={<Link href="/live/app/projects" />}
                            >
                              <ChartGanttIcon />
                              Open timeline
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyLink(row)}>
                              <LinkIcon />
                              Copy link
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              disabled={row.status === "completed"}
                              onClick={() => complete(row)}
                            >
                              <CircleCheckIcon />
                              Mark as complete
                            </DropdownMenuItem>
                            {row.status === "paused" ? (
                              <DropdownMenuItem
                                onClick={() => setPaused(row, false)}
                              >
                                <PlayIcon />
                                Resume
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                disabled={row.status === "completed"}
                                onClick={() => setPaused(row, true)}
                              >
                                <PauseIcon />
                                Pause
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => archive([row.id])}>
                              <ArchiveIcon />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => remove(row)}
                          >
                            <Trash2Icon />
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : null}

        {/* Outside the table, so the message centres in the card even when the table scrolls. */}
        {pageRows.length === 0 ? (
          <div
            className={cn(
              "grid min-h-56 place-items-center px-6 py-10 text-center",
              hasData && "border-t border-border"
            )}
          >
            <div role="status" className="grid max-w-80 justify-items-center gap-2">
              <p className="text-title text-foreground">
                {filtering ? `No ${noun.other} match` : empty.title}
              </p>
              <p className="text-caption text-muted-foreground">
                {filtering
                  ? "Try a different name, or clear the filters to see everything."
                  : empty.description}
              </p>
              {filtering ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : empty.action ? (
                <EmptyAction action={empty.action} />
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Counts and paging only mean something when there are rows to page through. */}
        {sorted.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 @min-[32rem]/table:flex-row @min-[32rem]/table:items-center @min-[32rem]/table:justify-between">
            <p
              className="text-caption text-muted-foreground tabular"
              aria-live="polite"
            >
              {`Showing ${start + 1}–${start + pageRows.length} of ${sorted.length} ${label(sorted.length)}`}
              {selected.size > 0 ? ` · ${selected.size} selected` : null}
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <span className="text-caption text-muted-foreground tabular">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRightIcon />
              </Button>
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function EmptyAction({ action }: { action: DataTableEmptyAction }) {
  const Icon = action.icon
  const content = (
    <>
      {Icon ? <Icon data-icon="inline-start" /> : null}
      {action.label}
    </>
  )
  if (action.href) {
    return (
      <Button
        size="sm"
        className="mt-2"
        nativeButton={false}
        render={<Link href={action.href} />}
      >
        {content}
      </Button>
    )
  }
  return (
    <Button size="sm" className="mt-2" onClick={action.onClick}>
      {content}
    </Button>
  )
}
