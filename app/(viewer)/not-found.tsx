import type { Metadata } from "next"

import { NotFoundContent } from "@/components/viewer/not-found-content"
import { SearchTrigger } from "@/components/viewer/search-trigger"

/*
 * A page that calls notFound() only streams its own metadata, so the title
 * of the server HTML comes from here: without it, a missing component or
 * foundation is titled "Blocks" until the page hydrates.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "There is no page at this address. Search Blocks, or go back to the overview.",
}

/**
 * 404 for a missing foundation or component. It keeps the viewer's sidebar
 * and offers search.
 */
export default function ViewerNotFound() {
  return (
    <div className="grid min-h-[60dvh] content-center">
      <NotFoundContent size="page" actions={<SearchTrigger />} />
    </div>
  )
}
