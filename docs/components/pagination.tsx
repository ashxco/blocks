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

/** Page 6 of the workspace’s tasks, 10 to a page: rows 51–60 of 312. */
const tasks = [
  { title: "Draft the Q4 hiring plan", meta: "Q4 planning · Lucas Moreau", status: "In progress" },
  { title: "Review the onboarding survey results", meta: "Onboarding redesign · Sofia Alvarez", status: "Done" },
  { title: "Fix crash when uploading photos", meta: "Mobile app 2.0 · Jordan Lee", status: "Overdue" },
  { title: "Update the refund policy article", meta: "Help center · Sam Okafor", status: "Done" },
  { title: "Move saved cards to the new payment provider", meta: "Billing migration · Daniel Brooks", status: "In progress" },
  { title: "Export the new logo files", meta: "Brand refresh · Sofia Alvarez", status: "Done" },
  { title: "Add search to the invoices page", meta: "Customer portal · Jordan Lee", status: "Overdue" },
  { title: "Book the venue for the Q4 offsite", meta: "Q4 planning · Lucas Moreau", status: "Done" },
  { title: "Interview five customers about reports", meta: "Q4 planning · Maya Patel", status: "To do" },
  { title: "Write the plan comparison page", meta: "Website relaunch · Priya Raman", status: "To do" },
] as const

const statusVariant = { Done: "success", "In progress": "info", Overdue: "destructive", "To do": "secondary" } as const

/** The footer’s page links: first and last page, the current page and its neighbours. */
const footerPage = 6
const footerPages = pageWindow(footerPage, 32)

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
            {tasks.map((task) => (
              <li key={task.title} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="grid min-w-0 gap-0.5">
                  <p className="truncate text-label text-foreground">{task.title}</p>
                  <p className="truncate text-caption text-muted-foreground">{task.meta}</p>
                </div>
                <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3 border-t bg-subtle px-5 py-3 sm:flex-row sm:justify-between">
            <p className="text-caption text-muted-foreground tabular">Showing 51–60 of 312 tasks</p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#page-5" size="icon-sm" aria-label="Go to previous page">
                    <ChevronLeftIcon />
                  </PaginationLink>
                </PaginationItem>
                {footerPages.map((p, i, items) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    // On phones the neighbours next to an ellipsis hide, as in the examples above.
                    <PaginationItem
                      key={p}
                      className={
                        (p < footerPage && items[i - 1] === "ellipsis") || (p > footerPage && items[i + 1] === "ellipsis")
                          ? "max-sm:hidden"
                          : undefined
                      }
                    >
                      <PaginationLink href={`#page-${p}`} size="icon-sm" isActive={p === footerPage}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationLink href="#page-7" size="icon-sm" aria-label="Go to next page">
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
