import type { Metadata } from "next"

import MarketingLayout from "./(marketing)/layout"
import { NotFoundPanel } from "./(marketing)/error-404/_components/not-found-panel"

/*
 * A page that calls notFound() only streams its own metadata, so the title
 * of the server HTML comes from here.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "There is no page at this address on acme.com. Head back home, or contact support.",
  robots: { index: false },
}

/**
 * The Acme 404 for any address under /live that matches no template, such as
 * /live/nope. It renders above the marketing layout, so it brings the site
 * header and footer with it, around the same panel as the 404 template.
 */
export default function LiveNotFound() {
  return (
    <MarketingLayout>
      <NotFoundPanel className="pt-section-sm pb-section" />
    </MarketingLayout>
  )
}
