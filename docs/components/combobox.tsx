"use client"

import * as React from "react"
import { CheckIcon, SearchIcon, UserRoundIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  comboboxStyles,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

const labels = [
  "Bug",
  "Design",
  "Research",
  "Content",
  "Legal",
  "Billing",
  "Mobile",
  "Onboarding",
  "Performance",
  "Accessibility",
]

const members = [
  "Maya Patel",
  "Jordan Lee",
  "Sofia Alvarez",
  "Hana Kim",
  "Daniel Brooks",
  "Sam Okafor",
  "Priya Raman",
  "Lucas Moreau",
  "Noah Fischer",
  "Aisha Bello",
  "Kenji Watanabe",
  "Chloe Martin",
]

const zoneGroups = [
  {
    value: "Americas",
    items: [
      { label: "San Francisco (PT)", value: "san-francisco" },
      { label: "New York (ET)", value: "new-york" },
      { label: "Toronto (ET)", value: "toronto" },
    ],
  },
  {
    value: "Europe",
    items: [
      { label: "London (GMT)", value: "london" },
      { label: "Lisbon (WET)", value: "lisbon" },
      { label: "Berlin (CET)", value: "berlin" },
    ],
  },
  {
    value: "Asia Pacific",
    items: [
      { label: "Bengaluru (IST)", value: "bengaluru" },
      { label: "Tokyo (JST)", value: "tokyo" },
      { label: "Sydney (AET)", value: "sydney" },
    ],
  },
]

type ZoneGroup = (typeof zoneGroups)[number]
type Zone = ZoneGroup["items"][number]

const projects = [
  {
    label: "Website relaunch",
    value: "website-relaunch",
    tint: "bg-tint-violet",
  },
  { label: "Mobile app 2.0", value: "mobile-app", tint: "bg-tint-sky" },
  { label: "Q4 planning", value: "q4-planning", tint: "bg-tint-mint" },
  { label: "Customer portal", value: "customer-portal", tint: "bg-tint-sand" },
  {
    label: "Onboarding redesign",
    value: "onboarding-redesign",
    tint: "bg-tint-rose",
  },
  { label: "Brand refresh", value: "brand-refresh", tint: "bg-tint-sky" },
  {
    label: "Billing migration",
    value: "billing-migration",
    tint: "bg-tint-mint",
  },
  { label: "Help center", value: "help-center", tint: "bg-tint-sand" },
]

type Project = (typeof projects)[number]

function ProjectMark({ project }: { project: Project }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-xs text-xs font-bold text-foreground ${project.tint}`}
    >
      {project.label.charAt(0)}
    </span>
  )
}

/** One ComboboxItem for a plain string option. */
function textItem(item: string) {
  return (
    <ComboboxItem key={item} value={item}>
      {item}
    </ComboboxItem>
  )
}

/**
 * An item in a picture of the open popup, drawn with the combobox's own
 * recipes, with a check on the selected one.
 */
function OpenListItem({
  selected,
  children,
}: {
  selected: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={comboboxStyles.item}
      data-selected={selected ? "" : undefined}
    >
      {children}
      {selected ? (
        <span className={comboboxStyles.itemIndicator}>
          <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
        </span>
      ) : null}
    </div>
  )
}

function FollowerPicker() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="task-followers">Followers</FieldLabel>
      <Combobox
        items={members}
        multiple
        defaultValue={["Maya Patel", "Priya Raman"]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="task-followers"
                  placeholder={values.length ? "Add more" : "Add members"}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>
            No members match. Invite them from Members settings.
          </ComboboxEmpty>
          <ComboboxList>{textItem}</ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>
        They get an email and a Slack message when the status or due date
        changes.
      </FieldDescription>
    </Field>
  )
}

/**
 * Project switcher with the search inside the popup. As in TimeZonePicker, a
 * picture of the open popup sits under the button so readers see the search
 * row without opening it; it steps aside while the real popup is showing.
 */
function ProjectSwitcher() {
  const [value, setValue] = React.useState<Project | null>(projects[0])
  const [open, setOpen] = React.useState(false)
  return (
    <div className="grid w-64 gap-1.5">
      <Combobox
        items={projects}
        value={value}
        onValueChange={(next) => setValue(next as Project | null)}
        onOpenChange={setOpen}
      >
        <ComboboxTrigger
          render={
            <Button variant="outline" className="w-64 justify-between ps-3" />
          }
          aria-label="Switch project"
        >
          <ComboboxValue>
            {(project: Project | null) =>
              project ? (
                <span className="flex min-w-0 items-center gap-2.5">
                  <ProjectMark project={project} />
                  <span className="truncate">{project.label}</span>
                </span>
              ) : (
                "Choose a project"
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput
            showTrigger={false}
            placeholder="Find a project"
            aria-label="Find a project"
          />
          <ComboboxEmpty>
            No projects match. Search by name, like Brand refresh.
          </ComboboxEmpty>
          <ComboboxList>
            {(project: Project) => (
              <ComboboxItem key={project.value} value={project}>
                <ProjectMark project={project} />
                {project.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div
        aria-hidden="true"
        inert
        className={cn(
          comboboxStyles.popup,
          "flex flex-col overflow-hidden",
          open && "invisible"
        )}
      >
        <div
          className={cn(
            comboboxStyles.search,
            "text-control text-muted-foreground"
          )}
        >
          <SearchIcon className="size-4 shrink-0" />
          Find a project
        </div>
        <div className={cn(comboboxStyles.list, "max-h-none")}>
          {projects.map((project) => (
            <OpenListItem
              key={project.value}
              selected={project.value === value?.value}
            >
              <ProjectMark project={project} />
              {project.label}
            </OpenListItem>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Time zone search with grouped results. A picture of the open list sits under
 * the input, drawn with the combobox's own recipes, so readers see the groups
 * without opening it. It is hidden from assistive technology and steps aside
 * while the real popup, which opens in the same place, is showing.
 */
function TimeZonePicker() {
  const [value, setValue] = React.useState<Zone | null>(zoneGroups[1].items[0])
  const [open, setOpen] = React.useState(false)

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="combobox-time-zone">Time zone</FieldLabel>
        <Combobox
          items={zoneGroups}
          value={value}
          onValueChange={(next) => setValue(next as Zone | null)}
          onOpenChange={setOpen}
        >
          <ComboboxInput
            id="combobox-time-zone"
            placeholder="Search time zones"
          />
          <ComboboxContent>
            <ComboboxEmpty>
              No time zones match. Try a city, like Lisbon.
            </ComboboxEmpty>
            <ComboboxList className="max-h-96">
              {(group: ZoneGroup, index: number) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  {index > 0 ? <ComboboxSeparator /> : null}
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(zone: Zone) => (
                      <ComboboxItem key={zone.value} value={zone}>
                        {zone.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div
        aria-hidden="true"
        inert
        className={cn(comboboxStyles.popup, open && "invisible")}
      >
        <div className={cn(comboboxStyles.list, "max-h-none")}>
          {zoneGroups.map((group, index) => (
            <div key={group.value}>
              {index > 0 ? <div className={comboboxStyles.separator} /> : null}
              <div className={comboboxStyles.label}>{group.value}</div>
              {group.items.map((zone) => (
                <OpenListItem
                  key={zone.value}
                  selected={zone.value === value?.value}
                >
                  {zone.label}
                </OpenListItem>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ComboboxDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Type to filter, use the arrow keys to move and Enter to pick. The chevron opens the full list."
        code={`<Field>
  <FieldLabel htmlFor="label">Label</FieldLabel>
  <Combobox items={labels}>
    <ComboboxInput id="label" placeholder="Search labels" />
    <ComboboxContent>
      <ComboboxEmpty>No labels match. Try Bug, Design or Content.</ComboboxEmpty>
      <ComboboxList>
        {(item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="combobox-label">Label</FieldLabel>
          <Combobox items={labels}>
            <ComboboxInput id="combobox-label" placeholder="Search labels" />
            <ComboboxContent>
              <ComboboxEmpty>
                No labels match. Try Bug, Design or Content.
              </ComboboxEmpty>
              <ComboboxList>{textItem}</ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </Example>

      <Example
        title="Clear button"
        layout="stack"
        description="Set showClear to swap the chevron for a clear button once a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
  <Combobox items={members} defaultValue="Jordan Lee">
    <ComboboxInput id="assignee" showClear placeholder="Search members">
      <UserRoundIcon className="order-first me-1.5" />
    </ComboboxInput>
    <ComboboxContent>
      <ComboboxEmpty>No members match. Invite them from Members settings.</ComboboxEmpty>
      <ComboboxList>
        {(item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="combobox-assignee">Assignee</FieldLabel>
          <Combobox items={members} defaultValue="Jordan Lee">
            <ComboboxInput
              id="combobox-assignee"
              showClear
              placeholder="Search members"
            >
              <UserRoundIcon className="order-first me-1.5" />
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>
                No members match. Invite them from Members settings.
              </ComboboxEmpty>
              <ComboboxList>{textItem}</ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </Example>

      <Example
        title="Groups"
        layout="stack"
        description="Pass grouped items and render each group with a label, with a separator before every group but the first. Empty groups disappear as you type. The list is drawn open under the input."
        code={`<Combobox items={zoneGroups}>
  <ComboboxInput id="time-zone" placeholder="Search time zones" />
  <ComboboxContent>
    <ComboboxEmpty>No time zones match. Try a city, like Lisbon.</ComboboxEmpty>
    <ComboboxList>
      {(group, index) => (
        <ComboboxGroup key={group.value} items={group.items}>
          {index > 0 ? <ComboboxSeparator /> : null}
          <ComboboxLabel>{group.value}</ComboboxLabel>
          <ComboboxCollection>
            {(zone) => (
              <ComboboxItem key={zone.value} value={zone}>
                {zone.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxGroup>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
      >
        <TimeZonePicker />
      </Example>

      <Example
        title="Multiple"
        description="With multiple, picked values become chips inside the field. Backspace removes the last chip; arrow keys move between them."
        layout="stack"
        code={`const anchor = useComboboxAnchor()

<Combobox items={members} multiple defaultValue={["Maya Patel", "Priya Raman"]}>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => (
        <>
          {values.map((value) => (
            <ComboboxChip key={value}>{value}</ComboboxChip>
          ))}
          <ComboboxChipsInput id="followers" placeholder={values.length ? "Add more" : "Add members"} />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxEmpty>No members match. Invite them from Members settings.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
      >
        <FollowerPicker />
      </Example>

      <Example
        title="Search in the popup"
        layout="stack"
        description="A button shows the current value and the search field lives in the popup. Good for switchers in a toolbar. The open popup is drawn under the button."
        code={`<Combobox items={projects} defaultValue={projects[0]}>
  <ComboboxTrigger
    render={<Button variant="outline" className="w-64 justify-between ps-3" />}
    aria-label="Switch project"
  >
    <ComboboxValue />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxInput showTrigger={false} placeholder="Find a project" aria-label="Find a project" />
    <ComboboxEmpty>No projects match. Search by name, like Brand refresh.</ComboboxEmpty>
    <ComboboxList>
      {(project) => (
        <ComboboxItem key={project.value} value={project}>
          {project.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
      >
        <ProjectSwitcher />
      </Example>

      <Example
        title="States"
        description="Disabled fields fade and ignore input. Invalid fields take aria-invalid on the input and explain the fix below."
        layout="stack"
        code={`<Field>
  <FieldLabel htmlFor="label">Label</FieldLabel>
  <Combobox items={labels} defaultValue="Design" disabled>
    <ComboboxInput id="label" disabled />
    <ComboboxContent>
      <ComboboxList>
        {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldDescription>Set by the Design requests form.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
  <Combobox items={members}>
    <ComboboxInput id="assignee" placeholder="Search members" aria-invalid />
    <ComboboxContent>
      <ComboboxEmpty>No members match. Invite them from Members settings.</ComboboxEmpty>
      <ComboboxList>
        {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldError>Choose who owns this task.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="combobox-disabled">Label</FieldLabel>
            <Combobox items={labels} defaultValue="Design" disabled>
              <ComboboxInput id="combobox-disabled" disabled />
              <ComboboxContent>
                <ComboboxList>{textItem}</ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>
              Set by the Design requests form.
            </FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="combobox-invalid">Assignee</FieldLabel>
            <Combobox items={members}>
              <ComboboxInput
                id="combobox-invalid"
                placeholder="Search members"
                aria-invalid="true"
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  No members match. Invite them from Members settings.
                </ComboboxEmpty>
                <ComboboxList>{textItem}</ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldError>Choose who owns this task.</FieldError>
          </Field>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a combobox when the list is long enough that people would rather type than scroll.",
          "Write an empty state that says nothing matched, and what to try instead.",
          "Use chips for multiple values so people can see and remove each one.",
          "Put the search inside the popup when the trigger must stay compact.",
        ]}
        dont={[
          "Don’t use a combobox for fewer than about eight options. Use a select.",
          "Don’t accept free text silently. If any value is allowed, use an input.",
          "Don’t hide the chevron and the clear button at the same time.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "items",
            type: "Item[] | { value, items }[]",
            description:
              "Options on Combobox, flat or grouped. Filtering runs over these.",
          },
          {
            prop: "value / defaultValue",
            type: "Item | Item[] | null",
            description:
              "Controlled or initial value. An array when multiple is set.",
          },
          {
            prop: "onValueChange",
            type: "(value, details) => void",
            description: "Called when the selection changes.",
          },
          {
            prop: "multiple",
            type: "boolean",
            default: "false",
            description: "Allow several values, shown as chips.",
          },
          {
            prop: "autoHighlight",
            type: "boolean",
            default: "false",
            description: "Highlight the first match as the person types.",
          },
          {
            prop: "ComboboxInput showTrigger",
            type: "boolean",
            default: "true",
            description: "Show the chevron that opens the full list.",
          },
          {
            prop: "ComboboxInput showClear",
            type: "boolean",
            default: "false",
            description:
              "Show a clear button once a value is picked. It replaces the chevron.",
          },
          {
            prop: "ComboboxContent anchor",
            type: "RefObject<HTMLElement>",
            description:
              "Element the popup lines up with. Pass the chips ref for multiple.",
          },
          {
            prop: "ComboboxContent container",
            type: "HTMLElement | ShadowRoot | RefObject | null",
            description:
              "Element the popup portals into instead of <body>, such as a preview stage. Inside a PortalScope the popup already takes that region’s theme.",
          },
          {
            prop: "ComboboxChip showRemove",
            type: "boolean",
            default: "true",
            description: "Show the remove button on a chip.",
          },
          {
            prop: "useComboboxAnchor",
            type: "() => RefObject<HTMLDivElement>",
            description:
              "Creates the ref shared by ComboboxChips and ComboboxContent.",
          },
        ]}
      />
    </Examples>
  )
}
