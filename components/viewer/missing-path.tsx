"use client"

import { usePathname } from "next/navigation"

/** The address that was not found, in mono type, or "this address" when unknown. */
export function MissingPath() {
  const pathname = usePathname()
  if (!pathname) return <>this address</>
  return <code className="font-mono break-all text-foreground">{pathname}</code>
}
