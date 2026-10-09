"use client"

import * as React from "react"
import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  Columns3Icon,
  CopyIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  SettingsIcon,
  SunIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, blurWithin, useReturnFocus } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Stage = HTMLDivElement | null

/**
 * The examples show their menus already open, portalled into a stage inside
 * the example so they follow its theme, and isolate keeps their z-index
 * inside the example so they scroll under the site header. A shown menu
 * stays open while people click elsewhere on the page; its trigger, an item
 * or Escape close it.
 */
function MenuStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  useReturnFocus(container)
  return (
    <div ref={setContainer} className={cn("relative isolate flex w-full items-start justify-center", className)}>
      {children(container)}
    </div>
  )
}

/**
 * Open on load, non-modal, and kept open when people click or tab elsewhere.
 * It only opens once the stage exists, so the menu is placed inside the stage
 * from its first frame instead of against <body>.
 */
function useShownMenu(container: Stage) {
  const [open, setOpen] = React.useState(true)
  const onOpenChange = React.useCallback((next: boolean, details: { reason: string }) => {
    if (!next && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setOpen(next)
  }, [])
  return { open: open && container !== null, onOpenChange, modal: false }
}

/**
 * Shown menus keep their side and their full height as the page scrolls, so
 * they never flip over the example's own text, and the wheel carries on to
 * the page over them. Each stage leaves room below.
 */
function pinnedTo(container: Stage) {
  return { collisionAvoidance: { side: "none" }, collisionBoundary: container ?? undefined, className: "max-h-none overscroll-auto" } as const
}

const columns = [
  { id: "status", label: "Status" },
  { id: "branch", label: "Branch" },
  { id: "commit", label: "Commit" },
  { id: "duration", label: "Build time" },
  { id: "author", label: "Author" },
]

function ColumnsMenu({ container }: { container: Stage }) {
  const shown = useShownMenu(container)
  const [visible, setVisible] = React.useState<Record<string, boolean>>({
    status: true,
    branch: true,
    commit: true,
    duration: false,
    author: true,
  })

  return (
    <DropdownMenu {...shown}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Columns3Icon data-icon="inline-start" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent container={container} {...pinnedTo(container)}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={visible[column.id]}
              onCheckedChange={(checked) => setVisible((current) => ({ ...current, [column.id]: checked }))}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "duration", label: "Slowest build" },
  { value: "name", label: "Branch name" },
]

function SortMenu({ container }: { container: Stage }) {
  const shown = useShownMenu(container)
  const [sort, setSort] = React.useState("newest")
  const current = sortOptions.find((option) => option.value === sort)

  return (
    <DropdownMenu {...shown}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <ArrowDownUpIcon data-icon="inline-start" />
        {current?.label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent container={container} {...pinnedTo(container)}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort deployments</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(String(value))}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountMenu({ container }: { container: Stage }) {
  const shown = useShownMenu(container)
  const [theme, setTheme] = React.useState("system")

  return (
    <DropdownMenu {...shown}>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-auto gap-3 rounded-full py-1.5 pr-3 pl-1.5" />}
      >
        <Avatar size="sm">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        Priya Raman
        <ChevronDownIcon data-icon="inline-end" className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        container={container}
        {...pinnedTo(container)}
        className={cn(pinnedTo(container).className, "min-w-(--menu-min-width-lg)")}
      >
        <div className="grid gap-0.5 px-2.5 pt-2 pb-2.5">
          <p className="text-sm font-semibold text-foreground">Priya Raman</p>
          <p className="truncate text-caption text-muted-foreground">priya@lumen.app</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UsersIcon />
            Team
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(String(value))}>
            <DropdownMenuRadioItem value="light">
              <SunIcon />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <MoonIcon />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <MonitorIcon />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoyIcon />
          Help and support
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ActionsMenu({ container }: { container: Stage }) {
  const shown = useShownMenu(container)

  return (
    <DropdownMenu {...shown}>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Deployment options" />}>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" container={container} {...pinnedTo(container)}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Visit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy URL
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RotateCcwIcon />
            Redeploy
            <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilIcon />
            Edit build settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete deployment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Two --menu-min-width panels and the gap between them. */
const SIDE_BY_SIDE_REM = 26

function ProjectMenu({ container }: { container: Stage }) {
  const shown = useShownMenu(container)
  // The submenu is open on load too, beside its trigger, and stays open on
  // outside clicks like the menu. Hovering another item closes it, as in an app.
  // It opens once the menu has settled in place, so it is placed beside the
  // item's final position, then hands focus back to the page. A stage too
  // narrow for both panels side by side (a phone) leaves it closed: there it
  // would open over its own menu.
  const [subOpen, setSubOpen] = React.useState(false)
  const shownOpen = shown.open
  React.useEffect(() => {
    if (!shownOpen || !container) return
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const roomForBoth = container.clientWidth >= SIDE_BY_SIDE_REM * rem
    const open = roomForBoth ? window.setTimeout(() => setSubOpen(true), 320) : undefined
    const blur = window.setTimeout(() => blurWithin(container), 480)
    return () => {
      window.clearTimeout(open)
      window.clearTimeout(blur)
    }
  }, [shownOpen, container])
  const onSubOpenChange = React.useCallback((next: boolean, details: { reason: string }) => {
    if (!next && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setSubOpen(next)
  }, [])

  return (
    <DropdownMenu {...shown}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Project
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent container={container} {...pinnedTo(container)}>
        <DropdownMenuItem>
          <PencilIcon />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSub open={subOpen && shown.open} onOpenChange={onSubOpenChange}>
          <DropdownMenuSubTrigger>
            <FolderInputIcon />
            Move to team
          </DropdownMenuSubTrigger>
          {/* Lined up with its item while the page scrolls, like the pinned menu. */}
          <DropdownMenuSubContent collisionAvoidance={{ align: "none" }}>
            <DropdownMenuItem>Lumen Labs</DropdownMenuItem>
            <DropdownMenuItem>Marketing site</DropdownMenuItem>
            <DropdownMenuItem>Internal tools</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Create a team</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <CopyIcon />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function DropdownMenuDocs() {
  return (
    <Examples>
      <Example
        title="Actions"
        description="Group related actions, put shortcuts on the right and keep the destructive action last, after a separator."
        code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Deployment options" />}>
    <MoreHorizontalIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <ExternalLinkIcon />
        Visit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CopyIcon />
        Copy URL
        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash2Icon />
      Delete deployment
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <MenuStage className="min-h-68">{(container) => <ActionsMenu container={container} />}</MenuStage>
      </Example>

      <Example
        title="Checkbox items"
        description="Toggle several options. Checkbox items keep the menu open, so people can change more than one in a row."
        code={`<DropdownMenuCheckboxItem
  checked={visible.branch}
  onCheckedChange={(checked) => setVisible({ ...visible, branch: checked })}
>
  Branch
</DropdownMenuCheckboxItem>`}
      >
        <MenuStage className="min-h-72">{(container) => <ColumnsMenu container={container} />}</MenuStage>
      </Example>

      <Example
        title="Radio items"
        description="Pick one option from a set. Show the current choice in the trigger so people can see it without opening the menu."
        code={`<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
  <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
      >
        <MenuStage className="min-h-64">{(container) => <SortMenu container={container} />}</MenuStage>
      </Example>

      <Example
        title="Submenu"
        description="Nest a short list behind a sub-trigger. It opens on hover or with the right arrow key, beside the item that opened it."
        code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>Move to team</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Lumen Labs</DropdownMenuItem>
    <DropdownMenuItem>Marketing site</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>`}
      >
        <MenuStage className="min-h-72">
          {(container) => <ProjectMenu container={container} />}
        </MenuStage>
      </Example>

      <Example
        title="Account menu"
        description="A realistic composition: identity at the top, grouped links, a theme choice and sign out at the end."
      >
        <MenuStage className="min-h-128">{(container) => <AccountMenu container={container} />}</MenuStage>
      </Example>

      <Guidelines
        do={[
          "Use a dropdown menu for actions or options behind one button.",
          "Start item labels with a verb when they run an action: “Copy URL”, “Redeploy”.",
          "Put the destructive item last, after a separator, and confirm it with an alert dialog.",
          "Give an icon-only trigger an aria-label.",
        ]}
        dont={[
          "Don’t use a dropdown menu to pick a form value. Use a select or combobox.",
          "Don’t nest submenus more than one level deep.",
          "Don’t mix icons and no icons in one group. Use inset on items without an icon.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "On DropdownMenuContent. Alignment with the trigger." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "On DropdownMenuContent. Preferred side of the trigger." },
          { prop: "sideOffset", type: "number", default: "6", description: "On DropdownMenuContent. Gap from the trigger, in pixels." },
          { prop: "variant", type: '"default" | "destructive"', default: '"default"', description: "On DropdownMenuItem. Destructive items use text-destructive." },
          { prop: "inset", type: "boolean", default: "false", description: "On items and labels. Indents text to line up with items that have an icon." },
          { prop: "closeOnClick", type: "boolean", default: "true", description: "On items. Whether choosing the item closes the menu. Checkbox and radio items stay open by default." },
          { prop: "disabled", type: "boolean", default: "false", description: "On items. Dims the item and skips it in keyboard navigation." },
          { prop: "render", type: "ReactElement", description: "On DropdownMenuTrigger and DropdownMenuItem. Render as a Button or a Link." },
        ]}
      />
    </Examples>
  )
}
