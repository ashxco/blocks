"use client"

import { ArrowRightIcon, GitBranchIcon, GlobeIcon, MoreHorizontalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const projects = [
  { name: "lumen-web", domain: "lumen.app", branch: "main", status: "Ready", updated: "2m ago" },
  { name: "lumen-api", domain: "api.lumen.app", branch: "main", status: "Building", updated: "9m ago" },
  { name: "docs", domain: "docs.lumen.app", branch: "content/regions", status: "Failed", updated: "1h ago" },
] as const

/* The same status reads the same everywhere: in progress is info, with a spinner. */
const statusVariant = { Ready: "success", Building: "info", Failed: "destructive" } as const

function StatusBadge({ status }: { status: keyof typeof statusVariant }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status === "Building" ? (
        <Spinner className="size-3" />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {status}
    </Badge>
  )
}

const variantCards = [
  {
    variant: "default",
    title: "Requests",
    description: "All projects, last 24 hours.",
    value: "2.4M",
    meta: "Up 12% on yesterday",
  },
  {
    variant: "subtle",
    title: "P95 latency",
    description: "lumen-web, last 24 hours.",
    value: "84 ms",
    meta: "Inside the 200 ms target",
  },
  {
    variant: "panel",
    title: "Uptime",
    description: "Every region, this quarter.",
    value: "99.99%",
    meta: "4 minutes of downtime",
  },
] as const

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
              412 MB cached for lumen-web. The last build restored 1,284 packages and finished in 17.6 seconds.
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
            <ul className="@container -my-3 divide-y">
              {[
                ["lumen.app", "Valid configuration"],
                ["www.lumen.app", "Redirects to lumen.app"],
                ["status.lumen.app", "Waiting for DNS"],
              ].map(([domain, note]) => (
                <li key={domain} className="grid gap-0.5 py-3 @sm:flex @sm:items-center @sm:justify-between @sm:gap-4">
                  <span className="flex min-w-0 items-center gap-3">
                    <GlobeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-label text-foreground">{domain}</span>
                  </span>
                  <span className="pl-7 text-caption text-muted-foreground @sm:shrink-0 @sm:pl-0">{note}</span>
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
        <div className="grid gap-x-4 gap-y-6 md:grid-cols-3">
          {variantCards.map((card) => (
            <figure key={card.variant} className="grid content-start gap-3">
              <Card variant={card.variant}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p
                    className={cn(
                      "text-3xl font-extrabold tabular",
                      card.variant === "panel" ? "text-panel-foreground" : "text-foreground"
                    )}
                  >
                    {card.value}
                  </p>
                  <p className={cn("text-caption", card.variant === "panel" ? "text-panel-muted" : "text-muted-foreground")}>
                    {card.meta}
                  </p>
                </CardContent>
              </Card>
              <figcaption className="font-mono text-code text-muted-foreground">variant=&quot;{card.variant}&quot;</figcaption>
            </figure>
          ))}
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
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>{p.domain}</CardDescription>
                <CardAction>
                  <StatusBadge status={p.status} />
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
                <CardTitle>
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
                <StatusBadge status={p.status} />
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
          { prop: "variant", type: '"default" | "subtle" | "panel"', default: '"default"', description: "Card: bg-card on the canvas, a tinted fill that recedes, or the dark emphasis panel." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "Card: padding from --card-padding or --card-padding-sm, and the gap between sections." },
          { prop: "className", type: "string", description: "CardHeader: add border-b to make the header an edge-to-edge band." },
          { prop: "children", type: "ReactNode", description: "CardAction: buttons or badges at the top right of the header." },
        ]}
      />
    </Examples>
  )
}
