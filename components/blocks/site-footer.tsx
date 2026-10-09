import Link from "next/link"

import { NewsletterForm } from "@/components/blocks/newsletter-form"
import { Wordmark } from "@/components/blocks/site-header/wordmark"
import { cn } from "@/lib/utils"

export interface SiteFooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export interface SiteFooterProps {
  className?: string
  /** Link columns. Three or four read best. */
  columns?: SiteFooterColumn[]
}

export const siteFooterColumns: SiteFooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/live/features" },
      { label: "Pricing", href: "/live/pricing" },
      { label: "Changelog", href: "/live/changelog" },
      { label: "Dashboard", href: "/live/app" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "CLI reference", href: "#" },
      { label: "API", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/live/about" },
      { label: "Blog", href: "/live/blog" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "/live/contact" },
    ],
  },
]

const legal = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
]

const footerLink =
  "rounded-xs text-sm text-copy outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"
const legalLink =
  "rounded-xs outline-none transition-colors duration-(--duration-fast) hover:text-foreground focus-visible:focus-ring"

/**
 * Site footer: wordmark and newsletter sign-up, link columns, and a bottom row
 * with legal links and system status.
 */
export function SiteFooter({ className, columns = siteFooterColumns }: SiteFooterProps) {
  return (
    <footer data-slot="site-footer" className={cn("@container border-t", className)}>
      <div className="container-page grid gap-14 py-section-sm @page:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] @page:gap-20">
        <div className="grid content-start gap-5">
          <Wordmark />
          <p className="max-w-80 text-copy">Release notes and product news, once a month. Unsubscribe any time.</p>
          <NewsletterForm className="mt-1" />
        </div>

        <nav
          aria-label="Footer"
          className={
            columns.length >= 4
              ? "grid grid-cols-2 gap-x-8 gap-y-10 @prose:grid-cols-4"
              : "grid grid-cols-2 gap-x-8 gap-y-10 @prose:grid-cols-3"
          }
        >
          {columns.map((column) => (
            <div key={column.title} className="grid content-start gap-4">
              <h2 className="text-label text-foreground">{column.title}</h2>
              <ul className="grid gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-4 py-6 text-caption text-muted-foreground @narrow:flex-row @narrow:items-center @narrow:justify-between">
          <p>© 2026 Lumen, Inc.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="#" className={cn("inline-flex w-fit items-center gap-2", legalLink)}>
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            All systems normal
          </Link>
        </div>
      </div>
    </footer>
  )
}
