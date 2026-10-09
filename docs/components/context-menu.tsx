"use client"

import * as React from "react"
import {
  CopyIcon,
  ExternalLinkIcon,
  FileCodeIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  PencilIcon,
  RocketIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, useReturnFocus } from "@/docs/kit"
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

const files = [
  { name: "app", kind: "folder" },
  { name: "components", kind: "folder" },
  { name: "lib", kind: "folder" },
  { name: "next.config.ts", kind: "code" },
  { name: "package.json", kind: "code" },
  { name: "README.md", kind: "text" },
] as const

const fileIcon = { folder: FolderIcon, code: FileCodeIcon, text: FileTextIcon }

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

function LogViewer({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)
  const [timestamps, setTimestamps] = React.useState(true)
  const [wrap, setWrap] = React.useState(false)
  const [level, setLevel] = React.useState("all")

  const lines = [
    { time: "12:05:14", level: "warn", text: "Slow query on deployments (812ms)" },
    { time: "12:05:15", level: "info", text: "POST /api/deployments 201 in 230ms" },
    { time: "12:05:18", level: "error", text: "Webhook to hooks.slack.com timed out after 10s, retrying with backoff" },
    { time: "12:05:20", level: "info", text: "GET /api/usage 200 in 37ms" },
  ].filter((line) => level === "all" || line.level === level || (level === "warn" && line.level === "error"))

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="relative block w-full max-w-120 rounded-(--card-radius) border bg-terminal p-5 font-mono text-code text-terminal-foreground"
        >
          {shown.point("top-1/2 left-[30%] @lg:left-[56%]")}
          <ol className="grid gap-1.5">
            {lines.map((line) => (
              <li key={line.time} className={wrap ? "flex gap-3" : "flex gap-3 truncate"}>
                {timestamps ? <span className="shrink-0 opacity-60 tabular">{line.time}</span> : null}
                <span className={wrap ? undefined : "truncate"}>{line.text}</span>
              </li>
            ))}
          </ol>
        </ContextMenuTrigger>
      }
    >
      <ContextMenuGroup>
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem checked={timestamps} onCheckedChange={setTimestamps}>
          Show timestamps
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
          Wrap long lines
        </ContextMenuCheckboxItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Level</ContextMenuLabel>
        <ContextMenuRadioGroup value={level} onValueChange={(value) => setLevel(String(value))}>
          <ContextMenuRadioItem value="all">All lines</ContextMenuRadioItem>
          <ContextMenuRadioItem value="warn">Warnings and errors</ContextMenuRadioItem>
          <ContextMenuRadioItem value="error">Errors only</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ShownContextMenu>
  )
}

function DeploymentCard({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="relative grid w-full max-w-96 gap-3 rounded-(--card-radius) border bg-card p-(--card-padding) text-left"
        >
          {shown.point("top-[72%] left-[30%] @lg:left-[52%]")}
          <div className="flex items-center justify-between gap-3">
            <p className="text-title text-foreground">Deployment 8f2c1a9</p>
            <Badge variant="success">Ready</Badge>
          </div>
          <p className="text-sm text-copy">main · Priya Raman · 4 minutes ago</p>
        </ContextMenuTrigger>
      }
    >
      <ContextMenuGroup>
        <ContextMenuItem>
          <ExternalLinkIcon />
          Visit
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon />
          Copy URL
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <RotateCcwIcon />
          Redeploy
          <ContextMenuShortcut>⇧⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <RocketIcon />
          Promote to production
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <Trash2Icon />
        Delete deployment
      </ContextMenuItem>
    </ShownContextMenu>
  )
}

/** The row that was right-clicked on load. */
const clickedFile = "next.config.ts"

function FileTree({ container }: { container: Stage }) {
  const shown = useShownContextMenu(container)
  // The row under the pointer stays highlighted while its menu is open.
  const [clicked, setClicked] = React.useState<string>(clickedFile)

  return (
    <ShownContextMenu
      shown={shown}
      trigger={
        <ContextMenuTrigger
          {...shown.trigger}
          className="group/tree relative grid w-full max-w-80 rounded-(--card-radius) border bg-card p-(--overlay-padding)"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-caption font-semibold text-muted-foreground">lumen-web</p>
          <ul className="grid">
            {files.map((file) => {
              const Icon = fileIcon[file.kind]
              const isClicked = file.name === clicked
              return (
                <li
                  key={file.name}
                  data-clicked={isClicked || undefined}
                  onContextMenu={() => setClicked(file.name)}
                  className="relative flex h-(--overlay-item-height) items-center gap-2.5 rounded-(--overlay-item-radius) px-2.5 text-sm font-medium text-foreground hover:bg-accent group-data-popup-open/tree:data-clicked:bg-accent group-data-shown/tree:data-clicked:bg-accent"
                >
                  {file.name === clickedFile ? shown.point("top-1/2 left-[40%] @lg:left-[70%]") : null}
                  <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {file.name}
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
          New file
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
            <ContextMenuItem>Path</ContextMenuItem>
            <ContextMenuItem>Relative path</ContextMenuItem>
            <ContextMenuItem>Link on GitHub</ContextMenuItem>
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
  <ContextMenuTrigger className="…">Deployment 8f2c1a9</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <ExternalLinkIcon />
      Visit
    </ContextMenuItem>
    <ContextMenuItem>
      <CopyIcon />
      Copy URL
      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2Icon />
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
      >
        <MenuStage className="min-h-80">{(container) => <DeploymentCard container={container} />}</MenuStage>
      </Example>

      <Example
        title="File tree"
        description="A realistic composition. One menu covers the whole list, and the row under the pointer stays highlighted while it is open. The actions match the toolbar, so nothing lives only behind a right-click."
      >
        <MenuStage className="min-h-96">{(container) => <FileTree container={container} />}</MenuStage>
      </Example>

      <Example
        title="Checkbox and radio items"
        description="View options fit a context menu well: they change how something looks, not what it contains. Right-click the log to try it."
        code={`<ContextMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
  Wrap long lines
</ContextMenuCheckboxItem>

<ContextMenuRadioGroup value={level} onValueChange={setLevel}>
  <ContextMenuRadioItem value="all">All lines</ContextMenuRadioItem>
  <ContextMenuRadioItem value="error">Errors only</ContextMenuRadioItem>
</ContextMenuRadioGroup>`}
      >
        <MenuStage className="min-h-88">{(container) => <LogViewer container={container} />}</MenuStage>
      </Example>

      <Guidelines
        do={[
          "Use a context menu as a shortcut for actions people can also reach from a visible button.",
          "Scope it to the thing under the pointer: a row, a file, a card.",
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
