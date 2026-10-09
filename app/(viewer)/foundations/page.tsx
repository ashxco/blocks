import type { Metadata } from "next"

import { DocPager } from "@/components/viewer/doc-pager"
import { FoundationsOverview } from "@/components/viewer/foundations/overview"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { foundations } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Foundations",
  description: "Colour, type, space, shape, motion, icons and every token behind the Blocks design system.",
}

export default function Page() {
  /* Like every sub-page, the overview ends on a pager: on to the first foundation. */
  const first = foundations[0]
  return (
    <ViewerPage>
      <FoundationsOverview />
      {first ? (
        <DocPager next={{ title: first.title, href: `/foundations/${first.slug}`, group: first.group }} />
      ) : null}
    </ViewerPage>
  )
}
