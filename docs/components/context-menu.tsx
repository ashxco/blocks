"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  CircleIcon,
  CopyIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  LinkIcon,
  PencilIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, useReturnFocus } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/components/blocks/members-list/people"
import { Badge } from "@/components/ui/badge"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const docs = [
  { name: "Briefs", kind: "folder" },
  { name: "Meeting notes", kind: "folder" },
  { name: "Research", kind: "folder" },
  { name: "Launch plan", kind: "doc" },
  { name: "Homepage copy", kind: "doc" },
  { name: "Launch-day FAQ", kind: "doc" },
] as const

const docIcon = { folder: FolderIcon, doc: FileTextIcon }

type Stage = HTMLDivElement | null

/**
 * The examples show their menus already open, as if someone had just
 * right-clicked, portalled into a stage inside the example so they follow its
 * theme and stay under the site header. contain-layout makes the stage the
 * containing block for the fixed menu, so it scrolls with the page.
 */
function MenuStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  useReturnFocus(container)
  return (
    <div ref={setContainer} className={cn("relative flex w-full items-start justify-center contain-layout", className)}>
      {children(container)}
    </div>
  )
}

/**
 * Each example shows its menu open on load at a marked point inside the
 * trigger (`point`), as if someone had just right-clicked there. A real
 * context menu is always modal, which would lock the page's scroll, so the
 * open-on-load copy is a plain non-modal menu with the same items and styles.
 * It stays open when people click or tab elsewhere; an item, Escape or a real
 * right-click on the trigger closes it, and from then on the trigger opens the
 * real context menu at the pointer.
 */
