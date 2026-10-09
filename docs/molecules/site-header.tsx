"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { SiteHeader } from "@/components/blocks/site-header"

/**
 * A scrolling preview window. contain-layout keeps the header's full-screen
 * menu inside the frame instead of covering the docs page.
 */
function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  )
}

function PageBody({ compact = false }: { compact?: boolean }) {
  return (
    <div className="container-page grid gap-10 pt-16 pb-24">
      <div className="grid max-w-narrow gap-6">
        <p className={compact ? "text-h2 text-balance text-foreground" : "text-display text-balance text-foreground"}>
          Push code. Get a <span className="text-brand">live URL.</span>
        </p>
        <p className="max-w-prose text-lead text-copy">
          Lumen builds every commit, gives every branch a preview and ships main to production. Scroll this preview to
          watch the header turn to glass.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-40 rounded-(--card-radius) bg-tint-violet" />
        <div className="h-40 rounded-(--card-radius) bg-tint-sky" />
        <div className="h-40 rounded-(--card-radius) bg-tint-mint" />
      </div>
      <div className="h-64 rounded-(--panel-radius) bg-panel" />
      <div className="h-48 rounded-(--card-radius) bg-subtle" />
    </div>
  )
}

export default function SiteHeaderDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Transparent at the top so the page runs edge to edge. After a few pixels of scroll it becomes frosted glass with a hairline. Scroll inside the preview."
        code={`// app/(marketing)/layout.tsx
<SiteHeader />
<main>{children}</main>
<SiteFooter />`}
      >
        <Frame className="relative h-120 contain-layout">
          <SiteHeader />
          <PageBody />
        </Frame>
      </Example>

      <Example
        title="Mobile menu"
        layout="full"
        surface="subtle"
        description="Below lg the links fold into a menu button. Its two lines morph into a cross and open a full-screen menu with large links; Escape closes it and the page behind stops scrolling."
      >
        <div className="flex justify-center px-4 py-10">
          <Frame className="relative h-180 w-full max-w-96 overflow-hidden rounded-(--panel-radius) border bg-background contain-layout">
            <SiteHeader />
            <PageBody compact />
          </Frame>
        </div>
      </Example>

      <Example
        title="Solid"
        layout="full"
        surface="subtle"
        description="Start in the glass state when the header sits over busy content from the first pixel."
        code={`<SiteHeader solid />`}
      >
        <Frame className="relative h-40 contain-layout">
          <SiteHeader solid />
        </Frame>
      </Example>

      <Example
        title="Custom links"
        layout="full"
        description="Pass your own centre links. The active link is found from the current path."
        code={`<SiteHeader
  links={[
    { label: "Product", href: "/live/features" },
    { label: "Pricing", href: "/live/pricing" },
    { label: "Customers", href: "/live/blog" },
  ]}
/>`}
      >
        <Frame className="relative h-40 contain-layout">
          <SiteHeader
            links={[
              { label: "Product", href: "/live/features" },
              { label: "Pricing", href: "/live/pricing" },
              { label: "Customers", href: "/live/blog" },
            ]}
          />
        </Frame>
      </Example>

      <Guidelines
        do={[
          "Keep five to seven links, each one word if you can.",
          "Let the first section of the page start right under the header so it reads as one surface.",
          "Keep one primary button on the right: the action most visitors should take.",
        ]}
        dont={[
          "Don’t add a background or border to the header at the top of the page.",
          "Don’t put dropdown menus or badges in the bar; link to pages instead.",
          "Don’t use brand colour for the active link on desktop; the ink underline marks it.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "links", type: "{ label: string; href: string }[]", default: "Features … Contact", description: "Centre links. The active one is matched against usePathname()." },
          { prop: "solid", type: "boolean", default: "false", description: "Start in the frosted state instead of waiting for scroll." },
          { prop: "className", type: "string", description: "Classes for the <header> element." },
        ]}
      />
    </Examples>
  )
}
