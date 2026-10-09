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
import { Spinner } from "@/components/ui/spinner"

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
  "12:04:33  Restored build cache from previous deployment",
  "12:04:34  Running \"npm install\"",
  "12:04:41  added 412 packages in 7s",
  "12:04:41  Running \"npm run build\"",
  "12:04:44  Creating an optimized production build",
  "12:04:58  Compiled successfully in 14.2s",
  "12:04:58  Collecting page data",
  "12:05:02  Generating static pages (38/38)",
  "12:05:04  Finalizing page optimization",
  "12:05:05  Uploading build output to 3 regions",
  "12:05:09  Deployment ready at lumen-web-8f2c1a9.lumen.app",
]

function AddDomainDialog() {
  const [open, setOpen] = React.useState(false)
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <GlobeIcon data-icon="inline-start" />
        Add domain
      </DialogTrigger>
      <DialogContent>
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

function ProjectMenuWithDialog() {
  const [renameOpen, setRenameOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-96 items-center justify-between gap-4 rounded-(--card-radius) border bg-card px-5 py-4">
      <div className="grid gap-0.5">
        <p className="text-title text-foreground">lumen-web</p>
        <p className="text-caption text-muted-foreground">Production · updated 4 minutes ago</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Project options" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setRenameOpen(true)}>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
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

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              The new name shows in the dashboard and in new preview URLs. Existing URLs keep working.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="dialog-rename">Project name</FieldLabel>
            <Input id="dialog-rename" defaultValue="lumen-web" />
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Save name</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function DialogDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="A short, focused task on top of the page. The title says what happens; the footer ends with the action that does it."
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
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Rename project</DialogTrigger>
          <DialogContent>
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
      </Example>

      <Example
        title="Sizes"
        description="Default width is --dialog-width. Use sm for a single field or a short message, lg for reference content such as a list of shortcuts."
        code={`<DialogContent size="sm">…</DialogContent>
<DialogContent>…</DialogContent>
<DialogContent size="lg">…</DialogContent>`}
      >
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Small</DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Copy invite link</DialogTitle>
              <DialogDescription>Anyone with this link can join Lumen Labs as a member.</DialogDescription>
            </DialogHeader>
            <Input readOnly aria-label="Invite link" defaultValue="lumen.app/join/7Hq2-vK9p" />
            <DialogFooter>
              <DialogClose render={<Button />}>Copy link</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Default</DialogTrigger>
          <DialogContent>
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
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Large</DialogTrigger>
          <DialogContent size="lg">
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
          </DialogContent>
        </Dialog>
      </Example>

      <Example
        title="Form with validation"
        description="Validate on submit and say how to fix the problem. While the request runs, disable both buttons and show a spinner in the action."
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
        <AddDomainDialog />
      </Example>

      <Example
        title="Close in the footer"
        description="Set showCloseButton={false} on the content and showCloseButton on the footer when the dialog only informs, so the one way out is obvious."
        code={`<DialogContent showCloseButton={false}>
  …
  <DialogFooter showCloseButton>
    <Button variant="ghost">Read the changelog</Button>
  </DialogFooter>
</DialogContent>`}
      >
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>What’s new</DialogTrigger>
          <DialogContent showCloseButton={false}>
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
      </Example>

      <Example
        title="Long content"
        description="The dialog never grows past the viewport. Put long output in its own scrolling region so the title and actions stay in view."
      >
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>View build log</DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Build log</DialogTitle>
              <DialogDescription>lumen-web · main · 8f2c1a9 · built in 38s</DialogDescription>
            </DialogHeader>
            <pre className="max-h-72 overflow-auto rounded-(--control-radius) bg-terminal p-4 font-mono text-code text-terminal-foreground">
              {buildLog.join("\n")}
            </pre>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
              <Button>Download log</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>

      <Example
        title="Open from a menu"
        description="Control the dialog with open and onOpenChange when something other than a trigger opens it, such as a menu item."
        code={`const [open, setOpen] = React.useState(false)

<DropdownMenuItem onClick={() => setOpen(true)}>Rename</DropdownMenuItem>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>…</DialogContent>
</Dialog>`}
      >
        <ProjectMenuWithDialog />
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
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "On DialogContent. Maximum width: 3/4 of --dialog-width, --dialog-width, or the prose container." },
          { prop: "showCloseButton", type: "boolean", default: "true", description: "On DialogContent. Shows the close button in the top-right corner." },
          { prop: "initialFocus", type: "RefObject | boolean", description: "On DialogContent. The element to focus when the dialog opens." },
          { prop: "showCloseButton (footer)", type: "boolean", default: "false", description: "On DialogFooter. Adds an outline Close button after the other actions." },
          { prop: "render", type: "ReactElement", description: "On DialogTrigger and DialogClose. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
