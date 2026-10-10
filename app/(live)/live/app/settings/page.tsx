import type { Metadata } from "next"

import { SettingsView } from "./_components/settings-view"
import { toSettingsTab } from "./_components/settings-tabs"

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your Acme profile, the Acme Inc. workspace, the notifications you get and how you sign in.",
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { tab } = await searchParams
  return <SettingsView defaultTab={toSettingsTab(tab) ?? "general"} />
}
