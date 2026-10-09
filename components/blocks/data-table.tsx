"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  CopyIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SearchIcon,
  TerminalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

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
  projectStatuses,
  type ProjectRow,
  type ProjectStatus,
} from "@/components/blocks/data-table/data"
import { StatusBadge } from "@/components/blocks/data-table/status-badge"

export { defaultProjects, projectStatuses, type ProjectRow, type ProjectStatus }
export { StatusBadge } from "@/components/blocks/data-table/status-badge"

type SortKey = "name" | "status" | "requests" | "updated"
type OptionalColumn = "framework" | "region" | "requests" | "updated"

export interface DataTableProps {
  /** Rows to show. Defaults to the Lumen projects of Acme Inc. */
  rows?: ProjectRow[]
  /** Rows per page. */
  pageSize?: number
  /** Optional columns hidden on first render. */
  hiddenColumns?: OptionalColumn[]
  /** What one row is called, for counts and messages. */
  noun?: { one: string; other: string }
  className?: string
}

const columnLabels: Record<OptionalColumn, string> = {
  framework: "Framework",
  region: "Region",
  requests: "Requests (24h)",
  updated: "Last deploy",
}

const statusOrder: Record<ProjectStatus, number> = {
  failed: 0,
  building: 1,
  ready: 2,
  paused: 3,
}

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

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
 * Projects table with search, a status filter, column visibility, sortable
 * headers, row selection with bulk actions, row menus and pagination. Plain
 * React state, no table library.
 */
