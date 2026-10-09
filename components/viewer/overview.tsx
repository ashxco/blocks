/**
 * Pieces of the viewer overview: the entry tiles and the live miniatures
 * inside them, and the deploy card used for the light and dark comparison.
 * Every miniature is made of real Blocks components or token swatches.
 */
import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  RocketIcon,
  RotateCcwIcon,
  TerminalIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Entry tile                                                                  */
/* -------------------------------------------------------------------------- */

export function EntryTile({
  href,
  title,
  description,
  tone = "default",
  children,
}: {
  href: string
  title: string
  description: string
  tone?: "default" | "panel"
  /** The live miniature. Rendered inert: it is a picture, not a control. */
  children: React.ReactNode
}) {
  const panel = tone === "panel"
  return (
    <article
      className={cn(
        // In a two-column grid the tile spans two of its rows (subgrid), so the
        // captions of tiles side by side start on the same line.
        "group/tile relative grid grid-rows-[1fr_auto] overflow-hidden rounded-(--panel-radius) border",
        "md:row-span-2 md:grid-rows-subgrid md:gap-y-0",
        "transition-colors duration-(--duration-base) ease-standard",
        panel
          ? "border-panel-border bg-panel text-panel-foreground hover:border-panel-foreground/40"
          : "bg-background hover:border-foreground"
      )}
    >
      <div
        inert
        aria-hidden="true"
        className={cn(
          "relative grid min-h-72 place-items-center overflow-hidden lg:min-h-112",
          panel ? "bg-panel" : "bg-subtle"
        )}
      >
        <div className="grid w-full grid-cols-[minmax(0,1fr)] place-items-center px-5 py-10 transition-transform duration-(--duration-slower) ease-out group-hover/tile:scale-[1.02] sm:p-10 md:p-6 lg:p-10">
          {children}
        </div>
      </div>
      <div className={cn("flex items-start justify-between gap-6 border-t p-6 sm:p-8", panel && "border-panel-border")}>
        <div className="grid gap-2">
          <h3 className={cn("text-h3", panel && "text-panel-foreground")}>
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-(--panel-radius) focus-visible:after:focus-ring"
            >
              {title}
            </Link>
          </h3>
          <p className={cn("max-w-prose text-body", panel ? "text-panel-muted" : "text-copy")}>
            {description}
          </p>
        </div>
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-(--duration-base) ease-standard",
            panel
              ? "border-panel-border text-panel-foreground group-hover/tile:border-panel-foreground group-hover/tile:bg-panel-foreground group-hover/tile:text-panel"
              : "text-foreground group-hover/tile:border-foreground group-hover/tile:bg-foreground group-hover/tile:text-background"
          )}
        >
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </span>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Miniatures                                                                  */
/* -------------------------------------------------------------------------- */

const swatches = [
  "bg-foreground",
  "bg-brand",
  "bg-success",
  "bg-subtle border",
  "bg-tint-violet",
  "bg-tint-mint",
  "bg-tint-sand",
  "bg-tint-sky",
]

/* Five steps that stay distinct at this size: larger radii would all read as circles. */
const radii = ["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-full"]

