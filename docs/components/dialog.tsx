"use client"

import * as React from "react"
import { GlobeIcon, MoreHorizontalIcon, PencilIcon, ArrowRightLeftIcon, Trash2Icon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const shortcuts = [
  { keys: ["⌘", "K"], label: "Search projects and pages" },
  { keys: ["G", "D"], label: "Go to deployments" },
  { keys: ["G", "L"], label: "Go to logs" },
  { keys: ["⌘", "⇧", "R"], label: "Redeploy the latest commit" },
  { keys: ["⌘", "."], label: "Cancel the running build" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
]

const buildLog = [
  "12:04:31  Cloning github.com/lumen-labs/web (branch: main, commit: 8f2c1a9)",
  "12:04:32  Cloning completed in 912ms",
  "12:04:33  Restored build cache from previous deployment",
  "12:04:33  Detected Next.js 16.3 and Node.js 22.x",
  "12:04:34  Running \"npm install\"",
  "12:04:41  added 412 packages, audited 413 packages in 7s",
  "12:04:41  found 0 vulnerabilities",
  "12:04:41  Running \"npm run build\"",
  "12:04:44  Creating an optimized production build",
  "12:04:58  Compiled successfully in 14.2s",
  "12:04:58  Linting and checking validity of types",
  "12:05:01  Collecting page data",
  "12:05:02  Generating static pages (38/38)",
  "12:05:04  Collecting build traces",
  "12:05:04  Finalizing page optimization",
  "12:05:05  Uploading build output to 3 regions",
  "12:05:07  fra1 ready, iad1 ready",
  "12:05:08  sin1 ready",
  "12:05:09  Assigned lumen.app and www.lumen.app",
  "12:05:09  Deployment ready at lumen-web-8f2c1a9.lumen.app",
]

type Stage = HTMLDivElement | null

/** Inside a stage, the dialog fits the stage rather than the viewport. */
const inStage = "max-h-[calc(100%-2rem)]"

function AddDomainDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)
  const [domain, setDomain] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setDomain("")
      setError(null)
      setPending(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = domain.trim()
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(value)) {
      setError("Enter a domain such as app.example.com, without https://.")
      return
    }
    setError(null)
    setPending(true)
    window.setTimeout(() => handleOpenChange(false), 1200)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false} disablePointerDismissal>
      <DialogTrigger render={<Button />}>
        <GlobeIcon data-icon="inline-start" />
        Add domain
      </DialogTrigger>
      <DialogContent container={container} initialFocus={false} className={inStage}>
        <form onSubmit={handleSubmit} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>Add a domain</DialogTitle>
            <DialogDescription>
              Point a domain you own at lumen-web. We issue the certificate as soon as DNS resolves.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="dialog-domain">Domain</FieldLabel>
            <Input
              id="dialog-domain"
              placeholder="app.example.com"
              autoComplete="off"
              value={domain}
              aria-invalid={error ? true : undefined}
              aria-describedby="dialog-domain-help"
              onChange={(event) => setDomain(event.target.value)}
            />
            <FieldDescription id="dialog-domain-help" className={error ? "text-destructive" : undefined}>
              {error ?? "Subdomains work too. You can add more later."}
            </FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={pending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Adding domain" : "Add domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** A menu item that opens a dialog. The dialog starts open; close it and choose Transfer to open it again. */
function ProjectMenuWithDialog({ container }: { container: Stage }) {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Project options" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" container={container}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <ArrowRightLeftIcon />
              Transfer
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
        <DialogContent container={container} initialFocus={false} className={inStage}>
          <DialogHeader>
            <DialogTitle>Transfer lumen-web</DialogTitle>
            <DialogDescription>
              The project moves with its deployments and domains. Members of the new team get access straight away.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="dialog-transfer-team">Team</FieldLabel>
            <NativeSelect id="dialog-transfer-team" defaultValue="marketing" className="w-full">
              <NativeSelectOption value="marketing">Marketing site</NativeSelectOption>
              <NativeSelectOption value="internal">Internal tools</NativeSelectOption>
              <NativeSelectOption value="platform">Platform</NativeSelectOption>
            </NativeSelect>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Transfer project</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * A stage for an example that shows its dialog already open. The dialog
 * portals into the stage instead of <body>: contain-layout makes the stage the
 * containing block for the fixed overlay and popup, and isolate keeps them
 * under the site header. The dialog is non-modal there, so the page still
 * scrolls, and a click elsewhere leaves it open. Close it to reach the trigger.
 */
function DialogStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className={cn("relative isolate h-full min-h-112 w-full overflow-hidden contain-layout", className)}>
      <StagePage action={children(container)} />
    </div>
  )
}

