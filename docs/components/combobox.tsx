"use client"

import * as React from "react"
import { CheckIcon, GitBranchIcon } from "lucide-react"

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

const frameworks = [
  "Next.js",
  "Astro",
  "Remix",
  "SvelteKit",
  "Nuxt",
  "Vite",
  "Hono",
  "Express",
  "Eleventy",
  "Gatsby",
]

const branches = [
  "main",
  "develop",
  "staging",
  "release/2.4",
  "release/2.5",
  "feat/checkout-redesign",
  "feat/edge-images",
  "fix/checkout-timeout",
  "fix/preview-urls",
  "chore/upgrade-next",
  "docs/api-reference",
  "perf/cold-starts",
]

const regionGroups = [
  {
    value: "Europe",
    items: [
      { label: "Frankfurt (fra1)", value: "fra1" },
      { label: "London (lhr1)", value: "lhr1" },
      { label: "Paris (cdg1)", value: "cdg1" },
    ],
  },
  {
    value: "Americas",
    items: [
      { label: "Washington, D.C. (iad1)", value: "iad1" },
      { label: "San Francisco (sfo1)", value: "sfo1" },
      { label: "São Paulo (gru1)", value: "gru1" },
    ],
  },
  {
    value: "Asia Pacific",
    items: [
      { label: "Singapore (sin1)", value: "sin1" },
      { label: "Tokyo (hnd1)", value: "hnd1" },
      { label: "Sydney (syd1)", value: "syd1" },
    ],
  },
]

type RegionGroup = (typeof regionGroups)[number]
type Region = RegionGroup["items"][number]

const teammates = [
  "Maya Chen",
  "Jonas Weber",
  "Priya Raman",
  "Tomás Silva",
  "Aiko Tanaka",
  "Sam Okafor",
  "Lena Novak",
  "Elena Petrova",
  "Kwame Mensah",
]

const projects = [
  { label: "acme-web", value: "acme-web", tint: "bg-tint-violet" },
  { label: "acme-api", value: "acme-api", tint: "bg-tint-sky" },
  { label: "acme-docs", value: "acme-docs", tint: "bg-tint-mint" },
  { label: "acme-dashboard", value: "acme-dashboard", tint: "bg-tint-sand" },
  { label: "acme-status", value: "acme-status", tint: "bg-tint-rose" },
  { label: "acme-blog", value: "acme-blog", tint: "bg-tint-sky" },
  { label: "acme-emails", value: "acme-emails", tint: "bg-tint-mint" },
  { label: "acme-workers", value: "acme-workers", tint: "bg-tint-sand" },
]

type Project = (typeof projects)[number]

