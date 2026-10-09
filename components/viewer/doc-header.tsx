import * as React from "react"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { slugify } from "@/components/viewer/nav"

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

const sectionLinks: Record<string, string> = {
  Foundations: "/foundations",
  Components: "/components",
  Molecules: "/molecules",
  Templates: "/templates",
}

/**
 * Header for every viewer page: a bold title in full ink, the description as
 * a lead paragraph, then a quiet breadcrumb trail underneath. Nothing sits
 * above the title. The viewer may restyle it but must keep these props.
 */
export function DocHeader({ section, group, title, description, children }: DocHeaderProps) {
  const sectionHref = sectionLinks[section]
  const isSectionIndex = section === title && !group
  const crumbs: { label: string; href?: string }[] = [
    { label: "Blocks", href: "/" },
    ...(isSectionIndex ? [] : [{ label: section, href: sectionHref }]),
    ...(group ? [{ label: group, href: sectionHref ? `${sectionHref}#${slugify(group)}` : undefined }] : []),
  ]

  return (
    <header data-slot="doc-header" className="grid gap-6 border-b pb-10 sm:pb-12">
      <h1 className="max-w-narrow text-h1">{title}</h1>
      <p className="max-w-prose text-lead text-copy">{description}</p>
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
      <nav aria-label="Breadcrumb" className="pt-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-caption font-medium text-muted-foreground">
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRightIcon aria-hidden="true" className="size-3.5 text-border-strong" /> : null}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="rounded-xs outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          ))}
          <li className="flex items-center gap-1.5" aria-current="page">
            <ChevronRightIcon aria-hidden="true" className="size-3.5 text-border-strong" />
            <span className="text-foreground">{title}</span>
          </li>
        </ol>
      </nav>
    </header>
  )
}
