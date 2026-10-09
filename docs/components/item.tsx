"use client"

import {
  ChevronRightIcon,
  DatabaseIcon,
  GitBranchIcon,
  GlobeIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
  ShieldCheckIcon,
  WebhookIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

const domains = [
  { name: "lumen.app", note: "Production · certificate renews 14 Dec", status: "Valid", variant: "success" },
  { name: "www.lumen.app", note: "Redirects to lumen.app with a 308", status: "Redirect", variant: "secondary" },
  { name: "status.lumen.app", note: "Add a CNAME record pointing at cname.lumen.app", status: "Pending DNS", variant: "warning" },
] as const

const members = [
  { name: "Priya Raman", email: "priya@lumen.app", role: "Owner", initials: "PR" },
  { name: "Mateo Ortiz", email: "mateo@lumen.app", role: "Admin", initials: "MO" },
  { name: "Aiko Kato", email: "aiko@lumen.app", role: "Developer", initials: "AK" },
]

const sizeRows = [
  { size: "default", branch: "preview-comments", meta: "Last deployed 9 minutes ago" },
  { size: "sm", branch: "chore/node-22", meta: "Last deployed 3 hours ago" },
  { size: "xs", branch: "fix/apex-redirect", meta: "Last deployed yesterday" },
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
    <DatabaseIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Postgres</ItemTitle>
    <ItemDescription>16 GB · Frankfurt, fra1</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm" variant="outline">Connect</Button>
  </ItemActions>
</Item>`}
      >
        <div className="grid max-w-prose gap-3">
          <Item>
            <ItemMedia variant="icon">
              <DatabaseIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Postgres</ItemTitle>
              <ItemDescription>Managed Postgres 16 next to your app, with daily backups.</ItemDescription>
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
              <ItemTitle>Deploy key</ItemTitle>
              <ItemDescription>Read-only access to lumen-labs/lumen-web. Added 3 days ago.</ItemDescription>
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
              <ItemDescription>Required for every member of Lumen Labs</ItemDescription>
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
                  <GitBranchIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{row.branch}</ItemTitle>
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
                  <AvatarFallback>{m.initials}</AvatarFallback>
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
  <Item render={<Link href="/domains/lumen.app" />}>
    <ItemMedia variant="icon"><GlobeIcon /></ItemMedia>
    <ItemContent>
      <ItemTitle>lumen.app</ItemTitle>
      <ItemDescription>Production</ItemDescription>
    </ItemContent>
    <ItemActions><ChevronRightIcon /></ItemActions>
  </Item>
</ItemGroup>`}
      >
        <ItemGroup variant="contained" className="max-w-prose">
          {domains.map((d) => (
            <Item key={d.name} role="listitem" render={<a href={`#${d.name}`} />}>
              <ItemMedia variant="icon">
                <GlobeIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{d.name}</ItemTitle>
                <ItemDescription>{d.note}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={d.variant}>{d.status}</Badge>
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
              <WebhookIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Deployment webhook</ItemTitle>
              <ItemDescription>POST https://lumen.app/api/hooks/deploy on every deployment.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </ItemActions>
            <ItemFooter className="pl-14">
              <span>Last delivered 2 minutes ago · 200 OK</span>
            </ItemFooter>
          </Item>
          <ItemSeparator />
          <Item role="listitem">
            <ItemMedia variant="icon">
              <WebhookIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Incident webhook</ItemTitle>
              <ItemDescription>POST https://lumen.app/api/hooks/incident when a deployment fails.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </ItemActions>
            <ItemFooter className="pl-14">
              <span className="text-destructive">Last delivery failed · 503 Service Unavailable</span>
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
