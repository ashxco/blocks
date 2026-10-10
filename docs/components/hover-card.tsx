"use client"

import * as React from "react"
import { FolderIcon, MapPinIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

const linkClass =
  "rounded-xs font-semibold text-brand underline-offset-4 outline-none hover:underline focus-visible:focus-ring"

type Stage = HTMLDivElement | null

/**
 * A stage the example's card opens into, so the page shows the card itself.
 * It is open on load and stays open while people click elsewhere on the page;
 * hovering the trigger and leaving it closes it as usual. isolate keeps the
 * card's z-index inside the example, so it scrolls under the site header.
 */
function HoverCardStage({ className, children }: { className?: string; children: (container: Stage) => React.ReactNode }) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <div ref={setContainer} className={cn("relative isolate flex w-full items-start justify-center pt-2", className)}>
      {children(container)}
    </div>
  )
}

/**
 * Open on load, and kept open when people click elsewhere. It only opens once
 * the stage exists, so the card is placed inside the stage from its first frame.
 */
function usePinnedOpen(container: Stage) {
  const [open, setOpen] = React.useState(true)
  const onOpenChange = React.useCallback((next: boolean, details: { reason: string }) => {
    if (!next && (details.reason === "outside-press" || details.reason === "focus-out")) return
    setOpen(next)
  }, [])
  return { open: open && container !== null, onOpenChange }
}

/**
 * The pinned cards open below the trigger, from its start edge, and keep that
 * side as the page scrolls. Each sentence ends at its trigger, so the card
 * never covers the rest of it.
 */
function pinnedTo(container: Stage) {
  return { side: "bottom", align: "start", collisionAvoidance: { side: "none" }, collisionBoundary: container ?? undefined } as const
}

