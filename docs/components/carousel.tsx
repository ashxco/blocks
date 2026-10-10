"use client"

import {
  BellIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChartGanttIcon,
  FileTextIcon,
  KanbanIcon,
  ListIcon,
  UserPlusIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const screens = [
  { kind: "views", title: "One project, four views", body: "Switch the same work between list, board, timeline and calendar.", tint: "bg-tint-violet" },
  { kind: "docs", title: "Docs next to the work", body: "Keep specs and meeting notes beside the tasks they describe.", tint: "bg-tint-sky" },
  { kind: "automation", title: "Automate the busywork", body: "When a task moves to Done, Acme tells the owner for you.", tint: "bg-tint-mint" },
  { kind: "reports", title: "Reports that keep up", body: "Workload, on-time delivery and cycle time, always up to date.", tint: "bg-tint-sand" },
] as const

const viewTabs = [
  { icon: ListIcon, active: false },
  { icon: KanbanIcon, active: true },
  { icon: ChartGanttIcon, active: false },
  { icon: CalendarDaysIcon, active: false },
]

/* Report bars, oldest first; the latest is in ink. */
const reportBars = [42, 55, 48, 62, 58, 71, 66, 80, 74, 88]

/**
 * A miniature of the Acme screen each slide describes, drawn with flat ink
 * shapes and hairlines in a window that runs off the bottom of the frame:
 * a board under its four view tabs, a doc beside its tasks, an automation
 * rule, or report bars.
 */
function ScreenPreview({ kind }: { kind: (typeof screens)[number]["kind"] }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-3 top-3 bottom-0 flex flex-col overflow-hidden rounded-t-md border border-b-0 border-foreground/10 bg-card @xs:inset-x-5 @xs:top-5"
    >
      <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
        <span className="h-1.5 w-14 rounded-full bg-foreground" />
        {kind === "views" ? (
          <span className="flex gap-0.5">
            {viewTabs.map((tab, i) => (
              <span
                key={i}
                className={cn(
                  "grid size-5 place-items-center rounded-xs",
                  tab.active ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                <tab.icon className="size-3" />
              </span>
            ))}
          </span>
        ) : (
          <span className="h-1.5 w-8 rounded-full bg-foreground/20" />
        )}
      </div>

      {kind === "views" ? (
        <div className="grid flex-1 grid-cols-3 gap-2 p-3">
          {[3, 2, 1].map((cards, column) => (
            <span key={column} className="grid content-start gap-1.5">
              <span className="h-1 w-1/2 rounded-full bg-foreground/40" />
              {Array.from({ length: cards }, (_, i) => (
                <span key={i} className="grid gap-1 rounded-xs border border-border p-1.5">
                  <span className="h-1 w-5/6 rounded-full bg-foreground" />
                  <span className="h-1 w-1/2 rounded-full bg-foreground/25" />
                </span>
              ))}
            </span>
          ))}
        </div>
      ) : null}

      {kind === "docs" ? (
        <div className="grid flex-1 grid-cols-[3fr_2fr]">
          <span className="grid content-start gap-1.5 p-3">
            <span className="mb-1 h-2 w-3/4 rounded-full bg-foreground" />
            {["w-full", "w-11/12", "w-full", "w-2/3"].map((width, i) => (
              <span key={i} className={cn("h-1 rounded-full bg-foreground/20", width)} />
            ))}
            <span className="mt-1.5 h-1.5 w-1/2 rounded-full bg-foreground/60" />
            {["w-full", "w-5/6"].map((width, i) => (
              <span key={i} className={cn("h-1 rounded-full bg-foreground/20", width)} />
            ))}
          </span>
          <span className="grid content-start gap-2 border-l border-border p-3">
            <span className="h-1 w-1/2 rounded-full bg-foreground/40" />
            {[true, true, false, false].map((done, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    done ? "bg-foreground" : "border border-foreground/40"
                  )}
                />
                <span className={cn("h-1 flex-1 rounded-full", done ? "bg-foreground/25" : "bg-foreground")} />
              </span>
            ))}
          </span>
        </div>
      ) : null}

      {kind === "automation" ? (
        <div className="grid flex-1 content-start justify-items-start gap-1 p-2.5 text-xs @xs:gap-1.5 @xs:p-3">
          <span className="flex max-w-full items-center gap-2 rounded-sm border border-border px-2.5 py-1 @xs:py-1.5">
            <ZapIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 text-copy">
              <span className="font-semibold text-foreground">When</span> a task moves to Done
            </span>
          </span>
          <span className="ml-4 h-2 w-px bg-border-strong @xs:h-2.5" />
          <span className="flex max-w-full items-center gap-2 rounded-sm border border-border px-2.5 py-1 @xs:py-1.5">
            <BellIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 text-copy">
              <span className="font-semibold text-foreground">Then</span> notify the owner
            </span>
          </span>
          <span className="mt-1.5 hidden text-muted-foreground tabular-nums @xs:block">Ran 412 times this month</span>
        </div>
      ) : null}

      {kind === "reports" ? (
        <div className="flex flex-1 flex-col gap-3 p-3">
          <span className="flex items-baseline gap-2">
            <span className="font-heading text-sm font-extrabold text-foreground tabular-nums">1,284</span>
            <span className="h-1 w-10 rounded-full bg-foreground/25" />
          </span>
          <span className="flex min-h-0 flex-1 items-end gap-1.5 border-b border-border">
            {reportBars.map((height, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-t-xs",
                  i === reportBars.length - 1 ? "bg-foreground" : "bg-foreground/25"
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  )
}

const templates = [
  { name: "Product roadmap", view: "Timeline · 24 tasks", icon: ChartGanttIcon, tint: "bg-tint-violet" },
  { name: "Marketing calendar", view: "Calendar · 18 tasks", icon: CalendarDaysIcon, tint: "bg-tint-sky" },
  { name: "Client projects", view: "Board · 30 tasks", icon: BriefcaseIcon, tint: "bg-tint-mint" },
  { name: "Sprint planning", view: "Board · 16 tasks", icon: KanbanIcon, tint: "bg-tint-sand" },
  { name: "Meeting notes", view: "Docs · 6 pages", icon: FileTextIcon, tint: "bg-tint-rose" },
  { name: "Employee onboarding", view: "List · 32 tasks", icon: UserPlusIcon, tint: "bg-tint-sky" },
]

const shipped = [
  { title: "Automations 2.0", body: "Rules can now run up to ten steps, check a condition before they act and post to Slack. A run history shows what each one changed.", icon: ZapIcon },
  { title: "Timeline view", body: "Plan a project on a timeline, drag tasks to new dates and see which tasks wait on others.", icon: ChartGanttIcon },
  { title: "Guest access", body: "Invite clients and contractors to the projects they work on. Guests see nothing else in your workspace.", icon: UsersIcon },
]

export default function CarouselDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="One slide at a time. The controls hang outside the slides, so leave room on both sides. Arrow keys move between slides when the carousel has focus."
        code={`<Carousel className="w-full max-w-md">
  <CarouselContent>
    {screens.map((screen) => (
      <CarouselItem key={screen.title}>…</CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots className="mt-4" />
</Carousel>`}
      >
        <div className="w-full max-w-md px-12">
          <Carousel aria-label="Acme features">
            <CarouselContent>
              {screens.map((screen) => (
                <CarouselItem key={screen.title}>
                  {/* A taller frame on narrow slides, so the preview keeps room to read. */}
                  <div className={cn("@container flex h-full flex-col overflow-hidden rounded-(--card-radius)", screen.tint)}>
                    <AspectRatio ratio={16 / 9} className="aspect-4/3 border-b border-foreground/10 @xs:aspect-(--ratio)">
                      <ScreenPreview kind={screen.kind} />
                    </AspectRatio>
                    <div className="grid content-start gap-2 p-6">
                      <p className="text-h4 text-foreground">{screen.title}</p>
                      <p className="text-sm text-copy">{screen.body}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots className="mt-4" />
          </Carousel>
        </div>
      </Example>

      <Example
        title="Controls in a header"
        layout="stack"
        description={`Several slides per view, with the controls beside the section title. Size the slides so the next one peeks in at the edge, which shows there is more. Pass className="static" to take the controls out of their default position.`}
        code={`<Carousel opts={{ align: "start" }}>
  <div className="flex items-end justify-between">
    <h3 className="text-h4">Start from a template</h3>
    <div className="flex gap-2">
      <CarouselPrevious className="static" />
      <CarouselNext className="static" />
    </div>
  </div>
  <CarouselContent>
    {templates.map((t) => (
      <CarouselItem key={t.name} className="basis-[85%] @lg:basis-[45%] @3xl:basis-[30%]">…</CarouselItem>
    ))}
  </CarouselContent>
</Carousel>`}
      >
        <Carousel opts={{ align: "start" }} aria-label="Templates" className="grid gap-5">
          <div className="flex items-end justify-between gap-4">
            <div className="grid gap-1">
              <h3 className="text-h4">Start from a template</h3>
              <p className="text-sm text-copy">Copy a ready-made project, then invite your team to it.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className="static my-0" />
              <CarouselNext className="static my-0" />
            </div>
          </div>
          <CarouselContent>
            {templates.map((t) => (
              <CarouselItem key={t.name} className="basis-[85%] @lg:basis-[45%] @3xl:basis-[30%]">
                <a
                  href="#templates"
                  className="group/template grid gap-4 rounded-(--card-radius) border border-border bg-card p-3 outline-none transition-colors duration-(--duration-fast) ease-standard hover:border-border-strong focus-visible:focus-ring"
                >
                  <AspectRatio ratio={16 / 10} className={`grid place-items-center rounded-md ${t.tint}`}>
                    <t.icon aria-hidden="true" className="size-8 text-foreground" strokeWidth={1.75} />
                  </AspectRatio>
                  <div className="grid gap-0.5 px-1 pb-1">
                    <p className="text-title text-foreground">{t.name}</p>
                    <p className="text-caption text-muted-foreground">{t.view}</p>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        layout="stack"
        description={`On dark panels use the inverse button variants and tone="inverse" for the dots.`}
        code={`<CarouselPrevious variant="outline-inverse" className="static" />
<CarouselNext variant="outline-inverse" className="static" />
<CarouselDots tone="inverse" />`}
      >
        <Carousel aria-label="Recently shipped" className="mx-auto grid w-full max-w-2xl gap-8 py-4">
          <CarouselContent>
            {shipped.map((item) => (
              <CarouselItem key={item.title}>
                <div className="grid gap-5">
                  <span className="grid size-11 place-items-center rounded-full border border-panel-border bg-panel-raised">
                    <item.icon aria-hidden="true" className="size-5 text-panel-foreground" />
                  </span>
                  <p className="text-h2 text-panel-foreground">{item.title}</p>
                  <p className="max-w-prose text-lead text-panel-muted">{item.body}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-between gap-4">
            <CarouselDots tone="inverse" className="justify-start" />
            <div className="flex gap-2">
              <CarouselPrevious variant="outline-inverse" className="static my-0" />
              <CarouselNext variant="outline-inverse" className="static my-0" />
            </div>
          </div>
        </Carousel>
      </Example>

      <Guidelines
        do={[
          "Show part of the next slide when there are several per view, so people know there is more.",
          "Label the carousel with aria-label, such as “Templates”.",
          "Keep slides the same height and use the same layout in each one.",
        ]}
        dont={[
          "Don’t autoplay slides that hold text people need to read.",
          "Don’t hide important content in later slides; put the most useful first.",
          "Don’t use a carousel for fewer than three items; lay them out side by side instead.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "opts", type: "EmblaOptionsType", description: "Embla options, such as align, loop and slidesToScroll." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Scroll axis. Arrow keys follow it." },
          { prop: "plugins", type: "EmblaPluginType[]", description: "Embla plugins." },
          { prop: "setApi", type: "(api: CarouselApi) => void", description: "Receive the Embla API to drive the carousel from outside." },
          { prop: "className", type: "string", description: "CarouselItem: set basis-1/2, basis-1/3… for several slides per view." },
          { prop: "variant / size", type: "Button props", default: '"outline" / "icon-sm"', description: "CarouselPrevious and CarouselNext are Buttons. Use outline-inverse on panels." },
          { prop: "tone", type: '"default" | "inverse"', default: '"default"', description: "CarouselDots: inverse for dark panels." },
          { prop: "useCarousel()", type: "hook", description: "Read selectedIndex, snapCount, scrollTo, scrollPrev and scrollNext to build your own controls." },
        ]}
      />
    </Examples>
  )
}
