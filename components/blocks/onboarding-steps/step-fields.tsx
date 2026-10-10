"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, LinkIcon, PlusIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

import {
  INVITE_ROLES,
  RESERVED_SLUGS,
  SLUG_PATTERN,
  VIEW_LABELS,
  type InviteRole,
  type OnboardingInvite,
  type OnboardingTemplate,
  type OnboardingValues,
  type StepErrors,
  type TemplateView,
} from "./types"
import { WorkspaceUrlInput } from "./workspace-url-input"

interface StepProps {
  /** Prefix for element ids, so the parent can focus the first invalid field. */
  idPrefix: string
  values: OnboardingValues
  errors: StepErrors
  domain: string
}

/* Step 1: name the workspace and choose its URL ------------------------- */

/** Stand-in slug: the URL field's placeholder, and the step panel's preview until there is a value. */
export const SLUG_PLACEHOLDER = "acme"

export function WorkspaceStep({
  idPrefix,
  values,
  errors,
  domain,
  onNameChange,
  onSlugChange,
}: StepProps & { onNameChange: (name: string) => void; onSlugChange: (slug: string) => void }) {
  const slug = values.workspaceSlug
  const available =
    !errors.workspaceSlug && slug.length >= 3 && SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.includes(slug)

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(errors.workspaceName)}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Workspace name</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          name="workspaceName"
          autoComplete="organization"
          placeholder="Acme Inc."
          value={values.workspaceName}
          onChange={(e) => onNameChange(e.target.value)}
          aria-invalid={Boolean(errors.workspaceName)}
          aria-describedby={`${idPrefix}-name-note`}
        />
        {errors.workspaceName ? (
          <FieldError id={`${idPrefix}-name-note`}>{errors.workspaceName}</FieldError>
        ) : (
          <FieldDescription id={`${idPrefix}-name-note`}>
            Most teams use their company or product name. You can change it later.
          </FieldDescription>
        )}
      </Field>

      <Field data-invalid={Boolean(errors.workspaceSlug)}>
        <FieldLabel htmlFor={`${idPrefix}-slug`}>Workspace URL</FieldLabel>
        <WorkspaceUrlInput
          domain={domain}
          id={`${idPrefix}-slug`}
          name="workspaceSlug"
          placeholder={SLUG_PLACEHOLDER}
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          aria-invalid={Boolean(errors.workspaceSlug)}
          aria-describedby={`${idPrefix}-slug-note`}
          endAddon={available ? <CheckIcon className="text-success" aria-hidden="true" /> : null}
        />
        {errors.workspaceSlug ? (
          <FieldError id={`${idPrefix}-slug-note`}>{errors.workspaceSlug}</FieldError>
        ) : (
          <FieldDescription id={`${idPrefix}-slug-note`} aria-live="polite">
            {available ? (
              <span className="text-success">
                {domain}/{slug} is available.
              </span>
            ) : (
              "Lowercase letters, numbers and hyphens."
            )}
          </FieldDescription>
        )}
      </Field>
    </FieldGroup>
  )
}

/* Step 2: invite the team ----------------------------------------------- */

let rowCount = 0
export const newInvite = (role: InviteRole = "member"): OnboardingInvite => ({
  id: `invite-${++rowCount}`,
  email: "",
  role,
})

export function TeamStep({
  idPrefix,
  values,
  errors,
  domain,
  onInvitesChange,
}: StepProps & { onInvitesChange: (invites: OnboardingInvite[]) => void }) {
  const [copied, setCopied] = React.useState(false)
  const slug = values.workspaceSlug || SLUG_PLACEHOLDER
  const mailDomain = `${slug.split("-")[0]}.com`
  const inviteLink = `${domain}/${slug}/join/k7Qm2x`
  const examples = ["jordan", "sofia", "sam", "priya", "lucas"]

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function update(id: string, patch: Partial<OnboardingInvite>) {
    onInvitesChange(values.invites.map((invite) => (invite.id === id ? { ...invite, ...patch } : invite)))
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${inviteLink}`)
      setCopied(true)
    } catch {
      toast.add({ title: "Couldn’t copy the link", description: "Select the link and copy it yourself." })
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <p id={`${idPrefix}-team-label`} className="text-label text-foreground">
          Teammates
        </p>
        <ul className="grid gap-3" aria-labelledby={`${idPrefix}-team-label`}>
          {values.invites.map((invite, index) => {
            const error = errors.invites?.[invite.id]
            const who = invite.email.trim() || `teammate ${index + 1}`
            return (
              <li key={invite.id} className="grid gap-1.5 border-b pb-3 last:border-b-0 last:pb-0 @prose:border-b-0 @prose:pb-0" data-invalid={Boolean(error)}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 @prose:grid-cols-[minmax(0,1fr)_9rem_auto]">
                  <Input
                    id={`${idPrefix}-invite-${invite.id}`}
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={`${examples[index % examples.length]}@${mailDomain}`}
                    value={invite.email}
                    onChange={(e) => update(invite.id, { email: e.target.value })}
                    aria-label={`Email address for teammate ${index + 1}`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${idPrefix}-invite-${invite.id}-error` : undefined}
                  />
                  <div className="order-last @prose:order-none">
                    <Select
                      items={INVITE_ROLES}
                      value={invite.role}
                      onValueChange={(role) => role && update(invite.id, { role })}
                    >
                      <SelectTrigger className="w-36 @prose:w-full" aria-label={`Role for ${who}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INVITE_ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${who}`}
                    disabled={values.invites.length === 1}
                    onClick={() => onInvitesChange(values.invites.filter((i) => i.id !== invite.id))}
                    className="text-muted-foreground"
                  >
                    <XIcon />
                  </Button>
                </div>
                {error ? <FieldError id={`${idPrefix}-invite-${invite.id}-error`}>{error}</FieldError> : null}
              </li>
            )
          })}
        </ul>
        {values.invites.length < 10 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-3 justify-self-start"
            onClick={() => onInvitesChange([...values.invites, newInvite()])}
          >
            <PlusIcon data-icon="inline-start" />
            Add another
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-(--control-radius) border bg-subtle p-4">
        <LinkIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0 flex-1 basis-48">
          <p className="text-label text-foreground">Or share an invite link</p>
          <p className="truncate font-mono text-caption text-muted-foreground">{inviteLink}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={copyLink} aria-live="polite">
          {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    </div>
  )
}