function ProjectMark({ project }: { project: Project }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-xs text-xs font-bold text-foreground ${project.tint}`}
    >
      {project.label.replace(/^acme-/, "").charAt(0).toUpperCase()}
    </span>
  )
}

function TeammatePicker() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-md">
      <FieldLabel htmlFor="notify-teammates">Notify on failed deploys</FieldLabel>
      <Combobox items={teammates} multiple defaultValue={["Maya Chen", "Priya Raman"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="notify-teammates"
                  placeholder={values.length ? "Add more" : "Add teammates"}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No teammates match that name.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>They get an email and a Slack message when a production build fails.</FieldDescription>
    </Field>
  )
}

function ProjectSwitcher() {
  return (
    <Combobox items={projects} defaultValue={projects[0]}>
      <ComboboxTrigger
        render={<Button variant="outline" className="w-64 justify-between ps-3" />}
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
        <ComboboxInput showTrigger={false} placeholder="Find a project" aria-label="Find a project" />
        <ComboboxEmpty>No projects match.</ComboboxEmpty>
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
  )
}

/**
 * Region search with grouped results. A picture of the open list sits under
 * the input, drawn with the combobox's own recipes, so readers see the groups
 * without opening it. It is hidden from assistive technology and steps aside
 * while the real popup, which opens in the same place, is showing.
 */
function RegionPicker() {
  const [value, setValue] = React.useState<Region | null>(regionGroups[0].items[0])
  const [open, setOpen] = React.useState(false)

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Field>
        <FieldLabel htmlFor="combobox-region">Region</FieldLabel>
        <Combobox
          items={regionGroups}
          value={value}
          onValueChange={(next) => setValue(next as Region | null)}
          onOpenChange={setOpen}
        >
          <ComboboxInput id="combobox-region" placeholder="Search regions" />
          <ComboboxContent>
            <ComboboxEmpty>No regions match. Try a city or a code like fra1.</ComboboxEmpty>
            <ComboboxList className="max-h-96">
              {(group: RegionGroup, index: number) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  {index > 0 ? <ComboboxSeparator /> : null}
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(region: Region) => (
                      <ComboboxItem key={region.value} value={region}>
                        {region.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div aria-hidden="true" inert className={cn(comboboxStyles.popup, open && "invisible")}>
        <div className={cn(comboboxStyles.list, "max-h-none")}>
          {regionGroups.map((group, index) => (
            <div key={group.value}>
              {index > 0 ? <div className={comboboxStyles.separator} /> : null}
              <div className={comboboxStyles.label}>{group.value}</div>
              {group.items.map((region) => {
                const selected = region.value === value?.value
                return (
                  <div key={region.value} className={comboboxStyles.item} data-selected={selected ? "" : undefined}>
                    {region.label}
                    {selected ? (
                      <span className={comboboxStyles.itemIndicator}>
                        <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </div>
                )
              })}
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
  <FieldLabel htmlFor="framework">Framework</FieldLabel>
  <Combobox items={frameworks}>
    <ComboboxInput id="framework" placeholder="Search frameworks" />
    <ComboboxContent>
      <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
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
          <FieldLabel htmlFor="combobox-framework">Framework</FieldLabel>
          <Combobox items={frameworks}>
            <ComboboxInput id="combobox-framework" placeholder="Search frameworks" />
            <ComboboxContent>
              <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </Example>

      <Example
        title="Clear button"
        layout="stack"
        description="Set showClear to swap the chevron for a clear button once a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="branch">Production branch</FieldLabel>
  <Combobox items={branches} defaultValue="main">
    <ComboboxInput id="branch" showClear placeholder="Search branches">
      <GitBranchIcon className="order-first me-1.5" />
    </ComboboxInput>
    <ComboboxContent>
      <ComboboxEmpty>No branches match.</ComboboxEmpty>
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
          <FieldLabel htmlFor="combobox-branch">Production branch</FieldLabel>
          <Combobox items={branches} defaultValue="main">
            <ComboboxInput id="combobox-branch" showClear placeholder="Search branches">
              <GitBranchIcon className="order-first me-1.5" />
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>No branches match.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </Example>

      <Example
        title="Groups"
        layout="stack"
        description="Pass grouped items and render each group with a label, with a separator before every group but the first. Empty groups disappear as you type. The list is drawn open under the input."
        code={`<Combobox items={regionGroups}>
  <ComboboxInput id="region" placeholder="Search regions" />
  <ComboboxContent>
    <ComboboxEmpty>No regions match. Try a city or a code like fra1.</ComboboxEmpty>
    <ComboboxList>
      {(group, index) => (
        <ComboboxGroup key={group.value} items={group.items}>
          {index > 0 ? <ComboboxSeparator /> : null}
          <ComboboxLabel>{group.value}</ComboboxLabel>
          <ComboboxCollection>
            {(region) => (
              <ComboboxItem key={region.value} value={region}>
                {region.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxGroup>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
      >
        <RegionPicker />
      </Example>

      <Example
        title="Multiple"
        description="With multiple, picked values become chips inside the field. Backspace removes the last chip; arrow keys move between them."
        layout="stack"
        code={`const anchor = useComboboxAnchor()

<Combobox items={teammates} multiple defaultValue={["Maya Chen", "Priya Raman"]}>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => (
        <>
          {values.map((value) => (
            <ComboboxChip key={value}>{value}</ComboboxChip>
          ))}
          <ComboboxChipsInput id="teammates" placeholder={values.length ? "Add more" : "Add teammates"} />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxEmpty>No teammates match that name.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
      >
        <TeammatePicker />
      </Example>

      <Example
        title="Search in the popup"
        description="A button shows the current value and the search field lives in the popup. Good for switchers in a toolbar."
        code={`<Combobox items={projects} defaultValue={projects[0]}>
  <ComboboxTrigger
    render={<Button variant="outline" className="w-64 justify-between ps-3" />}
    aria-label="Switch project"
  >
    <ComboboxValue />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxInput showTrigger={false} placeholder="Find a project" aria-label="Find a project" />
    <ComboboxEmpty>No projects match.</ComboboxEmpty>
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
  <FieldLabel htmlFor="framework">Framework preset</FieldLabel>
  <Combobox items={frameworks} defaultValue="Next.js" disabled>
    <ComboboxInput id="framework" disabled />
    <ComboboxContent>
      <ComboboxList>
        {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldDescription>Detected from package.json.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="branch">Production branch</FieldLabel>
  <Combobox items={branches}>
    <ComboboxInput id="branch" placeholder="Search branches" aria-invalid />
    <ComboboxContent>
      <ComboboxEmpty>No branches match.</ComboboxEmpty>
      <ComboboxList>
        {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldError>Choose a branch. Lumen deploys it to production on every push.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="combobox-disabled">Framework preset</FieldLabel>
            <Combobox items={frameworks} defaultValue="Next.js" disabled>
              <ComboboxInput id="combobox-disabled" disabled />
              <ComboboxContent>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>Detected from package.json.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="combobox-invalid">Production branch</FieldLabel>
            <Combobox items={branches}>
              <ComboboxInput id="combobox-invalid" placeholder="Search branches" aria-invalid="true" />
              <ComboboxContent>
                <ComboboxEmpty>No branches match.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldError>Choose a branch. Lumen deploys it to production on every push.</FieldError>
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
          { prop: "items", type: "Item[] | { value, items }[]", description: "Options on Combobox, flat or grouped. Filtering runs over these." },
          { prop: "value / defaultValue", type: "Item | Item[] | null", description: "Controlled or initial value. An array when multiple is set." },
          { prop: "onValueChange", type: "(value, details) => void", description: "Called when the selection changes." },
          { prop: "multiple", type: "boolean", default: "false", description: "Allow several values, shown as chips." },
          { prop: "autoHighlight", type: "boolean", default: "false", description: "Highlight the first match as the person types." },
          { prop: "ComboboxInput showTrigger", type: "boolean", default: "true", description: "Show the chevron that opens the full list." },
          { prop: "ComboboxInput showClear", type: "boolean", default: "false", description: "Show a clear button once a value is picked. It replaces the chevron." },
          { prop: "ComboboxContent anchor", type: "RefObject<HTMLElement>", description: "Element the popup lines up with. Pass the chips ref for multiple." },
          { prop: "ComboboxChip showRemove", type: "boolean", default: "true", description: "Show the remove button on a chip." },
          { prop: "useComboboxAnchor", type: "() => RefObject<HTMLDivElement>", description: "Creates the ref shared by ComboboxChips and ComboboxContent." },
        ]}
      />
    </Examples>
  )
}
