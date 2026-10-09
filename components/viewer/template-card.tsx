import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScaledFrame } from "@/components/viewer/scaled-frame"
import type { TemplateEntry } from "@/lib/registry"

/**
 * A template in the gallery: a live, scaled-down render of the page in a
 * browser-like frame, then its title and description. The whole card is one
 * link (a stretched link over the frame, so the iframe stays outside it).
 * Its focus ring sits a step outside the card, clear of the frame and text.
 * A featured card spans the row and shows more of the page.
 */
export function TemplateCard({ template, featured = false }: { template: TemplateEntry; featured?: boolean }) {
  return (
    <article className={cn("group/template relative grid content-start gap-4", featured && "sm:col-span-2")}>
      <div
        className={cn(
          "overflow-hidden rounded-(--card-radius) border bg-background",
          "transition-colors duration-(--duration-base) ease-standard group-hover/template:border-foreground"
        )}
      >
        <div className="flex h-8 items-center border-b px-3.5">
          <span className="truncate font-mono text-xs text-muted-foreground">{template.href}</span>
        </div>
        <ScaledFrame
          src={template.href}
          title={`${template.title} template`}
          className={cn("aspect-[8/5]", featured && "sm:aspect-[2/1]")}
          placeholder={<TemplateWireframe kind={template.kind} />}
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h3 className="text-title">
            <Link
              href={`/templates/${template.slug}`}
              className="outline-none after:absolute after:-inset-2 after:rounded-[calc(var(--card-radius)+0.5rem)] focus-visible:after:focus-ring"
            >
              {template.title}
            </Link>
          </h3>
          <p className="text-caption text-muted-foreground">{template.description}</p>
        </div>
        <ArrowRightIcon
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-(--duration-base) ease-out group-hover/template:translate-x-0.5 group-hover/template:text-foreground"
        />
      </div>
    </article>
  )
}

/*
 * A flat wireframe of the kind of page, shown while the live page loads, so a
 * gallery that is still loading reads as pages, not as empty tiles. Sizes are
 * in container width units, so it scales with the card like the page does.
 */
const bar = "rounded-full bg-muted"
const block = "rounded-[1cqw] border bg-background"

function TemplateWireframe({ kind }: { kind: TemplateEntry["kind"] }) {
  return (
    <div className="@container absolute inset-0 bg-background">
      {kind === "app" ? <AppWireframe /> : kind === "auth" ? <AuthWireframe /> : <MarketingWireframe />}
    </div>
  )
}

function MarketingWireframe() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[6cqw] shrink-0 items-center justify-between border-b px-[4cqw]">
        <span className={cn(bar, "h-[1.6cqw] w-[10cqw]")} />
        <span className="flex gap-[2.5cqw]">
          <span className={cn(bar, "h-[1cqw] w-[6cqw]")} />
          <span className={cn(bar, "h-[1cqw] w-[6cqw]")} />
          <span className={cn(bar, "h-[1cqw] w-[6cqw]")} />
        </span>
        <span className={cn(bar, "h-[2.6cqw] w-[9cqw]")} />
      </div>
      <div className="grid justify-items-center gap-[1.4cqw] px-[8cqw] pt-[7cqw]">
        <span className={cn(bar, "h-[4cqw] w-[58cqw]")} />
        <span className={cn(bar, "h-[4cqw] w-[40cqw]")} />
        <span className={cn(bar, "mt-[1.4cqw] h-[1.3cqw] w-[44cqw]")} />
        <span className="mt-[2cqw] flex gap-[1.5cqw]">
          <span className={cn(bar, "h-[3.4cqw] w-[13cqw]")} />
          <span className={cn(bar, "h-[3.4cqw] w-[13cqw]")} />
        </span>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-[2cqw] px-[4cqw] pb-[4cqw]">
        <span className={cn(block, "h-[11cqw] bg-subtle")} />
        <span className={cn(block, "h-[11cqw] bg-subtle")} />
        <span className={cn(block, "h-[11cqw] bg-subtle")} />
      </div>
    </div>
  )
}

function AuthWireframe() {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="grid content-center justify-items-start gap-[1.6cqw] px-[9cqw]">
        <span className={cn(bar, "h-[3cqw] w-[24cqw]")} />
        <span className={cn(bar, "mb-[1.4cqw] h-[1.2cqw] w-[30cqw]")} />
        <span className="h-[4cqw] w-full rounded-[0.8cqw] border bg-muted" />
        <span className="h-[4cqw] w-full rounded-[0.8cqw] border bg-muted" />
        <span className={cn(bar, "mt-[1cqw] h-[4cqw] w-full")} />
      </div>
      <div className="p-[2cqw]">
        <span className="block h-full rounded-[1.6cqw] bg-muted" />
      </div>
    </div>
  )
}

function AppWireframe() {
  return (
    <div className="grid h-full grid-cols-[18cqw_minmax(0,1fr)]">
      <div className="grid content-start gap-[2cqw] border-r bg-subtle px-[2.5cqw] py-[3cqw]">
        <span className={cn(bar, "mb-[1.5cqw] h-[1.8cqw] w-[11cqw]")} />
        {["w-[9cqw]", "w-[11cqw]", "w-[8cqw]", "w-[10cqw]", "w-[7cqw]"].map((width) => (
          <span key={width} className={cn(bar, "h-[1.1cqw]", width)} />
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex h-[6cqw] shrink-0 items-center justify-between border-b px-[3cqw]">
          <span className={cn(bar, "h-[1.2cqw] w-[16cqw]")} />
          <span className="size-[2.6cqw] rounded-full bg-muted" />
        </div>
        <div className="grid gap-[2cqw] p-[3cqw]">
          <span className={cn(bar, "h-[2.6cqw] w-[20cqw]")} />
          <div className="grid grid-cols-4 gap-[1.5cqw]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn(block, "h-[8cqw]")} />
            ))}
          </div>
          <span className={cn(block, "h-[19cqw]")} />
        </div>
      </div>
    </div>
  )
}