/* Step 3: pick a template ---------------------------------------------- */

/**
 * A small drawing of the view a template opens in: list rows, board columns,
 * timeline bars or a calendar month. Neutral fills; the marks that carry
 * the view turn ink when the template is chosen.
 */
function TemplatePreview({ view }: { view: TemplateView }) {
  const mark = "bg-muted-foreground/35 transition-colors duration-(--duration-fast) group-has-data-checked/template:bg-foreground"
  const quiet = "bg-muted-foreground/15"
  return (
    <div aria-hidden="true" className="h-24 overflow-hidden rounded-(--control-radius) border bg-subtle p-3">
      {view === "list" ? (
        <div className="grid gap-2.5 pt-0.5">
          {["w-3/5", "w-4/5", "w-2/5", "w-3/4"].map((width, index) => (
            <div key={width} className="flex items-center gap-2">
              <span className={cn("size-2.5 shrink-0 rounded-full border border-muted-foreground/50", index === 0 && "border-0", index === 0 && mark)} />
              <span className={cn("h-1.5 rounded-full", width, index === 0 ? mark : quiet)} />
            </div>
          ))}
        </div>
      ) : view === "board" ? (
        <div className="grid h-full grid-cols-3 gap-2">
          {[3, 2, 1].map((cards, column) => (
            <div key={column} className="grid content-start gap-1.5 rounded-xs bg-muted-foreground/10 p-1.5">
              {Array.from({ length: cards }, (_, card) => (
                <span key={card} className={cn("h-3 rounded-xs border bg-card", column === 1 && card === 0 && "border-0", column === 1 && card === 0 && mark)} />
              ))}
            </div>
          ))}
        </div>
      ) : view === "timeline" ? (
        <div className="grid h-full content-center gap-2.5">
          {[
            { offset: "ml-0", width: "w-2/5" },
            { offset: "ml-[22%]", width: "w-1/2" },
            { offset: "ml-[48%]", width: "w-1/3" },
          ].map((bar, index) => (
            <span key={bar.offset} className={cn("h-2.5 rounded-full", bar.offset, bar.width, index === 1 ? mark : quiet)} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 21 }, (_, day) => (
            <span key={day} className={cn("h-4 rounded-xs", [3, 9, 16].includes(day) ? mark : quiet)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function TemplateStep({
  idPrefix,
  values,
  errors,
  templates,
  onTemplateChange,
}: StepProps & {
  templates: OnboardingTemplate[]
  onTemplateChange: (id: string) => void
}) {
  return (
    <Field data-invalid={Boolean(errors.templateId)}>
      <FieldTitle id={`${idPrefix}-templates-label`}>Template</FieldTitle>
      <RadioGroup
        id={`${idPrefix}-templates`}
        value={values.templateId ?? ""}
        onValueChange={(value) => onTemplateChange(String(value))}
        aria-labelledby={`${idPrefix}-templates-label`}
        aria-describedby={errors.templateId ? `${idPrefix}-templates-error` : `${idPrefix}-templates-hint`}
        className="grid gap-3 @prose:grid-cols-2"
      >
        {templates.map((template) => (
          <label
            key={template.id}
            className="group/template flex cursor-pointer flex-col gap-4 rounded-(--card-radius) border bg-card p-4 transition-colors duration-(--duration-fast) hover:border-border-strong has-data-checked:border-foreground"
          >
            <TemplatePreview view={template.view} />
            <span className="flex items-start gap-3">
              <span className="grid min-w-0 flex-1 gap-1">
                <span className="text-label text-foreground">{template.name}</span>
                <span className="text-caption text-copy">{template.description}</span>
                <span className="text-caption text-muted-foreground">
                  {VIEW_LABELS[template.view]} view · {template.tasks} starter tasks
                </span>
              </span>
              <RadioGroupItem value={template.id} className="mt-0.5" />
            </span>
          </label>
        ))}
      </RadioGroup>
      {errors.templateId ? (
        <FieldError id={`${idPrefix}-templates-error`}>{errors.templateId}</FieldError>
      ) : (
        <FieldDescription id={`${idPrefix}-templates-hint`}>
          Every project has list, board, timeline and calendar views. The template only picks the one it opens in.
        </FieldDescription>
      )}
    </Field>
  )
}
