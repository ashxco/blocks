/**
 * Layout pieces shared by the Foundations pages. Server-safe.
 */
import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { DocHeader } from "@/components/viewer/doc-header"

/** Page frame: doc header, then sections with generous rhythm. */
export function FoundationPage({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <article className="@container grid min-w-0 gap-section-sm [&>header+[data-slot=foundation-section]]:border-t-0 [&>header+[data-slot=foundation-section]]:pt-0">
      <DocHeader section="Foundations" title={title} description={description} />
      {children}
    </article>
  )
}

/**
 * A titled section. Heading on the left, supporting copy on the right on wide
 * screens; both columns share a top edge.
 */
export function Section({
  id,
  title,
  description,
  actions,
  children,
  className,
}: {
  id?: string
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <section
      id={id}
      data-slot="foundation-section"
      aria-labelledby={headingId}
      className={cn("grid min-w-0 scroll-mt-24 gap-10 border-t pt-10", className)}
    >
      <header className="grid gap-4 @narrow:grid-cols-2 @narrow:items-start @narrow:gap-10">
        <h2 id={headingId} className="text-h2 text-foreground">
          {title}
        </h2>
        {description || actions ? (
          <div className="grid gap-5 @narrow:justify-items-start">
            {description ? <p className="max-w-prose text-body text-copy">{description}</p> : null}
            {actions}
          </div>
        ) : null}
      </header>
      {children}
    </section>
  )
}

/**
 * Heading for a group inside a section ("Status", "Widths"). One full step
 * above the text-title item titles under it, so groups stay distinct on long
 * pages.
 */
export function SubHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-h3 text-foreground">
      {children}
    </h3>
  )
}

/**
 * Do and don't lists for a Principles section. The section heading names
 * them, so unlike the docs kit's Guidelines there is no extra heading.
 */
export function DoDont({ do: dos, dont }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-x-10 gap-y-12 @narrow:grid-cols-2">
      <RuleList tone="do" title="Do" items={dos} />
      <RuleList tone="dont" title="Don’t" items={dont} />
    </div>
  )
}

function RuleList({ tone, title, items }: { tone: "do" | "dont"; title: string; items: string[] }) {
  const Icon = tone === "do" ? CheckIcon : XIcon
  const color = tone === "do" ? "text-success" : "text-destructive"
  return (
    /* An ink rule over both lists; only the small marks carry the status colour. */
    <div className="grid content-start border-t-(length:--border-width-strong) border-foreground pt-5">
      <h3 className="flex items-center gap-2.5 text-title text-foreground">
        <span
          className={cn(
            "grid size-6 place-items-center rounded-full",
            tone === "do" ? "bg-success-subtle" : "bg-destructive-subtle",
            color
          )}
        >
          <Icon aria-hidden className="size-3.5" strokeWidth={2.75} />
        </span>
        {title}
      </h3>
      <ul className="mt-3 grid divide-y">
        {items.map((item) => (
          <li key={item} className="flex gap-3 py-4 text-body text-copy last:pb-0">
            <Icon aria-hidden className={cn("mt-1.5 size-3.5 shrink-0", color)} strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Inline code-ish label for utilities and variables. */
export function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn("font-mono text-code text-foreground", className)}>{children}</code>
}

/**
 * A " · "-separated list of utilities or variables. Wraps between entries
 * only, never inside one.
 */
export function CodeList({ value, className }: { value: string; className?: string }) {
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-0.5">
      {value.split(" · ").map((item) => (
        <code key={item} className={cn("font-mono text-code whitespace-nowrap", className)}>
          {item}
        </code>
      ))}
    </span>
  )
}

/** Meta text in mono, for values such as 16px or oklch numbers. */
export function Meta({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs text-muted-foreground tabular", className)}>{children}</span>
}

/**
 * A small chip of a semantic colour as one theme resolves it. The hairline
 * comes from the page's own theme, so the chip stays visible whatever its
 * value: a dark value on a dark page, a white value on a white page.
 */
export function ScopedChip({
  cssVar,
  theme,
  base = "background",
  className,
}: {
  cssVar: string
  theme: "light" | "dark"
  base?: "background" | "panel"
  className?: string
}) {
  return (
    <span aria-hidden className={cn("block size-5 shrink-0 overflow-hidden rounded-xs border border-border-strong", className)}>
      <span className={cn(theme, "block size-full", base === "panel" ? "bg-panel" : "bg-background")}>
        <span className="block size-full" style={{ backgroundColor: `var(${cssVar})` }} />
      </span>
    </span>
  )
}
