"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function ToastDocs() {
  return (
    <Examples>
      <Example
        title="Types"
        description="Toasts confirm what just happened. The type sets the icon and its colour; the card stays flat and bordered."
        code={`import { toast } from "@/components/ui/toast"

toast.add({
  title: "Deployment ready",
  description: "lumen-web is live on lumen.app.",
  type: "success",
})`}
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Deployment ready",
              description: "lumen-web is live on lumen.app.",
              type: "success",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Invite sent",
              description: "Priya Raman will get an email with a link to join the team.",
              type: "info",
            })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Build is slower than usual",
              description: "The cache was cleared, so this build installs every package.",
              type: "warning",
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Could not add domain",
              description: "lumen.app is already used by another project.",
              type: "error",
              priority: "high",
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Copied preview URL",
            })
          }
        >
          Plain
        </Button>
      </Example>

      <Example
        title="With an action"
        description="Offer one short action, such as undo. Keep the toast open longer so people have time to use it."
        code={`toast.add({
  title: "Environment variable deleted",
  description: "DATABASE_URL was removed from Preview.",
  timeout: 8000,
  actionProps: {
    children: "Undo",
    onClick: () => restoreVariable(),
  },
})`}
      >
        <Button
          variant="outline"
          onClick={() => {
            const id = toast.add({
              title: "Environment variable deleted",
              description: "DATABASE_URL was removed from Preview.",
              timeout: 8000,
              actionProps: {
                children: "Undo",
                onClick: () => {
                  toast.close(id)
                  toast.add({ title: "DATABASE_URL restored", type: "success" })
                },
              },
            })
          }}
        >
          Delete variable
        </Button>
      </Example>

      <Example
        title="Loading and promises"
        description="Pass a promise to show a loading toast that turns into success or error when it settles."
        code={`toast.promise(redeploy(), {
  loading: { title: "Redeploying lumen-web", description: "Building from main" },
  success: { title: "Redeploy complete", description: "Live in 3 regions." },
  error: { title: "Redeploy failed", description: "Open the logs to see why." },
})`}
      >
        <Button
          onClick={() =>
            toast.promise(wait(2400), {
              loading: { title: "Redeploying lumen-web", description: "Building from main" },
              success: { title: "Redeploy complete", description: "Live in 3 regions." },
              error: { title: "Redeploy failed", description: "Open the logs to see why." },
            })
          }
        >
          Redeploy
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
          Rotate key (fails)
        </Button>
      </Example>

      <Example
        title="Updating a toast"
        description="Keep the id that add returns to update the same toast as a task moves on."
        code={`const id = toast.add({ title: "Uploading 24 files", type: "loading", timeout: 0 })
// later
toast.update(id, { title: "Upload complete", type: "success", timeout: 4000 })`}
      >
        <Button
          variant="outline"
          onClick={async () => {
            const id = toast.add({
              title: "Uploading 24 files",
              description: "Static assets for lumen-docs",
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
          Upload assets
        </Button>
      </Example>

      <Guidelines
        do={[
          "Use a toast to confirm an action the person just took: saved, sent, deployed.",
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
    </Examples>
  )
}
