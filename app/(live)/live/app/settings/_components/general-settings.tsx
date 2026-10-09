"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"

import { DangerZone, type DangerAction } from "@/components/blocks/danger-zone"
import { personTone } from "@/components/blocks/members-list/people"
import { WorkspaceUrlInput } from "@/components/blocks/onboarding-steps/workspace-url-input"
import { SettingsSection } from "@/components/blocks/settings-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

import { SwitchRow } from "./switch-row"

const TIME_ZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time, Los Angeles" },
  { value: "America/New_York", label: "Eastern Time, New York" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Central European Time, Berlin" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Sydney" },
]

const REGIONS = [
  { value: "fra1", label: "Frankfurt, Germany (fra1)" },
  { value: "iad1", label: "Washington, D.C., USA (iad1)" },
  { value: "sfo1", label: "San Francisco, USA (sfo1)" },
  { value: "gru1", label: "São Paulo, Brazil (gru1)" },
  { value: "sin1", label: "Singapore (sin1)" },
  { value: "syd1", label: "Sydney, Australia (syd1)" },
]

const WORKSPACE_SLUG = "acme"

const workspaceActions: DangerAction[] = [
  {
    id: "transfer",
    title: "Transfer ownership",
    description:
      "Hand Acme Inc. to another admin. You stay on as an admin and keep access to every project.",
    actionLabel: "Transfer",
    confirmTitle: "Transfer ownership of Acme Inc.?",
    confirmDescription:
      "We email Daniel Okafor, the workspace admin, a link to accept. You stay the owner until Daniel accepts. The link expires in 7 days.",
    confirmLabel: "Send transfer request",
    tone: "default",
    successMessage: "Transfer request sent to Daniel Okafor.",
  },
  {
    id: "pause",
    title: "Pause all deployments",
    description:
      "Stop building new commits in every project. Production keeps serving the current deployments.",
    actionLabel: "Pause all",
    confirmTitle: "Pause deployments across Acme Inc.?",
    confirmDescription:
      "Pushes and pull requests won’t build until you resume. Production and existing previews stay online at their current versions.",
    confirmLabel: "Pause deployments",
    tone: "default",
    successMessage: "Deployments paused across Acme Inc.",
  },
  {
    id: "delete",
    title: "Delete workspace",
    description:
      "Permanently delete Acme Inc. with its projects, databases, domains and logs. Members lose access right away.",
    actionLabel: "Delete workspace",
    confirmTitle: "Delete Acme Inc.?",
    confirmDescription:
      "This deletes every project, database and log in the workspace, releases its domains and cancels the Pro plan. You can’t undo this.",
    requireTyping: true,
    tone: "destructive",
    successMessage: "Acme Inc. is scheduled for deletion.",
  },
]

/** General tab: profile, workspace and the workspace danger zone. */
export function GeneralSettings() {
  return (
    <div className="divide-y">
      <SettingsSection
        title="Profile"
        description="How teammates see you in deploy logs, comments and invites."
        footerNote="Your profile is visible to everyone in Acme Inc."
        saveLabel="Save profile"
        successTitle="Profile saved"
        successDescription="Teammates see your new details in deploy logs, comments and invites."
      >
        <ProfileFields />
      </SettingsSection>

      <SettingsSection
        title="Workspace"
        description="The workspace name and URL appear in the dashboard, in invites and on every preview link."
        footerNote="Changes apply to every project in Acme Inc."
        successTitle="Workspace settings saved"
        successDescription="Every project in Acme Inc. uses them from the next deploy."
      >
        <WorkspaceFields />
      </SettingsSection>

      {/* Same columns as SettingsSection, so the zone lines up with the cards above. */}
      <section aria-labelledby="danger-zone-title" className="@container py-10">
        <div className="grid gap-6 @narrow:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @narrow:gap-12 @page:gap-16">
          <div className="grid content-start gap-2 @narrow:pt-1">
            <h2 id="danger-zone-title" className="text-h4 text-foreground">
              Danger zone
            </h2>
            <p className="max-w-prose text-sm text-copy">
              These actions affect every project in Acme Inc. Deleting the workspace can’t be undone.
            </p>
          </div>
          <DangerZone projectName={WORKSPACE_SLUG} title={null} actions={workspaceActions} />
        </div>
      </section>
    </div>
  )
}

