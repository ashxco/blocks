"use client"

import * as React from "react"
import { CheckIcon, MailIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { DEFAULT_TEMPLATES } from "@/components/blocks/onboarding-steps/types"

/** Product roadmap, the first template onboarding offers, with the same Now/Next/Later starter tasks. */
const TEMPLATE = DEFAULT_TEMPLATES[0]

/** Milliseconds between starter tasks landing on the board. */
const CARD_STEP = 400
/** The invite goes out once the board is full, and Jordan joins a beat later. */
const CARD_COUNT = TEMPLATE.sections.reduce((count, section) => count + section.tasks.length, 0)
const INVITE_AT = CARD_COUNT * CARD_STEP + 300
const JOINED_AT = INVITE_AT + 1100

/**
 * The sign-up side of the account screens on the dark panel: a new Product
 * roadmap project made from a template, its starter tasks landing in Now,
 * Next and Later, then an invite to Jordan Lee going out and Jordan joining.
 * Every card and row is laid out from the start, so the card never changes
 * height. Under reduced motion the finished state shows straight away. Panel
 * tokens only, so it reads the same in both themes.
 */
export function TemplatePreview({ className }: { className?: string }) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      const timer = setTimeout(() => setElapsed(JOINED_AT), 0)
      return () => clearTimeout(timer)
    }
    const marks = [
      ...Array.from({ length: CARD_COUNT }, (_, index) => (index + 1) * CARD_STEP),
      INVITE_AT,
      JOINED_AT,
    ]
    const timers = marks.map((at) => setTimeout(() => setElapsed((now) => Math.max(now, at)), at))
    return () => timers.forEach(clearTimeout)
  }, [])

  const shown = Math.min(CARD_COUNT, Math.floor(elapsed / CARD_STEP))
  const invited = elapsed >= INVITE_AT
  const joined = elapsed >= JOINED_AT
  let cardIndex = 0

  return (
    <div
      data-slot="template-preview"
      className={cn(
        "@container/preview overflow-hidden rounded-(--card-radius) border border-panel-border bg-panel-raised text-panel-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-panel-border px-5 py-4">
        <div className="grid min-w-0 gap-0.5">
          <p className="truncate text-label text-panel-foreground">{TEMPLATE.name}</p>
          <p className="truncate text-caption text-panel-muted">
            From a template · {TEMPLATE.tasks} starter tasks
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <span className="sr-only">{joined ? "Members: Maya Patel and Jordan Lee" : "Members: Maya Patel"}</span>
          <Initials>MP</Initials>
          <Initials
            className={cn(
              "transition-[opacity,scale] duration-(--duration-base) ease-out",
              joined ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}
          >
            JL
          </Initials>
        </div>
      </div>

      <div className="p-3">
        <ol aria-label="Starter tasks" className="grid grid-cols-3 gap-2 @min-[24rem]/preview:gap-3">
          {TEMPLATE.sections.map((section) => {
            const more = section.count - section.tasks.length
            return (
              <li key={section.name} className="grid min-w-0 content-start gap-2 rounded-(--control-radius) bg-panel p-2">
                <p className="flex items-center justify-between gap-2 px-1 text-caption">
                  <span className="truncate font-semibold text-panel-foreground">{section.name}</span>
                  <span className="text-panel-muted tabular">{section.count}</span>
                </p>
                <ul className="grid gap-2">
                  {section.tasks.map((task) => {
                    const visible = cardIndex++ < shown
                    return (
                      <li
                        key={task}
                        aria-hidden={visible ? undefined : true}
                        className={cn(
                          "rounded-xs border border-panel-border bg-panel-raised px-2.5 py-2 text-caption text-panel-foreground",
                          "transition-[opacity,translate] duration-(--duration-base) ease-out",
                          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                        )}
                      >
                        {task}
                      </li>
                    )
                  })}
                </ul>
                {/* The rest of the section's starter tasks, shown once its sample cards have landed. */}
                {more > 0 ? (
                  <p
                    aria-hidden={cardIndex <= shown ? undefined : true}
                    className={cn(
                      "px-1 text-caption text-panel-muted tabular transition-opacity duration-(--duration-base) ease-out",
                      cardIndex <= shown ? "opacity-100" : "opacity-0"
                    )}
                  >
                    +{more} more
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>

      <p aria-live="polite" className="sr-only">
        {joined ? `Jordan Lee joined ${TEMPLATE.name}` : invited ? "Invite sent to jordan@acme.com" : null}
      </p>
      <ul aria-label="Team" className="divide-y divide-panel-border border-t border-panel-border">
        <TeamRow
          visible={invited}
          icon={<MailIcon className="size-3 text-panel-brand" />}
          text="Invite sent to jordan@acme.com"
          meta="Member"
        />
        <TeamRow
          visible={joined}
          icon={<CheckIcon strokeWidth={3} className="size-3 text-panel" />}
          iconClassName="border-transparent bg-panel-success"
          text={`Jordan Lee joined ${TEMPLATE.name}`}
          meta="Just now"
        />
      </ul>
    </div>
  )
}

function Initials({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-6 place-items-center rounded-full border border-panel-border bg-panel text-xs font-bold text-panel-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

/** One step of bringing the team in. The text is always rendered, so the row keeps its height while hidden. */
function TeamRow({
  visible,
  icon,
  iconClassName,
  text,
  meta,
}: {
  visible: boolean
  icon: React.ReactNode
  iconClassName?: string
  text: string
  meta: string
}) {
  return (
    <li
      aria-hidden={visible ? undefined : true}
      className={cn(
        "flex items-center gap-3 px-5 py-3 transition-opacity duration-(--duration-base) ease-out",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <span
        aria-hidden="true"
        className={cn("grid size-4.5 shrink-0 place-items-center rounded-full border border-panel-border", iconClassName)}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-panel-foreground">{text}</span>
      <span className="hidden shrink-0 text-caption text-panel-muted @min-[20rem]/preview:inline">{meta}</span>
    </li>
  )
}