const projectSettings = [
  { label: "Framework", value: "Next.js" },
  { label: "Build command", value: "npm run build", mono: true },
  { label: "Output directory", value: ".next", mono: true },
  { label: "Node.js version", value: "22.x" },
  { label: "Region", value: "Frankfurt, Germany" },
]

/** The project page the open dialog sits on. */
function StagePage({ action }: { action: React.ReactNode }) {
  return (
    <div className="grid content-start gap-8 p-6 sm:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-h3 text-foreground">lumen-web</p>
          <p className="text-caption text-muted-foreground">Production · updated 4 minutes ago</p>
        </div>
        {action}
      </div>
      <dl className="grid divide-y border-y">
        {projectSettings.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6 py-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className={row.mono ? "font-mono text-code text-foreground" : "text-sm font-medium text-foreground"}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Open in place on the docs page: no focus move, no scroll lock, no dismissal on outside clicks. */
const inlineDialog = { defaultOpen: true, modal: false, disablePointerDismissal: true } as const

type DialogSize = "sm" | "default" | "lg"

const sizeOptions: { value: DialogSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "default", label: "Default" },
  { value: "lg", label: "Large" },
]

/** One dialog, open in a stage, whose size people switch from the bar above it. */
function SizesDemo() {
  const [size, setSize] = React.useState<DialogSize>("lg")
  const [open, setOpen] = React.useState(true)

  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 sm:px-12">
        <code className="font-mono text-code text-muted-foreground">size=&quot;{size}&quot;</code>
        <ToggleGroup
          size="sm"
          aria-label="Dialog size"
          value={[size]}
          onValueChange={(value) => {
            const next = value[0] as DialogSize | undefined
            if (!next) return
            setSize(next)
            setOpen(true)
          }}
        >
          {sizeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <DialogStage className="min-h-144">
        {(container) => (
          <Dialog open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
            <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
            <DialogContent size={size} container={container} initialFocus={false} className={inStage}>
              <SizeContent size={size} />
            </DialogContent>
          </Dialog>
        )}
      </DialogStage>
    </div>
  )
}

function SizeContent({ size }: { size: DialogSize }) {
  if (size === "sm") {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Copy invite link</DialogTitle>
          <DialogDescription>Anyone with this link can join Lumen Labs as a member.</DialogDescription>
        </DialogHeader>
        <Input readOnly aria-label="Invite link" defaultValue="lumen.app/join/7Hq2-vK9p" />
        <DialogFooter>
          <DialogClose render={<Button />}>Copy link</DialogClose>
        </DialogFooter>
      </>
    )
  }
  if (size === "default") {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Add environment variable</DialogTitle>
          <DialogDescription>Variables are encrypted and available to every build of this project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="dialog-env-key">Key</FieldLabel>
            <Input id="dialog-env-key" placeholder="DATABASE_URL" className="font-mono" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-env-value">Value</FieldLabel>
            <Input id="dialog-env-value" type="password" placeholder="postgres://…" />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save variable</DialogClose>
        </DialogFooter>
      </>
    )
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription>Shortcuts work anywhere in the dashboard except inside text fields.</DialogDescription>
      </DialogHeader>
      <ul className="grid divide-y border-y">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.label} className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-copy">{shortcut.label}</span>
            <span className="flex gap-1">
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function DialogDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="A short, focused task on top of the page. The title says what happens; the footer ends with the action that does it."
        layout="full"
        code={`<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Rename project</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename project</DialogTitle>
      <DialogDescription>
        The new name shows in the dashboard and in new preview URLs.
      </DialogDescription>
    </DialogHeader>
    <Field>
      <FieldLabel htmlFor="name">Project name</FieldLabel>
      <Input id="name" defaultValue="lumen-web" />
    </Field>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button type="submit">Save name</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <DialogStage>
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button variant="outline" />}>Rename project</DialogTrigger>
              <DialogContent container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Rename project</DialogTitle>
                  <DialogDescription>
                    The new name shows in the dashboard and in new preview URLs. Existing URLs keep working.
                  </DialogDescription>
                </DialogHeader>
                <Field>
                  <FieldLabel htmlFor="dialog-basic-name">Project name</FieldLabel>
                  <Input id="dialog-basic-name" defaultValue="lumen-web" />
                </Field>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <DialogClose render={<Button />}>Save name</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Sizes"
        layout="full"
        description="Default width is --dialog-width. Use sm for a single field or a short message, lg (--container-prose) for reference content such as a list of shortcuts."
        code={`<DialogContent size="sm">…</DialogContent>
<DialogContent>…</DialogContent>
<DialogContent size="lg">…</DialogContent>`}
      >
        <SizesDemo />
      </Example>

      <Example
        title="Form with validation"
        description="Validate on submit and say how to fix the problem. While the request runs, disable both buttons and show a spinner in the action."
        layout="full"
        code={`<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger render={<Button />}>Add domain</DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit} className="contents">
      <DialogHeader>…</DialogHeader>
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="domain">Domain</FieldLabel>
        <Input id="domain" aria-invalid={!!error} />
        <FieldDescription>{error ?? "Subdomains work too."}</FieldDescription>
      </Field>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />} disabled={pending}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={pending}>Add domain</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`}
      >
        <DialogStage>{(container) => <AddDomainDialog container={container} />}</DialogStage>
      </Example>

      <Example
        title="Close in the footer"
        description="Set showCloseButton={false} on the content and showCloseButton on the footer when the dialog only informs, so the one way out is obvious."
        layout="full"
        code={`<DialogContent showCloseButton={false}>
  …
  <DialogFooter showCloseButton>
    <Button variant="ghost">Read the changelog</Button>
  </DialogFooter>
