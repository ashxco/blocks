"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { WorkspaceUrlInput } from "@/components/blocks/onboarding-steps/workspace-url-input"

export interface SettingsSectionProps {
  /** Section title in the left column. */
  title?: React.ReactNode
  /** What the settings in this section control. */
  description?: React.ReactNode
  /** Controls rendered inside the card. Defaults to the Acme workspace settings. */
  children?: React.ReactNode
  /** Short note on the left of the card footer. */
  footerNote?: React.ReactNode
  /** Label of the save action. */
  saveLabel?: string
  /** Hide the card footer, for sections that save on change. */
  hideFooter?: boolean
  /** Called when people save. Without it, the section simulates a short request. */
  onSave?: () => void | Promise<void>
  /** Toast title after a successful save. Say what changed: "Profile saved". */
  successTitle?: string
  /** Optional toast line after a successful save: what happens next. */
  successDescription?: string
  /** Heading level of the title. */
  as?: "h2" | "h3"
  className?: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function SettingsSection({
  title = "General",
  description = "The workspace name and URL appear in the sidebar, in invites and in every link you share.",
  children,
  footerNote = "Changes apply to every project in this workspace.",
  saveLabel = "Save changes",
  hideFooter = false,
  onSave,
  successTitle = "Changes saved",
  successDescription,
  as: Heading = "h2",
  className,
}: SettingsSectionProps) {
  const id = React.useId()
  const [state, setState] = React.useState<"idle" | "saving" | "saved">("idle")

  React.useEffect(() => {
    if (state !== "saved") return
    const timer = setTimeout(() => setState("idle"), 2400)
    return () => clearTimeout(timer)
  }, [state])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === "saving") return
    setState("saving")
    try {
      await (onSave ? onSave() : wait(700))
      setState("saved")
      toast.add({ title: successTitle, description: successDescription })
    } catch {
      setState("idle")
      toast.add({ type: "error", title: "Couldn’t save changes", description: "Check your connection and try again." })
    }
  }

  return (
    <section
      data-slot="settings-section"
      aria-labelledby={`${id}-title`}
      className={cn("@container py-10", className)}
    >
      <div className="grid gap-6 @narrow:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @narrow:gap-12 @page:gap-16">
        <div className="grid content-start gap-2 @narrow:pt-1">
          <Heading id={`${id}-title`} className="text-h4 text-foreground">
            {title}
          </Heading>
          {description ? <p className="max-w-prose text-sm text-copy">{description}</p> : null}
        </div>

        <form onSubmit={handleSubmit} className="min-w-0">
          <Card>
            <CardContent>{children ?? <WorkspaceFields />}</CardContent>
            {hideFooter ? null : (
              <CardFooter className="flex-wrap justify-between gap-x-6 gap-y-3">
                <p className="text-sm text-muted-foreground">{footerNote}</p>
                <div className="ml-auto flex items-center gap-4">
                  <span
                    aria-live="polite"
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-semibold text-success transition-opacity duration-(--duration-base)",
                      state === "saved" ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {state === "saved" ? (
                      <>
                        <CheckIcon className="size-4" aria-hidden="true" />
                        Saved
                      </>
                    ) : null}
                  </span>
                  <Button type="submit" size="sm" disabled={state === "saving"}>
                    {state === "saving" ? <Spinner data-icon="inline-start" /> : null}
                    {state === "saving" ? "Saving" : saveLabel}
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </form>
      </div>
    </section>
  )
}

const PROJECT_VIEWS = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
  { value: "calendar", label: "Calendar" },
]

export interface WorkspaceFieldsProps {
  /** Workspace name on first render. */
  defaultName?: string
  /** Workspace URL slug on first render. */
  defaultSlug?: string
  /** View new projects open in: "list", "board", "timeline" or "calendar". */
  defaultView?: string
  /** Require the name and URL before the form saves. */
  required?: boolean
}

/**
 * Acme workspace settings: name, URL, the view new projects open in and
 * guest access. SettingsSection shows them when it has no children, and the
 * settings page uses them too, so the fields and their copy live in one place.
 */
export function WorkspaceFields({
  defaultName = "Acme Inc.",
  defaultSlug = "acme",
  defaultView = "board",
  required = false,
}: WorkspaceFieldsProps) {
  const id = React.useId()
  const [view, setView] = React.useState(defaultView)

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>Workspace name</FieldLabel>
        <Input
          id={`${id}-name`}
          name="workspaceName"
          defaultValue={defaultName}
          autoComplete="organization"
          required={required}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-url`}>Workspace URL</FieldLabel>
        <WorkspaceUrlInput
          id={`${id}-url`}
          name="workspaceSlug"
          defaultValue={defaultSlug}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          title="Use lowercase letters and numbers, with single hyphens between words."
          aria-describedby={`${id}-url-hint`}
          required={required}
        />
        <FieldDescription id={`${id}-url-hint`}>
          Changing the URL breaks links people have bookmarked. Old links redirect for 30 days.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-view`}>Default project view</FieldLabel>
        <Select
          id={`${id}-view`}
          name="defaultView"
          items={PROJECT_VIEWS}
          value={view}
          onValueChange={(value) => value && setView(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_VIEWS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>New projects open in this view. Anyone can switch views on a project.</FieldDescription>
      </Field>

      <Field orientation="horizontal" className="gap-6 border-t pt-6">
        <FieldContent>
          <FieldLabel htmlFor={`${id}-guests`}>Guest access</FieldLabel>
          <FieldDescription>
            Let members invite people outside the workspace to the projects they lead. Guests are free and see only
            those projects.
          </FieldDescription>
        </FieldContent>
        <Switch id={`${id}-guests`} name="guests" defaultChecked />
      </Field>
    </FieldGroup>
  )
}
