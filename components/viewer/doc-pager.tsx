import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { PagerLink } from "@/components/viewer/nav"

/** Previous and next pages inside the same group, at the foot of a doc page. */
export function DocPager({ prev, next }: { prev?: PagerLink; next?: PagerLink }) {
  if (!prev && !next) return null
  return (
    <nav aria-label="More in this group" className="grid gap-3 border-t pt-10 sm:grid-cols-2">
      {prev ? <PagerCard link={prev} direction="prev" /> : null}
      {next ? <PagerCard link={next} direction="next" /> : null}
    </nav>
  )
}

function PagerCard({ link, direction }: { link: PagerLink; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ArrowLeftIcon : ArrowRightIcon
  return (
    <Link
      href={link.href}
      aria-label={`${direction === "prev" ? "Previous" : "Next"}: ${link.title}`}
      className={cn(
        "group/pager flex items-center gap-4 rounded-(--card-radius) border p-5 outline-none sm:p-6",
        "transition-colors duration-(--duration-base) ease-standard hover:border-foreground focus-visible:focus-ring",
        direction === "next" && "flex-row-reverse text-right sm:col-start-2"
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border text-foreground transition-colors duration-(--duration-base) group-hover/pager:border-foreground group-hover/pager:bg-foreground group-hover/pager:text-background">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate text-h4">{link.title}</span>
        <span className="text-caption text-muted-foreground">
          {direction === "prev" ? "Previous" : "Next"} in {link.group}
        </span>
      </span>
    </Link>
  )
}