</DialogContent>`}
      >
        <DialogStage>
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button variant="outline" />}>What’s new</DialogTrigger>
              <DialogContent showCloseButton={false} container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Instant rollbacks are here</DialogTitle>
                  <DialogDescription>
                    Roll production back to any earlier deployment in one step. Lumen swaps traffic at the edge, so
                    there is no rebuild and no downtime.
                  </DialogDescription>
                </DialogHeader>
                <ul className="grid gap-3 text-sm text-copy">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    Open a deployment and choose Roll back to this deployment.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    Domains, environment variables and logs move with it.
                  </li>
                </ul>
                <DialogFooter showCloseButton>
                  <Button variant="ghost">Read the changelog</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Long content"
        layout="full"
        description="The dialog never grows past the viewport. Put long output in its own scrolling region so the title and actions stay in view."
      >
        <DialogStage className="min-h-144">
          {(container) => (
            <Dialog {...inlineDialog}>
              <DialogTrigger render={<Button variant="outline" />}>View build log</DialogTrigger>
              <DialogContent size="lg" container={container} initialFocus={false} className={inStage}>
                <DialogHeader>
                  <DialogTitle>Build log</DialogTitle>
                  <DialogDescription>lumen-web · main · 8f2c1a9 · built in 38s</DialogDescription>
                </DialogHeader>
                <pre
                  tabIndex={0}
                  aria-label="Build log"
                  className="max-h-64 overflow-auto rounded-(--control-radius) bg-terminal p-4 font-mono text-code text-terminal-foreground outline-none focus-visible:focus-ring"
                >
                  {buildLog.join("\n")}
                </pre>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                  <Button>Download log</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogStage>
      </Example>

      <Example
        title="Open from a menu"
        layout="full"
        description="Control the dialog with open and onOpenChange when something other than a trigger opens it, such as a menu item. Close this one, then choose Transfer in the project menu."
        code={`const [open, setOpen] = React.useState(false)

<DropdownMenuItem onClick={() => setOpen(true)}>Rename</DropdownMenuItem>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>…</DialogContent>
</Dialog>`}
      >
        <DialogStage>{(container) => <ProjectMenuWithDialog container={container} />}</DialogStage>
      </Example>

      <Guidelines
        do={[
          "Use a dialog for a short task that needs an answer before people carry on.",
          "Match the title and the action: “Rename project” and “Save name”.",
          "Put Cancel first and the action last, so the action sits on the right.",
          "Return focus to the trigger on close. The dialog does this for you when it has a trigger.",
        ]}
        dont={[
          "Don’t open a dialog from another dialog. Change the content in place or use a sheet.",
          "Don’t use a dialog for content people need to compare with the page behind it. Use a sheet.",
          "Don’t ask for confirmation of a destructive action here. Use an alert dialog.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "open", type: "boolean", description: "Controlled open state. Pair with onOpenChange." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog opens or closes." },
          { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
          { prop: "modal", type: 'boolean | "trap-focus"', default: "true", description: "Locks scroll and traps focus while open." },
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "On DialogContent. Maximum width: three quarters of --dialog-width, --dialog-width, or --container-prose." },
          { prop: "showCloseButton", type: "boolean", default: "true", description: "On DialogContent. Shows the close button in the top-right corner." },
          { prop: "initialFocus", type: "RefObject | boolean", description: "On DialogContent. The element to focus when the dialog opens." },
          { prop: "showCloseButton (footer)", type: "boolean", default: "false", description: "On DialogFooter. Adds an outline Close button after the other actions." },
          { prop: "render", type: "ReactElement", description: "On DialogTrigger and DialogClose. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
