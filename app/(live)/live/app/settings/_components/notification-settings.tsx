"use client"

import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"

import { SettingsSection } from "@/components/blocks/settings-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/toast"

import { SwitchRow } from "./switch-row"

interface Preference {
  id: string
  label: string
  description: string
  on: boolean
}

const deploymentEvents: Preference[] = [
  {
    id: "build-failed",
    label: "Failed builds",
    description: "A build or deploy fails on a branch you pushed to.",
    on: true,
  },
  {
    id: "production",
    label: "Production deploys",
    description: "A new version goes live on a production domain.",
    on: true,
  },
  {
    id: "preview",
    label: "Preview ready",
    description: "A pull request preview finishes building. The alert includes its URL.",
    on: false,
  },
  {
    id: "rollback",
    label: "Rollbacks",
    description: "Someone rolls production back to an earlier deployment.",
    on: true,
  },
]

const workspaceEvents: Preference[] = [
  {
    id: "usage",
    label: "Usage alerts",
    description: "Build minutes, bandwidth or database storage reaches 50%, 80% or 100% of the Pro plan.",
    on: true,
  },
  {
    id: "domains",
    label: "Domains and certificates",
    description: "A DNS record stops resolving or a certificate fails to renew.",
    on: true,
  },
  {
    id: "members",
    label: "New members",
    description: "Someone accepts an invite to Acme Inc.",
    on: true,
  },
  {
    id: "summary",
    label: "Weekly summary",
    description: "Deploys, uptime and spend for the past 7 days, every Monday at 9:00.",
    on: true,
  },
]

const channels: Preference[] = [
  { id: "email", label: "Email", description: "Alerts go to maya@acme.dev.", on: true },
  {
    id: "slack",
    label: "Slack",
    description: "Lumen posts to #deploys in the Acme Slack workspace.",
    on: true,
  },
  {
    id: "browser",
    label: "Browser notifications",
    description: "Pop-up alerts in this browser while Lumen is open in a tab.",
    on: false,
  },
]

function announce(label: string, on: boolean) {
  toast.add({ title: `${label} turned ${on ? "on" : "off"}` })
}

/** Notifications tab: switches that save the moment they change. */
export function NotificationSettings() {
  const [delivery, setDelivery] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(channels.map((c) => [c.id, c.on]))
  )
  const silent = Object.values(delivery).every((on) => !on)

  return (
    <div className="divide-y">
      <SettingsSection
        title="Deployments"
        description="Choose which build and deploy events reach you. Changes save as you make them."
        hideFooter
      >
        <PreferenceList items={deploymentEvents} />
      </SettingsSection>

      <SettingsSection
        title="Workspace"
        description="Billing, domains and people in Acme Inc."
        hideFooter
      >
        <PreferenceList items={workspaceEvents} />
      </SettingsSection>

      <SettingsSection
        title="Delivery"
        description="Where Lumen sends the alerts you turned on above."
        hideFooter
      >
        <div className="grid gap-6">
          <div className="divide-y">
            {channels.map((channel) => (
              <SwitchRow
                key={channel.id}
                label={channel.label}
                description={channel.description}
                checked={delivery[channel.id]}
                onCheckedChange={(on) => {
                  setDelivery((current) => ({ ...current, [channel.id]: on }))
                  announce(channel.label, on)
                }}
              />
            ))}
          </div>
          {silent ? (
            <Alert variant="warning">
              <TriangleAlertIcon aria-hidden="true" />
              <AlertTitle>Every channel is off</AlertTitle>
              <AlertDescription>
                You won’t hear about failed builds or expiring certificates. They still appear in the notifications
                menu in the top bar.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      </SettingsSection>
    </div>
  )
}

function PreferenceList({ items }: { items: Preference[] }) {
  return (
    <div className="divide-y">
      {items.map((item) => (
        <SwitchRow
          key={item.id}
          label={item.label}
          description={item.description}
          defaultChecked={item.on}
          onCheckedChange={(on) => announce(item.label, on)}
        />
      ))}
    </div>
  )
}
