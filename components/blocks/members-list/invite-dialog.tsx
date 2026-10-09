"use client"

import * as React from "react"
import { UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

import { ASSIGNABLE_ROLES, EMAIL_PATTERN, ROLE_ITEMS, type MemberRole } from "./roles"

export type AssignableRole = Exclude<MemberRole, "owner">

export interface InviteDialogProps {
  /** Workspace people are invited to, used in the copy. */
  workspaceName?: string
  /** Role preselected in the dialog. */
  defaultRole?: AssignableRole
  /** Addresses that already belong to the workspace. They are rejected with a clear message. */
  existingEmails?: string[]
  /** Called with valid, de-duplicated addresses. Without it, the dialog simulates a short request. */
  onInvite?: (emails: string[], role: AssignableRole) => void | Promise<void>
  /** Trigger label. */
  triggerLabel?: string
  /** Trigger button style. */
  triggerVariant?: "default" | "outline" | "secondary"
  /** Trigger button size. */
  triggerSize?: "default" | "sm"
  /** Class names for the trigger button. */
  className?: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function parseEmails(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\s,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}

export function InviteDialog({
  workspaceName = "Halcyon Labs",
  defaultRole = "developer",
  existingEmails = [],
  onInvite,
  triggerLabel = "Invite members",
  triggerVariant = "default",
  triggerSize = "default",
  className,
}: InviteDialogProps) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const [raw, setRaw] = React.useState("")
  const [role, setRole] = React.useState<AssignableRole>(defaultRole)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const emails = parseEmails(raw)
  const count = emails.length
  const roleInfo = ASSIGNABLE_ROLES.find((r) => r.value === role)

  function resetForm() {
    setRaw("")
    setError(null)
    setRole(defaultRole)
  }

  function handleOpenChange(next: boolean) {
    if (pending) return
    setOpen(next)
    if (!next) resetForm()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const existing = new Set(existingEmails.map((e) => e.toLowerCase()))
    const invalid = emails.filter((e) => !EMAIL_PATTERN.test(e))
    const taken = emails.filter((e) => existing.has(e))
    let message: string | null = null
    if (count === 0) message = "Enter at least one email address."
    else if (invalid.length)
      message = `Check ${invalid.join(", ")}. Each address needs a name, an @ and a domain.`
    else if (taken.length)
      message = `${taken.join(", ")} ${taken.length === 1 ? "is" : "are"} already in ${workspaceName}.`
    setError(message)
    if (message) {
      textareaRef.current?.focus()
      return
    }

    setPending(true)
    try {
      await (onInvite ? onInvite(emails, role) : wait(700))
      setPending(false)
      setOpen(false)
      resetForm()
      toast.add({
        title: count === 1 ? "Invite sent" : `${count} invites sent`,
        description: `They’ll get an email with a link to join ${workspaceName}.`,
      })
    } catch {
      setPending(false)
      setError("We couldn’t send the invites. Try again in a moment.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant={triggerVariant} size={triggerSize} className={className} />}>
        <UserPlusIcon data-icon="inline-start" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-(--dialog-width)">
        <form onSubmit={handleSubmit} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>Invite people to {workspaceName}</DialogTitle>
            <DialogDescription>Invites expire after 7 days. You can change roles at any time.</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor={`${id}-emails`}>Email addresses</FieldLabel>
              <Textarea
                ref={textareaRef}
                id={`${id}-emails`}
                name="emails"
                rows={3}
                spellCheck={false}
                autoCapitalize="none"
                placeholder="sam@halcyon.dev, ana@halcyon.dev"
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value)
                  if (error) setError(null)
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-emails-error` : `${id}-emails-hint`}
              />
              {error ? (
                <FieldError id={`${id}-emails-error`}>{error}</FieldError>
              ) : (
                <FieldDescription id={`${id}-emails-hint`}>
                  Separate addresses with commas or new lines.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor={`${id}-role`}>Role</FieldLabel>
              <Select
                id={`${id}-role`}
                items={ROLE_ITEMS}
                value={role}
                onValueChange={(value) => value && setRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {roleInfo ? <FieldDescription>{roleInfo.description}</FieldDescription> : null}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={pending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {count > 1 ? `Send ${count} invites` : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
