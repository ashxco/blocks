"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { HeroProductMoment } from "@/components/blocks/hero"
import { LogoCloud } from "@/components/blocks/logo-cloud"
import { SiteHeader } from "@/components/blocks/site-header"
import { Kern } from "@/components/ui/kern"

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
    <div className="container-page grid gap-12 pt-16 pb-24">
      <div className="grid max-w-narrow gap-6">
        <p className={compact ? "text-h2 text-balance text-foreground" : "text-display text-balance text-foreground"}>
          <Kern>
            Push code. Get a <span className="text-brand">live URL</span>.
          </Kern>
        </p>
        <p className="max-w-prose text-lead text-copy">
          Lumen builds every commit, gives every branch a preview and ships main to production, on our cloud or on
          servers you own.
        </p>
      </div>
      <HeroProductMoment />
      <LogoCloud contained={false} />
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
        description="When the bar is narrower than 64rem, the links fold into a menu button and the primary button stays beside it. The two lines morph into a cross and open a full-screen menu with large links; Escape closes it and the page behind stops scrolling. Left: closed. Right: open."
        code={`// Under 64rem the bar shows the wordmark, the primary button and the menu button.
<SiteHeader />

// Open from the start, for documentation and screenshots.
<SiteHeader defaultOpen />`}
      >
        <div className="flex flex-wrap justify-center gap-6 px-4 py-10">
          <Frame className="relative h-192 w-full max-w-96 overflow-hidden rounded-(--panel-radius) border bg-background contain-layout">
            <SiteHeader />
            <PageBody compact />
          </Frame>
          <Frame className="relative h-192 w-full max-w-96 overflow-hidden rounded-(--panel-radius) border bg-background contain-layout">
            <SiteHeader defaultOpen />
            <PageBody compact />
          </Frame>
        </div>
      </Example>

      <Example
        title="Solid"
        layout="full"
        description="Start in the glass state when the header sits over busy content from the first pixel. The hairline and frosted fill are there before any scroll. Scroll inside the preview."
        code={`<SiteHeader solid />`}
      >
        <Frame className="relative h-96 contain-layout">
          <SiteHeader solid />
          <PageBody compact />
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
        <Frame className="relative h-96 contain-layout">
          <SiteHeader
            links={[
              { label: "Product", href: "/live/features" },
              { label: "Pricing", href: "/live/pricing" },
              { label: "Customers", href: "/live/blog" },
            ]}
          />
          <PageBody compact />
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
          { prop: "ctaLabel", type: "string", default: '"Start free trial"', description: "Primary button label, in the bar and the mobile menu. Match the hero and closing call to action." },
          { prop: "defaultOpen", type: "boolean", default: "false", description: "Render with the menu open. For docs and screenshots; it applies while the bar is under 64rem." },
          { prop: "className", type: "string", description: "Classes for the <header> element." },
        ]}
      />
    </Examples>
  )
}
