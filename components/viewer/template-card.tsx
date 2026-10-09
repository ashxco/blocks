import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScaledFrame } from "@/components/viewer/scaled-frame"
import type { TemplateEntry } from "@/lib/registry"

/**
 * A template in the gallery: a live, scaled-down render of the page in a
 * browser-like frame, then its title and description. The whole card is one
 * link (a stretched link over the frame, so the iframe stays outside it).
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
          placeholder={
            <span className="grid justify-items-center gap-1">
              <span className="text-title text-foreground">{template.title}</span>
              <span className="font-mono text-caption text-muted-foreground">{template.href}</span>
            </span>
          }
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h3 className="text-title">
            <Link
              href={`/templates/${template.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-(--card-radius) focus-visible:after:focus-ring"
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
