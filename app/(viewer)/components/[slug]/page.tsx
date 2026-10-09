import { notFound } from "next/navigation"

import { DocHeader } from "@/components/viewer/doc-header"
import { componentDocs } from "@/docs"
import { components } from "@/lib/registry"

export function generateStaticParams() {
  return components.map((e) => ({ slug: e.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = components.find((e) => e.slug === slug)
  const load = componentDocs[slug as keyof typeof componentDocs]
  if (!entry || !load) notFound()
  const { default: Docs } = await load()
  return (
    <article className="grid gap-12">
      <DocHeader section="Components" group={entry.group} title={entry.title} description={entry.description} />
      <Docs />
    </article>
  )
}
