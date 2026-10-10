"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { ToastCard, toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type ToastOptions = Parameters<typeof toast.add>[0]

const types: (ToastOptions & { label: string; type?: "success" | "info" | "warning" | "error" })[] = [
  {
    label: "Success",
    title: "Invite sent",
    description: "Sam Okafor will get an email with a link to Mobile app 2.0.",
    type: "success",
  },
  {
    label: "Info",
    title: "Report scheduled",
    description: "The workload report goes to your inbox every Monday at 9:00.",
    type: "info",
  },
  {
    label: "Warning",
    title: "Due date falls on a weekend",
    description: "“Plan the launch email” is now due Saturday, Oct 31.",
    type: "warning",
  },
  {
    label: "Error",
    title: "Couldn’t send the invite",
    description: "priya@acme.com already belongs to this workspace.",
    type: "error",
    priority: "high",
  },
  { label: "Plain", title: "Link to task copied" },
]

/**
 * A toast example: the toasts drawn in place, as they look in the corner of
 * the screen, and below them the buttons that show them for real.
 */
function ToastDemo({ children, actions }: { children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <div className="grid w-full justify-items-center gap-8">
      <div className="grid w-full max-w-96 gap-2.5">{children}</div>
      <div className="flex flex-wrap justify-center gap-2">{actions}</div>
    </div>
  )
}

/** A drawn toast that its close button removes, like a live one. */
function StaticToast(props: Omit<React.ComponentProps<typeof ToastCard>, "onClose">) {
  const [open, setOpen] = React.useState(true)
  return open ? <ToastCard {...props} onClose={() => setOpen(false)} /> : null
}

function TypesDemo() {
  return (
    <ToastDemo
      actions={types.map(({ label, ...options }) => (
        <Button key={label} variant="outline" size="sm" onClick={() => toast.add(options)}>
          {label}
        </Button>
      ))}
    >
      {types.map((item) => (
        <StaticToast key={item.label} type={item.type} title={item.title} description={item.description} />
      ))}
    </ToastDemo>
  )
}

function ActionDemo() {
  const [state, setState] = React.useState<"archived" | "restored" | "closed">("archived")
  return (
    <ToastDemo
      actions={
        <Button
          variant="outline"
          onClick={() => {
            const id = toast.add({
              title: "Project archived",
              description: "Onboarding redesign moved to the archive.",
              timeout: 8000,
              actionProps: {
                children: "Undo",
                onClick: () => {
                  toast.close(id)
                  toast.add({ title: "Onboarding redesign restored", type: "success" })
                },
              },
            })
          }}
        >
          Archive Project
        </Button>
      }
    >
      {state === "archived" ? (
        <ToastCard
          title="Project archived"
          description="Onboarding redesign moved to the archive."
          action={
            <Button variant="outline" size="xs" onClick={() => setState("restored")}>
              Undo
            </Button>
          }
          onClose={() => setState("closed")}
        />
      ) : null}
      {state === "restored" ? (
        <ToastCard type="success" title="Onboarding redesign restored" onClose={() => setState("closed")} />
      ) : null}
    </ToastDemo>
  )
}

function PromiseDemo() {
  return (
    <ToastDemo
      actions={
        <>
          <Button
            onClick={() =>
              toast.promise(wait(2400), {
                loading: { title: "Exporting the workload report", description: "October, all projects" },
                success: { title: "Report ready", description: "We emailed the CSV file to maya@acme.com." },
                error: { title: "Export failed", description: "Try again in a minute." },
              })
            }
          >
            Export Report
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast
                .promise(
                  wait(2000).then(() => {
                    throw new Error("Timeout")
                  }),
                  {
                    loading: { title: "Rotating API key" },
                    success: { title: "API key rotated" },
                    error: {
                      title: "Could not rotate the key",
                      description: "The request timed out. Try again in a minute.",
                    },
                  }
                )
                .catch(() => {})
            }
          >
            Rotate API Key
          </Button>
        </>
      }
    >
      <StaticToast type="loading" title="Exporting the workload report" description="October, all projects" />
      <StaticToast type="success" title="Report ready" description="We emailed the CSV file to maya@acme.com." />
      <StaticToast
        type="error"
        title="Could not rotate the key"
        description="The request timed out. Try again in a minute."
      />
    </ToastDemo>
  )
}

