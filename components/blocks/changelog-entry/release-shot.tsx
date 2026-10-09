import * as React from "react"

import { cn } from "@/lib/utils"

const rows = [
  { width: "w-1/3", status: "bg-success" },
  { width: "w-2/5", status: "bg-success" },
  { width: "w-1/4", status: "bg-warning" },
  { width: "w-1/3", status: "bg-success" },
]

/**
 * A flat sketch of a Lumen screen, used as the default screenshot in a
 * changelog entry. The window is anchored to the bottom-right corner of its
 * frame, like a cropped product shot. Built from surface tokens, so it
 * follows the theme. Decorative only.
 */
export function ReleaseShot({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("@container relative aspect-video w-full overflow-hidden", className)}>
      <div className="absolute top-1/8 right-0 bottom-0 left-1/12 flex overflow-hidden rounded-tl-lg border-t border-l border-foreground/10 bg-background">
        {/* Sidebar */}
        <div className="hidden w-1/5 shrink-0 flex-col gap-2.5 border-r border-foreground/10 bg-subtle p-4 @min-[28rem]:flex">
          <span className="mb-2 h-2.5 w-1/2 rounded-full bg-foreground" />
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-2/3 rounded-full bg-foreground/45" />
          <span className="h-1.5 w-3/4 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
          <span className="mt-4 h-1.5 w-2/3 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
        </div>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 @min-[36rem]:p-6">
          <div className="flex items-center gap-3">
            <span className="h-3 w-1/4 rounded-full bg-foreground" />
            <span className="ml-auto h-6 w-16 shrink-0 rounded-full border border-foreground/15" />
            <span className="h-6 w-20 shrink-0 rounded-full bg-primary" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["bg-tint-violet", "bg-subtle", "bg-subtle"].map((fill, i) => (
              <div key={i} className={cn("grid gap-2 rounded-md p-3", fill)}>
                <span className="h-1.5 w-1/2 rounded-full bg-foreground/25" />
                <span className="h-3 w-2/3 rounded-full bg-foreground" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-md border border-foreground/10 px-3 py-2">
            <span className="size-2 shrink-0 rounded-full bg-brand" />
            <span className="h-1.5 w-2/5 rounded-full bg-foreground/30" />
            <span className="ml-auto h-1.5 w-10 rounded-full bg-foreground/15" />
          </div>

          <div className="grid gap-px overflow-hidden rounded-md border border-foreground/10 bg-foreground/10">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 bg-background px-3 py-2.5">
                <span className={cn("size-2 shrink-0 rounded-full", row.status)} />
                <span className={cn("h-1.5 rounded-full bg-foreground/25", row.width)} />
                <span className="ml-auto h-1.5 w-8 rounded-full bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
