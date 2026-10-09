"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Wordmark } from "@/components/blocks/site-header/wordmark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Routes that need the full width instead of the split screen. */
const WIDE_ROUTES = ["/live/onboarding"]

const legalLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Contact", href: "/live/contact" },
]

/**
 * Picks the frame for the current account route. The aside is rendered on the
 * server and passed in, so only the frame switch runs on the client.
 */
export function AuthFrame({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname() ?? ""
  const wide = WIDE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  return (
    <div data-slot="auth-frame" data-layout={wide ? "wide" : "split"} className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-5 py-2.5 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-toast)"
      >
        Skip to content
      </a>
      {wide ? <WideFrame>{children}</WideFrame> : <SplitFrame aside={aside}>{children}</SplitFrame>}
    </div>
  )
}

function SplitFrame({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-gutter lg:px-10 xl:px-14">
        <header className="flex h-(--header-height) shrink-0 items-center">
          <Wordmark />
        </header>
        <main id="main" className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
          <div className="w-full max-w-104">{children}</div>
        </main>
        <AuthFooter />
      </div>
      <aside aria-label="Lumen in production" className="hidden min-w-0 p-3 lg:block">
        {aside}
      </aside>
    </div>
  )
}

function WideFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-wide flex h-(--header-height) shrink-0 items-center justify-between gap-6">
        <Wordmark />
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden truncate text-caption text-muted-foreground sm:inline">
            Signed in as <span className="font-semibold text-foreground">maya@halcyon.dev</span>
          </span>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/live/sign-in" />}>
            Sign out
          </Button>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <div className="container-wide">
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
      <p>© 2026 Lumen, Inc.</p>
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
