import { CodeWindow } from "@/components/blocks/code-window"
import { cn } from "@/lib/utils"

/**
 * Screenshot-style media for changelog entries. They sit inside the tinted
 * frame that ChangelogEntry draws, so each one pads itself away from the edge.
 */

const logLines = [
  "$ lumen logs --follow --status 5xx",
  "→ Streaming from 3 replicas in fra1, iad1 and gru1",
  "14:02:11  gru1  GET   /api/checkout   502  1.21s",
  "14:02:14  fra1  POST  /api/cart       500  84ms",
  "→ Deploy dpl_8f2k1c is live, following the new version",
  "✓ No 5xx responses in the last 60 seconds",
]

/* The same stream for a phone: shorter notes and no region or latency columns, so nothing runs off the edge. */
const compactLogLines = [
  "$ lumen logs -f --status 5xx",
  "→ Following 3 replicas",
  "14:02:11 GET  /api/checkout 502",
  "14:02:14 POST /api/cart     500",
  "→ dpl_8f2k1c is live",
  "✓ No 5xx in the last 60s",
]

/**
 * Live log stream, for the `lumen logs` release. Log lines are columns, so
 * they never wrap: in a narrow frame the window shows a shorter stream
 * instead of clipping the long one at the edge.
 */
export function LogsShot({ className }: { className?: string }) {
  return (
    <div className={cn("p-3 sm:p-10", className)}>
      <div className="@container/logs">
        <CodeWindow title="lumen logs" lines={compactLogLines} className="@min-[30rem]/logs:hidden" />
        <CodeWindow title="lumen logs" lines={logLines} className="hidden @min-[30rem]/logs:flex" />
      </div>
    </div>
  )
}

const alerts = [
  { label: "50% alert sent to owners", date: "Aug 9", dot: "bg-success" },
  { label: "80% alert sent to owners", date: "Aug 21", dot: "bg-warning" },
  { label: "At 100%, pause previews", date: "Production stays up", dot: "bg-foreground/25" },
]

/** Usage card with a spend cap, for the spend limits release. Decorative. */
export function SpendLimitShot({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid place-items-center p-5 sm:p-10", className)}>
      <div className="@container/usage grid w-full max-w-md gap-6 rounded-(--card-radius) border bg-background p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-title text-foreground">Usage this month</p>
          <p className="text-caption text-muted-foreground">Resets Sep 1</p>
        </div>

        <div className="grid gap-3">
          <p className="flex items-baseline gap-2">
            <span className="text-h3 tabular text-foreground">$182</span>
            <span className="text-label text-muted-foreground">of $250 cap</span>
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-[73%] rounded-full bg-foreground" />
          </div>
        </div>

        <ul className="grid gap-3 border-t pt-5">
          {alerts.map((alert) => (
            <li
              key={alert.label}
              className="grid gap-x-4 gap-y-0.5 text-sm @min-[22rem]/usage:grid-cols-[minmax(0,1fr)_auto] @min-[22rem]/usage:items-center"
            >
              <span className="flex min-w-0 items-center gap-2.5 text-foreground">
                <span className={cn("size-2 shrink-0 rounded-full", alert.dot)} />
                {alert.label}
              </span>
              {/* Under the label in a narrow card, aligned with its text. */}
              <span className="pl-4.5 text-muted-foreground @min-[22rem]/usage:pl-0 @min-[22rem]/usage:text-right">
                {alert.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
