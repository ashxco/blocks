"use client"

import * as React from "react"

import {
  ApiTable,
  Example,
  Examples,
  Guidelines,
  controlSizes,
} from "@/docs/kit"
import { Card } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

type ActivityType = "comment" | "status" | "assignment"

const activity: {
  id: string
  time: string
  type: ActivityType
  project: string
  person: string
  text: string
}[] = [
  {
    id: "a1",
    time: "9:12",
    type: "status",
    project: "website",
    person: "Jordan Lee",
    text: "moved “Fix broken links on the pricing page” to Done",
  },
  {
    id: "a2",
    time: "9:20",
    type: "comment",
    project: "website",
    person: "Sofia Alvarez",
    text: "shared a new option for “Homepage hero”",
  },
  {
    id: "a3",
    time: "9:41",
    type: "assignment",
    project: "mobile",
    person: "Maya Patel",
    text: "assigned “Push notification settings” to Jordan Lee",
  },
  {
    id: "a4",
    time: "10:05",
    type: "status",
    project: "mobile",
    person: "Jordan Lee",
    text: "marked Mobile app 2.0 as At risk",
  },
  {
    id: "a5",
    time: "10:32",
    type: "comment",
    project: "q4",
    person: "Hana Kim",
    text: "commented on “Q4 budget”: approved, let’s lock it on Friday",
  },
  {
    id: "a6",
    time: "11:08",
    type: "assignment",
    project: "website",
    person: "Priya Raman",
    text: "took “Draft the launch email”",
  },
  {
    id: "a7",
    time: "11:46",
    type: "status",
    project: "q4",
    person: "Lucas Moreau",
    text: "moved “Vendor contracts” to In progress",
  },
]

const typeLabel: Record<ActivityType, string> = {
  comment: "Comment",
  status: "Status",
  assignment: "Assigned",
}

function ActivityFilter() {
  const [type, setType] = React.useState("all")
  const [project, setProject] = React.useState("all")

  const items = activity.filter(
    (item) =>
      (type === "all" || item.type === type) &&
      (project === "all" || item.project === project)
  )

  return (
    <Card className="@container/activity w-full max-w-2xl gap-0 p-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <p className="basis-full text-title text-foreground @md/activity:me-auto @md/activity:basis-auto">
          Activity
        </p>
        <NativeSelect
          size="sm"
          aria-label="Project"
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="flex-1 @md/activity:flex-none"
        >
          <NativeSelectOption value="all">All projects</NativeSelectOption>
          <NativeSelectOption value="website">
            Website relaunch
          </NativeSelectOption>
          <NativeSelectOption value="mobile">Mobile app 2.0</NativeSelectOption>
          <NativeSelectOption value="q4">Q4 planning</NativeSelectOption>
        </NativeSelect>
        <NativeSelect
          size="sm"
          aria-label="Type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="flex-1 @md/activity:flex-none"
        >
          <NativeSelectOption value="all">All activity</NativeSelectOption>
          <NativeSelectOption value="comment">Comments</NativeSelectOption>
          <NativeSelectOption value="status">Status changes</NativeSelectOption>
          <NativeSelectOption value="assignment">
            Assignments
          </NativeSelectOption>
        </NativeSelect>
      </div>
      <ol className="divide-y">
        {items.length ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-4 py-2.5 @md/activity:flex-nowrap"
            >
              <span className="w-10 shrink-0 text-caption text-muted-foreground tabular">
                {item.time}
              </span>
              <span className="w-16 shrink-0 text-caption font-semibold text-muted-foreground">
                {typeLabel[item.type]}
              </span>
              <p className="min-w-0 basis-full text-sm text-copy @md/activity:basis-auto">
                <span className="font-semibold text-foreground">
                  {item.person}
                </span>{" "}
                {item.text}
              </p>
            </li>
          ))
        ) : (
          <li className="px-4 py-8 text-center text-caption text-muted-foreground">
            No activity matches these filters.
          </li>
        )}
      </ol>
    </Card>
  )
}

