"use client"

import * as React from "react"
import { CheckIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

/* -------------------------------------------------------------------------- */
/* Create project: a complete form                                            */
/* -------------------------------------------------------------------------- */

const templates = [
  { value: "roadmap", title: "Product roadmap", description: "Plan themes and launches on a timeline, quarter by quarter." },
  { value: "marketing", title: "Marketing calendar", description: "Schedule campaigns, posts and emails on a shared calendar." },
  { value: "clients", title: "Client projects", description: "Track deliverables, approvals and guests for each client." },
  { value: "sprints", title: "Sprint planning", description: "Run two-week sprints on a board with estimates and owners." },
] as const

const owners = [
  { value: "maya", label: "Maya Patel" },
  { value: "jordan", label: "Jordan Lee" },
  { value: "sofia", label: "Sofia Alvarez" },
  { value: "sam", label: "Sam Okafor" },
  { value: "priya", label: "Priya Raman" },
  { value: "lucas", label: "Lucas Moreau" },
]

interface Milestone {
  id: number
  name: string
  due: string
}

type Errors = Partial<Record<"name" | "slug" | "milestones", string>>

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function validate(name: string, slug: string, milestones: Milestone[]): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = "Enter a project name."
  else if (name.trim().length > 60) errors.name = "Use 60 characters or fewer."
  if (!slug.trim()) errors.slug = "Enter a URL for the project."
  else if (!slugPattern.test(slug))
    errors.slug = "Use lowercase letters, numbers and single hyphens, like team-offsite."
  if (milestones.some((m) => m.due && !m.name.trim()))
    errors.milestones = "Give every dated milestone a name, like Beta launch."
  return errors
}

