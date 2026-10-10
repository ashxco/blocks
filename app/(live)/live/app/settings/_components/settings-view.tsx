"use client"

import * as React from "react"

import { PageHeader } from "@/components/blocks/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GeneralSettings } from "./general-settings"
import { NotificationSettings } from "./notification-settings"
import { SecuritySettings } from "./security-settings"
import { SETTINGS_TABS, toSettingsTab, type SettingsTab } from "./settings-tabs"

/**
 * Settings: one page header whose tabs switch between General, Notifications
 * and Security. The active tab is mirrored in ?tab= so it survives a reload
 * and can be linked to. Panels stay mounted, so unsaved edits survive a
 * switch between tabs.
 */
export function SettingsView({ defaultTab = "general" }: { defaultTab?: SettingsTab }) {
  const [tab, setTab] = React.useState<SettingsTab>(defaultTab)

  function handleTabChange(value: unknown) {
    const next = toSettingsTab(value)
    if (!next) return
    setTab(next)
    const url = new URL(window.location.href)
    if (next === "general") url.searchParams.delete("tab")
    else url.searchParams.set("tab", next)
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="gap-0">
      <PageHeader
        title="Settings"
        description="Your profile, the Acme Inc. workspace, the notifications Acme sends you and how you sign in."
        divider={false}
      >
        <TabsList aria-label="Settings sections">
          {SETTINGS_TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </PageHeader>

      <TabsContent value="general" keepMounted>
        <GeneralSettings />
      </TabsContent>
      <TabsContent value="notifications" keepMounted>
        <NotificationSettings />
      </TabsContent>
      <TabsContent value="security" keepMounted>
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  )
}
