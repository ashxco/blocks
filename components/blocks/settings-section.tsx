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
  /** Controls rendered inside the card. Defaults to workspace settings for Lumen. */
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
  description = "Your workspace name and URL appear in the dashboard, in invites and on every preview link.",
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

const REGIONS = [
  { value: "fra1", label: "Frankfurt, Germany (fra1)" },
  { value: "iad1", label: "Washington, D.C., USA (iad1)" },
  { value: "sfo1", label: "San Francisco, USA (sfo1)" },
  { value: "gru1", label: "São Paulo, Brazil (gru1)" },
  { value: "sin1", label: "Singapore (sin1)" },
  { value: "syd1", label: "Sydney, Australia (syd1)" },
]

/** Default controls: Lumen workspace settings. */
function WorkspaceFields() {
  const id = React.useId()
  const [region, setRegion] = React.useState("fra1")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>Workspace name</FieldLabel>
        <Input id={`${id}-name`} name="workspaceName" defaultValue="Acme Inc." autoComplete="organization" />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-url`}>Workspace URL</FieldLabel>
        <WorkspaceUrlInput
          id={`${id}-url`}
          name="workspaceSlug"
          defaultValue="acme"
          aria-describedby={`${id}-url-hint`}
        />
        <FieldDescription id={`${id}-url-hint`}>
          Changing the URL breaks links people have bookmarked. Old links redirect for 30 days.
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

      <Field orientation="horizontal" className="border-t pt-5">
        <FieldContent>
          <FieldLabel htmlFor={`${id}-previews`}>Preview deployments</FieldLabel>
          <FieldDescription>Deploy every pull request to its own URL and comment the link on GitHub.</FieldDescription>
        </FieldContent>
        <Switch id={`${id}-previews`} name="previews" defaultChecked />
      </Field>
    </FieldGroup>
  )
}
