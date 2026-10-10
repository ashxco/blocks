"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"

import { DangerZone, type DangerAction } from "@/components/blocks/danger-zone"
import { personTone } from "@/components/blocks/members-list/people"
import { SettingsSection, WorkspaceFields } from "@/components/blocks/settings-section"
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

/** Where the Acme team works. */
const TIME_ZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time, San Francisco" },
  { value: "America/New_York", label: "Eastern Time, New York" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Lisbon", label: "Lisbon" },
  { value: "Asia/Kolkata", label: "India Standard Time, Bengaluru" },
  { value: "Asia/Tokyo", label: "Japan Standard Time, Tokyo" },
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
      "We email Hana Kim, a workspace admin, a link to accept. You stay the owner until Hana accepts. The link expires in 7 days.",
    confirmLabel: "Send transfer request",
    tone: "default",
    successMessage: "Transfer request sent to Hana Kim.",
  },
  {
    id: "pause",
    title: "Pause all automations",
    description:
      "Stop every automation rule in Acme Inc. Projects and tasks keep working; the rules wait until you resume them.",
    actionLabel: "Pause all",
    confirmTitle: "Pause automations across Acme Inc.?",
    confirmDescription:
      "No rule runs until you resume, so owners aren’t notified and tasks don’t move on their own. Nothing is deleted.",
    confirmLabel: "Pause automations",
    tone: "default",
    successMessage: "Automations paused across Acme Inc.",
  },
  {
    id: "delete",
    title: "Delete workspace",
    description:
      "Permanently delete Acme Inc. with its 26 projects and every task, doc and file in them. Members and guests lose access right away.",
    actionLabel: "Delete workspace",
    confirmTitle: "Delete Acme Inc.?",
    confirmDescription:
      "This deletes every project, task and doc in the workspace and cancels the Pro plan. You can’t undo this.",
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
        description="How teammates see you on tasks, comments and docs."
        footerNote="Your profile is visible to everyone in Acme Inc."
        saveLabel="Save profile"
        successTitle="Profile saved"
        successDescription="Teammates see your new details on tasks, comments and docs."
      >
        <ProfileFields />
      </SettingsSection>

      <SettingsSection
        title="Workspace"
        description="The workspace name and URL appear in the sidebar, in invites and in every link you share."
        footerNote="Changes apply to everyone in Acme Inc."
        successTitle="Workspace settings saved"
        successDescription="Everyone in Acme Inc. sees the changes the next time a page loads."
      >
        <WorkspaceFields defaultSlug={WORKSPACE_SLUG} required />
      </SettingsSection>

      {/* Same columns as SettingsSection, so the zone lines up with the cards above. */}
      <section aria-labelledby="danger-zone-title" className="@container py-10">
        <div className="grid gap-6 @narrow:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @narrow:gap-12 @page:gap-16">
          <div className="grid content-start gap-2 @narrow:pt-1">
            <h2 id="danger-zone-title" className="text-h4 text-foreground">
              Danger zone
            </h2>
            <p className="max-w-prose text-sm text-copy">
              These actions affect everyone in Acme Inc. Deleting the workspace can’t be undone.
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
  const [timeZone, setTimeZone] = React.useState("America/Los_Angeles")

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
          <AvatarFallback tone={personTone("Maya Patel")}>MP</AvatarFallback>
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
          <Input id={`${id}-name`} name="name" defaultValue="Maya Patel" autoComplete="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-username`}>Username</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            {/* A text prefix: the input group starts the value right after it, so it reads @maya. */}
            <InputGroupInput
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
          defaultValue="maya@acme.com"
          autoComplete="email"
          aria-describedby={`${id}-email-hint`}
          required
        />
        <FieldDescription id={`${id}-email-hint`}>
          Mentions, reminders and the weekly summary go here. If you change it, we send a confirmation link to the new
          address.
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
        <FieldDescription>Used for due dates, reminders and the Monday summary email.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
