"use client"

import * as React from "react"
import { CalendarDaysIcon, ChartGanttIcon, CheckIcon, KanbanIcon, ListIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectStyles,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const timeZones = [
  { label: "San Francisco (PT)", value: "san-francisco" },
  { label: "New York (ET)", value: "new-york" },
  { label: "London (GMT)", value: "london" },
  { label: "Lisbon (WET)", value: "lisbon" },
  { label: "Bengaluru (IST)", value: "bengaluru" },
  { label: "Tokyo (JST)", value: "tokyo" },
]

const priorities = [
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
]

const projects = [
  {
    label: "Active",
    items: [
      { label: "Website relaunch", value: "website-relaunch" },
      { label: "Mobile app 2.0", value: "mobile-app" },
      { label: "Q4 planning", value: "q4-planning" },
      { label: "Customer portal", value: "customer-portal" },
      { label: "Brand refresh", value: "brand-refresh" },
      { label: "Billing migration", value: "billing-migration" },
    ],
  },
  {
    label: "Paused and completed",
    items: [
      { label: "Help center", value: "help-center" },
      { label: "Onboarding redesign", value: "onboarding-redesign" },
    ],
  },
]

const views = [
  { label: "List", value: "list", detail: "By section", icon: ListIcon },
  { label: "Board", value: "board", detail: "By status", icon: KanbanIcon },
  { label: "Timeline", value: "timeline", detail: "By week", icon: ChartGanttIcon },
  { label: "Calendar", value: "calendar", detail: "By due date", icon: CalendarDaysIcon },
]

const templates = [
  { label: "Product roadmap", value: "roadmap" },
  { label: "Marketing calendar", value: "marketing" },
  { label: "Client projects", value: "clients" },
  { label: "Sprint planning", value: "sprints" },
  { label: "Blank project", value: "blank" },
]

const owners = [
  { label: "Maya Patel", value: "maya" },
  { label: "Jordan Lee", value: "jordan" },
  { label: "Sofia Alvarez", value: "sofia" },
  { label: "Sam Okafor", value: "sam" },
]

/* -------------------------------------------------------------------------- */
/* The open list, shown under the trigger                                     */
/* -------------------------------------------------------------------------- */

/**
 * A picture of the open list under its trigger, drawn with the select's own
 * recipes so readers see groups, icons and details without opening it. It is
 * hidden from assistive technology and steps aside while the real list, which
 * opens in the same place, is showing.
 */
function OpenList({ hidden, children }: { hidden: boolean; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" inert className={cn(selectStyles.list, "w-full", hidden && "invisible")}>
      {children}
    </div>
  )
}

function OpenListItem({ selected, children }: { selected?: boolean; children: React.ReactNode }) {
  return (
    <div className={selectStyles.item} data-selected={selected ? "" : undefined}>
      <span className={selectStyles.itemText}>{children}</span>
      {selected ? (
        <span className={selectStyles.itemIndicator}>
          <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
        </span>
      ) : null}
    </div>
  )
}

function ProjectSelect() {
  const [value, setValue] = React.useState<string | null>("website-relaunch")
  const [open, setOpen] = React.useState(false)
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="select-project">Project</FieldLabel>
        <Select
          items={projects.flatMap((group) => group.items)}
          value={value}
          onValueChange={(next) => setValue(next as string | null)}
          onOpenChange={setOpen}
        >
          <SelectTrigger id="select-project" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projects.map((group, index) => (
              <React.Fragment key={group.label}>
                {index > 0 ? <SelectSeparator /> : null}
                <SelectGroup>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <OpenList hidden={open}>
        {projects.map((group, index) => (
          <React.Fragment key={group.label}>
            {index > 0 ? <div className={selectStyles.separator} /> : null}
            <div className={selectStyles.label}>{group.label}</div>
            {group.items.map((item) => (
              <OpenListItem key={item.value} selected={item.value === value}>
                {item.label}
              </OpenListItem>
            ))}
          </React.Fragment>
        ))}
      </OpenList>
    </div>
  )
}

function ViewSelect() {
  const [value, setValue] = React.useState<string | null>("board")
  const [open, setOpen] = React.useState(false)
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="select-view">Default view</FieldLabel>
        <Select
          items={views}
          value={value}
          onValueChange={(next) => setValue(next as string | null)}
          onOpenChange={setOpen}
        >
          <SelectTrigger id="select-view" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {views.map((view) => (
              <SelectItem key={view.value} value={view.value}>
                <view.icon />
                {view.label}
                <span className="ms-auto ps-6 font-normal text-muted-foreground">{view.detail}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <OpenList hidden={open}>
        {views.map((view) => (
          <OpenListItem key={view.value} selected={view.value === value}>
            <view.icon />
            {view.label}
            <span className="ms-auto ps-6 font-normal text-muted-foreground">{view.detail}</span>
          </OpenListItem>
        ))}
      </OpenList>
    </div>
  )
}

const sizes = [
  { size: "sm", label: "Small", height: `${tokenPx("--control-height-sm")}px` },
  { size: "default", label: "Medium", height: `${tokenPx("--control-height-md")}px` },
  { size: "lg", label: "Large", height: `${tokenPx("--control-height-lg")}px` },
] as const

export default function SelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Pass the options as items so the trigger shows the label of the chosen value, not the raw value."
        code={`const timeZones = [
  { label: "San Francisco (PT)", value: "san-francisco" },
  { label: "London (GMT)", value: "london" },
]

<Field>
  <FieldLabel htmlFor="time-zone">Time zone</FieldLabel>
  <Select items={timeZones} defaultValue="london">
    <SelectTrigger id="time-zone" className="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {timeZones.map((zone) => (
        <SelectItem key={zone.value} value={zone.value}>
          {zone.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="select-time-zone">Time zone</FieldLabel>
          <Select items={timeZones} defaultValue="london">
            <SelectTrigger id="select-time-zone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((zone) => (
                <SelectItem key={zone.value} value={zone.value}>
                  {zone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Example>

      <Example
        title="Placeholder"
        layout="stack"
        description="Leave the value empty and say what to choose. The placeholder is muted until a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="priority">Priority</FieldLabel>
  <Select items={priorities}>
    <SelectTrigger id="priority" className="w-full">
      <SelectValue placeholder="Choose a priority" />
    </SelectTrigger>
    <SelectContent>
      {priorities.map((priority) => (
        <SelectItem key={priority.value} value={priority.value}>
          {priority.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="select-priority">Priority</FieldLabel>
          <Select items={priorities}>
            <SelectTrigger id="select-priority" className="w-full">
              <SelectValue placeholder="Choose a priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="Heights come from the control tokens, so a select lines up with inputs and buttons of the same size. Medium is the default; keep one size per form."
        code={`{(["sm", "default", "lg"] as const).map((size) => (
  <Select key={size} items={priorities} defaultValue="high">
    <SelectTrigger size={size} className="w-full" aria-label="Priority">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {priorities.map((priority) => (
        <SelectItem key={priority.value} value={priority.value}>
          {priority.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
))}`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {sizes.map(({ size, label, height }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`select-size-${size}`}>
                {label} <span className="font-normal text-muted-foreground">{height}</span>
              </FieldLabel>
              <Select items={priorities} defaultValue="high">
                <SelectTrigger id={`select-size-${size}`} size={size} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="Groups"
        layout="stack"
        description="Group long lists under short labels and split the groups with a separator. The list is drawn open under the trigger."
        code={`<Select items={projects.flatMap((group) => group.items)} defaultValue="website-relaunch">
  <SelectTrigger id="project" className="w-full">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Active</SelectLabel>
      <SelectItem value="website-relaunch">Website relaunch</SelectItem>
      <SelectItem value="mobile-app">Mobile app 2.0</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Paused and completed</SelectLabel>
      <SelectItem value="help-center">Help center</SelectItem>
      <SelectItem value="onboarding-redesign">Onboarding redesign</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}
      >
        <ProjectSelect />
      </Example>

      <Example
        title="Icons and details"
        layout="stack"
        description="Items can carry an icon and a muted detail. The trigger still shows only the label from items."
        code={`<SelectItem value="board">
  <KanbanIcon />
  Board
  <span className="ms-auto ps-6 font-normal text-muted-foreground">By status</span>
</SelectItem>`}
      >
        <ViewSelect />
      </Example>

      <Example
        title="States"
        description="Disabled selects fade and stop responding. Invalid selects turn the border red; say what to fix under them."
        layout="stack"
        code={`<Field>
  <FieldLabel htmlFor="time-zone">Workspace time zone</FieldLabel>
  <Select items={timeZones} defaultValue="london" disabled>
    <SelectTrigger id="time-zone" className="w-full"><SelectValue /></SelectTrigger>
    <SelectContent>
      {timeZones.map((zone) => (
        <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldDescription>Only workspace owners can change it.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="priority">Priority</FieldLabel>
  <Select items={priorities}>
    <SelectTrigger id="priority" className="w-full" aria-invalid>
      <SelectValue placeholder="Choose a priority" />
    </SelectTrigger>
    <SelectContent>
      {priorities.map((priority) => (
        <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldError>Choose a priority for this task.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="select-disabled">Workspace time zone</FieldLabel>
            <Select items={timeZones} defaultValue="london" disabled>
              <SelectTrigger id="select-disabled" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Only workspace owners can change it.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="select-invalid">Priority</FieldLabel>
            <Select items={priorities}>
              <SelectTrigger id="select-invalid" className="w-full" aria-invalid="true">
                <SelectValue placeholder="Choose a priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>Choose a priority for this task.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="In a form"
        description="Selects next to inputs in a new-project form. Every control shares the same height, fill and radius."
        surface="subtle"
        code={`<Card className="@container/card">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>
      Start from a template, then invite your team. You can change any of this later.
    </CardDescription>
  </CardHeader>
  <CardContent className="grid gap-5">
    <Field>
      <FieldLabel htmlFor="name">Project name</FieldLabel>
      <Input id="name" defaultValue="Team offsite" />
    </Field>
    <div className="grid gap-5 @sm/card:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="template">Template</FieldLabel>
        <Select items={templates} defaultValue="roadmap">
          <SelectTrigger id="template" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="owner">Owner</FieldLabel>
        <Select items={owners} defaultValue="maya">
          <SelectTrigger id="owner" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.value} value={owner.value}>{owner.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
    <Field>
      <FieldLabel htmlFor="view">Default view</FieldLabel>
      <Select items={views} defaultValue="board">
        <SelectTrigger id="view" className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {views.map((view) => (
            <SelectItem key={view.value} value={view.value}>
              <view.icon />
              {view.label}
              <span className="ms-auto ps-6 font-normal text-muted-foreground">{view.detail}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>Members can switch views at any time. This is where the project opens.</FieldDescription>
    </Field>
  </CardContent>
  <CardFooter className="justify-end">
    <Button variant="ghost">Cancel</Button>
    <Button>Create Project</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="@container/card w-full max-w-md">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription className="text-pretty">
              Start from a template, then invite your team. You can change any of this later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="form-name">Project name</FieldLabel>
              <Input id="form-name" defaultValue="Team offsite" />
            </Field>
            <div className="grid gap-5 @sm/card:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="form-template">Template</FieldLabel>
                <Select items={templates} defaultValue="roadmap">
                  <SelectTrigger id="form-template" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="form-owner">Owner</FieldLabel>
                <Select items={owners} defaultValue="maya">
                  <SelectTrigger id="form-owner" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.value} value={owner.value}>
                        {owner.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="form-view">Default view</FieldLabel>
              <Select items={views} defaultValue="board">
                <SelectTrigger id="form-view" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {views.map((view) => (
                    <SelectItem key={view.value} value={view.value}>
                      <view.icon />
                      {view.label}
                      <span className="ms-auto ps-6 font-normal text-muted-foreground">{view.detail}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Members can switch views at any time. This is where the project opens.</FieldDescription>
            </Field>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="ghost">Cancel</Button>
            <Button>Create Project</Button>
          </CardFooter>
        </Card>
      </Example>

      <Guidelines
        do={[
          "Use a select when people pick one option from a short, known list.",
          "Pass items to Select so the trigger shows a readable label.",
          "Give every select a visible label. Use an aria-label only in toolbars where the context is obvious.",
          "Order options by how often they are picked, or alphabetically for long lists.",
        ]}
        dont={[
          "Don’t use a select for two options. Use a switch or a radio group.",
          "Don’t use it for long lists people search, such as countries. Use a combobox.",
          "Don’t put actions in a select. Use a dropdown menu.",
          "Don’t add shadows or a coloured fill to the list.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "items", type: "Record<string, ReactNode> | { label, value }[]", description: "Options on Select. Lets SelectValue render the label of the chosen value." },
          { prop: "value / defaultValue", type: "Value | null", description: "Controlled or initial value on Select." },
          { prop: "onValueChange", type: "(value, details) => void", description: "Called on Select when a new option is picked." },
          { prop: "multiple", type: "boolean", default: "false", description: "Allow more than one value. The value becomes an array." },
          { prop: "disabled", type: "boolean", default: "false", description: "Fades the whole Select and stops it opening. Set it on a SelectItem instead to block just that option." },
          { prop: "SelectTrigger size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height from --control-height-*." },
          { prop: "SelectValue placeholder", type: "ReactNode", description: "Shown, muted, while nothing is selected." },
          { prop: "SelectContent side", type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"', default: '"bottom"', description: "Which side of the trigger the list opens on. It flips when there is no room." },
          { prop: "SelectContent align", type: '"start" | "center" | "end"', default: '"start"', description: "How the list lines up with the trigger along that side." },
          { prop: "SelectContent alignItemWithTrigger", type: "boolean", default: "false", description: "Overlap the trigger so the chosen item sits on top of it, macOS style." },
          { prop: "SelectContent container", type: "HTMLElement | ShadowRoot | RefObject | null", description: "Element the list portals into instead of <body>, such as a preview stage. Inside a PortalScope the list already takes that region’s theme." },
          { prop: "SelectItem value", type: "Value", description: "The value this option selects." },
        ]}
      />
    </Examples>
  )
}
