"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  BookOpenIcon,
  DatabaseIcon,
  GitBranchIcon,
  GlobeIcon,
  LineChartIcon,
  MenuIcon,
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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

type Stage = HTMLElement | null

/**
 * The examples show a panel already open, portalled into the example so it
 * follows the example's theme and stays under the site header. The open
 * panel stays up while people click elsewhere on the page; moving the
 * pointer off the bar or pressing Escape closes it as usual.
 *
 * The panel only opens once the stage exists, so it is placed inside the
 * stage from its first frame instead of against <body>, and it keeps its side
 * as the page scrolls.
 */
function useShownPanel(initial: string, container: Stage) {
  const [value, setValue] = React.useState<string | null>(initial)
  const onValueChange = React.useCallback((next: string | null, details: { reason: string }) => {
    if (next === null && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setValue(next)
  }, [])
  return {
    value: container ? value : null,
    onValueChange,
    container,
    collisionAvoidance: { side: "none" },
    collisionBoundary: container ?? undefined,
  } as const
}

function SiteNav({ container }: { container: Stage }) {
  const shown = useShownPanel("product", container)
  const { onValueChange } = shown
  // Below md the bar is hidden behind the menu button, so start closed there.
  React.useEffect(() => {
    if (!window.matchMedia("(min-width: 48rem)").matches) onValueChange(null, { reason: "none" })
  }, [onValueChange])
  return (
    <NavigationMenu {...shown}>
      <NavigationMenuList>
        <NavigationMenuItem value="product">
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[min(45rem,calc(100cqw-4rem))]">
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
                className="group/feature hidden flex-col justify-between gap-6 rounded-(--overlay-item-radius) border border-panel-border bg-panel-raised p-5 text-panel-foreground outline-none focus-visible:focus-ring md:flex"
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
        <NavigationMenuItem value="developers">
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[min(24rem,calc(100cqw-4rem))]">
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

function SiteNavDemo() {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className="relative">
      <header className="flex h-(--header-height) items-center justify-between gap-6 border-b px-gutter">
        <div className="flex items-center gap-8">
          <a
            href="#lumen"
            className="rounded-xs text-xl font-extrabold tracking-tight text-foreground outline-none focus-visible:focus-ring"
          >
            Lumen
          </a>
          <div className="max-md:hidden">
            <SiteNav container={container} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="max-sm:hidden">
            Log in
          </Button>
          <Button size="sm">Start deploying</Button>
          <MobileNav />
        </div>
      </header>
      <div className="grid gap-4 px-gutter py-16">
        <h3 className="max-w-prose text-h2">Push to deploy. Everything else is handled.</h3>
        <p className="max-w-prose text-lead text-copy">
          Open Product or Developers in the bar above. Panels open on hover and on click, and close with Escape.
        </p>
      </div>
    </div>
  )
}

function DevelopersNav() {
  const [container, setContainer] = React.useState<Stage>(null)
  const shown = useShownPanel("developers", container)
  return (
    <div ref={setContainer} className="relative flex w-full justify-center self-start">
      <NavigationMenu {...shown}>
        <NavigationMenuList>
          <NavigationMenuItem value="developers">
            <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[min(24rem,calc(100cqw-4rem))]">
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
  )
}

/** Below md the bar becomes a menu button that opens the same links in a sheet. */
function MobileNav() {
  const groups = [
    { label: "Product", items: product },
    { label: "Developers", items: developers },
  ]
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" className="md:hidden" />}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Lumen</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-8">
          {groups.map((group) => (
            <nav key={group.label} aria-label={group.label} className="grid gap-2">
              <p className="text-caption font-semibold text-muted-foreground">{group.label}</p>
              <ul className="-mx-2 grid">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <a
                      href={`#${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex h-(--control-height-md) items-center gap-3 rounded-(--overlay-item-radius) px-2 text-label text-foreground outline-none hover:bg-accent focus-visible:focus-ring"
                    >
                      <item.icon className="size-4 text-muted-foreground" />
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="border-t pt-4">
            <ul className="-mx-2 grid">
              {["Pricing", "Changelog", "Log in"].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex h-(--control-height-md) items-center rounded-(--overlay-item-radius) px-2 text-label text-foreground outline-none hover:bg-accent focus-visible:focus-ring"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

export default function NavigationMenuDocs() {
  return (
    <Examples>
      <Example
        title="Site navigation"
        description="Triggers open crisp panels on bg-popover with a hairline border. Move along the bar and the panel resizes and slides to the next item. Below md, a menu button opens the same links in a sheet."
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
        <SiteNavDemo />
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
        <DevelopersNav />
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
        {/* One row when it fits; below that the links move to a row of their own under the logo. */}
        <div className="grid w-full max-w-176 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1.5 rounded-(--card-radius) border bg-background py-2.5 pr-2.5 pl-5 @2xl:flex">
          <a
            href="#lumen"
            className="justify-self-start rounded-xs text-lg font-extrabold tracking-tight text-foreground outline-none focus-visible:focus-ring"
          >
            Lumen
          </a>
          <NavigationMenu className="col-span-2 row-start-2 -ml-3 justify-self-start @2xl:mr-auto @2xl:ml-0">
            <NavigationMenuList>
              {["Product", "Docs", "Pricing", "Customers"].map((label) => (
                <NavigationMenuItem key={label} className={label === "Customers" ? "@max-md:hidden" : undefined}>
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
          <Button size="sm" className="col-start-2 row-start-1">
            Start deploying
          </Button>
        </div>
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
