"use client"

import * as React from "react"
import { CheckIcon, MailIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const members = [
  "maya", "hana", "daniel", "lucas", "jordan", "sofia", "priya", "sam", "noah",
  "aisha", "kenji", "chloe", "rui", "ava", "leila", "arjun", "ben", "tom",
].map((name) => `${name}@acme.com`)

function InviteByEmail() {
  const id = React.useId()
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [invites, setInvites] = React.useState(["theo@acme.com", "ines@acme.com"])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = value.trim().toLowerCase()
    if (!email) return setError("Enter an email address to send an invite.")
    if (/[<>]/.test(email)) return setError("Leave out the name. Enter just the address, like alex@acme.com.")
    if (!emailPattern.test(email)) return setError("Enter a full email address, like alex@acme.com.")
    if (members.includes(email)) return setError(`${email} is already a member of this workspace.`)
    if (invites.includes(email)) return setError(`${email} already has an invite.`)
    setInvites((list) => [...list, email])
    setValue("")
    setError(null)
  }

  return (
    <Card className="@container/invites w-full max-w-md">
      <CardHeader>
        <CardTitle>Invite members</CardTitle>
        <CardDescription className="text-pretty">Add people to the Acme Inc. workspace. They join as members.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form noValidate onSubmit={onSubmit}>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
            <div className="flex gap-2">
              <Input
                id={`${id}-email`}
                type="email"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="alex@acme.com"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
              />
              <Button type="submit">Invite</Button>
            </div>
            <FieldError id={`${id}-error`}>{error}</FieldError>
          </Field>
        </form>
        <ul className="grid divide-y border-t">
          {invites.map((email) => (
            <li key={email} className="flex items-center justify-between gap-4 py-3">
              <span className="flex min-w-0 items-center gap-3">
                <MailIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-label text-foreground">{email}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-caption text-success">
                <CheckIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                <span className="sr-only @sm/invites:not-sr-only">Invite sent</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const sizes = [
  { size: "sm", label: "Small", height: `${tokenPx("--control-height-sm")}px` },
  { size: "default", label: "Medium", height: `${tokenPx("--control-height-md")}px` },
  { size: "lg", label: "Large", height: `${tokenPx("--control-height-lg")}px` },
] as const

/** One cell of the States example: a real field, with the state it shows named underneath. */
function StateCell({ state, className, children }: { state: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid grid-rows-[1fr_auto] gap-3", className)}>
      {children}
      <p className="border-t pt-2.5 text-caption text-muted-foreground">{state}</p>
    </div>
  )
}

export default function InputDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A filled control that turns to the canvas colour with an accent border and outline while focused. Always pair it with a label."
        code={`<Field>
  <FieldLabel htmlFor="name">Project name</FieldLabel>
  <Input id="name" placeholder="Website relaunch" />
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="input-default">Project name</FieldLabel>
          <Input id="input-default" placeholder="Website relaunch" />
        </Field>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="Heights come from --control-height-sm, -md and -lg and match buttons of the same size. Medium is the default; keep one size per form."
        code={`<Field>
  <FieldLabel htmlFor="filter-sm">Small</FieldLabel>
  <Input id="filter-sm" size="sm" placeholder="Filter tasks" />
</Field>
<Field>
  <FieldLabel htmlFor="filter-md">Medium</FieldLabel>
  <Input id="filter-md" placeholder="Filter tasks" />
</Field>
<Field>
  <FieldLabel htmlFor="filter-lg">Large</FieldLabel>
  <Input id="filter-lg" size="lg" placeholder="Filter tasks" />
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {sizes.map(({ size, label, height }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`input-size-${size}`}>
                {label} <span className="font-normal text-muted-foreground">{height}</span>
              </FieldLabel>
              <Input id={`input-size-${size}`} size={size} placeholder="Filter tasks" />
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Read-only fields drop the fill so they read as values, not inputs. Invalid fields take a destructive border and an error that says how to fix them."
        code={`<Field>
  <FieldLabel htmlFor="name">Project name</FieldLabel>
  <Input id="name" placeholder="Website relaunch" />
</Field>

<Field>
  <FieldLabel htmlFor="name-filled">Project name</FieldLabel>
  <Input id="name-filled" defaultValue="Mobile app 2.0" />
</Field>

<Field>
  <FieldLabel htmlFor="project-id">Project ID</FieldLabel>
  <Input id="project-id" readOnly defaultValue="prj_8f2Kq7Zt" className="font-mono" />
</Field>

<Field data-disabled>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" disabled defaultValue="maya@acme.com" />
  <FieldDescription>Only an admin can change member emails.</FieldDescription>
</Field>

<Field data-invalid>
  <FieldLabel htmlFor="slug-invalid">Workspace URL</FieldLabel>
  <Input id="slug-invalid" aria-invalid aria-describedby="slug-invalid-error" defaultValue="Acme Inc." />
  <FieldError id="slug-invalid-error">Use lowercase letters, numbers and hyphens, like acme.</FieldError>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-x-6 gap-y-8 @xl:grid-cols-2">
          <StateCell state="Empty">
            <Field>
              <FieldLabel htmlFor="input-empty">Project name</FieldLabel>
              <Input id="input-empty" placeholder="Website relaunch" />
            </Field>
          </StateCell>
          <StateCell state="Filled">
            <Field>
              <FieldLabel htmlFor="input-filled">Project name</FieldLabel>
              <Input id="input-filled" defaultValue="Mobile app 2.0" />
            </Field>
          </StateCell>
          <StateCell state="Read-only">
            <Field>
              <FieldLabel htmlFor="input-readonly">Project ID</FieldLabel>
              <Input id="input-readonly" readOnly defaultValue="prj_8f2Kq7Zt" className="font-mono" />
            </Field>
          </StateCell>
          <StateCell state="Disabled">
            <Field data-disabled="true">
              <FieldLabel htmlFor="input-disabled">Email</FieldLabel>
              <Input id="input-disabled" disabled defaultValue="maya@acme.com" />
              <FieldDescription>Only an admin can change member emails.</FieldDescription>
            </Field>
          </StateCell>
          <StateCell state="Invalid" className="@xl:col-span-2">
            <Field data-invalid>
              <FieldLabel htmlFor="input-invalid">Workspace URL</FieldLabel>
              <Input id="input-invalid" aria-invalid aria-describedby="input-invalid-error" defaultValue="Acme Inc." />
              <FieldError id="input-invalid-error">Use lowercase letters, numbers and hyphens, like acme.</FieldError>
            </Field>
          </StateCell>
        </div>
      </Example>

      <Example
        title="Types"
        layout="stack"
        description="Use the type that matches the value so browsers offer the right keyboard and autofill."
        code={`<Field>
  <FieldLabel htmlFor="email">Work email</FieldLabel>
  <Input id="email" type="email" autoComplete="email" placeholder="maya@acme.com" />
</Field>

<Field>
  <FieldLabel htmlFor="password">Password</FieldLabel>
  <Input id="password" type="password" autoComplete="current-password" />
</Field>

<Field>
  <FieldLabel htmlFor="seats">Seats</FieldLabel>
  <Input id="seats" type="number" min={1} max={500} defaultValue={18} className="max-w-24 tabular" />
</Field>

<Field>
  <FieldLabel htmlFor="webhook">Webhook URL</FieldLabel>
  <Input id="webhook" type="url" inputMode="url" autoComplete="url" placeholder="https://example.com/hook" />
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="input-email">Work email</FieldLabel>
            <Input id="input-email" type="email" autoComplete="email" placeholder="maya@acme.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-password">Password</FieldLabel>
            <Input id="input-password" type="password" autoComplete="current-password" defaultValue="correct-horse" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-number">Seats</FieldLabel>
            <Input id="input-number" type="number" min={1} max={500} defaultValue={18} className="max-w-24 tabular" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-url">Webhook URL</FieldLabel>
            <Input id="input-url" type="url" inputMode="url" autoComplete="url" placeholder="https://example.com/hook" />
          </Field>
        </div>
      </Example>

      <Example
        title="Invite by email"
        description="An input and its action on one line. Errors appear below the row and clear as soon as the person edits the value. Try alex@acme or maya@acme.com."
        code={`<form onSubmit={onSubmit}>
  <Field data-invalid={!!error}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <div className="flex gap-2">
      <Input id="email" type="email" aria-invalid={!!error} aria-describedby="email-error" />
      <Button type="submit">Invite</Button>
    </div>
    <FieldError id="email-error">{error}</FieldError>
  </Field>
</form>`}
        surface="subtle"
      >
        <InviteByEmail />
      </Example>

      <Guidelines
        do={[
          "Give every input a visible label. Placeholders vanish as soon as people type.",
          "Use the type, inputMode and autoComplete that match the value.",
          "Size the field to the value it takes: a seat count does not need the full width.",
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