export default function NativeSelectDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="The platform select with Blocks control styling. The option list is drawn by the operating system."
        code={`<Field>
  <FieldLabel htmlFor="time-zone">Time zone</FieldLabel>
  <NativeSelect id="time-zone" defaultValue="new-york">
    <NativeSelectOption value="san-francisco">San Francisco (PT)</NativeSelectOption>
    <NativeSelectOption value="new-york">New York (ET)</NativeSelectOption>
    <NativeSelectOption value="london">London (GMT)</NativeSelectOption>
    <NativeSelectOption value="lisbon">Lisbon (WET)</NativeSelectOption>
    <NativeSelectOption value="bengaluru">Bengaluru (IST)</NativeSelectOption>
    <NativeSelectOption value="tokyo">Tokyo (JST)</NativeSelectOption>
  </NativeSelect>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="native-time-zone">Time zone</FieldLabel>
          <NativeSelect id="native-time-zone" defaultValue="new-york">
            <NativeSelectOption value="san-francisco">
              San Francisco (PT)
            </NativeSelectOption>
            <NativeSelectOption value="new-york">
              New York (ET)
            </NativeSelectOption>
            <NativeSelectOption value="london">London (GMT)</NativeSelectOption>
            <NativeSelectOption value="lisbon">Lisbon (WET)</NativeSelectOption>
            <NativeSelectOption value="bengaluru">
              Bengaluru (IST)
            </NativeSelectOption>
            <NativeSelectOption value="tokyo">Tokyo (JST)</NativeSelectOption>
          </NativeSelect>
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="The same control heights as Select and Input. className goes on the wrapper, so set the width there."
        code={`{(["sm", "default", "lg"] as const).map((size) => (
  <NativeSelect key={size} size={size} defaultValue="in-progress" aria-label="Status" className="w-full">
    <NativeSelectOption value="todo">To do</NativeSelectOption>
    <NativeSelectOption value="in-progress">In progress</NativeSelectOption>
    <NativeSelectOption value="done">Done</NativeSelectOption>
  </NativeSelect>
))}`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {controlSizes.map(({ size, label, height }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`native-size-${size}`}>
                {label}{" "}
                <span className="font-normal text-muted-foreground">
                  {height}
                </span>
              </FieldLabel>
              <NativeSelect
                id={`native-size-${size}`}
                size={size}
                defaultValue="in-progress"
              >
                <NativeSelectOption value="todo">To do</NativeSelectOption>
                <NativeSelectOption value="in-progress">
                  In progress
                </NativeSelectOption>
                <NativeSelectOption value="done">Done</NativeSelectOption>
              </NativeSelect>
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="Option groups"
        layout="stack"
        description="Use optgroup to group options. A disabled first option works as a placeholder until a value is picked."
        code={`<Field>
  <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
  <NativeSelect id="assignee" defaultValue="">
    <NativeSelectOption value="" disabled>Choose an assignee</NativeSelectOption>
    <NativeSelectOptGroup label="Product and design">
      <NativeSelectOption value="maya">Maya Patel</NativeSelectOption>
      <NativeSelectOption value="sofia">Sofia Alvarez</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Engineering">
      <NativeSelectOption value="jordan">Jordan Lee</NativeSelectOption>
      <NativeSelectOption value="daniel">Daniel Brooks</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Marketing and success">
      <NativeSelectOption value="priya">Priya Raman</NativeSelectOption>
      <NativeSelectOption value="sam">Sam Okafor</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
  <FieldDescription>They get an email and see the task in My tasks.</FieldDescription>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="native-assignee">Assignee</FieldLabel>
          <NativeSelect id="native-assignee" defaultValue="">
            <NativeSelectOption value="" disabled>
              Choose an assignee
            </NativeSelectOption>
            <NativeSelectOptGroup label="Product and design">
              <NativeSelectOption value="maya">Maya Patel</NativeSelectOption>
              <NativeSelectOption value="sofia">
                Sofia Alvarez
              </NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Engineering">
              <NativeSelectOption value="jordan">Jordan Lee</NativeSelectOption>
              <NativeSelectOption value="daniel">
                Daniel Brooks
              </NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Marketing and success">
              <NativeSelectOption value="priya">Priya Raman</NativeSelectOption>
              <NativeSelectOption value="sam">Sam Okafor</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
          <FieldDescription>
            They get an email and see the task in My tasks.
          </FieldDescription>
        </Field>
      </Example>

      <Example
        title="States"
        description="Disabled selects fade. Invalid selects take aria-invalid, turn the border red and explain the fix below."
        layout="stack"
        code={`<Field>
  <FieldLabel htmlFor="data-location">Data location</FieldLabel>
  <NativeSelect id="data-location" defaultValue="us" disabled>
    <NativeSelectOption value="us">United States</NativeSelectOption>
    <NativeSelectOption value="eu">European Union</NativeSelectOption>
  </NativeSelect>
  <FieldDescription>Available on Enterprise. Contact sales to move your data.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="repeat">Repeat</FieldLabel>
  <NativeSelect id="repeat" defaultValue="" aria-invalid>
    <NativeSelectOption value="" disabled>Choose how often</NativeSelectOption>
    <NativeSelectOption value="daily">Every day</NativeSelectOption>
    <NativeSelectOption value="weekly">Every week</NativeSelectOption>
    <NativeSelectOption value="monthly">Every month</NativeSelectOption>
  </NativeSelect>
  <FieldError>Choose how often this task repeats.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="native-disabled">Data location</FieldLabel>
            <NativeSelect id="native-disabled" defaultValue="us" disabled>
              <NativeSelectOption value="us">United States</NativeSelectOption>
              <NativeSelectOption value="eu">European Union</NativeSelectOption>
            </NativeSelect>
            <FieldDescription>
              Available on Enterprise. Contact sales to move your data.
            </FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="native-invalid">Repeat</FieldLabel>
            <NativeSelect
              id="native-invalid"
              defaultValue=""
              aria-invalid="true"
            >
              <NativeSelectOption value="" disabled>
                Choose how often
              </NativeSelectOption>
              <NativeSelectOption value="daily">Every day</NativeSelectOption>
              <NativeSelectOption value="weekly">Every week</NativeSelectOption>
              <NativeSelectOption value="monthly">
                Every month
              </NativeSelectOption>
            </NativeSelect>
            <FieldError>Choose how often this task repeats.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Filter bar"
        description="Small native selects filter an activity feed. They are quick to scan, need no popup and work well on phones."
        surface="subtle"
        code={`<div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
  <p className="basis-full text-title text-foreground @md/activity:me-auto @md/activity:basis-auto">Activity</p>
  <NativeSelect
    size="sm"
    aria-label="Project"
    value={project}
    onChange={(e) => setProject(e.target.value)}
    className="flex-1 @md/activity:flex-none"
  >
    <NativeSelectOption value="all">All projects</NativeSelectOption>
    <NativeSelectOption value="website">Website relaunch</NativeSelectOption>
    <NativeSelectOption value="mobile">Mobile app 2.0</NativeSelectOption>
    <NativeSelectOption value="q4">Q4 planning</NativeSelectOption>
  </NativeSelect>
  <NativeSelect
    size="sm"
    aria-label="Type"
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="flex-1 @md/activity:flex-none"
  >
    <NativeSelectOption value="all">All activity</NativeSelectOption>
    <NativeSelectOption value="comment">Comments</NativeSelectOption>
    <NativeSelectOption value="status">Status changes</NativeSelectOption>
    <NativeSelectOption value="assignment">Assignments</NativeSelectOption>
  </NativeSelect>
</div>`}
      >
        <ActivityFilter />
      </Example>

      <Guidelines
        do={[
          "Use a native select on forms that must work on phones and without JavaScript.",
          "Use it for long, plain lists where the system picker is faster, such as time zones.",
          "Give it a label, or an aria-label in a toolbar.",
        ]}
        dont={[
          "Don’t put icons, descriptions or rich content in options. Use Select.",
          "Don’t mix native and custom selects in the same form.",
          "Don’t use a disabled option as the only hint. Add a label too.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "size",
            type: '"sm" | "default" | "lg"',
            default: '"default"',
            description: "Height from --control-height-*.",
          },
          {
            prop: "className",
            type: "string",
            description: "Applied to the wrapper. Set the width here.",
          },
          {
            prop: "value / defaultValue",
            type: "string",
            description: "Controlled or initial value, as on any <select>.",
          },
          {
            prop: "onChange",
            type: "(event) => void",
            description: "Called when the person picks an option.",
          },
          {
            prop: "aria-invalid",
            type: "boolean",
            description:
              "Marks the select as invalid: red border and focus outline.",
          },
          {
            prop: "NativeSelectOption",
            type: "component",
            description: "An <option>. Takes value, disabled and children.",
          },
          {
            prop: "NativeSelectOptGroup",
            type: "component",
            description: "An <optgroup>. Takes a label.",
          },
        ]}
      />
    </Examples>
  )
}
