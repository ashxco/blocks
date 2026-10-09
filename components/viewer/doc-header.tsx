import * as React from "react"

export interface DocHeaderProps {
  /** Section the page belongs to, e.g. "Components" or "Foundations". */
  section: string
  /** Group inside the section, e.g. "Forms". */
  group?: string
  title: string
  description: string
  /** Optional actions or meta shown under the description. */
  children?: React.ReactNode
}

/** Header for every viewer page. The viewer may restyle it but must keep these props. */
export function DocHeader({ section, group, title, description, children }: DocHeaderProps) {
  return (
    <header data-slot="doc-header" className="grid gap-4 border-b pb-10">
      <nav aria-label="Breadcrumb" className="text-caption text-muted-foreground">
        {section}
        {group ? <> / {group}</> : null}
      </nav>
      <h1 className="text-h1">{title}</h1>
      <p className="max-w-prose text-lead text-copy">{description}</p>
      {children}
    </header>
  )
}
