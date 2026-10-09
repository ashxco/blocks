import { notFound } from "next/navigation"

import { moleculeDocs } from "@/docs"
import { molecules } from "@/lib/registry"

export function generateStaticParams() {
  return molecules.map((e) => ({ slug: e.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = molecules.find((e) => e.slug === slug)
  const load = moleculeDocs[slug]
  if (!entry || !load) notFound()
  const { default: Docs } = await load()
  return (
    <article className="grid gap-12">
      <header className="grid gap-3">
        <h1 className="text-h1">{entry.title}</h1>
        <p className="text-lead">{entry.description}</p>
      </header>
      <Docs />
    </article>
  )
}
