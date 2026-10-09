import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { EntryIndex } from "@/components/viewer/entry-index"
import { sectionDescription } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { moleculeDocs } from "@/docs"
import { renderDocsAsThumbnails } from "@/docs/kit"
import { moleculeGroups, molecules } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Molecules",
  description: sectionDescription.molecules,
}

export default async function MoleculesIndex() {
  // Each card previews the first example of the molecule's own docs.
  renderDocsAsThumbnails()
  const previews = Object.fromEntries(
    await Promise.all(
      molecules.map(async (entry) => {
        const load = moleculeDocs[entry.slug]
        if (!load) return [entry.slug, null] as const
        const { default: Docs } = await load()
        return [entry.slug, <Docs key={entry.slug} />] as const
      })
    )
  )

  return (
    <ViewerPage>
      <DocHeader
        section="Molecules"
        title="Molecules"
        description="Sections and app patterns, composed only from components and tokens. Each one renders a complete example with no props."
      />
      <EntryIndex
        groups={moleculeGroups}
        entries={molecules}
        base="/molecules"
        previews={previews}
        aspect="aspect-[8/5]"
      />
    </ViewerPage>
  )
}
