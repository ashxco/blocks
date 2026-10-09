import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DocHeader } from "@/components/viewer/doc-header"
import { DocPager } from "@/components/viewer/doc-pager"
import { pagerFor, templateKinds } from "@/components/viewer/nav"
import { moleculesForTemplate } from "@/components/viewer/template-molecules"
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
  const { prev, next } = pagerFor(templates, slug, "/templates")
  const builtFrom = moleculesForTemplate(entry.href)

  return (
    <ViewerPage>
      <DocHeader section="Templates" group={group} title={entry.title} description={entry.description}>
        {builtFrom.length ? (
          // Phones: one line that scrolls sideways, so the preview stays near the top.
          <nav
            aria-labelledby="built-from"
            className="flex w-full min-w-0 items-center gap-2 max-sm:overflow-x-auto max-sm:pb-1 max-sm:[scrollbar-width:none] sm:flex-wrap"
          >
            <span id="built-from" className="mr-1 shrink-0 text-label whitespace-nowrap text-muted-foreground">
              Built from
            </span>
            <ul className="contents">
              {builtFrom.map((m) => (
                <li key={m.slug} className="shrink-0">
                  <Button variant="outline" size="xs" nativeButton={false} render={<Link href={`/molecules/${m.slug}`} />}>
                    {m.title}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </DocHeader>
      <TemplateViewer href={entry.href} title={entry.title} />
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
