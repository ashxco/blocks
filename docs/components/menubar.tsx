"use client"

import * as React from "react"
import {
  CalendarIcon,
  CircleCheckIcon,
  FilePlusIcon,
  FolderPlusIcon,
  ImportIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, useReturnFocus } from "@/docs/kit"
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
import { cn } from "@/lib/utils"

type Stage = HTMLDivElement | null

/**
 * The first examples show one menu already open, portalled into a stage inside
 * the example so it follows the example's theme, and isolate keeps its
 * z-index inside the example so it scrolls under the site header. A click
 * anywhere else closes it, as in an app.
 */
function MenubarStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  useReturnFocus(container)
  return (
    <div ref={setContainer} className={cn("relative isolate flex w-full items-start justify-center", className)}>
      {children(container)}
    </div>
  )
}

/**
 * The menu that is open on load. It only opens once the stage exists, so it is
 * placed inside the stage from its first frame instead of against <body>. It
 * keeps its side and full height as the page scrolls, and the wheel carries on
 * to the page over it.
 */
function useShownMenu(shown: boolean, container: Stage | undefined) {
  const [open, setOpen] = React.useState(shown)
  const ready = !shown || container != null
  const content = shown
    ? ({ collisionAvoidance: { side: "none" }, collisionBoundary: container ?? undefined, className: "max-h-none overscroll-auto" } as const)
    : undefined
  return { menu: { open: open && ready, onOpenChange: setOpen }, content }
}

interface DemoMenubarProps {
  /** The menu that is open on load. */
  openMenu?: string
  /** Where the menus portal to. */
  container?: Stage
  className?: string
}