function CreateProjectForm() {
  const id = React.useId()
  const formRef = React.useRef<HTMLFormElement>(null)
  const nextMilestoneId = React.useRef(3)
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [template, setTemplate] = React.useState<string>("roadmap")
  const [owner, setOwner] = React.useState<string | null>("maya")
  const [isPrivate, setIsPrivate] = React.useState(false)
  const [milestones, setMilestones] = React.useState<Milestone[]>([
    { id: 1, name: "Design review", due: "2026-10-15" },
    { id: 2, name: "", due: "" },
  ])
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitted, setSubmitted] = React.useState(false)

  function updateMilestone(milestoneId: number, patch: Partial<Milestone>) {
    setMilestones((rows) => rows.map((row) => (row.id === milestoneId ? { ...row, ...patch } : row)))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate(name, slug, milestones)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus()
      })
      return
    }
    setSubmitted(true)
  }

  function reset() {
    setName("")
    setSlug("")
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    const ownerLabel = owners.find((o) => o.value === owner)?.label ?? "you"
    const templateLabel = templates.find((t) => t.value === template)?.title ?? "blank"
    const named = milestones.filter((m) => m.name.trim()).length
    return (
      <FormFrame>
        <Card role="status" className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-success-subtle text-success">
              <CheckIcon aria-hidden="true" className="size-5" strokeWidth={2.5} />
            </span>
            <CardTitle>{name.trim()} is ready</CardTitle>
            <CardDescription className="text-pretty">
              Created from the {templateLabel} template with {named} {named === 1 ? "milestone" : "milestones"}, owned
              by {ownerLabel}. It lives at{" "}
              <span className="font-mono break-all text-foreground">app.acme.com/acme/projects/{slug}</span>.{" "}
              {isPrivate ? "Only invited members can see it." : "Everyone in Acme Inc. can see it."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={reset}>
              Create Another Project
            </Button>
          </CardFooter>
        </Card>
      </FormFrame>
    )
  }

  return (
    <FormFrame>
      <Card className="@container/form mx-auto w-full max-w-2xl">
        <form ref={formRef} noValidate onSubmit={onSubmit} className="contents">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription className="text-pretty">
              Give the work a home in Acme Inc. You can invite people and add tasks next.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor={`${id}-name`}>Project name</FieldLabel>
                <Input
                  id={`${id}-name`}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Team offsite"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={`${id}-name-${errors.name ? "error" : "hint"}`}
                />
                {errors.name ? (
                  <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
                ) : (
                  <FieldDescription id={`${id}-name-hint`}>Shown in the sidebar and on every task in the project.</FieldDescription>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor={`${id}-slug`}>Project URL</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    {/* The full prefix needs room; on a phone the input keeps its width for the slug. */}
                    <InputGroupText className="gap-0">
                      <span className="hidden @xl/form:inline">app.acme.com/acme</span>/projects/
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${id}-slug`}
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="team-offsite"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={Boolean(errors.slug)}
                    aria-describedby={`${id}-slug-${errors.slug ? "error" : "hint"}`}
                  />
                </InputGroup>
                {errors.slug ? (
                  <FieldError id={`${id}-slug-error`}>{errors.slug}</FieldError>
                ) : (
                  <FieldDescription id={`${id}-slug-hint`}>
                    Members open the project at this link. You can change it later.
                  </FieldDescription>
                )}
              </Field>

              <FieldSet>
                <FieldLegend variant="label">Template</FieldLegend>
                <RadioGroup
                  name="template"
                  value={template}
                  onValueChange={(value) => setTemplate(value as string)}
                  className="grid gap-3 @xl/form:grid-cols-2"
                >
                  {templates.map((t) => (
                    <FieldLabel key={t.value}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>{t.title}</FieldTitle>
                          <FieldDescription>{t.description}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value={t.value} />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor={`${id}-owner`}>Owner</FieldLabel>
                <Select
                  items={owners}
                  name="owner"
                  value={owner}
                  onValueChange={(value) => setOwner(value as string | null)}
                >
                  <SelectTrigger id={`${id}-owner`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>The owner gets the weekly status reminder and approves changes to the plan.</FieldDescription>
              </Field>

              <FieldSet>
                <FieldLegend variant="label">Milestones</FieldLegend>
                <FieldDescription>Each milestone shows on the timeline and in the weekly report.</FieldDescription>
                <div className="grid gap-4 @xl/form:gap-2">
                  {milestones.map((row, index) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 @xl/form:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_auto]"
                    >
                      <Input
                        aria-label={`Milestone ${index + 1} name`}
                        value={row.name}
                        onChange={(e) => updateMilestone(row.id, { name: e.target.value })}
                        placeholder="Beta launch"
                        autoComplete="off"
                        className="col-start-1 row-start-1 text-ellipsis"
                        aria-invalid={Boolean(errors.milestones) && Boolean(row.due) && !row.name.trim()}
                      />
                      <Input
                        type="date"
                        aria-label={`Milestone ${index + 1} due date`}
                        value={row.due}
                        onChange={(e) => updateMilestone(row.id, { due: e.target.value })}
                        className="col-start-1 row-start-2 tabular @xl/form:col-start-2 @xl/form:row-start-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${row.name || `milestone ${index + 1}`}`}
                        onClick={() => setMilestones((rows) => rows.filter((r) => r.id !== row.id))}
                        className="col-start-2 row-span-2 row-start-1 self-center text-muted-foreground hover:text-foreground @xl/form:col-start-3 @xl/form:row-span-1"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ))}
                </div>
                {errors.milestones ? <FieldError>{errors.milestones}</FieldError> : null}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMilestones((rows) => [...rows, { id: nextMilestoneId.current++, name: "", due: "" }])
                    }
                  >
                    <PlusIcon data-icon="inline-start" />
                    Add Milestone
                  </Button>
                </div>
              </FieldSet>

              <Field orientation="horizontal" className="border-t pt-6">
                <Checkbox
                  id={`${id}-private`}
                  name="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={`${id}-private`}>Private project</FieldLabel>
                  <FieldDescription>Only people you invite can see the project and its tasks.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex-col-reverse items-stretch @xl/form:flex-row @xl/form:justify-end">
            <Button type="button" variant="ghost" onClick={reset}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </CardFooter>
        </form>
      </Card>
    </FormFrame>
  )
}

/**
 * The canvas around the form. Padding follows the example's container and the
 * form's layout follows the card's own container, so the example's desktop,
 * tablet and mobile widths reflow it like a real page.
 */
function FormFrame({ children }: { children: React.ReactNode }) {
  return <div className="p-4 @xl:p-12">{children}</div>
}

/* -------------------------------------------------------------------------- */
/* Smaller examples                                                           */
/* -------------------------------------------------------------------------- */

