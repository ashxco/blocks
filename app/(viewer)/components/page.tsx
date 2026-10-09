import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { EntryIndex } from "@/components/viewer/entry-index"
import { sectionDescription } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { componentGroups, components } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Components",
  description: sectionDescription.components,
}

export default function ComponentsIndex() {
  return (
    <ViewerPage>
      <DocHeader
        section="Components"
        title="Components"
        description={`${components.length} accessible primitives on Base UI, restyled from the ground up. Every colour, size and radius comes from a Blocks token.`}
      />
      <EntryIndex groups={componentGroups} entries={components} base="/components" />
    </ViewerPage>
  )
}
