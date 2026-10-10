"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarPanel } from "@/components/viewer/sidebar-panel"

/**
 * Navigation below lg, where there is no sidebar: one small frosted button
 * floating in the top corner, which opens the sidebar's panel in a sheet
 * from the left. There is no top bar, so the page keeps the whole screen.
 */
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
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className="fixed top-3 left-3 z-(--z-header) border-border bg-background/80 backdrop-blur-glass lg:hidden"
          />
        }
        aria-label="Open navigation"
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-(--sidebar-width-mobile) max-w-[calc(100%-3rem)] p-0"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarPanel
          onNavigate={close}
          end={
            <SheetClose render={<Button variant="ghost" size="icon-sm" />} aria-label="Close navigation">
              <XIcon aria-hidden="true" />
            </SheetClose>
          }
        />
      </SheetContent>
    </Sheet>
  )
}
