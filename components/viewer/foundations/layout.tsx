/**
 * Layout pieces shared by the Foundations pages. Server-safe.
 *
 * Classes are joined with `cx` rather than `cn`: the class merger treats
 * Blocks type roles (text-h2, text-caption…) as colours and would drop them
 * when a text colour sits in the same call.
 */
import * as React from "react"

import { DocHeader } from "@/components/viewer/doc-header"

import { lightColor } from "./data"

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

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

/** A titled section. Heading on the left, supporting copy on the right on wide screens. */
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
      className={cx("grid min-w-0 scroll-mt-24 gap-10 border-t pt-10", className)}
    >
      <header className="grid gap-4 @narrow:grid-cols-2 @narrow:items-end @narrow:gap-10">
        <h2 id={headingId} className="text-h2">
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

export function SubHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-h4">
      {children}
    </h3>
  )
}

/** Inline code-ish label for utilities and variables. */
export function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cx("font-mono text-code text-foreground", className)}>{children}</code>
}

/** Meta text in mono, for values such as 16px or oklch numbers. */
export function Meta({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cx("font-mono text-xs text-muted-foreground tabular", className)}>{children}</span>
}

/** Children resolve semantic colours to their dark values, whatever theme the page is in. */
export function DarkScope({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={cx("dark", className)} style={style}>
      {children}
    </div>
  )
}

/**
 * One theme's swatch of a semantic colour. Translucent colours are painted
 * over the theme's canvas (or the panel, for panel roles) so the swatch shows
 * what people actually see. The dark swatch resolves the live CSS variable
 * inside a .dark scope; the light swatch uses the light primitive directly.
 */
export function ThemeSwatch({
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
  if (theme === "light") {
    return (
      <div className={className} style={{ backgroundColor: lightColor(`--${base}`) }}>
        <div className="size-full" style={{ backgroundColor: lightColor(cssVar) }} />
      </div>
    )
  }
  return (
    <DarkScope className={cx(base === "panel" ? "bg-panel" : "bg-background", className)}>
      <div className="size-full" style={{ backgroundColor: `var(${cssVar})` }} />
    </DarkScope>
  )
}
