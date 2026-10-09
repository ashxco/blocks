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
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
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

const columns = [
  { id: "status", label: "Status" },
  { id: "branch", label: "Branch" },
  { id: "commit", label: "Commit" },
  { id: "duration", label: "Build time" },
  { id: "author", label: "Author" },
]

function ColumnsMenu() {
  const [visible, setVisible] = React.useState<Record<string, boolean>>({
    status: true,
    branch: true,
    commit: true,
    duration: false,
    author: true,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Columns3Icon data-icon="inline-start" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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

function SortMenu() {
  const [sort, setSort] = React.useState("newest")
  const current = sortOptions.find((option) => option.value === sort)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <ArrowDownUpIcon data-icon="inline-start" />
        {current?.label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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

function AccountMenu() {
  const [theme, setTheme] = React.useState("system")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-auto gap-3 rounded-full py-1.5 pr-3 pl-1.5" />}
      >
        <Avatar size="sm">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        Priya Raman
        <ChevronDownIcon data-icon="inline-end" className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
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
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(String(value))}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
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
        <DropdownMenu>
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
        <ColumnsMenu />
      </Example>

      <Example
        title="Radio items"
        description="Pick one option from a set. Show the current choice in the trigger so people can see it without opening the menu."
        code={`<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
  <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
      >
        <SortMenu />
      </Example>

      <Example
        title="Submenu"
        description="Nest a short list behind a sub-trigger. It opens on hover or with the right arrow key."
        code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>Move to team</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Lumen Labs</DropdownMenuItem>
    <DropdownMenuItem>Marketing site</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Project
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInputIcon />
                Move to team
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
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
      </Example>

      <Example
        title="Account menu"
        description="A realistic composition: identity at the top, grouped links, a theme choice and sign out at the end."
      >
        <AccountMenu />
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
