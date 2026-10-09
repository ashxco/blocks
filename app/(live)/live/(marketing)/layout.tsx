import { SiteFooter } from "@/components/blocks/site-footer"
import { SiteHeader } from "@/components/blocks/site-header"

/**
 * Shared frame for every Lumen marketing template: the site header, the page
 * and the site footer. overflow-x-clip keeps wide visuals from causing a
 * horizontal scroll on phones without breaking the sticky header.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-background">
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-5 py-2.5 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-toast)"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
