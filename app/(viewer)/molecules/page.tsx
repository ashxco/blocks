import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { EntryIndex } from "@/components/viewer/entry-index"
import { sectionDescription } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { moleculeGroups, molecules } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Molecules",
  description: sectionDescription.molecules,
}

export default function MoleculesIndex() {
  return (
    <ViewerPage>
      <DocHeader
        section="Molecules"
        title="Molecules"
        description={`${molecules.length} sections and app patterns, composed only from components and tokens. Each one renders a complete example with no props.`}
      />
      <EntryIndex groups={moleculeGroups} entries={molecules} base="/molecules" />
    </ViewerPage>
  )
}
