"use client"

import * as React from "react"
import { ArrowUpIcon, ChevronDownIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface TocItem {
  id: string
  title: string
  /** 3 indents the item under the previous section. */
  level?: 2 | 3
}

export interface TableOfContentsProps {
  items: TocItem[]
  /** Id of the element "Back to top" links to. */
  topId?: string
}

/**
 * Tracks the section being read: the last heading whose top has passed
 * 30% of the viewport. Listens in the capture phase so it works whether
 * the window or an ancestor element scrolls.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null)
  const key = ids.join("|")

  React.useEffect(() => {
    const headings = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.3
        let current = headings[0].id
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= line) current = heading.id
          else break
        }
        setActive(current)
      })
    }

    update()
    document.addEventListener("scroll", update, { capture: true, passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("scroll", update, { capture: true })
      window.removeEventListener("resize", update)
    }
  }, [key])

  return active
}

function linkClasses(item: TocItem, isActive: boolean) {
  return [
    "-ml-px block rounded-r-xs border-l-2 py-1.5 pr-2 text-sm font-medium outline-none",
    "transition-[color,border-color] duration-(--duration-fast) ease-standard focus-visible:focus-ring",
    item.level === 3 ? "pl-7" : "pl-4",
    isActive
      ? "border-foreground text-foreground"
      : "border-transparent text-muted-foreground hover:text-foreground",
  ].join(" ")
}

/**
 * "On this page" navigation. A sticky rail with an ink indicator on large
 * screens; a collapsible panel above the article on smaller ones.
 */
export function TableOfContents({ items, topId = "top" }: TableOfContentsProps) {
  const active = useActiveSection(items.map((item) => item.id))
  const [open, setOpen] = React.useState(false)
  const activeTitle = items.find((item) => item.id === active)?.title ?? items[0]?.title

  return (
    <>
      {/* Small screens */}
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="rounded-(--card-radius) border bg-background lg:hidden"
      >
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 rounded-(--card-radius) px-5 py-4 text-left outline-none focus-visible:focus-ring">
          <span className="grid min-w-0 gap-0.5">
            <span className="text-label text-foreground">On this page</span>
            <span className="truncate text-caption text-muted-foreground">{activeTitle}</span>
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) ease-out group-data-panel-open:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-(--duration-base) ease-out data-ending-style:h-0 data-starting-style:h-0">
          <nav aria-label="On this page" className="border-t px-5 py-4">
            <ul className="grid border-l">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "location" : undefined}
                    className={linkClasses(item, active === item.id)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </CollapsibleContent>
      </Collapsible>

      {/* Large screens */}
      <nav aria-labelledby="toc-heading" className="hidden lg:grid lg:gap-5">
        <p id="toc-heading" className="text-label text-foreground">
          On this page
        </p>
        <ul className="grid border-l">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={linkClasses(item, active === item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`#${topId}`}
          className="inline-flex w-fit items-center gap-1.5 rounded-xs text-sm font-medium text-muted-foreground outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
        >
          <ArrowUpIcon aria-hidden="true" className="size-3.5" />
          Back to top
        </a>
      </nav>
    </>
  )
}
