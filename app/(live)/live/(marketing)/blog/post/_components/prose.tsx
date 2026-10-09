import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Long-form article typography, driven entirely by Blocks type roles and
 * colour tokens. Styles apply to direct children (paragraphs, headings,
 * lists, figures) so embedded components keep their own styling.
 *
 * - Paragraphs and lists read at the lead size for a comfortable measure.
 * - h2 uses the h3 role, h3 the h4 role, both in full ink.
 * - Headings leave room for the sticky site header when linked to.
 * - Links are brand violet; inline code sits on a muted chip.
 */
const proseClasses = [
  "text-lead text-copy",
  // Vertical rhythm between blocks.
  "[&>*]:mt-6 [&>*:first-child]:mt-0",
  // Headings.
  "[&>h2]:mt-16 [&>h2]:scroll-mt-[calc(var(--header-height)+2rem)] [&>h2]:text-h3 [&>h2]:text-foreground",
  "[&>h3]:mt-10 [&>h3]:scroll-mt-[calc(var(--header-height)+2rem)] [&>h3]:text-h4 [&>h3]:text-foreground",
  // Lists.
  "[&>ul]:grid [&>ul]:list-disc [&>ul]:gap-3 [&>ul]:pl-6 [&>ul>li]:pl-1.5 [&>ul>li]:marker:text-muted-foreground",
  // Inline elements.
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_:is(p,li)_a]:font-medium [&_:is(p,li)_a]:text-brand [&_:is(p,li)_a]:underline [&_:is(p,li)_a]:decoration-brand/30 [&_:is(p,li)_a]:underline-offset-4",
  "[&_:is(p,li)_a:hover]:decoration-brand [&_:is(p,li)_a]:transition-colors [&_:is(p,li)_a]:duration-(--duration-fast)",
  "[&_:is(p,li)_a]:rounded-xs [&_:is(p,li)_a]:outline-none [&_:is(p,li)_a:focus-visible]:focus-ring",
  "[&_:is(p,li)>code]:rounded-xs [&_:is(p,li)>code]:border [&_:is(p,li)>code]:bg-muted [&_:is(p,li)>code]:px-1.5 [&_:is(p,li)>code]:py-0.5",
  "[&_:is(p,li)>code]:font-mono [&_:is(p,li)>code]:text-[0.85em] [&_:is(p,li)>code]:text-foreground",
  // Figures (code windows, tables, pull quotes) get more air.
  "[&>figure]:my-12 [&>hr]:my-14",
].join(" ")

export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="prose" className={cn(proseClasses, className)} {...props} />
}
