"use client"

import { ArrowRightIcon, GitBranchIcon, GlobeIcon, MoreHorizontalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const projects = [
  { name: "web-app", domain: "lumen.app", branch: "main", status: "Ready", updated: "2m ago" },
  { name: "api", domain: "api.lumen.app", branch: "main", status: "Building", updated: "9m ago" },
  { name: "docs", domain: "docs.lumen.app", branch: "content/regions", status: "Failed", updated: "1h ago" },
] as const

const statusVariant = { Ready: "success", Building: "warning", Failed: "destructive" } as const

export default function CardDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="A flat card: bg-card, a hairline border and --card-radius corners, padded with --card-padding. The footer runs edge to edge on a tinted band."
        layout="stack"
        surface="subtle"
        code={`<Card>
  <CardHeader>
    <CardTitle>Build cache</CardTitle>
    <CardDescription>Reused between deployments of the same branch.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>
    <Button size="sm" variant="outline">Clear cache</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="max-w-112">
          <CardHeader>
            <CardTitle>Build cache</CardTitle>
            <CardDescription>Reused between deployments of the same branch.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              412 MB cached for web-app. The last build restored 1,284 packages and finished in 17.6 seconds.
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <p className="text-caption text-muted-foreground">Updated 2 minutes ago</p>
            <Button size="sm" variant="outline">
              Clear cache
            </Button>
          </CardFooter>
        </Card>
      </Example>

      <Example
        title="With an action"
        description="CardAction sits at the top right of the header. Give the header a border-b to turn it into an edge-to-edge band."
        layout="stack"
        surface="subtle"
        code={`<Card>
  <CardHeader className="border-b">
    <CardTitle>Domains</CardTitle>
    <CardDescription>3 domains point at production.</CardDescription>
    <CardAction>
      <Button size="sm">Add domain</Button>
    </CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`}
      >
        <Card className="max-w-prose">
          <CardHeader className="border-b">
            <CardTitle>Domains</CardTitle>
            <CardDescription>3 domains point at production.</CardDescription>
            <CardAction>
              <Button size="sm">Add domain</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="-my-3 divide-y">
              {[
                ["lumen.app", "Valid configuration"],
                ["www.lumen.app", "Redirects to lumen.app"],
                ["status.lumen.app", "Waiting for DNS"],
              ].map(([domain, note]) => (
                <li key={domain} className="flex items-center justify-between gap-4 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <GlobeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-label text-foreground">{domain}</span>
                  </span>
                  <span className="shrink-0 text-caption text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Example>

      <Example
        title="Variants"
        description="Default for most content, subtle for cards that should recede, panel for the one card that needs emphasis."
        layout="stack"
        code={`<Card>…</Card>
<Card variant="subtle">…</Card>
<Card variant="panel">…</Card>`}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>bg-card with a hairline border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-foreground tabular">2.4M</p>
              <p className="text-caption text-muted-foreground">Requests today</p>
            </CardContent>
          </Card>
          <Card variant="subtle">
            <CardHeader>
              <CardTitle>Subtle</CardTitle>
              <CardDescription>A tinted fill that steps back.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-foreground tabular">84 ms</p>
              <p className="text-caption text-muted-foreground">P95 latency</p>
            </CardContent>
          </Card>
          <Card variant="panel">
            <CardHeader>
              <CardTitle>Panel</CardTitle>
              <CardDescription>Dark in both themes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-panel-foreground tabular">99.99%</p>
              <p className="text-caption text-panel-muted">Uptime this quarter</p>
            </CardContent>
          </Card>
        </div>
      </Example>

      <Example
        title="Small"
        description="size sm uses --card-padding-sm and a text-title heading, for dense grids and side panels."
        layout="stack"
        surface="subtle"
        code={`<Card size="sm">…</Card>`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.slice(0, 2).map((p) => (
            <Card key={p.name} size="sm">
              <CardHeader>
                <CardTitle className="font-mono">{p.name}</CardTitle>
                <CardDescription>{p.domain}</CardDescription>
                <CardAction>
                  <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Example>

      <Example
        title="Project grid"
        description="Cards as links to projects. The whole card is the link; the menu button sits above it."
        layout="stack"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Card
              key={p.name}
              className="transition-colors duration-(--duration-fast) has-[a:hover]:border-border-strong has-[a:focus-visible]:focus-ring"
            >
              <CardHeader>
                <CardTitle className="font-mono">
                  <a
                    href={`#${p.name}`}
                    className="outline-none after:absolute after:inset-0 after:rounded-(--card-radius)"
                  >
                    {p.name}
                  </a>
                </CardTitle>
                <CardDescription>{p.domain}</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${p.name}`} className="relative z-1">
                    <MoreHorizontalIcon />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-caption text-muted-foreground">
                <GitBranchIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{p.branch}</span>
              </CardContent>
              <CardFooter className="justify-between py-3">
                <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                <span className="text-caption text-muted-foreground">{p.updated}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Example>

      <Example
        title="Upgrade prompt"
        description="One panel card can carry the most important message on a page."
        layout="stack"
      >
        <Card variant="panel" className="max-w-prose">
          <CardHeader>
            <CardTitle>You have used 80% of your build minutes</CardTitle>
            <CardDescription>2,400 of 3,000 minutes this cycle. Builds queue when you reach the limit.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-between">
            <p className="text-caption text-panel-muted">Resets on 1 November</p>
            <Button size="sm" variant="inverse">
              Upgrade to Pro
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Group one subject per card: a project, a setting, a metric.",
          "Lay cards on the canvas or a subtle band; let the hairline do the separating.",
          "Use the panel variant for one card per view at most.",
          "Make the whole card the link when it opens one thing, and keep secondary actions above the link.",
        ]}
        dont={[
          "Don’t add shadows or lift cards on hover. Change the border colour instead.",
          "Don’t nest cards inside cards. Use dividers or a subtle band inside.",
          "Don’t override the radius or padding with raw values. Use size or the card tokens.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "subtle" | "panel"', default: '"default"', description: "Card: white card, tinted card, or dark emphasis panel." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "Card: padding from --card-padding or --card-padding-sm, and the gap between sections." },
          { prop: "className", type: "string", description: "CardHeader: add border-b to make the header an edge-to-edge band." },
          { prop: "children", type: "ReactNode", description: "CardAction: buttons or badges at the top right of the header." },
        ]}
      />
    </Examples>
  )
}
