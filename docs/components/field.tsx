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

const frameworks = [
  { value: "nextjs", title: "Next.js", description: "Runs next build and serves pages, routes and middleware." },
  { value: "astro", title: "Astro", description: "Builds static pages and server islands from src/pages." },
  { value: "sveltekit", title: "SvelteKit", description: "Uses the Lumen adapter for server routes and actions." },
  { value: "static", title: "Static site", description: "Serves a folder of HTML, CSS and assets with no build step." },
] as const

const regions = [
  { value: "fra1", label: "Frankfurt (fra1)" },
  { value: "lhr1", label: "London (lhr1)" },
  { value: "iad1", label: "Washington, D.C. (iad1)" },
  { value: "sfo1", label: "San Francisco (sfo1)" },
  { value: "hnd1", label: "Tokyo (hnd1)" },
  { value: "syd1", label: "Sydney (syd1)" },
]

interface EnvVar {
  id: number
  key: string
  value: string
}

type Errors = Partial<Record<"name" | "repository" | "env", string>>

function validate(name: string, repository: string, env: EnvVar[]): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = "Enter a project name."
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))
    errors.name = "Use lowercase letters, numbers and single hyphens, like acme-web."
  if (!repository.trim()) errors.repository = "Enter the repository as owner/name."
  else if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
    errors.repository = "Use the owner/name format, like acme/web."
  const keyed = env.filter((v) => v.key.trim() || v.value.trim())
  if (keyed.some((v) => !/^[A-Z_][A-Z0-9_]*$/.test(v.key)))
    errors.env = "Keys use capital letters, numbers and underscores, like DATABASE_URL."
  return errors
}