/* The miniatures size themselves to their own width (@container), so they fit two-up tiles on tablets. */
export function FoundationsMiniature() {
  return (
    <div className="@container w-full max-w-112">
      <div className="grid gap-6 rounded-(--card-radius) border bg-background p-6 @sm:p-7">
        <div className="flex items-end justify-between gap-6">
          <div className="grid gap-1">
            <span className="text-6xl font-extrabold text-foreground @sm:text-7xl">Aa</span>
            <span className="text-caption text-muted-foreground">Plus Jakarta Sans, 800</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {swatches.map((s) => (
              <span key={s} className={cn("size-7 rounded-sm @sm:size-9", s)} />
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 border-t pt-5">
          {radii.map((r) => (
            <span
              key={r}
              className={cn("size-10 border-(length:--border-width-strong) border-foreground/80 @sm:size-14", r)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ComponentsMiniature() {
  return (
    <div className="grid w-full max-w-80 gap-4 rounded-(--card-radius) border bg-background p-5 sm:max-w-96 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-title text-foreground">Deploy settings</span>
        <Badge variant="success">Live</Badge>
      </div>
      <Input defaultValue="lumen-web" aria-label="Project name" readOnly />
      <div className="flex items-center justify-between gap-3 text-label text-foreground">
        Deploy on push
        <Switch defaultChecked aria-label="Deploy on push" />
      </div>
      <div className="flex items-center gap-3 text-label font-medium text-copy">
        <Checkbox defaultChecked aria-label="Comment on pull requests" />
        Comment on pull requests
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm">Save changes</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  )
}

const bars = ["h-5", "h-8", "h-6", "h-11", "h-9", "h-14", "h-12", "h-16", "h-[4.5rem]", "h-20"]

export function MoleculesMiniature() {
  return (
    <div className="grid w-full max-w-96 min-w-0 gap-3">
      <div className="grid gap-4 rounded-(--card-radius) border bg-background p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <span className="text-caption font-semibold text-muted-foreground">Deployments this week</span>
            <span className="text-h2 text-foreground tabular">1,284</span>
          </div>
          <Badge variant="success">+12%</Badge>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={h}
              className={cn("flex-1 rounded-t-xs", h, i === bars.length - 1 ? "bg-chart-1" : "bg-chart-1/25")}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-(--card-radius) border bg-background p-4">
        <Avatar size="sm">
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1 truncate text-label font-medium text-copy">
          <span className="font-semibold text-foreground">Maya Chen</span> deployed to production
        </span>
        <span className="text-caption text-muted-foreground">2m</span>
      </div>
    </div>
  )
}

const features = [
  { icon: GitBranchIcon, label: "Previews", tint: "bg-tint-violet" },
  { icon: TerminalIcon, label: "Logs", tint: "bg-tint-mint" },
  { icon: RotateCcwIcon, label: "Rollbacks", tint: "bg-tint-sky" },
]

export function TemplatesMiniature() {
  return (
    <div className="@container w-full max-w-112 overflow-hidden rounded-(--card-radius) border border-panel-border bg-card text-copy">
      <div className="flex h-8 items-center border-b px-3">
        <span className="font-mono text-xs text-muted-foreground">lumen.dev</span>
      </div>
      <div className="grid gap-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-label font-extrabold text-foreground">
            <span className="size-3 rounded-full bg-foreground" />
            Lumen
          </span>
          <span className="hidden gap-3 text-xs font-medium text-muted-foreground @sm:flex">
            <span>Product</span>
            <span>Pricing</span>
            <span>Docs</span>
          </span>
          <Button size="sm">Sign up</Button>
        </div>
        <div className="grid gap-2 py-2">
          <span className="text-h3 text-foreground">Ship on every push.</span>
          <span className="text-caption text-copy">Preview URLs for every branch, logs and metrics built in.</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Start deploying</Button>
          <Button size="sm" variant="outline">
            Book a demo
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {features.map(({ icon: Icon, label, tint }) => (
            <span key={label} className={cn("grid gap-3 rounded-sm p-3", tint)}>
              <Icon aria-hidden="true" className="size-4 text-foreground" />
              <span className="truncate text-xs font-semibold text-foreground">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Deploy card (light and dark comparison)                                     */
/* -------------------------------------------------------------------------- */

export function DeployCard() {
  return (
    <div className="grid w-full max-w-112 gap-5 rounded-(--card-radius) border bg-card p-(--card-padding) text-card-foreground">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-brand-subtle text-brand-subtle-foreground">
            <RocketIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="grid">
            <span className="text-title text-foreground">lumen-web</span>
            <span className="text-caption text-muted-foreground">Production</span>
          </div>
        </div>
        <Badge variant="success">Ready</Badge>
      </div>
      <div className="grid gap-2 text-caption text-copy">
        <span className="flex items-center gap-2">
          <GitBranchIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
          main
        </span>
        <span className="flex items-center gap-2">
          <GitCommitHorizontalIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <span className="font-mono">3f9c2e1</span> Add preview comments
        </span>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between text-caption">
          <span className="font-semibold text-foreground">Build</span>
          <span className="text-muted-foreground tabular">42s</span>
        </div>
        <Progress value={100} aria-label="Build progress" />
      </div>
      <div className="flex items-center justify-between gap-3 border-t pt-5">
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
        </AvatarGroup>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            View logs
          </Button>
          <Button size="sm">Visit</Button>
        </div>
      </div>
    </div>
  )
}
