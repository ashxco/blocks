"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BookOpenIcon,
  FilePlusIcon,
  FolderPlusIcon,
  LinkIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SquarePenIcon,
  SunIcon,
  UserPlusIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandFooter,
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
   * "auto" is a search field when its container (the nearest @container,
   * such as the top bar) is at least 44rem wide and an icon below that, as
   * in AppShell; "search" and "icon" force one; "none" renders no trigger,
   * for when you open the menu yourself (see CommandMenuButton).
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

const WORKSPACE_URL = "https://app.acme.com/acme"

const actions: ActionItem[] = [
  {
    label: "Create task",
    icon: SquarePenIcon,
    keywords: ["new", "todo", "add", "assign"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Create project",
    icon: FolderPlusIcon,
    keywords: ["new", "template", "board", "timeline"],
    run: (router) => router.push("/live/onboarding?step=template"),
  },
  {
    label: "Write a doc",
    icon: FilePlusIcon,
    keywords: ["new", "spec", "notes", "meeting"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Create automation",
    icon: ZapIcon,
    keywords: ["rule", "when", "trigger", "notify"],
    run: (router) => router.push("/live/app/projects"),
  },
  {
    label: "Invite members",
    icon: UserPlusIcon,
    keywords: ["teammate", "team", "guest", "add", "invite"],
    run: (router) => router.push("/live/app/team"),
  },
  {
    label: "Copy workspace link",
    icon: LinkIcon,
    keywords: ["url", "share", "address"],
    run: () => {
      void navigator.clipboard?.writeText(WORKSPACE_URL).catch(() => undefined)
      toast.add({
        title: "Copied the workspace link",
        description: WORKSPACE_URL,
        type: "success",
      })
    },
  },
  {
    label: "Read the guides",
    icon: BookOpenIcon,
    keywords: ["docs", "help", "how to"],
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
        "w-3xs justify-between gap-3 border-border bg-muted pr-1.5 text-muted-foreground hover:border-border-strong hover:text-foreground",
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

  return (
    <>
      {trigger === "auto" ? (
        <>
          <CommandMenuButton
            onClick={() => setOpen(true)}
            className={cn("hidden @min-[44rem]:inline-flex", className)}
          />
          <CommandMenuButton
            variant="icon"
            onClick={() => setOpen(true)}
            className={cn("@min-[44rem]:hidden", className)}
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
          className="top-[16vh] translate-y-0 gap-0 overflow-hidden p-0"
        >
          <DialogTitle className="sr-only">Command menu</DialogTitle>
          <DialogDescription className="sr-only">
            Search for a page or an action, then press Enter to run it.
          </DialogDescription>
          <CommandPalette
            placeholder={placeholder}
            onRun={() => setOpen(false)}
            dialog
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * The palette itself: search, then navigation, actions and theme, with key
 * hints in the footer. CommandMenu shows it in a dialog; CommandMenuPanel
 * shows it inline.
 */
function CommandPalette({
  placeholder,
  onRun,
  dialog = false,
}: {
  placeholder: string
  /** Called before a chosen item runs, for example to close the dialog. */
  onRun?: () => void
  /** In the dialog, the footer also says how to close it. */
  dialog?: boolean
}) {
  const router = useRouter()
  const { theme: savedTheme, forcedTheme, setTheme } = useTheme()
  // The theme is only known in the browser. Inline, the palette renders on the
  // server too, so the current theme is marked after hydration to keep the two
  // renders identical. A page can force a theme (?theme=dark); mark that one.
  const hydrated = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
  const theme = hydrated ? (forcedTheme ?? savedTheme) : undefined

  function run(callback: () => void) {
    onRun?.()
    callback()
  }

  return (
    <Command loop className="bg-popover">
      <CommandInput placeholder={placeholder} />
      {/* In the dialog the list scrolls within the viewport; inline it shows every group whole. */}
      <CommandList
        className={cn(
          "p-(--overlay-padding)",
          dialog ? "max-h-[min(24rem,50vh)]" : "max-h-none"
        )}
      >
        <CommandEmpty>
          <span className="text-label text-foreground">No results</span>
          <span className="mt-1 block text-caption text-muted-foreground">
            Try a page name such as Billing, or an action such as “task”.
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
      <CommandFooter>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          Move
        </span>
        <span>
          <Kbd>↵</Kbd>
          Open
        </span>
        {dialog ? (
          <span className="ml-auto">
            <Kbd>Esc</Kbd>
            Close
          </span>
        ) : null}
      </CommandFooter>
    </Command>
  )
}

export interface CommandMenuPanelProps {
  /** Placeholder for the search input. */
  placeholder?: string
  className?: string
}

/**
 * The palette on its own bordered surface, without the dialog or a trigger:
 * for a docs preview of the open state, an empty-state search or a page that
 * keeps search open.
 */
export function CommandMenuPanel({
  placeholder = "Search pages and actions",
  className,
}: CommandMenuPanelProps) {
  return (
    <div
      data-slot="command-menu-panel"
      className={cn(
        "w-full max-w-(--dialog-width) overflow-hidden rounded-(--dialog-radius) border bg-popover text-popover-foreground",
        className
      )}
    >
      <CommandPalette placeholder={placeholder} />
    </div>
  )
}
