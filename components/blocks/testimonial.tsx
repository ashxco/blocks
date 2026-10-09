import * as React from "react"
import { QuoteIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  /** Role and company, e.g. "CTO, Fernhill". */
  role: string
  /** Shown when there is no photo. */
  initials: string
  avatarSrc?: string
  /** Flat tint behind the initials. */
  tint?: "violet" | "mint" | "sand" | "sky" | "rose"
}

export interface TestimonialMetric {
  /** The headline number, e.g. "4×". */
  value: string
  /** What the number measures, e.g. "faster releases". */
  label: string
}

export interface TestimonialProps {
  /** The quote, without quotation marks: the quote icon marks it. */
  quote?: React.ReactNode
  author?: TestimonialAuthor
  /** The result the customer got. Pass null to hide it. */
  metric?: TestimonialMetric | null
  /** "subtle" sits on a tinted band with a hairline edge, "panel" on a dark panel, "plain" between hairlines. */
  tone?: "subtle" | "panel" | "plain"
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

const tintClass = {
  violet: "bg-tint-violet",
  mint: "bg-tint-mint",
  sand: "bg-tint-sand",
  sky: "bg-tint-sky",
  rose: "bg-tint-rose",
} as const

const tones = {
  subtle: {
    // The hairline keeps the frame visible in dark mode, where the tint sits close to the page.
    frame: "rounded-(--panel-radius) border bg-subtle p-(--panel-padding)",
    icon: "text-foreground",
    quote: "text-foreground",
    caption: "mt-10 border-t border-border pt-8 @narrow/quote:mt-14",
    name: "text-title text-foreground",
    role: "text-caption text-muted-foreground",
    value: "text-h1 text-foreground tabular",
    label: "max-w-28 text-label text-copy",
  },
  panel: {
    frame: "rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground",
    icon: "text-panel-foreground",
    quote: "text-panel-foreground",
    caption: "mt-10 border-t border-panel-border pt-8 @narrow/quote:mt-14",
    name: "text-title text-panel-foreground",
    role: "text-caption text-panel-muted",
    value: "text-h1 text-panel-foreground tabular",
    label: "max-w-28 text-label text-panel-muted",
  },
  plain: {
    // The frame's own hairlines hold the quote, so the caption needs no rule.
    frame: "border-y py-section-sm",
    icon: "text-foreground",
    quote: "text-foreground",
    caption: "mt-12 @narrow/quote:mt-16",
    name: "text-title text-foreground",
    role: "text-caption text-muted-foreground",
    value: "text-h1 text-foreground tabular",
    label: "max-w-28 text-label text-copy",
  },
} as const

const defaultAuthor: TestimonialAuthor = {
  name: "Hannah Okoye",
  role: "CTO, Fernhill",
  initials: "HO",
  tint: "mint",
}

/**
 * A large customer quote in bold upright type, with the person behind it and
 * the result they got as a headline number.
 */
export function Testimonial({
  quote = "We moved twelve services to Lumen in a week. Releases that took an afternoon now go out in four minutes, and nobody on the team has touched a server config since.",
  author = defaultAuthor,
  metric = { value: "4×", label: "faster releases" },
  tone = "subtle",
  contained = true,
  className,
}: TestimonialProps) {
  const t = tones[tone]
  return (
    <section data-slot="testimonial" data-tone={tone} className={cn(contained && "container-page py-section", className)}>
      <figure className={cn("@container/quote m-0", t.frame)}>
        <QuoteIcon aria-hidden="true" className={cn("size-8", t.icon)} strokeWidth={2.25} />
        <blockquote className="mt-8 @narrow/quote:mt-10">
          <p className={cn("max-w-narrow text-h3 @narrow/quote:text-4xl", t.quote)}>{quote}</p>
        </blockquote>
        <figcaption className={cn("flex flex-wrap items-center justify-between gap-x-10 gap-y-8", t.caption)}>
          <div className="flex items-center gap-4">
            <Avatar className="size-(--avatar-size-lg) after:hidden">
              {author.avatarSrc ? <AvatarImage src={author.avatarSrc} alt="" /> : null}
              <AvatarFallback className={cn("font-bold text-foreground", tintClass[author.tint ?? "violet"])}>
                {author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <span className={t.name}>{author.name}</span>
              <span className={t.role}>{author.role}</span>
            </div>
          </div>
          {metric ? (
            <p className="flex items-center gap-4">
              <span className={t.value}>{metric.value}</span>
              <span className={t.label}>{metric.label}</span>
            </p>
          ) : null}
        </figcaption>
      </figure>
    </section>
  )
}
