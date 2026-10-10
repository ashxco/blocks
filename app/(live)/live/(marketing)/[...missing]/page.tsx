import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
}

/**
 * Catches every address under /live that no template matches and hands it to
 * the Acme 404 in app/(live)/live/not-found.tsx. Without it, unknown
 * addresses fall through to the design-system 404 at the app root.
 */
export default function MissingPage() {
  notFound()
}
