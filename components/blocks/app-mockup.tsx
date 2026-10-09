"use client"

import * as React from "react"
import {
  ActivityIcon,
  ChevronsUpDownIcon,
  DatabaseIcon,
  GlobeIcon,
  LayoutGridIcon,
  LockIcon,
  RocketIcon,
  ScrollTextIcon,
  SettingsIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface AppMockupProps {
  /** Address shown in the browser bar. */
  url?: string
  /**
   * Let people click and type in the mockup. Off by default: the screen is
   * inert and announced as one image with `label`.
   */
  interactive?: boolean
  /** Accessible description of the screen when it is not interactive. */
  label?: string
  /** Set to false to drop the brand-subtle stage around the browser frame. */
  stage?: boolean
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const nav = [
  { label: "Overview", icon: LayoutGridIcon },
  { label: "Deployments", icon: RocketIcon },
  { label: "Logs", icon: ScrollTextIcon },
  { label: "Metrics", icon: ActivityIcon },
  { label: "Domains", icon: GlobeIcon },
  { label: "Databases", icon: DatabaseIcon },
  { label: "Settings", icon: SettingsIcon, active: true },
]

const regions = [
  { value: "fra-1", label: "Frankfurt (fra-1)" },
  { value: "iad-1", label: "Washington, D.C. (iad-1)" },
  { value: "sin-1", label: "Singapore (sin-1)" },
]

const commands = [
  { id: "install", label: "Install command", value: "npm ci" },
  { id: "build", label: "Build command", value: "npm run build" },
  { id: "start", label: "Start command", value: "npm run start" },
  { id: "port", label: "Port", value: "3000" },
]

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex h-11 items-center gap-3 border-b bg-subtle px-4">
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </span>
      <span className="mx-auto flex h-7 max-w-full min-w-0 items-center gap-1.5 rounded-full border bg-background px-3 font-mono text-caption text-muted-foreground">
        <LockIcon aria-hidden="true" className="size-3 shrink-0" />
        <span className="truncate">{url}</span>
      </span>
      <span aria-hidden="true" className="w-11 shrink-0" />
    </div>
  )
}

function MockSidebar() {
  return (
    <aside className="hidden flex-col border-r bg-sidebar p-3 @min-[46rem]/mock:flex">
      <div className="flex items-center gap-2.5 rounded-sm px-2 py-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-xs bg-primary text-caption font-bold text-primary-foreground">
          A
        </span>
        <span className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate text-label text-sidebar-foreground">Acme</span>
          <span className="truncate text-caption text-muted-foreground">acme/web</span>
        </span>
        <ChevronsUpDownIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <nav aria-label="Project" className="mt-4 grid gap-0.5">
        {nav.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex h-9 items-center gap-2.5 rounded-sm bg-sidebar-accent px-2.5 text-left text-label text-sidebar-accent-foreground outline-none focus-visible:focus-ring [&_svg]:size-4"
                : "flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-left text-label text-muted-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:focus-ring [&_svg]:size-4"
            }
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2.5 border-t border-sidebar-border px-2 pt-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-tint-violet font-bold text-foreground">AR</AvatarFallback>
        </Avatar>
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-label text-sidebar-foreground">Ana Ruiz</span>
          <span className="truncate text-caption text-muted-foreground">Owner</span>
        </span>
      </div>
    </aside>
  )
}

function DeploySettings({ idPrefix }: { idPrefix: string }) {
  const id = (name: string) => `${idPrefix}-${name}`
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b px-5 py-5 @min-[34rem]/mock:px-8 @min-[34rem]/mock:py-6">
        <div className="grid gap-1">
          <p className="text-h4 text-foreground">Deploy settings</p>
          <p className="text-caption text-muted-foreground">
            Detected Next.js 16 on Node 22. Change a command to override it.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 bg-success-subtle text-success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          Auto-detected
        </Badge>
      </div>

      <div className="grid gap-5 px-5 py-6 @min-[34rem]/mock:grid-cols-2 @min-[34rem]/mock:px-8 @min-[34rem]/mock:py-7">
        {commands.map((c) => (
          <div key={c.id} className="grid gap-2">
            <Label htmlFor={id(c.id)}>{c.label}</Label>
            <Input id={id(c.id)} defaultValue={c.value} spellCheck={false} className="font-mono" />
          </div>
        ))}

        <div className="grid gap-2">
          <Label htmlFor={id("region")}>Region</Label>
          <Select items={regions} defaultValue="fra-1">
            <SelectTrigger id={id("region")} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-(--control-radius) border px-4 py-3 @min-[34rem]/mock:self-end">
          <span className="grid gap-0.5">
            <Label htmlFor={id("auto")}>Deploy on push</Label>
            <span className="text-caption text-muted-foreground">Every push to main</span>
          </span>
          <Switch id={id("auto")} defaultChecked />
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-subtle px-5 py-4 @min-[34rem]/mock:px-8">
        <p className="text-caption text-muted-foreground">Last deploy 2 minutes ago by Ana Ruiz</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Discard
          </Button>
          <Button size="sm">
            <RocketIcon data-icon="inline-start" />
            Save and deploy
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * A product screen inside a browser frame, built from real components: a
 * project sidebar and a deploy settings form, on a brand-subtle stage.
 */
export function AppMockup({
  url = "app.lumen.dev/acme/web/settings",
  interactive = false,
  label = "The Lumen dashboard: deploy settings for the acme/web project, with build commands, region and deploy on push.",
  stage = true,
  contained = true,
  className,
}: AppMockupProps) {
  const idPrefix = React.useId()

  const frame = (
    <div
      className="@container/mock overflow-hidden rounded-(--card-radius) border bg-background text-left"
      inert={!interactive}
    >
      <BrowserBar url={url} />
      <div className="grid min-h-96 @min-[46rem]/mock:grid-cols-[14rem_minmax(0,1fr)]">
        <MockSidebar />
        <DeploySettings idPrefix={idPrefix} />
      </div>
    </div>
  )

  return (
    <section
      data-slot="app-mockup"
      className={cn("@container/app-mockup", contained && "container-page py-section-sm", className)}
    >
      <div
        role={interactive ? undefined : "img"}
        aria-label={interactive ? undefined : label}
        className={
          stage
            ? "rounded-(--panel-radius) bg-brand-subtle p-3 @min-[36rem]/app-mockup:p-6 @narrow/app-mockup:p-12"
            : undefined
        }
      >
        {frame}
      </div>
    </section>
  )
}
