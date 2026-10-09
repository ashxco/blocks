"use client"

import { usePathname } from "next/navigation"

import { SiteFooter } from "@/components/blocks/site-footer"

/** Pages that carry their own sign-up: the blog band and the changelog header form. */
const pagesWithSignUp = ["/live/blog", "/live/changelog"]

/**
 * The site footer for the marketing templates. It drops its newsletter form on
 * pages that already ask for an email, so no page asks twice.
 */
export function MarketingFooter() {
  const pathname = usePathname() ?? ""
  const hasSignUp = pagesWithSignUp.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  return <SiteFooter newsletter={!hasSignUp} />
}
