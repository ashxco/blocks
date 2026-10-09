import { notFound } from "next/navigation"

import { componentDocs } from "@/docs"
import { components } from "@/lib/registry"

export function generateStaticParams() {
  return components.map((e) => ({ slug: e.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = components.find((e) => e.slug === slug)
  const load = componentDocs[slug]
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
