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

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
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

const files = [
  { name: "app", kind: "folder" },
  { name: "components", kind: "folder" },
  { name: "lib", kind: "folder" },
  { name: "next.config.ts", kind: "code" },
  { name: "package.json", kind: "code" },
  { name: "README.md", kind: "text" },
] as const

const fileIcon = { folder: FolderIcon, code: FileCodeIcon, text: FileTextIcon }

function LogViewer() {
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
    <ContextMenu>
      <ContextMenuTrigger className="block w-full max-w-120 rounded-(--card-radius) bg-terminal p-5 font-mono text-code text-terminal-foreground">
        <ol className="grid gap-1.5">
          {lines.map((line) => (
            <li key={line.time} className={wrap ? "flex gap-3" : "flex gap-3 truncate"}>
              {timestamps ? <span className="shrink-0 opacity-60 tabular">{line.time}</span> : null}
              <span className={wrap ? undefined : "truncate"}>{line.text}</span>
            </li>
          ))}
        </ol>
      </ContextMenuTrigger>
      <ContextMenuContent>
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
      </ContextMenuContent>
    </ContextMenu>
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
        <ContextMenu>
          <ContextMenuTrigger className="grid w-full max-w-96 gap-3 rounded-(--card-radius) border border-dashed border-input bg-subtle p-6 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="text-title text-foreground">Deployment 8f2c1a9</p>
              <Badge variant="success">Ready</Badge>
            </div>
            <p className="text-sm text-copy">main · Priya Raman · 4 minutes ago</p>
            <p className="text-caption text-muted-foreground">Right-click or long-press this card</p>
          </ContextMenuTrigger>
          <ContextMenuContent>
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
          </ContextMenuContent>
        </ContextMenu>
      </Example>

      <Example
        title="File tree"
        description="A realistic composition. One menu covers the whole list; the actions match the toolbar so nothing lives only behind a right-click."
      >
        <ContextMenu>
          <ContextMenuTrigger className="grid w-full max-w-80 rounded-(--card-radius) border bg-card p-(--overlay-padding)">
            <p className="px-2.5 pt-1.5 pb-2 text-caption font-semibold text-muted-foreground">lumen-web</p>
            <ul className="grid">
              {files.map((file) => {
                const Icon = fileIcon[file.kind]
                return (
                  <li
                    key={file.name}
                    className="flex h-(--overlay-item-height) items-center gap-2.5 rounded-(--overlay-item-radius) px-2.5 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                    {file.name}
                  </li>
                )
              })}
            </ul>
          </ContextMenuTrigger>
          <ContextMenuContent>
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
          </ContextMenuContent>
        </ContextMenu>
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
        <LogViewer />
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
          { prop: "side / align", type: "string", default: '"right" / "start"', description: "On ContextMenuContent. Where the menu sits relative to the pointer." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "On ContextMenu. Called when the menu opens or closes." },
        ]}
      />
    </Examples>
  )
}