export function DataTable({
  rows = defaultProjects,
  pageSize = 8,
  hiddenColumns = [],
  noun = { one: "project", other: "projects" },
  className,
}: DataTableProps) {
  const [data, setData] = React.useState(rows)
  const [query, setQuery] = React.useState("")
  const [statuses, setStatuses] = React.useState<ProjectStatus[]>([])
  const [sort, setSort] = React.useState<{
    key: SortKey
    direction: "asc" | "desc"
  } | null>({
    key: "updated",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())
  const [columns, setColumns] = React.useState<Record<OptionalColumn, boolean>>(
    () => ({
      framework: !hiddenColumns.includes("framework"),
      region: !hiddenColumns.includes("region"),
      requests: !hiddenColumns.includes("requests"),
      updated: !hiddenColumns.includes("updated"),
    })
  )

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    return data.filter((row) => {
      if (statuses.length > 0 && !statuses.includes(row.status)) return false
      if (!needle) return true
      return [row.name, row.repo, row.framework, row.region, row.branch].some(
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
        case "requests":
          return (a.requests - b.requests) * factor
        case "updated":
          return (a.updatedMinutes - b.updatedMinutes) * factor
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
  const visibleColumns = Object.values(columns).filter(Boolean).length
  const colSpan = 4 + visibleColumns

  const label = (count: number) => (count === 1 ? noun.one : noun.other)

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (!current || current.key !== key)
        return { key, direction: key === "requests" ? "desc" : "asc" }
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

  function redeploy(ids: string[]) {
    setData((current) =>
      current.map((row) =>
        ids.includes(row.id) && row.status !== "paused"
          ? {
              ...row,
              status: "building",
              updated: "Just now",
              updatedMinutes: 0,
            }
          : row
      )
    )
    toast.add({
      title:
        ids.length === 1
          ? "Redeploy started"
          : `Redeploying ${ids.length} ${label(ids.length)}`,
      description:
        "Builds run in parallel. You will get a notification when they finish.",
    })
  }

  function setPaused(id: string, paused: boolean) {
    setData((current) =>
      current.map((row) =>
        row.id === id ? { ...row, status: paused ? "paused" : "ready" } : row
      )
    )
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
      description: "Its deployments and domains were removed.",
    })
  }

  function copyUrl(row: ProjectRow) {
    const url = `https://${row.name}.acme.dev`
    void navigator.clipboard?.writeText(url).catch(() => undefined)
    toast.add({
      title: "Copied the production URL",
      description: url,
      type: "success",
    })
  }

  return (
    <div
      data-slot="data-table"
      className={cn("@container/table grid gap-4", className)}
    >
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
                onClick={() => redeploy([...selected])}
              >
                <RotateCcwIcon data-icon="inline-start" />
                Redeploy
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
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground tabular">
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
                            : current.filter((value) => value !== status.value)
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
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
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

      <div className="overflow-hidden rounded-(--card-radius) border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  aria-label="Select all rows on this page"
                  checked={allOnPage}
                  indeterminate={someOnPage}
                  disabled={pageRows.length === 0}
                  onCheckedChange={(checked) => togglePage(checked)}
                />
              </TableHead>
              <TableHead
                className="h-11 px-3 font-semibold text-muted-foreground"
                aria-sort={
                  sort?.key === "name"
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortHeader
                  label="Project"
                  column="name"
                  sort={sort}
                  onSort={toggleSort}
                />
              </TableHead>
              <TableHead
                className="h-11 px-3 font-semibold text-muted-foreground"
                aria-sort={
                  sort?.key === "status"
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortHeader
                  label="Status"
                  column="status"
                  sort={sort}
                  onSort={toggleSort}
                />
              </TableHead>
              {columns.framework ? (
                <TableHead className="h-11 px-3 font-semibold text-muted-foreground">
                  <span className="text-caption font-semibold">Framework</span>
                </TableHead>
              ) : null}
              {columns.region ? (
                <TableHead className="h-11 px-3 font-semibold text-muted-foreground">
                  <span className="text-caption font-semibold">Region</span>
                </TableHead>
              ) : null}
              {columns.requests ? (
                <TableHead
                  className="h-11 px-3 text-right font-semibold text-muted-foreground"
                  aria-sort={
                    sort?.key === "requests"
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <SortHeader
                    label="Requests (24h)"
                    column="requests"
                    sort={sort}
                    onSort={toggleSort}
                    align="end"
                  />
                </TableHead>
              ) : null}
              {columns.updated ? (
                <TableHead
                  className="h-11 px-3 font-semibold text-muted-foreground"
                  aria-sort={
                    sort?.key === "updated"
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <SortHeader
                    label="Last deploy"
                    column="updated"
                    sort={sort}
                    onSort={toggleSort}
                  />
                </TableHead>
              ) : null}
              <TableHead className="w-14 pr-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={colSpan}
                  className="h-56 text-center whitespace-normal"
                >
                  <div className="mx-auto grid max-w-80 justify-items-center gap-2">
                    <p className="text-title text-foreground">
                      {filtering
                        ? `No ${noun.other} match`
                        : `No ${noun.other} yet`}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {filtering
                        ? "Try a different name, or clear the filters to see everything."
                        : "Import a repository to create your first one."}
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
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => {
                const isSelected = selected.has(row.id)
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className="h-(--table-row-height) hover:bg-accent/60 data-[state=selected]:bg-accent"
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        aria-label={`Select ${row.name}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          toggleRow(row.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <div className="grid gap-0.5">
                        <Link
                          href="/live/app/projects"
                          className="w-fit rounded-xs outline-none hover:underline hover:underline-offset-4 focus-visible:focus-ring"
                        >
                          <span className="text-label text-foreground">
                            {row.name}
                          </span>
                        </Link>
                        <span className="font-mono text-xs text-muted-foreground">
                          {row.repo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    {columns.framework ? (
                      <TableCell className="px-3 text-copy">
                        {row.framework}
                      </TableCell>
                    ) : null}
                    {columns.region ? (
                      <TableCell className="px-3 text-copy">
                        {row.region}
                      </TableCell>
                    ) : null}
                    {columns.requests ? (
                      <TableCell className="px-3 text-right text-foreground tabular">
                        {row.requests === 0 ? (
                          <span className="text-muted-foreground">0</span>
                        ) : (
                          compact.format(row.requests)
                        )}
                      </TableCell>
                    ) : null}
                    {columns.updated ? (
                      <TableCell className="px-3">
                        <div className="grid gap-0.5">
                          <span className="text-copy">{row.updated}</span>
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <GitBranchIcon
                              aria-hidden="true"
                              className="size-3"
                            />
                            {row.branch}
                          </span>
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell className="pr-4 text-right">
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
                            <DropdownMenuItem onClick={() => copyUrl(row)}>
                              <CopyIcon />
                              Copy production URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              render={<Link href="/live/app/projects" />}
                            >
                              <TerminalIcon />
                              View logs
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              disabled={row.status === "paused"}
                              onClick={() => redeploy([row.id])}
                            >
                              <RotateCcwIcon />
                              Redeploy
                            </DropdownMenuItem>
                            {row.status === "paused" ? (
                              <DropdownMenuItem
                                onClick={() => setPaused(row.id, false)}
                              >
                                <PlayIcon />
                                Resume
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setPaused(row.id, true)}
                              >
                                <PauseIcon />
                                Pause
                              </DropdownMenuItem>
                            )}
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
              })
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 @min-[32rem]/table:flex-row @min-[32rem]/table:items-center @min-[32rem]/table:justify-between">
          <p
            className="text-caption text-muted-foreground tabular"
            aria-live="polite"
          >
            {sorted.length === 0
              ? `0 ${noun.other}`
              : `Showing ${start + 1}–${start + pageRows.length} of ${sorted.length} ${label(sorted.length)}`}
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
      </div>
    </div>
  )
}
