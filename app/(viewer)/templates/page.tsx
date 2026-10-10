import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { sectionDescription, slugify, templateGroupDescriptions, templateKinds } from "@/components/viewer/nav"
import { TemplateCard } from "@/components/viewer/template-card"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { templates } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Templates",
  description: sectionDescription.templates,
}

export default function TemplatesPage() {
  return (
    <ViewerPage>
      <DocHeader
        section="Templates"
        title="Templates"
        description="Marketing, account and app pages for Acme Inc., a sample work-management SaaS. Each one is built from molecules and runs live, so what you see below is the real page."
      />
      <div className="grid gap-16 sm:gap-20">
        {templateKinds.map(({ kind, title }) => {
          const items = templates.filter((t) => t.kind === kind)
          if (!items.length) return null
          const id = slugify(title)
          return (
            <section key={kind} id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-24 gap-8">
              <div className="grid gap-2">
                <h2 id={`${id}-title`} className="text-h3">
                  {title}
                </h2>
                <p className="max-w-prose text-body text-copy">{templateGroupDescriptions[kind]}</p>
              </div>
              {/* Two columns. With an odd count, the first page leads across the
                  whole row, so no card is left on its own at the end. */}
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {items.map((template, index) => (
                  <TemplateCard
                    key={template.slug}
                    template={template}
                    featured={index === 0 && items.length % 2 === 1}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </ViewerPage>
  )
}
