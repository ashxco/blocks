"use client"

import * as React from "react"
import {
  ChartColumnIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  HouseIcon,
  InboxIcon,
  ListTodoIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SettingsIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { BrandMark } from "@/components/blocks/wordmark"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

/**
 * Keeps the sidebar inside the preview canvas: the fixed desktop sidebar and,
 * on a phone, the sheet it opens as. The frame grows with the page inside it.
 */
const framed =
  "relative isolate min-h-[36rem] overflow-hidden contain-layout **:data-[slot=sidebar-container]:absolute **:data-[slot=sidebar-container]:h-full"

const nav = [
  { title: "Home", icon: HouseIcon },
  { title: "My tasks", icon: ListTodoIcon },
  { title: "Inbox", icon: InboxIcon, badge: "3" },
  { title: "Docs", icon: FileTextIcon },
  { title: "Automations", icon: ZapIcon },
  { title: "Reports", icon: ChartColumnIcon },
]

/** Status dots follow the project badges: success on track, warning at risk, destructive off track. */
const projects = [
  { name: "Website relaunch", dot: "bg-success" },
  { name: "Mobile app 2.0", dot: "bg-warning" },
  { name: "Q4 planning", dot: "bg-success" },
  { name: "Customer portal", dot: "bg-destructive" },
]

const dueSoon = [
  { title: "Write the launch announcement", project: "Website relaunch", due: "Oct 14", overdue: false },
  { title: "Fix crash when uploading photos", project: "Mobile app 2.0", due: "Oct 7", overdue: true },
  { title: "Draft the Q4 hiring plan", project: "Q4 planning", due: "Oct 14", overdue: false },
]

function WorkspaceButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" aria-label="Workspace: Acme Inc.">
          {/* The menu button sizes every icon to size-4; the workspace mark keeps its tile size. */}
          <BrandMark className="size-8!" />
          <span className="grid min-w-0 flex-1">
            <span className="truncate text-label text-foreground">Acme Inc.</span>
            <span className="truncate text-caption font-normal text-muted-foreground">Pro plan</span>
          </span>
          <ChevronsUpDownIcon className="ml-auto text-muted-foreground" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" aria-label="Account: Maya Patel">
          <Avatar size="sm">
            <AvatarFallback tone="violet">MP</AvatarFallback>
          </Avatar>
          <span className="grid min-w-0 flex-1">
            <span className="truncate text-label text-foreground">Maya Patel</span>
            <span className="truncate text-caption font-normal text-muted-foreground">maya@acme.com</span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/**
 * Whether the preview frame is narrower than the md breakpoint (48rem), so the
 * Mobile preview width shows the layout a phone gets on a desktop window.
 * Undefined until the frame is measured.
 */
function useNarrowFrame(frame: HTMLElement | null) {
  const [narrow, setNarrow] = React.useState<boolean | undefined>(undefined)
  React.useEffect(() => {
    if (!frame) return
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 48 * rem))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [frame])
  return narrow
}

