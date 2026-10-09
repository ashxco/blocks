import { notFound } from "next/navigation"

import { DocHeader } from "@/components/viewer/doc-header"
import { moleculeDocs } from "@/docs"
import { molecules } from "@/lib/registry"

export function generateStaticParams() {
  return molecules.map((e) => ({ slug: e.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = molecules.find((e) => e.slug === slug)
  const load = moleculeDocs[slug as keyof typeof moleculeDocs]
  if (!entry || !load) notFound()
  const { default: Docs } = await load()
  return (
    <article className="grid gap-12">
      <DocHeader section="Molecules" group={entry.group} title={entry.title} description={entry.description} />
      <Docs />
    </article>
  )
}
