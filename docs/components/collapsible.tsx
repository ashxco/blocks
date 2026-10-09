"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronsUpDownIcon, EyeIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const buildLog = [
  "12:04:12  Cloning lumen-labs/lumen-web at a41c9e2",
  "12:04:14  Restored build cache (412 MB)",
  "12:04:15  Running npm ci",
  "12:04:21  Running npm run build",
  "12:04:39  Compiled 184 routes in 17.6s",
  "12:04:41  Uploading output to 2 regions",
  "12:04:44  Deployment ready at lumen-web-a41c9e2.lumen.app",
]

const variables = [
  { key: "DATABASE_URL", env: "Production" },
  { key: "NEXT_PUBLIC_SITE_URL", env: "All" },
  { key: "STRIPE_SECRET_KEY", env: "Production" },
  { key: "SENTRY_DSN", env: "All" },
  { key: "REDIS_URL", env: "Production, Preview" },
  { key: "RESEND_API_KEY", env: "Production" },
]

function VariableRow({ name, env }: { name: string; env: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <code className="truncate font-mono text-code text-foreground">{name}</code>
      <span className="shrink-0 text-caption text-muted-foreground">{env}</span>
    </li>
  )
}

export default function CollapsibleDocs() {
  const [open, setOpen] = React.useState(false)

  return (
    <Examples>
      <Example
        title="Default"
        description="Compose the trigger with the render prop. The panel opens with a height transition; the chevron reads data-panel-open from its trigger."
        layout="stack"
        code={`<Collapsible>
  <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
    Show build output
    <ChevronDownIcon
      data-icon="inline-end"
      className="transition-transform group-data-panel-open/collapsible-trigger:rotate-180"
    />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <pre className="mt-4 …">…</pre>
  </CollapsibleContent>
</Collapsible>`}
      >
        <Collapsible className="grid justify-items-start">
          <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
            Show build output
            <ChevronDownIcon
              data-icon="inline-end"
              className="transition-transform duration-(--duration-base) ease-out group-data-panel-open/collapsible-trigger:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="w-full">
            <pre className="mt-4 overflow-x-auto rounded-(--control-radius) bg-terminal p-4 font-mono text-code text-terminal-foreground">
              {buildLog.join("\n")}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </Example>

      <Example
        title="Show more"
        description="Show the first few rows and tuck the rest away. The trigger says how many are hidden."
        layout="stack"
        code={`<Collapsible>
  <ul>{first three}</ul>
  <CollapsibleContent>
    <ul>{the rest}</ul>
  </CollapsibleContent>
  <CollapsibleTrigger render={<Button variant="link" />}>
    Show 3 more
  </CollapsibleTrigger>
</Collapsible>`}
      >
        <section className="grid max-w-prose gap-4 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4">Environment variables</h3>
            <p className="text-sm text-muted-foreground">Encrypted at rest. Changes apply to the next deployment.</p>
          </div>
          <Collapsible open={open} onOpenChange={setOpen}>
            <ul className="divide-y border-y">
              {variables.slice(0, 3).map((v) => (
                <VariableRow key={v.key} name={v.key} env={v.env} />
              ))}
            </ul>
            <CollapsibleContent>
              <ul className="divide-y border-b">
                {variables.slice(3).map((v) => (
                  <VariableRow key={v.key} name={v.key} env={v.env} />
                ))}
              </ul>
            </CollapsibleContent>
            <CollapsibleTrigger render={<Button variant="link" className="mt-3" />}>
              {open ? "Show fewer" : `Show ${variables.length - 3} more`}
            </CollapsibleTrigger>
          </Collapsible>
        </section>
      </Example>

      <Example
        title="Open by default"
        description="Use defaultOpen when most people need the content, but some want to tuck it away."
        layout="stack"
        code={`<Collapsible defaultOpen>…</Collapsible>`}
      >
        <Collapsible defaultOpen className="max-w-prose rounded-(--card-radius) border bg-card">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <EyeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <p className="truncate text-title text-foreground">Preview protection</p>
            </div>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle details" />}>
              <ChevronsUpDownIcon />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <p className="border-t px-5 py-4 text-sm text-copy">
              Preview URLs ask for a Lumen login. Share a link that skips the login for 7 days from the deployment page.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Example>

      <Guidelines
        do={[
          "Label the trigger with what it reveals, such as “Show build output”.",
          "Put padding on an element inside CollapsibleContent so the panel closes to zero height.",
          "Use an accordion instead when there are several sections that open the same way.",
        ]}
        dont={[
          "Don’t hide errors or required fields in a collapsed panel.",
          "Don’t use a collapsible for navigation. Use the sidebar sub-menus.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "defaultOpen", type: "boolean", default: "false", description: "Collapsible: open on first render, when uncontrolled." },
          { prop: "open / onOpenChange", type: "boolean / (open) => void", description: "Collapsible: control the open state." },
          { prop: "disabled", type: "boolean", default: "false", description: "Collapsible: stop the trigger from toggling." },
          { prop: "render", type: "ReactElement", description: "CollapsibleTrigger: render as a Button or another element." },
          { prop: "keepMounted", type: "boolean", default: "false", description: "CollapsibleContent: keep closed content in the DOM." },
          { prop: "hiddenUntilFound", type: "boolean", default: "false", description: "CollapsibleContent: let the browser’s find in page open the panel." },
        ]}
      />
    </Examples>
  )
}