function AcmeMenubar({ openMenu, container, className }: DemoMenubarProps) {
  const [sidebar, setSidebar] = React.useState(true)
  const [details, setDetails] = React.useState(false)
  const [density, setDensity] = React.useState("comfortable")
  const file = useShownMenu(openMenu === "file", container)

  return (
    <Menubar modal={false} className={className}>
      <MenubarMenu {...file.menu}>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent container={container} {...file.content}>
          <MenubarGroup>
            <MenubarItem>
              <FolderPlusIcon />
              New project
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FilePlusIcon />
              New doc
              <MenubarShortcut>⇧⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>
                <ImportIcon />
                Import tasks
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>CSV file</MenubarItem>
                <MenubarItem>Google Drive</MenubarItem>
                <MenubarItem>GitHub issues</MenubarItem>
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
        <MenubarContent container={container}>
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
        <MenubarContent container={container}>
          <MenubarCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
            Sidebar
            <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={details} onCheckedChange={setDetails}>
            Task details
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
        <MenubarTrigger>Task</MenubarTrigger>
        <MenubarContent container={container}>
          <MenubarGroup>
            <MenubarItem>
              <CircleCheckIcon />
              Mark as done
              <MenubarShortcut>⌘↵</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <UserIcon />
              Assign to me
              <MenubarShortcut>I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <CalendarIcon />
              Set due date
              <MenubarShortcut>D</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <Trash2Icon />
            Delete task
            <MenubarShortcut>⌘⌫</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function BoardMenubar({ openMenu, container }: DemoMenubarProps) {
  const [subtasks, setSubtasks] = React.useState(true)
  const [completed, setCompleted] = React.useState(false)
  const [dueDates, setDueDates] = React.useState(true)
  const [group, setGroup] = React.useState("status")
  const view = useShownMenu(openMenu === "view", container)
  const groupMenu = useShownMenu(openMenu === "group", container)

  return (
    <Menubar modal={false}>
      <MenubarMenu {...view.menu}>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent container={container} {...view.content}>
          <MenubarCheckboxItem checked={subtasks} onCheckedChange={setSubtasks}>
            Subtasks
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={completed} onCheckedChange={setCompleted}>
            Completed tasks
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={dueDates} onCheckedChange={setDueDates}>
            Due dates
            <MenubarShortcut>⌘D</MenubarShortcut>
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu {...groupMenu.menu}>
        <MenubarTrigger>Group</MenubarTrigger>
        <MenubarContent container={container} {...groupMenu.content}>
          <MenubarGroup>
            <MenubarLabel>Group tasks by</MenubarLabel>
            <MenubarRadioGroup value={group} onValueChange={(value) => setGroup(String(value))}>
              <MenubarRadioItem value="status">Status</MenubarRadioItem>
              <MenubarRadioItem value="assignee">Assignee</MenubarRadioItem>
              <MenubarRadioItem value="priority">Priority</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

/** A slice of the project board the app window shows under its menubar. */
const board = [
  {
    name: "To do",
    count: 8,
    tasks: [
      { title: "Brief the support team", meta: "Sam Okafor · Oct 23" },
      { title: "Plan the launch-day schedule", meta: "Maya Patel · Oct 22" },
    ],
  },
  {
    name: "In progress",
    count: 4,
    tasks: [
      { title: "Fix the pricing table on mobile", meta: "Jordan Lee · Oct 15" },
      { title: "Final homepage illustrations", meta: "Sofia Alvarez · Oct 16" },
    ],
  },
  {
    name: "In review",
    count: 2,
    tasks: [{ title: "Write the launch announcement", meta: "Priya Raman · Oct 14" }],
  },
]

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
        <MenubarSubTrigger>Import tasks</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>CSV file</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem>Close window</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>…</MenubarMenu>
</Menubar>`}
      >
        <MenubarStage className="min-h-72">
          {(container) => <AcmeMenubar openMenu="file" container={container} />}
        </MenubarStage>
      </Example>

      <Example
        title="Checkbox items"
        description="Checkboxes for options people can turn on and off. They keep the menu open, so people can change several in a row."
        code={`<MenubarCheckboxItem checked={subtasks} onCheckedChange={setSubtasks}>
  Subtasks
  <MenubarShortcut>⌘T</MenubarShortcut>
</MenubarCheckboxItem>
<MenubarCheckboxItem checked={completed} onCheckedChange={setCompleted}>
  Completed tasks
</MenubarCheckboxItem>`}
      >
        <MenubarStage className="min-h-56">
          {(container) => <BoardMenubar openMenu="view" container={container} />}
        </MenubarStage>
      </Example>

      <Example
        title="Radio items"
        description="A radio group for one-of-many settings, under a label that names the choice. The dot moves to the new item and the menu stays open."
        code={`<MenubarGroup>
  <MenubarLabel>Group tasks by</MenubarLabel>
  <MenubarRadioGroup value={group} onValueChange={setGroup}>
    <MenubarRadioItem value="status">Status</MenubarRadioItem>
    <MenubarRadioItem value="assignee">Assignee</MenubarRadioItem>
    <MenubarRadioItem value="priority">Priority</MenubarRadioItem>
  </MenubarRadioGroup>
</MenubarGroup>`}
      >
        <MenubarStage className="min-h-60">
          {(container) => <BoardMenubar openMenu="group" container={container} />}
        </MenubarStage>
      </Example>

      <Example
        title="In an app window"
        description="A realistic composition: in the window chrome of a desktop app, the menubar drops its own frame so the menus sit on the bar, right after the project name."
        layout="full"
        code={`<div className="flex items-center gap-3 border-b bg-subtle px-3 py-1.5">
  <p className="px-2 text-label">Website relaunch</p>
  <span aria-hidden="true" className="h-4 w-px bg-border" />
  <Menubar className="border-0 bg-transparent p-0">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>…</MenubarContent>
    </MenubarMenu>
    …
  </Menubar>
</div>`}
      >
        <div className="p-6 sm:p-10">
          <div className="@container/window overflow-hidden rounded-(--card-radius) border bg-background">
            {/* In a narrow window the project name sits above the menus, with no separator left dangling. */}
            <div className="flex flex-col items-start gap-x-3 gap-y-1 border-b bg-subtle px-3 py-1.5 @md/window:flex-row @md/window:items-center">
              <p className="px-2 text-label text-foreground">Website relaunch</p>
              <span aria-hidden="true" className="hidden h-4 w-px bg-border @md/window:block" />
              <AcmeMenubar className="border-0 bg-transparent p-0" />
            </div>
            <div className="grid gap-4 p-4 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-title text-foreground">Board</p>
                <p className="text-caption text-muted-foreground">14 open tasks · updated 4 minutes ago</p>
              </div>
              <div className="grid gap-3 @lg:grid-cols-3">
                {board.map((column) => (
                  <section
                    key={column.name}
                    aria-label={column.name}
                    className="grid content-start gap-2 rounded-(--control-radius) bg-subtle p-2"
                  >
                    <p className="flex items-center justify-between px-1.5 py-1 text-caption font-semibold text-muted-foreground">
                      {column.name}
                      <span className="tabular">{column.count}</span>
                    </p>
                    {column.tasks.map((task) => (
                      <div key={task.title} className="grid gap-1 rounded-sm border bg-card px-3 py-2.5">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-caption text-muted-foreground">{task.meta}</p>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a menubar for desktop-style apps with many commands, such as a doc editor or a planning board.",
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
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "On MenubarContent. Lines the menu up with the trigger label." },
          { prop: "sideOffset", type: "number", default: "9", description: "On MenubarContent. Distance in pixels from the trigger, so the menu opens just under the bar." },
        ]}
      />
    </Examples>
  )
}
