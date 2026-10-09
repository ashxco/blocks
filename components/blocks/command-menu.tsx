"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BookOpenIcon,
  CopyIcon,
  GlobeIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  TerminalIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { appNav } from "@/components/blocks/app-shell/nav"

export interface CommandMenuProps {
  /** Controlled open state. Leave out to let the menu manage it. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Open and close with Cmd+K or Ctrl+K. Turn off when a page has more than one menu. */
  hotkey?: boolean
  /**
   * "auto" is a search field from the md breakpoint and an icon below it;
   * "search" and "icon" force one; "none" renders no trigger, for when you
   * open the menu yourself (see CommandMenuButton).
   */
  trigger?: "auto" | "search" | "icon" | "none"
  /** Placeholder for the search input. */
  placeholder?: string
  /** Classes for the trigger. */
  className?: string
}

interface ActionItem {
  label: string
  icon: LucideIcon
  keywords?: string[]
  run: (router: ReturnType<typeof useRouter>) => void
}

const actions: ActionItem[] = [
  {
    label: "Create project",
    icon: PlusIcon,
    keywords: ["new", "import", "repository"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Invite a teammate",
    icon: UserPlusIcon,
    keywords: ["member", "team", "add"],
    run: (router) => router.push("/live/app/team"),
  },
  {
    label: "Add a domain",
    icon: GlobeIcon,
    keywords: ["dns", "certificate", "https"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Open deployment logs",
    icon: TerminalIcon,
    keywords: ["build", "output", "errors"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Copy the CLI install command",
    icon: CopyIcon,
    keywords: ["npm", "install", "terminal"],
    run: () => {
      void navigator.clipboard
        ?.writeText("npm i -g lumen")
        .catch(() => undefined)
      toast.add({
        title: "Copied npm i -g lumen",
        description: "Paste it into your terminal to install the CLI.",
        type: "success",
      })
    },
  },
  {
    label: "Read the documentation",
    icon: BookOpenIcon,
    keywords: ["docs", "help", "guide"],
    run: (router) => router.push("/live/blog"),
  },
]

const themeOptions = [
  { value: "light", label: "Light theme", icon: SunIcon },
  { value: "dark", label: "Dark theme", icon: MoonIcon },
  { value: "system", label: "Match system theme", icon: MonitorIcon },
] as const

const subscribeNoop = () => () => {}

/** True on Apple platforms, so shortcuts read ⌘K there and Ctrl K elsewhere. */
function useIsMac() {
  return React.useSyncExternalStore(
    subscribeNoop,
    () =>
      /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent),
    () => true
  )
}

export interface CommandMenuButtonProps {
  /** "search" is a field-like button with the shortcut; "icon" is a ghost icon button. */
  variant?: "search" | "icon"
  onClick?: () => void
  className?: string
}

/** The trigger CommandMenu renders. Use it on its own with trigger="none" and a controlled menu. */
export function CommandMenuButton({
  variant = "search",
  onClick,
  className,
}: CommandMenuButtonProps) {
  const isMac = useIsMac()
  const shortcut = isMac ? "⌘K" : "Ctrl K"

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Search (${shortcut})`}
        onClick={onClick}
        className={className}
      >
        <SearchIcon />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-label={`Search (${shortcut})`}
      className={cn(
        "w-64 justify-between gap-3 border-border bg-muted pr-1.5 text-muted-foreground hover:border-border-strong hover:text-foreground",
        className
      )}
    >
      <span className="flex items-center gap-2">
        <SearchIcon aria-hidden="true" />
        <span className="font-normal">Search</span>
      </span>
      <Kbd>{shortcut}</Kbd>
    </Button>
  )
}

/**
 * A Cmd+K palette for jumping between pages, running common actions and
 * switching theme. Renders its own search trigger, or pass `open` and
 * `onOpenChange` to open it from elsewhere.
 */
export function CommandMenu({
  open: openProp,
  onOpenChange,
  hotkey = true,
  trigger = "auto",
  placeholder = "Search pages and actions",
  className,
}: CommandMenuProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (!hotkey) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hotkey, open, setOpen])

  function run(callback: () => void) {
    setOpen(false)
    callback()
  }

  return (
    <>
      {trigger === "auto" ? (
        <>
          <CommandMenuButton
            onClick={() => setOpen(true)}
            className={cn("hidden md:inline-flex", className)}
          />
          <CommandMenuButton
            variant="icon"
            onClick={() => setOpen(true)}
            className={cn("md:hidden", className)}
          />
        </>
      ) : null}
      {trigger === "search" || trigger === "icon" ? (
        <CommandMenuButton
          variant={trigger}
          onClick={() => setOpen(true)}
          className={className}
        />
      ) : null}

      <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
        <DialogContent
          showCloseButton={false}
          className="top-[16vh] max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-(--dialog-width)"
        >
          <DialogTitle className="sr-only">Command menu</DialogTitle>
          <DialogDescription className="sr-only">
            Search for a page or an action, then press Enter to run it.
          </DialogDescription>
          <Command loop className="bg-popover">
            <CommandInput placeholder={placeholder} />
            <CommandList className="max-h-[min(24rem,50vh)] p-(--overlay-padding)">
              <CommandEmpty>
                <span className="text-label text-foreground">No results</span>
                <span className="mt-1 block text-caption text-muted-foreground">
                  Try a page name such as Billing, or an action such as
                  “invite”.
                </span>
              </CommandEmpty>
              <CommandGroup heading="Navigation">
                {appNav.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`Go to ${item.title}`}
                    onSelect={() => run(() => router.push(item.href))}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                {actions.map((action) => (
                  <CommandItem
                    key={action.label}
                    value={action.label}
                    keywords={action.keywords}
                    onSelect={() => run(() => action.run(router))}
                  >
                    <action.icon />
                    <span>{action.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Theme">
                {themeOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={["theme", "appearance", option.value]}
                    data-checked={theme === option.value}
                    onSelect={() => run(() => setTheme(option.value))}
                  >
                    <option.icon />
                    <span>{option.label}</span>
                    {theme === option.value ? (
                      <span className="sr-only">(current)</span>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-caption text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                Move
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd>
                Open
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <Kbd>Esc</Kbd>
                Close
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
