"use client"

import * as React from "react"
import { CheckIcon, GlobeIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const domainPattern = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/

function AddDomain() {
  const id = React.useId()
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [domains, setDomains] = React.useState(["halcyon.dev", "www.halcyon.dev"])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const domain = value.trim().toLowerCase()
    if (!domain) return setError("Enter a domain to add.")
    if (/^https?:\/\//.test(domain)) return setError("Leave out https://. Enter just the domain, like docs.halcyon.dev.")
    if (!domainPattern.test(domain)) return setError("Enter a full domain with a dot, like docs.halcyon.dev.")
    if (domains.includes(domain)) return setError(`${domain} is already on this project.`)
    setDomains((d) => [...d, domain])
    setValue("")
    setError(null)
  }

  return (
    <div className="grid w-full max-w-128 gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
      <div className="grid gap-1">
        <h3 className="text-h4">Domains</h3>
        <p className="text-body text-copy">Point a domain at this project. Lumen issues the certificate.</p>
      </div>
      <form noValidate onSubmit={onSubmit}>
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={`${id}-domain`}>Domain</FieldLabel>
          <div className="flex gap-2">
            <Input
              id={`${id}-domain`}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(null)
              }}
              placeholder="docs.halcyon.dev"
              autoComplete="off"
              spellCheck={false}
              inputMode="url"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <Button type="submit">Add</Button>
          </div>
          <FieldError id={`${id}-error`}>{error}</FieldError>
        </Field>
      </form>
      <ul className="grid divide-y border-t">
        {domains.map((d) => (
          <li key={d} className="flex items-center justify-between gap-4 py-3">
            <span className="flex min-w-0 items-center gap-3">
              <GlobeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-label text-foreground">{d}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-caption text-success">
              <CheckIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
              Valid configuration
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InputDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A filled control that turns to the canvas colour with a violet border and outline while focused. Always pair it with a label."
        code={`<Field>
  <FieldLabel htmlFor="name">Project name</FieldLabel>
  <Input id="name" placeholder="acme-web" />
</Field>`}
      >
        <div className="w-full max-w-96">
          <Field>
            <FieldLabel htmlFor="input-default">Project name</FieldLabel>
            <Input id="input-default" placeholder="acme-web" />
          </Field>
        </div>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="Heights come from --control-height-sm, -md and -lg and match buttons of the same size. Medium is the default; keep one size per form."
        code={`<Input size="sm" placeholder="Filter logs" />
<Input placeholder="Filter logs" />
<Input size="lg" placeholder="Filter logs" />`}
      >
        <div className="grid w-full max-w-96 gap-4">
          <Input size="sm" aria-label="Filter logs, small" placeholder="Filter logs" />
          <Input aria-label="Filter logs, medium" placeholder="Filter logs" />
          <Input size="lg" aria-label="Filter logs, large" placeholder="Filter logs" />
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Read-only fields drop the fill so they read as values, not inputs. Invalid fields take a destructive border and an error that says how to fix them."
        code={`<Input readOnly defaultValue="prj_8f2Kq7Zt" />
<Input disabled defaultValue="main" />
<Input aria-invalid defaultValue="Acme Web" />`}
      >
        <div className="grid w-full max-w-168 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="input-empty">Placeholder</FieldLabel>
            <Input id="input-empty" placeholder="acme-web" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-filled">Filled</FieldLabel>
            <Input id="input-filled" defaultValue="acme-web" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-readonly">Project ID</FieldLabel>
            <Input id="input-readonly" readOnly defaultValue="prj_8f2Kq7Zt" className="font-mono" />
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="input-disabled">Production branch</FieldLabel>
            <Input id="input-disabled" disabled defaultValue="main" />
          </Field>
          <Field data-invalid className="sm:col-span-2">
            <FieldLabel htmlFor="input-invalid">Project name</FieldLabel>
            <Input id="input-invalid" aria-invalid aria-describedby="input-invalid-error" defaultValue="Acme Web" />
            <FieldError id="input-invalid-error">Use lowercase letters, numbers and hyphens, like acme-web.</FieldError>
          </Field>
        </div>
      </Example>

      <Example
        title="Types"
        layout="stack"
        description="Use the type that matches the value so browsers offer the right keyboard and autofill."
        code={`<Input type="email" autoComplete="email" />
<Input type="password" autoComplete="current-password" />
<Input type="number" min={1} max={20} />
<Input type="file" />`}
      >
        <div className="grid w-full max-w-168 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="input-email">Work email</FieldLabel>
            <Input id="input-email" type="email" autoComplete="email" placeholder="jamie@halcyon.dev" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-password">Password</FieldLabel>
            <Input id="input-password" type="password" autoComplete="current-password" defaultValue="correct-horse" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-number">Build concurrency</FieldLabel>
            <Input id="input-number" type="number" min={1} max={20} defaultValue={4} className="tabular" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-file">Environment file</FieldLabel>
            <Input id="input-file" type="file" accept=".env,text/plain" />
          </Field>
        </div>
      </Example>

      <Example
        title="Add a domain"
        description="An input and its action on one line. Errors appear below the row and clear as soon as the person edits the value. Try https://halcyon.dev."
        code={`<form onSubmit={onSubmit}>
  <Field data-invalid={!!error}>
    <FieldLabel htmlFor="domain">Domain</FieldLabel>
    <div className="flex gap-2">
      <Input id="domain" aria-invalid={!!error} aria-describedby="domain-error" />
      <Button type="submit">Add</Button>
    </div>
    <FieldError id="domain-error">{error}</FieldError>
  </Field>
</form>`}
      >
        <AddDomain />
      </Example>

      <Guidelines
        do={[
          "Give every input a visible label. Placeholders vanish as soon as people type.",
          "Use the type, inputMode and autoComplete that match the value.",
          "Size the field to the value it takes: a port number does not need the full width.",
          "Explain the format in a FieldDescription before people get it wrong.",
        ]}
        dont={[
          "Don’t use the placeholder as the label or as the only hint.",
          "Don’t show an error while someone is still typing. Validate on blur or submit.",
          "Don’t mix input sizes in one form.",
          "Don’t disable a field without saying why nearby.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height and padding, from the --control-* tokens. Replaces the native size attribute." },
          { prop: "type", type: "string", default: '"text"', description: "Native input type: text, email, password, number, search, url, file and so on." },
          { prop: "aria-invalid", type: "boolean", description: "Destructive border and focus outline. Pair with a FieldError linked by aria-describedby." },
          { prop: "readOnly", type: "boolean", description: "Shows the value on the canvas colour without the fill." },
          { prop: "disabled", type: "boolean", description: "Dims the field and blocks interaction." },
          { prop: "…props", type: "InputHTMLAttributes", description: "Every native input attribute, plus Base UI’s onValueChange." },
        ]}
      />
    </Examples>
  )
}
