"use client"

import * as React from "react"
import { CalendarIcon, GitCommitHorizontalIcon, GlobeIcon } from "lucide-react"

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
      Deployment approved by{" "}
      <HoverCard {...pinned}>
        <HoverCardTrigger href="#priya" className={linkClass}>
          @priya
        </HoverCardTrigger>
        <HoverCardContent container={container} {...pinnedTo(container)}>
          <div className="flex gap-3">
            <Avatar size="lg">
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-title text-foreground">Priya Raman</p>
              <p className="text-sm text-copy">Platform engineer. Owns builds, caching and the edge network.</p>
              <p className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
                <CalendarIcon aria-hidden="true" className="size-3.5" />
                Joined March 2024
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

function CommitCard({ container }: { container: Stage }) {
  const pinned = usePinnedOpen(container)
  return (
    <p className="max-w-96 text-center text-body text-copy">
      Production is running main at{" "}
      <HoverCard {...pinned}>
        <HoverCardTrigger href="#8f2c1a9" className={`${linkClass} font-mono text-code`}>
          8f2c1a9
        </HoverCardTrigger>
        <HoverCardContent container={container} {...pinnedTo(container)}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-title text-foreground">Add usage-based billing page</p>
            <Badge variant="success">Ready</Badge>
          </div>
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <Avatar size="sm">
              <AvatarFallback>MO</AvatarFallback>
            </Avatar>
            Mateo Ortiz committed 2 hours ago
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t pt-3">
            <div className="grid gap-0.5">
              <dt className="text-caption text-muted-foreground">Files changed</dt>
              <dd className="text-sm font-semibold text-foreground tabular">14</dd>
            </div>
            <div className="grid gap-0.5">
              <dt className="text-caption text-muted-foreground">Build time</dt>
              <dd className="text-sm font-semibold text-foreground tabular">38s</dd>
            </div>
          </dl>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

const domains = [
  { domain: "lumen.app", note: "Production · SSL valid until 12 Jan" },
  { domain: "www.lumen.app", note: "Redirects to lumen.app" },
  { domain: "docs.lumen.app", note: "Preview · waiting for DNS" },
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

function DomainList({ container }: { container: Stage }) {
  const pinned = usePinnedOpen(container)
  const side = useCardSide()
  const shown = domains[domains.length - 1].domain

  return (
    <div className="grid w-full max-w-80 gap-3">
      <p className="font-mono text-code text-muted-foreground">delay 200 · closeDelay 150</p>
      <ul className="grid divide-y rounded-(--card-radius) border bg-card">
        {domains.map((item) => (
          <li key={item.domain} className="flex items-center gap-2.5 px-4 py-3">
            <GlobeIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            <HoverCard {...(item.domain === shown ? pinned : undefined)}>
              <HoverCardTrigger href={`#${item.domain}`} delay={200} closeDelay={150} className={listLinkClass}>
                {item.domain}
              </HoverCardTrigger>
              <HoverCardContent
                side={side}
                align="start"
                container={container}
                collisionAvoidance={{ side: "none", align: "none" }}
                collisionBoundary={container ?? undefined}
              >
                <p className="text-title text-foreground">{item.domain}</p>
                <p className="flex items-center gap-2 text-sm text-copy">
                  <GitCommitHorizontalIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {item.note}
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
      <Avatar><AvatarFallback>PR</AvatarFallback></Avatar>
      <div className="grid gap-1">
        <p className="text-title">Priya Raman</p>
        <p className="text-sm text-copy">Platform engineer at Lumen Labs.</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`}
      >
        <HoverCardStage className="min-h-48">{(container) => <ProfileCard container={container} />}</HoverCardStage>
      </Example>

      <Example
        title="Commit preview"
        description="Preview a linked object, such as a commit or a deployment, with its status and the one detail people check most."
      >
        <HoverCardStage className="min-h-64">{(container) => <CommitCard container={container} />}</HoverCardStage>
      </Example>

      <Example
        title="Timing and placement"
        description="Cards open after 600ms and close 300ms after the pointer leaves, so passing over a link doesn’t flash them. Shorten the delays for dense lists, and open beside the list so the card never covers the next row."
        code={`<HoverCardTrigger delay={200} closeDelay={150}>…</HoverCardTrigger>
<HoverCardContent side="right" align="start">…</HoverCardContent>`}
      >
        <HoverCardStage className="min-h-80 justify-start @md:justify-center">
          {(container) => <DomainList container={container} />}
        </HoverCardStage>
      </Example>

      <Guidelines
        do={[
          "Use a hover card to preview what a link points to: a person, a commit, a domain.",
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
