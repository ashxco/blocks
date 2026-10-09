/**
 * The settings tabs. Shared by the page (which reads ?tab= on the server) and
 * the client view, so a link such as /live/app/settings?tab=security opens
 * the right tab on first paint.
 */
export const SETTINGS_TABS = [
  { value: "general", label: "General" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]["value"]

export function toSettingsTab(value: unknown): SettingsTab | undefined {
  return SETTINGS_TABS.find((tab) => tab.value === value)?.value
}
