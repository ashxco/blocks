"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

/** Page numbers to show: first, last, and the current page with its neighbours. */
function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | "ellipsis")[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("ellipsis")
    out.push(p)
  })
  return out
}

function StatefulPagination({
  total,
  initial = 1,
  size,
}: {
  total: number
  initial?: number
  size?: "icon" | "icon-sm"
}) {
  const [page, setPage] = React.useState(initial)

  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    setPage(Math.min(total, Math.max(1, next)))
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#previous"
            size={size === "icon-sm" ? "sm" : "default"}
            onClick={go(page - 1)}
            aria-disabled={page === 1 || undefined}
          />
        </PaginationItem>
        {pageWindow(page, total).map((p, i, items) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            // On phones, a neighbour of the current page hides when an ellipsis already stands
            // for the pages beyond it, so no page is ever skipped without a mark.
            <PaginationItem
              key={p}
              className={
                (p < page && items[i - 1] === "ellipsis") || (p > page && items[i + 1] === "ellipsis")
                  ? "max-sm:hidden"
                  : undefined
              }
            >
              <PaginationLink href={`#page-${p}`} size={size} isActive={p === page} onClick={go(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#next"
            size={size === "icon-sm" ? "sm" : "default"}
            onClick={go(page + 1)}
            aria-disabled={page === total || undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const deployments = [
  { sha: "a41c9e2", message: "Cache build output between deploys", status: "Ready" },
  { sha: "7f03b1d", message: "Add preview comments to pull requests", status: "Ready" },
  { sha: "c88e410", message: "Move image resizing to the edge", status: "Failed" },
  { sha: "1b2d7a9", message: "Upgrade to Node.js 22", status: "Ready" },
] as const

export default function PaginationDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Round page links with the current page in solid ink. Try it: the window of pages follows the current one."
        code={`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="?page=4" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=5" isActive>5</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=12">12</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="?page=6" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
      >
        <StatefulPagination total={12} initial={5} />
      </Example>

      <Example
        title="Small"
        description="Use icon-sm page links with sm Previous and Next in tables and side panels."
        code={`<PaginationPrevious href="?page=1" size="sm" />
<PaginationLink href="?page=2" size="icon-sm" isActive>2</PaginationLink>
<PaginationNext href="?page=3" size="sm" />`}
      >
        <StatefulPagination total={4} initial={2} size="icon-sm" />
      </Example>

      <Example
        title="First and last page"
        description="Set aria-disabled on Previous or Next at either end. They fade and stop responding to the pointer."
        code={`<PaginationPrevious href="?page=0" aria-disabled />`}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#previous" aria-disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-1" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Example>

      <Example
        title="Under a list"
        description="Say what the page shows on the left and put the controls on the right."
        layout="stack"
      >
        <section className="overflow-hidden rounded-(--card-radius) border bg-card">
          <ul className="divide-y">
            {deployments.map((d) => (
              <li key={d.sha} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="grid min-w-0 gap-0.5">
                  <p className="truncate text-label text-foreground">{d.message}</p>
                  <p className="font-mono text-caption text-muted-foreground">{d.sha}</p>
                </div>
                <Badge variant={d.status === "Ready" ? "success" : "destructive"}>{d.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3 border-t bg-subtle px-5 py-3 sm:flex-row sm:justify-between">
            <p className="text-caption text-muted-foreground tabular">Showing 21–24 of 312 deployments</p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#previous" size="icon-sm" aria-label="Go to previous page">
                    <ChevronLeftIcon />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#page-5" size="icon-sm">
                    5
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#page-6" size="icon-sm" isActive>
                    6
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#page-7" size="icon-sm">
                    7
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#next" size="icon-sm" aria-label="Go to next page">
                    <ChevronRightIcon />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </Example>

      <Guidelines
        do={[
          "Show the first and last page, the current page and its neighbours. Collapse the rest into an ellipsis.",
          "Use real links with a page query so people can share and bookmark a page.",
          "Say how many results there are next to the controls.",
        ]}
        dont={[
          "Don’t paginate short lists. Under about 50 rows, show them all.",
          "Don’t hide Previous and Next at the ends. Disable them so the layout does not shift.",
          "Don’t use pagination for feeds people read top to bottom. Load more as they scroll.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "isActive", type: "boolean", default: "false", description: "PaginationLink: marks the current page with a solid ink fill and aria-current." },
          { prop: "PaginationLink size", type: '"icon" | "icon-sm" | "icon-lg" | …', default: '"icon"', description: "Any Button size. Page sizes come from --button-height-*." },
          { prop: "href", type: "string", description: "PaginationLink, PaginationPrevious, PaginationNext: the page to go to." },
          { prop: "text", type: "string", default: '"Previous" / "Next"', description: "PaginationPrevious and PaginationNext: the label shown from the sm breakpoint up." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "PaginationPrevious and PaginationNext: match sm with icon-sm page links." },
          { prop: "aria-disabled", type: "boolean", description: "Fades a link and stops pointer events, for Previous on page 1 or Next on the last page." },
        ]}
      />
    </Examples>
  )
}
