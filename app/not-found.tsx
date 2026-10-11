import type { Metadata } from "next"

import { NotFoundContent } from "@/components/viewer/not-found-content"
import { SearchTrigger } from "@/components/viewer/search-trigger"
import { ViewerShell } from "@/components/viewer/viewer-shell"

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "There is no page at this address. Search Blocks, go back to the overview or browse the components.",
}

/**
 * Global 404, for any address outside the viewer. It keeps the viewer's
 * sidebar (sections, search, Theme and Appearance) so the visitor can recover
 * from here.
 */
export default function NotFound() {
  return (
    <ViewerShell>
      <div className="container-wide flex min-h-dvh flex-col justify-center py-section">
        <NotFoundContent actions={<SearchTrigger />} />
      </div>
    </ViewerShell>
  )
}
