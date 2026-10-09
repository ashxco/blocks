import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/components/blocks/data-table/data"

const tones: Record<
  ProjectStatus,
  {
    label: string
    variant: "success" | "warning" | "destructive" | "secondary"
    pulse?: boolean
  }
> = {
  ready: { label: "Ready", variant: "success" },
  building: { label: "Building", variant: "warning", pulse: true },
  failed: { label: "Failed", variant: "destructive" },
  paused: { label: "Paused", variant: "secondary" },
}

/** Deployment status as a soft badge with a dot. Colour always comes with a label. */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  const tone = tones[status]
  return (
    <Badge variant={tone.variant} data-status={status} className={className}>
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full bg-current",
          tone.pulse && "animate-pulse"
        )}
      />
      {tone.label}
    </Badge>
  )
}
