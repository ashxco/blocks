import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { navSections, slugify } from "@/components/viewer/nav"

interface DocHeaderProps {
  /** Section the page belongs to, e.g. "Components" or "Foundations". */
  section: string
  /** Group inside the section, e.g. "Forms". */
  group?: string
  title: string
  description: string
}

const sectionLinks: Record<string, string> = Object.fromEntries(
  navSections.map((s) => [s.title, s.href])
)

/**
 * Header for every viewer page: a quiet breadcrumb, a bold title in full ink,
 * then the description as a lead paragraph. Section indexes have no
 * breadcrumb (it would only repeat the title); on phones the trail collapses
 * to a link back to the parent. The viewer may restyle it but must keep
 * these props.
 */
export function DocHeader({
  section,
  group,
  title,
  description,
}: DocHeaderProps) {
  const sectionHref = sectionLinks[section]
  const isSectionIndex = section === title && !group
  const crumbs: { label: string; href: string }[] = [
    { label: "Blocks", href: "/" },
    ...(sectionHref ? [{ label: section, href: sectionHref }] : []),
    ...(group && sectionHref
      ? [{ label: group, href: `${sectionHref}#${slugify(group)}` }]
      : []),
  ]
  const parent = crumbs[crumbs.length - 1]

  return (
    // One column that never grows past the page.
    <header
      data-slot="doc-header"
      className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b pb-10 sm:pb-12"
    >
      <div className="grid gap-3">
        {isSectionIndex ? null : (
          <Breadcrumb aria-label="Breadcrumb">
            {/* Phones: only the way back up. */}
            <BreadcrumbList className="sm:hidden">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={parent.href} />}>
                  <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
                  {parent.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
            {/* Larger screens: the full trail, on one line. */}
            <BreadcrumbList className="hidden flex-nowrap whitespace-nowrap sm:flex">
              {crumbs.map((crumb) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="block truncate">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="max-w-narrow text-h1">{title}</h1>
      </div>
      <p className="max-w-prose text-lead text-copy">{description}</p>
    </header>
  )
}
