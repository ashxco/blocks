import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocHeader } from "@/components/viewer/doc-header"
import { DocPager } from "@/components/viewer/doc-pager"
import { pagerFor } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { componentDocs } from "@/docs"
import { components } from "@/lib/registry"

export function generateStaticParams() {
  return components.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = components.find((e) => e.slug === slug)
  return entry ? { title: entry.title, description: entry.description } : { title: "Page not found" }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = components.find((e) => e.slug === slug)
  const load = componentDocs[slug as keyof typeof componentDocs]
  if (!entry || !load) notFound()
  const { default: Docs } = await load()
  const { prev, next } = pagerFor(components, slug, "/components")
  return (
    <ViewerPage>
      <article className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-14 sm:gap-16">
        <DocHeader section="Components" group={entry.group} title={entry.title} description={entry.description} />
        <Docs />
      </article>
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
