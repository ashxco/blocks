"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRightIcon, MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/viewer/sidebar-nav"
import { ThemeToggle } from "@/components/viewer/theme-toggle"
import { Wordmark } from "@/components/viewer/wordmark"

/** Navigation for screens without the sidebar: the system's own sheet, from the right. */
export function MobileMenu() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const close = React.useCallback(() => setOpen(false), [])

  // Close when the route changes, however it changed.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}
        aria-label="Open navigation"
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-(--sidebar-width-mobile) max-w-[calc(100%-3rem)]"
      >
        <SheetHeader className="h-(--viewer-bar) flex-row items-center justify-between gap-3 border-b py-0 pr-3">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Wordmark onClick={close} />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SheetClose render={<Button variant="ghost" size="icon-sm" />} aria-label="Close navigation">
              <XIcon aria-hidden="true" />
            </SheetClose>
          </div>
        </SheetHeader>
        <SheetBody className="pt-6">
          <SidebarNav onNavigate={close} />
        </SheetBody>
        <SheetFooter className="sm:flex-col sm:items-stretch">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="/live" target="_blank" rel="noopener" onClick={close} />}
            className="w-full"
          >
            Open the live templates
            <ArrowUpRightIcon data-icon="inline-end" />
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
