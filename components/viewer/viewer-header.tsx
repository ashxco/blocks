"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRightIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/components/viewer/cn"
import { CommandPalette } from "@/components/viewer/command-palette"
import { MobileMenu } from "@/components/viewer/mobile-menu"
import { navSections, sectionForPath } from "@/components/viewer/nav"
import { OPEN_SEARCH_EVENT, useModKey } from "@/components/viewer/search-trigger"
import { ThemeToggle } from "@/components/viewer/theme-toggle"
import { Wordmark } from "@/components/viewer/wordmark"

function useScrolled(threshold = 4) {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [threshold])
  return scrolled
}

/**
 * The slim top bar: wordmark, section links, search (⌘K), theme switch and a
 * link to the live templates. It blends into the page and turns into frosted
 * glass with a hairline once the page scrolls.
 */
export function ViewerHeader() {
  const pathname = usePathname()
  const scrolled = useScrolled()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const active = sectionForPath(pathname)
  const mod = useModKey()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    function onOpen() {
      setSearchOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen)
    }
  }, [])

  return (
    <header
      data-scrolled={scrolled || undefined}
      style={{ viewTransitionName: "viewer-header" }}
      className={cn(
        "sticky top-0 z-(--z-header) border-b border-transparent bg-background",
        "transition-[background-color,border-color] duration-(--duration-base) ease-standard",
        "data-[scrolled]:border-border data-[scrolled]:bg-background/80 data-[scrolled]:backdrop-blur-glass"
      )}
    >
      <div className="flex h-(--viewer-bar) items-center gap-4 px-gutter lg:gap-8">
        <Wordmark />

        <nav aria-label="Sections" className="hidden h-full items-center gap-1 md:flex">
          {navSections.map((section) => {
            const isActive = active === section.id
            return (
              <Link
                key={section.id}
                href={section.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center px-3 text-label outline-none",
                  "transition-colors duration-(--duration-fast) focus-visible:focus-ring",
                  "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 after:transition-opacity after:duration-(--duration-base)",
                  isActive ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.title}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search Blocks"
            aria-keyshortcuts="Meta+K Control+K"
            className={cn(
              "group/search flex h-(--button-height-sm) items-center gap-2 rounded-(--button-radius) border border-transparent text-label text-muted-foreground outline-none",
              "transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring",
              "w-(--button-height-sm) justify-center sm:w-44 sm:justify-start sm:border-border sm:bg-muted sm:pr-1.5 sm:pl-3.5 sm:hover:border-border-strong xl:w-56"
            )}
          >
            <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
            <span className="hidden font-medium sm:inline">Search</span>
            <kbd
              aria-hidden="true"
              className="ml-auto hidden h-6 items-center rounded-full border bg-background px-2 font-mono text-xs text-muted-foreground sm:inline-flex"
            >
              {mod}K
            </kbd>
          </button>

          <ThemeToggle />

          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/live" />}
            className="hidden lg:inline-flex"
          >
            Live templates
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>

          <MobileMenu />
        </div>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
