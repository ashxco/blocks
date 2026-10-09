"use client"

import * as React from "react"
import { ExternalLinkIcon, GitBranchIcon, GitCommitHorizontalIcon, PanelRightIcon, RotateCcwIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const sides = ["top", "right", "bottom", "left"] as const

const details = [
  { label: "Status", value: <Badge variant="success">Ready</Badge> },
  { label: "Environment", value: "Production" },
  {
    label: "Branch",
    value: (
      <span className="inline-flex items-center gap-1.5">
        <GitBranchIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
        main
      </span>
    ),
  },
  {
    label: "Commit",
    value: (
      <span className="inline-flex items-center gap-1.5 font-mono text-code">
        <GitCommitHorizontalIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
        8f2c1a9
      </span>
    ),
  },
  { label: "Build time", value: "38s" },
  { label: "Regions", value: "Frankfurt, Virginia, Singapore" },
]

const steps = [
  { name: "Clone and restore cache", time: "3s" },
  { name: "Install dependencies", time: "7s" },
  { name: "Build", time: "21s" },
  { name: "Upload to 3 regions", time: "4s" },
  { name: "Assign domains", time: "1s" },
]

type Stage = HTMLDivElement | null

/**
 * The stage an example's sheet opens into, so the page shows the sheet
 * itself. contain-layout makes the stage the containing block for the fixed
 * overlay and panel, and isolate keeps them under the site header. The overlay
 * keeps its tint but not its blur, which in a stage this small only smears the
 * page into grey.
 */
function SheetStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className={cn("relative isolate h-full min-h-176 w-full overflow-hidden contain-layout [&_[data-slot=sheet-overlay]]:backdrop-blur-none", className)}>
      <DeploymentsPage action={children(container)} />
    </div>
  )
}

/** Open in place on the docs page: no focus move, no scroll lock, no dismissal on outside clicks. */
const inlineSheet = { defaultOpen: true, modal: false, disablePointerDismissal: true } as const

/** SheetBody in place on the page: the wheel carries on to the page once the body has nothing left to scroll. */
const inlineBody = "overscroll-auto"

const deployments = [
  { commit: "Add usage-based billing page", branch: "main", hash: "8f2c1a9", time: "4m ago" },
  { commit: "Fix plan cards jumping on toggle", branch: "feat-billing", hash: "c41e7b2", time: "1h ago" },
  { commit: "Upgrade to Node.js 22", branch: "chore/node-22", hash: "19ad03f", time: "3h ago" },
  { commit: "Redirect apex domain to www", branch: "fix/apex-redirect", hash: "e7b5c80", time: "Yesterday" },
  { commit: "Cache build output per region", branch: "main", hash: "2b9f6d1", time: "2 days ago" },
  { commit: "Move docs to docs.lumen.app", branch: "main", hash: "5d0e2aa", time: "3 days ago" },
  { commit: "Add preview comments", branch: "preview-comments", hash: "a3c9f14", time: "4 days ago" },
]

