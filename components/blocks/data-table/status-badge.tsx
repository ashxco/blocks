import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@/components/blocks/data-table/data"

const tones: Record<
  ProjectStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  "on-track": { label: "On track", variant: "success" },
  "at-risk": { label: "At risk", variant: "warning" },
  "off-track": { label: "Off track", variant: "destructive" },
  completed: { label: "Completed", variant: "secondary" },
  paused: { label: "Paused", variant: "secondary" },
}

/** Project status as a soft badge with a dot. Colour always comes with a label. */
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
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {tone.label}
    </Badge>
  )
}
