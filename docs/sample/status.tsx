import { Badge } from "@/components/ui/badge"

/**
 * The badge variant for each project and task status in the docs examples.
 * The same status reads the same everywhere in Acme; Completed, Paused and
 * To do are neutral.
 */
export const statusVariant = {
  "On track": "success",
  "At risk": "warning",
  "Off track": "destructive",
  Completed: "secondary",
  Paused: "secondary",
  "To do": "secondary",
  "In progress": "info",
  Blocked: "destructive",
  Overdue: "destructive",
  Done: "success",
} as const

export type Status = keyof typeof statusVariant

/** A status badge with a leading dot, as in project and task lists. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant={statusVariant[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  )
}