function useShownContextMenu(container: Stage) {
  const [shown, setShown] = React.useState(true)
  const [point, setPoint] = React.useState<HTMLSpanElement | null>(null)
  const onOpenChange = React.useCallback((next: boolean, details: { reason: string }) => {
    if (!next && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setShown(next)
  }, [])

  return {
    trigger: { onContextMenu: () => setShown(false), "data-shown": shown || undefined },
    /** The real context menu, for right-clicks. */
    content: { container },
    /** The non-modal copy that is open on load, anchored at `point`. */
    showcase: {
      root: { open: shown && container !== null && point !== null, onOpenChange, modal: false },
      content: {
        container,
        anchor: point,
        collisionAvoidance: { side: "none" },
        collisionBoundary: container ?? undefined,
        className: "max-h-none overscroll-auto",
      } as const,
    },
    /** Render where the menu opens on load. Place it with left-* and top-* classes. */
    point: (className: string) => (
      <span ref={setPoint} aria-hidden="true" className={cn("pointer-events-none absolute size-0", className)} />
    ),
  }
}

/** The real context menu on `trigger`, plus the copy of it that is open on load. */
function ShownContextMenu({
  shown,
  trigger,
  children,
}: {
  shown: ReturnType<typeof useShownContextMenu>
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <ContextMenu>
        {trigger}
        <ContextMenuContent {...shown.content}>{children}</ContextMenuContent>
      </ContextMenu>
      <DropdownMenu {...shown.showcase.root}>
        <ContextMenuContent {...shown.showcase.content}>{children}</ContextMenuContent>
      </DropdownMenu>
    </>
  )
}

const tasks = [
  { title: "Outline the key messages", initials: "PR", due: "Oct 6", done: true, overdue: false },
  { title: "Approve the hero copy", initials: "HK", due: "Oct 7", done: false, overdue: true },
  { title: "Set up redirects for old blog URLs", initials: "JL", due: "Oct 8", done: false, overdue: true },
  { title: "Final homepage illustrations", initials: "SA", due: "Oct 16", done: false, overdue: false },
]

function TaskListView({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)
  const [dueDates, setDueDates] = React.useState(true)
  const [assignees, setAssignees] = React.useState(true)
  const [filter, setFilter] = React.useState("all")

  const rows = tasks.filter(
    (task) => filter === "all" || (filter === "open" && !task.done) || (filter === "overdue" && task.overdue)
  )

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="relative grid w-full max-w-120 grid-cols-[minmax(0,1fr)] rounded-(--card-radius) border bg-card p-(--overlay-padding)"
        >
          {/* Below the list on narrow stages and at the right edge when there is room, so the menu never covers the rows whose view options it changes. */}
          {shown.point("top-full left-[20%] @4xl:top-1/2 @4xl:left-[97%]")}
          <p className="px-2.5 pt-1.5 pb-2 text-caption font-semibold text-muted-foreground">Website relaunch · Tasks</p>
          <ul className="grid grid-cols-[minmax(0,1fr)]">
            {rows.map((task) => (
              <li
                key={task.title}
                className="flex h-(--table-row-height-sm) items-center gap-2.5 rounded-(--overlay-item-radius) px-2.5 text-sm"
              >
                {task.done ? (
                  <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" />
                ) : (
                  <CircleIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span
                  className={
                    task.done ? "min-w-0 flex-1 truncate text-muted-foreground line-through" : "min-w-0 flex-1 truncate font-medium text-foreground"
                  }
                >
                  {task.title}
                </span>
                {dueDates ? (
                  <span
                    className={
                      task.overdue ? "shrink-0 text-caption text-destructive tabular" : "shrink-0 text-caption text-muted-foreground tabular"
                    }
                  >
                    {task.due}
                  </span>
                ) : null}
                {assignees ? (
                  <Avatar size="sm">
                    <AvatarFallback tone={initialsTone(task.initials)}>{task.initials}</AvatarFallback>
                  </Avatar>
                ) : null}
              </li>
            ))}
          </ul>
        </ContextMenuTrigger>
      }
    >
      <ContextMenuGroup>
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem checked={dueDates} onCheckedChange={setDueDates}>
          Show due dates
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={assignees} onCheckedChange={setAssignees}>
          Show assignees
        </ContextMenuCheckboxItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Show</ContextMenuLabel>
        <ContextMenuRadioGroup value={filter} onValueChange={(value) => setFilter(String(value))}>
          <ContextMenuRadioItem value="all">All tasks</ContextMenuRadioItem>
          <ContextMenuRadioItem value="open">Open tasks</ContextMenuRadioItem>
          <ContextMenuRadioItem value="overdue">Overdue only</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ShownContextMenu>
  )
}

function TaskCard({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="relative grid w-full max-w-96 gap-3 rounded-(--card-radius) border bg-card p-(--card-padding) text-left"
        >
          {shown.point("top-[92%] left-[30%] @lg:left-[70%]")}
          <div className="flex items-center justify-between gap-3">
            <p className="text-title text-foreground">Write the launch announcement</p>
            <Badge variant="brand">In review</Badge>
          </div>
          <p className="text-sm text-copy">Priya Raman · Due Oct 14 · High</p>
        </ContextMenuTrigger>
      }
    >
      <ContextMenuGroup>
        <ContextMenuItem>
          <CircleCheckIcon />
          Mark as done
          <ContextMenuShortcut>⌘↵</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <UserIcon />
          Assign to me
          <ContextMenuShortcut>I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <LinkIcon />
          Copy link
          <ContextMenuShortcut>⌘L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <Trash2Icon />
        Delete task
      </ContextMenuItem>
    </ShownContextMenu>
  )
}

/** The row that was right-clicked on load. */
const clickedDoc = "Launch plan"

