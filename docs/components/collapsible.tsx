"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronsUpDownIcon, CircleCheckIcon, CircleIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

const subtasks = [
  { title: "Draft the hero headline", owner: "Priya Raman", done: true },
  { title: "Choose the hero image", owner: "Sofia Alvarez", done: true },
  { title: "Get Hana’s sign-off on the copy", owner: "Priya Raman", done: false },
  { title: "Add the page to the launch checklist", owner: "Maya Patel", done: false },
]

const fields = [
  { name: "Priority", type: "Select" },
  { name: "Estimate", type: "Number" },
  { name: "Reviewer", type: "Person" },
  { name: "Launch date", type: "Date" },
  { name: "Sprint", type: "Select" },
  { name: "Budget code", type: "Text" },
]

function FieldRow({ name, type }: { name: string; type: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <span className="truncate text-label text-foreground">{name}</span>
      <span className="shrink-0 text-caption text-muted-foreground">{type}</span>
    </li>
  )
}

/** Starts open so the preview shows the panel; the label says what the trigger will do next. */
function Subtasks() {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="grid w-full max-w-xl justify-items-start">
      <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
        {open ? "Hide subtasks" : `Show ${subtasks.length} subtasks`}
        <ChevronDownIcon
          data-icon="inline-end"
          className="transition-transform duration-(--duration-base) ease-out group-data-panel-open/collapsible-trigger:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full">
        <ul className="mt-4 divide-y rounded-(--control-radius) border bg-card">
          {subtasks.map((task) => {
            const Icon = task.done ? CircleCheckIcon : CircleIcon
            return (
              <li key={task.title} className="flex items-center gap-3 px-4 py-3">
                <Icon
                  aria-label={task.done ? "Done" : "Open"}
                  className={cn("size-4 shrink-0", task.done ? "text-foreground" : "text-muted-foreground")}
                />
                <span className={cn("min-w-0 flex-1 truncate text-sm", task.done ? "text-muted-foreground" : "text-foreground")}>
                  {task.title}
                </span>
                <span className="hidden shrink-0 text-caption text-muted-foreground sm:block">{task.owner}</span>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function CollapsibleDocs() {
  const [open, setOpen] = React.useState(false)

  return (
    <Examples>
      <Example
        title="Default"
        description="Compose the trigger with the render prop. The panel opens and closes with a height transition, and the chevron reads data-panel-open from its trigger. Name what the trigger does next: Hide while the panel is open."
        layout="stack"
        code={`<Collapsible>
  <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
    Show 4 subtasks
    <ChevronDownIcon
      data-icon="inline-end"
      className="transition-transform group-data-panel-open/collapsible-trigger:rotate-180"
    />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <ul className="mt-4 …">…</ul>
  </CollapsibleContent>
</Collapsible>`}
      >
        <Subtasks />
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
            <h3 className="text-h4">Custom fields</h3>
            <p className="text-sm text-muted-foreground">Every task in Website relaunch has these fields.</p>
          </div>
          <Collapsible open={open} onOpenChange={setOpen}>
            <ul className="divide-y border-y">
              {fields.slice(0, 3).map((f) => (
                <FieldRow key={f.name} name={f.name} type={f.type} />
              ))}
            </ul>
            <CollapsibleContent>
              <ul className="divide-y border-b">
                {fields.slice(3).map((f) => (
                  <FieldRow key={f.name} name={f.name} type={f.type} />
                ))}
              </ul>
            </CollapsibleContent>
            <CollapsibleTrigger render={<Button variant="link" className="mt-3" />}>
              {open ? "Show fewer" : `Show ${fields.length - 3} more`}
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
              <UsersIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <p className="truncate text-title text-foreground">Guest access</p>
            </div>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle details" />}>
              <ChevronsUpDownIcon />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <p className="border-t px-5 py-4 text-sm text-copy">
              Guests see only the projects you share with them. To show a project without an invite, share a view-only
              link from its Share menu. The link stops working after 7 days.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Example>

      <Guidelines
        do={[
          "Label the trigger with what it reveals, such as “Show 4 subtasks”.",
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
