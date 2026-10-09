"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowUpRightIcon, MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/components/viewer/cn"
import { SidebarNav } from "@/components/viewer/sidebar-nav"
import { ThemeToggle } from "@/components/viewer/theme-toggle"
import { Wordmark } from "@/components/viewer/wordmark"

/** Full-screen navigation for screens without the sidebar. */
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}
        aria-label="Open navigation"
      >
        <MenuIcon aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          className={cn(
            "fixed inset-0 z-(--z-overlay) flex flex-col bg-background text-copy outline-none",
            "transition-[opacity,translate] duration-(--duration-base) ease-out",
            "data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0"
          )}
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <div className="flex h-(--viewer-bar) shrink-0 items-center justify-between gap-4 border-b px-gutter">
            <Wordmark onClick={close} />
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <Dialog.Close
                render={<Button variant="ghost" size="icon-sm" />}
                aria-label="Close navigation"
              >
                <XIcon aria-hidden="true" />
              </Dialog.Close>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-gutter pt-6 pb-10">
            <SidebarNav onNavigate={close} />
          </div>
          <div className="shrink-0 border-t px-gutter py-4">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/live" onClick={close} />}
              className="w-full"
            >
              Open the live templates
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
