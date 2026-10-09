"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Wordmark } from "@/components/blocks/site-header/wordmark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export { Wordmark } from "@/components/blocks/site-header/wordmark"

export interface SiteHeaderLink {
  label: string
  href: string
}

export interface SiteHeaderProps {
  className?: string
  /** Centre navigation links. */
  links?: SiteHeaderLink[]
  /** Start in the solid state instead of waiting for the page to scroll. */
  solid?: boolean
}

export const siteHeaderLinks: SiteHeaderLink[] = [
  { label: "Features", href: "/live/features" },
  { label: "Pricing", href: "/live/pricing" },
  { label: "Changelog", href: "/live/changelog" },
  { label: "Blog", href: "/live/blog" },
  { label: "About", href: "/live/about" },
  { label: "Contact", href: "/live/contact" },
]

/** The bar switches to the full menu at this container width, in rem (lg). */
const WIDE_REM = 64
const SCROLL_THRESHOLD = 8

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Nearest ancestor that scrolls vertically, or null for the window. An
 * overflow-x wrapper also computes overflow-y to auto, so "auto" only counts
 * when the element actually overflows.
 */
function getScrollRoot(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if (overflowY === "scroll" || (overflowY === "auto" && el.scrollHeight > el.clientHeight)) return el
    el = el.parentElement
  }
  return null
}

/**
 * Full-width site header. Transparent at the top of the page; once the page
 * scrolls it turns into frosted glass with a hairline. Below lg, a menu button
 * opens a full-screen menu.
 */
export function SiteHeader({ className, links = siteHeaderLinks, solid = false }: SiteHeaderProps) {
  const pathname = usePathname()
  const menuId = React.useId()
  const headerRef = React.useRef<HTMLElement>(null)
  const barRef = React.useRef<HTMLDivElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const scrollRoot = React.useRef<HTMLElement | null>(null)
  const [open, setOpen] = React.useState(false)

  // Close the menu when the route changes.
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // Solid once the nearest scroll container (usually the window) has scrolled.
  const scrolled = React.useSyncExternalStore(
    React.useCallback((onChange: () => void) => {
      const root = getScrollRoot(headerRef.current)
      scrollRoot.current = root
      const target: HTMLElement | Window = root ?? window
      target.addEventListener("scroll", onChange, { passive: true })
      return () => target.removeEventListener("scroll", onChange)
    }, []),
    () => {
      const root = scrollRoot.current
      return (root ? root.scrollTop : window.scrollY) > SCROLL_THRESHOLD
    },
    () => false
  )

  // While open: lock scroll, close on Escape, close when the bar grows wide.
  React.useEffect(() => {
    if (!open) return
    const root = scrollRoot.current
    const locked = root ?? document.body
    const gap = root ? root.offsetWidth - root.clientWidth : window.innerWidth - document.documentElement.clientWidth
    const previous = { overflow: locked.style.overflow, paddingRight: locked.style.paddingRight }
    locked.style.overflow = "hidden"
    if (gap > 0) locked.style.paddingRight = `${gap}px`

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width >= WIDE_REM * rem) setOpen(false)
    })
    if (barRef.current) observer.observe(barRef.current)

    return () => {
      locked.style.overflow = previous.overflow
      locked.style.paddingRight = previous.paddingRight
      document.removeEventListener("keydown", onKeyDown)
      observer.disconnect()
    }
  }, [open])

  const glass = solid || scrolled

  return (
    <header
      ref={headerRef}
      data-slot="site-header"
      data-scrolled={glass ? "" : undefined}
      data-open={open ? "" : undefined}
      className={cn("sticky top-0 w-full", open ? "z-(--z-overlay)" : "z-(--z-header)", className)}
    >
      {/* Background layer. Kept separate so the blur never traps the fixed menu. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-1 border-b transition-[background-color,border-color] duration-(--duration-base) ease-standard",
          open
            ? "border-border bg-background"
            : glass
              ? "border-border bg-background/85 backdrop-blur-glass"
              : "border-transparent"
        )}
      />

      <div ref={barRef} className="@container/bar relative z-2">
        <div className="container-page grid h-(--header-height) grid-cols-[1fr_auto] items-center gap-6 @min-[64rem]/bar:grid-cols-[1fr_auto_1fr]">
          <Wordmark />

          <nav aria-label="Main" className="hidden @min-[64rem]/bar:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "relative rounded-xs py-2 text-label text-foreground outline-none after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-foreground focus-visible:focus-ring"
                          : "relative rounded-xs py-2 text-label text-copy outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-5">
            <Link
              href="/live/sign-in"
              className="hidden rounded-xs text-label text-copy outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring @min-[64rem]/bar:inline"
            >
              Log in
            </Link>
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/live/sign-up" />}
              className="hidden @min-[64rem]/bar:inline-flex"
            >
              Get started
            </Button>
            <Button
              ref={toggleRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="-mr-2.5 hover:bg-transparent aria-expanded:bg-transparent @min-[64rem]/bar:hidden"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3 top-1/2 -mt-px h-0.5 rounded-full bg-current transition-[translate,rotate] duration-(--duration-base) ease-out",
                  open ? "translate-y-0 rotate-45" : "-translate-y-1"
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3 top-1/2 -mt-px h-0.5 rounded-full bg-current transition-[translate,rotate] duration-(--duration-base) ease-out",
                  open ? "translate-y-0 -rotate-45" : "translate-y-1"
                )}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Full-screen menu, below lg. */}
      <div
        id={menuId}
        inert={!open}
        className={cn(
          "fixed inset-0 z-0 flex flex-col overflow-y-auto bg-background pt-(--header-height)",
          "transition-[opacity,visibility] duration-(--duration-base) ease-out",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav aria-label="Main" className="container-page flex-1 pt-4">
          <ul className="grid">
            {links.map((link, index) => {
              const active = isActive(pathname, link.href)
              return (
                <li
                  key={link.href}
                  style={{ transitionDelay: open ? `${60 + index * 35}ms` : "0ms" }}
                  className={cn(
                    "border-b transition-[opacity,translate] duration-(--duration-slow) ease-out",
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  )}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={
                      active
                        ? "block rounded-xs py-4 text-h2 text-brand outline-none focus-visible:focus-ring"
                        : "block rounded-xs py-4 text-h2 text-foreground outline-none transition-colors duration-(--duration-fast) hover:text-copy focus-visible:focus-ring"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div
          style={{ transitionDelay: open ? `${60 + links.length * 35}ms` : "0ms" }}
          className={cn(
            "container-page grid gap-3 pt-8 pb-10 transition-[opacity,translate] duration-(--duration-slow) ease-out sm:grid-cols-2",
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/live/sign-up" onClick={() => setOpen(false)} />}
            className="w-full"
          >
            Get started
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/live/sign-in" onClick={() => setOpen(false)} />}
            className="w-full"
          >
            Log in
          </Button>
        </div>
      </div>
    </header>
  )
}
