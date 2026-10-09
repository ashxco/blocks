import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocHeader } from "@/components/viewer/doc-header"
import { DocPager } from "@/components/viewer/doc-pager"
import { pagerFor } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { moleculeDocs } from "@/docs"
import { molecules } from "@/lib/registry"

export function generateStaticParams() {
  return molecules.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = molecules.find((e) => e.slug === slug)
  return entry ? { title: entry.title, description: entry.description } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = molecules.find((e) => e.slug === slug)
  const load = moleculeDocs[slug as keyof typeof moleculeDocs]
  if (!entry || !load) notFound()
  const { default: Docs } = await load()
  const { prev, next } = pagerFor(molecules, slug, "/molecules")
  return (
    <ViewerPage>
      <article className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-14 sm:gap-16">
        <DocHeader section="Molecules" group={entry.group} title={entry.title} description={entry.description} />
        <Docs />
      </article>
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
