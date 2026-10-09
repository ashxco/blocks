"use client"

import {
  BookOpenIcon,
  DatabaseIcon,
  GaugeIcon,
  GlobeIcon,
  LayoutTemplateIcon,
  ShoppingBagIcon,
  TerminalIcon,
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

const screens = [
  { title: "Preview every pull request", body: "Each push gets its own URL, posted to the pull request.", tint: "bg-tint-violet" },
  { title: "Roll back in one click", body: "Every deploy is immutable. Promote any earlier one to production.", tint: "bg-tint-sky" },
  { title: "Logs that follow the request", body: "Trace a request from the edge to your database in one view.", tint: "bg-tint-mint" },
  { title: "Domains with certificates", body: "Add a domain and Lumen issues and renews the certificate.", tint: "bg-tint-sand" },
]

const templates = [
  { name: "Next.js commerce", stack: "Next.js, Postgres", icon: ShoppingBagIcon, tint: "bg-tint-violet" },
  { name: "Astro docs", stack: "Astro, MDX", icon: BookOpenIcon, tint: "bg-tint-sky" },
  { name: "Remix SaaS starter", stack: "Remix, Redis, Postgres", icon: LayoutTemplateIcon, tint: "bg-tint-mint" },
  { name: "Go API", stack: "Go, Postgres", icon: TerminalIcon, tint: "bg-tint-sand" },
  { name: "Edge status page", stack: "Hono, KV", icon: GaugeIcon, tint: "bg-tint-rose" },
  { name: "Static marketing site", stack: "HTML, Tailwind", icon: GlobeIcon, tint: "bg-tint-sky" },
]

const shipped = [
  { title: "Postgres branching", body: "Every preview deploy gets its own copy of your database, seeded from production and deleted when the branch merges.", icon: DatabaseIcon },
  { title: "Build cache across branches", body: "Branches now share build output with main, so the first preview build is as fast as the tenth.", icon: GaugeIcon },
  { title: "Regions in São Paulo and Mumbai", body: "Run functions closer to people in South America and India. Pick regions per project in Settings.", icon: GlobeIcon },
]

export default function CarouselDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="One slide at a time. The pill controls hang outside the slides, so leave room on both sides. Arrow keys move between slides when the carousel has focus."
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
          <Carousel aria-label="Lumen features">
            <CarouselContent>
              {screens.map((screen) => (
                <CarouselItem key={screen.title}>
                  <AspectRatio ratio={4 / 3} className={`rounded-(--card-radius) ${screen.tint}`}>
                    <div className="absolute inset-0 flex flex-col justify-end gap-2 p-6">
                      <p className="text-h4 text-foreground">{screen.title}</p>
                      <p className="text-sm text-copy">{screen.body}</p>
                    </div>
                  </AspectRatio>
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
              <p className="text-sm text-copy">Clone a working project and deploy it in under a minute.</p>
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
                    <p className="text-caption text-muted-foreground">{t.stack}</p>
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
        <Carousel aria-label="Shipped this month" className="mx-auto grid w-full max-w-2xl gap-8 py-4">
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