function CreateProjectForm() {
  const id = React.useId()
  const formRef = React.useRef<HTMLFormElement>(null)
  const nextEnvId = React.useRef(3)
  const [name, setName] = React.useState("")
  const [repository, setRepository] = React.useState("")
  const [framework, setFramework] = React.useState<string>("nextjs")
  const [region, setRegion] = React.useState<string | null>("fra1")
  const [previews, setPreviews] = React.useState(true)
  const [env, setEnv] = React.useState<EnvVar[]>([
    { id: 1, key: "DATABASE_URL", value: "postgres://db:5432/app" },
    { id: 2, key: "", value: "" },
  ])
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitted, setSubmitted] = React.useState(false)

  function updateEnv(envId: number, patch: Partial<EnvVar>) {
    setEnv((rows) => rows.map((row) => (row.id === envId ? { ...row, ...patch } : row)))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate(name, repository, env)
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
    setRepository("")
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    const regionLabel = regions.find((r) => r.value === region)?.label ?? region
    return (
      <FormFrame>
        <Card role="status" className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-success-subtle text-success">
              <CheckIcon aria-hidden="true" className="size-5" strokeWidth={2.5} />
            </span>
            <CardTitle>{name} is building</CardTitle>
            <CardDescription className="text-pretty">
              Lumen cloned <span className="font-mono whitespace-nowrap text-foreground">{repository}</span> and started the first
              production build in {regionLabel}.{" "}
              {previews ? "Pull requests will get their own preview URL." : "Preview deployments are off."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={reset}>
              Create another project
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
              Import a Git repository. Lumen builds and deploys it on every push.
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
                  placeholder="acme-web"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={`${id}-name-${errors.name ? "error" : "hint"}`}
                />
                {errors.name ? (
                  <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
                ) : (
                  <FieldDescription id={`${id}-name-hint`}>
                    Previews use it in their URL:{" "}
                    <span className="inline-block max-w-full truncate align-bottom font-mono text-foreground">
                      {name || "acme-web"}-git-main.lumen.app
                    </span>
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.repository)}>
                <FieldLabel htmlFor={`${id}-repo`}>Repository</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>github.com/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${id}-repo`}
                    name="repository"
                    value={repository}
                    onChange={(e) => setRepository(e.target.value)}
                    placeholder="acme/web"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={Boolean(errors.repository)}
                    aria-describedby={`${id}-repo-${errors.repository ? "error" : "hint"}`}
                  />
                </InputGroup>
                {errors.repository ? (
                  <FieldError id={`${id}-repo-error`}>{errors.repository}</FieldError>
                ) : (
                  <FieldDescription id={`${id}-repo-hint`}>
                    Lumen needs read access. Pushes to main deploy to production.
                  </FieldDescription>
                )}
              </Field>

              <FieldSet>
                <FieldLegend variant="label">Framework</FieldLegend>
                <RadioGroup
                  name="framework"
                  value={framework}
                  onValueChange={(value) => setFramework(value as string)}
                  className="grid gap-3 @xl/form:grid-cols-2"
                >
                  {frameworks.map((f) => (
                    <FieldLabel key={f.value}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>{f.title}</FieldTitle>
                          <FieldDescription>{f.description}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value={f.value} />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor={`${id}-region`}>Region</FieldLabel>
                <Select
                  items={regions}
                  name="region"
                  value={region}
                  onValueChange={(value) => setRegion(value as string | null)}
                >
                  <SelectTrigger id={`${id}-region`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Functions run here. Pick the region closest to your database.</FieldDescription>
              </Field>

              <FieldSet>
                <FieldLegend variant="label">Environment variables</FieldLegend>
                <FieldDescription>Encrypted at rest. Available during builds and at runtime.</FieldDescription>
                <div className="grid gap-4 @xl/form:gap-2">
                  {env.map((row, index) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 @xl/form:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]"
                    >
                      <Input
                        aria-label={`Key ${index + 1}`}
                        value={row.key}
                        onChange={(e) => updateEnv(row.id, { key: e.target.value.toUpperCase() })}
                        placeholder="API_URL"
                        spellCheck={false}
                        autoComplete="off"
                        className="font-mono text-ellipsis"
                        aria-invalid={
                          Boolean(errors.env) && !/^[A-Z_][A-Z0-9_]*$/.test(row.key) && Boolean(row.key || row.value)
                        }
                      />
                      <Input
                        aria-label={`Value ${index + 1}`}
                        value={row.value}
                        onChange={(e) => updateEnv(row.id, { value: e.target.value })}
                        placeholder="https://api.acme.dev"
                        spellCheck={false}
                        autoComplete="off"
                        className="col-span-2 row-start-2 font-mono text-ellipsis @xl/form:col-span-1 @xl/form:row-start-auto"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${row.key || `variable ${index + 1}`}`}
                        onClick={() => setEnv((rows) => rows.filter((r) => r.id !== row.id))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ))}
                </div>
                {errors.env ? <FieldError>{errors.env}</FieldError> : null}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEnv((rows) => [...rows, { id: nextEnvId.current++, key: "", value: "" }])}
                  >
                    <PlusIcon data-icon="inline-start" />
                    Add variable
                  </Button>
                </div>
              </FieldSet>

              <Field orientation="horizontal" className="border-t pt-6">
                <Checkbox
                  id={`${id}-previews`}
                  name="previews"
                  checked={previews}
                  onCheckedChange={(checked) => setPreviews(checked)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={`${id}-previews`}>Preview deployments</FieldLabel>
                  <FieldDescription>Deploy every pull request to its own URL and comment the link on it.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex-col-reverse items-stretch @xl/form:flex-row @xl/form:justify-end">
            <Button type="button" variant="ghost" onClick={reset}>
              Cancel
            </Button>
            <Button type="submit">Create project</Button>
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
  { value: "hobby", title: "Hobby", description: "Personal projects. 100\u00a0GB bandwidth." },
  { value: "pro", title: "Pro", description: "Teams shipping to production. 1\u00a0TB bandwidth." },
  { value: "enterprise", title: "Enterprise", description: "SSO, audit logs and a 99.99% SLA." },
]