/** The deployments page an open sheet sits on. */
function DeploymentsPage({ action }: { action: React.ReactNode }) {
  return (
    <div className="grid content-start gap-8 p-6 sm:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-h3 text-foreground">Deployments</p>
          <p className="text-caption text-muted-foreground">lumen-web · 214 deployments</p>
        </div>
        {action}
      </div>
      <ul className="grid divide-y border-y">
        {deployments.map((row) => (
          <li key={row.hash} className="flex items-center justify-between gap-6 py-4">
            <span className="grid min-w-0 gap-0.5">
              <span className="truncate text-sm font-medium text-foreground">{row.commit}</span>
              <span className="truncate text-caption text-muted-foreground">
                {row.branch} · <span className="font-mono">{row.hash}</span>
              </span>
            </span>
            <span className="shrink-0 text-caption text-muted-foreground">{row.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DeploymentSheet({ container }: { container: Stage }) {
  return (
    <Sheet {...inlineSheet}>
      <SheetTrigger render={<Button />}>
        <PanelRightIcon data-icon="inline-start" />
        Deployment details
      </SheetTrigger>
      <SheetContent container={container} initialFocus={false}>
        <SheetHeader>
          <SheetTitle>Deployment 8f2c1a9</SheetTitle>
          <SheetDescription>“Add usage-based billing page” by Priya Raman, 4 minutes ago.</SheetDescription>
        </SheetHeader>
        <SheetBody className={inlineBody}>
          <dl className="grid divide-y rounded-(--card-radius) border">
            {details.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-right text-sm font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
          <section className="grid gap-3">
            <h3 className="text-title">Build steps</h3>
            <ol className="grid gap-2">
              {steps.map((step) => (
                <li key={step.name} className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2.5 text-copy">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
                    {step.name}
                  </span>
                  <span className="font-mono text-code text-muted-foreground tabular">{step.time}</span>
                </li>
              ))}
            </ol>
          </section>
        </SheetBody>
        <SheetFooter>
          <Button variant="outline">
            <RotateCcwIcon data-icon="inline-start" />
            Redeploy
          </Button>
          <Button nativeButton={false} render={<a href="#deployment" />}>
            Visit
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type Side = (typeof sides)[number]

/** One sheet, open in a stage, whose side people switch from the bar above it. */
function SidesDemo() {
  const [side, setSide] = React.useState<Side>("left")
  const [open, setOpen] = React.useState(true)

  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
        <code className="font-mono text-code text-muted-foreground">side=&quot;{side}&quot;</code>
        <ToggleGroup
          size="sm"
          aria-label="Sheet side"
          value={[side]}
          onValueChange={(value) => {
            const next = value[0] as Side | undefined
            if (!next) return
            setSide(next)
            setOpen(true)
          }}
        >
          {sides.map((option) => (
            <ToggleGroupItem key={option} value={option} className="capitalize">
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <SheetStage className="min-h-160">
        {(container) => (
          <Sheet open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
            <SheetTrigger render={<Button variant="outline" />}>Notification settings</SheetTrigger>
            <SheetContent side={side} container={container} initialFocus={false}>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>Choose what Lumen emails you about.</SheetDescription>
              </SheetHeader>
              <SheetBody className={inlineBody}>
                <div className="grid gap-4">
                  {["Failed deployments", "Domain and certificate changes", "Weekly usage summary"].map((label) => (
                    <label key={label} className="flex items-center justify-between gap-4 text-sm font-medium text-foreground">
                      {label}
                      <Switch defaultChecked={label !== "Weekly usage summary"} />
                    </label>
                  ))}
                </div>
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}
      </SheetStage>
    </div>
  )
}

function BuildSettingsSheet({ container }: { container: Stage }) {
  return (
    <Sheet {...inlineSheet}>
      <SheetTrigger render={<Button variant="outline" />}>Edit build settings</SheetTrigger>
      <SheetContent container={container} initialFocus={false}>
        <form className="contents" onSubmit={(event) => event.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Build settings</SheetTitle>
            <SheetDescription>Changes apply to the next deployment of lumen-web.</SheetDescription>
          </SheetHeader>
          <SheetBody className={inlineBody}>
            <Field>
              <FieldLabel htmlFor="sheet-build">Build command</FieldLabel>
              <Input id="sheet-build" defaultValue="npm run build" className="font-mono" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-output">Output directory</FieldLabel>
              <Input id="sheet-output" defaultValue=".next" className="font-mono" />
              <FieldDescription>Relative to the root directory.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-root">Root directory</FieldLabel>
              <Input id="sheet-root" defaultValue="apps/web" className="font-mono" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-node">Node.js version</FieldLabel>
              <Input id="sheet-node" defaultValue="22.x" />
            </Field>
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
            <SheetClose render={<Button type="submit" />}>Save settings</SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function SheetDocs() {
  return (
    <Examples>
      <Example
        title="Details panel"
        layout="full"
        description="A sheet opens at the edge rather than over the middle of the page, so people keep their place in the list behind it. Use SheetBody for the scrolling middle and SheetFooter for actions pinned to the bottom edge."
        code={`<SheetContent>
  <SheetHeader>
    <SheetTitle>Deployment 8f2c1a9</SheetTitle>
    <SheetDescription>…</SheetDescription>
  </SheetHeader>
  <SheetBody>…</SheetBody>
  <SheetFooter>
    <Button variant="outline">Redeploy</Button>
    <Button>Visit</Button>
  </SheetFooter>
</SheetContent>`}
      >
        <SheetStage>{(container) => <DeploymentSheet container={container} />}</SheetStage>
      </Example>

      <Example
        title="Sides"
        layout="full"
        description="Right is the default and suits details and edit forms. Use left for navigation, bottom for short actions on small screens. Switch the side above the preview."
        code={`<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
      <SheetDescription>Choose what Lumen emails you about.</SheetDescription>
    </SheetHeader>
    <SheetBody>…</SheetBody>
  </SheetContent>
</Sheet>`}
      >
        <SidesDemo />
      </Example>

      <Example
        title="Floating"
        layout="full"
        description={`variant="floating" insets the sheet from the viewport and rounds it with --dialog-radius. It reads as a layer over the app rather than part of its frame.`}
        code={`<SheetContent variant="floating">…</SheetContent>`}
      >
        <SheetStage className="min-h-136">
          {(container) => (
            <Sheet {...inlineSheet}>
              <SheetTrigger render={<Button variant="outline" />}>Open floating sheet</SheetTrigger>
              <SheetContent variant="floating" container={container} initialFocus={false}>
                <SheetHeader>
                  <SheetTitle>Preview comments</SheetTitle>
                  <SheetDescription>3 open threads on feat-billing.lumen.app</SheetDescription>
                </SheetHeader>
                <SheetBody className={inlineBody}>
                  {[
                    { name: "Mateo Ortiz", text: "The plan cards jump when the toggle switches to yearly." },
                    { name: "Priya Raman", text: "Can we show the usage meter above the invoices table?" },
                    { name: "Aiko Kato", text: "Copy on the downgrade notice reads well now. Approving." },
                  ].map((comment) => (
                    <article key={comment.name} className="grid gap-1 border-b pb-5 last:border-b-0">
                      <h3 className="text-title">{comment.name}</h3>
                      <p className="text-sm text-copy">{comment.text}</p>
                    </article>
                  ))}
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </SheetStage>
      </Example>

      <Example
        title="Edit form"
        layout="full"
        description="Longer forms fit a sheet better than a dialog. Close it with SheetClose once the save succeeds."
      >
        <SheetStage>{(container) => <BuildSettingsSheet container={container} />}</SheetStage>
      </Example>

      <Guidelines
        do={[
          "Use a sheet for details and edits that relate to the page behind it.",
          "Keep the title short and put context, such as the branch or author, in the description.",
          "Pin the actions in SheetFooter so they stay in view while the body scrolls.",
        ]}
        dont={[
          "Don’t stack a sheet on another sheet.",
          "Don’t use a sheet for a quick yes or no. Use an alert dialog.",
          "Don’t make a side sheet wider than --sheet-width. Give big content its own page.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "On SheetContent. The edge the sheet slides in from." },
          { prop: "variant", type: '"edge" | "floating"', default: '"edge"', description: "On SheetContent. Flush against the viewport, or inset with rounded corners." },
          { prop: "showCloseButton", type: "boolean", default: "true", description: "On SheetContent. Shows the close button in the top-right corner." },
          { prop: "open", type: "boolean", description: "On Sheet. Controlled open state. Pair with onOpenChange." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "On Sheet. Called when the sheet opens or closes." },
          { prop: "SheetBody", type: "component", description: "The scrolling middle between header and footer, with --dialog-padding on the sides." },
          { prop: "render", type: "ReactElement", description: "On SheetTrigger and SheetClose. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
