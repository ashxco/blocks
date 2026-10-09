"use client"

import * as React from "react"
import {
  FilePlusIcon,
  FolderOpenIcon,
  GitBranchIcon,
  RocketIcon,
  RotateCcwIcon,
  Undo2Icon,
  XCircleIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

function LumenMenubar() {
  const [sidebar, setSidebar] = React.useState(true)
  const [logs, setLogs] = React.useState(false)
  const [density, setDensity] = React.useState("comfortable")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <FilePlusIcon />
              New project
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderOpenIcon />
              Open project
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>
                <GitBranchIcon />
                Import from Git
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>GitHub</MenubarItem>
                <MenubarItem>GitLab</MenubarItem>
                <MenubarItem>Bitbucket</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>
            Close window
            <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
            Sidebar
            <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={logs} onCheckedChange={setLogs}>
            Build logs
            <MenubarShortcut>⌘J</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel>Density</MenubarLabel>
            <MenubarRadioGroup value={density} onValueChange={(value) => setDensity(String(value))}>
              <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Deploy</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <RotateCcwIcon />
              Redeploy
              <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <RocketIcon />
              Promote to production
            </MenubarItem>
            <MenubarItem>
              <Undo2Icon />
              Roll back
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <XCircleIcon />
            Cancel build
            <MenubarShortcut>⌘.</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function LogsMenubar() {
  const [timestamps, setTimestamps] = React.useState(true)
  const [wrap, setWrap] = React.useState(false)
  const [follow, setFollow] = React.useState(true)
  const [level, setLevel] = React.useState("all")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={timestamps} onCheckedChange={setTimestamps}>
            Timestamps
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Wrap long lines
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={follow} onCheckedChange={setFollow}>
            Follow new lines
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Level</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Show</MenubarLabel>
            <MenubarRadioGroup value={level} onValueChange={(value) => setLevel(String(value))}>
              <MenubarRadioItem value="all">All lines</MenubarRadioItem>
              <MenubarRadioItem value="warn">Warnings and errors</MenubarRadioItem>
              <MenubarRadioItem value="error">Errors only</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default function MenubarDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="Application menus in a hairline bar. Click a menu, then move across the bar with the pointer or the arrow keys; the next menu opens without animation."
        code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New project
        <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarSub>
        <MenubarSubTrigger>Import from Git</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>GitHub</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem>Close window</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>…</MenubarMenu>
</Menubar>`}
      >
        <LumenMenubar />
      </Example>

      <Example
        title="Checkbox and radio items"
        description="Checkboxes for options people can turn on and off, a radio group for one-of-many settings. Both keep the menu open so people can change several at once."
        code={`<MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
  Wrap long lines
</MenubarCheckboxItem>
<MenubarRadioGroup value={level} onValueChange={setLevel}>
  <MenubarRadioItem value="all">All lines</MenubarRadioItem>
  <MenubarRadioItem value="error">Errors only</MenubarRadioItem>
</MenubarRadioGroup>`}
      >
        <LogsMenubar />
      </Example>

      <Example
        title="In an app window"
        description="A realistic composition: the menubar sits in the window chrome of a desktop app, next to the project name."
        layout="full"
      >
        <div className="p-6 sm:p-10">
          <div className="overflow-hidden rounded-(--card-radius) border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-subtle px-3 py-2">
              <LumenMenubar />
              <p className="px-2 text-label text-foreground">lumen-web</p>
            </div>
            <div className="grid gap-2 p-6">
              <p className="text-title text-foreground">Deployments</p>
              <p className="text-sm text-copy">48 deployments this week · last one 4 minutes ago</p>
            </div>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a menubar for desktop-style apps with many commands, such as an editor or a log viewer.",
          "Order menus the way people expect: File, Edit, View, then your app’s own menus.",
          "Show keyboard shortcuts for frequent commands, and make sure they work.",
        ]}
        dont={[
          "Don’t use a menubar for site navigation. Use a navigation menu.",
          "Don’t put a menubar on small screens. Collapse the commands into one dropdown menu.",
          "Don’t put more than six menus in one bar.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "On Menubar. The direction of the bar and its arrow-key navigation." },
          { prop: "loopFocus", type: "boolean", default: "true", description: "On Menubar. Wrap arrow-key focus from the last menu to the first." },
          { prop: "disabled", type: "boolean", default: "false", description: "On Menubar or MenubarMenu. Turns off the whole bar or one menu." },
          { prop: "variant", type: '"default" | "destructive"', default: '"default"', description: "On MenubarItem. Destructive items use text-destructive." },
          { prop: "inset", type: "boolean", default: "false", description: "On items and labels. Indents text to line up with items that have an icon." },
          { prop: "align / sideOffset", type: "string / number", default: '"start" / 9', description: "On MenubarContent. Opens the menu just under the bar, lined up with the trigger label." },
        ]}
      />
    </Examples>
  )
}
