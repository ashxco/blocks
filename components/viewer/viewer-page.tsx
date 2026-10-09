import * as React from "react"

import { cn } from "@/components/viewer/cn"

/**
 * Vertical rhythm for a viewer page's blocks (header, content, pager). The
 * container and page padding come from the shell (ViewerColumn).
 */
export function ViewerPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid min-w-0 gap-14 sm:gap-16", className)}>{children}</div>
}