export default function FieldDocs() {
  return (
    <Examples>
      <Example
        title="Anatomy"
        layout="stack"
        description="A label, the control and a description, 8px apart. The label names the value; the description says how it is used."
        code={`<Field>
  <FieldLabel htmlFor="project">Project name</FieldLabel>
  <Input id="project" placeholder="acme-web" />
  <FieldDescription>Lowercase letters, numbers and hyphens.</FieldDescription>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-anatomy">Project name</FieldLabel>
            <Input id="field-anatomy" placeholder="acme-web" />
            <FieldDescription>Lowercase letters, numbers and hyphens.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Description first"
        layout="stack"
        description="Put the description under the label when people need it before they type. It tucks up to 4px from the label."
        code={`<Field>
  <FieldLabel htmlFor="build">Build command</FieldLabel>
  <FieldDescription>Runs in the project root after dependencies install.</FieldDescription>
  <Input id="build" defaultValue="npm run build" className="font-mono" spellCheck={false} />
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-build">Build command</FieldLabel>
            <FieldDescription>Runs in the project root after dependencies install.</FieldDescription>
            <Input id="field-build" defaultValue="npm run build" className="font-mono" spellCheck={false} />
          </Field>
        </div>
      </Example>

      <Example
        title="Validation"
        layout="stack"
        description="Set data-invalid on the field and aria-invalid on the control. The error replaces the description and says how to fix the value."
        code={`<Field data-invalid>
  <FieldLabel htmlFor="domain">Domain</FieldLabel>
  <Input id="domain" defaultValue="https://acme.dev" aria-invalid aria-describedby="domain-error" />
  <FieldError id="domain-error">Enter the domain without https://, like acme.dev.</FieldError>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <Field data-invalid>
            <FieldLabel htmlFor="field-domain">Domain</FieldLabel>
            <Input id="field-domain" defaultValue="https://acme.dev" aria-invalid aria-describedby="field-domain-error" />
            <FieldError id="field-domain-error">Enter the domain without https://, like acme.dev.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Horizontal"
        layout="stack"
        description="Selection controls sit beside their label. With a description, wrap the text in FieldContent and the control aligns to the first line."
        code={`<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="previews">Preview deployments</FieldLabel>
    <FieldDescription>Deploy every pull request to its own URL.</FieldDescription>
  </FieldContent>
  <Switch id="previews" defaultChecked />
</Field>

<Field orientation="horizontal">
  <Checkbox id="failures" defaultChecked />
  <FieldLabel htmlFor="failures">Email me when a production build fails</FieldLabel>
</Field>`}
      >
        <div className="grid w-full max-w-md gap-6">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="field-previews">Preview deployments</FieldLabel>
              <FieldDescription>Deploy every pull request to its own URL.</FieldDescription>
            </FieldContent>
            <Switch id="field-previews" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="field-failures" defaultChecked />
            <FieldLabel htmlFor="field-failures">Email me when a production build fails</FieldLabel>
          </Field>
        </div>
      </Example>

      <Example
        title="Fieldset"
        layout="stack"
        description="Group related controls under a legend. Use the label variant inside forms and the legend variant for a titled section."
        code={`<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldDescription>Choose what Lumen emails you about. Alerts for failed builds always send.</FieldDescription>
  <FieldGroup data-slot="checkbox-group">
    <Field orientation="horizontal">
      <Checkbox id="n-deploys" defaultChecked />
      <FieldLabel htmlFor="n-deploys">Production deployments</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox id="n-comments" defaultChecked />
      <FieldLabel htmlFor="n-comments">Comments on previews</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox id="n-domains" />
      <FieldLabel htmlFor="n-domains">Domain renewals</FieldLabel>
    </Field>
    <Field orientation="horizontal" data-disabled>
      <Checkbox id="n-failed" defaultChecked disabled />
      <FieldLabel htmlFor="n-failed">Failed builds</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>`}
      >
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldLegend>Notifications</FieldLegend>
            <FieldDescription>Choose what Lumen emails you about. Alerts for failed builds always send.</FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Checkbox id="field-n-deploys" defaultChecked />
                <FieldLabel htmlFor="field-n-deploys">Production deployments</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="field-n-comments" defaultChecked />
                <FieldLabel htmlFor="field-n-comments">Comments on previews</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="field-n-domains" />
                <FieldLabel htmlFor="field-n-domains">Domain renewals</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled="true">
                <Checkbox id="field-n-failed" defaultChecked disabled />
                <FieldLabel htmlFor="field-n-failed">Failed builds</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </Example>

      <Example
        title="Choice cards"
        layout="stack"
        description="Wrap a horizontal field in FieldLabel to make the whole card clickable. The selected card takes an ink border."
        code={`const plans = [
  { value: "hobby", title: "Hobby", description: "Personal projects. 100 GB bandwidth." },
  { value: "pro", title: "Pro", description: "Teams shipping to production. 1 TB bandwidth." },
  { value: "enterprise", title: "Enterprise", description: "SSO, audit logs and a 99.99% SLA." },
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
      <FieldLabel htmlFor="branch">Production branch</FieldLabel>
      <FieldDescription>Pushes to this branch deploy to production.</FieldDescription>
    </FieldContent>
    <Input id="branch" defaultValue="main" className="font-mono @md/field-group:basis-72" spellCheck={false} />
  </Field>
  <Field orientation="responsive">
    <FieldContent>
      <FieldLabel htmlFor="output">Output directory</FieldLabel>
      <FieldDescription>Lumen serves files from this folder after the build.</FieldDescription>
    </FieldContent>
    <Input id="output" defaultValue=".next" className="font-mono @md/field-group:basis-72" spellCheck={false} />
  </Field>
</FieldGroup>`}
      >
        <FieldGroup className="max-w-3xl">
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-branch">Production branch</FieldLabel>
              <FieldDescription>Pushes to this branch deploy to production.</FieldDescription>
            </FieldContent>
            <Input id="field-branch" defaultValue="main" className="font-mono @md/field-group:basis-72" spellCheck={false} />
          </Field>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-output">Output directory</FieldLabel>
              <FieldDescription>Lumen serves files from this folder after the build.</FieldDescription>
            </FieldContent>
            <Input id="field-output" defaultValue=".next" className="font-mono @md/field-group:basis-72" spellCheck={false} />
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Separator"
        layout="stack"
        description="Split alternatives, such as two ways to connect a repository."
        code={`<Button variant="outline" className="w-full">Connect GitHub</Button>
<FieldSeparator>or</FieldSeparator>
<Field>
  <FieldLabel htmlFor="clone">Public repository URL</FieldLabel>
  <Input id="clone" placeholder="https://gitlab.com/acme/web" spellCheck={false} />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <Button variant="outline" className="w-full">
            Connect GitHub
          </Button>
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="field-clone">Public repository URL</FieldLabel>
            <Input id="field-clone" placeholder="https://gitlab.com/acme/web" spellCheck={false} />
          </Field>
        </div>
      </Example>

      <Example
        title="Complete form"
        layout="full"
        surface="subtle"
        description="A new-project form in a card: a validated name, a repository with a fixed prefix, framework cards, a region select, environment variables and a preview checkbox. It is saved with a button, so the on/off setting is a checkbox, not a switch. Submit it empty to see the errors."
        code={`<Card className="@container/form">
  <form onSubmit={onSubmit} noValidate className="contents">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Import a Git repository. Lumen builds and deploys it on every push.</CardDescription>
    </CardHeader>
    <CardContent>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Project name</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} aria-describedby="name-error" />
          <FieldError id="name-error">{errors.name}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="repo">Repository</FieldLabel>
          <InputGroup>
            <InputGroupAddon><InputGroupText>github.com/</InputGroupText></InputGroupAddon>
            <InputGroupInput id="repo" placeholder="acme/web" />
          </InputGroup>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Framework</FieldLegend>
          <RadioGroup name="framework" defaultValue="nextjs" className="grid gap-3 @xl/form:grid-cols-2">
            {frameworks.map((f) => (
              <FieldLabel key={f.value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{f.title}</FieldTitle>
                    <FieldDescription>{f.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={f.value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Checkbox id="previews" name="previews" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="previews">Preview deployments</FieldLabel>
            <FieldDescription>Deploy every pull request to its own URL.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </CardContent>
    <CardFooter className="flex-col-reverse items-stretch @xl/form:flex-row @xl/form:justify-end">
      <Button type="button" variant="ghost">Cancel</Button>
      <Button type="submit">Create project</Button>
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
          "Write errors that say how to fix the value: “Use the owner/name format, like acme/web.”",
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
          { prop: "FieldGroup", type: "<div>", description: "Stacks fields 24px apart and is the container for responsive fields." },
          { prop: "FieldSet / FieldLegend", type: '<fieldset> / <legend variant="legend" | "label">', description: "Groups related controls. The legend variant is a bold section title; label matches FieldLabel." },
          { prop: "FieldSeparator", type: "<div>", description: "A hairline with optional centred text, such as “or”." },
        ]}
      />
    </Examples>
  )
}
