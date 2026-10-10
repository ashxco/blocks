"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Wordmark } from "@/components/blocks/wordmark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Routes that need the full width instead of the split screen. */
const WIDE_ROUTES = ["/live/onboarding"]

/** Routes that end on the form below lg: a testimonial is off-key for someone locked out. */
const NO_COMPACT_ROUTES = ["/live/forgot-password"]

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

const legalLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Contact", href: "/live/contact" },
]

/**
 * Picks the frame for the current account route. The aside is rendered on the
 * server and passed in, so only the frame switch runs on the client.
 */
export function AuthFrame({
  aside,
  asideByRoute = {},
  compact,
  children,
}: {
  aside: React.ReactNode
  /** A different aside for some routes, keyed by route, e.g. { "/live/sign-up": <AuthShowcase variant="sign-up" /> }. */
  asideByRoute?: Record<string, React.ReactNode>
  /** Smaller brand moment shown under the form below lg, where the aside is hidden. */
  compact?: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? ""
  const wide = matches(pathname, WIDE_ROUTES)
  const showCompact = !matches(pathname, NO_COMPACT_ROUTES)
  const routeAside = Object.entries(asideByRoute).find(([route]) => matches(pathname, [route]))?.[1]

  return (
    <div data-slot="auth-frame" data-layout={wide ? "wide" : "split"} className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-5 py-2.5 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-toast)"
      >
        Skip to content
      </a>
      {wide ? (
        <WideFrame>{children}</WideFrame>
      ) : (
        <SplitFrame aside={routeAside ?? aside} compact={showCompact ? compact : null}>
          {children}
        </SplitFrame>
      )}
    </div>
  )
}

function SplitFrame({
  aside,
  compact,
  children,
}: {
  aside: React.ReactNode
  compact?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-gutter lg:px-10 xl:px-14">
        <header className="flex h-(--header-height) shrink-0 items-center">
          <Wordmark />
        </header>
        <main id="main" className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
          <div className="w-full max-w-104">{children}</div>
          {compact ? <div className="mt-14 w-full max-w-104 lg:hidden">{compact}</div> : null}
        </main>
        <AuthFooter />
      </div>
      {/* Sticky and one viewport tall (or its content's height on short screens), so the headline, the project
          preview and the quote stay in view beside long forms instead of stretching with them. */}
      <aside
        aria-label="Acme at work"
        className="hidden min-w-0 p-3 lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:flex-col lg:self-start"
      >
        {aside}
      </aside>
    </div>
  )
}

function WideFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header, content and footer share container-page, so their edges line up. */}
      <header className="container-page flex h-(--header-height) shrink-0 items-center justify-between gap-6">
        <Wordmark />
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden truncate text-caption text-muted-foreground sm:inline">
            Signed in as <span className="font-semibold text-foreground">maya@acme.com</span>
          </span>
          {/* The negative margin cancels the ghost padding, so the label sits on the gutter. */}
          <Button
            variant="ghost"
            size="sm"
            className="-mr-(--button-padding-x-sm)"
            nativeButton={false}
            render={<Link href="/live/sign-in" />}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <div className="container-page">
        <AuthFooter />
      </div>
    </div>
  )
}

const footerLink =
  "rounded-xs outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"

function AuthFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t py-6 text-caption text-muted-foreground",
        className
      )}
    >
      <p>© 2026 Acme Inc.</p>
      <nav aria-label="Legal">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={footerLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}