function AppSidebarDemo({ variant = "sidebar" }: { variant?: "sidebar" | "inset" | "floating" }) {
  const [active, setActive] = React.useState("Home")
  const [frame, setFrame] = React.useState<HTMLDivElement | null>(null)
  // A narrow frame forces the phone layout. Otherwise the window decides, since
  // the desktop sidebar itself shows from the md breakpoint of the window.
  const narrow = useNarrowFrame(frame)

  return (
    // On a phone the sidebar is a sheet. The preview opens it in the frame, so the page shows the sidebar.
    <SidebarProvider ref={setFrame} mobile={narrow || undefined} defaultOpenMobile className={framed}>
      <Sidebar collapsible="icon" variant={variant} container={frame}>
        <SidebarHeader>
          <WorkspaceButton />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active === item.title}
                      aria-current={active === item.title ? "page" : undefined}
                      tooltip={item.title}
                      onClick={() => setActive(item.title)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="New project">
              <PlusIcon />
              <span className="sr-only">New project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map(({ name, dot }) => (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton
                      isActive={active === name}
                      onClick={() => setActive(name)}
                    >
                      <span aria-hidden="true" className="grid size-4 place-items-center">
                        <span className={`size-1.5 rounded-full ${dot}`} />
                      </span>
                      <span>{name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label={`More actions for ${name}`}>
                      <MoreHorizontalIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5 data-vertical:self-center" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="max-sm:hidden">
                <BreadcrumbLink href="#acme">Acme</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="max-sm:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage>{active}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="grid content-start gap-6 overflow-y-auto p-6">
          <div className="grid gap-1">
            <h3 className="text-h3">{active}</h3>
            <p className="text-body text-copy">Press Cmd+B or Ctrl+B, or click the panel button, to collapse the sidebar to icons.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Active projects", "24"],
              ["Tasks completed", "1,284"],
              ["On-time delivery", "92%"],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 rounded-(--card-radius) border bg-card p-5">
                <p className="text-caption text-muted-foreground">{label}</p>
                <p className="text-2xl font-extrabold text-foreground tabular">{value}</p>
              </div>
            ))}
          </div>
          <section aria-labelledby="sidebar-due" className="grid gap-3">
            <h4 id="sidebar-due" className="text-title text-foreground">
              Due soon
            </h4>
            <ul className="grid divide-y rounded-(--card-radius) border bg-card">
              {dueSoon.map((task) => (
                <li key={task.title} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="grid min-w-0 gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{task.title}</span>
                    <span className="truncate text-caption text-muted-foreground">{task.project}</span>
                  </span>
                  <span
                    className={
                      task.overdue
                        ? "shrink-0 text-caption font-semibold text-destructive tabular"
                        : "shrink-0 text-caption text-muted-foreground tabular"
                    }
                  >
                    {task.overdue ? `Overdue · ${task.due}` : task.due}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function SidebarDocs() {
  return (
    <Examples>
      <Example
        title="App sidebar"
        description="A workspace switcher, primary navigation, projects and the account. Collapse it to icons with the trigger, the rail on its edge, or Cmd+B. Below the md breakpoint it opens as a sheet."
        layout="full"
        code={`<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>…</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive
              tooltip="Home"
              render={<Link href="/acme/home" />}
            >
              <HouseIcon />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>…</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <header>
      <SidebarTrigger />
    </header>
    {children}
  </SidebarInset>
</SidebarProvider>`}
      >
        <AppSidebarDemo />
      </Example>

      <Example
        title="Inset"
        description="From the md breakpoint up, the page sits in a bordered, rounded frame on the sidebar colour. On phones there is no frame: the sidebar opens as a sheet, as in the first example. Use floating for a sidebar that is itself a bordered card."
        layout="full"
        code={`<Sidebar variant="inset" collapsible="icon">…</Sidebar>
<Sidebar variant="floating">…</Sidebar>`}
      >
        <AppSidebarDemo variant="inset" />
      </Example>

      <Example
        title="Sub-menus"
        description="Nest a SidebarMenuSub inside a Collapsible. The active sub-item is marked on the guide line."
        layout="full"
        code={`<Collapsible defaultOpen render={<SidebarMenuItem />}>
  <CollapsibleTrigger render={<SidebarMenuButton />}>
    <SettingsIcon />
    <span>Settings</span>
    <ChevronRightIcon className="ml-auto transition-transform group-data-panel-open/collapsible-trigger:rotate-90" />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton href="/settings/members" isActive>
          Members
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </CollapsibleContent>
</Collapsible>`}
      >
        <SidebarProvider className="min-h-0 justify-center bg-subtle p-6 sm:p-10">
          <Sidebar collapsible="none" className="rounded-(--card-radius) border">
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ChartColumnIcon />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible defaultOpen render={<SidebarMenuItem />}>
                    <CollapsibleTrigger render={<SidebarMenuButton />}>
                      <SettingsIcon />
                      <span>Settings</span>
                      <ChevronRightIcon className="ml-auto text-muted-foreground transition-transform duration-(--duration-base) ease-out group-data-panel-open/collapsible-trigger:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {["General", "Members", "Notifications", "Integrations"].map((label) => (
                          <SidebarMenuSubItem key={label}>
                            <SidebarMenuSubButton href={`#${label.toLowerCase()}`} isActive={label === "Members"}>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </Example>

      <Example
        title="Menu states"
        description={`Hover fills with bg-sidebar-accent; the active item is an ink row. Badges count, actions appear on hover, and variant="outline" frames an add action, here dashed. Skeletons hold the space while items load.`}
        layout="full"
      >
        <SidebarProvider className="min-h-0 justify-center bg-subtle p-6 sm:p-10">
          <Sidebar collapsible="none" className="rounded-(--card-radius) border">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <InboxIcon />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ListTodoIcon />
                      <span>My tasks</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label="More actions for My tasks">
                      <MoreHorizontalIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <ZapIcon />
                      <span>Automations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton variant="outline" className="border-dashed">
                      <PlusIcon />
                      <span>New project</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Loading</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </Example>

      <Guidelines
        do={[
          "Put the five to seven places people go most at the top, with an icon for each.",
          "Give every SidebarMenuButton a tooltip when the sidebar can collapse to icons.",
          "Render menu buttons as router links and set aria-current on the active one.",
          "Keep the sidebar width on the --sidebar-width token so every app page lines up.",
        ]}
        dont={[
          "Don’t put page actions like Save in the sidebar. They belong in the page header.",
          "Don’t nest more than one level of sub-menus.",
          "Don’t colour the active item violet. Ink marks where you are; violet is for focus.",
          "Don’t hide the trigger. People need a visible way to collapse and reopen the sidebar.",
        ]}
      />

      <ApiTable
        title="SidebarProvider and Sidebar"
        rows={[
          { prop: "defaultOpen", type: "boolean", default: "true", description: "SidebarProvider: open on first render, when uncontrolled." },
          { prop: "open / onOpenChange", type: "boolean / (open) => void", description: "SidebarProvider: control the desktop open state." },
          { prop: "mobile", type: "boolean", default: "below md", description: "SidebarProvider: force the phone layout (a sheet) or the desktop one, for a sidebar in a frame narrower than the window." },
          { prop: "side", type: '"left" | "right"', default: '"left"', description: "Sidebar: which edge it sits on." },
          { prop: "variant", type: '"sidebar" | "floating" | "inset"', default: '"sidebar"', description: "Sidebar: a hairline edge, a bordered card, or an inset page frame." },
          { prop: "collapsible", type: '"offcanvas" | "icon" | "none"', default: '"offcanvas"', description: "Sidebar: slide out of view, shrink to --sidebar-width-icon, or stay put." },
          { prop: "useSidebar()", type: "{ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }", description: "Read and change the sidebar from any child." },
        ]}
      />

      <ApiTable
        title="Menu"
        rows={[
          { prop: "isActive", type: "boolean", default: "false", description: "SidebarMenuButton and SidebarMenuSubButton: marks the current page." },
          { prop: "tooltip", type: "string | TooltipContent props", description: "SidebarMenuButton: shown on hover when collapsed to icons." },
          { prop: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "SidebarMenuButton: height from --control-height-sm or --control-height-lg; sm is for dense lists." },
          { prop: "variant", type: '"default" | "outline"', default: '"default"', description: "SidebarMenuButton: outline adds a hairline, for a create action." },
          { prop: "render", type: "ReactElement", description: "SidebarMenuButton, SidebarMenuSubButton, SidebarGroupLabel, SidebarGroupAction, SidebarMenuAction: render as another element." },
          { prop: "showOnHover", type: "boolean", default: "false", description: "SidebarMenuAction: hide until the row is hovered or focused, on desktop." },
          { prop: "showIcon", type: "boolean", default: "false", description: "SidebarMenuSkeleton: include an icon placeholder." },
        ]}
      />
    </Examples>
  )
}
