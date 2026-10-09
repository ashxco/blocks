import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocHeader } from "@/components/viewer/doc-header"
import { DocPager } from "@/components/viewer/doc-pager"
import { pagerFor, templateKinds } from "@/components/viewer/nav"
import { TemplateViewer } from "@/components/viewer/template-viewer"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { templates } from "@/lib/registry"

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = templates.find((t) => t.slug === slug)
  return entry ? { title: `${entry.title} template`, description: entry.description } : {}
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = templates.find((t) => t.slug === slug)
  if (!entry) notFound()
  const group = templateKinds.find((k) => k.kind === entry.kind)?.title ?? entry.group
  const { prev, next } = pagerFor(
    templates.map((t) => ({ ...t, group: templateKinds.find((k) => k.kind === t.kind)?.title ?? t.group })),
    slug,
    "/templates"
  )
  return (
    <ViewerPage>
      <DocHeader section="Templates" group={group} title={entry.title} description={entry.description} />
      <TemplateViewer href={entry.href} title={entry.title} />
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
