"use client"

import {
  ChevronRightIcon,
  FolderIcon,
  FolderKanbanIcon,
  KeyRoundIcon,
  ListTodoIcon,
  MoreHorizontalIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialsTone } from "@/components/blocks/members-list/people"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

const projects = [
  { slug: "website-relaunch", name: "Website relaunch", note: "Led by Priya Raman · Due Nov 14", status: "On track", variant: "success" },
  { slug: "mobile-app-2", name: "Mobile app 2.0", note: "Led by Jordan Lee · 2 tasks overdue", status: "At risk", variant: "warning" },
  { slug: "help-center", name: "Help center", note: "Paused by Sam Okafor on Sep 30", status: "Paused", variant: "secondary" },
] as const

const members = [
  { name: "Maya Patel", email: "maya@acme.com", role: "Owner", initials: "MP" },
  { name: "Hana Kim", email: "hana@acme.com", role: "Admin", initials: "HK" },
  { name: "Jordan Lee", email: "jordan@acme.com", role: "Member", initials: "JL" },
]

const sizeRows = [
  { size: "default", task: "Launch announcement", meta: "Due Oct 14 · Priya Raman" },
  { size: "sm", task: "Mobile pricing table", meta: "Due Oct 15 · Jordan Lee" },
  { size: "xs", task: "Q3 workload report", meta: "Due Oct 20 · Lucas Moreau" },
] as const

export default function ItemDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        description="Default is borderless, for rows inside a list. Outline and muted stand on their own."
        layout="stack"
        code={`<Item variant="outline">
  <ItemMedia variant="icon">
    <KeyRoundIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>API key</ItemTitle>
    <ItemDescription>Read-only. Created Oct 6.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm" variant="outline">Rotate</Button>
  </ItemActions>
</Item>`}
      >
        <div className="grid max-w-prose gap-3">
          <Item>
            <ItemMedia variant="icon">
              <FolderIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Google Drive</ItemTitle>
              <ItemDescription>Attach shared files to tasks.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Connect
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <KeyRoundIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>API key</ItemTitle>
              <ItemDescription>Read-only. Created Oct 6.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Rotate
              </Button>
            </ItemActions>
          </Item>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <ShieldCheckIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Two-factor authentication</ItemTitle>
              <ItemDescription>Required for every member.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="success">On</Badge>
            </ItemActions>
          </Item>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Default for lists people read, sm for settings and side panels, xs inside menus."
        layout="stack"
        code={`<Item size="sm" variant="outline">…</Item>
<Item size="xs" variant="outline">…</Item>`}
      >
        <div className="grid max-w-prose gap-5">
          {sizeRows.map((row) => (
            <div key={row.size} className="grid gap-2">
              <Item size={row.size} variant="outline">
                <ItemMedia variant="icon">
                  <ListTodoIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{row.task}</ItemTitle>
                  <ItemDescription>{row.meta}</ItemDescription>
                </ItemContent>
              </Item>
              <p className="font-mono text-xs text-muted-foreground">size=&quot;{row.size}&quot;</p>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Divided list"
        description="ItemGroup variant divided lines rows up with the text around them and separates them with hairlines."
        layout="stack"
        code={`<ItemGroup variant="divided">
  <Item>…</Item>
  <Item>…</Item>
</ItemGroup>`}
      >
        <ItemGroup variant="divided" className="max-w-prose">
          {members.map((m) => (
            <Item key={m.email} role="listitem" size="sm">
              <ItemMedia>
                <Avatar>
                  <AvatarFallback tone={initialsTone(m.initials)}>{m.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{m.name}</ItemTitle>
                <ItemDescription>{m.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="text-caption text-muted-foreground">{m.role}</span>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${m.name}`}>
                  <MoreHorizontalIcon />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </Example>

      <Example
        title="Contained list of links"
        description="ItemGroup variant contained puts rows in a bordered list. Render each Item as a link to make the whole row clickable."
        layout="stack"
        surface="subtle"
        code={`<ItemGroup variant="contained">
  <Item render={<Link href="/projects/website-relaunch" />}>
    <ItemMedia variant="icon"><FolderKanbanIcon /></ItemMedia>
    <ItemContent>
      <ItemTitle>Website relaunch</ItemTitle>
      <ItemDescription>Led by Priya Raman · Due Nov 14</ItemDescription>
    </ItemContent>
    <ItemActions><ChevronRightIcon /></ItemActions>
  </Item>
</ItemGroup>`}
      >
        <ItemGroup variant="contained" className="max-w-prose">
          {projects.map((d) => (
            <Item key={d.slug} role="listitem" render={<a href={`#${d.slug}`} />}>
              <ItemMedia variant="icon">
                <FolderKanbanIcon />
              </ItemMedia>
              <ItemContent>
                {/* The status rides on the title line and wraps under the name when the row is narrow. */}
                <ItemTitle className="flex-wrap gap-y-1">
                  <span>{d.name}</span>
                  <Badge variant={d.variant}>{d.status}</Badge>
                </ItemTitle>
                <ItemDescription>{d.note}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </Example>

      <Example
        title="Footer and separator"
        description="ItemFooter spans the full row for meta. ItemSeparator adds a hairline between loose items."
        layout="stack"
      >
        <ItemGroup className="max-w-prose">
          <Item role="listitem">
            <ItemMedia variant="icon">
              <ZapIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Notify the owner</ItemTitle>
              <ItemDescription>When a task moves to Done.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </ItemActions>
            <ItemFooter className="pl-14">
              <span>Last ran 2 minutes ago · 412 runs this month</span>
            </ItemFooter>
          </Item>
          <ItemSeparator />
          <Item role="listitem">
            <ItemMedia variant="icon">
              <ZapIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Post overdue tasks</ItemTitle>
              <ItemDescription>When a task becomes overdue.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </ItemActions>
            <ItemFooter className="pl-14">
              <span className="text-destructive">Last run failed · Slack is disconnected</span>
            </ItemFooter>
          </Item>
        </ItemGroup>
      </Example>

      <Guidelines
        do={[
          "Use one media style per list: icons, avatars or images, not a mix.",
          "Keep the title to one line and the description to two. Both truncate beyond that.",
          "Render the Item as a link when the whole row opens something.",
        ]}
        dont={[
          "Don’t put more than two actions in a row. Move the rest into a menu.",
          "Don’t use outline items inside a contained group. The group already draws the lines.",
          "Don’t use an Item for tabular data that people compare across columns. Use a table.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "Item variant", type: '"default" | "outline" | "muted"', default: '"default"', description: "Borderless, hairline outline, or tinted fill." },
          { prop: "size", type: '"default" | "sm" | "xs"', default: '"default"', description: "Item: padding, gap, title role and media size." },
          { prop: "render", type: "ReactElement", description: "Item: render as a link or button. Interactive rows get a hover fill." },
          { prop: "ItemGroup variant", type: '"default" | "divided" | "contained"', default: '"default"', description: "Stacked rows, hairline rows, or rows in a bordered list." },
          { prop: "ItemMedia variant", type: '"default" | "icon" | "image"', default: '"default"', description: "A bare icon, an icon in a muted tile, or a cropped image." },
        ]}
      />
    </Examples>
  )
}
