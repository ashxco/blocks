import { NotFoundContent } from "@/components/viewer/not-found-content"
import { SearchTrigger } from "@/components/viewer/search-trigger"

/**
 * 404 for a missing foundation, component, molecule or template. It keeps the
 * viewer's header and sidebar, and offers search, which lives in the header.
 */
export default function ViewerNotFound() {
  return (
    <div className="grid min-h-[60dvh] content-center">
      <NotFoundContent size="page" actions={<SearchTrigger />} />
    </div>
  )
}