const plans = [
  { value: "free", title: "Free", description: "Up to 3 members and 5\u00a0projects." },
  { value: "pro", title: "Pro", description: "$12 per member a month, billed annually. Unlimited projects." },
  { value: "business", title: "Business", description: "$24 per member a month, billed annually. SSO and audit log." },
]

export default function FieldDocs() {
  return (
    <Examples>
      <Example
        title="Anatomy"
        layout="stack"
        description="A label, the control and a description in one tight stack (gap-2). The label names the value; the description says how it is used."
        code={`<Field>
  <FieldLabel htmlFor="project">Project name</FieldLabel>
  <Input id="project" placeholder="Website relaunch" />
  <FieldDescription>Shown in the sidebar and on every task in the project.</FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-anatomy">Project name</FieldLabel>
            <Input id="field-anatomy" placeholder="Website relaunch" />
            <FieldDescription>Shown in the sidebar and on every task in the project.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Description first"
        layout="stack"
        description="Put the description under the label when people need it before they type. It tucks in closer to the label than to the control."
        code={`<Field>
  <FieldLabel htmlFor="key">Project key</FieldLabel>
  <FieldDescription>Two to five capital letters. Task IDs start with it, like WEB-142.</FieldDescription>
  <Input id="key" defaultValue="WEB" className="font-mono" spellCheck={false} />
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-key">Project key</FieldLabel>
            <FieldDescription>Two to five capital letters. Task IDs start with it, like WEB-142.</FieldDescription>
            <Input id="field-key" defaultValue="WEB" className="font-mono" spellCheck={false} />
          </Field>
        </div>
      </Example>

      <Example
        title="Validation"
        layout="stack"
        description="Set data-invalid on the field and aria-invalid on the control. The error replaces the description and says how to fix the value."
        code={`<Field data-invalid>
  <FieldLabel htmlFor="email">Work email</FieldLabel>
  <Input id="email" type="email" defaultValue="maya@acme" aria-invalid aria-describedby="email-error" />
  <FieldError id="email-error">Finish the address, like maya@acme.com.</FieldError>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field data-invalid>
            <FieldLabel htmlFor="field-email">Work email</FieldLabel>
            <Input id="field-email" type="email" defaultValue="maya@acme" aria-invalid aria-describedby="field-email-error" />
            <FieldError id="field-email-error">Finish the address, like maya@acme.com.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Horizontal"
        layout="stack"
        description="Selection controls sit beside their label. With a description, wrap the text in FieldContent and the control aligns to the first line."
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="summary">Weekly summary</FieldLabel>
    <FieldDescription>Tasks completed, overdue work and project status, every Monday at 9:00.</FieldDescription>
  </FieldContent>
  <Switch id="summary" defaultChecked />
</Field>

<Field orientation="horizontal">
  <Checkbox id="assigned" defaultChecked />
  <FieldLabel htmlFor="assigned">Email me when a task is assigned to me</FieldLabel>
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="field-summary">Weekly summary</FieldLabel>
              <FieldDescription>Tasks completed, overdue work and project status, every Monday at 9:00.</FieldDescription>
            </FieldContent>
            <Switch id="field-summary" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="field-assigned" defaultChecked />
            <FieldLabel htmlFor="field-assigned">Email me when a task is assigned to me</FieldLabel>
          </Field>
        </div>
      </Example>

      <Example
        title="Fieldset"
        layout="stack"
        description="Group related controls under a legend. Use the label variant inside forms and the legend variant for a titled section."
        code={`<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldDescription>Choose what Acme emails you about. Security alerts always send.</FieldDescription>
  <FieldGroup data-slot="checkbox-group">
    <Field orientation="horizontal">
      <Checkbox id="n-assigned" defaultChecked />
      <FieldLabel htmlFor="n-assigned">Tasks assigned to me</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox id="n-mentions" defaultChecked />
      <FieldLabel htmlFor="n-mentions">Comments and mentions</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox id="n-digest" />
      <FieldLabel htmlFor="n-digest">Weekly project digest</FieldLabel>
    </Field>
    <Field orientation="horizontal" data-disabled>
      <Checkbox id="n-security" defaultChecked disabled />
      <FieldLabel htmlFor="n-security">Security alerts</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>`}
      >
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldLegend>Notifications</FieldLegend>
            <FieldDescription>Choose what Acme emails you about. Security alerts always send.</FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Checkbox id="field-n-assigned" defaultChecked />
                <FieldLabel htmlFor="field-n-assigned">Tasks assigned to me</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="field-n-mentions" defaultChecked />
                <FieldLabel htmlFor="field-n-mentions">Comments and mentions</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="field-n-digest" />
                <FieldLabel htmlFor="field-n-digest">Weekly project digest</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled="true">
                <Checkbox id="field-n-security" defaultChecked disabled />
                <FieldLabel htmlFor="field-n-security">Security alerts</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </Example>

      <Example
        title="Choice cards"
        layout="stack"
        description="Wrap a horizontal field in FieldLabel to make the whole card clickable. Every choice card in Blocks has one anatomy: the text leads and the radio, checkbox or switch sits at the top right. The selected card takes an ink border."
        code={`const plans = [
  { value: "free", title: "Free", description: "Up to 3 members and 5 projects." },
  { value: "pro", title: "Pro", description: "$12 per member a month, billed annually. Unlimited projects." },
  { value: "business", title: "Business", description: "$24 per member a month, billed annually. SSO and audit log." },
]

<FieldSet>
  <FieldLegend variant="label">Plan</FieldLegend>
  <RadioGroup defaultValue="pro" name="plan">
    {plans.map((plan) => (
      <FieldLabel key={plan.value}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{plan.title}</FieldTitle>
            <FieldDescription>{plan.description}</FieldDescription>
          </FieldContent>
          <RadioGroupItem value={plan.value} />
        </Field>
      </FieldLabel>
    ))}
  </RadioGroup>
</FieldSet>`}
      >
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldLegend variant="label">Plan</FieldLegend>
            <RadioGroup defaultValue="pro" name="plan">
              {plans.map((p) => (
                <FieldLabel key={p.value}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{p.title}</FieldTitle>
                      <FieldDescription>{p.description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={p.value} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </div>
      </Example>

      <Example
        title="Responsive"
        layout="stack"
        description="Responsive fields stack on narrow screens and put the label beside the control once the field group is wide enough."
        code={`<FieldGroup>
  <Field orientation="responsive">
    <FieldContent>
      <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
      <FieldDescription>Shown in the sidebar and in email invites.</FieldDescription>
    </FieldContent>
    <Input id="workspace-name" defaultValue="Acme Inc." className="@md/field-group:basis-72" />
  </Field>
  <Field orientation="responsive">
    <FieldContent>
      <FieldLabel htmlFor="workspace-url">Workspace URL</FieldLabel>
      <FieldDescription>Members sign in at app.acme.com followed by this name.</FieldDescription>
    </FieldContent>
    <Input id="workspace-url" defaultValue="acme" className="font-mono @md/field-group:basis-72" spellCheck={false} />
  </Field>
</FieldGroup>`}
      >
        <FieldGroup className="max-w-3xl">
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-workspace-name">Workspace name</FieldLabel>
              <FieldDescription>Shown in the sidebar and in email invites.</FieldDescription>
            </FieldContent>
            <Input id="field-workspace-name" defaultValue="Acme Inc." className="@md/field-group:basis-72" />
          </Field>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-workspace-url">Workspace URL</FieldLabel>
              <FieldDescription>Members sign in at app.acme.com followed by this name.</FieldDescription>
            </FieldContent>
            <Input id="field-workspace-url" defaultValue="acme" className="font-mono @md/field-group:basis-72" spellCheck={false} />
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Separator"
        layout="stack"
        description="Split alternatives, such as two ways to invite your team."
        code={`<Button variant="outline" className="w-full">Copy Invite Link</Button>
<FieldSeparator>or</FieldSeparator>
<Field>
  <FieldLabel htmlFor="invite-emails">Invite by email</FieldLabel>
  <Input id="invite-emails" placeholder="theo@acme.com, ines@acme.com" spellCheck={false} />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <Button variant="outline" className="w-full">
            Copy Invite Link
          </Button>
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="field-invite-emails">Invite by email</FieldLabel>
            <Input id="field-invite-emails" placeholder="theo@acme.com, ines@acme.com" spellCheck={false} />
          </Field>
        </div>
      </Example>

      <Example
        title="Complete form"
        layout="full"
        surface="subtle"
        description="A new-project form in a card: a validated name, a URL with a fixed prefix, template cards, an owner select, milestones and a privacy checkbox. It is saved with a button, so the on/off setting is a checkbox, not a switch. Submit it empty to see the errors."
        code={`<Card className="@container/form">
  <form onSubmit={onSubmit} noValidate className="contents">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Give the work a home in Acme Inc. You can invite people and add tasks next.</CardDescription>
    </CardHeader>
    <CardContent>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Project name</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} aria-describedby="name-error" />
          <FieldError id="name-error">{errors.name}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="slug">Project URL</FieldLabel>
          <InputGroup>
            <InputGroupAddon><InputGroupText>app.acme.com/acme/projects/</InputGroupText></InputGroupAddon>
            <InputGroupInput id="slug" placeholder="team-offsite" />
          </InputGroup>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Template</FieldLegend>
          <RadioGroup name="template" defaultValue="roadmap" className="grid gap-3 @xl/form:grid-cols-2">
            {templates.map((t) => (
              <FieldLabel key={t.value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{t.title}</FieldTitle>
                    <FieldDescription>{t.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={t.value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Checkbox id="private" name="private" />
          <FieldContent>
            <FieldLabel htmlFor="private">Private project</FieldLabel>
            <FieldDescription>Only people you invite can see the project and its tasks.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </CardContent>
    <CardFooter className="flex-col-reverse items-stretch @xl/form:flex-row @xl/form:justify-end">
      <Button type="button" variant="ghost">Cancel</Button>
      <Button type="submit">Create Project</Button>
    </CardFooter>
  </form>
</Card>`}
      >
        <CreateProjectForm />
      </Example>

      <Guidelines
        do={[
          "Give every control a visible label. Use FieldDescription for format hints, not the placeholder.",
          "Show one message under a field at a time: the description, or the error that replaces it.",
          "Write errors that say how to fix the value: “Use lowercase letters, numbers and single hyphens, like team-offsite.”",
          "Validate on submit or blur, then move focus to the first invalid control.",
          "Use FieldSet and FieldLegend for a group of radios or checkboxes.",
        ]}
        dont={[
          "Don’t turn labels red on error. The control border and the error text carry the state.",
          "Don’t write “Invalid input”. Name the field and the rule.",
          "Don’t put two controls in one Field. Give each its own label.",
          "Don’t add helper text that repeats the label.",
        ]}
      />

      <ApiTable
        title="Field"
        rows={[
          { prop: "orientation", type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"', description: "Stack the label above the control, put it beside the control, or switch once the FieldGroup is at least 28rem wide (@md)." },
          { prop: "data-invalid", type: "boolean", description: "Marks the field invalid. Inputs, textareas, input groups and selection controls inside turn destructive." },
          { prop: "data-disabled", type: "boolean", description: "Dims the label and title. Disable the control itself too." },
        ]}
      />

      <ApiTable
        title="Parts"
        rows={[
          { prop: "FieldLabel", type: "<label>", description: "Label-role text in ink. Wrapping a <Field> turns it into a choice card." },
          { prop: "FieldTitle", type: "<div>", description: "The title inside a choice card, where the card itself is the label." },
          { prop: "FieldDescription", type: "<p>", description: "Caption-size helper text in muted foreground. Links inside are ink and underlined." },
          { prop: "FieldError", type: "<div role=alert>", description: "Destructive caption with an icon. Pass children, or errors={[{ message }]} to list several." },
          { prop: "FieldContent", type: "<div>", description: "Stacks a label and description beside a control in horizontal fields." },
          { prop: "FieldGroup", type: "<div>", description: "Stacks fields with gap-6, a wider rhythm than inside a field, and is the container for responsive fields." },
          { prop: "FieldSet / FieldLegend", type: '<fieldset> / <legend variant="legend" | "label">', description: "Groups related controls. The legend variant is a bold section title; label matches FieldLabel." },
          { prop: "FieldSeparator", type: "<div>", description: "A hairline with optional centred text, such as “or”." },
        ]}
      />
    </Examples>
  )
}
