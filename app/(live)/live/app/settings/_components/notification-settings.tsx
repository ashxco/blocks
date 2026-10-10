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

const taskEvents: Preference[] = [
  {
    id: "mentions",
    label: "Mentions",
    description: "Someone mentions you in a task, comment or doc.",
    on: true,
  },
  {
    id: "assigned",
    label: "Assigned to me",
    description: "Someone gives you a task or changes the due date of one.",
    on: true,
  },
  {
    id: "due",
    label: "Due date reminders",
    description: "One of your tasks is due tomorrow, or a day overdue.",
    on: true,
  },
  {
    id: "comments",
    label: "Comments on tasks I follow",
    description: "Someone comments on a task you created or follow.",
    on: false,
  },
]

const workspaceEvents: Preference[] = [
  {
    id: "status",
    label: "Project status changes",
    description: "A project you follow moves to at risk or off track.",
    on: true,
  },
  {
    id: "automations",
    label: "Automation failures",
    description: "A rule you created can’t run, for example because its project was archived.",
    on: true,
  },
  {
    id: "usage",
    label: "Usage alerts",
    description: "Automation runs or storage reach 80% or 100% of the Pro plan.",
    on: true,
  },
  {
    id: "summary",
    label: "Weekly summary",
    description: "Tasks completed, overdue work and project status, every Monday at 9:00.",
    on: true,
  },
]

const channels: Preference[] = [
  { id: "email", label: "Email", description: "Notifications go to maya@acme.com.", on: true },
  {
    id: "slack",
    label: "Slack",
    description: "Acme sends them to you as direct messages in your team’s Slack workspace.",
    on: true,
  },
  {
    id: "browser",
    label: "Browser notifications",
    description: "Pop-up alerts in this browser while Acme is open in a tab.",
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
        title="Tasks"
        description="Choose which task events reach you. Changes save as you make them."
        hideFooter
      >
        <PreferenceList items={taskEvents} />
      </SettingsSection>

      <SettingsSection
        title="Projects and workspace"
        description="Project status, automations and usage in Acme Inc."
        hideFooter
      >
        <PreferenceList items={workspaceEvents} />
      </SettingsSection>

      <SettingsSection
        title="Delivery"
        description="Where Acme sends the notifications you turned on above."
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
                You won’t hear about mentions or due dates. They still appear in the notifications menu in the top
                bar.
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
