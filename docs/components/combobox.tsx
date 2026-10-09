"use client"

import * as React from "react"
import { GitBranchIcon } from "lucide-react"

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
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

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

const branches = ["main", "develop", "staging", "release/2.4", "release/2.5", "fix/checkout-timeout"]

const regionGroups = [
  {
    value: "Europe",
    items: [
      { label: "Frankfurt", value: "fra-1" },
      { label: "London", value: "lhr-1" },
      { label: "Stockholm", value: "arn-1" },
    ],
  },
  {
    value: "Americas",
    items: [
      { label: "Washington, D.C.", value: "iad-1" },
      { label: "San Francisco", value: "sfo-1" },
      { label: "São Paulo", value: "gru-1" },
    ],
  },
  {
    value: "Asia Pacific",
    items: [
      { label: "Singapore", value: "sin-1" },
      { label: "Tokyo", value: "hnd-1" },
      { label: "Sydney", value: "syd-1" },
    ],
  },
]

const teammates = [
  "Maya Chen",
  "Jonas Weber",
  "Priya Raman",
  "Tomás Silva",
  "Aiko Tanaka",
  "Sam Okafor",
  "Lena Novak",
]

const projects = [
  { label: "acme-storefront", value: "acme-storefront", tint: "bg-tint-violet" },
  { label: "acme-api", value: "acme-api", tint: "bg-tint-sky" },
  { label: "docs-site", value: "docs-site", tint: "bg-tint-mint" },
  { label: "marketing-web", value: "marketing-web", tint: "bg-tint-sand" },
  { label: "status-page", value: "status-page", tint: "bg-tint-rose" },
]

type Project = (typeof projects)[number]

function ProjectMark({ project }: { project: Project }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-xs text-xs font-bold text-foreground ${project.tint}`}
    >
      {project.label.charAt(0).toUpperCase()}
    </span>
  )
}

function TeammatePicker() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-112">
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

export default function ComboboxDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Type to filter, use the arrow keys to move and Enter to pick. The chevron opens the full list."
        code={`<Combobox items={frameworks}>
  <ComboboxInput placeholder="Search frameworks" />
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
</Combobox>`}
      >
        <div className="w-64">
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Search frameworks" aria-label="Framework" />
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
        </div>
      </Example>

      <Example
        title="Clear button"
        description="Set showClear to swap the chevron for a clear button once a value is picked."
        code={`<Combobox items={branches} defaultValue="main">
  <ComboboxInput showClear placeholder="Search branches" />
  …
</Combobox>`}
      >
        <div className="w-64">
          <Combobox items={branches} defaultValue="main">
            <ComboboxInput showClear placeholder="Search branches" aria-label="Production branch">
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
        </div>
      </Example>

      <Example
        title="Groups"
        description="Pass grouped items and render each group with a label. Empty groups disappear as you type."
        code={`<Combobox items={regionGroups}>
  <ComboboxInput placeholder="Search regions" />
  <ComboboxContent>
    <ComboboxEmpty>No regions found.</ComboboxEmpty>
    <ComboboxList>
      {(group) => (
        <ComboboxGroup key={group.value} items={group.items}>
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
        <div className="w-64">
          <Combobox items={regionGroups}>
            <ComboboxInput placeholder="Search regions" aria-label="Region" />
            <ComboboxContent>
              <ComboboxEmpty>No regions found.</ComboboxEmpty>
              <ComboboxList>
                {(group: (typeof regionGroups)[number]) => (
                  <ComboboxGroup key={group.value} items={group.items}>
                    <ComboboxLabel>{group.value}</ComboboxLabel>
                    <ComboboxCollection>
                      {(region: (typeof regionGroups)[number]["items"][number]) => (
                        <ComboboxItem key={region.value} value={region}>
                          {region.label}
                          <span className="ms-auto font-mono text-xs font-normal text-muted-foreground">
                            {region.value}
                          </span>
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </Example>

      <Example
        title="Multiple"
        description="With multiple, picked values become chips inside the field. Backspace removes the last chip; arrow keys move between them."
        layout="stack"
        code={`const anchor = useComboboxAnchor()

<Combobox items={teammates} multiple defaultValue={["Maya Chen"]}>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => (
        <>
          {values.map((value) => (
            <ComboboxChip key={value}>{value}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Add teammates" />
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
  <ComboboxTrigger render={<Button variant="outline" className="w-64 justify-between" />}>
    <ComboboxValue />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxInput showTrigger={false} placeholder="Find a project" />
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
        minHeight="min-h-96"
      >
        <ProjectSwitcher />
      </Example>

      <Example
        title="States"
        description="Disabled fields fade and ignore input. Invalid fields take aria-invalid on the input and explain the fix below."
        layout="stack"
      >
        <div className="grid w-full max-w-144 gap-6 sm:grid-cols-2">
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
