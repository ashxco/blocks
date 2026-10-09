import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { EntryIndex } from "@/components/viewer/entry-index"
import { sectionDescription } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { componentDocs } from "@/docs"
import { renderDocsAsThumbnails } from "@/docs/kit"
import { componentGroups, components } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Components",
  description: sectionDescription.components,
}

export default async function ComponentsIndex() {
  // Each card previews the first example of the component's own docs.
  renderDocsAsThumbnails()
  const previews = Object.fromEntries(
    await Promise.all(
      components.map(async (entry) => {
        const load = componentDocs[entry.slug]
        if (!load) return [entry.slug, null] as const
        const { default: Docs } = await load()
        return [entry.slug, <Docs key={entry.slug} />] as const
      })
    )
  )

  return (
    <ViewerPage>
      <DocHeader
        section="Components"
        title="Components"
        description="Accessible primitives on Base UI, restyled from the ground up. Every colour, size and radius comes from a Blocks token."
      />
      <EntryIndex
        groups={componentGroups}
        entries={components}
        base="/components"
        previews={previews}
        viewport={{ full: 960, other: 480 }}
      />
    </ViewerPage>
  )
}