function ProfileCard({ container }: { container: Stage }) {
  const pinned = usePinnedOpen(container)
  return (
    <p className="max-w-96 text-center text-body text-copy">
      The launch announcement is assigned to{" "}
      <HoverCard {...pinned}>
        <HoverCardTrigger href="#priya" className={linkClass}>
          @priya
        </HoverCardTrigger>
        <HoverCardContent container={container} {...pinnedTo(container)}>
          <div className="flex gap-3">
            <Avatar size="lg">
              <AvatarFallback tone="sky">PR</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-title text-foreground">Priya Raman</p>
              <p className="text-sm text-copy">Marketing at Acme Inc. Runs launches, the blog and the newsletter.</p>
              <p className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
                <MapPinIcon aria-hidden="true" className="size-3.5" />
                London · 3:42 PM local time
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

function TaskCard({ container }: { container: Stage }) {
  const pinned = usePinnedOpen(container)
  return (
    <p className="max-w-96 text-center text-body text-copy">
      The launch email waits on{" "}
      <HoverCard {...pinned}>
        <HoverCardTrigger href="#fix-the-pricing-table" className={linkClass}>
          Fix the pricing table
        </HoverCardTrigger>
        <HoverCardContent container={container} {...pinnedTo(container)}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-title text-foreground">Fix the pricing table on mobile</p>
            <Badge variant="info">In progress</Badge>
          </div>
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <Avatar size="sm">
              <AvatarFallback tone="mint">JL</AvatarFallback>
            </Avatar>
            Jordan Lee · updated 2 hours ago
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t pt-3">
            <div className="grid gap-0.5">
              <dt className="text-caption text-muted-foreground">Due</dt>
              <dd className="text-sm font-semibold text-foreground tabular">Oct 15</dd>
            </div>
            <div className="grid gap-0.5">
              <dt className="text-caption text-muted-foreground">Subtasks</dt>
              <dd className="text-sm font-semibold text-foreground tabular">2 of 3 done</dd>
            </div>
          </dl>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

const projects = [
  { name: "Website relaunch", status: "On track", dot: "bg-success", note: "38 of 52 tasks done · due Nov 14" },
  { name: "Brand refresh", status: "On track", dot: "bg-success", note: "27 of 40 tasks done · due Nov 6" },
  { name: "Mobile app 2.0", status: "At risk", dot: "bg-warning", note: "2 tasks overdue · due Nov 20" },
]

/** Links in a list stay ink, so a column of them doesn’t turn the page violet. */
const listLinkClass =
  "rounded-xs font-semibold text-foreground underline decoration-border-strong underline-offset-4 outline-none hover:decoration-foreground focus-visible:focus-ring"

const subscribeToWidth = (onChange: () => void) => {
  const query = window.matchMedia("(min-width: 48rem)")
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** Beside the list on wide screens; below it on phones, where there is no room to the right. */
function useCardSide() {
  const wide = React.useSyncExternalStore(
    subscribeToWidth,
    () => window.matchMedia("(min-width: 48rem)").matches,
    () => true
  )
  return wide ? "right" : "bottom"
}

function ProjectList({ container }: { container: Stage }) {
  const pinned = usePinnedOpen(container)
  const side = useCardSide()
  const shown = projects[projects.length - 1].name

  return (
    <div className="grid w-full max-w-80 gap-3">
      <p className="font-mono text-code text-muted-foreground">delay 200 · closeDelay 150</p>
      <ul className="grid divide-y rounded-(--card-radius) border bg-card">
        {projects.map((item) => (
          <li key={item.name} className="flex items-center gap-2.5 px-4 py-3">
            <FolderIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            <HoverCard {...(item.name === shown ? pinned : undefined)}>
              <HoverCardTrigger
                href={`#${item.name.toLowerCase().replace(/\W+/g, "-")}`}
                delay={200}
                closeDelay={150}
                className={cn(listLinkClass, "flex-1")}
              >
                {item.name}
              </HoverCardTrigger>
              <HoverCardContent
                side={side}
                // Clear the list frame, not just the link: the row padding (16px beside, 12px below),
                // the 1px border, then the usual 8px gap.
                sideOffset={side === "right" ? 25 : 21}
                align="start"
                container={container}
                collisionAvoidance={{ side: "none", align: "none" }}
                collisionBoundary={container ?? undefined}
              >
                <p className="flex items-center gap-2 text-title text-foreground">
                  <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${item.dot}`} />
                  {item.name}
                </p>
                <p className="text-sm text-copy">
                  <span className="font-semibold text-foreground">{item.status}</span> · {item.note}
                </p>
              </HoverCardContent>
            </HoverCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HoverCardDocs() {
  return (
    <Examples>
      <Example
        title="Profile preview"
        description="Show who someone is without leaving the page. The trigger is a real link, so it still works on touch screens where hover doesn’t exist."
        code={`<HoverCard>
  <HoverCardTrigger href="/team/priya">@priya</HoverCardTrigger>
  <HoverCardContent>
    <div className="flex gap-3">
      <Avatar><AvatarFallback tone="sky">PR</AvatarFallback></Avatar>
      <div className="grid gap-1">
        <p className="text-title">Priya Raman</p>
        <p className="text-sm text-copy">Marketing at Acme Inc.</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`}
      >
        <HoverCardStage className="min-h-60">{(container) => <ProfileCard container={container} />}</HoverCardStage>
      </Example>

      <Example
        title="Task preview"
        description="Preview a linked object, such as a task or a doc, with its status and the one detail people check most."
      >
        <HoverCardStage className="min-h-64">{(container) => <TaskCard container={container} />}</HoverCardStage>
      </Example>

      <Example
        title="Timing and placement"
        description="Cards open after 600ms and close 300ms after the pointer leaves, so passing over a link doesn’t flash them. Shorten the delays for dense lists, and open beside the list so the card never covers the next row."
        code={`<HoverCardTrigger delay={200} closeDelay={150}>…</HoverCardTrigger>
<HoverCardContent side="right" align="start" sideOffset={25}>…</HoverCardContent>`}
      >
        <HoverCardStage className="min-h-80 justify-start @md:justify-center">
          {(container) => <ProjectList container={container} />}
        </HoverCardStage>
      </Example>

      <Guidelines
        do={[
          "Use a hover card to preview what a link points to: a person, a task, a project.",
          "Make the trigger a working link, so touch and keyboard users reach the same place.",
          "Keep the card to a title, one or two lines and a few key facts.",
        ]}
        dont={[
          "Don’t put buttons or the only path to an action in a hover card. Touch screens can’t hover.",
          "Don’t use it for a label on an icon. Use a tooltip.",
          "Don’t open it instantly. The delay stops cards flashing as the pointer passes.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "delay", type: "number", default: "600", description: "On HoverCardTrigger. Milliseconds before the card opens." },
          { prop: "closeDelay", type: "number", default: "300", description: "On HoverCardTrigger. Milliseconds before the card closes." },
          { prop: "href", type: "string", description: "On HoverCardTrigger, which renders a link. Where the trigger goes when clicked." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "On HoverCardContent. Preferred side of the trigger." },
          { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "On HoverCardContent. Alignment along that side." },
          { prop: "sideOffset", type: "number", default: "8", description: "On HoverCardContent. Gap from the trigger, in pixels." },
        ]}
      />
    </Examples>
  )
}