function DocTree({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)
  // The row under the pointer stays highlighted while its menu is open.
  const [clicked, setClicked] = React.useState<string>(clickedDoc)

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="group/tree relative grid w-full max-w-80 rounded-(--card-radius) border bg-card p-(--overlay-padding)"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-caption font-semibold text-muted-foreground">Website relaunch · Docs</p>
          <ul className="grid">
            {docs.map((doc) => {
              const Icon = docIcon[doc.kind]
              const isClicked = doc.name === clicked
              return (
                <li
                  key={doc.name}
                  data-clicked={isClicked || undefined}
                  onContextMenu={() => setClicked(doc.name)}
                  className="relative flex h-(--overlay-item-height) items-center gap-2.5 rounded-(--overlay-item-radius) px-2.5 text-sm font-medium text-foreground hover:bg-accent group-data-popup-open/tree:data-clicked:bg-accent group-data-shown/tree:data-clicked:bg-accent"
                >
                  {doc.name === clickedDoc ? shown.point("top-1/2 left-[40%] @lg:left-[70%]") : null}
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{doc.name}</span>
                </li>
              )
            })}
          </ul>
        </ContextMenuTrigger>
      }
    >
      <ContextMenuGroup>
        <ContextMenuItem>
          <FilePlusIcon />
          New doc
          <ContextMenuShortcut>N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <FolderPlusIcon />
          New folder
          <ContextMenuShortcut>⇧N</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem>
          <PencilIcon />
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <CopyIcon />
            Copy
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Link</ContextMenuItem>
            <ContextMenuItem>Title</ContextMenuItem>
            <ContextMenuItem>Contents as Markdown</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <Trash2Icon />
        Delete
        <ContextMenuShortcut>⌫</ContextMenuShortcut>
      </ContextMenuItem>
    </ShownContextMenu>
  )
}

export default function ContextMenuDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="Right-click, or long-press on touch, to open actions for the thing under the pointer. The menu opens at the pointer."
        code={`<ContextMenu>
  <ContextMenuTrigger className="…">Write the launch announcement</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <CircleCheckIcon />
      Mark as done
    </ContextMenuItem>
    <ContextMenuItem>
      <LinkIcon />
      Copy link
      <ContextMenuShortcut>⌘L</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2Icon />
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
      >
        <MenuStage className="min-h-80">{(container) => <TaskCard container={container} />}</MenuStage>
      </Example>

      <Example
        title="Doc tree"
        description="A realistic composition. One menu covers the whole list, and the row under the pointer stays highlighted while it is open. The actions match the toolbar, so nothing lives only behind a right-click."
      >
        <MenuStage className="min-h-96">{(container) => <DocTree container={container} />}</MenuStage>
      </Example>

      <Example
        title="Checkbox and radio items"
        description="View options fit a context menu well: they change how something looks, not what it contains. Right-click the task list to try it."
        code={`<ContextMenuCheckboxItem checked={dueDates} onCheckedChange={setDueDates}>
  Show due dates
</ContextMenuCheckboxItem>

<ContextMenuRadioGroup value={filter} onValueChange={setFilter}>
  <ContextMenuRadioItem value="all">All tasks</ContextMenuRadioItem>
  <ContextMenuRadioItem value="overdue">Overdue only</ContextMenuRadioItem>
</ContextMenuRadioGroup>`}
      >
        <MenuStage className="min-h-128 @4xl:min-h-88">{(container) => <TaskListView container={container} />}</MenuStage>
      </Example>

      <Guidelines
        do={[
          "Use a context menu as a shortcut for actions people can also reach from a visible button.",
          "Scope it to the thing under the pointer: a row, a doc, a card.",
          "Keep the order the same as the matching dropdown menu, so people learn one layout.",
        ]}
        dont={[
          "Don’t hide actions that exist nowhere else behind a right-click.",
          "Don’t override the browser menu on text people may want to copy or links they may want to open.",
          "Don’t nest more than one level of submenu.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "className", type: "string", description: "On ContextMenuTrigger. Style the area that listens for right-click and long-press." },
          { prop: "variant", type: '"default" | "destructive"', default: '"default"', description: "On ContextMenuItem. Destructive items use text-destructive." },
          { prop: "inset", type: "boolean", default: "false", description: "On items and labels. Indents text to line up with items that have an icon." },
          { prop: "disabled", type: "boolean", default: "false", description: "On ContextMenu or an item. Turns off the whole menu, or dims one item." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"', default: '"right"', description: "On ContextMenuContent. The side of the pointer the menu opens on. It flips when there is no room." },
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "On ContextMenuContent. How the menu lines up with the pointer along that side." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "On ContextMenu. Called when the menu opens or closes." },
        ]}
      />
    </Examples>
  )
}