function UpdateDemo() {
  return (
    <ToastDemo
      actions={
        <Button
          variant="outline"
          onClick={async () => {
            const id = toast.add({
              title: "Uploading 24 files",
              description: "Attachments for Website relaunch",
              type: "loading",
              timeout: 0,
            })
            await wait(1600)
            toast.update(id, { description: "18 of 24 files uploaded" })
            await wait(1200)
            toast.update(id, {
              title: "Upload complete",
              description: "24 files, 3.1 MB",
              type: "success",
              timeout: 4000,
            })
          }}
        >
          Upload Files
        </Button>
      }
    >
      <StaticToast type="loading" title="Uploading 24 files" description="18 of 24 files uploaded" />
    </ToastDemo>
  )
}

export default function ToastDocs() {
  return (
    <Examples>
      <Example
        title="Types"
        description="Toasts confirm what just happened. The type sets the icon and its colour; the card stays flat and bordered. The buttons show each one in the corner of the screen."
        code={`import { toast } from "@/components/ui/toast"

toast.add({
  title: "Invite sent",
  description: "Sam Okafor will get an email with a link to Mobile app 2.0.",
  type: "success",
})`}
      >
        <TypesDemo />
      </Example>

      <Example
        title="With an action"
        description="Offer one short action, such as undo. Keep the toast open longer so people have time to use it."
        code={`toast.add({
  title: "Project archived",
  description: "Onboarding redesign moved to the archive.",
  timeout: 8000,
  actionProps: {
    children: "Undo",
    onClick: () => restoreProject(),
  },
})`}
      >
        <ActionDemo />
      </Example>

      <Example
        title="Loading and promises"
        description="Pass a promise to show a loading toast that turns into success or error when it settles. In the demo, Export report succeeds and Rotate API key times out."
        code={`toast.promise(exportReport(), {
  loading: { title: "Exporting the workload report", description: "October, all projects" },
  success: { title: "Report ready", description: "We emailed the CSV file to maya@acme.com." },
  error: { title: "Export failed", description: "Try again in a minute." },
})`}
      >
        <PromiseDemo />
      </Example>

      <Example
        title="Updating a toast"
        description="Keep the id that add returns to update the same toast as a task moves on."
        code={`const id = toast.add({ title: "Uploading 24 files", type: "loading", timeout: 0 })
// later
toast.update(id, { title: "Upload complete", type: "success", timeout: 4000 })`}
      >
        <UpdateDemo />
      </Example>

      <Guidelines
        do={[
          "Use a toast to confirm an action the person just took: saved, sent, archived.",
          "Write the title as the outcome in a few words. Add a description only if it helps.",
          "Offer undo for actions that remove something.",
          "Use priority high for errors, so screen readers announce them right away.",
        ]}
        dont={[
          "Don’t put information people need later in a toast. It disappears.",
          "Don’t use a toast for errors in a form. Show them next to the field.",
          "Don’t add more than one action.",
          "Don’t add a shadow to make the toast stand out. The border defines it.",
        ]}
      />

      <ApiTable
        title="toast.add options"
        rows={[
          { prop: "title", type: "ReactNode", description: "The outcome, in a few words." },
          { prop: "description", type: "ReactNode", description: "Optional detail under the title." },
          { prop: "type", type: '"success" | "info" | "warning" | "error" | "loading"', description: "Sets the icon and its colour. Leave out for a plain toast." },
          { prop: "timeout", type: "number", default: "5000", description: "Milliseconds before it closes. 0 keeps it open." },
          { prop: "priority", type: '"low" | "high"', default: '"low"', description: "How urgently assistive technology announces it." },
          { prop: "actionProps", type: "ButtonHTMLAttributes", description: "Props for the action button, including children and onClick." },
          { prop: "onClose", type: "() => void", description: "Called when the toast starts to close." },
        ]}
      />

      <ApiTable
        title="Toast manager"
        rows={[
          { prop: "toast.add(options)", type: "string", description: "Shows a toast and returns its id." },
          { prop: "toast.update(id, options)", type: "void", description: "Changes an open toast in place." },
          { prop: "toast.close(id?)", type: "void", description: "Closes one toast, or all of them without an id." },
          { prop: "toast.promise(promise, options)", type: "Promise", description: "Shows loading, then success or error when the promise settles." },
        ]}
      />

      <ApiTable
        title="ToastCard"
        rows={[
          { prop: "ToastCard", type: "component", description: "A toast drawn in place, outside the manager, for docs, design reviews and empty states. Same card and icons as a live toast." },
          { prop: "type", type: '"success" | "info" | "warning" | "error" | "loading"', description: "Sets the icon and its colour, as in toast.add." },
          { prop: "title / description", type: "ReactNode", description: "The same text a live toast shows." },
          { prop: "action", type: "ReactNode", description: "One short action, such as an outline xs Button." },
          { prop: "onClose", type: "() => void", description: "Shows the dismiss button and is called when it is pressed." },
        ]}
      />
    </Examples>
  )
}
