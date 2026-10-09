import { MonitorIcon, SmartphoneIcon, TabletIcon, type LucideIcon } from "lucide-react"

export type Device = "desktop" | "tablet" | "mobile"

/**
 * Preview widths shared by the example canvas and the template viewer. The
 * previews render at exactly these widths and scale down when the stage is
 * narrower, so a "Mobile" preview always lays out like a 390px phone.
 */
export const devices: Record<Device, { width: number; label: string; icon: LucideIcon }> = {
  desktop: { width: 1440, label: "Desktop", icon: MonitorIcon },
  tablet: { width: 834, label: "Tablet", icon: TabletIcon },
  mobile: { width: 390, label: "Mobile", icon: SmartphoneIcon },
}

export const deviceOrder: Device[] = ["desktop", "tablet", "mobile"]
