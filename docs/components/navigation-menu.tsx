"use client"

import {
  ArrowRightIcon,
  BookOpenIcon,
  DatabaseIcon,
  GitBranchIcon,
  GlobeIcon,
  LineChartIcon,
  ScrollTextIcon,
  TerminalIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const product = [
  { title: "Deployments", description: "Every git push builds and gets its own preview URL.", icon: GitBranchIcon },
  { title: "Logs", description: "Search runtime and build logs across every region.", icon: ScrollTextIcon },
  { title: "Metrics", description: "Requests, latency and errors for each deployment.", icon: LineChartIcon },
  { title: "Domains", description: "Custom domains with certificates that renew on their own.", icon: GlobeIcon },
  { title: "Databases", description: "Managed Postgres next to your app, with daily backups.", icon: DatabaseIcon },
]

const developers = [
  { title: "Documentation", description: "Guides for every framework Lumen builds.", icon: BookOpenIcon },
  { title: "CLI", description: "Deploy, tail logs and roll back from a terminal.", icon: TerminalIcon },
  { title: "API reference", description: "Automate projects, domains and teams.", icon: BookOpenIcon },
]

function PanelLink({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <NavigationMenuLink href={`#${title.toLowerCase().replace(/\s+/g, "-")}`} className="items-start">
      <span className="grid size-9 shrink-0 place-items-center rounded-(--control-radius) border bg-muted text-foreground">
        <Icon className="size-4" />
      </span>
      <span className="grid gap-0.5">
        <span className="text-label text-foreground">{title}</span>
        <span className="text-caption font-normal text-muted-foreground">{description}</span>
      </span>
    </NavigationMenuLink>
  )
}

function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[calc(100vw-2rem)] md:w-180">
            <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_15rem]">
              <ul className="grid gap-1 md:col-span-2 md:grid-cols-2">
                {product.map((item) => (
                  <li key={item.title}>
                    <PanelLink {...item} />
                  </li>
                ))}
              </ul>
              <a
                href="#preview-deployments"
                className="group/feature hidden flex-col justify-between gap-6 rounded-(--overlay-item-radius) bg-panel p-5 text-panel-foreground outline-none focus-visible:focus-ring md:flex"
              >
                <span className="grid gap-2">
                  <span className="text-title text-panel-foreground">Preview every pull request</span>
                  <span className="text-caption text-panel-muted">
                    Lumen comments a live URL on each pull request, so reviewers click instead of pulling the branch.
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-label text-panel-foreground">
                  How previews work
                  <ArrowRightIcon className="size-4 transition-transform duration-(--duration-fast) group-hover/feature:translate-x-0.5" />
                </span>
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[calc(100vw-2rem)] sm:w-96">
            <ul className="grid gap-1">
              {developers.map((item) => (
                <li key={item.title}>
                  <PanelLink {...item} />
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="max-sm:hidden">
          <NavigationMenuLink href="#changelog" className={navigationMenuTriggerStyle()}>
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function NavigationMenuDocs() {
  return (
    <Examples>
      <Example
        title="Site navigation"
        description="Triggers open crisp panels on bg-popover with a hairline border. Move along the bar and the panel resizes and slides to the next item."
        layout="full"
        minHeight="min-h-[30rem]"
        code={`<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Product</NavigationMenuTrigger>
      <NavigationMenuContent className="w-180">
        <ul className="grid grid-cols-2 gap-1">
          <li>
            <NavigationMenuLink render={<Link href="/deployments" />}>
              …
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle()}
        render={<Link href="/pricing" />}
      >
        Pricing
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
      >
        <header className="flex h-(--header-height) items-center justify-between gap-6 border-b px-gutter">
          <div className="flex items-center gap-8">
            <a href="#lumen" className="rounded-xs text-xl font-extrabold tracking-tight text-foreground outline-none focus-visible:focus-ring">
              Lumen
            </a>
            <div className="max-md:hidden">
              <SiteNav />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="max-sm:hidden">
              Log in
            </Button>
            <Button size="sm">Start deploying</Button>
          </div>
        </header>
        <div className="grid gap-4 px-gutter py-16">
          <h3 className="max-w-prose text-h2">Push to deploy. Everything else is handled.</h3>
          <p className="max-w-prose text-lead text-copy">
            Open Product or Developers in the bar above. Panels open on hover and on click, and close with Escape.
          </p>
        </div>
      </Example>

      <Example
        title="Single list"
        description="A short panel of links with an icon tile, a title and one line of description."
        minHeight="min-h-80"
        code={`<NavigationMenuContent className="w-96">
  <ul className="grid gap-1">
    <li>
      <NavigationMenuLink href="/docs/cli">
        <TerminalIcon />
        CLI
      </NavigationMenuLink>
    </li>
  </ul>
</NavigationMenuContent>`}
      >
        <div className="self-start">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
                <NavigationMenuContent className="w-[calc(100vw-2rem)] sm:w-96">
                  <ul className="grid gap-1">
                    {developers.map((item) => (
                      <li key={item.title}>
                        <PanelLink {...item} />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#status" className={navigationMenuTriggerStyle()}>
                  Status
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Example>

      <Example
        title="Links only"
        description="Without panels, use navigationMenuTriggerStyle on links. Mark the current page with aria-current."
        code={`<NavigationMenuLink
  className={navigationMenuTriggerStyle()}
  aria-current="page"
  render={<Link href="/docs" />}
>
  Docs
</NavigationMenuLink>`}
      >
        <NavigationMenu>
          <NavigationMenuList>
            {["Product", "Docs", "Pricing", "Customers"].map((label) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  href={`#${label.toLowerCase()}`}
                  aria-current={label === "Docs" ? "page" : undefined}
                  className={navigationMenuTriggerStyle()}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </Example>

      <Guidelines
        do={[
          "Keep the bar to four or five items. Group the rest under one trigger.",
          "Give every panel link a title and one plain line that says what is behind it.",
          "Use one dark panel inside a menu to point at the thing you most want people to see.",
          "Swap the menu for a sheet below the md breakpoint.",
        ]}
        dont={[
          "Don’t put actions like Log in inside a panel. Keep them as buttons in the header.",
          "Don’t nest panels inside panels.",
          "Don’t add shadows to panels. The hairline border separates them from the page.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "NavigationMenu: how panels line up with their trigger." },
          { prop: "value / onValueChange", type: "any / (value) => void", description: "NavigationMenu: control which item is open." },
          { prop: "delay / closeDelay", type: "number", default: "50 / 50", description: "NavigationMenu: milliseconds before a panel opens or closes on hover." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "NavigationMenu: arrow-key direction for moving between items." },
          { prop: "className", type: "string", description: "NavigationMenuContent: set the panel width here, for example w-180." },
          { prop: "render", type: "ReactElement", description: "NavigationMenuLink: render as a router link." },
          { prop: "active", type: "boolean", default: "false", description: "NavigationMenuLink: marks the link for the current page." },
          { prop: "navigationMenuTriggerStyle()", type: "() => string", description: "Classes that make a top-level link match the triggers." },
        ]}
      />
    </Examples>
  )
}