function ProfileFields() {
  const id = React.useId()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = React.useState<string | null>(null)
  const [timeZone, setTimeZone] = React.useState("Europe/Berlin")

  // Release the previous preview whenever the photo changes or the form unmounts.
  React.useEffect(() => {
    if (!photo) return
    return () => URL.revokeObjectURL(photo)
  }, [photo])

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      toast.add({
        type: "error",
        title: "That file isn’t a PNG or JPG",
        description: "Choose a PNG or JPG image, at least 256 by 256 pixels.",
      })
      return
    }
    setPhoto(URL.createObjectURL(file))
  }

  return (
    <FieldGroup>
      <div className="flex flex-wrap items-center gap-5">
        <Avatar size="xl">
          {photo ? <AvatarImage src={photo} alt="" /> : null}
          <AvatarFallback tone={personTone("Maya Chen")}>MC</AvatarFallback>
        </Avatar>
        <div className="grid gap-3">
          <div className="grid gap-0.5">
            <p className="text-label text-foreground">Profile photo</p>
            <p className="text-caption text-muted-foreground">PNG or JPG, at least 256 by 256 pixels.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <UploadIcon data-icon="inline-start" />
              {photo ? "Replace photo" : "Upload photo"}
            </Button>
            {photo ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setPhoto(null)}>
                Remove
              </Button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            type="file"
            name="photo"
            accept="image/png,image/jpeg"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            onChange={handleFile}
          />
        </div>
      </div>

      <div className="grid gap-6 @min-[30rem]/field-group:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Full name</FieldLabel>
          <Input id={`${id}-name`} name="name" defaultValue="Maya Chen" autoComplete="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-username`}>Username</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            {/* pl-0 so the prefix and the value read as one word: @maya. */}
            <InputGroupInput
              className="pl-0!"
              id={`${id}-username`}
              name="username"
              defaultValue="maya"
              autoComplete="username"
              spellCheck={false}
              autoCapitalize="none"
              required
            />
          </InputGroup>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          defaultValue="maya@acme.dev"
          autoComplete="email"
          aria-describedby={`${id}-email-hint`}
          required
        />
        <FieldDescription id={`${id}-email-hint`}>
          Deploy alerts and receipts go here. If you change it, we send a confirmation link to the new address.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-tz`}>Time zone</FieldLabel>
        <Select
          id={`${id}-tz`}
          name="timeZone"
          items={TIME_ZONES}
          value={timeZone}
          onValueChange={(value) => value && setTimeZone(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_ZONES.map((zone) => (
              <SelectItem key={zone.value} value={zone.value}>
                {zone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Used for log timestamps and the Monday summary email.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

function WorkspaceFields() {
  const id = React.useId()
  const [region, setRegion] = React.useState("fra1")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>Workspace name</FieldLabel>
        <Input id={`${id}-name`} name="workspaceName" defaultValue="Acme Inc." autoComplete="organization" required />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-url`}>Workspace URL</FieldLabel>
        <WorkspaceUrlInput
          id={`${id}-url`}
          name="workspaceSlug"
          defaultValue={WORKSPACE_SLUG}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          title="Use lowercase letters and numbers, with single hyphens between words."
          aria-describedby={`${id}-url-hint`}
          required
        />
        <FieldDescription id={`${id}-url-hint`}>
          Changing the URL breaks bookmarked links. Old links redirect for 30 days.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-region`}>Default region</FieldLabel>
        <Select
          id={`${id}-region`}
          name="region"
          items={REGIONS}
          value={region}
          onValueChange={(value) => value && setRegion(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>New projects deploy here unless you pick another region.</FieldDescription>
      </Field>

      <SwitchRow
        label="Preview deployments"
        name="previews"
        description="Build every pull request on its own URL and post the link as a GitHub comment."
        defaultChecked
        className="border-t pt-6"
      />
    </FieldGroup>
  )
}
