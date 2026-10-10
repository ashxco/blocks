import Link from "next/link"
import { ArrowRightIcon, CheckIcon, TagIcon } from "lucide-react"

import { CodeWindow } from "@/components/blocks/code-window"
import { InstallCommand } from "@/components/blocks/install-command"
import { BrandMark } from "@/components/blocks/wordmark"
import { Button } from "@/components/ui/button"
import { Kern } from "@/components/ui/kern"

const points = [
  "Create and update tasks from any tool you run",
  "Webhooks for every task, project and comment change",
  "API keys scoped to one workspace, with read-only keys",
]

/**
 * Home page band for developers who connect Acme to their own systems: a
 * bold pitch with what the API covers on the left, and the TypeScript SDK on
 * the right, with a short example and the install command.
 */
export function DeveloperBand() {
  return (
    <section aria-labelledby="developer-heading" className="container-page pb-section">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div className="grid justify-items-start gap-6">
          <h2 id="developer-heading" className="max-w-narrow text-h2 text-foreground">
            <Kern>
              Connect Acme to
              <br />
              the tools you build.
            </Kern>
          </h2>
          <p className="max-w-prose text-lead text-copy">
            The Acme API and TypeScript SDK let your own systems create tasks, keep projects in sync and react to
            changes as they happen.
          </p>
          <ul className="w-full max-w-prose border-t">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 border-b py-3.5 text-label text-foreground">
                <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-success" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="#" />}>
              Read the API reference
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/live/features" />}>
              See integrations
            </Button>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-(--card-radius) border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark className="size-9" />
              <div className="grid min-w-0 gap-0.5">
                <p className="truncate font-mono text-label text-foreground">@acme/sdk</p>
                <p className="truncate text-caption text-muted-foreground">TypeScript SDK for the Acme API</p>
              </div>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-caption text-muted-foreground sm:inline-flex">
              <TagIcon aria-hidden="true" className="size-3.5" />
              <span className="font-mono">v3.2.0</span>
            </span>
          </div>

          <div className="p-3 sm:p-4">
            <CodeWindow />
          </div>

          <div className="grid gap-3 border-t bg-subtle px-4 py-5 sm:px-6">
            <p className="text-label text-foreground">Install from npm</p>
            <InstallCommand className="w-full bg-background" />
          </div>
        </div>
      </div>
    </section>
  )
}
