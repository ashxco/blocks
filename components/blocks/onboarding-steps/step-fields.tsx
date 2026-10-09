"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, LinkIcon, LockIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react"

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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

import {
  INVITE_ROLES,
  PROVIDERS,
  RESERVED_SLUGS,
  SLUG_PATTERN,
  type GitProvider,
  type InviteRole,
  type OnboardingInvite,
  type OnboardingRepository,
  type OnboardingValues,
  type StepErrors,
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
export const newInvite = (role: InviteRole = "developer"): OnboardingInvite => ({
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
  const mailDomain = `${slug.split("-")[0]}.dev`
  const inviteLink = `${domain}/${slug}/join/k7Qm2x`
  const examples = ["sam", "ana", "kai", "noor", "eli"]

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

/* Step 3: connect a repository ------------------------------------------ */

export function RepositoryStep({
  idPrefix,
  values,
  errors,
  repositories,
  account,
  onProviderChange,
  onRepositoryChange,
}: StepProps & {
  repositories: OnboardingRepository[]
  account: string
  onProviderChange: (provider: GitProvider) => void
  onRepositoryChange: (id: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()
  const visible = q
    ? repositories.filter((r) => `${r.name} ${r.framework}`.toLowerCase().includes(q))
    : repositories
  const provider = PROVIDERS.find((p) => p.value === values.provider)?.label ?? "GitHub"

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field className="w-auto">
          <FieldLabel htmlFor={`${idPrefix}-provider`}>Git provider</FieldLabel>
          <Select
            id={`${idPrefix}-provider`}
            items={PROVIDERS}
            value={values.provider}
            onValueChange={(value) => value && onProviderChange(value)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <p className="flex items-center gap-2 pb-3 text-sm text-copy">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          Connected to {provider} as <span className="font-semibold text-foreground">{account}</span>
        </p>
      </div>

      <Field data-invalid={Boolean(errors.repositoryId)}>
        <FieldTitle id={`${idPrefix}-repos-label`}>Repository</FieldTitle>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories"
            aria-label="Search repositories"
          />
        </InputGroup>
        <RadioGroup
          id={`${idPrefix}-repos`}
          value={values.repositoryId ?? ""}
          onValueChange={(value) => onRepositoryChange(String(value))}
          aria-labelledby={`${idPrefix}-repos-label`}
          aria-describedby={errors.repositoryId ? `${idPrefix}-repos-error` : undefined}
          className="gap-0 divide-y overflow-hidden rounded-(--control-radius) border"
        >
          {visible.map((repo) => (
            <label
              key={repo.id}
              className="flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-colors duration-(--duration-fast) hover:bg-accent has-data-checked:bg-accent"
            >
              <RadioGroupItem value={repo.id} />
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-mono text-sm font-semibold text-foreground">{repo.name}</span>
                  {repo.private ? (
                    <>
                      <LockIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="sr-only">Private</span>
                    </>
                  ) : null}
                </span>
                <span className="text-caption text-muted-foreground">
                  {repo.framework} · Updated {repo.updated}
                </span>
              </span>
            </label>
          ))}
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No repositories match “{query.trim()}”.
            </p>
          ) : null}
        </RadioGroup>
        {errors.repositoryId ? (
          <FieldError id={`${idPrefix}-repos-error`}>{errors.repositoryId}</FieldError>
        ) : (
          <FieldDescription>Every push to the default branch deploys to production. Other branches get previews.</FieldDescription>
        )}
      </Field>
    </div>
  )
}
