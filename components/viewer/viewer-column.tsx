"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

/**
 * The shell's content column: a centred page container with top and bottom
 * rhythm, for every viewer page except the overview, which is full-bleed and
 * lays out its own containers.
 */
export function ViewerColumn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/") return <>{children}</>
  return (
    <div className="container-page pt-18 pb-section sm:pt-20 lg:pt-14">
      {children}
    </div>
  )
}
